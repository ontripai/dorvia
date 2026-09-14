/**
 * Database Migration Schema Rebuild Validator (dre-p143)
 * Repository: github.com/ontripai/dorvia
 *
 * Requirements (dre-p143):
 * 1. Must execute against a live PostgreSQL database instance.
 * 2. Applies external dependency stubs (auth schema, auth.uid(), roles, extensions).
 * 3. Applies ALL migrations in docs/migrations/*.sql strictly in alphabetical order.
 * 4. Extracts live schema from information_schema.columns for public tables.
 * 5. Compares against scripts/fixtures/production-schema-snapshot.txt.
 * 6. Explicitly documents and validates expected architectural exceptions.
 * 7. If database is unreachable, prints "NOT EXECUTED / SKIPPED" and exits non-zero.
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';

const MIGRATIONS_DIR = path.resolve('docs/migrations');
const SNAPSHOT_PATH = path.resolve('scripts/fixtures/production-schema-snapshot.txt');

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

function runPsql(sql: string, targetDb: string = PGDATABASE, extraArgs: string[] = []): PsqlResult {
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

  args.push(...extraArgs, '-X', '-v', 'ON_ERROR_STOP=1', '-c', sql);

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

// Documented exceptions between production snapshot and migration rebuild
interface DocumentedException {
  table: string;
  type: 'snapshot_only' | 'rebuild_only';
  reason: string;
}

export const DOCUMENTED_EXCEPTIONS: DocumentedException[] = [
  {
    table: 'case_invoices',
    type: 'snapshot_only',
    reason: 'Renamed to case_charges by migration 09b (accounting overhaul).'
  },
  {
    table: 'invoice_installments',
    type: 'snapshot_only',
    reason: 'Dropped by migration 09b (superseded by receipt_allocations and case_charges).'
  },
  {
    table: 'case_charges',
    type: 'rebuild_only',
    reason: 'Created / renamed from case_invoices by migration 09b.'
  },
  {
    table: 'case_receipts',
    type: 'rebuild_only',
    reason: 'Created by migration 09b for case client payment receipts.'
  },
  {
    table: 'receipt_allocations',
    type: 'rebuild_only',
    reason: 'Created by migration 09b for allocating receipts to charges.'
  },
  {
    table: 'comments',
    type: 'rebuild_only',
    reason: 'Created by migration 01 for blog and site comments.'
  },
  {
    table: 'page_comments',
    type: 'rebuild_only',
    reason: 'Created by migration 01 for page-level comment threads.'
  }
];

async function main() {
  console.log('============================================================================');
  console.log('DORVIA Database Schema Rebuild & Parity Validator (dre-p143)');
  console.log('============================================================================\n');

  if (!psqlBin) {
    console.error('CRITICAL: psql binary could not be found.');
    console.error('Execution Result: NOT EXECUTED / SKIPPED');
    process.exit(1);
  }

  if (!fs.existsSync(SNAPSHOT_PATH)) {
    console.error(`CRITICAL: Snapshot fixture not found at: ${SNAPSHOT_PATH}`);
    process.exit(1);
  }

  console.log(`Using psql binary: ${psqlBin}`);
  console.log(`Target database: ${PGUSER}@${PGHOST}:${PGPORT}/${PGDATABASE}\n`);

  // Step 1: Probe PostgreSQL connection
  console.log('Probing PostgreSQL connection...');
  const probe = runPsql('SELECT version();');
  if (!probe.success) {
    console.error('----------------------------------------------------------------------------');
    console.error('DATABASE CONNECTION STATUS: UNAVAILABLE / CONNECTION FAILED');
    console.error('Connection error details:');
    console.error(probe.stderr.trim() || probe.stdout.trim() || 'Unknown error');
    console.error('----------------------------------------------------------------------------');
    console.error('Execution Result: NOT EXECUTED / SKIPPED');
    console.error('Strict Brief Rule (dre-p143):');
    console.error('  "اگر پستگرس در دسترس نبود: «NOT EXECUTED» و خروج غیرصفر. هیچ تیک سبز ساختگی."\n');
    process.exit(1);
  }

  const dbVersion = probe.stdout.trim().split('\n')[2]?.trim() || probe.stdout.trim().split('\n')[0] || 'PostgreSQL';
  console.log(`Connected to live database instance: ${dbVersion}\n`);

  // Step 2: Create isolated ephemeral test database
  const TEST_DB = `dorvia_schema_rebuild_${Date.now()}`;
  console.log(`Creating isolated ephemeral test database: ${TEST_DB}...`);
  const createDbRes = runPsql(`CREATE DATABASE ${TEST_DB};`);
  if (!createDbRes.success) {
    console.error(`Failed to create ephemeral database:\n${createDbRes.stderr}`);
    process.exit(1);
  }
  console.log(`Database ${TEST_DB} created successfully.\n`);

  try {
    // Step 3: Apply external stubs (auth schema, auth.uid(), roles, extensions)
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

    // Step 4: Discover all migration files in docs/migrations and sort alphabetically
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b));

    console.log(`Discovered ${migrationFiles.length} migrations to execute in sequence:`);
    migrationFiles.forEach((file, index) => {
      console.log(`  ${String(index + 1).padStart(2, '0')}. ${file}`);
    });
    console.log('');

    // Execute each migration file sequentially
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

    let hasErrors = false;

    // Step 4b: Verify case_charges foreign keys and RLS policy (Self-Test 3 - dre-p143)
    console.log('============================================================================');
    console.log('SELF-TEST 3: case_charges FOREIGN KEYS & POLICIES VERIFICATION');
    console.log('============================================================================');

    const EXPECTED_CASE_CHARGES_FKS = [
      'case_invoices_created_by_fkey|FOREIGN KEY (created_by) REFERENCES admin_users(id)',
      'case_invoices_lead_id_fkey|FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE'
    ];

    const EXPECTED_CASE_CHARGES_POLICIES = [
      'case_invoices_service_role_only|{service_role}'
    ];

    const normalizeLines = (raw: string): string[] => {
      return raw
        .split('\n')
        .map((line) => line.split('|').map((part) => part.trim()).join('|').trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
    };

    const sortedExpectedFks = [...EXPECTED_CASE_CHARGES_FKS].map((l) => l.trim()).sort();
    const sortedExpectedPolicies = [...EXPECTED_CASE_CHARGES_POLICIES].map((l) => l.trim()).sort();

    // Query and assert Foreign Keys
    const fkQuery = `
      SELECT conname, pg_get_constraintdef(oid)
      FROM pg_constraint
      WHERE conrelid = 'public.case_charges'::regclass AND contype = 'f'
      ORDER BY conname;
    `;
    const fkRes = runPsql(fkQuery, TEST_DB, ['-t', '-A', '-F', '|']);
    const actualFks = normalizeLines(fkRes.stdout);

    const fksMatch =
      actualFks.length === sortedExpectedFks.length &&
      actualFks.every((val, idx) => val === sortedExpectedFks[idx]);

    if (!fkRes.success || !fksMatch) {
      hasErrors = true;
      console.error('❌ SELF-TEST 3 FAILED: case_charges foreign keys do not match expected definition.');
      console.error('Expected Foreign Keys:');
      sortedExpectedFks.forEach((k) => console.error(`   [EXPECTED] ${k}`));
      console.error('Actual Foreign Keys:');
      if (actualFks.length === 0) {
        console.error('   (none found)');
      } else {
        actualFks.forEach((k) => console.error(`   [ACTUAL]   ${k}`));
      }
      const missingFks = sortedExpectedFks.filter((k) => !actualFks.includes(k));
      if (missingFks.length > 0) {
        missingFks.forEach((k) => console.error(`   Missing foreign key: ${k.split('|')[0]}`));
      }
      const unexpectedFks = actualFks.filter((k) => !sortedExpectedFks.includes(k));
      if (unexpectedFks.length > 0) {
        unexpectedFks.forEach((k) => console.error(`   Unexpected foreign key: ${k.split('|')[0]}`));
      }
      if (fkRes.stderr.trim()) {
        console.error(`Error: ${fkRes.stderr.trim()}`);
      }
      console.error('');
    } else {
      console.log(`✅ SELF-TEST 3: case_charges has exactly the ${sortedExpectedFks.length} expected foreign keys.`);
    }

    // Query and assert RLS Policies
    const policyQuery = `
      SELECT policyname, roles::text FROM pg_policies
      WHERE schemaname='public' AND tablename='case_charges'
      ORDER BY policyname;
    `;
    const policyRes = runPsql(policyQuery, TEST_DB, ['-t', '-A', '-F', '|']);
    const actualPolicies = normalizeLines(policyRes.stdout);

    const policiesMatch =
      actualPolicies.length === sortedExpectedPolicies.length &&
      actualPolicies.every((val, idx) => val === sortedExpectedPolicies[idx]);

    if (!policyRes.success || !policiesMatch) {
      hasErrors = true;
      console.error('❌ SELF-TEST 3 FAILED: case_charges RLS policies do not match expected definition.');
      console.error('Expected Policies:');
      sortedExpectedPolicies.forEach((p) => console.error(`   [EXPECTED] ${p}`));
      console.error('Actual Policies:');
      if (actualPolicies.length === 0) {
        console.error('   (none found)');
      } else {
        actualPolicies.forEach((p) => console.error(`   [ACTUAL]   ${p}`));
      }
      const missingPolicies = sortedExpectedPolicies.filter((p) => !actualPolicies.includes(p));
      if (missingPolicies.length > 0) {
        missingPolicies.forEach((p) => console.error(`   Missing policy: ${p.split('|')[0]}`));
      }
      const unexpectedPolicies = actualPolicies.filter((p) => !sortedExpectedPolicies.includes(p));
      if (unexpectedPolicies.length > 0) {
        unexpectedPolicies.forEach((p) => console.error(`   Unexpected policy: ${p.split('|')[0]}`));
      }
      if (policyRes.stderr.trim()) {
        console.error(`Error: ${policyRes.stderr.trim()}`);
      }
      console.error('');
    } else {
      console.log(`✅ SELF-TEST 3: case_charges has exactly the ${sortedExpectedPolicies.length} expected RLS policy.`);
    }
    console.log('============================================================================\n');

    // Step 5: Read target schema from production snapshot fixture
    console.log(`Loading reference production snapshot from: ${path.basename(SNAPSHOT_PATH)}...`);
    const snapshotRaw = fs.readFileSync(SNAPSHOT_PATH, 'utf8');
    const targetSchema: Record<string, string[]> = {};

    snapshotRaw.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [table, colsStr] = trimmed.split('|');
      if (table && colsStr) {
        targetSchema[table.trim()] = colsStr.split(',').map((c) => c.trim()).filter(Boolean);
      }
    });

    console.log(`Loaded snapshot containing ${Object.keys(targetSchema).length} target tables.\n`);

    // Step 6: Query information_schema.columns for live schema in rebuilt database
    console.log('Extracting live rebuilt schema from information_schema.columns...');
    const schemaSql = `
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;

    const env = { ...process.env };
    if (PGPASSWORD) env.PGPASSWORD = PGPASSWORD;

    const schemaRes = spawnSync(psqlBin, [
      '-h', PGHOST,
      '-p', PGPORT,
      '-U', PGUSER,
      '-d', TEST_DB,
      '-t', '-A', '-F', '|',
      '-c', schemaSql
    ], { env, encoding: 'utf8' });

    if (schemaRes.status !== 0) {
      console.error(`Failed to extract live schema:\n${schemaRes.stderr}`);
      process.exit(1);
    }

    const liveSchema: Record<string, string[]> = {};
    schemaRes.stdout.trim().split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const [tbl, col] = trimmed.split('|');
      if (tbl && col) {
        liveSchema[tbl.trim()] = liveSchema[tbl.trim()] || [];
        liveSchema[tbl.trim()].push(col.trim());
      }
    });

    console.log(`Extracted live schema containing ${Object.keys(liveSchema).length} public tables.\n`);

    // Step 7: Compare live schema against snapshot
    console.log('============================================================================');
    console.log('SCHEMA REBUILD PARITY COMPARISON REPORT');
    console.log('============================================================================\n');

    // Check 1: Missing Tables
    const snapshotOnlyExceptions = new Set(
      DOCUMENTED_EXCEPTIONS.filter((e) => e.type === 'snapshot_only').map((e) => e.table)
    );
    const missingTables = Object.keys(targetSchema).filter(
      (table) => !liveSchema[table] && !snapshotOnlyExceptions.has(table)
    );

    if (missingTables.length > 0) {
      hasErrors = true;
      console.error(`❌ MISSING TABLES (${missingTables.length} table(s) in snapshot missing from rebuilt schema):`);
      missingTables.forEach((tbl) => console.error(`   - ${tbl}`));
      console.error('');
    } else {
      console.log('✅ All non-excepted snapshot tables are present in rebuilt schema.');
    }

    // Check 2: Extra Tables
    const rebuildOnlyExceptions = new Set(
      DOCUMENTED_EXCEPTIONS.filter((e) => e.type === 'rebuild_only').map((e) => e.table)
    );
    const unexpectedTables = Object.keys(liveSchema).filter(
      (table) => !targetSchema[table] && !rebuildOnlyExceptions.has(table)
    );

    if (unexpectedTables.length > 0) {
      hasErrors = true;
      console.error(`❌ UNEXPECTED TABLES (${unexpectedTables.length} table(s) in rebuilt schema not in snapshot):`);
      unexpectedTables.forEach((tbl) => console.error(`   - ${tbl}`));
      console.error('');
    } else {
      console.log('✅ All rebuilt tables either match snapshot or are documented architectural additions.');
    }

    // Check 3: Missing Columns Per Table
    const tablesWithMissingCols: Record<string, string[]> = {};
    for (const [table, targetCols] of Object.entries(targetSchema)) {
      if (snapshotOnlyExceptions.has(table)) continue;
      const liveCols = liveSchema[table];
      if (!liveCols) continue; // reported in missing tables

      const missing = targetCols.filter((col) => !liveCols.includes(col));
      if (missing.length > 0) {
        tablesWithMissingCols[table] = missing;
      }
    }

    if (Object.keys(tablesWithMissingCols).length > 0) {
      hasErrors = true;
      console.error(`❌ MISSING COLUMNS (${Object.keys(tablesWithMissingCols).length} table(s) missing expected columns):`);
      for (const [tbl, cols] of Object.entries(tablesWithMissingCols)) {
        console.error(`   - Table ${tbl} missing ${cols.length} column(s): ${cols.join(', ')}`);
      }
      console.error('');
    } else {
      console.log('✅ All columns from production snapshot are present in every rebuilt table.');
    }

    console.log('\n----------------------------------------------------------------------------');
    console.log('DOCUMENTED ARCHITECTURAL EXCEPTIONS:');
    DOCUMENTED_EXCEPTIONS.forEach((e) => {
      console.log(`  • [${e.type}] ${e.table}: ${e.reason}`);
    });
    console.log('----------------------------------------------------------------------------\n');

    if (hasErrors) {
      console.error('❌ VALIDATION FAILED: Rebuilt schema diverged from production baseline.');
      process.exit(1);
    }

    console.log('============================================================================');
    console.log('🎉 SCHEMA REBUILD VALIDATION PASSED WITH ZERO DISCREPANCIES!');
    console.log('   The complete migration chain successfully reproduces the production schema.');
    console.log('============================================================================');
  } finally {
    // Step 8: Teardown ephemeral database
    runPsql(`DROP DATABASE IF EXISTS ${TEST_DB};`);
  }
}

main().catch((err) => {
  console.error('Unhandled validator error:', err);
  process.exit(1);
});
