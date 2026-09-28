-- dre-p192 assertions. Run AFTER test-harness.sql and migrations.sql.
--
-- Every assertion is stated as "what must be true", and the run fails loudly on
-- the first one that is not. A test that can only pass is not a test, so the
-- file checks both directions of every rule: the anonymous learner must lose
-- access, and the ordinary signed-in user must keep it.

\set ON_ERROR_STOP on

create or replace function pg_temp.check(label text, got anyelement, want anyelement)
returns void language plpgsql as $$
begin
  if got is distinct from want then
    raise exception 'FAIL % — got %, want %', label, got, want;
  end if;
  raise notice 'ok   %', label;
end $$;

-- ---------------------------------------------------------------- 1. RED
-- An anonymous learner must see nothing in any of the three tables.
begin;
set local role authenticated;
set local request.jwt.claims =
  '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated","is_anonymous":true}';

select pg_temp.check('anonymous sees no document_types',
       (select count(*)::int from public.document_types), 0);
select pg_temp.check('anonymous sees no exchange_banking_calendar',
       (select count(*)::int from public.exchange_banking_calendar), 0);
select pg_temp.check('anonymous sees no exchange_nonbanking_days',
       (select count(*)::int from public.exchange_nonbanking_days), 0);
select pg_temp.check('is_anonymous_session() is true for an anonymous token',
       public.is_anonymous_session(), true);
rollback;

-- -------------------------------------------------------------- 2. GREEN
-- An ordinary signed-in client must keep every row. If this block returns 0,
-- the migration has broken the portal and must be reverted.
begin;
set local role authenticated;
set local request.jwt.claims =
  '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated","is_anonymous":false}';

select pg_temp.check('signed-in user still sees all document_types',
       (select count(*)::int from public.document_types), 16);
select pg_temp.check('signed-in user still sees the banking calendar',
       (select count(*)::int from public.exchange_banking_calendar), 2);
select pg_temp.check('is_anonymous_session() is false for a normal token',
       public.is_anonymous_session(), false);
rollback;

-- ------------------------------------------------- 3. GREEN, older tokens
-- A token minted before anonymous sign-ins existed has no `is_anonymous` claim
-- at all. coalesce() must treat it as NOT anonymous, so such a session keeps
-- working rather than being locked out by an upgrade it never asked for.
begin;
set local role authenticated;
set local request.jwt.claims =
  '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

select pg_temp.check('a token with no is_anonymous claim is not anonymous',
       public.is_anonymous_session(), false);
select pg_temp.check('...and still sees all document_types',
       (select count(*)::int from public.document_types), 16);
rollback;

-- ----------------------------------------------------------------- 4. anon
-- The signed-out `anon` role must reach none of these tables. This was already
-- true before the migration; it is asserted so a future change cannot quietly
-- open them without a test going red.
begin;
set local role anon;
select pg_temp.check('anon sees no document_types',
       (select count(*)::int from public.document_types), 0);
select pg_temp.check('anon sees no exchange_banking_calendar',
       (select count(*)::int from public.exchange_banking_calendar), 0);
rollback;

-- ------------------------------------------------------- 5. duplicate index
-- The two `case_invoices`-named indexes are gone and the `case_charges`-named
-- ones remain. Checked by name, not by count, so dropping the wrong one of the
-- pair would fail here.
select pg_temp.check('idx_case_invoices_created_by is gone',
       (select count(*)::int from pg_indexes
         where schemaname='public' and indexname='idx_case_invoices_created_by'), 0);
select pg_temp.check('idx_case_invoices_lead_id is gone',
       (select count(*)::int from pg_indexes
         where schemaname='public' and indexname='idx_case_invoices_lead_id'), 0);
select pg_temp.check('case_charges_created_by_idx survives',
       (select count(*)::int from pg_indexes
         where schemaname='public' and indexname='case_charges_created_by_idx'), 1);
select pg_temp.check('case_charges_lead_id_idx survives',
       (select count(*)::int from pg_indexes
         where schemaname='public' and indexname='case_charges_lead_id_idx'), 1);

\echo 'dre-p192: all assertions passed'
