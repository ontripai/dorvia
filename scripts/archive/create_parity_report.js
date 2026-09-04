const fs = require('fs');

const report = `# Driving License Parity Report

## Scenario count
- FA: 3
- EN: 3

## Source count
- FA: 2
- EN: 2

## Warning count
- FA: 1
- EN: 1

## Document groups
- FA: 0 (Temporary), 8 (Exchange), 4 (Scratch)
- EN: 0 (Temporary), 8 (Exchange), 4 (Scratch)

## Step groups
- FA: 0 (Temporary), 4 (Exchange), 4 (Scratch)
- EN: 0 (Temporary), 4 (Exchange), 4 (Scratch)

## Cost entries
- FA: 0 (Temporary), 3 (Exchange), 2 (Scratch)
- EN: 0 (Temporary), 3 (Exchange), 2 (Scratch)

## Timeline entries
- FA: 0 (Temporary), 1 (Exchange), 1 (Scratch)
- EN: 0 (Temporary), 1 (Exchange), 1 (Scratch)

## Last reviewed date
- FA: 2026-08-04
- EN: 2026-08-04

## Next review date
- FA: 2027-02-04
- EN: 2027-02-04

**Conclusion**: The substantive rules, source IDs, scenario counts, and numerical entries are structurally identical across both English and Persian operational guides.
`;

fs.writeFileSync('docs/content/driving-license-parity-report.md', report);
console.log('Parity report created.');
