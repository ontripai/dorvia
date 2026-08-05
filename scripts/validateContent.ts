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
    'family-arrival',
    'eu-citizen-arrival',
    'short-stay-visitor'
  ]
};

function extractGuideData(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  let errors: string[] = [];

  // 1. Check required top-level fields
  const requiredKeys = ['canonicalRoute', 'locale', 'title', 'mainQuestion', 'quickAnswer', 'lastReviewed', 'nextReview', 'contentStatus', 'factCheckStatus', 'officialSources', 'situations'];
  requiredKeys.forEach(key => {
    if (!content.includes(key + ':')) {
      errors.push(`Missing required field: ${key}`);
    }
  });

  // 2. Canonical route in registry
  // (Moved to section 5 for scenario mapping)

  // 3. No UNRESOLVED claims without a warning
  if (content.includes('UNRESOLVED') && !content.includes('warnings: [')) {
    if (!content.includes('warnings: [\'') && !content.includes('warnings: ["')) {
       errors.push('UNRESOLVED claim found without a visible warning array');
    }
  }

  // 4. Duplicate sources and claim IDs
  const officialSourcesBlock = content.split('officialSources: [')[1]?.split('],')[0] || '';
  const sourceMatches = officialSourcesBlock.match(/id:\s*['"]([^'"]+)['"]/g);
  let sourceIds: string[] = [];
  if (sourceMatches) {
    sourceIds = sourceMatches.map(m => (m.match(/['"]([^'"]+)['"]/) as RegExpMatchArray)[1]);
    const duplicates = sourceIds.filter((item, index) => sourceIds.indexOf(item) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate source IDs found in officialSources: ${duplicates.join(', ')}`);
    }
  }

  const claimMatches = content.match(/claimId:\s*['"]([^'"]+)['"]/g);
  if (claimMatches) {
    const claimIds = claimMatches.map(m => (m.match(/['"]([^'"]+)['"]/) as RegExpMatchArray)[1]);
    const duplicates = claimIds.filter((item, index) => claimIds.indexOf(item) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate claim IDs found: ${duplicates.join(', ')}`);
    }
  }

  // 4b. Status check for material claims (steps)
  const stepBlocks = content.split('steps: [').slice(1).map(b => b.split(']')[0]);
  stepBlocks.forEach((stepBlock, bIdx) => {
    const individualSteps = stepBlock.split('},').map(s => s + '}');
    individualSteps.forEach((stepStr, idx) => {
      // If it looks like a step with a title and description
      if (stepStr.includes('title:') && stepStr.includes('description:')) {
         if (!stepStr.includes('status:')) {
           errors.push(`Step missing status reference in block index ${bIdx}-${idx}`);
         }
         if (content.includes("contentStatus: 'published'") || content.includes('contentStatus: "published"')) {
            if (stepStr.includes('OWNER_REVIEW_REQUIRED') || stepStr.includes('PROFESSIONAL_REVIEW_REQUIRED')) {
               errors.push(`Published guide contains unresolved claim in block index ${bIdx}-${idx}`);
            }
         }
      }
    });
  });

  // 5. Scenario IDs
  const routeMatch = content.match(/canonicalRoute:\s*['"]([^'"]+)['"]/);
  let route = '';
  if (routeMatch) {
    route = routeMatch[1];
    if (!routeRegistryContent.includes(`"${route}"`) && !routeRegistryContent.includes(`'${route}'`)) {
      errors.push(`Canonical route "${route}" is not registered in ROUTE_REGISTRY`);
    }
  }

  let foundScenarios = 0;
  const reqScenarios = REQUIRED_SCENARIOS[route] || [];
  for (const reqId of reqScenarios) {
    if (!content.includes(`id: '${reqId}'`) && !content.includes(`id: "${reqId}"`)) {
      errors.push(`Missing required scenario ID: ${reqId}`);
    } else {
      foundScenarios++;
    }
  }

  // 6. Medical rules
  const exchangeMatch = content.match(/id:\s*['"]foreign-licence-exchange['"][\s\S]*?(?=id:\s*['"]|$)/);
  if (exchangeMatch && exchangeMatch[0]) {
    const exchangeBlock = exchangeMatch[0];
    if (exchangeBlock.includes(`requiresMedical: 'not-required'`)) {
      errors.push(`Foreign exchange marked medical not-required without qualification`);
    }
    if (exchangeBlock.includes(`requiresMedical: 'conditional'`) && !exchangeBlock.includes('medicalConditionText:')) {
      errors.push(`Foreign exchange marked medical conditional without medicalConditionText`);
    }
  }

  // 7. IDP Rules
  const idpMatch = content.match(/id:\s*['"]international-driving-permit['"][\s\S]*?(?=id:\s*['"]|$)/);
  if (idpMatch && idpMatch[0]) {
    const idpBlock = idpMatch[0];
    if (!idpBlock.includes('sourceId:')) {
      errors.push(`IDP scenario missing a dedicated source`);
    }
    // check fees and timeline in IDP block
    const idpFees = idpBlock.split('fees: [')[1]?.split(']')[0] || '';
    if (idpFees.includes('isFixed: true') && !idpFees.includes('sourceId:')) {
      errors.push(`IDP fixed fee without source`);
    }
    const idpTimeline = idpBlock.split('timeline: [')[1]?.split(']')[0] || '';
    if (idpTimeline.includes('isFixed: true') || (!idpTimeline.includes('isGuaranteed: true') && idpTimeline.includes('duration:'))) {
        // "IDP fixed deadline without source"
        if (idpTimeline.includes('duration:') && !idpTimeline.includes('sourceId:')) {
            errors.push(`IDP fixed deadline without source`);
        }
    }
  }

  // Fixed fees and timelines must have a sourceId.
  const feeBlocks = content.split('fees: [').slice(1).map(b => b.split(']')[0]);
  feeBlocks.forEach((feeBlock, bIdx) => {
    const individualFees = feeBlock.split('},').map(s => s + '}');
    individualFees.forEach((feeStr, idx) => {
      if (feeStr.includes('isFixed: true') && !feeStr.includes('sourceId:')) {
        errors.push(`Fixed fee entry missing sourceId reference in block index ${bIdx}-${idx}`);
      }
    });
  });
  
  const timelineBlocks = content.split('timeline: [').slice(1).map(b => b.split(']')[0]);
  timelineBlocks.forEach((tBlock, bIdx) => {
    const individualTimelines = tBlock.split('},').map(s => s + '}');
    individualTimelines.forEach((tStr, idx) => {
      if (tStr.includes('isFixed: true') && !tStr.includes('sourceId:')) {
         errors.push(`Fixed timeline entry missing sourceId reference in block index ${bIdx}-${idx}`);
      }
    });
  });

  return errors;
}

