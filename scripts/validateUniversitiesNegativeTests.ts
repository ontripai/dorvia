import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const targetFile = path.resolve('src/lib/universities.ts');
const originalContent = fs.readFileSync(targetFile, 'utf8');

const tests = [
  {
    name: 'Missing university (8 instead of 9)',
    replace: /\{\s*id: 'umf-carol-davila',[\s\S]*?\},/,
    with: ``
  },
  {
    name: 'Duplicate university ID',
    replace: /id: 'umf-victor-babes',/g,
    with: `id: 'umf-carol-davila',`
  },
  {
    name: 'Titu Maiorescu approved (IRAN_MOH_APPROVED)',
    replace: /recognitionStatus: 'REQUIRES_CURRENT_RECHECK',/g,
    with: `recognitionStatus: 'IRAN_MOH_APPROVED',`
  },
  {
    name: 'HISTORICAL_OFFICIAL tuition marked as current year',
    replace: /tuitionAcademicYear: '2024–2025',/g,
    with: `tuitionAcademicYear: '2026-2027',`
  },
  {
    name: 'Missing source for OFFICIAL_FIXED',
    replace: /sourceRecords: \[\s*\{\s*name: 'Official non-EU admission page on international.ase.ro',\s*url: 'https:\/\/international.ase.ro'\s*\}\s*\],/,
    with: `sourceRecords: [],`
  },
  {
    name: 'displayOrder not strictly increasing',
    replace: /displayOrder: 2,/g,
    with: `displayOrder: 1,`
  },
  {
    name: 'FA/EN parity issue (missing nameEn)',
    replace: /nameEn: 'University of Bucharest',/g,
    with: `nameEn: '',`
  },
  {
    name: 'Tuition amount without academic year',
    replace:
      /tuitionAcademicYear:\s*'[^']+',\s*tuitionVerificationStatus:\s*'OFFICIAL_FIXED'/,
    with: `tuitionAcademicYear: '',
    tuitionVerificationStatus: 'OFFICIAL_FIXED'`
  },
  {
    name: 'Invalid CTA Href',
    replace: /ctaHref: '\/study',/g,
    with: `ctaHref: '#',`
  }
];

let allPassed = true;

console.log('--- CONTENT MUTATION TESTS ---');
try {
  for (const t of tests) {
    console.log(`Running Negative Test: ${t.name}`);
    const modifiedContent = originalContent.replace(t.replace, t.with);

    if (modifiedContent === originalContent) {
      console.log(`❌ Failed to patch content for test: ${t.name}`);
      allPassed = false;
      continue;
    }

    fs.writeFileSync(targetFile, modifiedContent);

    try {
      execSync('npx tsx scripts/validateUniversities.ts', { stdio: 'pipe' });
      console.log(`❌ TEST FAILED: Validator did not exit with code 1 for: ${t.name}`);
      allPassed = false;
    } catch (err) {
      console.log(`✅ TEST PASSED: Validator correctly failed. Exit code 1.`);
    }
  }
} finally {
  fs.writeFileSync(targetFile, originalContent);
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('\nAll negative tests passed successfully.');
}
