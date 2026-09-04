const fs = require('fs');
const path = require('path');

const needsContentPath = path.join(__dirname, '..', 'src', 'components', 'NeedsContent.tsx');
const content = fs.readFileSync(needsContentPath, 'utf8');

console.log('Verifying /needs/driving-license reconstruction in NeedsContent.tsx...\n');

const anchorsToVerify = [
  'foreign-license-temp',
  'iranian-license-conversion',
  'license-from-scratch',
  'license-renewal',
  'international-license-idp',
  'penalties-and-suspension'
];

let allAnchorsFound = true;

anchorsToVerify.forEach(anchor => {
  if (content.includes(`id="${anchor}"`)) {
    console.log(`✓ Anchor ID "${anchor}" -> FOUND`);
  } else {
    console.error(`❌ Anchor ID "${anchor}" -> MISSING`);
    allAnchorsFound = false;
  }
});

// Check critical phrases and tables
const phraseChecks = [
  '۱۵ روز کاری تا حدود سه ماه',
  'گواهی‌نامه‌های منقضی شده صادر از کشورهای خارج از اتحادیه اروپا معمولاً قابل تبدیل نیستند',
  '۸۹ لِی',
  '۴۶ لِی',
  '۱,۱۵۰ لِی',
  'dgpci.mai.gov.ro',
  'bucharest.mfa.ir',
  'آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶'
];

console.log('\nVerifying required content phrases and official links...');
let allPhrasesFound = true;

phraseChecks.forEach(phrase => {
  if (content.includes(phrase)) {
    console.log(`✓ Phrase "${phrase}" -> FOUND`);
  } else {
    console.error(`❌ Phrase "${phrase}" -> MISSING`);
    allPhrasesFound = false;
  }
});

if (allAnchorsFound && allPhrasesFound) {
  console.log('\n✅ Driving License Page Reconstruction Verification PASSED!');
} else {
  console.error('\n❌ Verification FAILED');
  process.exit(1);
}
