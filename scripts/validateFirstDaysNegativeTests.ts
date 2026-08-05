import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const targetFile = path.resolve('src/content/guides/first-days-checklist/en.ts');
const originalContent = fs.readFileSync(targetFile, 'utf8');

const tests = [
  {
    name: 'Missing applicableClaimIds on a VERIFIED step',
    replace: /applicableClaimIds: \['c-student-doc-1', 'c-student-doc-2', 'c-student-doc-4', 'c-student-step-4', 'timeline-igi-student-1'\]/g,
    with: `// deleted applicableClaimIds`
  },
  {
    name: 'A source missing applicableClaimIds entirely',
    replace: /applicableClaimIds: \['fee-residence-card-265', 'fee-consular-tax-120'\]/g,
    with: `// missing`
  },
  {
    name: 'A source with an empty applicableClaimIds array',
    replace: /applicableClaimIds: \['fee-residence-card-265', 'fee-consular-tax-120'\]/g,
    with: `applicableClaimIds: []`
  },
  {
    name: 'A source where applicableScenarioIds lacks the current scenario ID',
    replace: /applicableScenarioIds: \['student-arrival'\]/g,
    with: `applicableScenarioIds: ['some-other-scenario']`
  },
  {
    name: 'The general non-EU family reunification source URL pointing to the beneficiaries-of-international-protection page',
    replace: /url: 'https:\/\/igi\.mai\.gov\.ro\/en\/family-reunification-2\/'/g,
    with: `url: 'https://igi.mai.gov.ro/en/beneficiaries-of-international-protection/'`
  },
  {
    name: 'Source not applicable to claim (Step)',
    replace: /claimId: 'c-student-step-4'/g,
    with: `claimId: 'c-fake-claim-999'`
  }
];

let allPassed = true;

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
      execSync('npm run validate:content', { stdio: 'pipe' });
      console.log(`❌ TEST FAILED: Validator did not exit with code 1 for: ${t.name}`);
      allPassed = false;
    } catch (err) {
      console.log(`✅ TEST PASSED: Validator correctly failed. Exit code 1.`);
    }
  }
} finally {
  // Always restore
  fs.writeFileSync(targetFile, originalContent);
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('All negative tests passed successfully.');
}
