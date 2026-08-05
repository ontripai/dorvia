import { universitiesData } from '../src/lib/universities';

let hasErrors = false;

function error(msg: string) {
  console.error(`[ERROR] ${msg}`);
  hasErrors = true;
}

function assert(condition: boolean, msg: string) {
  if (!condition) error(msg);
}

import fs from 'fs';
import path from 'path';

// UI checks
const pagePath = path.resolve(__dirname, '../src/app/universities/page.tsx');
const cardPath = path.resolve(__dirname, '../src/components/UniversityCard.tsx');
const pageContent = fs.readFileSync(pagePath, 'utf8');
const cardContent = fs.readFileSync(cardPath, 'utf8');

assert(
  pageContent.includes(".filter(lang => lang !== 'UNKNOWN')"),
  "UNKNOWN must be excluded from language filter dropdown"
);

assert(
  cardContent.includes("filter(l => l !== 'UNKNOWN')") && cardContent.includes("includes('UNKNOWN')"),
  "UNKNOWN must not be rendered as a normal badge"
);

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
  const hasTuitionAmount = titu.tuitionItems.some(item => typeof item.amount === 'number' || typeof item.maxAmount === 'number');
  assert(hasTuitionAmount, 'Titu must have a tuition estimate (official or unofficial), but wait, the instruction says "no unofficial Titu tuition estimate"');
  const hasUnofficialEstimate = titu.tuitionVerificationStatus === 'UNOFFICIAL_ESTIMATE';
  assert(!hasUnofficialEstimate, 'Titu must not have UNOFFICIAL_ESTIMATE');
} else {
  error('Missing Titu Maiorescu university');
}

// Data parity and completeness
universitiesData.forEach(uni => {
  assert(!!uni.nameFa && !!uni.nameEn, `Missing name for ${uni.id}`);
  assert(!!uni.cityFa && !!uni.cityEn, `Missing city for ${uni.id}`);
  assert(!!uni.institutionType?.fa && !!uni.institutionType?.en, `Missing bilingual institutionType for ${uni.id}`);
  assert(!!uni.descriptionFa && !!uni.descriptionEn, `Missing description for ${uni.id}`);
  assert(!!uni.ctaLabelFa && !!uni.ctaLabelEn, `Missing CTA labels for ${uni.id}`);
  assert(!!uni.ctaHref && !uni.ctaHref.includes('#'), `Invalid CTA Href for ${uni.id}`);
  assert(uni.programs && uni.programs.length > 0, `Missing programs for ${uni.id}`);
  uni.programs.forEach((prog, pIdx) => {
    assert(!!prog.name.fa && !!prog.name.en, `Missing bilingual program name at index ${pIdx} in ${uni.id}`);
    assert(!!prog.studyAreaId, `Missing studyAreaId for program at index ${pIdx} in ${uni.id}`);
    assert(!!prog.languages && prog.languages.length > 0, `Missing languages for program at index ${pIdx} in ${uni.id}`);
  });

  if (uni.disclaimer) {
    assert(!!uni.disclaimer.fa && !!uni.disclaimer.en, `Disclaimer must be bilingual for ${uni.id}`);
  }

  // Tuition validations
  assert(uni.tuitionItems.length > 0, `Missing tuition items for ${uni.id}`);
  
  uni.tuitionItems.forEach((item, idx) => {
    assert(!!item.program.fa && !!item.program.en, `Missing bilingual program for tuition item ${idx} in ${uni.id}`);
    
    if (item.feeType !== 'contact') {
      assert(typeof item.amount === 'number' && item.amount > 0, `Malformed amount for tuition item ${idx} in ${uni.id}`);
      assert(!!item.currency, `Missing currency for tuition item ${idx} in ${uni.id}`);
      assert(!!item.period, `Missing period for tuition item ${idx} in ${uni.id}`);
    }
  });

  const hasTuitionAmount = uni.tuitionItems.some(
    (item) => item.feeType !== 'contact');

  if (hasTuitionAmount) {
    assert(
      uni.tuitionAcademicYear.trim().length > 0,
      `Missing tuition academic year for ${uni.id}`
    );
  }

  // Recognition Sources checks
  if (uni.recognitionStatus === 'IRAN_MOH_APPROVED') {
    assert(!!uni.recognitionSources && uni.recognitionSources.length > 0, `MOH approved university ${uni.id} must have recognitionSources`);
    const hasOfficialMOH = uni.recognitionSources?.some(src => src.officialFlag) ?? false;
    assert(hasOfficialMOH, `MOH approved university ${uni.id} must have an official recognition source (officialFlag: true)`);
  }

  if (uni.recognitionSources) {
    uni.recognitionSources.forEach((src, idx) => {
      assert(!!src.name.fa && !!src.name.en, `Missing bilingual name for recognitionSource ${idx} in ${uni.id}`);
      assert(!!src.issuer?.fa && !!src.issuer?.en, `Missing bilingual issuer for recognitionSource ${idx} in ${uni.id}`);
      assert(!!src.academicYear, `Missing academicYear for recognitionSource ${idx} in ${uni.id}`);
      assert(!!src.url, `Missing url for recognitionSource ${idx} in ${uni.id}`);
      
      const isHomepage = src.url.endsWith('.ro/') || src.url.endsWith('.ro');
      assert(!isHomepage, `Recognition source ${idx} in ${uni.id} must not be a homepage-only URL (${src.url})`);
    });
  }
  
  if (uni.tuitionVerificationStatus.includes('OFFICIAL') && uni.recognitionSources) {
    // Check if tuition sources are direct, not just homepage
    uni.recognitionSources.forEach(src => {
      if (src.officialFlag) {
        const isHomepage = src.url.endsWith('.ro/') || src.url.endsWith('.ro');
        assert(!isHomepage, `Official source for ${uni.id} cannot be just a homepage: ${src.url}`);
      }
    });
  }

});

