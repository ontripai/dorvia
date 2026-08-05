import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const targetFileEn = path.resolve('src/content/guides/first-days-checklist/en.ts');
const originalContentEn = fs.readFileSync(targetFileEn, 'utf8');

const tests = [
  {
    name: 'Verified Step without sourceId',
    replace: /status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'anaf-contracts'/g,
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
    name: 'Outdated residence-document fee of 259 RON',
    replace: /amount: '265'/g,
    with: `amount: '259'`
  },
  {
    name: 'Generic CNAS homepage used as VERIFIED legal entitlement evidence',
    replace: /status: 'QUALIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'cnas-insurance-general'/g,
    with: `status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'cnas-insurance-general'`
  },
  {
    name: 'FA/EN scenario mismatch',
    replace: /id: 'student-arrival',/g,
    with: `id: 'student-arrival-fake',`
  },
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
  }
];

let allPassed = true;

console.log('--- CONTENT MUTATION TESTS ---');
try {
  for (const t of tests) {
    console.log(`Running Negative Test: ${t.name}`);
    const modifiedContent = originalContentEn.replace(t.replace, t.with);
    
    if (modifiedContent === originalContentEn) {
        console.log(`❌ Failed to patch content for test: ${t.name}`);
        allPassed = false;
        continue;
    }

    fs.writeFileSync(targetFileEn, modifiedContent);
    
    try {
      execSync('npm run validate:content', { stdio: 'pipe' });
      console.log(`❌ TEST FAILED: Validator did not exit with code 1 for: ${t.name}`);
      allPassed = false;
    } catch (err) {
      console.log(`✅ TEST PASSED: Validator correctly failed. Exit code 1.`);
    }
  }
} finally {
  fs.writeFileSync(targetFileEn, originalContentEn);
}

console.log('\\n--- STATIC UI & PACKAGE CHECKS ---');
try {
  // Playwright present in production dependencies
  const packageJsonStr = fs.readFileSync(path.resolve('package.json'), 'utf8');
  const packageJson = JSON.parse(packageJsonStr);
  if (packageJson.dependencies && packageJson.dependencies.playwright) {
    console.log('❌ Playwright is in production dependencies!');
    allPassed = false;
  } else {
    console.log('✅ Playwright not in production dependencies.');
  }

  // Published guide while SME review is PENDING
  if (originalContentEn.includes("contentStatus: 'published'") && originalContentEn.includes("smeReviewStatus: 'PENDING'")) {
    console.log('❌ Published guide while SME review is PENDING');
    allPassed = false;
  } else {
    console.log('✅ Guide is not published while SME review is PENDING.');
  }

  // Persian governance UI containing English labels
  const needsContentPath = path.resolve('src/components/NeedsContent.tsx');
  const needsContent = fs.readFileSync(needsContentPath, 'utf8');
  const faTransMatch = needsContent.match(/const translations = currentLang === 'fa' \? \{([^}]+)\}/);
  if (faTransMatch) {
     const transFa = faTransMatch[1];
     if (transFa.includes('Content status') || transFa.includes('Fact-check status') || transFa.includes('SME/legal review')) {
        console.log('❌ Persian governance UI contains English labels');
        allPassed = false;
     } else {
        console.log('✅ Persian governance UI does not contain English labels.');
     }
  }

  // English mode does not contain Persian governance labels
  const enTransMatch = needsContent.match(/\} : \{([^}]+)\};\n\n      return \(\n        <div className="space-y-10/);
  if (enTransMatch) {
     const transEn = enTransMatch[1];
     if (transEn.includes('وضعیت محتوا') || transEn.includes('وضعیت راستی‌آزمایی') || transEn.includes('بازبینی تخصصی')) {
        console.log('❌ English governance UI contains Persian labels');
        allPassed = false;
     } else {
        console.log('✅ English governance UI does not contain Persian labels.');
     }
  }

  // Heading hierarchy containing H1 followed directly by H3
  const layoutPath = path.resolve('src/components/guide/OperationalGuideLayout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  const h1Count = (layoutContent.match(/<h1/g) || []).length;
  if (h1Count !== 1) {
    console.log(`❌ Expected exactly one H1, found ${h1Count}`);
    allPassed = false;
  } else {
    console.log('✅ Exactly one H1 found.');
  }

  if (layoutContent.includes('<h3 className="font-extrabold text-base sm:text-lg">')) {
     console.log('❌ H1 -> H3 skip detected in TOC');
     allPassed = false;
  } else if (!layoutContent.includes('<h2')) {
     console.log('❌ No H2 found, potential hierarchy issue');
     allPassed = false;
  } else {
     console.log('✅ No H1 -> H3 skip detected.');
  }

  // The SME pending notice is visible in both languages
  if (!layoutContent.includes('{guide.smeReviewStatus && (')) {
     console.log('❌ SME pending notice is not visible in layout');
     allPassed = false;
  } else {
     console.log('✅ SME pending notice is visible in layout.');
  }

} catch (err) {
  console.log('❌ Static checks failed with error:', err);
  allPassed = false;
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('\\nAll negative tests passed successfully.');
}