const guidesDir = path.join(cwd, 'src/content/guides');
let hasErrors = false;

// We will also check cross-locale parity for FA and EN.
function checkParity(file: string, enContent: string, faContent: string) {
    const errors: string[] = [];
    
    // Generic Scenario ID Parity
    const getScenarioIds = (content: string) => {
        const matches = content.match(/id:\s*['"]([^'"]+)['"]/g);
        if (!matches) return [];
        // Filtering heuristic to get situations IDs (first one is often locale or guide id, but let's just compare all IDs).
        // Actually, just compare all IDs directly to ensure perfect parity.
        return matches.map(m => (m.match(/['"]([^'"]+)['"]/) as RegExpMatchArray)[1]).sort();
    };
    
    const enIds = getScenarioIds(enContent);
    const faIds = getScenarioIds(faContent);
    
    if (JSON.stringify(enIds) !== JSON.stringify(faIds)) {
        errors.push(`FA/EN scenario/source ID parity mismatch`);
    }

    if (file === 'driving-license') {
      const enExchangeMatch = enContent.match(/id:\s*['"]foreign-licence-exchange['"][\s\S]*?(?=id:\s*['"]|$)/)?.[0] || '';
      const faExchangeMatch = faContent.match(/id:\s*['"]foreign-licence-exchange['"][\s\S]*?(?=id:\s*['"]|$)/)?.[0] || '';
      
      const enMedical = enExchangeMatch.match(/requiresMedical:\s*['"]([^'"]+)['"]/)?.[1];
      const faMedical = faExchangeMatch.match(/requiresMedical:\s*['"]([^'"]+)['"]/)?.[1];
      if (enMedical && faMedical && enMedical !== faMedical) {
          errors.push(`FA/EN medical-condition mismatch: EN=${enMedical}, FA=${faMedical}`);
      }

      const enIdpMatch = enContent.match(/id:\s*['"]international-driving-permit['"][\s\S]*?(?=id:\s*['"]|$)/)?.[0] || '';
      const faIdpMatch = faContent.match(/id:\s*['"]international-driving-permit['"][\s\S]*?(?=id:\s*['"]|$)/)?.[0] || '';
      const enIdpSources = enIdpMatch.match(/sourceId:\s*['"]([^'"]+)['"]/g)?.join(',') || '';
      const faIdpSources = faIdpMatch.match(/sourceId:\s*['"]([^'"]+)['"]/g)?.join(',') || '';
      if (enIdpSources !== faIdpSources) {
          errors.push(`FA/EN IDP source mismatch: EN=${enIdpSources}, FA=${faIdpSources}`);
      }
    }
    
    return errors;
}

function scanDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
      // For guides check parity
      if (file === 'driving-license' || file === 'first-days-checklist') {
          const enPath = path.join(fullPath, 'en.ts');
          const faPath = path.join(fullPath, 'fa.ts');
          if (fs.existsSync(enPath) && fs.existsSync(faPath)) {
              const pErrors = checkParity(file, fs.readFileSync(enPath, 'utf8'), fs.readFileSync(faPath, 'utf8'));
              if (pErrors.length > 0) {
                  console.error(`❌ Cross-locale Parity Errors in ${file}:`);
                  pErrors.forEach(e => console.error(`  - ${e}`));
                  hasErrors = true;
              }
          }
      }
    } else if (fullPath.endsWith('.ts')) {
      console.log(`Validating ${fullPath}...`);
      const errors = extractGuideData(fullPath);
      if (errors.length > 0) {
        console.error(`❌ Errors in ${file}:`);
        errors.forEach(e => console.error(`  - ${e}`));
        hasErrors = true;
      } else {
        console.log(`✅ ${file} is valid.`);
      }
    }
  }
}


// ROUTE VALIDATION
const nextConfig = require('../next.config.js');
const { ROUTE_REGISTRY } = require('../src/lib/routeRegistry');

async function validateRoutes() {
  let routeErrors: string[] = [];
  const redirects = await nextConfig.redirects();
  
  const canonicalRoutes = Object.values(ROUTE_REGISTRY).map((r: any) => r.canonical);
  const sitemapRoutes = Object.values(ROUTE_REGISTRY).filter((r: any) => r.inSitemap).map((r: any) => r.canonical);
  
  // - A canonical Registry route returns a redirect
  redirects.forEach((r: any) => {
    if (canonicalRoutes.includes(r.source)) {
      routeErrors.push(`Canonical route ${r.source} returns a redirect`);
    }
    // - A redirect source is included in Sitemap
    if (sitemapRoutes.includes(r.source)) {
      routeErrors.push(`Redirect source ${r.source} is included in Sitemap`);
    }
    // - A physical canonical destination is absent from Registry
    if (!canonicalRoutes.includes(r.destination) && r.destination.startsWith('/')) {
        if (!canonicalRoutes.includes(r.destination)) {
          routeErrors.push(`Physical canonical destination ${r.destination} is absent from Registry`);
        }
    }
  });

  // - A legal page canonical contains a Vercel Preview hostname
  const legalPagePath = path.join(cwd, 'src/app/legal/[slug]/page.tsx');
  if (fs.existsSync(legalPagePath)) {
    const legalContent = fs.readFileSync(legalPagePath, 'utf8');
    if (legalContent.includes('.vercel.app')) {
      routeErrors.push('A legal page canonical contains a Vercel Preview hostname');
    }
  }

  // - /romania/cities is missing
  if (!canonicalRoutes.includes('/romania/cities')) {
    routeErrors.push('/romania/cities is missing from Registry');
  }

  // - /legal is present as canonical
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
  scanDir(guidesDir);

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