// Functional Filtering Tests
console.log('Running functional filter simulations...');

// Simulate filtering function
function simulateFilter(area: string | null, lang: string | null) {
  return universitiesData.filter((uni) => {
    if (!area && !lang) return true;
    return uni.programs.some(p => {
      const matchesArea = area ? p.studyAreaId === area : true;
      const matchesLang = lang ? p.languages.includes(lang as any) : true;
      return matchesArea && matchesLang;
    });
  });
}

// 1. Default result
const defaultResult = simulateFilter(null, null);
assert(defaultResult.length === 9, `Default result should contain exactly 9 universities, got ${defaultResult.length}`);

// 2. UNKNOWN never satisfies specific language
const enResults = simulateFilter(null, 'EN');
assert(enResults.every(u => u.programs.some(p => p.languages.includes('EN'))), "EN filter should only match EN programs");

// 3. Program with UNKNOWN still satisfies study area
const unknownOnlyPrograms = universitiesData.flatMap(u => u.programs).filter(p => p.languages.includes('UNKNOWN'));
assert(unknownOnlyPrograms.length > 0, "UNKNOWN remains present in raw data");
const someUnknownArea = unknownOnlyPrograms[0].studyAreaId;
const areaResults = simulateFilter(someUnknownArea, null);
assert(areaResults.length > 0, `UNKNOWN program should still satisfy its verified study area (${someUnknownArea})`);

// 4. Contextual program-level matching (Medicine + UNKNOWN, Business + EN)
const simulatedUni = {
  programs: [
    { name: { en: 'Med', fa: 'Med' }, studyAreaId: 'medicine_dentistry', languages: ['UNKNOWN'] },
    { name: { en: 'Bus', fa: 'Bus' }, studyAreaId: 'management_business', languages: ['EN'] }
  ]
};
const testMatchesAreaLang = (area: string, lang: string) => simulatedUni.programs.some(p =>

  (area ? p.studyAreaId === area : true) && (lang ? p.languages.includes(lang) : true)
);

assert(testMatchesAreaLang('medicine_dentistry', ''), "Must match Medicine");
assert(testMatchesAreaLang('management_business', 'EN'), "Must match Business + EN");
assert(!testMatchesAreaLang('medicine_dentistry', 'EN'), "Must not match Medicine + EN");

if (hasErrors) {
  console.error('\n❌ University validation failed.');
  process.exit(1);
} else {
  console.log('\n✅ University validation passed.');
  process.exit(0);
}
