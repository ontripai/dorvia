\set ON_ERROR_STOP off
\pset pager off
\timing off

create or replace function public.t_expect_fail(sql text, label text)
  returns text language plpgsql as $$
begin
  execute sql;
  return 'FAIL  (should have been rejected)  ' || label;
exception when others then
  return 'pass  rejected: ' || label || '   [' || sqlstate || ']';
end;
$$;

create or replace function public.t_expect_ok(sql text, label text)
  returns text language plpgsql as $$
begin
  execute sql;
  return 'pass  accepted: ' || label;
exception when others then
  return 'FAIL  (should have been accepted)  ' || label || '  -> ' || sqlerrm;
end;
$$;

\echo ''
\echo '=== A. as authenticated, jwt sub = user A ==='
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', false);
select auth.uid() as who;

select t_expect_ok($$insert into romanian_learners (user_id, timezone) values ('11111111-1111-1111-1111-111111111111','Asia/Tehran')$$, 'A1 own learner row, real IANA zone');
select t_expect_fail($$insert into romanian_learners (user_id) values ('22222222-2222-2222-2222-222222222222')$$, 'A2 learner row for ANOTHER user (RLS)');
select t_expect_fail($$insert into romanian_learners (user_id, timezone) values ('11111111-1111-1111-1111-111111111111','Mars/Olympus')$$, 'A3 nonexistent timezone (guard trigger)');
select t_expect_fail($$update romanian_learners set timezone='Not/AZone' where user_id='11111111-1111-1111-1111-111111111111'$$, 'A4 update to nonexistent timezone');
select t_expect_fail($$insert into romanian_learners (user_id, daily_goal_items) values ('11111111-1111-1111-1111-111111111111', 0)$$, 'A5 daily_goal_items = 0');

select t_expect_ok($$insert into romanian_step_progress (user_id, step_id, station_id, last_item_index) values ('11111111-1111-1111-1111-111111111111','greet-1','core-greetings',3)$$, 'A6 own step progress');
select t_expect_fail($$insert into romanian_step_progress (user_id, step_id, station_id, status) values ('11111111-1111-1111-1111-111111111111','greet-2','core-greetings','completed')$$, 'A7 status=completed with completed_at null');
select t_expect_ok($$insert into romanian_step_progress (user_id, step_id, station_id, status, completed_at) values ('11111111-1111-1111-1111-111111111111','greet-2','core-greetings','completed', now())$$, 'A8 status=completed with completed_at set');
select t_expect_fail($$insert into romanian_step_progress (user_id, step_id, station_id) values ('22222222-2222-2222-2222-222222222222','greet-1','core-greetings')$$, 'A9 step progress for ANOTHER user (RLS)');

select t_expect_ok($$insert into romanian_item_state (user_id, item_id, box, total_seen, total_correct) values ('11111111-1111-1111-1111-111111111111','w-core-bun',1,2,2)$$, 'A10 own item state');
select t_expect_fail($$insert into romanian_item_state (user_id, item_id, total_seen, total_correct) values ('11111111-1111-1111-1111-111111111111','w-core-pa',2,3)$$, 'A11 total_correct > total_seen');
select t_expect_fail($$insert into romanian_item_state (user_id, item_id, box) values ('11111111-1111-1111-1111-111111111111','w-core-pa',6)$$, 'A12 box = 6');
select t_expect_fail($$insert into romanian_item_state (user_id, item_id, mode) values ('11111111-1111-1111-1111-111111111111','w-core-pa','writing')$$, 'A13 unknown mode');

select t_expect_ok($$insert into romanian_sessions (id, user_id, station_id, step_id) values ('aaaaaaaa-0000-0000-0000-00000000000a','11111111-1111-1111-1111-111111111111','core-greetings','greet-1')$$, 'A14 own session');
select t_expect_fail($$insert into romanian_sessions (user_id, items_total, items_correct) values ('11111111-1111-1111-1111-111111111111', 5, 6)$$, 'A15 items_correct > items_total');
select t_expect_fail($$insert into romanian_sessions (user_id, started_at, ended_at) values ('11111111-1111-1111-1111-111111111111', now(), now() - interval '1 hour')$$, 'A16 ended_at before started_at');

select t_expect_ok($$insert into romanian_review_events (user_id, session_id, item_id, mode, is_correct, latency_ms, box_before, box_after) values ('11111111-1111-1111-1111-111111111111','aaaaaaaa-0000-0000-0000-00000000000a','w-core-bun','recognition',true,1400,0,1)$$, 'A17 own review event in own session');
select t_expect_ok($$insert into romanian_review_events (user_id, item_id, mode, is_correct) values ('11111111-1111-1111-1111-111111111111','w-core-bun','recognition',false)$$, 'A18 own review event, session_id null');
select t_expect_fail($$update romanian_review_events set is_correct = true where user_id='11111111-1111-1111-1111-111111111111'$$, 'A19 learner UPDATE of the log');
select t_expect_fail($$delete from romanian_review_events where user_id='11111111-1111-1111-1111-111111111111'$$, 'A20 learner DELETE from the log');
select t_expect_fail($$insert into romanian_review_events (user_id, item_id, mode, is_correct) values ('22222222-2222-2222-2222-222222222222','w-core-bun','recognition',true)$$, 'A21 review event for ANOTHER user');
select t_expect_fail($$truncate romanian_review_events$$, 'A22 learner TRUNCATE of the log');
select t_expect_fail($$truncate romanian_item_state$$, 'A23 learner TRUNCATE of item state');
select t_expect_fail($$delete from romanian_item_state where user_id='11111111-1111-1111-1111-111111111111'$$, 'A24 learner DELETE of own item state');

