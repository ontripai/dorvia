const fs = require('fs');
let en = fs.readFileSync('src/content/guides/driving-license/en.ts', 'utf8');
let fa = fs.readFileSync('src/content/guides/driving-license/fa.ts', 'utf8');

// 1. Add dgpci-idp to official sources in en
en = en.replace(/officialSources: \[/, `officialSources: [
    {
      id: 'dgpci-idp',
      sourceTitle: 'DGPCI - Eliberare Permis de Conducere Internațional',
      organization: 'Directia Generală Permise de Conducere și Înmatriculări',
      url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf', // Using generic for now or 5b35...
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    },`);
fa = fa.replace(/officialSources: \[/, `officialSources: [
    {
      id: 'dgpci-idp',
      sourceTitle: 'DGPCI - Eliberare Permis de Conducere Internațional',
      organization: 'Directia Generală Permise de Conducere și Înmatriculări',
      url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    },`);

// 2. Change requiresMedical
en = en.replace(/requiresMedical: false/g, "requiresMedical: 'not-required'");
fa = fa.replace(/requiresMedical: false/g, "requiresMedical: 'not-required'");
en = en.replace(/requiresMedical: true/g, "requiresMedical: 'required'");
fa = fa.replace(/requiresMedical: true/g, "requiresMedical: 'required'");

// 3. Make foreign-licence-exchange conditional
en = en.replace(/id: 'foreign-licence-exchange',[\s\S]*?requiresMedical: 'required'/, match => {
  return match.replace(/requiresMedical: 'required'/, "requiresMedical: 'conditional',\n      medicalConditionText: 'A medical document is required when the applicant requests a Romanian licence with new administrative validity. A duplicate or replacement retaining the existing administrative validity may not require it.'");
});
fa = fa.replace(/id: 'foreign-licence-exchange',[\s\S]*?requiresMedical: 'required'/, match => {
  return match.replace(/requiresMedical: 'required'/, "requiresMedical: 'conditional',\n      medicalConditionText: 'A medical document is required when the applicant requests a Romanian licence with new administrative validity. A duplicate or replacement retaining the existing administrative validity may not require it.'");
});

// 4. Update IDP scenario
const idpEnBlock = `    {
      id: 'international-driving-permit',
      title: 'International Driving Permit (IDP)',
      appliesTo: ['Holders of a valid Romanian national driving licence'],
      documents: [
        { name: 'Valid Romanian Driving Licence', isMandatory: true }
      ],
      steps: [],
      fees: [
        { amount: '46', currency: 'RON', description: 'DGPCI fee for IDP issuance.', isFixed: true, sourceId: 'dgpci-idp' }
      ],
      timeline: [
        { duration: 'Up to 30 calendar days', description: 'Legal maximum processing time.', isGuaranteed: false, sourceId: 'dgpci-idp' }
      ],
      exceptions: [],
      limitations: ['Requires a valid Romanian national licence. Foreign licence holders cannot apply for a Romanian IDP.']
    }`;

en = en.replace(/\{\s*id: 'international-driving-permit'[\s\S]*?limitations: \[\]\s*\}/, idpEnBlock);
fa = fa.replace(/\{\s*id: 'international-driving-permit'[\s\S]*?limitations: \[\]\s*\}/, idpEnBlock);

fs.writeFileSync('src/content/guides/driving-license/en.ts', en);
fs.writeFileSync('src/content/guides/driving-license/fa.ts', fa);
