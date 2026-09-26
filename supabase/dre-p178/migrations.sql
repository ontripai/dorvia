-- ============================================================================
-- DORVIA Romanian — learning loop, step 2: schema + RLS
-- dre-p178   ·   2026-09-26
--
-- Boundary that governs every table below:
--   files    = what is true about Romanian   (src/content/romanian/*)
--   database = what is true about THIS learner
-- No content is stored here. Every *_id text column names an id that lives in
-- the content files, deliberately WITHOUT a foreign key, because the content is
-- not in the database. That is what keeps the 38 build-time validators and the
-- sourcing discipline untouched by this change.
--
-- Already applied to project eufjxgjlahqupxsxmfem:
--   dre_p178a_romanian_learners_table
--   dre_p178a2_romanian_learners_enable_rls   (RLS on, zero policies = deny-all)
-- Everything below this line is NOT yet applied.
--
-- Apply each numbered block as its own migration, under the name in its header,
-- in this order. Blocks 9 and 11 depend on block 7 (FK to romanian_sessions).
-- ============================================================================


-- ============================================================================
-- 2. dre_p178b_romanian_learners_rls
-- ============================================================================

create policy romanian_learners_select_own on public.romanian_learners
  for select using (user_id = (select auth.uid()));

create policy romanian_learners_insert_own on public.romanian_learners
  for insert with check (user_id = (select auth.uid()));

create policy romanian_learners_update_own on public.romanian_learners
  for update using (user_id = (select auth.uid()))
            with check (user_id = (select auth.uid()));

-- Deliberately no DELETE policy: a learner does not delete their own profile
-- row. Account deletion removes it by cascade from auth.users.

create policy romanian_learners_service_role on public.romanian_learners
  for all to service_role using (true) with check (true);


-- ============================================================================
-- 3. dre_p178c_romanian_timezone_guard
--    The design named "midnight in the server's zone" as the classic streak
--    bug. A CHECK cannot validate a zone name (pg_timezone_names is not
--    immutable), so a trigger does it. A bad zone is rejected at write time
--    rather than breaking date arithmetic at read time.
-- ============================================================================

create or replace function public.romanian_assert_timezone()
  returns trigger
  language plpgsql
  set search_path to 'public', 'pg_catalog', 'pg_temp'
as $$
begin
  if not exists (select 1 from pg_timezone_names z where z.name = new.timezone) then
    raise exception 'romanian_learners.timezone "%" is not a known IANA zone name', new.timezone
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger romanian_learners_assert_timezone
  before insert or update of timezone on public.romanian_learners
  for each row execute function public.romanian_assert_timezone();


-- ============================================================================
-- 4. dre_p178d_romanian_step_progress_table
--    "How far into the lesson did they get" — the question the 55-item list
--    page could not answer, and the reason steps were added to the content in
--    dre-p177.
-- ============================================================================

create table public.romanian_step_progress (
  user_id          uuid        not null references auth.users (id) on delete cascade,
  step_id          text        not null,
  station_id       text        not null,
  status           text        not null default 'in_progress',
  items_introduced smallint    not null default 0,
  last_item_index  smallint    not null default 0,
  started_at       timestamptz not null default now(),
  completed_at     timestamptz,
  updated_at       timestamptz not null default now(),
  primary key (user_id, step_id),
  constraint romanian_step_progress_status_known
    check (status in ('in_progress', 'completed')),
  constraint romanian_step_progress_items_nonneg
    check (items_introduced >= 0 and last_item_index >= 0),
  -- status and completed_at cannot disagree, in either direction.
  constraint romanian_step_progress_completed_consistency
    check ((status = 'completed') = (completed_at is not null)),
  constraint romanian_step_progress_completed_after_start
    check (completed_at is null or completed_at >= started_at)
);

create index romanian_step_progress_user_station
  on public.romanian_step_progress (user_id, station_id);

create trigger romanian_step_progress_set_updated_at
  before update on public.romanian_step_progress
  for each row execute function public.set_updated_at();

comment on table public.romanian_step_progress is
  'Position inside a lesson: one row per (learner, step). last_item_index is the resume point.';
comment on column public.romanian_step_progress.step_id is
  'Step id from src/content/romanian — intentionally no FK: content lives in files.';


-- ============================================================================
-- 5. dre_p178e_romanian_step_progress_rls
-- ============================================================================

alter table public.romanian_step_progress enable row level security;

create policy romanian_step_progress_select_own on public.romanian_step_progress
  for select using (user_id = (select auth.uid()));

create policy romanian_step_progress_insert_own on public.romanian_step_progress
  for insert with check (user_id = (select auth.uid()));

create policy romanian_step_progress_update_own on public.romanian_step_progress
  for update using (user_id = (select auth.uid()))
            with check (user_id = (select auth.uid()));

create policy romanian_step_progress_service_role on public.romanian_step_progress
  for all to service_role using (true) with check (true);


-- ============================================================================
-- 6. dre_p178f_romanian_item_state_table
--    Long-term memory, one row per (learner, item). Box intervals are NOT
--    stored here: the scheduler is code, and code belongs in the repo.
-- ============================================================================

create table public.romanian_item_state (
  user_id             uuid        not null references auth.users (id) on delete cascade,
  item_id             text        not null,
  box                 smallint    not null default 0,
  mode                text        not null default 'recognition',
  due_on              date        not null default current_date,
  consecutive_correct smallint    not null default 0,
  total_seen          integer     not null default 0,
  total_correct       integer     not null default 0,
  last_seen_at        timestamptz,
  updated_at          timestamptz not null default now(),
  primary key (user_id, item_id),
  constraint romanian_item_state_box_range
    check (box between 0 and 5),
  constraint romanian_item_state_mode_known
    check (mode in ('recognition', 'listening', 'production')),
  constraint romanian_item_state_counts_nonneg
    check (consecutive_correct >= 0 and total_seen >= 0 and total_correct >= 0),
  -- Catches a whole class of counter-update bugs at the source.
  constraint romanian_item_state_correct_le_seen
    check (total_correct <= total_seen)
);

-- The one query the session builder runs on every visit.
create index romanian_item_state_due
  on public.romanian_item_state (user_id, due_on);

create trigger romanian_item_state_set_updated_at
  before update on public.romanian_item_state
  for each row execute function public.set_updated_at();

comment on table public.romanian_item_state is
  'Spaced-repetition state per learner per item. item_id is a word/verb/phrase/grapheme id from src/content/romanian — intentionally no FK.';
comment on column public.romanian_item_state.mode is
  'Rung on the difficulty ladder: recognition -> listening -> production. An item advances in KIND of retrieval, not only in time.';


-- ============================================================================
-- 7. dre_p178g_romanian_item_state_rls
-- ============================================================================

alter table public.romanian_item_state enable row level security;

create policy romanian_item_state_select_own on public.romanian_item_state
  for select using (user_id = (select auth.uid()));

create policy romanian_item_state_insert_own on public.romanian_item_state
  for insert with check (user_id = (select auth.uid()));

create policy romanian_item_state_update_own on public.romanian_item_state
  for update using (user_id = (select auth.uid()))
            with check (user_id = (select auth.uid()));

create policy romanian_item_state_service_role on public.romanian_item_state
  for all to service_role using (true) with check (true);


-- ============================================================================
-- 8. dre_p178h_romanian_sessions_table
-- ============================================================================

create table public.romanian_sessions (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users (id) on delete cascade,
  station_id    text,
  step_id       text,
  started_at    timestamptz not null default now(),
  ended_at      timestamptz,
  items_total   smallint    not null default 0,
  items_correct smallint    not null default 0,
  constraint romanian_sessions_counts_nonneg
    check (items_total >= 0 and items_correct >= 0),
  constraint romanian_sessions_correct_le_total
    check (items_correct <= items_total),
  constraint romanian_sessions_ends_after_start
    check (ended_at is null or ended_at >= started_at)
);

create index romanian_sessions_user_started
  on public.romanian_sessions (user_id, started_at desc);

comment on table public.romanian_sessions is
  'One practice sitting. The unit the streak is measured in, and the parent of its review events.';


-- ============================================================================
-- 9. dre_p178i_romanian_sessions_rls
-- ============================================================================

alter table public.romanian_sessions enable row level security;

create policy romanian_sessions_select_own on public.romanian_sessions
  for select using (user_id = (select auth.uid()));

create policy romanian_sessions_insert_own on public.romanian_sessions
  for insert with check (user_id = (select auth.uid()));

create policy romanian_sessions_update_own on public.romanian_sessions
  for update using (user_id = (select auth.uid()))
            with check (user_id = (select auth.uid()));

create policy romanian_sessions_service_role on public.romanian_sessions
  for all to service_role using (true) with check (true);


-- ============================================================================
-- 10. dre_p178j_romanian_review_events_table
--     Append-only log. box_before/box_after record what the scheduler decided,
--     so the algorithm can be replaced (box -> SM-2 -> FSRS) and replayed
--     against history instead of starting over.
-- ============================================================================

create table public.romanian_review_events (
  id         bigint      generated always as identity primary key,
  user_id    uuid        not null references auth.users (id) on delete cascade,
  session_id uuid        references public.romanian_sessions (id) on delete set null,
  item_id    text        not null,
  mode       text        not null,
  is_correct boolean     not null,
  latency_ms integer,
  box_before smallint,
  box_after  smallint,
  created_at timestamptz not null default now(),
  constraint romanian_review_events_mode_known
    check (mode in ('recognition', 'listening', 'production')),
  constraint romanian_review_events_latency_sane
    check (latency_ms is null or (latency_ms >= 0 and latency_ms <= 600000)),
  constraint romanian_review_events_box_before_range
    check (box_before is null or box_before between 0 and 5),
  constraint romanian_review_events_box_after_range
    check (box_after is null or box_after between 0 and 5)
);

create index romanian_review_events_user_created
  on public.romanian_review_events (user_id, created_at desc);

create index romanian_review_events_user_item
  on public.romanian_review_events (user_id, item_id, created_at desc);

comment on table public.romanian_review_events is
  'Append-only answer log. Never updated, never deleted except by account erasure — enforced by trigger, not only by convention. The scheduler is a function over this log.';


-- ============================================================================
-- 11. dre_p178k_romanian_review_events_rls
-- ============================================================================

alter table public.romanian_review_events enable row level security;

create policy romanian_review_events_select_own on public.romanian_review_events
  for select using (user_id = (select auth.uid()));

-- The session_id clause matters: without it a learner could append their own
-- events to somebody else's session and corrupt that session's totals.
create policy romanian_review_events_insert_own on public.romanian_review_events
  for insert with check (
    user_id = (select auth.uid())
    and (
      session_id is null
      or exists (
        select 1 from public.romanian_sessions s
        where s.id = session_id and s.user_id = (select auth.uid())
      )
    )
  );

-- No UPDATE policy and no DELETE policy, for any role but service_role: the log
-- is append-only for the learner by construction.

create policy romanian_review_events_service_role on public.romanian_review_events
  for all to service_role using (true) with check (true);


-- ============================================================================
-- 12. dre_p178l_romanian_review_events_append_only
--     RLS stops the browser. This stops server-side code holding the service
--     key, which is where an accidental UPDATE or DELETE would actually come
--     from. Erasure is still allowed: during cascade from auth.users the parent
--     row is already gone inside the transaction, so the guard lets it through.
-- ============================================================================

create or replace function public.romanian_review_events_append_only()
  returns trigger
  language plpgsql
  security definer
  set search_path to 'public', 'auth', 'pg_temp'
as $$
begin
  if tg_op = 'UPDATE' then
    raise exception 'romanian_review_events is append-only: UPDATE is not permitted'
      using errcode = 'restrict_violation';
  end if;

  -- tg_op = 'DELETE'
  if exists (select 1 from auth.users u where u.id = old.user_id) then
    raise exception 'romanian_review_events is append-only: DELETE is permitted only as part of deleting the account'
      using errcode = 'restrict_violation';
  end if;

  return old;
end;
$$;

revoke all on function public.romanian_review_events_append_only() from public, anon, authenticated;

create trigger romanian_review_events_no_update
  before update on public.romanian_review_events
  for each row execute function public.romanian_review_events_append_only();

create trigger romanian_review_events_no_delete
  before delete on public.romanian_review_events
  for each row execute function public.romanian_review_events_append_only();


-- ============================================================================
-- 13. dre_p178m_romanian_grant_tightening
--     Supabase's default privileges hand anon and authenticated every privilege
--     on every new table in public, and RLS then decides what they can reach.
--     Three of those privileges are not covered by RLS or not wanted here:
--
--       TRUNCATE   is NOT subject to row level security at all. PostgREST never
--                  issues it, so it is not reachable through the API, but a
--                  privilege that can empty these tables has no reason to sit
--                  with the browser roles.
--       DELETE     no table below has a DELETE policy. Without the grant the
--                  attempt fails loudly instead of silently affecting 0 rows.
--       UPDATE     same, for the append-only log: the trigger cannot fire on a
--                  statement that matched no rows, so the grant is what makes
--                  a client bug visible.
--
--     anon is left with nothing at all. Registration is required before any
--     progress is stored, and guest practice — if it is ever offered — would by
--     definition keep no progress, so it needs no privilege here either.
-- ============================================================================

revoke truncate, references, trigger, delete on
  public.romanian_learners,
  public.romanian_step_progress,
  public.romanian_item_state,
  public.romanian_sessions,
  public.romanian_review_events
from anon, authenticated;

revoke update on public.romanian_review_events from anon, authenticated;

revoke select, insert, update on
  public.romanian_learners,
  public.romanian_step_progress,
  public.romanian_item_state,
  public.romanian_sessions,
  public.romanian_review_events
from anon;
