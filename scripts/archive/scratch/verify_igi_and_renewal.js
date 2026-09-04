const fs = require('fs');
const path = require('path');

console.log('Verifying IGI Process & Residence Renewal Comprehensive Guides...\n');

const igiFilePath = path.join(__dirname, '..', 'src', 'components', 'IgiProcessContent.tsx');
const renewalFilePath = path.join(__dirname, '..', 'src', 'components', 'ImmigrationOverviewContent.tsx');

const igiContent = fs.readFileSync(igiFilePath, 'utf8');
const renewalContent = fs.readFileSync(renewalFilePath, 'utf8');

// Required checks for IgiProcessContent
const igiChecks = [
  'igi.mai.gov.ro',
  'Certificat de Înregistrare',
  'Cartea de Rezidență',
  '۹۰ روز',
  '۳۰ روز',
  '/needs/housing',
  '/needs',
  '/immigration/long-term-residence',
  '/immigration/citizenship',
  '/needs/driving-license',
  'CommentsSection'
];

console.log('Checking IgiProcessContent.tsx...');
let allIgiPassed = true;
igiChecks.forEach(check => {
  if (igiContent.includes(check)) {
    console.log(` ✓ Phrase/Link "${check}" -> FOUND`);
  } else {
    console.error(` ❌ Phrase/Link "${check}" -> MISSING`);
    allIgiPassed = false;
  }
});

// Required checks for ImmigrationOverviewContent (residence-renewal)
const renewalChecks = [
  'igi.mai.gov.ro',
  'حداقل ۳۰ روز پیش از انقضای کارت فعلی',
  '۳۰ روز',
  '/needs/housing',
  '/needs',
  '/immigration/long-term-residence',
  '/immigration/citizenship',
  '/needs/driving-license',
  'CommentsSection'
];

console.log('\nChecking ImmigrationOverviewContent.tsx (residence-renewal)...');
let allRenewalPassed = true;
renewalChecks.forEach(check => {
  if (renewalContent.includes(check)) {
    console.log(` ✓ Phrase/Link "${check}" -> FOUND`);
  } else {
    console.error(` ❌ Phrase/Link "${check}" -> MISSING`);
    allRenewalPassed = false;
  }
});

if (allIgiPassed && allRenewalPassed) {
  console.log('\n✅ IGI Process & Residence Renewal Verification PASSED 100%!');
} else {
  console.error('\n❌ Verification FAILED');
  process.exit(1);
}
