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
  if (content.includes('UNRESOLVED') && !content.includes('warnings:')) {
    errors.push('UNRESOLVED claim found without a visible warning array');
  }

  // 4. Duplicate sources
  const sourceMatches = content.match(/id:\s*['"]([^'"]+)['"]/g);
  let sourceIds: string[] = [];
  if (sourceMatches) {
    sourceIds = sourceMatches.map(m => m.match(/['"]([^'"]+)['"]/)?.[1] as string);
    const duplicates = sourceIds.filter((item, index) => sourceIds.indexOf(item) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate source IDs found: ${duplicates.join(', ')}`);
    }
  }

  // 5. Scenario IDs
  const situationIdMatches = content.match(/id:\s*['"]([^'"]+)['"]/g);
  let situationIds: string[] = [];
  if (situationIdMatches) {
    // Note: some id's might be sources, but scenarios also have id.
    // Let's rely on a simpler parser or just extract all IDs that match our list.
  }
  
  // Since AST parsing is hard with regex, let's do targeted checks.
  // We expect EXACTLY 7 required scenario IDs
  let foundScenarios = 0;
  for (const reqId of requiredScenarioIds) {
    if (!content.includes(`id: '${reqId}'`) && !content.includes(`id: "${reqId}"`)) {
      errors.push(`Missing required scenario ID: ${reqId}`);
    } else {
      foundScenarios++;
    }
  }

  // Fixed fees and timelines must have a sourceId.
  // For each fee/timeline block, if isFixed: true, ensure sourceId exists.
  const isFixedTrueCount = (content.match(/isFixed:\s*true/g) || []).length;
  const sourceIdCountInFees = (content.match(/sourceId:\s*['"][^'"]+['"]/g) || []).length;
  // This is a naive check. A better approach is matching blocks.
  const feeBlocks = content.split('fees: [')[1]?.split(']')[0] || '';
  if (feeBlocks) {
    const individualFees = feeBlocks.split('},').map(s => s + '}');
    individualFees.forEach((feeStr, idx) => {
      if (feeStr.includes('isFixed: true') && !feeStr.includes('sourceId:')) {
        errors.push(`Fixed fee entry missing sourceId reference in block index ${idx}`);
      }
    });
  }
  
  const timelineBlocks = content.split('timeline: [')[1]?.split(']')[0] || '';
  if (timelineBlocks) {
    const individualTimelines = timelineBlocks.split('},').map(s => s + '}');
    individualTimelines.forEach((tStr, idx) => {
      if (tStr.includes('isFixed: true') && !tStr.includes('sourceId:')) {
         errors.push(`Fixed timeline entry missing sourceId reference in block index ${idx}`);
      }
    });
  }

  return errors;
}

const guidesDir = path.join(cwd, 'src/content/guides');
let hasErrors = false;

function scanDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
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
