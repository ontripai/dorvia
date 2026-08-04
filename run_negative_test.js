const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

const content = `
import { OperationalGuide } from '../../../types/content';

export const drivingLicenseEN: OperationalGuide = {
  canonicalRoute: '/needs/driving-license',
  locale: 'en',
  title: 'Driving License in Romania',
  shortDescription: 'desc',
  mainQuestion: 'Q',
  quickAnswer: 'A',
  targetAudience: [],
  generalExceptions: [],
  commonProblems: [],
  warnings: [],
  officialSources: [
    {
      id: 'dgpci-exchange',
      url: 'foo'
    },
    {
      id: 'dgpci-exchange',
      url: 'bar'
    }
  ],
  relatedGuides: [],
  lastReviewed: '2026',
  nextReview: '2027',
  contentOwner: 'Me',
  contentStatus: 'published',
  factCheckStatus: 'UNRESOLVED', // UNRESOLVED without warnings
  riskCategory: ['LEGAL'],
  
  situations: [
    {
      id: 'temporary-foreign-licence-use'
    },
    {
      id: 'foreign-licence-exchange',
      fees: [
        { amount: '89', isFixed: true } // missing sourceId
      ],
      timeline: [
        { duration: '30 days', isFixed: true } // missing sourceId
      ]
    },
    {
      id: 'obtain-romanian-licence-from-scratch'
    }
    // MISSING: iranian, renew, international, penalties
  ]
};
`;

function extractGuideData(content) {
  let errors = [];

  const requiredScenarioIds = [
    'temporary-foreign-licence-use',
    'foreign-licence-exchange',
    'iranian-issued-licence',
    'obtain-romanian-licence-from-scratch',
    'renew-romanian-licence',
    'international-driving-permit',
    'penalties-suspension-and-restrictions'
  ];

  // 3. No UNRESOLVED claims without a warning
  if (content.includes('UNRESOLVED') && !content.includes('warnings: [')) {
    // Actually the mock has `warnings: []` so it will pass the naive check. 
    // Let's refine the mock to not have warnings: [ 'something' ].
    if (!content.includes('warnings: [\'') && !content.includes('warnings: ["')) {
       errors.push('UNRESOLVED claim found without a visible warning array');
    }
  }

  const sourceMatches = content.match(/id:\s*['"]([^'"]+)['"]/g);
  let sourceIds = [];
  if (sourceMatches) {
    sourceIds = sourceMatches.map(m => m.match(/['"]([^'"]+)['"]/)?.[1]);
    const duplicates = sourceIds.filter((item, index) => sourceIds.indexOf(item) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate source IDs found: ${duplicates.join(', ')}`);
    }
  }
  
  for (const reqId of requiredScenarioIds) {
    if (!content.includes(`id: '${reqId}'`) && !content.includes(`id: "${reqId}"`)) {
      errors.push(`Missing required scenario ID: ${reqId}`);
    }
  }

  const feeBlocks = content.split('fees: [')[1]?.split(']')[0] || '';
  if (feeBlocks) {
    const individualFees = feeBlocks.split('},').map(s => s + '}');
    individualFees.forEach((feeStr, idx) => {
      if (feeStr.includes('isFixed: true') && !feeStr.includes('sourceId:')) {
        errors.push(`Fixed fee entry missing sourceId reference in block index ${idx}`);
      }
    });
  }
  
  const timelineBlocks = content.split('timeline: [')[1]?.split(']')[0] || '';
  if (timelineBlocks) {
    const individualTimelines = timelineBlocks.split('},').map(s => s + '}');
    individualTimelines.forEach((tStr, idx) => {
      if (tStr.includes('isFixed: true') && !tStr.includes('sourceId:')) {
         errors.push(`Fixed timeline entry missing sourceId reference in block index ${idx}`);
      }
    });
  }
  
  return errors;
}

const errors = extractGuideData(content);
console.log('Errors caught:');
errors.forEach(e => console.log('- ' + e));
