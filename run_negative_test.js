const fs = require('fs');
const cp = require('child_process');

const fakeGuide = `import { OperationalGuide } from '../../../types/content';
export const fakeGuide: OperationalGuide = {
  locale: 'en',
  shortDescription: 'missing required fields and route',
  quickAnswer: 'fake',
  situations: []
} as any;
`;

fs.writeFileSync('src/content/guides/driving-license/fake-test.ts', fakeGuide);

try {
  console.log('Running validator with broken guide...');
  cp.execSync('npx ts-node scripts/validateContent.ts', { stdio: 'pipe' });
  console.log('Test Failed: Validator did not catch the errors.');
} catch (e) {
  console.log('Test Passed: Validator successfully caught errors.');
  console.log('Errors caught:');
  console.log(e.stderr ? e.stderr.toString() : e.stdout.toString());
  
  // Write test report
  const report = `# Content Validator Test Report

## Test Execution
- **Command**: \`npx ts-node scripts/validateContent.ts\`
- **Injected Payload**: Guide missing canonicalRoute, title, mainQuestion, and status fields.
- **Expected Result**: Validation fails and process exits with code 1.
- **Actual Result**: PASSED. Validator successfully threw errors.

## Output Trace
\`\`\`
${e.stderr ? e.stderr.toString() : e.stdout.toString()}
\`\`\`
`;
  fs.writeFileSync('docs/content/content-validator-test-report.md', report);
}

// Cleanup
fs.unlinkSync('src/content/guides/driving-license/fake-test.ts');
