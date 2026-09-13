import fs from 'fs';
import path from 'path';
import ts from 'typescript';

interface FaqInstance {
  filePath: string;
  relativeFile: string;
  line: number;
  arrayName: string;
  pattern: 'map' | 'double' | 'violation';
}

interface Violation {
  file: string;
  line: number;
  arrayName: string;
  reason: string;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAllTsxFiles(dir: string): string[] {
  let results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllTsxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }

  return results;
}

export function validateFaqParity(): {
  scannedFilesCount: number;
  totalFaqSchemas: number;
  mapCount: number;
  doubleCount: number;
  violations: Violation[];
} {
  const componentsDir = path.join(process.cwd(), 'src/components');
  const files = getAllTsxFiles(componentsDir);

  const violations: Violation[] = [];
  let totalFaqSchemas = 0;
  let mapCount = 0;
  let doubleCount = 0;

  for (const filePath of files) {
    const code = fs.readFileSync(filePath, 'utf8');
    const relativeFile = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

    if (!code.includes('FaqSchema')) {
      continue;
    }

    const sourceFile = ts.createSourceFile(
      filePath,
      code,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    );

    const hasFaqHeading =
      code.includes('سوالات متداول') || /Frequently Asked/i.test(code);

    function visit(node: ts.Node) {
      if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
        const tagName = node.tagName.getText(sourceFile);
        if (tagName === 'FaqSchema') {
          totalFaqSchemas++;
          const startPos = node.getStart(sourceFile);
          const endPos = node.getEnd();
          const { line } = sourceFile.getLineAndCharacterOfPosition(startPos);
          const lineNumber = line + 1;

          const itemsAttr = node.attributes.properties.find(
            (p) => p.name && p.name.getText(sourceFile) === 'items'
          );

          let arrayName = 'unknown';
          let baseIdentifier: string | null = null;

          if (
            itemsAttr &&
            ts.isJsxAttribute(itemsAttr) &&
            itemsAttr.initializer &&
            ts.isJsxExpression(itemsAttr.initializer) &&
            itemsAttr.initializer.expression
          ) {
            const expr = itemsAttr.initializer.expression;
            if (ts.isIdentifier(expr)) {
              arrayName = expr.getText(sourceFile);
              baseIdentifier = arrayName;
            } else if (ts.isArrayLiteralExpression(expr)) {
              arrayName = '[inline array]';
              baseIdentifier = null;
            } else if (
              ts.isCallExpression(expr) &&
              ts.isPropertyAccessExpression(expr.expression)
            ) {
              const propAccess = expr.expression;
              if (
                propAccess.name.getText(sourceFile) === 'map' &&
                ts.isIdentifier(propAccess.expression)
              ) {
                baseIdentifier = propAccess.expression.getText(sourceFile);
                arrayName = `${baseIdentifier}.map(...)`;
              } else {
                arrayName = expr.getText(sourceFile).slice(0, 30);
              }
            } else {
              arrayName = expr.getText(sourceFile).slice(0, 30);
            }
          } else {
            violations.push({
              file: relativeFile,
              line: lineNumber,
              arrayName: '(missing items attribute)',
              reason: 'FaqSchema has no valid items attribute',
            });
            return;
          }

          // Check for Shared Array Pattern: X.map( exists in the same file outside of FaqSchema
          let isMapPattern = false;
          if (baseIdentifier) {
            const mapRegex = new RegExp(
              `\\b${escapeRegExp(baseIdentifier)}\\s*\\.\\s*map\\s*\\(`,
              'g'
            );
            let match: RegExpExecArray | null;
            while ((match = mapRegex.exec(code)) !== null) {
              if (match.index < startPos || match.index >= endPos) {
                isMapPattern = true;
                break;
              }
            }
          }

          if (isMapPattern) {
            mapCount++;
          } else if (hasFaqHeading) {
            doubleCount++;
          } else {
            violations.push({
              file: relativeFile,
              line: lineNumber,
              arrayName,
              reason: `Array "${arrayName}" neither has ${baseIdentifier ? baseIdentifier + '.map(' : '.map('} visual rendering nor is accompanied by a visual FAQ heading ("سوالات متداول" or "Frequently Asked")`,
            });
          }
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  return {
    scannedFilesCount: files.length,
    totalFaqSchemas,
    mapCount,
    doubleCount,
    violations,
  };
}

// Run CLI
if (require.main === module || (typeof process !== 'undefined' && process.argv[1] && process.argv[1].endsWith('validateFaqParity.ts'))) {
  console.log('🔍 Validating FAQ Parity across all components in src/components/...\n');

  const result = validateFaqParity();

  console.log('====================================================');
  console.log('             FAQ PARITY VALIDATION REPORT           ');
  console.log('====================================================\n');

  if (result.violations.length > 0) {
    console.error('❌ VIOLATIONS FOUND:');
    for (const v of result.violations) {
      console.error(`  - File: ${v.file}:${v.line}`);
      console.error(`    Array: ${v.arrayName}`);
      console.error(`    Reason: ${v.reason}\n`);
    }
  } else {
    console.log('✅ VIOLATIONS: None found (0 violations)\n');
  }

  console.log('----------------------------------------------------');
  console.log('OK BREAKDOWN:');
  console.log(`  - Shared array pattern (.map): ${result.mapCount} instance(s)`);
  console.log(`  - Double pattern (JSX duplicated with FAQ heading): ${result.doubleCount} instance(s)`);
  console.log('----------------------------------------------------\n');

  console.log('----------------------------------------------------');
  console.log('SUMMARY:');
  console.log(`  - Scanned .tsx files: ${result.scannedFilesCount}`);
  console.log(`  - Total FaqSchema instances: ${result.totalFaqSchemas}`);
  console.log(`  - Total violations: ${result.violations.length}`);
  console.log('----------------------------------------------------\n');

  if (result.violations.length > 0) {
    console.error(`❌ FAQ Parity Validation FAILED with ${result.violations.length} violation(s).`);
    process.exit(1);
  } else {
    console.log('✅ FAQ Parity Validation PASSED: All FaqSchema tags have verified visual counterparts.');
    process.exit(0);
  }
}
