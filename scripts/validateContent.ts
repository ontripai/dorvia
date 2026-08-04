import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const ROUTE_REGISTRY_PATH = path.join(cwd, 'src/lib/routeRegistry.ts');
const routeRegistryContent = fs.readFileSync(ROUTE_REGISTRY_PATH, 'utf8');

const requiredScenarioIds = [
  'temporary-foreign-licence-use',
  'foreign-licence-exchange',
  'iranian-issued-licence',
  'obtain-romanian-licence-from-scratch',
  'renew-romanian-licence',
  'international-driving-permit',
  'penalties-suspension-and-restrictions'
];

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
  const routeMatch = content.match(/canonicalRoute:\s*['"]([^'"]+)['"]/);
  if (routeMatch) {
    const route = routeMatch[1];
    if (!routeRegistryContent.includes(`"${route}"`) && !routeRegistryContent.includes(`'${route}'`)) {
      errors.push(`Canonical route "${route}" is not registered in ROUTE_REGISTRY`);
    }
  }

  // 3. No UNRESOLVED claims without a warning
  if (content.includes('UNRESOLVED') && !content.includes('warnings: [')) {
    if (!content.includes('warnings: [\'') && !content.includes('warnings: ["')) {
       errors.push('UNRESOLVED claim found without a visible warning array');
    }
  }

  // 4. Duplicate sources
  const sourceMatches = content.match(/id:\s*['"]([^'"]+)['"]/g);
  let sourceIds: string[] = [];
  if (sourceMatches) {
    sourceIds = sourceMatches.map(m => (m.match(/['"]([^'"]+)['"]/) as RegExpMatchArray)[1]);
    const duplicates = sourceIds.filter((item, index) => sourceIds.indexOf(item) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate source IDs found: ${duplicates.join(', ')}`);
    }
  }

  // 5. Scenario IDs
  let foundScenarios = 0;
  for (const reqId of requiredScenarioIds) {
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
function checkParity(enContent: string, faContent: string) {
    const errors: string[] = [];
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
    
    return errors;
}

function scanDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
      // For driving-license check parity
      if (file === 'driving-license') {
          const enPath = path.join(fullPath, 'en.ts');
          const faPath = path.join(fullPath, 'fa.ts');
          if (fs.existsSync(enPath) && fs.existsSync(faPath)) {
              const pErrors = checkParity(fs.readFileSync(enPath, 'utf8'), fs.readFileSync(faPath, 'utf8'));
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

console.log('Running Content Validation...');
scanDir(guidesDir);

if (hasErrors) {
  process.exit(1);
} else {
  console.log('All content validated successfully.');
}
