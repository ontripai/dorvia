import fs from 'fs';
import path from 'path';

const FORBIDDEN_PHRASES = [
  'تضمینی',
  'صددرصد',
  'فوری',
  'پذیرش قطعی',
  'اقامت تجاری',
  'مالیات ۱٪',
  'WHO approved',
  'guaranteed visa',
  'guaranteed residence'
];

interface AuditResult {
  file: string;
  forbiddenFound: string[];
  hasH1: boolean;
  status: 'passed' | 'failed';
}

function runAudit(): void {
  const componentsDir = path.join(process.cwd(), 'src', 'components');
  if (!fs.existsSync(componentsDir)) {
    console.log('Components directory not found.');
    return;
  }

  const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));
  const results: AuditResult[] = [];

  for (const file of files) {
    const filePath = path.join(componentsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const forbiddenFound: string[] = [];
    for (const phrase of FORBIDDEN_PHRASES) {
      if (content.toLowerCase().includes(phrase.toLowerCase())) {
        forbiddenFound.push(phrase);
      }
    }

    const hasH1 = content.includes('<h1');

    results.push({
      file,
      forbiddenFound,
      hasH1,
      status: forbiddenFound.length === 0 ? 'passed' : 'failed'
    });
  }

  console.log('--- Content Audit Summary ---');
  console.log(`Total Files Checked: ${results.length}`);
  const failed = results.filter(r => r.status === 'failed');
  console.log(`Failed Files: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nForbidden Phrases Detected in:');
    failed.forEach(f => {
      console.log(` - ${f.file}: ${f.forbiddenFound.join(', ')}`);
    });
  } else {
    console.log('ALL CONTENT PASSED AUDIT SAFELY!');
  }
}

runAudit();
