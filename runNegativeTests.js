const fs = require('fs');
const { execSync } = require('child_process');

const targetFile = 'src/content/guides/first-days-checklist/en.ts';
const originalContent = fs.readFileSync(targetFile, 'utf8');

const tests = [
  {
    name: 'Verified Step without sourceId',
    replace: /status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-student'/g,
    with: `status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05'`
  },
  {
    name: 'Verified Document without sourceId',
    replace: `{ name: 'Passport with valid Type D/SD visa', isMandatory: true, claimId: 'c-student-doc-1', sourceId: 'igi-student', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' }`,
    with: `{ name: 'Passport with valid Type D/SD visa', isMandatory: true, claimId: 'c-student-doc-1', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' }`
  },
  {
    name: 'Unknown sourceId',
    replace: /sourceId: 'igi-student'/g,
    with: `sourceId: 'fake-source-999'`
  },
  {
    name: 'Source not applicable to scenario',
    replace: `sourceId: 'igi-student', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT'`,
    with: `sourceId: 'igi-eu', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT'`
  },
  {
    name: 'Source not applicable to claim',
    replace: `applicableScenarioIds: ['student-arrival']`,
    with: `applicableScenarioIds: ['student-arrival'], applicableClaimIds: ['some-other-claim-id']`
  },
  {
    name: 'Outdated 259 RON residence-document cost',
    replace: /amount: '265'/g,
    with: `amount: '259'`
  },
  {
    name: 'Generic CNAS homepage used as verified entitlement evidence',
    replace: /status: 'QUALIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'cnas-insurance-general'/g,
    with: `status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'cnas-insurance-general'`
  },
  {
    name: 'Absolute accommodation claim requiring only an ANAF-registered long-term lease',
    replace: `limitations: ['Cannot apply for a residence permit until acceptable proof of legal accommodation is secured. The required document varies depending on your specific procedure.']`,
    with: `limitations: ['Cannot apply for residence permit until long-term housing is secured and registered at ANAF.']`
  },
  {
    name: 'Incorrect family-reunification source',
    replace: `url: 'https://igi.mai.gov.ro/en/family-reunification/',`,
    with: `url: 'https://igi.mai.gov.ro/en/beneficiaries-of-international-protection/',`
  },
  {
    name: 'FA/EN mismatch',
    replace: /id: 'student-arrival',/g,
    with: `id: 'student-arrival-fake',`
  }
];

let allPassed = true;

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
    execSync('npm run validate:content', { stdio: 'pipe' });
    console.log(`❌ TEST FAILED: Validator did not exit with code 1 for: ${t.name}`);
    allPassed = false;
  } catch (err) {
    console.log(`✅ TEST PASSED: Validator correctly failed. Exit code 1.`);
  }
  
  // Restore
  fs.writeFileSync(targetFile, originalContent);
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('All negative tests passed successfully.');
}
