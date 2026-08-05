import { OperationalGuide } from '../../../types/content';

export const firstDaysChecklistEN: OperationalGuide = {
  canonicalRoute: '/needs/first-days-checklist',
  locale: 'en',
  title: 'First-Days Arrival Checklist in Romania',
  shortDescription: 'Essential steps for your first 72 hours, 7 days, and 30 days in Romania, including SIM cards, bank accounts, housing, and IGI residence registration.',
  mainQuestion: 'What administrative and practical steps must I take immediately after arriving in Romania?',
  quickAnswer: 'Start by securing a local SIM card and converting a small amount of currency. Within the first week, finalize your housing contract and open a bank account if your status allows. By day 30, you must register your address and apply for your residence permit at IGI, depending on your visa type.',
  targetAudience: ['International Students', 'Foreign Workers', 'Family Members', 'EU/EEA Citizens'],
  generalExceptions: [
    'Short-stay visa holders (Type C) are not required to apply for a residence permit (Permis de Ședere) and cannot open a standard resident bank account.',
    'EU/EEA citizens do not need a visa but must register their residence (CNP for EU citizens) if staying longer than 3 months.'
  ],
  commonProblems: [
    'Attempting to open a bank account without a finalized housing contract or official ANAF registration.',
    'Missing the 30-day deadline before visa expiry to apply for a residence permit at IGI.'
  ],
  warnings: [
    'Do not wait until the last week of your visa to apply for a residence permit. IGI appointments can be booked up weeks in advance.'
  ],
  officialSources: [
    {
      id: 'igi-residence-general',
      sourceTitle: 'General Inspectorate for Immigration (IGI) - Residence Permits',
      organization: 'Inspectoratul General pentru Imigrări',
      url: 'https://igi.mai.gov.ro/en/residence-permits/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary'
    },
    {
      id: 'anaf-contracts',
      sourceTitle: 'ANAF - Registration of Rental Contracts',
      organization: 'Agentia Nationala de Administrare Fiscala',
      url: 'https://www.anaf.ro/anaf/internet/ANAF/asistenta_contribuabili/servicii_oferite_contribuabililor/inregistrare_contracte_locatiune',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-05',
      status: 'primary'
    },
    {
      id: 'cnas-insurance',
      sourceTitle: 'CNAS - National Health Insurance General Info',
      organization: 'Casa Națională de Asigurări de Sănătate',
      url: 'https://cnas.ro/',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-05',
      status: 'primary'
    }
  ],
  relatedGuides: [
    { route: '/needs/banking', title: 'Bank Account Opening' },
    { route: '/needs/housing', title: 'Renting & Buying Property' },
    { route: '/immigration/igi-process', title: 'IGI Residency Process' }
  ],
  lastReviewed: '2026-08-05',
  nextReview: '2027-02-05',
  contentOwner: 'DORVIA EUROP Legal Team',
  contentStatus: 'published',
  factCheckStatus: 'source-verified',
  riskCategory: ['IMMIGRATION', 'LEGAL', 'FINANCIAL'],
  
  situations: [
    {
      id: 'student-arrival',
      title: 'International Students (Type D/SD Visa)',
      appliesTo: ['University students', 'Language preparatory year students'],
      residenceCondition: 'Entering Romania on a Type D/SD visa',
      authority: 'IGI & Ministry of Education',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'Passport with valid Type D/SD visa', isMandatory: true, claimId: 'c-student-doc-1' },
        { name: 'University Acceptance Letter (Letter of Acceptance)', isMandatory: true, claimId: 'c-student-doc-2' },
        { name: 'Housing contract (registered at ANAF or notarized if free accommodation)', isMandatory: true, claimId: 'c-student-doc-3', sourceId: 'anaf-contracts' },
        { name: 'Medical certificate from a university clinic or public hospital', isMandatory: true, claimId: 'c-student-doc-4' }
      ],
      steps: [
        { title: 'First 72 Hours: Communication & Finance', description: 'Purchase a local SIM card (e.g., Orange, Vodafone) using your passport. Exchange a small amount of cash to RON for immediate expenses like transport.', claimId: 'c-student-step-1', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'First 7 Days: University Registration & Housing', description: 'Visit your university\'s international office to formalize your enrollment. Finalize your long-term housing contract; ensure the landlord registers it with ANAF.', claimId: 'c-student-step-2', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'anaf-contracts' },
        { title: 'First 14 Days: Bank Account', description: 'Open a Romanian bank account. Most banks require your passport, visa, housing contract, and university enrollment certificate. Note: Some banks may refuse students from certain jurisdictions without a residence permit.', claimId: 'c-student-step-3', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'First 30 Days: IGI Residence Permit', description: 'Submit your application for a student residence permit (Permis de Ședere) via the IGI portal at least 30 days before your visa expires.', claimId: 'c-student-step-4', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'igi-residence-general', authority: 'IGI' }
      ],
      fees: [
        { amount: '259', currency: 'RON', description: 'Residence permit issuance fee (Taxa permis ședere)', isFixed: true, sourceId: 'igi-residence-general' },
        { amount: '120', currency: 'EUR', description: 'Consular tax equivalent in RON (Taxa consulara) - Exceptions apply for scholarship students', isFixed: true, sourceId: 'igi-residence-general' }
      ],
      timeline: [
        { duration: '30-45 Days', description: 'Standard IGI processing time for student residence permits after document submission.', isGuaranteed: false, sourceId: 'igi-residence-general' }
      ],
      exceptions: ['Students on Romanian government scholarships are exempt from the consular tax.', 'Students under 26 are typically exempt from paying public health insurance (CNAS) contributions.'],
      limitations: []
    },
    {
      id: 'employee-arrival',
      title: 'Foreign Workers (Type D/AM Visa)',
      appliesTo: ['Employees with an Aviz de Muncă', 'Highly skilled workers (EU Blue Card)'],
      residenceCondition: 'Entering Romania on a Type D/AM visa',
      authority: 'IGI & ITM (Territorial Labor Inspectorate)',
      requiresExamination: false,
      requiresMedical: 'required',
      medicalConditionText: 'Occupational health check required for employment contract.',
      documents: [
        { name: 'Passport with valid Type D/AM visa', isMandatory: true, claimId: 'c-work-doc-1' },
        { name: 'Work Permit (Aviz de Muncă)', isMandatory: true, claimId: 'c-work-doc-2' },
        { name: 'Employment Contract registered in REVISAL', isMandatory: true, claimId: 'c-work-doc-3' },
        { name: 'Housing contract registered at ANAF', isMandatory: true, claimId: 'c-work-doc-4', sourceId: 'anaf-contracts' }
      ],
      steps: [
        { title: 'First 72 Hours: Arrival & Contract', description: 'Report to your employer immediately. You must sign the individual employment contract (CIM) and the employer must register it in REVISAL.', claimId: 'c-work-step-1', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'First 7 Days: Medical Check & Housing', description: 'Complete the occupational health exam (Medicina Muncii) arranged by your employer. Secure a long-term rental and ensure ANAF registration.', claimId: 'c-work-step-2', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'anaf-contracts' },
        { title: 'First 14 Days: Bank Account (Salary)', description: 'Open a bank account to receive your salary. Your employer will usually provide a certificate stating you are employed to facilitate this.', claimId: 'c-work-step-3', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'First 30 Days: IGI Residence Permit', description: 'Submit your application for a work purposes residence permit via the IGI portal at least 30 days before your 90-day visa expires.', claimId: 'c-work-step-4', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'igi-residence-general', authority: 'IGI' }
      ],
      fees: [
        { amount: '259', currency: 'RON', description: 'Residence permit issuance fee (Taxa permis ședere)', isFixed: true, sourceId: 'igi-residence-general' },
        { amount: '120', currency: 'EUR', description: 'Consular tax equivalent in RON (Taxa consulara)', isFixed: true, sourceId: 'igi-residence-general' }
      ],
      timeline: [
        { duration: '30 Days', description: 'Standard IGI processing time for employment residence permits after interview.', isGuaranteed: false, sourceId: 'igi-residence-general' }
      ],
      exceptions: ['EU Blue Card applicants may have slightly different processing times and fee structures.'],
      limitations: ['You may only work for the employer specified on your Aviz de Muncă.']
    },
    {
      id: 'family-arrival',
      title: 'Family Reunification (Type D/VF Visa)',
      appliesTo: ['Spouses of residents or citizens', 'Dependent children'],
      residenceCondition: 'Entering Romania on a Type D/VF visa',
      authority: 'IGI',
      requiresExamination: false,
      requiresMedical: 'conditional',
      medicalConditionText: 'A medical certificate proving you do not suffer from contagious diseases is required.',
      documents: [
        { name: 'Passport with valid Type D/VF visa', isMandatory: true, claimId: 'c-fam-doc-1' },
        { name: 'Sponsor\'s Residence Permit or ID (Copy)', isMandatory: true, claimId: 'c-fam-doc-2' },
        { name: 'Marriage or Birth Certificate (Apostilled/Translated)', isMandatory: true, claimId: 'c-fam-doc-3' },
        { name: 'Proof of housing and sufficient funds', isMandatory: true, claimId: 'c-fam-doc-4' }
      ],
      steps: [
        { title: 'First 72 Hours: Settling In', description: 'Obtain a local SIM card. The sponsor should add the family member to the household expenses/utility bills if required for proof of housing.', claimId: 'c-fam-step-1', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'First 14 Days: Health Insurance', description: 'Depending on the sponsor\'s status, apply for co-insured status (co-asigurat) at CNAS so the family member has public health coverage.', claimId: 'c-fam-step-2', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'cnas-insurance', authority: 'CNAS' },
        { title: 'First 30 Days: IGI Residence Permit', description: 'Submit the application for a family reunification residence permit via the IGI portal at least 30 days before the visa expires.', claimId: 'c-fam-step-3', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'igi-residence-general', authority: 'IGI' }
      ],
      fees: [
        { amount: '259', currency: 'RON', description: 'Residence permit issuance fee (Taxa permis ședere)', isFixed: true, sourceId: 'igi-residence-general' },
        { amount: '120', currency: 'EUR', description: 'Consular tax equivalent in RON (Taxa consulara) - Exempt if joining a Romanian citizen', isFixed: true, sourceId: 'igi-residence-general' }
      ],
      timeline: [
        { duration: '30-60 Days', description: 'Standard IGI processing time.', isGuaranteed: false, sourceId: 'igi-residence-general' }
      ],
      exceptions: ['Family members joining a Romanian citizen are exempt from the 120 EUR consular tax.'],
      limitations: []
    },
    {
      id: 'eu-citizen-arrival',
      title: 'EU/EEA & Swiss Citizens',
      appliesTo: ['Citizens of EU, EEA, or Switzerland'],
      residenceCondition: 'No visa required. Registration required for stays > 3 months.',
      authority: 'IGI',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'Valid National ID or Passport', isMandatory: true, claimId: 'c-eu-doc-1' },
        { name: 'Proof of employment, study, or sufficient funds', isMandatory: true, claimId: 'c-eu-doc-2' },
        { name: 'Proof of housing (contract or property deed)', isMandatory: true, claimId: 'c-eu-doc-3' }
      ],
      steps: [
        { title: 'First 72 Hours: Basic Setup', description: 'Purchase a local SIM card if your home plan does not cover extended EU roaming. Most EU citizens can use their home bank accounts temporarily.', claimId: 'c-eu-step-1', status: 'VERIFIED', reviewDate: '2026-08-05' },
        { title: 'Before 90 Days: IGI Registration Certificate (CNP)', description: 'If you intend to stay longer than 3 months, you must register at IGI to obtain a Registration Certificate (Certificat de Înregistrare), which assigns you a CNP (Personal Numeric Code).', claimId: 'c-eu-step-2', status: 'VERIFIED', reviewDate: '2026-08-05', sourceId: 'igi-residence-general', authority: 'IGI' }
      ],
      fees: [],
      timeline: [
        { duration: 'Same day', description: 'The Registration Certificate is usually issued on the same day the complete file is submitted.', isGuaranteed: true, sourceId: 'igi-residence-general' }
      ],
      exceptions: ['EU citizens do not need a visa or a classic "Permis de Ședere", they receive a "Certificat de Înregistrare".'],
      limitations: []
    },
    {
      id: 'short-stay-visitor',
      title: 'Short-Stay Visitors (Type C Visa / Visa-Exempt)',
      appliesTo: ['Tourists', 'Business visitors', 'Short-term family visits (under 90 days)'],
      residenceCondition: 'Maximum 90 days in any 180-day period.',
      authority: 'Border Police',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'Valid Passport and Visa (if applicable)', isMandatory: true, claimId: 'c-short-doc-1' },
        { name: 'Travel Medical Insurance', isMandatory: true, claimId: 'c-short-doc-2' }
      ],
      steps: [
        { title: 'First 72 Hours: Connectivity & Accommodation', description: 'Obtain a prepaid SIM card (does not require a residence permit). Ensure your hotel or host registers your stay, as required by law for tourists.', claimId: 'c-short-step-1', status: 'VERIFIED', reviewDate: '2026-08-05' }
      ],
      fees: [],
      timeline: [],
      exceptions: ['You cannot apply for a residence permit (Permis de Ședere) while on a Type C short-stay visa.', 'You generally cannot open a standard local resident bank account.'],
      limitations: ['Cannot work legally.', 'Cannot extend stay beyond 90 days in a 180-day period.']
    }
  ]
};
