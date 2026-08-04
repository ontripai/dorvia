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
  return (
    legalOperatorConfig.legalEntityName !== '' &&
    legalOperatorConfig.registrationNumber !== '' &&
    legalOperatorConfig.registeredAddress !== '' &&
    legalOperatorConfig.governingJurisdiction !== ''
  );
};
