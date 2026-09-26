-- Minimal Supabase-shaped harness so the dre-p178 migrations can be applied
-- and their policies actually exercised.
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

-- Same definition as production (public.set_updated_at).
create or replace function public.set_updated_at()
  returns trigger
  language plpgsql
  set search_path to 'public', 'pg_temp'
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

grant usage on schema public to anon, authenticated, service_role;
grant usage on schema auth to anon, authenticated, service_role;
alter default privileges in schema public
  grant select, insert, update, delete, references, trigger
  on tables to anon, authenticated, service_role;

-- Two learners to test isolation with.
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'a@example.test'),
  ('22222222-2222-2222-2222-222222222222', 'b@example.test');
