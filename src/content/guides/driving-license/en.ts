import { OperationalGuide } from '../../../types/content';

export const drivingLicenseEN: OperationalGuide = {
  canonicalRoute: '/needs/driving-license',
  locale: 'en',
  title: 'Driving License in Romania: Exchange, New License & Foreign Rules',
  shortDescription: 'Comprehensive guide to temporary driving with foreign licenses, Iranian license exchange, new license steps, renewal, and International Driving Permits (IDP).',
  mainQuestion: 'How can I legally drive or obtain a driving license as a foreign resident in Romania?',
  quickAnswer: 'If you have a valid foreign license (like Iranian) and an IDP, you can drive temporarily. Once you obtain Romanian residency, you must convert it to a Romanian license (EU standard) via DGPCI without an exam. Alternatively, you can attend a driving school to get a new license.',
  targetAudience: ['Expatriates', 'International Students', 'Foreign Workers', 'Iranian Citizens in Romania'],
  generalExceptions: [
    'Expired non-EU driving licenses cannot be exchanged; you must obtain a new license.',
    'Licenses from countries not listed in the OMAI 163/2011 Annex 1 (with subsequent amendments) cannot be directly exchanged without an exam.'
  ],
  commonProblems: [
    'Embassy verification delays for the authenticity of the foreign license.',
    'Medical certificates expiring before the application is processed (validity is 6 months).'
  ],
  warnings: [
    'Important Residence Note: Once you establish legal residence (Permis de Ședere), Romanian law typically mandates converting your foreign license within a specific timeframe.'
  ],
  officialSources: [
    {
      id: 'dgpci-exchange',
      sourceTitle: 'DGPCI - Preschimbare Permise Străine',
      organization: 'Directia Generală Permise de Conducere și Înmatriculări',
      url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    },
    {
      id: 'omai-163-2011',
      sourceTitle: 'Ordinul MAI 163/2011 privind preschimbarea permiselor',
      organization: 'Ministry of Internal Affairs',
      url: 'https://legislatie.just.ro/Public/DetaliiDocument/131062',
      sourceType: 'legislation',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    }
  ],
  relatedGuides: [
    { route: '/needs/first-days-checklist', title: 'First-Days Arrival Checklist' },
    { route: '/needs/health', title: 'Healthcare & Insurance (Fișa Medicală info)' }
  ],
  lastReviewed: '2026-08-04',
  nextReview: '2027-02-04',
  contentOwner: 'DORVIA EUROP Legal Team',
  contentStatus: 'published',
  factCheckStatus: 'source-verified',
  riskCategory: ['LEGAL'],
  
  situations: [
    {
      id: 'temporary',
      title: 'Temporary Use of Foreign Driving License',
      appliesTo: ['Tourists', 'Short-term visa holders', 'New arrivals before getting a residence permit'],
      exceptions: ['If the foreign license is not in Latin script, an International Driving Permit (IDP) or certified translation is strictly required.'],
      limitations: ['Only valid until you establish permanent or temporary residency, after which exchange rules apply.'],
      documents: [],
      steps: [],
      fees: [],
      timeline: []
    },
    {
      id: 'exchange-iran',
      title: 'Converting an Iranian Driving License in Romania',
      appliesTo: ['Iranian citizens holding a valid Iranian Driving License and a Romanian Residence Permit (Permis de Ședere)'],
      residenceCondition: 'Valid temporary or permanent residence permit in Romania',
      authority: 'DGPCI (Direcția Generală Permise de Conducere și Înmatriculări)',
      requiresExamination: false,
      requiresMedical: true,
      documents: [
        { name: 'Original valid Iranian license + copy', isMandatory: true },
        { name: 'Notarized Romanian translation of license', isMandatory: true },
        { name: 'Original embassy authenticity certificate', description: 'Obtained via Iranian Embassy/Mikhak', isMandatory: true },
        { name: 'Valid Romanian residence permit + copy', isMandatory: true },
        { name: 'Valid passport + copy', isMandatory: true },
        { name: 'Certified medical fitness form (Fișa Medicală)', isMandatory: true },
        { name: 'Receipt of DGPCI issuance fee', isMandatory: true },
        { name: 'Completed official DGPCI application form', isMandatory: true }
      ],
      steps: [
        { title: 'Embassy Verification', description: 'Contact the Iranian Embassy in Bucharest to confirm the exact process (Mikhak portal) and obtain the license authenticity certificate.' },
        { title: 'Legal Translation', description: 'Official translation of the Iranian license and embassy letter by an authorized Romanian translator.' },
        { title: 'Medical Exam', description: 'Complete medical driving checks at a DGPCI accredited clinic.' },
        { title: 'DGPCI Application', description: 'Submit the completed file to the provincial DGPCI office, pay the issuance fee, and receive the registration receipt.' }
      ],
      fees: [
        { amount: '89', currency: 'RON', description: 'DGPCI Issuance Fee (Official standard state tariff)', isFixed: true, sourceId: 'dgpci-exchange' },
        { amount: '150 - 250', currency: 'RON', description: 'Medical Exam (Fișa Medicală). Varies by accredited medical center.', isFixed: false },
        { amount: '100 - 200', currency: 'RON', description: 'Official Translation & Notary (Per document)', isFixed: false }
      ],
      timeline: [
        { duration: '30 - 90 Days', description: 'Verification of non-EU licenses can take weeks to months depending on embassy response times.', isGuaranteed: false }
      ],
      exceptions: ['Expired licenses cannot be exchanged.'],
      limitations: ['You cannot hold both licenses simultaneously. Your Iranian license will be retained and sent back to the issuing authority.'],
      actionLink: { url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf', label: 'DGPCI Official Portal' }
    },
    {
      id: 'scratch',
      title: 'Obtaining a Driving License from Scratch',
      appliesTo: ['Foreigners who do not hold any driving license', 'Holders of non-exchangeable or expired foreign licenses'],
      residenceCondition: 'Must have a valid Romanian residence permit.',
      requiresExamination: true,
      requiresMedical: true,
      documents: [
        { name: 'Valid Romanian Residence Permit', isMandatory: true },
        { name: 'Medical and Psychological Certificates', isMandatory: true },
        { name: 'Criminal Record Certificate (Cazier Judiciar)', isMandatory: true },
        { name: 'Driving School Completion Certificate', isMandatory: true }
      ],
      steps: [
        { title: 'Enroll in a Driving School', description: 'Find a licensed driving school. Some schools in major cities offer instruction in English.' },
        { title: 'Medical & Psychological Tests', description: 'Pass the required fitness and psychological tests.' },
        { title: 'Theory Test', description: 'Pass the computerized theory test (Sala). In some counties, it is available in English.' },
        { title: 'Practical Test', description: 'Pass the on-road driving test with a police examiner.' }
      ],
      fees: [
        { amount: '1500 - 2500', currency: 'RON', description: 'Driving School Tuition (Varies widely depending on category and language)', isFixed: false },
        { amount: '89', currency: 'RON', description: 'DGPCI License Issuance Fee', isFixed: true, sourceId: 'dgpci-exchange' }
      ],
      timeline: [
        { duration: '2 - 4 Months', description: 'Time required to complete driving school and pass examinations.', isGuaranteed: false }
      ],
      exceptions: [],
      limitations: []
    }
  ]
};
