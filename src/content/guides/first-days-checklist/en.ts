import { OperationalGuide } from '../../../types/content';

export const firstDaysChecklistEN: OperationalGuide = {
  canonicalRoute: '/needs/first-days-checklist',
  locale: 'en',
  title: 'First-Days Arrival Checklist in Romania',
  shortDescription: 'Essential steps for your first 72 hours, 7 days, and beyond in Romania, covering immediate practicalities and legal deadlines.',
  mainQuestion: 'What administrative and practical steps must I take immediately after arriving in Romania?',
  quickAnswer: 'Start by securing connectivity and local currency. Finalize your long-term housing contract to enable registration. You must submit your residence application at least 30 days before the expiry of your current legal right of stay (if required by your visa).',
  targetAudience: ['International Students', 'Foreign Workers', 'Family Members', 'EU/EEA Citizens', 'Short-Stay Visitors'],
  generalExceptions: [
    'Short-stay visa holders (Type C) are not eligible to apply for a residence permit (Permis de Ședere) and cannot open a standard resident bank account.',
    'EU/EEA citizens do not need a visa but must register their residence (CNP) if staying longer than 3 months.'
  ],
  commonProblems: [
    'Attempting to open a bank account without a finalized housing contract or official ANAF registration.',
    'Missing the legal deadline to apply for a residence permit before the current visa expires.'
  ],
  warnings: [
    'Do not wait until the last week of your visa to apply for a residence permit. IGI appointments must be booked in advance, and late applications may incur fines or deportation.',
    'Health insurance coverage rules for dependents and students are complex and strictly enforced. Confirm your status with CNAS directly.'
  ],
  officialSources: [
    {
      id: 'igi-fees-august-2025',
      sourceTitle: 'IGI - Official August 2025 Fee Announcement',
      organization: 'Inspectoratul General pentru Imigrări',
      url: 'https://igi.mai.gov.ro/en/taxes/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['student-arrival', 'employee-arrival', 'family-reunification', 'family-romanian-citizen', 'company-owner']
    },
    {
      id: 'igi-student',
      sourceTitle: 'IGI - Residence Permits for Studies',
      organization: 'Inspectoratul General pentru Imigrări',
      url: 'https://igi.mai.gov.ro/en/studies/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['student-arrival']
    },
    {
      id: 'igi-work',
      sourceTitle: 'IGI - Residence Permits for Employment',
      organization: 'Inspectoratul General pentru Imigrări',
      url: 'https://igi.mai.gov.ro/en/employment/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['employee-arrival']
    },
    {
      id: 'mae-family-visa',
      sourceTitle: 'MAE - Family Reunification Visa',
      organization: 'Ministry of Foreign Affairs',
      url: 'https://www.mae.ro/en/node/2051',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['family-reunification']
    },
    {
      id: 'igi-family-permit',
      sourceTitle: 'IGI - Family Reunification Residence Permit',
      organization: 'Inspectoratul General pentru Imigrări',
      url: 'https://igi.mai.gov.ro/en/family-reunification/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['family-reunification']
    },
    {
      id: 'igi-family-ro-permit',
      sourceTitle: 'IGI - Family Members of Romanian Citizens',
      organization: 'Inspectoratul General pentru Imigrări',
      url: 'https://igi.mai.gov.ro/en/family-members-of-romanian-citizens/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['family-romanian-citizen']
    },
    {
      id: 'igi-eu',
      sourceTitle: 'IGI - Citizens of EU/EEA and Swiss Confederation',
      organization: 'Inspectoratul General pentru Imigrări',
      url: 'https://igi.mai.gov.ro/en/citizens-of-the-eu-eea-and-the-swiss-confederation/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'low',
      applicableScenarioIds: ['eu-citizen-arrival']
    },
    {
      id: 'igi-business',
      sourceTitle: 'IGI - Commercial Activities',
      organization: 'Inspectoratul General pentru Imigrări',
      url: 'https://igi.mai.gov.ro/en/commercial-activities/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['company-owner']
    },
    {
      id: 'mae-visas',
      sourceTitle: 'MAE - Short Stay Visas',
      organization: 'Ministry of Foreign Affairs',
      url: 'https://www.mae.ro/en/node/2035',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'low',
      applicableScenarioIds: ['short-stay-visitor']
    },
    {
      id: 'igi-hosting-notification',
      sourceTitle: 'IGI - Hosting and Accommodation Notification',
      organization: 'Inspectoratul General pentru Imigrări',
      url: 'https://igi.mai.gov.ro/en/hosting-foreigners/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['short-stay-visitor']
    },
    {
      id: 'igi-general-renewal',
      sourceTitle: 'IGI - General Extension of Right of Stay',
      organization: 'Inspectoratul General pentru Imigrări',
      url: 'https://igi.mai.gov.ro/en/extension-of-the-right-of-stay/',
      sourceType: 'official-website',
      language: 'en',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'medium',
      applicableScenarioIds: ['existing-residence-holder']
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
      id: 'cnas-insurance-general',
      sourceTitle: 'CNAS - National Health Insurance General Info',
      organization: 'Casa Națională de Asigurări de Sănătate',
      url: 'https://cnas.ro/',
      sourceType: 'official-website',
      language: 'ro',
      dateAccessed: '2026-08-05',
      status: 'primary',
      volatility: 'high',
      scopeAndExceptions: 'Requires professional legal review for specific eligibility mapping.',
      applicableScenarioIds: ['family-reunification']
    }
  ],
  relatedGuides: [
    { route: '/needs/banking', title: 'Bank Account Opening' },
    { route: '/needs/housing', title: 'Renting & Buying Property' },
    { route: '/immigration/igi-process', title: 'IGI Residency Process' }
  ],
  lastReviewed: '2026-08-05',
  nextReview: '2027-02-05',
  contentOwner: 'DORVIA EUROP Content Team',
  contentStatus: 'draft',
  factCheckStatus: 'partially-verified',
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
        { name: 'Passport with valid Type D/SD visa', isMandatory: true, claimId: 'c-student-doc-1', sourceId: 'igi-student', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'University Acceptance Letter', isMandatory: true, claimId: 'c-student-doc-2', sourceId: 'igi-student', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Housing contract (registered at ANAF or notarized)', isMandatory: true, claimId: 'c-student-doc-3', sourceId: 'anaf-contracts', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Medical certificate from a clinic', isMandatory: true, claimId: 'c-student-doc-4', sourceId: 'igi-student', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'Upon Arrival: Connectivity', description: 'Purchase a local SIM card.', claimId: 'c-student-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'First 7 Days: University & Housing', description: 'Formalize enrollment at your university and ensure the landlord registers your housing contract with ANAF.', claimId: 'c-student-step-2', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'anaf-contracts' },
        { title: 'Practical: Bank Account', description: 'Open a local bank account to handle tuition and living expenses.', claimId: 'c-student-step-3', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'Legal Deadline: IGI Residence Application', description: 'Submit the residence application via the IGI portal at least 30 days before the expiry of your current legal right of stay.', claimId: 'c-student-step-4', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-student', authority: 'IGI' }
      ],
      fees: [
        { amount: '265', currency: 'RON', description: 'Residence permit issuance fee', isFixed: true, sourceId: 'igi-fees-august-2025' },
        { amount: '120', currency: 'EUR', description: 'Consular tax equivalent', isFixed: true, sourceId: 'igi-fees-august-2025' }
      ],
      timeline: [
        { duration: '30-45 Days', description: 'Estimated IGI processing time after document submission.', isGuaranteed: false, sourceId: 'igi-student' }
      ],
      exceptions: ['Scholarship students may be exempt from consular fees.'],
      limitations: []
    },
    {
      id: 'employee-arrival',
      title: 'Foreign Workers (Type D/AM Visa)',
      appliesTo: ['Employees with an Aviz de Muncă', 'Highly skilled workers'],
      residenceCondition: 'Entering Romania on a Type D/AM visa',
      authority: 'IGI & ITM',
      requiresExamination: false,
      requiresMedical: 'required',
      medicalConditionText: 'Occupational health check required for employment contract.',
      documents: [
        { name: 'Passport with valid Type D/AM visa', isMandatory: true, claimId: 'c-work-doc-1', sourceId: 'igi-work', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Work Permit (Aviz de Muncă)', isMandatory: true, claimId: 'c-work-doc-2', sourceId: 'igi-work', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Employment Contract registered in REVISAL', isMandatory: true, claimId: 'c-work-doc-3', sourceId: 'igi-work', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Housing contract registered at ANAF', isMandatory: true, claimId: 'c-work-doc-4', sourceId: 'anaf-contracts', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'Upon Arrival: Contract Signing', description: 'Report to your employer to sign the individual employment contract (CIM).', claimId: 'c-work-step-1', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-work' },
        { title: 'First 7 Days: Medical Check & Housing', description: 'Complete the occupational health exam (Medicina Muncii) arranged by your employer. Ensure housing ANAF registration.', claimId: 'c-work-step-2', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'anaf-contracts' },
        { title: 'Practical: Salary Account', description: 'Open a bank account to receive your salary.', claimId: 'c-work-step-3', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'Legal Deadline: IGI Residence Application', description: 'Submit the residence application via the IGI portal at least 30 days before the expiry of your visa.', claimId: 'c-work-step-4', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-work', authority: 'IGI' }
      ],
      fees: [
        { amount: '265', currency: 'RON', description: 'Residence permit issuance fee', isFixed: true, sourceId: 'igi-fees-august-2025' },
        { amount: '120', currency: 'EUR', description: 'Consular tax equivalent', isFixed: true, sourceId: 'igi-fees-august-2025' }
      ],
      timeline: [
        { duration: '30 Days', description: 'Estimated IGI processing time after interview.', isGuaranteed: false, sourceId: 'igi-work' }
      ],
      exceptions: ['EU Blue Card applicants may have different processing times.'],
      limitations: ['You may only work for the employer specified on your Aviz de Muncă.']
    },
    {
      id: 'family-reunification',
      title: 'Family Reunification (Non-EU Sponsor)',
      appliesTo: ['Spouses of non-EU residents', 'Dependent children of non-EU residents'],
      residenceCondition: 'Entering on a Type D/VF visa',
      authority: 'IGI',
      requiresExamination: false,
      requiresMedical: 'conditional',
      medicalConditionText: 'A medical certificate proving you do not suffer from contagious diseases is required.',
      documents: [
        { name: 'Passport with valid Type D/VF visa', isMandatory: true, claimId: 'c-fam1-doc-1', sourceId: 'mae-family-visa', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Sponsor\'s Residence Permit', isMandatory: true, claimId: 'c-fam1-doc-2', sourceId: 'igi-family-permit', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Marriage or Birth Certificate (Apostilled/Translated)', isMandatory: true, claimId: 'c-fam1-doc-3', sourceId: 'igi-family-permit', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Proof of housing and sufficient funds', isMandatory: true, claimId: 'c-fam1-doc-4', sourceId: 'igi-family-permit', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'Practical: Settling In', description: 'Obtain a local SIM card and add the family member to household utility bills if required for proof of housing.', claimId: 'c-fam1-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'Health Insurance (Co-asigurat)', description: 'Apply for co-insured status at CNAS for public health coverage.', claimId: 'c-fam1-step-2', status: 'QUALIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'cnas-insurance-general', authority: 'CNAS' },
        { title: 'Legal Deadline: IGI Residence Application', description: 'Submit the application for a family reunification residence permit via the IGI portal at least 30 days before the visa expires.', claimId: 'c-fam1-step-3', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-family-permit', authority: 'IGI' }
      ],
      fees: [
        { amount: '265', currency: 'RON', description: 'Residence permit issuance fee', isFixed: true, sourceId: 'igi-fees-august-2025' },
        { amount: '120', currency: 'EUR', description: 'Consular tax equivalent', isFixed: true, sourceId: 'igi-fees-august-2025' }
      ],
      timeline: [
        { duration: '30-60 Days', description: 'Estimated IGI processing time.', isGuaranteed: false, sourceId: 'igi-family-permit' }
      ],
      exceptions: [],
      limitations: []
    },
    {
      id: 'family-romanian-citizen',
      title: 'Family of Romanian Citizens',
      appliesTo: ['Spouses of Romanian citizens', 'Dependent children of Romanian citizens'],
      residenceCondition: 'Applying for residence based on marriage/relation to a RO citizen',
      authority: 'IGI',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'Passport (Visa if required by nationality)', isMandatory: true, claimId: 'c-fam2-doc-1', sourceId: 'igi-family-ro-permit', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Romanian ID of the sponsor', isMandatory: true, claimId: 'c-fam2-doc-2', sourceId: 'igi-family-ro-permit', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Romanian Marriage/Birth Certificate', isMandatory: true, claimId: 'c-fam2-doc-3', sourceId: 'igi-family-ro-permit', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'Legal Deadline: IGI Residence Application', description: 'Submit the application for residence permit via the IGI portal at least 30 days before the expiry of your current legal right of stay.', claimId: 'c-fam2-step-1', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-family-ro-permit', authority: 'IGI' }
      ],
      fees: [
        { amount: '265', currency: 'RON', description: 'Residence permit issuance fee', isFixed: true, sourceId: 'igi-fees-august-2025' }
      ],
      timeline: [
        { duration: '30-90 Days', description: 'Estimated IGI processing time.', isGuaranteed: false, sourceId: 'igi-family-ro-permit' }
      ],
      exceptions: ['Family members joining a Romanian citizen are exempt from the consular tax.'],
      limitations: []
    },
    {
      id: 'company-owner',
      title: 'Company Owners / Investors',
      appliesTo: ['Administrators or shareholders of a Romanian SRL'],
      residenceCondition: 'Applying for residence based on commercial activities',
      authority: 'IGI & Ministry of Economy',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'Passport with Type D visa (if applicable)', isMandatory: true, claimId: 'c-biz-doc-1', sourceId: 'igi-business', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'ONRC Company Registration Documents', isMandatory: true, claimId: 'c-biz-doc-2', sourceId: 'igi-business', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'FDI Approval (if required)', isMandatory: true, claimId: 'c-biz-doc-3', sourceId: 'igi-business', reviewDate: '2026-08-05', status: 'QUALIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'Practical: Corporate Bank Account', description: 'Finalize corporate banking arrangements for share capital and operations.', claimId: 'c-biz-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'Legal Deadline: IGI Residence Application', description: 'Submit the application for residence via the IGI portal at least 30 days before your visa expires.', claimId: 'c-biz-step-2', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-business', authority: 'IGI' }
      ],
      fees: [
        { amount: '265', currency: 'RON', description: 'Residence permit issuance fee', isFixed: true, sourceId: 'igi-fees-august-2025' },
        { amount: '120', currency: 'EUR', description: 'Consular tax equivalent', isFixed: true, sourceId: 'igi-fees-august-2025' }
      ],
      timeline: [
        { duration: '30-45 Days', description: 'Estimated IGI processing time.', isGuaranteed: false, sourceId: 'igi-business' }
      ],
      exceptions: [],
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
        { name: 'Valid National ID or Passport', isMandatory: true, claimId: 'c-eu-doc-1', sourceId: 'igi-eu', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Proof of employment, study, or sufficient funds', isMandatory: true, claimId: 'c-eu-doc-2', sourceId: 'igi-eu', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Proof of housing', isMandatory: true, claimId: 'c-eu-doc-3', sourceId: 'igi-eu', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'Practical: Basic Setup', description: 'Purchase a local SIM card if needed. Use your home EU bank accounts freely.', claimId: 'c-eu-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'Legal Deadline: IGI Registration (CNP)', description: 'If intending to stay longer than 3 months, apply for a Registration Certificate (Certificat de Înregistrare) before the 90-day mark.', claimId: 'c-eu-step-2', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-eu', authority: 'IGI' }
      ],
      fees: [],
      timeline: [
        { duration: 'Same day', description: 'The Registration Certificate is usually issued on the same day the complete file is submitted.', isGuaranteed: true, sourceId: 'igi-eu' }
      ],
      exceptions: ['EU citizens do not receive a classic "Permis de Ședere", they receive a "Certificat de Înregistrare".'],
      limitations: []
    },
    {
      id: 'short-stay-visitor',
      title: 'Short-Stay Visitors (Type C Visa / Visa-Exempt)',
      appliesTo: ['Tourists', 'Business visitors', 'Short-term family visits (under 90 days)'],
      residenceCondition: 'Maximum 90 days in any 180-day period.',
      authority: 'Border Police & MAE',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'Valid Passport and Visa (if applicable)', isMandatory: true, claimId: 'c-short-doc-1', sourceId: 'mae-visas', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Travel Medical Insurance', isMandatory: true, claimId: 'c-short-doc-2', sourceId: 'mae-visas', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'Practical: Connectivity', description: 'Obtain a prepaid SIM card (does not require a residence permit).', claimId: 'c-short-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'Legal: Accommodation Registration', description: 'Any foreigner entering Romania who does not stay in a hotel or licensed tourism accommodation must declare their stay to the local police within 3 days. Hotels register tourists automatically.', claimId: 'c-short-step-2', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-hosting-notification', authority: 'IGI' }
      ],
      fees: [],
      timeline: [],
      exceptions: ['You cannot apply for a residence permit while on a Type C short-stay visa.'],
      limitations: ['Cannot work legally.', 'Cannot extend stay beyond 90 days in a 180-day period.']
    },
    {
      id: 'existing-residence-holder',
      title: 'Existing Residence Document Holder',
      appliesTo: ['Individuals returning to Romania with a valid permit'],
      residenceCondition: 'Re-entry with a valid Permis de Ședere',
      authority: 'IGI',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [
        { name: 'Valid Passport', isMandatory: true, claimId: 'c-exist-doc-1', sourceId: 'igi-general-renewal', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' },
        { name: 'Valid Residence Permit', isMandatory: true, claimId: 'c-exist-doc-2', sourceId: 'igi-general-renewal', reviewDate: '2026-08-05', status: 'VERIFIED_LEGAL_REQUIREMENT' }
      ],
      steps: [
        { title: 'Practical: Verify Expiry', description: 'Check the physical expiry date printed on your residence permit immediately upon arrival.', claimId: 'c-exist-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'Legal: Renewal Deadline', description: 'Renewal applications must be submitted at least 30 days before the expiry date of your current residence permit.', claimId: 'c-exist-step-2', status: 'VERIFIED_LEGAL_REQUIREMENT', reviewDate: '2026-08-05', sourceId: 'igi-general-renewal', authority: 'IGI' }
      ],
      fees: [],
      timeline: [],
      exceptions: [],
      limitations: []
    },
    {
      id: 'no-accommodation',
      title: 'Arrival without Finalized Accommodation',
      appliesTo: ['New arrivals staying in hotels or temporary Airbnbs'],
      residenceCondition: 'Seeking long-term rent',
      authority: 'None',
      requiresExamination: false,
      requiresMedical: 'not-required',
      documents: [],
      steps: [
        { title: 'Practical: Search for Housing', description: 'Use platforms like Imobiliare.ro or Storia to find long-term housing. Do not sign a lease without viewing the property.', claimId: 'c-noacc-step-1', status: 'RECOMMENDED_PRACTICAL_ACTION', reviewDate: '2026-08-05' },
        { title: 'Dependency: Bank Account', description: 'Be aware that most banks require a finalized registered rental contract to open a resident account.', claimId: 'c-noacc-step-2', status: 'PROVIDER_DEPENDENT', reviewDate: '2026-08-05' }
      ],
      fees: [],
      timeline: [],
      exceptions: [],
      limitations: ['Cannot apply for a residence permit until acceptable proof of legal accommodation is secured. The required document varies depending on your specific procedure.']
    }
  ]
};
