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
  const isTestableEnvironment =
    process.env.NODE_ENV !== 'production' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';

  if (isTestableEnvironment) {
    return true;
  }

  // TEMPORARY: the site is not indexed and has no public users yet — several
  // people are internally testing on the live production URL right now.
  // Set NEXT_PUBLIC_ALLOW_UNVERIFIED_TESTING=true in Vercel's Production
  // environment variables to open the gate there too. REMOVE this env var
  // (or just leave it unset) once legalOperatorConfig below is filled in
  // with the real registered SRL details — at that point the real check
  // below will pass on its own and this override becomes unnecessary.
  if (process.env.NEXT_PUBLIC_ALLOW_UNVERIFIED_TESTING === 'true') {
    return true;
  }

  return (
    legalOperatorConfig.legalEntityName !== '' &&
    legalOperatorConfig.registrationNumber !== '' &&
    legalOperatorConfig.registeredAddress !== '' &&
    legalOperatorConfig.governingJurisdiction !== ''
  );
};
