import { universitiesData } from '../src/lib/universities';

let hasErrors = false;

function error(msg: string) {
  console.error(`[ERROR] ${msg}`);
  hasErrors = true;
}

function assert(condition: boolean, msg: string) {
  if (!condition) error(msg);
}

console.log('Validating universities data...');

// Constraint 1: Exactly 9 universities
assert(universitiesData.length === 9, `Expected 9 universities, found ${universitiesData.length}`);

// Ensure unique IDs
const ids = new Set<string>();
universitiesData.forEach(uni => {
  if (ids.has(uni.id)) error(`Duplicate university ID found: ${uni.id}`);
  ids.add(uni.id);
});

// Ensure correct ordering
let previousOrder = 0;
universitiesData.forEach(uni => {
  assert(uni.displayOrder > previousOrder, `displayOrder not strictly increasing for ${uni.id}. Got ${uni.displayOrder}, expected > ${previousOrder}`);
  previousOrder = uni.displayOrder;
});

// Group 1 validations
const group1 = universitiesData.filter(u => u.groupId === 1);
assert(group1.length === 4, `Expected exactly 4 universities in Group 1, found ${group1.length}`);
group1.forEach(u => {
  assert(u.recognitionStatus === 'IRAN_MOH_APPROVED', `Group 1 university ${u.id} must be IRAN_MOH_APPROVED`);
});

// Warning level for Titu Maiorescu
const titu = universitiesData.find(u => u.id === 'titu-maiorescu');
if (titu) {
  assert(titu.recognitionStatus !== 'IRAN_MOH_APPROVED', 'Titu Maiorescu cannot be IRAN_MOH_APPROVED');
  assert(titu.warningLevel !== 'none', 'Titu Maiorescu must have a warning level');
} else {
  error('Missing Titu Maiorescu university');
}

// Data parity and completeness
universitiesData.forEach(uni => {
  assert(!!uni.nameFa && !!uni.nameEn, `Missing name for ${uni.id}`);
  assert(!!uni.cityFa && !!uni.cityEn, `Missing city for ${uni.id}`);
  assert(!!uni.descriptionFa && !!uni.descriptionEn, `Missing description for ${uni.id}`);
  assert(!!uni.ctaLabelFa && !!uni.ctaLabelEn, `Missing CTA labels for ${uni.id}`);
  assert(!!uni.ctaHref && !uni.ctaHref.includes('#'), `Invalid CTA Href for ${uni.id}`);
  assert(uni.studyFieldsFa.length === uni.studyFieldsEn.length, `Study fields length mismatch for ${uni.id}`);

  // Tuition validations
  assert(uni.tuitionItems.length > 0, `Missing tuition items for ${uni.id}`);
  const hasTuitionAmount = uni.tuitionItems.some(
    (item) => item.amount !== 'CONTACT_UNIVERSITY');

  if (hasTuitionAmount) {
    assert(
      uni.tuitionAcademicYear.trim().length > 0,
      `Missing tuition academic year for ${uni.id}`
    );
  }
  if (uni.tuitionVerificationStatus.includes('OFFICIAL')) {
    assert(uni.sourceRecords.length > 0, `Official tuition status for ${uni.id} requires source records`);
  }

  if (uni.tuitionVerificationStatus === 'UNOFFICIAL_ESTIMATE') {
    assert(uni.recognitionStatus !== 'IRAN_MOH_APPROVED', `UNOFFICIAL_ESTIMATE tuition status for ${uni.id} cannot be IRAN_MOH_APPROVED`);
  }

  if (uni.tuitionVerificationStatus === 'HISTORICAL_OFFICIAL') {
    assert(!uni.tuitionAcademicYear.includes('2026'), `HISTORICAL_OFFICIAL for ${uni.id} cannot be marked as current year (2026)`);
  }
});

if (hasErrors) {
  console.error('\n❌ University validation failed.');
  process.exit(1);
} else {
  console.log('\n✅ University validation passed.');
  process.exit(0);
}
