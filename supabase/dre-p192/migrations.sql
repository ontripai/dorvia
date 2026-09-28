-- ===========================================================================
-- dre_p192a_is_anonymous_session
-- ===========================================================================
-- dre-p188 turned on Supabase anonymous sign-ins so a Romanian learner can
-- practise without giving an email. An anonymous user carries the
-- `authenticated` role, so every policy written `to authenticated USING (true)`
-- silently widened from "signed-in client" to "anyone who opens the practice
-- page".
--
-- Measured on production before this migration, with a simulated anonymous JWT
-- inside a rolled-back transaction:
--
--   document_types              16 rows visible to an anonymous learner
--   exchange_banking_calendar    2 rows visible
--   exchange_nonbanking_days     0 rows (table is empty)
--   leads / admin_users / lead_messages / exchange_requests   0 rows
--
-- Client data was never exposed - those policies are scoped to
-- `user_id = auth.uid()` and an anonymous user owns no rows. What leaked is two
-- internal lookup tables, one of which (exchange_banking_calendar) carries
-- `updated_by_admin_id`, so an admin's user id was readable by any visitor.
--
-- coalesce(..., false) is deliberate: a token without the `is_anonymous` claim
-- is treated as NOT anonymous, so pre-existing sessions keep their access.
-- Anonymous tokens always carry the claim, so the side that must close, closes.

create or replace function public.is_anonymous_session()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce((((select auth.jwt()) ->> 'is_anonymous'))::boolean, false);
$$;

comment on function public.is_anonymous_session() is
  'True when the caller signed in anonymously (dre-p188 learner session). A missing claim counts as not anonymous, so pre-existing tokens keep their access.';

-- ===========================================================================
-- dre_p192b_exclude_anonymous_from_lookup_tables
-- ===========================================================================
-- Why this cannot break the application:
--   * exchange_banking_calendar and exchange_nonbanking_days are read server
--     side through supabaseAdmin (src/lib/exchangeCalendar.ts), and the
--     service_role bypasses RLS entirely.
--   * There is no session-less reader. The policies were already
--     `to authenticated`, and a request with no session runs as `anon`, which
--     has no policy on these tables at all.
-- So this migration removes exactly one thing: the anonymous learner's access.

drop policy if exists document_types_select_authenticated on public.document_types;
create policy document_types_select_authenticated
  on public.document_types
  for select
  to authenticated
  using (public.is_anonymous_session() = false);

drop policy if exists exchange_banking_calendar_select on public.exchange_banking_calendar;
create policy exchange_banking_calendar_select
  on public.exchange_banking_calendar
  for select
  to authenticated
  using (public.is_anonymous_session() = false);

drop policy if exists exchange_nonbanking_days_select on public.exchange_nonbanking_days;
create policy exchange_nonbanking_days_select
  on public.exchange_nonbanking_days
  for select
  to authenticated
  using (public.is_anonymous_session() = false);

-- ===========================================================================
-- dre_p192c_drop_duplicate_case_charges_indexes
-- ===========================================================================
-- The Supabase performance advisor found two pairs of identical indexes on
-- public.case_charges:
--
--   case_charges_created_by_idx  =  idx_case_invoices_created_by
--   case_charges_lead_id_idx     =  idx_case_invoices_lead_id
--
-- The names tell the story: the table used to be `case_invoices`, was renamed
-- to `case_charges`, and the indexes were recreated under the new names without
-- the old ones being dropped. Every write to the table pays for both.
--
-- The old `case_invoices`-named ones go; the `case_charges`-named ones stay.

drop index if exists public.idx_case_invoices_created_by;
drop index if exists public.idx_case_invoices_lead_id;
