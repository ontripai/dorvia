import fs from 'fs';
import path from 'path';
import ts from 'typescript';

export interface FileFaqStats {
  file: string;
  schemaCount: number;
  headingCount: number;
  mapCallsCount: number;
  hasDeficit: boolean;
}

export interface Violation {
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
  fileStats: FileFaqStats[];
} {
  const componentsDir = path.join(process.cwd(), 'src/components');
  const files = getAllTsxFiles(componentsDir);

  const violations: Violation[] = [];
  const fileStats: FileFaqStats[] = [];
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

    interface LocalSchema {
      node: ts.Node;
      startPos: number;
      endPos: number;
      lineNumber: number;
      arrayName: string;
      baseIdentifier: string | null;
      isMapPattern: boolean;
    }

    const localSchemas: LocalSchema[] = [];

    function visit(node: ts.Node) {
      if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
        const tagName = node.tagName.getText(sourceFile);
        if (tagName === 'FaqSchema') {
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
          }

          localSchemas.push({
            node,
            startPos,
            endPos,
            lineNumber,
            arrayName,
            baseIdentifier,
            isMapPattern: false,
          });
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    if (localSchemas.length === 0) {
      continue;
    }

    totalFaqSchemas += localSchemas.length;

    // Check for Shared Array Pattern: baseIdentifier.map( exists outside of FaqSchema
    let fileMapCallsCount = 0;
    for (const schema of localSchemas) {
      if (schema.baseIdentifier) {
        const mapRegex = new RegExp(
          `\\b${escapeRegExp(schema.baseIdentifier)}\\s*\\.\\s*map\\s*\\(`,
          'g'
        );
        let match: RegExpExecArray | null;
        while ((match = mapRegex.exec(code)) !== null) {
          const isInsideCurrentSchema =
            match.index >= schema.startPos && match.index < schema.endPos;
          if (!isInsideCurrentSchema) {
            schema.isMapPattern = true;
            fileMapCallsCount++;
            break;
          }
        }
      }
    }

    // Count visual FAQ headings in the file
    const lines = code.split(/\r?\n/);
    let headingCount = 0;
    for (const l of lines) {
      if (l.includes('سوالات متداول') || /Frequently Asked/i.test(l)) {
        headingCount++;
      }
    }

    const mappedSchemas = localSchemas.filter((s) => s.isMapPattern);
    const unmappedSchemas = localSchemas.filter((s) => !s.isMapPattern);

    // Each mapped schema with an associated heading consumes 1 heading.
    // The remaining headings are available for unmapped (double pattern) schemas.
    const headingsForMapped = Math.min(headingCount, mappedSchemas.length);
    let availableHeadingsForUnmapped = headingCount - headingsForMapped;

    const hasDeficit = unmappedSchemas.length > availableHeadingsForUnmapped;

    fileStats.push({
      file: relativeFile,
      schemaCount: localSchemas.length,
      headingCount,
      mapCallsCount: fileMapCallsCount,
      hasDeficit,
    });

    // Assign patterns and register violations
    for (const schema of localSchemas) {
      if (schema.isMapPattern) {
        mapCount++;
      } else if (availableHeadingsForUnmapped > 0) {
        doubleCount++;
        availableHeadingsForUnmapped--;
      } else {
        violations.push({
          file: relativeFile,
          line: schema.lineNumber,
          arrayName: schema.arrayName,
          reason: `Unrendered FAQ schema in file: ${relativeFile} (FaqSchema instances: ${localSchemas.length}, FAQ headings: ${headingCount}, .map calls: ${fileMapCallsCount}). Array "${schema.arrayName}" has neither a .map visual rendering nor an available visual FAQ heading.`,
        });
      }
    }
  }

  return {
    scannedFilesCount: files.length,
    totalFaqSchemas,
    mapCount,
    doubleCount,
    violations,
    fileStats,
  };
}

// Run CLI
if (
  require.main === module ||
  (typeof process !== 'undefined' &&
    process.argv[1] &&
    process.argv[1].endsWith('validateFaqParity.ts'))
) {
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
