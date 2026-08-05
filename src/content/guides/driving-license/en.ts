import { OperationalGuide } from '../../../types/content';

export const drivingLicenseEN: OperationalGuide = {
  canonicalRoute: '/needs/driving-license',
  locale: 'en',
  title: 'Driving License in Romania: Exchange, New License & Foreign Rules',
  shortDescription: 'Comprehensive guide to temporary driving with foreign licenses, Iranian license exchange, new license steps, renewal, and International Driving Permits (IDP).',
  mainQuestion: 'How can I legally drive or obtain a driving license as a foreign resident in Romania?',
  quickAnswer: 'If you have a valid foreign license and an IDP, you can drive temporarily. Once you obtain Romanian residency, you must convert it to a Romanian license (EU standard) via DGPCI without an exam if your country is listed in OMAI 163/2011 Annex 1 (including Iran). Alternatively, you can attend a driving school to get a new license.',
  targetAudience: ['Expatriates', 'International Students', 'Foreign Workers', 'Iranian Citizens in Romania'],
  generalExceptions: [
    'Expired non-EU driving licenses cannot be exchanged; you must obtain a new license.',
    'Licenses from countries not listed in the OMAI 163/2011 Annex 1 (with subsequent amendments) cannot be directly exchanged without an exam.'
  ],
  commonProblems: [
    'Delays in the verification of authenticity and validity from the issuing state.',
    'Medical certificates expiring before the application is processed (validity is 6 months).'
  ],
  warnings: [
    'Important Residence Note: Once you establish legal residence (Permis de Ședere), Romanian law typically mandates converting your foreign license within a specific timeframe if you intend to continue driving.'
  ],
  officialSources: [
    {
      id: 'dgpci-idp',
      sourceTitle: 'DGPCI - Eliberare Permis de Conducere Internațional',
      organization: 'Directia Generală Permise de Conducere și Înmatriculări',
      url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf', // Using generic for now or 5b35...
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    },
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
    },
    {
      id: 'dgpci-exam',
      sourceTitle: 'DGPCI - Obținerea permisului de conducere',
      organization: 'DGPCI',
      url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f25a10a30b538053a4ce',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    },
    {
      id: 'dgpci-renewal',
      sourceTitle: 'DGPCI - Preschimbarea permisului românesc',
      organization: 'DGPCI',
      url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f2cf10a30b538053a4d0',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-04',
      status: 'primary'
    },
    {
      id: 'codul-rutier',
      sourceTitle: 'Codul Rutier (O.U.G. 195/2002)',
      organization: 'Guvernul României',
      url: 'https://legislatie.just.ro/Public/DetaliiDocument/39474',
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
      id: 'temporary-foreign-licence-use',
      title: 'Temporary Use of Foreign Driving License',
      appliesTo: ['Tourists', 'Short-term visa holders', 'New arrivals before getting a residence permit'],
      documents: [],
      steps: [],
      fees: [],
      timeline: [],
      exceptions: [],
      limitations: []
    },
    {
      id: 'foreign-licence-exchange',
      title: 'Converting a Foreign Driving License (General)',
      appliesTo: ['Foreigners from Annex 1 states (OMAI 163/2011)'],
      residenceCondition: 'Valid temporary or permanent residence permit in Romania',
      authority: 'DGPCI (Direcția Generală Permise de Conducere și Înmatriculări)',
      requiresExamination: false,
      requiresMedical: 'conditional',
      medicalConditionText: 'A medical document is required when the applicant requests a Romanian licence with new administrative validity. A duplicate or replacement retaining the existing administrative validity may not require it.',
      documents: [
        { name: 'Original valid foreign license + copy', isMandatory: true },
        { name: 'Notarized Romanian translation of license', isMandatory: true },
        { name: 'Valid Romanian residence permit + copy', isMandatory: true },
        { name: 'Valid passport + copy', isMandatory: true },
        { name: 'Completed official DGPCI application form', isMandatory: true }
      ],
      steps: [],
      fees: [
        { amount: '89', currency: 'RON', description: 'DGPCI Issuance Fee for Exchange. Payable via CEC Bank, ghișeul.ro, or DGPCI cash desks.', isFixed: true, sourceId: 'dgpci-exchange' }
      ],
      timeline: [],
      exceptions: ['Expired licenses cannot be exchanged.'],
      limitations: []
    },
    {
      id: 'iranian-issued-licence',
      title: 'Converting an Iranian Driving License in Romania',
      appliesTo: ['Iranian citizens holding a valid Iranian Driving License and a Romanian Residence Permit (Permis de Ședere)'],
      residenceCondition: 'Valid temporary or permanent residence permit in Romania',
      authority: 'DGPCI',
      requiresExamination: false,
      requiresMedical: 'required', // Needed for new administrative validity
      documents: [
        { name: 'Original valid Iranian license + copy', isMandatory: true },
        { name: 'Notarized Romanian translation of license', isMandatory: true },
        { name: 'Valid Romanian residence permit + copy', isMandatory: true },
        { name: 'Valid passport + copy', isMandatory: true },
        { name: 'Certified medical fitness form (Fișa Medicală) for a new administrative validity', isMandatory: true },
        { name: 'Receipt of DGPCI issuance fee', isMandatory: true },
        { name: 'Completed official DGPCI application form', isMandatory: true }
      ],
      steps: [
        { title: 'Authenticity Verification', description: 'The competent Romanian authority manages the verification process with the issuing state. Authenticity and validity must be confirmed. Additional documents may be requested.', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'Legal Translation', description: 'Official translation of the Iranian license by an authorized Romanian translator.', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'Medical Exam', description: 'Complete medical driving checks at a DGPCI accredited clinic.', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'DGPCI Application', description: 'Submit the completed file to the provincial DGPCI office, pay the issuance fee, and receive the registration receipt.', status: 'VERIFIED', reviewDate: '2026-08-05' }
      ],
      fees: [
        { amount: '89', currency: 'RON', description: 'DGPCI Issuance Fee for Exchange. Payable via CEC Bank, ghișeul.ro, or DGPCI cash desks.', isFixed: true, sourceId: 'dgpci-exchange' }
      ],
      timeline: [
        { duration: 'Varies', description: 'Duration varies depending on the verification of authenticity and validity from the issuing state. The applicant should confirm current requirements with the competent county service.', isGuaranteed: false }
      ],
      exceptions: ['Expired licenses cannot be exchanged.'],
      limitations: ['You cannot hold both licenses simultaneously. Your Iranian license will be retained.'],
      actionLink: { url: 'https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf', label: 'DGPCI Official Portal' }
    },
    {
      id: 'obtain-romanian-licence-from-scratch',
      title: 'Obtaining a Driving License from Scratch',
      appliesTo: ['Foreigners who do not hold any driving license', 'Holders of non-exchangeable or expired foreign licenses'],
      residenceCondition: 'Must have a valid Romanian residence permit.',
      requiresExamination: true,
      requiresMedical: 'required',
      documents: [
        { name: 'Valid Romanian Residence Permit', isMandatory: true },
        { name: 'Medical and Psychological Certificates', isMandatory: true },
        { name: 'Criminal Record Certificate (Cazier Judiciar)', isMandatory: true },
        { name: 'Driving School Completion Certificate', isMandatory: true }
      ],
      steps: [
        { title: 'Enroll in a Driving School', description: 'Find a licensed driving school. Some schools in major cities offer instruction in English.', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'Medical & Psychological Tests', description: 'Pass the required fitness and psychological tests.', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'Theory Test', description: 'Pass the computerized theory test (Sala).', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'Practical Test', description: 'Pass the on-road driving test with a police examiner.', status: 'VERIFIED', reviewDate: '2026-08-05' }
      ],
      fees: [
        { amount: '89', currency: 'RON', description: 'DGPCI License Issuance Fee. Payable via CEC Bank, ghișeul.ro, or DGPCI cash desks.', isFixed: true, sourceId: 'dgpci-exam' }
      ],
      timeline: [],
      exceptions: [],
      limitations: []
    },
    {
      id: 'renew-romanian-licence',
      title: 'Renew Romanian Licence',
      appliesTo: ['Holders of a Romanian Driving License approaching expiry'],
      residenceCondition: 'Must have a valid Romanian residence permit or citizenship.',
      requiresExamination: false,
      requiresMedical: 'required',
      documents: [],
      steps: [],
      fees: [
        { amount: '89', currency: 'RON', description: 'DGPCI License Issuance Fee for Renewal. Payable via CEC Bank, ghișeul.ro, or DGPCI.', isFixed: true, sourceId: 'dgpci-renewal' }
      ],
      timeline: [],
      exceptions: [],
      limitations: []
    },
        {
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
    },
    {
      id: 'penalties-suspension-and-restrictions',
      title: 'Penalties, Suspension, and Restrictions',
      appliesTo: ['Any driver operating a vehicle in Romania'],
      residenceCondition: 'None',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [],
      steps: [],
      fees: [],
      timeline: [],
      exceptions: [],
      limitations: []
    }
  ]
};
