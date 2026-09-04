import fs from 'fs';
import path from 'path';

const faPath = path.join(process.cwd(), 'src/lib/translations/fa.json');
const enPath = path.join(process.cwd(), 'src/lib/translations/en.json');

if (!fs.existsSync(faPath) || !fs.existsSync(enPath)) {
  console.error('❌ Error: fa.json or en.json is missing!');
  process.exit(1);
}

const fa = JSON.parse(fs.readFileSync(faPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

let errors: string[] = [];

function checkParity(faObj: any, enObj: any, currentPath: string = '') {
  if (typeof faObj !== typeof enObj) {
    errors.push(`Type mismatch at '${currentPath}': FA is ${typeof faObj}, EN is ${typeof enObj}`);
    return;
  }

  if (Array.isArray(faObj)) {
    if (!Array.isArray(enObj)) {
      errors.push(`Array mismatch at '${currentPath}': FA is array, EN is not`);
      return;
    }
    if (faObj.length !== enObj.length) {
      errors.push(`Array length mismatch at '${currentPath}': FA has ${faObj.length} items, EN has ${enObj.length} items`);
    }
    for (let i = 0; i < Math.min(faObj.length, enObj.length); i++) {
      if (typeof faObj[i] === 'object' && faObj[i] !== null) {
        checkParity(faObj[i], enObj[i], `${currentPath}[${i}]`);
      }
    }
    return;
  }

  if (typeof faObj === 'object' && faObj !== null) {
    const faKeys = Object.keys(faObj);
    const enKeys = Object.keys(enObj);

    // Missing in EN
    for (const key of faKeys) {
      const fieldPath = currentPath ? `${currentPath}.${key}` : key;
      if (!(key in enObj)) {
        errors.push(`Missing key in EN translations: '${fieldPath}'`);
      } else {
        checkParity(faObj[key], enObj[key], fieldPath);
      }
    }

    // Extra in EN (missing in FA)
    for (const key of enKeys) {
      const fieldPath = currentPath ? `${currentPath}.${key}` : key;
      if (!(key in faObj)) {
        errors.push(`Extra key in EN (missing in FA): '${fieldPath}'`);
      }
    }
  }
}

console.log('🔍 Checking 100% parity between Persian (fa) and English (en) localization dictionaries...');
checkParity(fa, en);

if (errors.length > 0) {
  console.error(`❌ Translation Parity Validation FAILED with ${errors.length} error(s):`);
  errors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
} else {
  console.log('✅ Translation Parity Validation PASSED: 100% dictionary key parity achieved between FA and EN!');
}
