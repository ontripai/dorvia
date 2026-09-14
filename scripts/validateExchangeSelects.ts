/**
 * Exchange Queries Schema Parity & Select Validator (dre-p134)
 * Repository: github.com/ontripai/dorvia
 *
 * Requirements (dre-p134):
 * 1. Spawns an isolated ephemeral test database, applies migration 10 & 11.
 * 2. Reads live schema from information_schema.columns for all exchange_* tables.
 * 3. Scans all TypeScript files in src/ for .from('exchange_...').select(...) calls.
 * 4. Recursively parses PostgREST nested embed select strings (e.g. alias:table!fk(...)).
 * 5. Asserts every column referenced on an exchange_* table exists in the schema.
 * 6. Non-exchange tables (leads, admin_users, lead_documents, etc.) are skipped and reported.
 * 7. If no live PostgreSQL is reachable, exits non-zero with "NOT EXECUTED".
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';
import ts from 'typescript';

const MIGRATION_10_PATH = path.resolve('docs/migrations/10_p2p_exchange_schema.sql');
const MIGRATION_11_PATH = path.resolve('docs/migrations/11_exchange_staff_operations.sql');

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

interface ExtractedQuery {
  file: string;
  line: number;
  table: string;
  selectStr: string;
}

function scanQueriesInFile(filePath: string): ExtractedQuery[] {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('exchange_')) return [];

  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const queries: ExtractedQuery[] = [];

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      if (
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === 'select'
      ) {
        const caller = node.expression.expression;
        if (
          ts.isCallExpression(caller) &&
          ts.isPropertyAccessExpression(caller.expression) &&
          caller.expression.name.text === 'from' &&
          caller.arguments.length > 0
        ) {
          const tableArg = caller.arguments[0];
          let tableName = '';
          if (ts.isStringLiteral(tableArg)) {
            tableName = tableArg.text.trim();
          }

          if (tableName.startsWith('exchange_')) {
            let selectStr = '*';
            if (node.arguments.length > 0) {
              const arg = node.arguments[0];
              if (ts.isStringLiteral(arg)) {
                selectStr = arg.text;
              } else if (ts.isNoSubstitutionTemplateLiteral(arg)) {
                selectStr = arg.text;
              } else if (ts.isTemplateExpression(arg)) {
                selectStr = arg.getText(sourceFile);
                if (selectStr.startsWith('`') && selectStr.endsWith('`')) {
                  selectStr = selectStr.slice(1, -1);
                }
              }
            }

            const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            queries.push({
              file: filePath,
              line: line + 1,
              table: tableName,
              selectStr,
            });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return queries;
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

interface SelectViolation {
  file: string;
  line: number;
  table: string;
  embedPath: string;
  column: string;
}

async function main() {
  console.log('============================================================================');
  console.log('DORVIA Exchange Queries Schema Parity & Select Validator (dre-p134)');
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
    console.error('Strict Brief Rule (dre-p134):');
    console.error('  "اگر پستگرس در دسترس نبود: پیام «NOT EXECUTED» و خروج غیرصفر. هیچ تیک سبز ساختگی."\n');
    process.exit(1);
  }

  const dbVersion = probeResult.stdout.trim().split('\n')[2]?.trim() || 'PostgreSQL';
  console.log(`Connected to live database instance: ${dbVersion}\n`);

  const TEST_DB = `dorvia_exchange_select_check_${Date.now()}`;
  console.log(`Creating isolated ephemeral test database: ${TEST_DB}...`);
  const createDbResult = runPsql(`CREATE DATABASE ${TEST_DB};`);
  if (!createDbResult.success) {
    console.error(`Failed to create ephemeral database:\n${createDbResult.stderr}`);
    process.exit(1);
  }
  console.log(`Database ${TEST_DB} created successfully.\n`);

  try {
    // 1. Apply external stubs
    console.log('Applying external table stubs (leads, lead_documents, admin_users, auth schema)...');
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

      CREATE TABLE IF NOT EXISTS public.roles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        key text UNIQUE NOT NULL,
        label_fa text NOT NULL,
        label_en text NOT NULL,
        description text,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.permissions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        key text UNIQUE NOT NULL,
        label_fa text NOT NULL,
        label_en text NOT NULL,
        description text
      );

      CREATE TABLE IF NOT EXISTS public.role_permissions (
        role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
        permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
      );

      CREATE TABLE IF NOT EXISTS public.leads (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES auth.users(id),
        email text,
        full_name text,
        phone text,
        national_id_or_passport text,
        verified_at timestamptz,
        created_at timestamptz DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.lead_documents (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
        document_type text NOT NULL,
        file_path text NOT NULL,
        created_at timestamptz DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.admin_users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES auth.users(id),
        email text NOT NULL,
        full_name text,
        role text NOT NULL DEFAULT 'admin',
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamptz DEFAULT now()
      );
    `;

    const stubResult = runPsql(stubsSql, TEST_DB);
    if (!stubResult.success) {
      console.error(`Failed to apply external stubs:\n${stubResult.stderr}`);
      process.exit(1);
    }
    console.log('External stubs applied successfully.');

    // 2. Apply migrations 10 and 11
    console.log(`Applying migration 10: ${path.basename(MIGRATION_10_PATH)}...`);
    const mig10Res = runPsqlFile(MIGRATION_10_PATH, TEST_DB);
    if (!mig10Res.success) {
      console.error(`Migration 10 failed:\n${mig10Res.stderr}`);
      process.exit(1);
    }
    console.log('Migration 10 applied with zero errors.');

    console.log(`Applying migration 11: ${path.basename(MIGRATION_11_PATH)}...`);
    const mig11Res = runPsqlFile(MIGRATION_11_PATH, TEST_DB);
    if (!mig11Res.success) {
      console.error(`Migration 11 failed:\n${mig11Res.stderr}`);
      process.exit(1);
    }
    console.log('Migration 11 applied with zero errors.\n');

    // 3. Extract live schema columns for all exchange_* tables
    console.log('Extracting live columns from information_schema.columns...');
    const schemaSql = `
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name LIKE 'exchange_%'
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

    console.log(`Loaded live schema for ${schemaMap.size} exchange_* tables:\n` +
      Array.from(schemaMap.keys()).map(k => `  - ${k} (${schemaMap.get(k)!.size} columns)`).join('\n') + '\n'
    );

    // 4. Scan all TypeScript files in src/
    console.log('Scanning TypeScript codebase under src/ for Supabase exchange queries...');
    const allFiles = walkDir('src');
    const allQueries: ExtractedQuery[] = [];
    for (const file of allFiles) {
      allQueries.push(...scanQueriesInFile(file));
    }
    console.log(`Discovered ${allQueries.length} query sites targeting exchange_* tables.\n`);

    // 5. Parse and validate each select query recursively
    const violations: SelectViolation[] = [];
    const skippedTables = new Set<string>();

    function validateTokens(
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

          if (targetTable.startsWith('exchange_')) {
            if (!schemaMap.has(targetTable)) {
              violations.push({
                file,
                line,
                table: targetTable,
                embedPath: currentPath,
                column: `[TABLE NOT FOUND: ${targetTable}]`
              });
            } else {
              validateTokens(targetTable, inner, currentPath, file, line);
            }
          } else {
            // Non-exchange table (leads, admin_users, lead_documents, etc.)
            skippedTables.add(targetTable);
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

          const validCols = schemaMap.get(currentTable);
          if (validCols && !validCols.has(rawCol.toLowerCase())) {
            violations.push({
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

    for (const q of allQueries) {
      validateTokens(q.table, q.selectStr, '', q.file, q.line);
    }

    console.log('============================================================================');
    console.log('EXCHANGE QUERIES SCHEMA PARITY REPORT');
    console.log('============================================================================\n');

    if (violations.length > 0) {
      console.error(`❌ VIOLATIONS FOUND (${violations.length} invalid column reference(s)):\n`);
      for (const v of violations) {
        console.error(`  • File:       ${v.file}:${v.line}`);
        console.error(`    Table:      ${v.table}`);
        console.error(`    Embed Path: ${v.embedPath}`);
        console.error(`    Invalid:    "${v.column}" does NOT exist in table "${v.table}"\n`);
      }
    } else {
      console.log('✅ ZERO VIOLATIONS FOUND. All exchange columns match database schema.\n');
    }

    console.log('----------------------------------------------------------------------------');
    console.log('SKIPPED NON-EXCHANGE EMBEDDED TABLES (Deliberately unverified):');
    console.log('  The following non-exchange tables were embedded in queries and skipped:');
    const sortedSkipped = Array.from(skippedTables).sort();
    if (sortedSkipped.length === 0) {
      console.log('  (None)');
    } else {
      for (const t of sortedSkipped) {
        console.log(`  - ${t} (External non-exchange table)`);
      }
    }
    console.log('----------------------------------------------------------------------------\n');

    if (violations.length > 0) {
      console.error(`FAILED: ${violations.length} invalid column(s) detected in exchange queries.`);
      process.exit(1);
    } else {
      console.log('SUCCESS: All exchange queries in the codebase strictly adhere to schema.');
      process.exit(0);
    }
  } finally {
    console.log(`\nCleaning up ephemeral test database: ${TEST_DB}...`);
    runPsql(`DROP DATABASE IF EXISTS ${TEST_DB};`);
    console.log('Cleanup completed.\n');
  }
}

main().catch((err) => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
