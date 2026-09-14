/**
 * Exchange Queries Schema Parity & Query Validator (dre-p134, dre-p136)
 * Repository: github.com/ontripai/dorvia
 *
 * Requirements:
 * 1. Spawns an isolated ephemeral test database, applies migrations 10, 11, and 12.
 * 2. Reads live schema from information_schema.columns for all exchange_* tables.
 * 3. Scans all TypeScript files in src/ for .from('exchange_...') query chains:
 *    - SELECT: Recursively parses PostgREST nested embed select strings.
 *    - WRITES: Validates top-level object keys in .insert(...), .update(...), .upsert(...).
 *    - FILTERS: Validates column names in .eq, .neq, .gt, .gte, .lt, .lte, .like, .ilike, .is, .in, .contains, .order.
 * 4. Skips non-literal, spread, computed, or dot-notated filter arguments and reports them in skipped section.
 * 5. If no live PostgreSQL is reachable, exits non-zero with "NOT EXECUTED".
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';
import ts from 'typescript';

const MIGRATIONS_DIR = path.resolve('docs/migrations');

// Configuration from environment variables
const PGHOST = process.env.PGHOST || '127.0.0.1';
const PGPORT = process.env.PGPORT || '5432';
const PGUSER = process.env.PGUSER || 'postgres';
const PGDATABASE = process.env.PGDATABASE || 'postgres';
const PGPASSWORD = process.env.PGPASSWORD || '';
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || '';

// Resolve psql binary path
function resolvePsqlPath(): string | null {
  if (process.env.PSQL_PATH && fs.existsSync(process.env.PSQL_PATH)) {
    return process.env.PSQL_PATH;
  }

  const candidateWindowsPaths = [
    'C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\15\\bin\\psql.exe'
  ];

  for (const p of candidateWindowsPaths) {
    if (fs.existsSync(p)) return p;
  }

  try {
    const checkCmd = process.platform === 'win32' ? 'where psql' : 'which psql';
    const found = execSync(checkCmd, { stdio: 'pipe' }).toString().trim().split('\n')[0].trim();
    if (found && fs.existsSync(found)) return found;
  } catch {
    // Not found in PATH
  }

  return null;
}

const psqlBin = resolvePsqlPath();

interface PsqlResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
}

function runPsql(sql: string, targetDb: string = PGDATABASE): PsqlResult {
  if (!psqlBin) {
    return {
      success: false,
      stdout: '',
      stderr: 'psql binary not found on system.',
      exitCode: 127
    };
  }

  const env = { ...process.env };
  if (PGPASSWORD) env.PGPASSWORD = PGPASSWORD;

  const args: string[] = [];
  if (TEST_DATABASE_URL && targetDb === PGDATABASE) {
    args.push('-d', TEST_DATABASE_URL);
  } else {
    args.push(
      '-h', PGHOST,
      '-p', PGPORT,
      '-U', PGUSER,
      '-d', targetDb
    );
  }

  args.push('-X', '-v', 'ON_ERROR_STOP=1', '-c', sql);

  const res = spawnSync(psqlBin, args, {
    env,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  return {
    success: res.status === 0,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    exitCode: res.status ?? 1
  };
}

function runPsqlFile(filePath: string, targetDb: string): PsqlResult {
  if (!psqlBin) {
    return {
      success: false,
      stdout: '',
      stderr: 'psql binary not found on system.',
      exitCode: 127
    };
  }

  const env = { ...process.env };
  if (PGPASSWORD) env.PGPASSWORD = PGPASSWORD;

  const args: string[] = [
    '-h', PGHOST,
    '-p', PGPORT,
    '-U', PGUSER,
    '-d', targetDb,
    '-X', '-v', 'ON_ERROR_STOP=1',
    '-f', filePath
  ];

  const res = spawnSync(psqlBin, args, {
    env,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  return {
    success: res.status === 0,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    exitCode: res.status ?? 1
  };
}

function walkDir(dir: string): string[] {
  let results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      results.push(fullPath);
    }
  }
  return results;
}

// Split string by commas at parenthesis depth 0
function splitTopLevel(str: string): string[] {
  const parts: string[] = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(') {
      depth++;
      current += char;
    } else if (char === ')') {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0) {
      if (current.trim()) parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

// Strip JS/TS comments from inside template literals
function stripComments(str: string): string {
  return str
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/.*$/gm, ' ');
}

type ViolationType = 'SELECT' | 'WRITE' | 'FILTER' | 'TABLE';

interface QueryViolation {
  type: ViolationType;
  file: string;
  line: number;
  table: string;
  embedPath?: string;
  column: string;
  method?: string;
}

interface SkippedItem {
  type: 'SELECT' | 'WRITE' | 'FILTER' | 'TABLE';
  file: string;
  line: number;
  table?: string;
  method?: string;
  reason: string;
}

const WRITE_METHODS = new Set(['insert', 'update', 'upsert']);
const FILTER_METHODS = new Set([
  'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'is', 'in', 'contains', 'order'
]);

// Trace back the receiver chain to find the target exchange table
function getTargetTable(callExpr: ts.CallExpression, varTableMap: Map<string, string>): string | null {
  let curr: ts.Expression = callExpr.expression;
  while (true) {
    if (ts.isPropertyAccessExpression(curr)) {
      curr = curr.expression;
    } else if (ts.isCallExpression(curr)) {
      if (ts.isPropertyAccessExpression(curr.expression) && curr.expression.name.text === 'from') {
        if (
          ts.isPropertyAccessExpression(curr.expression.expression) &&
          curr.expression.expression.name.text === 'storage'
        ) {
          return null;
        }
        if (curr.arguments.length > 0 && ts.isStringLiteral(curr.arguments[0])) {
          return curr.arguments[0].text.trim();
        }
      }
      curr = curr.expression;
    } else if (ts.isIdentifier(curr)) {
      if (varTableMap.has(curr.text)) {
        return varTableMap.get(curr.text)!;
      }
      return null;
    } else {
      return null;
    }
  }
}

async function main() {
  console.log('============================================================================');
  console.log('DORVIA Full Database Queries Schema Parity & Query Validator (dre-p144)');
  console.log('============================================================================\n');

  if (!psqlBin) {
    console.error('CRITICAL: psql command line tool could not be located.');
    console.error('Execution Result: NOT EXECUTED / SKIPPED');
    process.exit(1);
  }

  console.log(`Using psql binary: ${psqlBin}`);
  console.log(`Target connection: ${PGUSER}@${PGHOST}:${PGPORT}/${PGDATABASE}\n`);

  // Probe PostgreSQL connection
  console.log('Probing PostgreSQL connection...');
  const probeResult = runPsql('SELECT version();');
  if (!probeResult.success) {
    console.error('----------------------------------------------------------------------------');
    console.error('DATABASE CONNECTION STATUS: UNAVAILABLE / CONNECTION FAILED');
    console.error('Connection error details:');
    console.error(probeResult.stderr.trim());
    console.error('----------------------------------------------------------------------------');
    console.error('Execution Result: NOT EXECUTED / SKIPPED');
    console.error('Strict Brief Rule:');
    console.error('  "اگر پستگرس در دسترس نبود: پیام «NOT EXECUTED» و خروج غیرصفر. هیچ تیک سبز ساختگی."\n');
    process.exit(1);
  }

  const dbVersion = probeResult.stdout.trim().split('\n')[2]?.trim() || 'PostgreSQL';
  console.log(`Connected to live database instance: ${dbVersion}\n`);

  const TEST_DB = `dorvia_full_query_check_${Date.now()}`;
  console.log(`Creating isolated ephemeral test database: ${TEST_DB}...`);
  const createDbResult = runPsql(`CREATE DATABASE ${TEST_DB};`);
  if (!createDbResult.success) {
    console.error(`Failed to create ephemeral database:\n${createDbResult.stderr}`);
    process.exit(1);
  }
  console.log(`Database ${TEST_DB} created successfully.\n`);

  try {
    // 1. Apply external stubs (auth schema, auth.uid(), roles, extensions)
    console.log('Applying external stubs (auth schema, auth.uid(), roles, extensions)...');
    const stubsSql = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE SCHEMA IF NOT EXISTS auth;

      CREATE TABLE IF NOT EXISTS auth.users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text,
        created_at timestamptz DEFAULT now()
      );

      CREATE OR REPLACE FUNCTION auth.uid()
      RETURNS uuid
      LANGUAGE sql STABLE
      AS $$
        SELECT '00000000-0000-0000-0000-000000000001'::uuid;
      $$;

      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
          CREATE ROLE authenticated;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
          CREATE ROLE anon;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
          CREATE ROLE service_role;
        END IF;
      END $$;
    `;

    const stubResult = runPsql(stubsSql, TEST_DB);
    if (!stubResult.success) {
      console.error(`Failed to apply external stubs:\n${stubResult.stderr}`);
      process.exit(1);
    }
    console.log('External stubs applied successfully.\n');

    // 2. Discover and execute all migrations in docs/migrations in alphabetical order
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b));

    console.log(`Discovered ${migrationFiles.length} migrations to execute in sequence:`);
    migrationFiles.forEach((file, index) => {
      console.log(`  ${String(index + 1).padStart(2, '0')}. ${file}`);
    });
    console.log('');

    for (const file of migrationFiles) {
      const fullPath = path.join(MIGRATIONS_DIR, file);
      process.stdout.write(`Executing migration ${file}... `);
      const res = runPsqlFile(fullPath, TEST_DB);
      if (!res.success) {
        console.log('FAILED ❌');
        console.error(`\nCRITICAL: Migration ${file} failed:`);
        console.error(res.stderr.trim());
        process.exit(1);
      }
      console.log('OK ✅');
    }
    console.log('\nAll migrations executed successfully with zero SQL errors.\n');

    // 3. Extract live schema columns for all public tables
    console.log('Extracting live columns from information_schema.columns...');
    const schemaSql = `
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, column_name;
    `;
    const schemaRes = runPsql(schemaSql, TEST_DB);
    if (!schemaRes.success) {
      console.error(`Failed to query information_schema:\n${schemaRes.stderr}`);
      process.exit(1);
    }

    const schemaMap = new Map<string, Set<string>>();
    for (const rawLine of schemaRes.stdout.split('\n')) {
      const line = rawLine.trim();
      if (!line || line.startsWith('table_name') || line.startsWith('(') || line.startsWith('-')) continue;
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 2) {
        const [tbl, col] = parts;
        if (!schemaMap.has(tbl)) {
          schemaMap.set(tbl, new Set<string>());
        }
        schemaMap.get(tbl)!.add(col.toLowerCase());
      }
    }

    console.log(`Loaded live schema for ${schemaMap.size} public tables:\n` +
      Array.from(schemaMap.keys()).map(k => `  - ${k} (${schemaMap.get(k)!.size} columns)`).join('\n') + '\n'
    );

    // 4. Scan all TypeScript files in src/
    console.log('Scanning TypeScript codebase under src/ for Supabase exchange queries...');
    const allFiles = walkDir('src');

    const violations: QueryViolation[] = [];
    const skippedItems: SkippedItem[] = [];
    const skippedTables = new Set<string>();

    let countSelectSites = 0;
    let countSelectColsChecked = 0;
    let countWriteSites = 0;
    let countWriteKeysChecked = 0;
    let countFilterSites = 0;
    let countFilterColsChecked = 0;

    function validateSelectTokens(
      currentTable: string,
      selectContent: string,
      embedPath: string,
      file: string,
      line: number
    ) {
      const cleaned = stripComments(selectContent).trim();
      if (!cleaned || cleaned === '*') return;

      const tokens = splitTopLevel(cleaned);

      for (const rawToken of tokens) {
        const token = rawToken.trim();
        if (!token) continue;

        const firstParen = token.indexOf('(');
        const lastParen = token.lastIndexOf(')');

        if (firstParen !== -1 && lastParen > firstParen) {
          // Embedded resource: alias:table!fk(...) or table(...)
          const header = token.slice(0, firstParen).trim();
          const inner = token.slice(firstParen + 1, lastParen).trim();

          let afterAlias = header;
          if (header.includes(':')) {
            afterAlias = header.slice(header.indexOf(':') + 1).trim();
          }

          let targetTable = afterAlias;
          if (afterAlias.includes('!')) {
            targetTable = afterAlias.slice(0, afterAlias.indexOf('!')).trim();
          }

          const currentPath = embedPath ? `${embedPath} -> ${header}` : header;

          if (!schemaMap.has(targetTable)) {
            violations.push({
              type: 'SELECT',
              file,
              line,
              table: targetTable,
              embedPath: currentPath,
              column: `[TABLE NOT FOUND: ${targetTable}]`
            });
          } else {
            validateSelectTokens(targetTable, inner, currentPath, file, line);
          }
        } else {
          // Plain column reference
          let rawCol = token;
          if (rawCol.includes('::')) {
            rawCol = rawCol.split('::')[0].trim();
          }
          if (rawCol.includes(':')) {
            rawCol = rawCol.split(':')[1].trim();
          }

          rawCol = rawCol.trim();
          if (rawCol === '*' || !rawCol) continue;

          countSelectColsChecked++;
          const validCols = schemaMap.get(currentTable);
          if (validCols && !validCols.has(rawCol.toLowerCase())) {
            violations.push({
              type: 'SELECT',
              file,
              line,
              table: currentTable,
              embedPath: embedPath || '(root)',
              column: rawCol,
            });
          }
        }
      }
    }

    function validateWriteObject(
      objLiteral: ts.ObjectLiteralExpression,
      table: string,
      methodName: string,
      file: string,
      sourceFile: ts.SourceFile
    ) {
      const validCols = schemaMap.get(table);
      for (const prop of objLiteral.properties) {
        const { line } = sourceFile.getLineAndCharacterOfPosition(prop.getStart());
        if (ts.isSpreadAssignment(prop)) {
          skippedItems.push({
            type: 'WRITE',
            file,
            line: line + 1,
            table,
            method: methodName,
            reason: `Spread assignment (${prop.getText(sourceFile)}) present inside write payload`
          });
        } else if (ts.isPropertyAssignment(prop)) {
          if (ts.isComputedPropertyName(prop.name)) {
            skippedItems.push({
              type: 'WRITE',
              file,
              line: line + 1,
              table,
              method: methodName,
              reason: `Computed property name [${prop.name.getText(sourceFile)}]`
            });
          } else if (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) {
            const keyName = prop.name.text;
            countWriteKeysChecked++;
            if (validCols && !validCols.has(keyName.toLowerCase())) {
              violations.push({
                type: 'WRITE',
                file,
                line: line + 1,
                table,
                column: keyName,
                method: methodName
              });
            }
          } else {
            skippedItems.push({
              type: 'WRITE',
              file,
              line: line + 1,
              table,
              method: methodName,
              reason: `Unsupported property syntax (${prop.name.getText(sourceFile)})`
            });
          }
        } else if (ts.isShorthandPropertyAssignment(prop)) {
          const keyName = prop.name.text;
          countWriteKeysChecked++;
          if (validCols && !validCols.has(keyName.toLowerCase())) {
            violations.push({
              type: 'WRITE',
              file,
              line: line + 1,
              table,
              column: keyName,
              method: methodName
            });
          }
        } else {
          skippedItems.push({
            type: 'WRITE',
            file,
            line: line + 1,
            table,
            method: methodName,
            reason: `Unsupported non-property assignment in write payload`
          });
        }
      }
    }

    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (!content.includes('.from(')) continue;

      const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
      const varTableMap = new Map<string, string>();

      // Pass 1: find variable declarations/assignments initialized with Supabase queries
      function findVars(node: ts.Node) {
        if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
          if (ts.isCallExpression(node.initializer)) {
            const table = getTargetTable(node.initializer, varTableMap);
            if (table) {
              varTableMap.set(node.name.text, table);
              if (!schemaMap.has(table)) {
                const alreadyReported = violations.some(
                  (v) => v.type === 'TABLE' && v.file === file && v.table === table
                );
                if (!alreadyReported) {
                  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
                  violations.push({
                    type: 'TABLE',
                    file,
                    line: line + 1,
                    table,
                    column: `[TABLE NOT FOUND: ${table}]`
                  });
                }
              }
            }
          }
        }
        if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
          if (ts.isIdentifier(node.left) && ts.isCallExpression(node.right)) {
            const table = getTargetTable(node.right, varTableMap);
            if (table) {
              varTableMap.set(node.left.text, table);
              if (!schemaMap.has(table)) {
                const alreadyReported = violations.some(
                  (v) => v.type === 'TABLE' && v.file === file && v.table === table
                );
                if (!alreadyReported) {
                  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
                  violations.push({
                    type: 'TABLE',
                    file,
                    line: line + 1,
                    table,
                    column: `[TABLE NOT FOUND: ${table}]`
                  });
                }
              }
            }
          }
        }
        ts.forEachChild(node, findVars);
      }
      findVars(sourceFile);

      // Pass 2: find all query calls
      function visit(node: ts.Node) {
        if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
          const methodName = node.expression.name.text;
          const table = getTargetTable(node, varTableMap);

          if (table) {
            const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());

            if (!schemaMap.has(table)) {
              const alreadyReported = violations.some(
                (v) => v.type === 'TABLE' && v.file === file && v.table === table
              );
              if (!alreadyReported) {
                violations.push({
                  type: 'TABLE',
                  file,
                  line: line + 1,
                  table,
                  column: `[TABLE NOT FOUND: ${table}]`
                });
              }
              ts.forEachChild(node, visit);
              return;
            }

            // 1. SELECT
            if (methodName === 'select') {
              countSelectSites++;
              let selectStr = '*';
              if (node.arguments.length > 0) {
                const arg = node.arguments[0];
                if (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)) {
                  selectStr = arg.text;
                } else if (ts.isTemplateExpression(arg)) {
                  selectStr = arg.getText(sourceFile);
                  if (selectStr.startsWith('`') && selectStr.endsWith('`')) {
                    selectStr = selectStr.slice(1, -1);
                  }
                } else {
                  skippedItems.push({
                    type: 'SELECT',
                    file,
                    line: line + 1,
                    table,
                    method: 'select',
                    reason: `Non-literal select projection argument: ${arg.getText(sourceFile)}`
                  });
                }
              }
              validateSelectTokens(table, selectStr, '', file, line + 1);
            }

            // 2. WRITES (insert, update, upsert)
            else if (WRITE_METHODS.has(methodName)) {
              countWriteSites++;
              const arg = node.arguments[0];
              if (!arg) {
                skippedItems.push({
                  type: 'WRITE',
                  file,
                  line: line + 1,
                  table,
                  method: methodName,
                  reason: 'No argument provided to write method'
                });
              } else if (ts.isObjectLiteralExpression(arg)) {
                validateWriteObject(arg, table, methodName, file, sourceFile);
              } else if (ts.isArrayLiteralExpression(arg)) {
                for (const elem of arg.elements) {
                  if (ts.isObjectLiteralExpression(elem)) {
                    validateWriteObject(elem, table, methodName, file, sourceFile);
                  } else {
                    const { line: elLine } = sourceFile.getLineAndCharacterOfPosition(elem.getStart());
                    skippedItems.push({
                      type: 'WRITE',
                      file,
                      line: elLine + 1,
                      table,
                      method: methodName,
                      reason: `Non-literal object element in array passed to .${methodName}()`
                    });
                  }
                }
              } else if (ts.isIdentifier(arg)) {
                // Check if the argument is a simple identifier defined with `const` in the enclosing function
                // with an object literal initializer
                let resolved = false;
                const varName = arg.text;
                const targetTable: string = table;

                // Find enclosing function or method
                let enclosingFn: ts.Node | undefined = node.parent;
                while (enclosingFn) {
                  if (
                    ts.isFunctionDeclaration(enclosingFn) ||
                    ts.isFunctionExpression(enclosingFn) ||
                    ts.isArrowFunction(enclosingFn) ||
                    ts.isMethodDeclaration(enclosingFn)
                  ) {
                    break;
                  }
                  enclosingFn = enclosingFn.parent;
                }

                if (enclosingFn) {
                  function findVarDecl(scope: ts.Node, name: string): { decl: ts.VariableDeclaration | null; isConst: boolean } {
                    let foundDecl: ts.VariableDeclaration | null = null;
                    let foundConst = false;
                    function walk(n: ts.Node) {
                      if (foundDecl) return;
                      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === name) {
                        foundDecl = n;
                        if (ts.isVariableDeclarationList(n.parent)) {
                          foundConst = Boolean(n.parent.flags & ts.NodeFlags.Const);
                        }
                        return;
                      }
                      ts.forEachChild(n, walk);
                    }
                    walk(scope);
                    return { decl: foundDecl, isConst: foundConst };
                  }

                  const { decl, isConst } = findVarDecl(enclosingFn, varName);
                  if (decl && isConst && decl.initializer && ts.isObjectLiteralExpression(decl.initializer)) {
                    resolved = true;
                    // 1. Validate the initial object literal
                    validateWriteObject(decl.initializer, targetTable, methodName, file, sourceFile);

                    // 2. Validate subsequent property assignments within the enclosing function
                    const scanAssignments = (n: ts.Node) => {
                      if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
                        if (
                          ts.isPropertyAccessExpression(n.left) &&
                          ts.isIdentifier(n.left.expression) &&
                          n.left.expression.text === varName
                        ) {
                          const keyName = n.left.name.text;
                          const { line: assignLine } = sourceFile.getLineAndCharacterOfPosition(n.left.getStart());
                          countWriteKeysChecked++;
                          const validCols = schemaMap.get(targetTable);
                          if (validCols && !validCols.has(keyName.toLowerCase())) {
                            violations.push({
                              type: 'WRITE',
                              file,
                              line: assignLine + 1,
                              table: targetTable,
                              column: keyName,
                              method: methodName
                            });
                          }
                        } else if (
                          ts.isElementAccessExpression(n.left) &&
                          ts.isIdentifier(n.left.expression) &&
                          n.left.expression.text === varName
                        ) {
                          const { line: assignLine } = sourceFile.getLineAndCharacterOfPosition(n.left.getStart());
                          if (
                            n.left.argumentExpression &&
                            (ts.isStringLiteral(n.left.argumentExpression) ||
                              ts.isNoSubstitutionTemplateLiteral(n.left.argumentExpression))
                          ) {
                            const keyName = n.left.argumentExpression.text.trim();
                            countWriteKeysChecked++;
                            const validCols = schemaMap.get(targetTable);
                            if (validCols && !validCols.has(keyName.toLowerCase())) {
                              violations.push({
                                type: 'WRITE',
                                file,
                                line: assignLine + 1,
                                table: targetTable,
                                column: keyName,
                                method: methodName
                              });
                            }
                          } else {
                            skippedItems.push({
                              type: 'WRITE',
                              file,
                              line: assignLine + 1,
                              table: targetTable,
                              method: methodName,
                              reason: `Computed property access assignment [${n.left.argumentExpression ? n.left.argumentExpression.getText(sourceFile) : '?'}] on write payload`
                            });
                          }
                        }
                      }
                      ts.forEachChild(n, scanAssignments);
                    };
                    scanAssignments(enclosingFn);
                  }
                }

                if (!resolved) {
                  skippedItems.push({
                    type: 'WRITE',
                    file,
                    line: line + 1,
                    table,
                    method: methodName,
                    reason: `Non-literal write argument (variable/expression: ${arg.getText(sourceFile).slice(0, 40)})`
                  });
                }
              } else {
                skippedItems.push({
                  type: 'WRITE',
                  file,
                  line: line + 1,
                  table,
                  method: methodName,
                  reason: `Non-literal write argument (variable/expression: ${arg.getText(sourceFile).slice(0, 40)})`
                });
              }
            }

            // 3. FILTERS (eq, neq, gt, gte, lt, lte, like, ilike, is, in, contains, order)
            else if (FILTER_METHODS.has(methodName)) {
              countFilterSites++;
              const arg0 = node.arguments[0];
              if (!arg0) {
                skippedItems.push({
                  type: 'FILTER',
                  file,
                  line: line + 1,
                  table,
                  method: methodName,
                  reason: 'No argument provided to filter method'
                });
              } else if (ts.isStringLiteral(arg0) || ts.isNoSubstitutionTemplateLiteral(arg0)) {
                const colName = arg0.text.trim();
                if (colName.includes('.')) {
                  skippedItems.push({
                    type: 'FILTER',
                    file,
                    line: line + 1,
                    table,
                    method: methodName,
                    reason: `Embedded/nested column with dot notation "${colName}"`
                  });
                } else {
                  countFilterColsChecked++;
                  const validCols = schemaMap.get(table);
                  if (validCols && !validCols.has(colName.toLowerCase())) {
                    violations.push({
                      type: 'FILTER',
                      file,
                      line: line + 1,
                      table,
                      column: colName,
                      method: methodName
                    });
                  }
                }
              } else {
                skippedItems.push({
                  type: 'FILTER',
                  file,
                  line: line + 1,
                  table,
                  method: methodName,
                  reason: `Non-string-literal column argument (${arg0.getText(sourceFile).slice(0, 40)})`
                });
              }
            }

            // 4. OR filter (.or)
            else if (methodName === 'or') {
              const arg0 = node.arguments[0];
              skippedItems.push({
                type: 'FILTER',
                file,
                line: line + 1,
                table,
                method: 'or',
                reason: `Complex PostgREST .or() filter expression skipped by design (${arg0 ? arg0.getText(sourceFile).slice(0, 50) : 'none'}...)`
              });
            }
          }
        }
        ts.forEachChild(node, visit);
      }
      visit(sourceFile);
    }

    console.log('============================================================================');
    console.log('DATABASE QUERIES SCHEMA PARITY & INTEGRITY REPORT');
    console.log('============================================================================\n');

    if (violations.length > 0) {
      console.error(`❌ VIOLATIONS FOUND (${violations.length} invalid column reference(s)):\n`);
      for (const v of violations) {
        console.error(`  • [${v.type}] File:   ${v.file}:${v.line}`);
        console.error(`    Table:         ${v.table}`);
        if (v.method) {
          console.error(`    Method:        .${v.method}()`);
        }
        if (v.embedPath) {
          console.error(`    Embed Path:    ${v.embedPath}`);
        }
        if (v.type === 'TABLE' || v.column.startsWith('[TABLE NOT FOUND')) {
          console.error(`    Table Error:   ${v.column}\n`);
        } else {
          console.error(`    Invalid Col:   "${v.column}" does NOT exist in table "${v.table}"\n`);
        }
      }
    } else {
      console.log('✅ ZERO VIOLATIONS FOUND. All database queries strictly match the database schema.\n');
    }

    console.log('----------------------------------------------------------------------------');
    console.log('COVERAGE AND AUDIT STATISTICS:');
    console.log(`  • SELECT Sites Scanned:   ${countSelectSites} queries (${countSelectColsChecked} column references verified)`);
    console.log(`  • WRITE Sites Scanned:    ${countWriteSites} calls (${countWriteKeysChecked} object keys verified)`);
    console.log(`  • FILTER Sites Scanned:   ${countFilterSites} calls (${countFilterColsChecked} filter columns verified)`);
    console.log(`  • Total Verifications:    ${countSelectColsChecked + countWriteKeysChecked + countFilterColsChecked} column/key references`);
    console.log('----------------------------------------------------------------------------\n');

    console.log('----------------------------------------------------------------------------');
    console.log(`SKIPPED ITEMS BREAKDOWN (${skippedItems.length} items safely skipped):`);
    const reasonGroups = new Map<string, number>();
    for (const item of skippedItems) {
      const key = `[${item.type}] ${item.reason.split('(')[0].trim()}`;
      reasonGroups.set(key, (reasonGroups.get(key) || 0) + 1);
    }
    for (const [reason, cnt] of Array.from(reasonGroups.entries()).sort()) {
      console.log(`  - ${reason}: ${cnt} occurrence(s)`);
    }

    console.log('\nDetailed Skipped Items Log:');
    for (const item of skippedItems) {
      const target = item.table ? `on ${item.table} ` : '';
      const meth = item.method ? `(.${item.method}) ` : '';
      console.log(`  • [${item.type}] ${item.file}:${item.line} ${target}${meth}-> ${item.reason}`);
    }
    console.log('----------------------------------------------------------------------------\n');

    if (violations.length > 0) {
      console.error(`FAILED: ${violations.length} invalid column/key reference(s) detected in database queries.`);
      process.exit(1);
    } else {
      console.log('SUCCESS: All database queries (SELECT, WRITE, FILTER) adhere strictly to schema.');
      process.exit(0);
    }
  } finally {
    console.log(`Cleaning up ephemeral test database: ${TEST_DB}...`);
    runPsql(`DROP DATABASE IF EXISTS ${TEST_DB};`);
    console.log('Cleanup completed.\n');
  }
}

main().catch((err) => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
