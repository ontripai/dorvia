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
    name: 'Titu Maiorescu with UNOFFICIAL_ESTIMATE',
    replace: /tuitionVerificationStatus: 'OFFICIAL_FIXED',\s*recognitionStatus: 'REQUIRES_CURRENT_RECHECK',/g,
    with: `tuitionVerificationStatus: 'UNOFFICIAL_ESTIMATE',
    recognitionStatus: 'REQUIRES_CURRENT_RECHECK',`
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
      /tuitionAcademicYear:\s*'2026-2027',\s*tuitionVerificationStatus:\s*'OFFICIAL_FIXED'/,
    with: `tuitionAcademicYear: '',
    tuitionVerificationStatus: 'OFFICIAL_FIXED'`
  },
  {
    name: 'Invalid CTA Href',
    replace: /ctaHref: '\/study',/g,
    with: `ctaHref: '#',`
  },
  {
    name: 'Missing recognition sources for MOH Approved',
    replace: /recognitionSources: \[\s*\{\s*name: \{ fa: 'سند رسمی شهریه ۲۰۲۶-۲۰۲۷', en: 'Official Tuition Document 2026-2027' \},\s*issuer: \{ fa: 'UMFCD', en: 'UMFCD' \},\s*academicYear: '2026-2027',\s*url: 'https:\/\/umfcd.ro\/wp-content\/uploads\/2026\/NORME_LEGALE\/Taxe%20UMFCD%202026-2027.pdf',\s*officialFlag: true\s*\}[,\s\S]*?\],/,
    with: `recognitionSources: [],`
  },
  {
    name: 'Missing bilingual institutionType',
    replace: /institutionType: \{ fa: 'دولتی جامع', en: 'Public Comprehensive' \},/g,
    with: `institutionType: { fa: '', en: '' },`
  },
  {
    name: 'One-sided disclaimer',
    replace: /fa: 'طبق اطلاعات ارائهشده از سوی دانشگاه، امکان بازپرداخت شهریه در صورت رد ویزا وجود دارد، اما شرایط، مدارک و مهلتهای بازپرداخت باید مستقیماً از دانشگاه بررسی شود.',\s*en: 'The university indicates that tuition may be refundable following a visa refusal, subject to its current conditions, required evidence and deadlines. Confirm the policy directly before payment.'/g,
    with: `fa: 'طبق اطلاعات ارائهشده از سوی دانشگاه، امکان بازپرداخت شهریه در صورت رد ویزا وجود دارد، اما شرایط، مدارک و مهلتهای بازپرداخت باید مستقیماً از دانشگاه بررسی شود.',
      en: ''`
  },
  {
    name: 'Homepage-only tuition source',
    replace: /url: 'https:\/\/umfcd.ro\/wp-content\/uploads\/2026\/NORME_LEGALE\/Taxe%20UMFCD%202026-2027.pdf',/g,
    with: `url: 'https://umfcd.ro/',`
  },
  {
    name: 'Malformed monetary data (string amount instead of number)',
    replace: /amount: 10000,/g,
    with: `amount: -10000,`
  },
  {
    name: 'MOH Approved missing official recognition source',
    replace: /officialFlag: true/g,
    with: `officialFlag: false`
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
