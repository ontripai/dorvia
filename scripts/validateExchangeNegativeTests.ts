/**
 * Real SQL Negative Test Suite for P2P Currency Exchange Schema (dre-p125)
 * Repository: github.com/ontripai/dorvia
 *
 * Requirements (dre-p125):
 * 1. Must execute REAL SQL against a live PostgreSQL instance.
 * 2. Stubs external tables: leads, lead_documents, admin_users, auth.users + roles + auth.uid().
 * 3. Applies migration docs/migrations/10_p2p_exchange_schema.sql.
 * 4. Creates valid baseline fixtures before executing invalid operations.
 * 5. Asserts that PostgreSQL actually rejects all 11 constraints (plus TRUNCATE guard on exchange_events).
 * 6. If no database is reachable, prints a clear "NOT EXECUTED / SKIPPED" message and exits non-zero.
 *    STRICTLY NO synthetic checkmarks or fabricated exception strings.
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';

const MIGRATION_PATH = path.resolve('docs/migrations/10_p2p_exchange_schema.sql');
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

  // Windows standard installation paths
  const candidateWindowsPaths = [
    'C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\15\\bin\\psql.exe'
  ];

  for (const p of candidateWindowsPaths) {
    if (fs.existsSync(p)) return p;
  }

  // Fallback to psql in system PATH
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

// Execute a SQL statement or file via psql
function runPsql(sqlCommand: string, dbName: string = PGDATABASE): { success: boolean; stdout: string; stderr: string; code: number } {
  if (!psqlBin) {
    return { success: false, stdout: '', stderr: 'psql binary not found on system', code: 127 };
  }

  const args = [
    '-h', PGHOST,
    '-p', PGPORT,
    '-U', PGUSER,
    '-d', dbName,
    '-w', // never prompt for password
    '-v', 'ON_ERROR_STOP=1',
    '-c', sqlCommand
  ];

  const env = {
    ...process.env,
    PGPASSWORD
  };

  const proc = spawnSync(psqlBin, args, {
    env,
    encoding: 'utf-8',
    timeout: 10000
  });

  return {
    success: proc.status === 0,
    stdout: proc.stdout || '',
    stderr: proc.stderr || '',
    code: proc.status ?? 1
  };
}

// Execute a SQL file via psql
function runPsqlFile(filePath: string, dbName: string = PGDATABASE): { success: boolean; stdout: string; stderr: string; code: number } {
  if (!psqlBin) {
    return { success: false, stdout: '', stderr: 'psql binary not found on system', code: 127 };
  }

  const args = [
    '-h', PGHOST,
    '-p', PGPORT,
    '-U', PGUSER,
    '-d', dbName,
    '-w',
    '-v', 'ON_ERROR_STOP=1',
    '-f', filePath
  ];

  const env = {
    ...process.env,
    PGPASSWORD
  };

  const proc = spawnSync(psqlBin, args, {
    env,
    encoding: 'utf-8',
    timeout: 30000
  });

  return {
    success: proc.status === 0,
    stdout: proc.stdout || '',
    stderr: proc.stderr || '',
    code: proc.status ?? 1
  };
}

async function main() {
  console.log('============================================================================');
  console.log('DORVIA P2P Currency Exchange Real SQL Negative Test Suite (dre-p125)');
  console.log('============================================================================\n');

  if (!fs.existsSync(MIGRATION_PATH)) {
    console.error(`❌ Migration file not found: ${MIGRATION_PATH}`);
    process.exit(1);
  }

  if (!psqlBin) {
    console.error('❌ Diagnostic: psql binary was not found in standard paths or PATH.');
    console.error('   Execution Result: SKIPPED (PostgreSQL client tooling missing).');
    process.exit(1);
  }

  console.log(`Using psql binary: ${psqlBin}`);
  console.log(`Target database: ${PGUSER}@${PGHOST}:${PGPORT}/${PGDATABASE}\n`);

  // Step 1: Probe live database connectivity
  console.log('Probing PostgreSQL connection...');
  const probe = runPsql('SELECT version();');

  if (!probe.success) {
    console.log('----------------------------------------------------------------------------');
    console.log('DATABASE CONNECTION STATUS: UNAVAILABLE / CONNECTION FAILED');
    console.log(`Connection error details:\n${probe.stderr.trim() || probe.stdout.trim() || 'Unknown connection error'}`);
    console.log('----------------------------------------------------------------------------');
    console.log('Execution Result: SKIPPED (No local or test PostgreSQL database could be reached).');
    console.log('Strict Brief Rule (dre-p125):');
    console.log('  "اگر دیتابیسی در دسترس نبود، اسکریپت باید با پیام روشن skip شود و کد خروجی غیرصفر بدهد');
    console.log('   یا صریح بگوید «اجرا نشد» — نه اینکه خروجی موفقیت‌آمیز چاپ کند.');
    console.log('   هیچ ✅ ای چاپ نشود مگر برای چیزی که واقعاً اجرا شده."\n');
    console.log('To run this test against a live PostgreSQL instance, set credentials in environment:');
    console.log('  Windows PowerShell:');
    console.log('    $env:PGPASSWORD = "your_postgres_password"');
    console.log('    $env:PGPORT = "5432"');
    console.log('    npm run validate:exchange-negative');
    console.log('============================================================================');
    process.exit(1);
  }

  console.log(`Connected to live PostgreSQL:\n  ${probe.stdout.trim().split('\n')[0]}\n`);

  // Step 2: Setup isolated test schema / database
  const TEST_DB = 'dorvia_p2p_exchange_test_runner';
  console.log(`Creating isolated database/environment: ${TEST_DB}...`);
  runPsql(`DROP DATABASE IF EXISTS ${TEST_DB};`);
  const createDb = runPsql(`CREATE DATABASE ${TEST_DB};`);
  if (!createDb.success) {
    console.error(`Failed to create test database ${TEST_DB}:\n${createDb.stderr}`);
    process.exit(1);
  }

  try {
    // Step 3: Stubs for external dependencies (auth.users, leads, lead_documents, admin_users, auth roles)
    console.log('Applying external schema stubs (leads, lead_documents, admin_users, auth.users, roles)...');
    const stubsSql = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      -- Auth schema & mock auth.uid()
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

      -- Roles expected by Supabase RLS
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

      -- RBAC tables (from migration 03, needed by migration 11)
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

      INSERT INTO public.roles (key, label_fa, label_en) VALUES
        ('owner', 'مالک', 'Owner'),
        ('manager', 'مدیر', 'Manager'),
        ('agent', 'کارشناس', 'Agent'),
        ('viewer', 'ناظر', 'Viewer')
      ON CONFLICT (key) DO NOTHING;

      -- Existing tables referenced by exchange schema
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
    console.log('Stubs applied successfully.');

    // Step 4: Apply 10_p2p_exchange_schema.sql
    console.log(`Applying migration: ${path.basename(MIGRATION_PATH)}...`);
    const migResult = runPsqlFile(MIGRATION_PATH, TEST_DB);
    if (!migResult.success) {
      console.error(`Failed to execute migration:\n${migResult.stderr}`);
      process.exit(1);
    }
    console.log('Migration executed with zero errors.\n');

    // Step 4b: Apply 11_exchange_staff_operations.sql
    console.log(`Applying migration 11: ${path.basename(MIGRATION_11_PATH)}...`);
    const mig11Result = runPsqlFile(MIGRATION_11_PATH, TEST_DB);
    if (!mig11Result.success) {
      console.error(`Failed to execute migration 11:\n${mig11Result.stderr}`);
      process.exit(1);
    }
    console.log('Migration 11 executed with zero errors.\n');

    // Step 5: Seed valid baseline data
    console.log('Seeding baseline fixtures (users, leads, exchange profiles, accounts, open request)...');
    const seedSql = `
      -- Mock users & leads
      INSERT INTO auth.users (id, email) VALUES
        ('00000000-0000-0000-0000-000000000001', 'actor@dorvia.ro'),
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'staff@dorvia.ro'),
        ('11111111-1111-1111-1111-111111111111', 'user1@dorvia.ro'),
        ('22222222-2222-2222-2222-222222222222', 'user2@dorvia.ro'),
        ('33333333-3333-3333-3333-333333333333', 'user3@dorvia.ro');

      INSERT INTO public.admin_users (id, user_id, email) VALUES
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@dorvia.ro');

      INSERT INTO public.leads (id, user_id, email, full_name, verified_at) VALUES
        ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'requester@dorvia.ro', 'Ali Rezai', now()),
        ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'acceptor@dorvia.ro', 'Elena Popescu', now()),
        ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'thirdparty@dorvia.ro', 'Mihai Radu', now());

      INSERT INTO public.exchange_profiles (id, lead_id, exchange_status, approved_at) VALUES
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'approved', now()),
        ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'approved', now());
      -- Note: dddddddd is intentionally left NOT approved for recipient tests

      -- Valid destination accounts
      INSERT INTO public.exchange_accounts (id, lead_id, kind, value, holder_name) VALUES
        ('10000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'IR_SHEBA', 'IR120000000000000000000001', 'Ali Rezai'),
        ('10000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'RO_IBAN', 'RO49BTRL0000000000000002', 'Elena Popescu');

      -- Base exchange request: 1000 EUR @ 60000 = 60,000,000 IRR, allow_partial = false
      INSERT INTO public.exchange_requests (
        id, requester_lead_id, direction, eur_currency, eur_amount, rate, irr_amount, allow_partial, destination_account_id, expires_at
      ) VALUES (
        '20000000-0000-0000-0000-000000000001',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'RO_TO_IR',
        'EUR',
        1000.00,
        60000.0000,
        60000000,
        false,
        '10000000-0000-0000-0000-000000000001',
        now() + interval '2 days'
      );

      -- Base exchange request allowing partial matching: 1000 EUR
      INSERT INTO public.exchange_requests (
        id, requester_lead_id, direction, eur_currency, eur_amount, rate, irr_amount, allow_partial, destination_account_id, expires_at
      ) VALUES (
        '20000000-0000-0000-0000-000000000002',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'RO_TO_IR',
        'EUR',
        1000.00,
        60000.0000,
        60000000,
        true,
        '10000000-0000-0000-0000-000000000001',
        now() + interval '2 days'
      );

      -- Dedicated requests for Staff Operations testing (dre-p132)
      INSERT INTO public.exchange_requests (
        id, requester_lead_id, direction, eur_currency, eur_amount, rate, irr_amount, allow_partial, destination_account_id, expires_at
      ) VALUES
      (
        '20000000-0000-0000-0000-000000000003',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'RO_TO_IR',
        'EUR',
        1000.00,
        60000.0000,
        60000000,
        false,
        '10000000-0000-0000-0000-000000000001',
        now() + interval '2 days'
      ),
      (
        '20000000-0000-0000-0000-000000000004',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'RO_TO_IR',
        'EUR',
        1000.00,
        60000.0000,
        60000000,
        false,
        '10000000-0000-0000-0000-000000000001',
        now() + interval '2 days'
      ),
      (
        '20000000-0000-0000-0000-000000000005',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'RO_TO_IR',
        'EUR',
        1000.00,
        60000.0000,
        60000000,
        false,
        '10000000-0000-0000-0000-000000000001',
        now() + interval '2 days'
      );
    `;

    const seedResult = runPsql(seedSql, TEST_DB);
    if (!seedResult.success) {
      console.error(`Failed to seed baseline data:\n${seedResult.stderr}`);
      process.exit(1);
    }
    console.log('Baseline data seeded successfully.\n');

    // Step 6: Execute Real Negative SQL Tests
    interface RealSqlTest {
      id: string;
      name: string;
      setupSql?: string;
      sql: string;
      expectedErrorPattern?: RegExp | string;
      expectSuccess?: boolean;
      verifySql?: string;
      verifyFn?: (stdout: string) => boolean;
    }

    const realTests: RealSqlTest[] = [
      // Test 1: Negative amount check
      {
        id: '1',
        name: 'Constraint 1: Monetary amounts strictly positive numeric (amount > 0)',
        sql: `
          INSERT INTO public.exchange_requests (
            requester_lead_id, direction, eur_currency, eur_amount, rate, irr_amount, destination_account_id, expires_at
          ) VALUES (
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'RO_TO_IR', 'EUR', -500.00, 60000, -30000000, '10000000-0000-0000-0000-000000000001', now() + interval '1 day'
          );
        `,
        expectedErrorPattern: /violates check constraint.*eur_amount/i
      },
      // Test 2: Sum of active matches exceeds request
      {
        id: '2',
        name: 'Constraint 2: Sum of matches exceeds request amount (600 + 500 > 1000)',
        sql: `
          -- First match 600 EUR on partial request 20000000-0000-0000-0000-000000000002
          INSERT INTO public.exchange_matches (
            request_id, acceptor_lead_id, amount_eur, rate_snapshot, amount_irr, status,
            eur_payer_lead_id, eur_receiver_lead_id, irr_payer_lead_id, irr_receiver_lead_id,
            destination_account_id, reserved_until
          ) VALUES (
            '20000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 600.00, 60000, 36000000, 'RESERVED',
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            '10000000-0000-0000-0000-000000000002', now() + interval '30 minutes'
          );

          -- Second match attempts 500 EUR (Total = 1100 > 1000)
          INSERT INTO public.exchange_matches (
            request_id, acceptor_lead_id, amount_eur, rate_snapshot, amount_irr, status,
            eur_payer_lead_id, eur_receiver_lead_id, irr_payer_lead_id, irr_receiver_lead_id,
            destination_account_id, reserved_until
          ) VALUES (
            '20000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 500.00, 60000, 30000000, 'RESERVED',
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            '10000000-0000-0000-0000-000000000002', now() + interval '30 minutes'
          );
        `,
        expectedErrorPattern: /exceeds request eur_amount/i
      },
      // Test 3: Partial match when allow_partial = false
      {
        id: '3',
        name: 'Constraint 3: Partial match on allow_partial = false request',
        sql: `
          INSERT INTO public.exchange_matches (
            request_id, acceptor_lead_id, amount_eur, rate_snapshot, amount_irr, status,
            eur_payer_lead_id, eur_receiver_lead_id, irr_payer_lead_id, irr_receiver_lead_id,
            destination_account_id, reserved_until
          ) VALUES (
            '20000000-0000-0000-0000-000000000001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 400.00, 60000, 24000000, 'RESERVED',
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            '10000000-0000-0000-0000-000000000002', now() + interval '30 minutes'
          );
        `,
        expectedErrorPattern: /does not allow partial matches/i
      },
      // Test 4: RO_IBAN linked to related party
      {
        id: '4',
        name: 'Constraint 4: RO_IBAN destination linked to Iranian related party',
        sql: `
          -- Seed related party first
          INSERT INTO public.exchange_related_parties (
            id, lead_id, party_type, full_name, relationship, national_id, country, status
          ) VALUES (
            '30000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'person', 'Hassan Rezai', 'father', '0011223344', 'IR', 'approved'
          );

          -- Attempt linking RO_IBAN to related party
          INSERT INTO public.exchange_accounts (
            lead_id, kind, value, holder_name, related_party_id
          ) VALUES (
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'RO_IBAN', 'RO49BTRL0000000000000099', 'Hassan Rezai', '30000000-0000-0000-0000-000000000001'
          );
        `,
        expectedErrorPattern: /chk_acc_ro_iban_no_related|Romanian accounts \(RO_IBAN\) cannot link to exchange_related_parties/i
      },
      // Test 5: Company party with relationship != own_company
      {
        id: '5',
        name: 'Constraint 5: Related party company with relationship != own_company',
        sql: `
          INSERT INTO public.exchange_related_parties (
            lead_id, party_type, full_name, relationship, national_id, country, status
          ) VALUES (
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'company', 'Tehran Trading SRL', 'sibling', '10101010101', 'IR', 'pending'
          );
        `,
        expectedErrorPattern: /chk_related_party_company_own/i
      },
      // Test 6: Approving authorized recipient whose lead exchange profile is unapproved
      {
        id: '6',
        name: 'Constraint 6: Approving authorized recipient whose profile is not approved',
        sql: `
          -- Recipient lead dddddddd is NOT approved in exchange_profiles
          INSERT INTO public.exchange_authorized_recipients (
            lead_id, recipient_lead_id, relationship, status
          ) VALUES (
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Friend', 'approved'
          );
        `,
        expectedErrorPattern: /must have an approved exchange_profile/i
      },
      // Test 7: Match transition to SETTLED without office payout record
      {
        id: '7',
        name: 'Constraint 7: Transition to SETTLED without office payout record',
        setupSql: `
          INSERT INTO public.exchange_matches (
            id, request_id, acceptor_lead_id, amount_eur, rate_snapshot, amount_irr, status,
            eur_payer_lead_id, eur_receiver_lead_id, irr_payer_lead_id, irr_receiver_lead_id,
            destination_account_id, reserved_until
          ) VALUES (
            '40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            1000.00, 60000, 60000000, 'IRR_CONFIRMED',
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            '10000000-0000-0000-0000-000000000002', now() + interval '1 hour'
          ) ON CONFLICT (id) DO UPDATE SET status = 'IRR_CONFIRMED';
        `,
        sql: `
          -- Attempt SETTLED without exchange_office_payouts record
          UPDATE public.exchange_matches
          SET status = 'SETTLED'
          WHERE id = '40000000-0000-0000-0000-000000000001';
        `,
        expectedErrorPattern: /without an exchange_office_payouts record/i
      },
      // Test 8: Concurrency serialization on reserve function
      {
        id: '8',
        name: 'Constraint 8: Concurrency reserve on non-open request',
        setupSql: `
          UPDATE public.exchange_requests
          SET status = 'cancelled'
          WHERE id = '20000000-0000-0000-0000-000000000001';
        `,
        sql: `
          SELECT public.fn_exchange_reserve_request_match(
            '20000000-0000-0000-0000-000000000001',
            'cccccccc-cccc-cccc-cccc-cccccccccccc',
            1000.00,
            '10000000-0000-0000-0000-000000000002'
          );
        `,
        expectedErrorPattern: /is not open for matching/i
      },
      // Test 9a: UPDATE on exchange_events with existing row
      {
        id: '9a',
        name: 'Constraint 9a: UPDATE on existing exchange_events row (append-only)',
        setupSql: `
          INSERT INTO public.exchange_events (id, actor, from_status, to_status)
          VALUES ('50000000-0000-0000-0000-000000000001', 'system', 'RESERVED', 'ACCEPTED')
          ON CONFLICT (id) DO NOTHING;
        `,
        sql: `
          UPDATE public.exchange_events
          SET to_status = 'TAMPERED'
          WHERE id = '50000000-0000-0000-0000-000000000001';
        `,
        expectedErrorPattern: /exchange_events is append-only: updates and deletes are prohibited/i
      },
      // Test 9b: DELETE on exchange_events with existing committed row (Fix 1 - dre-p126)
      {
        id: '9b',
        name: 'Constraint 9b: DELETE on existing exchange_events row (append-only)',
        setupSql: `
          INSERT INTO public.exchange_events (id, actor, from_status, to_status)
          VALUES ('50000000-0000-0000-0000-000000000002', 'system', 'RESERVED', 'ACCEPTED')
          ON CONFLICT (id) DO NOTHING;
        `,
        sql: `
          DELETE FROM public.exchange_events
          WHERE id = '50000000-0000-0000-0000-000000000002';
        `,
        expectedErrorPattern: /exchange_events is append-only: updates and deletes are prohibited/i
      },
      // Test 9c: TRUNCATE on exchange_events (Fix 1 - dre-p125)
      {
        id: '9c',
        name: 'Constraint 9c (Fix 1): TRUNCATE TABLE exchange_events (statement trigger)',
        setupSql: `
          INSERT INTO public.exchange_events (id, actor, from_status, to_status)
          VALUES ('50000000-0000-0000-0000-000000000003', 'system', 'RESERVED', 'ACCEPTED')
          ON CONFLICT (id) DO NOTHING;
        `,
        sql: `
          TRUNCATE TABLE public.exchange_events;
        `,
        expectedErrorPattern: /exchange_events is append-only: truncate is prohibited/i
      },
      // Test 10: State machine illegal transition (Fix 2 - dre-p126: RESERVED directly to EUR_RECEIVED)
      {
        id: '10',
        name: 'Constraint 10: Illegal state machine transition (RESERVED directly to EUR_RECEIVED)',
        setupSql: `
          INSERT INTO public.exchange_matches (
            id, request_id, acceptor_lead_id, amount_eur, rate_snapshot, amount_irr, status,
            eur_payer_lead_id, eur_receiver_lead_id, irr_payer_lead_id, irr_receiver_lead_id,
            destination_account_id, reserved_until
          ) VALUES (
            '40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            100.00, 60000, 6000000, 'RESERVED',
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            '10000000-0000-0000-0000-000000000002', now() + interval '1 hour'
          ) ON CONFLICT (id) DO UPDATE SET status = 'RESERVED';
        `,
        sql: `
          -- Attempt illegal skip from RESERVED directly to EUR_RECEIVED (bypassing ACCEPTED)
          UPDATE public.exchange_matches
          SET status = 'EUR_RECEIVED'
          WHERE id = '40000000-0000-0000-0000-000000000002';
        `,
        expectedErrorPattern: /Illegal state machine transition.*from RESERVED to EUR_RECEIVED|Illegal state machine transition/i
      },
      // Test 11: Transition to IRR_CONFIRMED without receiver proof (Addendum 2)
      {
        id: '11',
        name: 'Constraint 11: Transition to IRR_CONFIRMED without receiver transfer proof',
        setupSql: `
          INSERT INTO public.exchange_matches (
            id, request_id, acceptor_lead_id, amount_eur, rate_snapshot, amount_irr, status,
            eur_payer_lead_id, eur_receiver_lead_id, irr_payer_lead_id, irr_receiver_lead_id,
            destination_account_id, reserved_until
          ) VALUES (
            '40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            100.00, 60000, 6000000, 'IRR_PROOF_SUBMITTED',
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            '10000000-0000-0000-0000-000000000002', now() + interval '1 hour'
          ) ON CONFLICT (id) DO UPDATE SET status = 'IRR_PROOF_SUBMITTED';
        `,
        sql: `
          -- Attempt transition to IRR_CONFIRMED without exchange_transfer_proofs (side='receiver')
          UPDATE public.exchange_matches
          SET status = 'IRR_CONFIRMED'
          WHERE id = '40000000-0000-0000-0000-000000000003';
        `,
        expectedErrorPattern: /without receiver proof of transfer in exchange_transfer_proofs/i
      },
      // Test 12 (Staff Op 1): Receipt on match in RESERVED status rejected
      {
        id: '12',
        name: 'Staff Op 1: Office receipt rejected on match in RESERVED status',
        setupSql: `
          INSERT INTO public.exchange_matches (
            id, request_id, acceptor_lead_id, amount_eur, rate_snapshot, amount_irr, fee_eur, status,
            eur_payer_lead_id, eur_receiver_lead_id, irr_payer_lead_id, irr_receiver_lead_id,
            destination_account_id, reserved_until
          ) VALUES (
            '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            1000.00, 60000, 60000000, 20.00, 'RESERVED',
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            '10000000-0000-0000-0000-000000000002', now() + interval '1 hour'
          ) ON CONFLICT (id) DO UPDATE SET status = 'RESERVED';
        `,
        sql: `
          SELECT public.fn_exchange_record_office_receipt(
            '50000000-0000-0000-0000-000000000001',
            1020.00,
            'EUR',
            'partner_exchange',
            NULL,
            'REF-12',
            'REC-12',
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            now(),
            'Receipt attempt on RESERVED'
          );
        `,
        expectedErrorPattern: /expected ACCEPTED|Cannot record office receipt.*status RESERVED/i
      },
      // Test 13 (Staff Op 2): Receipt with incorrect EUR amount rejected
      {
        id: '13',
        name: 'Staff Op 2: Office receipt rejected when amount does not match (amount_eur + fee_eur)',
        setupSql: `
          INSERT INTO public.exchange_matches (
            id, request_id, acceptor_lead_id, amount_eur, rate_snapshot, amount_irr, fee_eur, status,
            eur_payer_lead_id, eur_receiver_lead_id, irr_payer_lead_id, irr_receiver_lead_id,
            destination_account_id, reserved_until
          ) VALUES (
            '50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            1000.00, 60000, 60000000, 20.00, 'ACCEPTED',
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            '10000000-0000-0000-0000-000000000002', now() + interval '1 hour'
          ) ON CONFLICT (id) DO UPDATE SET status = 'ACCEPTED';
        `,
        sql: `
          -- Expected exactly 1020.00 EUR (1000 + 20 fee), passed 1000.00 EUR
          SELECT public.fn_exchange_record_office_receipt(
            '50000000-0000-0000-0000-000000000002',
            1000.00,
            'EUR',
            'partner_exchange',
            NULL,
            'REF-13',
            'REC-13',
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            now(),
            'Underpaid receipt'
          );
        `,
        expectedErrorPattern: /Invalid EUR receipt amount 1000\.00.*expected exactly 1020\.00/i
      },
      // Test 14 (Staff Op 3): Valid office receipt succeeds -> status becomes EUR_RECEIVED
      {
        id: '14',
        name: 'Staff Op 3: Valid office receipt succeeds and advances match to EUR_RECEIVED',
        expectSuccess: true,
        sql: `
          SELECT public.fn_exchange_record_office_receipt(
            '50000000-0000-0000-0000-000000000002',
            1020.00,
            'EUR',
            'partner_exchange',
            NULL,
            'REF-14',
            'REC-14',
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            now(),
            'Valid full receipt'
          );
        `,
        verifySql: `
          SELECT status FROM public.exchange_matches WHERE id = '50000000-0000-0000-0000-000000000002';
        `,
        verifyFn: (stdout: string) => stdout.includes('EUR_RECEIVED')
      },
      // Test 15 (Staff Op 4): Second receipt on same match rejected (idempotency guard)
      {
        id: '15',
        name: 'Staff Op 4: Second receipt on same match rejected (state gate & unique index uq_exchange_office_receipts_match)',
        sql: `
          SELECT public.fn_exchange_record_office_receipt(
            '50000000-0000-0000-0000-000000000002',
            1020.00,
            'EUR',
            'partner_exchange',
            NULL,
            'REF-15',
            'REC-15',
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            now(),
            'Second receipt attempt'
          );
        `,
        expectedErrorPattern: /expected ACCEPTED|Cannot record office receipt.*status EUR_RECEIVED|uq_exchange_office_receipts_match|duplicate key/i
      },
      // Test 16 (Staff Op 5): Payout rejected on match not IRR_CONFIRMED
      {
        id: '16',
        name: 'Staff Op 5: Office payout rejected on match that is not in IRR_CONFIRMED status',
        sql: `
          -- Match 50000000-0000-0000-0000-000000000002 is in EUR_RECEIVED, not IRR_CONFIRMED
          SELECT public.fn_exchange_record_office_payout(
            '50000000-0000-0000-0000-000000000002',
            1000.00,
            'EUR',
            'partner_exchange',
            NULL,
            'REF-16',
            'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'PAY-16',
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            now(),
            'Premature payout attempt'
          );
        `,
        expectedErrorPattern: /expected IRR_CONFIRMED|Cannot record office payout.*status EUR_RECEIVED/i
      },
      // Test 17 (Staff Op 6): Payout to unauthorized recipient rejected
      {
        id: '17',
        name: 'Staff Op 6: Office payout to unauthorized lead rejected (neither receiver nor authorized recipient)',
        setupSql: `
          INSERT INTO public.exchange_matches (
            id, request_id, acceptor_lead_id, amount_eur, rate_snapshot, amount_irr, fee_eur, status,
            eur_payer_lead_id, eur_receiver_lead_id, irr_payer_lead_id, irr_receiver_lead_id,
            destination_account_id, reserved_until
          ) VALUES (
            '50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            1000.00, 60000, 60000000, 20.00, 'IRR_CONFIRMED',
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            '10000000-0000-0000-0000-000000000002', now() + interval '1 hour'
          ) ON CONFLICT (id) DO UPDATE SET status = 'IRR_CONFIRMED';
        `,
        sql: `
          -- Lead dddddddd is neither eur_receiver (cccccccc) nor an approved authorized recipient
          SELECT public.fn_exchange_record_office_payout(
            '50000000-0000-0000-0000-000000000003',
            1000.00,
            'EUR',
            'partner_exchange',
            NULL,
            'REF-17',
            'dddddddd-dddd-dddd-dddd-dddddddddddd',
            'PAY-17',
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            now(),
            'Payout to unauthorized lead'
          );
        `,
        expectedErrorPattern: /is neither EUR receiver.*nor an approved authorized recipient/i
      },
      // Test 18 (Staff Op 7): Payout to approved authorized recipient succeeds -> status becomes SETTLED
      {
        id: '18',
        name: 'Staff Op 7: Office payout to approved authorized recipient succeeds and advances match to SETTLED',
        expectSuccess: true,
        setupSql: `
          -- 1. Ensure recipient dddddddd has approved exchange profile
          INSERT INTO public.exchange_profiles (lead_id, exchange_status, approved_at)
          VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'approved', now())
          ON CONFLICT (lead_id) DO UPDATE SET exchange_status = 'approved';

          -- 2. Add approved authorized recipient relation
          INSERT INTO public.exchange_authorized_recipients (
            lead_id, recipient_lead_id, relationship, status, verified_at
          ) VALUES (
            'cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'business_partner', 'approved', now()
          ) ON CONFLICT DO NOTHING;
        `,
        sql: `
          SELECT public.fn_exchange_record_office_payout(
            '50000000-0000-0000-0000-000000000003',
            1000.00,
            'EUR',
            'partner_exchange',
            NULL,
            'REF-18',
            'dddddddd-dddd-dddd-dddd-dddddddddddd',
            'PAY-18',
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            now(),
            'Payout released to authorized recipient'
          );
        `,
        verifySql: `
          SELECT status FROM public.exchange_matches WHERE id = '50000000-0000-0000-0000-000000000003';
        `,
        verifyFn: (stdout: string) => stdout.includes('SETTLED')
      },
      // Test 19 (Staff Op 8): Verify staff audit events in exchange_events
      {
        id: '19',
        name: 'Staff Op 8: Verify immutable audit events logged with actor = staff for both operations',
        expectSuccess: true,
        sql: `
          SELECT id, actor, to_status, payload->>'receipt_no' as receipt_no
          FROM public.exchange_events
          WHERE actor = 'staff' AND actor_user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
          ORDER BY created_at ASC;
        `,
        verifyFn: (stdout: string) => stdout.includes('EUR_RECEIVED') && stdout.includes('SETTLED') && stdout.includes('REC-14') && stdout.includes('PAY-18')
      }
    ];

    let allPassed = true;

    for (const test of realTests) {
      console.log(`----------------------------------------------------------------------------`);
      console.log(`[TEST #${test.id}] ${test.name}`);

      // If test has a separate setup step, execute and commit it first
      if (test.setupSql) {
        const setupResult = runPsql(test.setupSql, TEST_DB);
        if (!setupResult.success) {
          console.error(`❌ FAILED: Setup SQL for test #${test.id} failed:\n${setupResult.stderr}`);
          allPassed = false;
          continue;
        }
      }

      const result = runPsql(test.sql, TEST_DB);

      if (test.expectSuccess) {
        if (!result.success) {
          console.error(`❌ FAILED: Expected success, but PostgreSQL threw an error:`);
          console.error(result.stderr);
          allPassed = false;
          continue;
        }

        if (test.verifySql) {
          const verifyResult = runPsql(test.verifySql, TEST_DB);
          if (!verifyResult.success || (test.verifyFn && !test.verifyFn(verifyResult.stdout))) {
            console.error(`❌ FAILED: Post-operation verification check failed.`);
            console.error(`Verify stdout: ${verifyResult.stdout}`);
            allPassed = false;
            continue;
          }
        } else if (test.verifyFn && !test.verifyFn(result.stdout)) {
          console.error(`❌ FAILED: Query output verification check failed.`);
          console.error(`Query stdout: ${result.stdout}`);
          allPassed = false;
          continue;
        }

        console.log(`Real PostgreSQL Output:`);
        const cleanOut = result.stdout.trim().split('\n').slice(0, 5).join('\n');
        console.log(`   ${cleanOut}`);
        console.log(`✅ RESULT: Operation verified on live PostgreSQL.`);
      } else {
        if (result.success) {
          if (result.stdout.includes('DELETE 0') || result.stdout.includes('UPDATE 0')) {
            console.error(`❌ FAILED: Statement affected 0 rows (table or target row was empty, trigger was not invoked)!`);
            console.error(`Output: ${result.stdout.trim()}`);
          } else {
            console.error(`❌ FAILED: Statement succeeded but was expected to throw an exception!`);
            console.error(`Output: ${result.stdout}`);
          }
          allPassed = false;
          continue;
        }

        const rawError = result.stderr.trim();
        const matches = typeof test.expectedErrorPattern === 'string'
          ? rawError.includes(test.expectedErrorPattern)
          : test.expectedErrorPattern?.test(rawError);

        if (!matches) {
          console.error(`❌ FAILED: Unexpected error returned by PostgreSQL.`);
          console.error(`Expected pattern: ${test.expectedErrorPattern}`);
          console.error(`Actual PostgreSQL stderr:\n${rawError}`);
          allPassed = false;
          continue;
        }

        // Format the exact PostgreSQL error message (extract first ERROR line)
        const errorLine = rawError.split('\n').find(l => l.includes('ERROR:')) || rawError.split('\n')[0];
        console.log(`Real PostgreSQL Exception:`);
        console.log(`   ${errorLine.trim()}`);
        console.log(`✅ RESULT: Constraint verified on live PostgreSQL.`);
      }
    }

    console.log('\n============================================================================');
    if (allPassed) {
      console.log('🎉 ALL NEGATIVE TESTS PASSED ON LIVE POSTGRESQL INSTANCE!');
    } else {
      console.error('❌ SOME REAL SQL TESTS FAILED.');
    }
    console.log('============================================================================');

    process.exit(allPassed ? 0 : 1);
  } finally {
    // Cleanup test database
    runPsql(`DROP DATABASE IF EXISTS ${TEST_DB};`);
  }
}

main().catch((err) => {
  console.error('Fatal unexpected runner error:', err);
  process.exit(1);
});
