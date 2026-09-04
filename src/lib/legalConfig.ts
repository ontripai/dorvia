export const legalOperatorConfig = {
  legalEntityName: '', // e.g., 'DORVIA EUROP S.R.L.'
  registrationNumber: '', // e.g., 'CUI XXXXXXXX'
  registeredAddress: '', // e.g., 'Bucharest, Romania'
  privacyContactEmail: 'ontrip.ai@gmail.com', // Active fallback until formal DPO
  generalContactEmail: 'ontrip.ai@gmail.com',
  governingJurisdiction: '', // e.g., 'Romania and European Union'
  privacyPolicyUpdatedAt: '2026-08-04',
  retentionPolicy: 'Unconverted enquiries: Delete or anonymise 30 days after last meaningful contact.'
};

export const hasVerifiedLegalEntity = () => {
  // Local dev and Vercel Preview deployments are not public-facing production
  // traffic, so allow full end-to-end testing there even while the legal
  // entity is still being registered. Production (the public domain) keeps
  // the real check — do not bypass it there.
  const isTestableEnvironment =
    process.env.NODE_ENV !== 'production' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';

  if (isTestableEnvironment) {
    return true;
  }

  return (
    legalOperatorConfig.legalEntityName !== '' &&
    legalOperatorConfig.registrationNumber !== '' &&
    legalOperatorConfig.registeredAddress !== '' &&
    legalOperatorConfig.governingJurisdiction !== ''
  );
};
