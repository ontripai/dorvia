const fs = require('fs');
const path = require('path');

const docs = {
  'operational-guide-standard.md': '# Operational Guide Standard\n\nAll operational guides must adhere to the typed `OperationalGuide` interface in `src/types/content.ts`.\n\n## Principles\n1. **Data-Driven**: Guides are structurally separated from UI components.\n2. **Bilingual Parity**: English and Persian MUST contain the exact same substantive steps and facts.\n3. **Scenario-Based**: Complex processes (like licenses or visas) must be broken down into discrete scenarios.\n4. **No Commercial Bias**: Guides must not contain CTA elements to commercial services unless strictly legally required by the process.\n',
  'source-and-claim-policy.md': '# Source & Claim Policy\n\n## Principle of Verifiability\nEvery material factual claim regarding:\n- State Fees\n- Administrative Deadlines\n- Legal Requirements\n- Mandatory Documents\n\nMust be tied to a primary official source or explicitly qualified if derived from secondary practice.\n\n## Forbidden Wording\n- تضمینی (Guaranteed)\n- صددرصد (100% certainty)\n- بدون مشکل (Without issues)\n',
  'content-lifecycle.md': '# Content Lifecycle\n\n1. **Draft**: Content is typed but missing sources.\n2. **Editorial Review**: Language style and grammar checked.\n3. **Fact-Check Review**: Claims mapped to official sources.\n4. **Approved**: Final legal check passed.\n5. **Published**: Live on production.\n6. **Archived**: Outdated content removed from canonical paths.\n',
  'fact-check-workflow.md': '# Fact Check Workflow\n\n1. Identify all claims (fees, timelines, steps).\n2. Attempt to locate primary Romanian legislation or MAI/IGI directives.\n3. If primary source is found, link it in `officialSources`.\n4. If primary source cannot be found, use a verified secondary source (e.g., trusted law firm) and flag the fee/timeline as `isFixed: false` or `isGuaranteed: false`.\n',
  'review-frequency.md': '# Review Frequency\n\nGuides are assigned a `RiskCategory` that dictates review frequency:\n\n- **IMMIGRATION / LEGAL / TAX**: Review every 6 months.\n- **FINANCIAL / MEDICAL**: Review every 12 months.\n- **CONSUMER / EDUCATION**: Review every 12-24 months.\n',
  'driving-license-claim-resolution.md': '# Driving License Claim Resolution\n\n## DGPCI Fee\n- **Claim**: 89 RON for issuance.\n- **Resolution**: Verified against DGPCI official fee schedule. `isFixed: true`.\n\n## Medical Certificate\n- **Claim**: 150-250 RON.\n- **Resolution**: Verified as a market rate for accredited clinics. `isFixed: false`.\n\n## Timeline\n- **Claim**: 30-90 Days for Iranian license exchange.\n- **Resolution**: Qualified as variable due to embassy verification dependencies. `isGuaranteed: false`.\n',
  'driving-license-source-register.md': '# Driving License Source Register\n\n- **Source 1**: DGPCI Official Site (https://dgpci.mai.gov.ro/document-details/permise/5b35f29910a30b538053a4cf)\n- **Source 2**: Ordinul MAI 163/2011 (https://legislatie.just.ro/Public/DetaliiDocument/131062)\n',
  'DRE-P2-CONTENT-SYSTEM-T01-M01-change-log.md': '# Change Log: DRE-P2-CONTENT-SYSTEM-T01-M01\n\n- Created strict TypeScript data model for operational guides.\n- Replaced hardcoded UI for `/needs/driving-license` with reusable atomic components.\n- Enforced bilingual parity for driving license content.\n- Audited claims regarding DGPCI fees and procedures.\n- Established content governance documentation.\n'
};

const docsDir = path.join(__dirname, 'docs', 'content');

for (const [filename, content] of Object.entries(docs)) {
  fs.writeFileSync(path.join(docsDir, filename), content);
}
console.log('Governance documents created successfully.');
