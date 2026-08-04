import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const ROUTE_REGISTRY_PATH = path.join(cwd, 'src/lib/routeRegistry.ts');
const routeRegistryContent = fs.readFileSync(ROUTE_REGISTRY_PATH, 'utf8');

function validateGuide(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  let errors: string[] = [];

  // Check structure loosely via regex
  const requiredKeys = ['canonicalRoute', 'locale', 'title', 'mainQuestion', 'quickAnswer', 'lastReviewed', 'nextReview', 'contentStatus', 'factCheckStatus', 'officialSources'];
  
  requiredKeys.forEach(key => {
    if (!content.includes(key + ':')) {
      errors.push(`Missing required field: ${key}`);
    }
  });

  // Verify canonicalRoute exists in ROUTE_REGISTRY
  const routeMatch = content.match(/canonicalRoute:\s*['"]([^'"]+)['"]/);
  if (routeMatch) {
    const route = routeMatch[1];
    if (!routeRegistryContent.includes(`"${route}"`) && !routeRegistryContent.includes(`'${route}'`)) {
      errors.push(`Canonical route "${route}" is not registered in ROUTE_REGISTRY`);
    }
  }

  // Check for duplicate source IDs
  const sourceMatches = content.match(/id:\s*['"]([^'"]+)['"]/g);
  if (sourceMatches) {
    const ids = sourceMatches.map(m => m.match(/['"]([^'"]+)['"]/)?.[1]);
    const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate source IDs found: ${duplicates.join(', ')}`);
    }
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
      const errors = validateGuide(fullPath);
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
