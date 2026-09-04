const fs = require('fs');

const enContent = `
import { OperationalGuide } from '../../../types/content';
export const drivingLicenseEN: OperationalGuide = {
  situations: [
    { id: 'temporary-foreign-licence-use' },
    {
      id: 'foreign-licence-exchange',
      requiresMedical: 'not-required', // Trigger
      fees: [ { amount: '89', isFixed: true } ], // Trigger
      timeline: []
    },
    { id: 'iranian-issued-licence' },
    { id: 'obtain-romanian-licence-from-scratch' },
    { id: 'renew-romanian-licence' },
    {
      id: 'international-driving-permit', // Trigger missing sourceId
      fees: [ { amount: '46', isFixed: true } ], // Trigger
      timeline: [ { duration: '30 days', isFixed: true } ] // Trigger
    },
    { id: 'penalties-suspension-and-restrictions' }
  ]
};
`;

const faContent = `
import { OperationalGuide } from '../../../types/content';
export const drivingLicenseFA: OperationalGuide = {
  situations: [
    { id: 'temporary-foreign-licence-use' },
    {
      id: 'foreign-licence-exchange',
      requiresMedical: 'conditional', // Trigger FA/EN mismatch
      medicalConditionText: 'Some condition'
    },
    { id: 'iranian-issued-licence' },
    { id: 'obtain-romanian-licence-from-scratch' },
    { id: 'renew-romanian-licence' },
    {
      id: 'international-driving-permit',
      sourceId: 'dgpci-idp-wrong', // Trigger IDP source mismatch
      fees: [ { amount: '46', isFixed: true, sourceId: 'different-source' } ] 
    },
    { id: 'penalties-suspension-and-restrictions' }
  ]
};
`;

function extractGuideData(content) {
  let errors = [];

  const exchangeMatch = content.match(/id:\s*['"]foreign-licence-exchange['"][\s\S]*?(?=id:\s*['"]|$)/);
  if (exchangeMatch && exchangeMatch[0]) {
    const exchangeBlock = exchangeMatch[0];
    if (exchangeBlock.includes("requiresMedical: 'not-required'")) {
      errors.push("Foreign exchange marked medical not-required without qualification");
    }
  }

  const idpMatch = content.match(/id:\s*['"]international-driving-permit['"][\s\S]*?(?=id:\s*['"]|$)/);
  if (idpMatch && idpMatch[0]) {
    const idpBlock = idpMatch[0];
    if (!idpBlock.includes('sourceId:')) {
      errors.push("IDP scenario missing a dedicated source");
    }
    const idpFees = idpBlock.split('fees: [')[1]?.split(']')[0] || '';
    if (idpFees.includes('isFixed: true') && !idpFees.includes('sourceId:')) {
      errors.push("IDP fixed fee without source");
    }
    const idpTimeline = idpBlock.split('timeline: [')[1]?.split(']')[0] || '';
    if (idpTimeline.includes('isFixed: true') || (!idpTimeline.includes('isGuaranteed: true') && idpTimeline.includes('duration:'))) {
        if (idpTimeline.includes('duration:') && !idpTimeline.includes('sourceId:')) {
            errors.push("IDP fixed deadline without source");
        }
    }
  }
  return errors;
}

function checkParity(enContent, faContent) {
    const errors = [];
    const enExchangeMatch = enContent.match(/id:\s*['"]foreign-licence-exchange['"][\s\S]*?(?=id:\s*['"]|$)/)?.[0] || '';
    const faExchangeMatch = faContent.match(/id:\s*['"]foreign-licence-exchange['"][\s\S]*?(?=id:\s*['"]|$)/)?.[0] || '';
    
    const enMedical = enExchangeMatch.match(/requiresMedical:\s*['"]([^'"]+)['"]/)?.[1];
    const faMedical = faExchangeMatch.match(/requiresMedical:\s*['"]([^'"]+)['"]/)?.[1];
    if (enMedical && faMedical && enMedical !== faMedical) {
        errors.push(`FA/EN medical-condition mismatch: EN=${enMedical}, FA=${faMedical}`);
    }

    const enIdpMatch = enContent.match(/id:\s*['"]international-driving-permit['"][\s\S]*?(?=id:\s*['"]|$)/)?.[0] || '';
    const faIdpMatch = faContent.match(/id:\s*['"]international-driving-permit['"][\s\S]*?(?=id:\s*['"]|$)/)?.[0] || '';
    const enIdpSources = enIdpMatch.match(/sourceId:\s*['"]([^'"]+)['"]/g)?.join(',') || '';
    const faIdpSources = faIdpMatch.match(/sourceId:\s*['"]([^'"]+)['"]/g)?.join(',') || '';
    if (enIdpSources !== faIdpSources) {
        errors.push(`FA/EN IDP source mismatch: EN=${enIdpSources}, FA=${faIdpSources}`);
    }
    
    return errors;
}

console.log('Errors caught in EN:');
extractGuideData(enContent).forEach(e => console.log('- ' + e));
console.log('Parity Errors:');
checkParity(enContent, faContent).forEach(e => console.log('- ' + e));