\echo ''
\echo '=== B. as authenticated, jwt sub = user B: must not see or touch A ==='
select set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', false);
select 'learners visible to B' as what, count(*) as n from romanian_learners
union all select 'step_progress visible to B', count(*) from romanian_step_progress
union all select 'item_state visible to B', count(*) from romanian_item_state
union all select 'sessions visible to B', count(*) from romanian_sessions
union all select 'review_events visible to B', count(*) from romanian_review_events;

select t_expect_ok($$insert into romanian_sessions (user_id) values ('22222222-2222-2222-2222-222222222222')$$, 'B1 own session');
select t_expect_fail($$insert into romanian_review_events (user_id, session_id, item_id, mode, is_correct) values ('22222222-2222-2222-2222-222222222222','aaaaaaaa-0000-0000-0000-00000000000a','w-core-bun','recognition',true)$$, 'B2 own event attached to A''s session');
select t_expect_ok($$update romanian_learners set streak_days = 99 where user_id = '11111111-1111-1111-1111-111111111111'$$, 'B3 update of A''s row is a silent no-op, not an error');
reset role;
select 'A streak_days after B tried to set 99' as what, streak_days from romanian_learners where user_id='11111111-1111-1111-1111-111111111111';

\echo ''
\echo '=== C. as anon (no jwt): nothing at all ==='
set role anon;
select set_config('request.jwt.claims', '', false);
select t_expect_fail($$select count(*) from romanian_learners$$, 'C1 anon SELECT learners');
select t_expect_fail($$select count(*) from romanian_review_events$$, 'C2 anon SELECT the log');
select t_expect_fail($$insert into romanian_learners (user_id) values ('11111111-1111-1111-1111-111111111111')$$, 'C3 anon INSERT');
reset role;

\echo ''
\echo '=== D. as service_role: bypasses RLS, but NOT the append-only guard ==='
set role service_role;
select 'review_events visible to service_role' as what, count(*) as n from romanian_review_events;
select t_expect_fail($$update romanian_review_events set is_correct = true where id > 0$$, 'D1 service_role UPDATE of the log');
select t_expect_fail($$delete from romanian_review_events where id > 0$$, 'D2 service_role DELETE from the log');
reset role;

\echo ''
\echo '=== E. updated_at trigger ==='
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111"}', false);
update romanian_learners set streak_days = 1 where user_id='11111111-1111-1111-1111-111111111111';
select case when updated_at > created_at then 'pass  updated_at moved' else 'FAIL  updated_at did not move' end as result
from romanian_learners where user_id='11111111-1111-1111-1111-111111111111';

\echo ''
\echo '=== F. account erasure: cascade must get through the append-only guard ==='
select 'rows for A before erasure' as what,
  (select count(*) from romanian_learners where user_id='11111111-1111-1111-1111-111111111111')
+ (select count(*) from romanian_step_progress where user_id='11111111-1111-1111-1111-111111111111')
+ (select count(*) from romanian_item_state where user_id='11111111-1111-1111-1111-111111111111')
+ (select count(*) from romanian_sessions where user_id='11111111-1111-1111-1111-111111111111')
+ (select count(*) from romanian_review_events where user_id='11111111-1111-1111-1111-111111111111') as n;
select t_expect_ok($$delete from auth.users where id='11111111-1111-1111-1111-111111111111'$$, 'F1 delete the auth user (cascade)');
select 'rows for A after erasure' as what,
  (select count(*) from romanian_learners where user_id='11111111-1111-1111-1111-111111111111')
+ (select count(*) from romanian_step_progress where user_id='11111111-1111-1111-1111-111111111111')
+ (select count(*) from romanian_item_state where user_id='11111111-1111-1111-1111-111111111111')
+ (select count(*) from romanian_sessions where user_id='11111111-1111-1111-1111-111111111111')
+ (select count(*) from romanian_review_events where user_id='11111111-1111-1111-1111-111111111111') as n;

\echo ''
\echo '=== G1. grants left to the browser roles ==='
select table_name, grantee, string_agg(privilege_type, ',' order by privilege_type) as privs
from information_schema.role_table_grants
where table_schema='public' and table_name like 'romanian_%' and grantee in ('anon','authenticated')
group by table_name, grantee order by table_name, grantee;

\echo ''
\echo '=== G. final object inventory ==='
select c.relname as table, c.relrowsecurity as rls,
       (select count(*) from pg_policies p where p.tablename = c.relname) as policies
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname='public' and c.relkind='r' and c.relname like 'romanian_%'
order by 1;
