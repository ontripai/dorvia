-- Minimal Supabase-shaped harness so the dre-p192 migration can be applied to a
-- throwaway cluster and its policies actually exercised.
--
-- Beyond the dre-p178 harness this adds `auth.jwt()`, because that is what
-- `public.is_anonymous_session()` reads. `auth.uid()` alone is not enough here:
-- the whole point of this change is a claim other than `sub`.

do $h$ begin
  if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname='service_role') then create role service_role nologin bypassrls; end if;
end $h$;

create schema auth;

create table auth.users (
  id uuid primary key,
  email text
);

create or replace function auth.uid() returns uuid
  language sql stable
as $$
  select (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid;
$$;

-- Mirrors Supabase: the whole claim set as jsonb, empty object when unset.
create or replace function auth.jwt() returns jsonb
  language sql stable
as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb);
$$;

grant usage on schema public to anon, authenticated, service_role;
grant usage on schema auth to anon, authenticated, service_role;

-- --- The three tables this migration re-policies -------------------------
-- Shapes copied from production (information_schema), not invented.

create table public.document_types (
  key text primary key,
  label_fa text,
  allowed_roles text[]
);

create table public.exchange_banking_calendar (
  id uuid primary key default gen_random_uuid(),
  country text,
  weekly_closed int[],
  updated_by_admin_id uuid,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table public.exchange_nonbanking_days (
  id uuid primary key default gen_random_uuid(),
  date date,
  country text,
  reason text,
  created_by_admin_id uuid,
  created_at timestamptz default now()
);

-- --- The table the duplicate indexes live on -----------------------------
create table public.case_charges (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid,
  created_by uuid
);
create index case_charges_created_by_idx on public.case_charges (created_by);
create index idx_case_invoices_created_by on public.case_charges (created_by);
create index case_charges_lead_id_idx     on public.case_charges (lead_id);
create index idx_case_invoices_lead_id    on public.case_charges (lead_id);

-- --- The pre-migration policies, exactly as production had them ----------
alter table public.document_types            enable row level security;
alter table public.exchange_banking_calendar enable row level security;
alter table public.exchange_nonbanking_days  enable row level security;

create policy document_types_select_authenticated
  on public.document_types for select to authenticated using (true);
create policy exchange_banking_calendar_select
  on public.exchange_banking_calendar for select to authenticated using (true);
create policy exchange_nonbanking_days_select
  on public.exchange_nonbanking_days for select to authenticated using (true);

grant select on public.document_types, public.exchange_banking_calendar,
                public.exchange_nonbanking_days to anon, authenticated, service_role;

-- --- Seed, matching production row counts --------------------------------
insert into public.document_types (key, label_fa)
select 'doc_' || g, 'سند ' || g from generate_series(1, 16) g;

insert into public.exchange_banking_calendar (country, weekly_closed, updated_by_admin_id)
values ('IR', '{5}', '33333333-3333-3333-3333-333333333333'),
       ('RO', '{0,6}', '33333333-3333-3333-3333-333333333333');

-- exchange_nonbanking_days stays empty, as in production.
