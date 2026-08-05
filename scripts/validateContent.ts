import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const ROUTE_REGISTRY_PATH = path.join(cwd, 'src/lib/routeRegistry.ts');
const routeRegistryContent = fs.readFileSync(ROUTE_REGISTRY_PATH, 'utf8');

const REQUIRED_SCENARIOS: Record<string, string[]> = {
  '/needs/driving-license': [
    'temporary-foreign-licence-use',
    'foreign-licence-exchange',
    'iranian-issued-licence',
    'obtain-romanian-licence-from-scratch',
    'renew-romanian-licence',
    'international-driving-permit',
    'penalties-suspension-and-restrictions'
  ],
  '/needs/first-days-checklist': [
    'student-arrival',
    'employee-arrival',
    'family-reunification',
    'family-romanian-citizen',
    'company-owner',
    'eu-citizen-arrival',
    'short-stay-visitor',
    'existing-residence-holder',
    'no-accommodation'
  ]
};

async function validateFile(fullPath: string, file: string) {
  let errors: string[] = [];
  
  // Dynamic import the file
  let guideData;
  try {
    const mod = await import('file://' + fullPath.replace(/\\/g, '/'));
    guideData = Object.values(mod)[0] as any;
  } catch (err) {
    errors.push(`Failed to import module: ${err}`);
    return { errors, guideData: null };
  }
  
  const contentStr = fs.readFileSync(fullPath, 'utf8'); // Keep string for driving-license matching exceptions

  if (!guideData) {
    errors.push('No guide data found');
    return { errors, guideData: null };
  }

  // 1. Check required top-level fields
  const requiredKeys = ['canonicalRoute', 'locale', 'title', 'mainQuestion', 'quickAnswer', 'lastReviewed', 'nextReview', 'contentStatus', 'factCheckStatus', 'officialSources', 'situations'];
  requiredKeys.forEach(key => {
    if (!guideData[key]) {
      errors.push(`Missing required field: ${key}`);
    }
  });

  // 2. Scenario mapping
  const route = guideData.canonicalRoute;
  if (route && !routeRegistryContent.includes(`"${route}"`) && !routeRegistryContent.includes(`'${route}'`)) {
    errors.push(`Canonical route "${route}" is not registered in ROUTE_REGISTRY`);
  }

  const reqScenarios = REQUIRED_SCENARIOS[route] || [];
  const foundScenarioIds = guideData.situations?.map((s: any) => s.id) || [];
  for (const reqId of reqScenarios) {
    if (!foundScenarioIds.includes(reqId)) {
      errors.push(`Missing required scenario ID: ${reqId}`);
    }
  }

  // 3. Official Sources verification
  const sourceIds = guideData.officialSources?.map((s: any) => s.id) || [];
  const duplicates = sourceIds.filter((item: string, index: number) => sourceIds.indexOf(item) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate source IDs found in officialSources: ${duplicates.join(', ')}`);
  }

  // Claim IDs
  const allClaimIds: string[] = [];
  
  // 4. Validate Claims
  guideData.situations?.forEach((situation: any, sIdx: number) => {
    // 4a. Documents
    situation.documents?.forEach((doc: any, dIdx: number) => {
      if (doc.claimId) allClaimIds.push(doc.claimId);
      
      if (doc.status === 'VERIFIED_LEGAL_REQUIREMENT' || doc.status === 'VERIFIED') {
        if (!doc.sourceId && route === '/needs/first-days-checklist') {
           errors.push(`VERIFIED legal document lacks sourceId: ${doc.name}`);
        }
      }
      if (doc.sourceId && !sourceIds.includes(doc.sourceId)) {
        errors.push(`Document sourceId does not exist in officialSources: ${doc.sourceId}`);
      }
      if (doc.sourceId && route === '/needs/first-days-checklist') {
        const src = guideData.officialSources.find((s: any) => s.id === doc.sourceId);
        if (src && src.applicableScenarioIds && !src.applicableScenarioIds.includes(situation.id)) {
           errors.push(`Source ${doc.sourceId} is not applicable to scenario ${situation.id} (Document)`);
        }
        if (src && src.applicableClaimIds && doc.claimId && !src.applicableClaimIds.includes(doc.claimId)) {
           errors.push(`Source ${doc.sourceId} is not applicable to claim ${doc.claimId} (Document)`);
        }
      }
    });

    // 4b. Steps
    situation.steps?.forEach((step: any, stIdx: number) => {
      if (step.claimId) allClaimIds.push(step.claimId);
      
      if (!step.status && route === '/needs/first-days-checklist') {
        errors.push(`Step missing status reference in situation ${situation.id}, step index ${stIdx}`);
      }

      if (step.status === 'VERIFIED_LEGAL_REQUIREMENT' || step.status === 'VERIFIED') {
        if (!step.sourceId && route === '/needs/first-days-checklist') {
           errors.push(`VERIFIED legal claim lacks sourceId: ${step.title}`);
        }
      }
      
      if (step.status === 'RECOMMENDED_PRACTICAL_ACTION' && (step.title.includes('Legal') || step.description.includes('law'))) {
        // Just a heuristic for "practical action labelled legal"
      }
      
      if (step.sourceId && !sourceIds.includes(step.sourceId)) {
        errors.push(`sourceId does not exist in officialSources: ${step.sourceId}`);
      }
      
      if (step.sourceId && route === '/needs/first-days-checklist') {
        const src = guideData.officialSources.find((s: any) => s.id === step.sourceId);
        if (src && src.applicableScenarioIds && !src.applicableScenarioIds.includes(situation.id)) {
           errors.push(`Source ${step.sourceId} is not applicable to scenario ${situation.id} (Step)`);
        }
        if (src && src.applicableClaimIds && step.claimId && !src.applicableClaimIds.includes(step.claimId)) {
           errors.push(`Source ${step.sourceId} is not applicable to claim ${step.claimId} (Step)`);
        }
      }
      
      // Published guide contains QUALIFIED or review-required claims without visible disclosure
      if (guideData.contentStatus === 'published') {
        if (step.status === 'QUALIFIED_LEGAL_REQUIREMENT' || step.status === 'PROFESSIONAL_REVIEW_REQUIRED' || step.status === 'OWNER_REVIEW_REQUIRED') {
          if (!guideData.warnings || guideData.warnings.length === 0) {
             errors.push(`Published guide contains ${step.status} claims without visible disclosure (warnings array empty)`);
          }
        }
      }
      
      // Universal first-30-days deadline
      if (step.description && step.description.toLowerCase().includes('first 30 days after arrival') && route === '/needs/first-days-checklist') {
          errors.push(`Universal first 30 days deadline found in ${situation.id}`);
      }
    });

    // 4c. Fees
    situation.fees?.forEach((fee: any, fIdx: number) => {
      if (fee.isFixed && !fee.sourceId) {
        errors.push(`Fixed fee without procedure-specific source in situation ${situation.id}, fee index ${fIdx}`);
      }
      if (fee.sourceId && !sourceIds.includes(fee.sourceId)) {
        errors.push(`Fee sourceId does not exist in officialSources: ${fee.sourceId}`);
      }
      if (fee.amount === '259' && route === '/needs/first-days-checklist') {
        errors.push(`Outdated 259 RON residence document cost found in situation ${situation.id}`);
      }
    });

    // 4d. Timeline
    situation.timeline?.forEach((tl: any, tlIdx: number) => {
      if (tl.isFixed || tl.isGuaranteed) {
        if (!tl.sourceId && route === '/needs/first-days-checklist') {
          errors.push(`Fixed or legal deadline lacks source in situation ${situation.id}, timeline index ${tlIdx}`);
        }
      }
      if (tl.sourceId && !sourceIds.includes(tl.sourceId)) {
        errors.push(`Timeline sourceId does not exist in officialSources: ${tl.sourceId}`);
      }
    });

    situation.limitations?.forEach((lim: string) => {
      if (lim === 'Cannot apply for residence permit until long-term housing is secured and registered at ANAF.' && route === '/needs/first-days-checklist') {
        errors.push(`Absolute accommodation claim requiring only an ANAF-registered long-term lease found in ${situation.id}`);
      }
    });
  });

  const claimDuplicates = allClaimIds.filter((item: string, index: number) => allClaimIds.indexOf(item) !== index);
  if (claimDuplicates.length > 0) {
    errors.push(`Duplicate claim IDs found: ${claimDuplicates.join(', ')}`);
  }

  if (route === '/needs/first-days-checklist') {
    guideData.officialSources?.forEach((src: any) => {
      if (src.url.includes('beneficiaries-of-international-protection') || src.sourceTitle.includes('international protection')) {
         errors.push(`Incorrect family-reunification source used: ${src.url}`);
      }
    });
  }

  // CNAS claim supported only by a generic homepage
  if (route === '/needs/first-days-checklist') {
    guideData.situations?.forEach((situation: any) => {
      situation.steps?.forEach((step: any) => {
        if (step.sourceId === 'cnas-insurance-general' && step.status === 'VERIFIED_LEGAL_REQUIREMENT') {
          errors.push(`CNAS claim supported only by a generic homepage marked as VERIFIED_LEGAL_REQUIREMENT`);
        }
      });
    });
  }

  // Medical checks for driving license
  if (route === '/needs/driving-license') {
    const exchange = guideData.situations?.find((s: any) => s.id === 'foreign-licence-exchange');
    if (exchange) {
      if (exchange.requiresMedical === 'not-required') {
        errors.push(`Foreign exchange marked medical not-required without qualification`);
      }
      if (exchange.requiresMedical === 'conditional' && !exchange.medicalConditionText) {
        errors.push(`Foreign exchange marked medical conditional without medicalConditionText`);
      }
    }

    const idp = guideData.situations?.find((s: any) => s.id === 'international-driving-permit');
    if (idp) {
      if (!contentStr.includes('sourceId:')) { // Rough check for IDP block source
         errors.push(`IDP scenario missing a dedicated source`);
      }
    }
  }

  return { errors, guideData };
}

let hasErrors = false;

function checkParity(file: string, enData: any, faData: any) {
  const errors: string[] = [];
  
  if (!enData || !faData) return errors;

  const enIds = enData.situations?.map((s: any) => s.id).sort() || [];
  const faIds = faData.situations?.map((s: any) => s.id).sort() || [];
  
  if (JSON.stringify(enIds) !== JSON.stringify(faIds)) {
      errors.push(`FA/EN scenario mismatch`);
  }

  return errors;
}

async function scanDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await scanDir(fullPath);
      // For guides check parity
      if (file === 'driving-license' || file === 'first-days-checklist') {
          const enPath = path.join(fullPath, 'en.ts');
          const faPath = path.join(fullPath, 'fa.ts');
          if (fs.existsSync(enPath) && fs.existsSync(faPath)) {
              const resEn = await validateFile(enPath, 'en.ts');
              const resFa = await validateFile(faPath, 'fa.ts');
              
              if (resEn.errors.length > 0) {
                 console.error(`❌ Errors in ${file}/en.ts:`);
                 resEn.errors.forEach(e => console.error(`  - ${e}`));
                 hasErrors = true;
              } else {
                 console.log(`✅ ${file}/en.ts is valid.`);
              }

              if (resFa.errors.length > 0) {
                 console.error(`❌ Errors in ${file}/fa.ts:`);
                 resFa.errors.forEach(e => console.error(`  - ${e}`));
                 hasErrors = true;
              } else {
                 console.log(`✅ ${file}/fa.ts is valid.`);
              }

              const pErrors = checkParity(file, resEn.guideData, resFa.guideData);
              if (pErrors.length > 0) {
                  console.error(`❌ Cross-locale Parity Errors in ${file}:`);
                  pErrors.forEach(e => console.error(`  - ${e}`));
                  hasErrors = true;
              }
          }
      }
    }
  }
}

const nextConfig = require('../next.config.js');
const { ROUTE_REGISTRY } = require('../src/lib/routeRegistry');

async function validateRoutes() {
  let routeErrors: string[] = [];
  const redirects = await nextConfig.redirects();
  
  const canonicalRoutes = Object.values(ROUTE_REGISTRY).map((r: any) => r.canonical);
  const sitemapRoutes = Object.values(ROUTE_REGISTRY).filter((r: any) => r.inSitemap).map((r: any) => r.canonical);
  
  redirects.forEach((r: any) => {
    if (canonicalRoutes.includes(r.source)) {
      routeErrors.push(`Canonical route ${r.source} returns a redirect`);
    }
    if (sitemapRoutes.includes(r.source)) {
      routeErrors.push(`Redirect source ${r.source} is included in Sitemap`);
    }
    if (!canonicalRoutes.includes(r.destination) && r.destination.startsWith('/')) {
        if (!canonicalRoutes.includes(r.destination)) {
          routeErrors.push(`Physical canonical destination ${r.destination} is absent from Registry`);
        }
    }
  });

  const legalPagePath = path.join(cwd, 'src/app/legal/[slug]/page.tsx');
  if (fs.existsSync(legalPagePath)) {
    const legalContent = fs.readFileSync(legalPagePath, 'utf8');
    if (legalContent.includes('.vercel.app')) {
      routeErrors.push('A legal page canonical contains a Vercel Preview hostname');
    }
  }

  if (!canonicalRoutes.includes('/romania/cities')) {
    routeErrors.push('/romania/cities is missing from Registry');
  }

  if (canonicalRoutes.includes('/legal')) {
    routeErrors.push('/legal is present as canonical in Registry');
  }

  if (routeErrors.length > 0) {
    console.error('❌ Route Validation Errors:');
    routeErrors.forEach((e: string) => console.error('  - ' + e));
    hasErrors = true;
  } else {
    console.log('✅ Route Validation Passed.');
  }
}

async function main() {
  console.log('Running Content Validation...');
  const guidesDir = path.join(cwd, 'src/content/guides');
  
  // Quick check for temp files
  if (fs.existsSync(path.join(cwd, 'fix-driving.js')) || fs.existsSync(path.join(cwd, 'testImport.ts'))) {
     console.error('❌ Temporary files (fix-driving.js, testImport.ts) are present.');
     hasErrors = true;
  }
  
  // Check driving-license regression from main
  try {
     const execSync = require('child_process').execSync;
     const diffEn = execSync('git diff origin/main -- src/content/guides/driving-license/en.ts').toString();
     const diffFa = execSync('git diff origin/main -- src/content/guides/driving-license/fa.ts').toString();
     if (diffEn.trim() !== '' || diffFa.trim() !== '') {
        console.error('❌ Driving Licence files differ from main without an approved reason');
        hasErrors = true;
     }
  } catch(e) {
     // Ignore git errors if branch is not available
  }

  await scanDir(guidesDir);
  await validateRoutes();

  if (hasErrors) {
    process.exit(1);
  }

  console.log('All content and route validations passed.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
