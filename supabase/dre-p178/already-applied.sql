-- Verbatim copy of what is ALREADY applied to eufjxgjlahqupxsxmfem:
--   dre_p178a_romanian_learners_table
--   dre_p178a2_romanian_learners_enable_rls

create table public.romanian_learners (
  user_id                 uuid primary key references auth.users (id) on delete cascade,
  timezone                text        not null default 'Europe/Bucharest',
  daily_goal_items        smallint    not null default 10,
  streak_days             integer     not null default 0,
  streak_last_active_date date,
  streak_freezes_left     smallint    not null default 2,
  streak_freezes_renewed_on date,
  current_station_id      text,
  current_step_id         text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  constraint romanian_learners_timezone_not_blank   check (btrim(timezone) <> ''),
  constraint romanian_learners_daily_goal_range     check (daily_goal_items between 1 and 200),
  constraint romanian_learners_streak_days_nonneg   check (streak_days >= 0),
  constraint romanian_learners_freezes_range        check (streak_freezes_left between 0 and 10)
);

create trigger romanian_learners_set_updated_at
  before update on public.romanian_learners
  for each row execute function public.set_updated_at();

comment on table public.romanian_learners is
  'Per-learner profile for the Romanian module: timezone, daily goal, streak, and where they are in the teaching order. One row per auth user.';
comment on column public.romanian_learners.timezone is
  'IANA zone name. Stored because streak day boundaries must be computed in the learner''s own day, not the server''s.';
comment on column public.romanian_learners.current_station_id is
  'Station id from src/content/romanian — intentionally no FK: content lives in files.';
comment on column public.romanian_learners.current_step_id is
  'Step id from src/content/romanian — intentionally no FK: content lives in files.';

alter table public.romanian_learners enable row level security;
