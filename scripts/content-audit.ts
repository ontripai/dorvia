import fs from 'fs';
import path from 'path';

interface PhraseRule {
  phrase: string;
  /** اگر متنِ یافته‌شده بخشی از یکی از این رشته‌های بلندتر باشد، نقض نیست */
  allowedWithin?: string[];
  /** اگر تا N کاراکتر قبل از آن یک نشانه‌ی نفی باشد، نقض نیست */
  negationAware?: boolean;
}

const NEGATION_WINDOW = 60;
const NEGATION_MARKERS = [
  'هیچ',
  'نمی',
  'نیست',
  'نهتنها',
  'نه تنها',
  'نه\u200Cتنها',
  'بدون',
  'never',
  'not ',
  'no ',
  'without'
];

const RULES: PhraseRule[] = [
  { phrase: 'تضمینی', negationAware: true },
  { phrase: 'صددرصد', negationAware: true },
  { phrase: 'پذیرش قطعی', negationAware: true },
  { phrase: 'guaranteed visa', negationAware: true },
  { phrase: 'guaranteed residence', negationAware: true },
  { phrase: 'WHO approved' },
  {
    phrase: 'فوری',
    allowedWithin: [
      'فوریه',
      'فوریت',
      'فرمان فوری',
      'اولویت فوری',
      'کارهای فوری',
      'کار های فوری',
      'نیاز فوری',
      'اقدام فوری',
      'نتیجه اولیه فوری',
      'نتیجه‌ی اولیه فوری',
      'شماره‌های فوری',
      'شماره های فوری',
      'تماس فوری'
    ]
  },
  { phrase: 'اقامت تضمینی' },
  { phrase: 'اقامت قطعی' },
  { phrase: 'ویزای تضمینی' },
  { phrase: 'ویزای قطعی' },
];

interface Finding {
  file: string;
  relativeFile: string;
  line: number;
  phrase: string;
  snippet: string;
  reason?: string;
}

function getFilesRecursively(dir: string, extensions: string[]): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, extensions));
    } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

function runContentAudit(): void {
  const rootDir = process.cwd();
  const targetDirs = [
    path.join(rootDir, 'src', 'components'),
    path.join(rootDir, 'src', 'content')
  ];

  const extensions = ['.tsx', '.ts'];
  const allFiles: string[] = [];

  for (const dir of targetDirs) {
    allFiles.push(...getFilesRecursively(dir, extensions));
  }

  const violations: Finding[] = [];
  const suppressed: Finding[] = [];

  for (const filePath of allFiles) {
    const relativeFile = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf-8');
    const contentLower = content.toLowerCase();

    for (const rule of RULES) {
      const phraseLower = rule.phrase.toLowerCase();
      let matchIdx = 0;

      // Pre-calculate allowed ranges if rule has allowedWithin
      const allowedRanges: Array<{ start: number; end: number; matchStr: string }> = [];
      if (rule.allowedWithin) {
        for (const allowed of rule.allowedWithin) {
          const allowedLower = allowed.toLowerCase();
          let aIdx = 0;
          while (true) {
            const foundAt = contentLower.indexOf(allowedLower, aIdx);
            if (foundAt === -1) break;
            allowedRanges.push({
              start: foundAt,
              end: foundAt + allowedLower.length,
              matchStr: allowed
            });
            aIdx = foundAt + 1;
          }
        }
      }

      while (true) {
        const foundIndex = contentLower.indexOf(phraseLower, matchIdx);
        if (foundIndex === -1) break;
        matchIdx = foundIndex + phraseLower.length;

        const lineNumber = content.substring(0, foundIndex).split('\n').length;
        const snippetStart = Math.max(0, foundIndex - 40);
        const snippetEnd = Math.min(content.length, foundIndex + phraseLower.length + 40);
        const snippet = content.substring(snippetStart, snippetEnd).replace(/[\r\n\t]+/g, ' ').trim();

        // Check 1: Allowed within longer valid string
        let isSuppressed = false;
        let suppressionReason = '';

        if (rule.allowedWithin && allowedRanges.length > 0) {
          const matchingRange = allowedRanges.find(
            r => foundIndex >= r.start && (foundIndex + phraseLower.length) <= r.end
          );
          if (matchingRange) {
            isSuppressed = true;
            suppressionReason = `allowed within "${matchingRange.matchStr}"`;
          }
        }

        // Check 2: Negation aware
        if (!isSuppressed && rule.negationAware) {
          const windowStart = Math.max(0, foundIndex - NEGATION_WINDOW);
          const precedingText = contentLower.substring(windowStart, foundIndex);
          const markerFound = NEGATION_MARKERS.find(m => precedingText.includes(m.toLowerCase()));
          if (markerFound) {
            isSuppressed = true;
            suppressionReason = `negation marker "${markerFound}" within ${NEGATION_WINDOW} chars`;
          }
        }

        if (isSuppressed) {
          suppressed.push({
            file: filePath,
            relativeFile,
            line: lineNumber,
            phrase: rule.phrase,
            snippet,
            reason: suppressionReason
          });
        } else {
          violations.push({
            file: filePath,
            relativeFile,
            line: lineNumber,
            phrase: rule.phrase,
            snippet
          });
        }
      }
    }
  }

  console.log('================================================================');
  console.log('🔍 CONTENT SAFETY AUDIT REPORT');
  console.log('================================================================\n');

  if (violations.length > 0) {
    console.log(`❌ VIOLATIONS (${violations.length}):`);
    violations.forEach((v, idx) => {
      console.log(`[${idx + 1}] ${v.relativeFile}:${v.line} -> phrase: "${v.phrase}"`);
      console.log(`    Context: "...${v.snippet}..."\n`);
    });
  } else {
    console.log('✅ VIOLATIONS (0): No forbidden phrases or deceptive claims found!\n');
  }

  if (suppressed.length > 0) {
    console.log(`ℹ️ SUPPRESSED (for review) (${suppressed.length}):`);
    suppressed.forEach((s, idx) => {
      console.log(`[${idx + 1}] ${s.relativeFile}:${s.line} -> phrase: "${s.phrase}" (${s.reason})`);
      console.log(`    Context: "...${s.snippet}..."\n`);
    });
  } else {
    console.log('ℹ️ SUPPRESSED (0)\n');
  }

  console.log('----------------------------------------------------------------');
  console.log('SUMMARY:');
  console.log(`Total Files Scanned: ${allFiles.length}`);
  console.log(`Violations:          ${violations.length}`);
  console.log(`Suppressed:          ${suppressed.length}`);
  console.log('----------------------------------------------------------------\n');

  if (violations.length > 0) {
    console.error(`Audit failed with ${violations.length} violation(s).`);
    process.exit(1);
  } else {
    console.log('Audit passed successfully with 0 violations.');
    process.exit(0);
  }
}

runContentAudit();
