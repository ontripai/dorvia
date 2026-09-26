# dre-p178 — Romanian learning loop, step 2: schema + RLS

Five tables that hold what is true about a *learner*. No Romanian content is
stored in any of them — every `*_id` column names an id that lives in
`src/content/romanian/`, deliberately without a foreign key. That is the line
that keeps the 38 build-time validators and the sourcing rules untouched by this
change.

| table | key | holds |
|---|---|---|
| `romanian_learners` | `user_id` | timezone, daily goal, streak, current station/step |
| `romanian_step_progress` | `(user_id, step_id)` | `last_item_index` — the resume point |
| `romanian_item_state` | `(user_id, item_id)` | box, mode, `due_on`, counters |
| `romanian_sessions` | `id` | one practice sitting |
| `romanian_review_events` | `id` | append-only answer log |

## State

**All 14 migrations are applied to `eufjxgjlahqupxsxmfem`** (`dre_p178a` … `dre_p178n`).
`migrations.sql` and `already-applied.sql` together are the full record of what
was applied, in order, each block under the migration name in its header.

The last one, `dre_p178n_romanian_review_events_session_index`, was added after
the Supabase advisor pointed out that the `session_id` foreign key had no
covering index — neither existing index starts with that column, so every
`on delete set null` from `romanian_sessions` would have scanned the log.

## Verification

Twice: once on a throwaway cluster where the roles can be impersonated, and then
against production inside a transaction that was rolled back.

### On a throwaway cluster — 30 assertions

`migrations.sql` was applied to a throwaway PostgreSQL 16 cluster on top of
`test-harness.sql` (which stubs `auth.users`, `auth.uid()`, `public.set_updated_at()`
and the `anon` / `authenticated` / `service_role` roles), and then
`tests.sql` exercised it as each role. 30 assertions, all passing:

```
createdb t && psql -d t -f test-harness.sql -f already-applied.sql -f migrations.sql
psql -d t -f tests.sql
```

What the tests establish, beyond "the SQL parses":

- A learner reaches only their own rows; a second learner sees **0** rows of the
  first one's, in all five tables.
- `anon` has no privilege on any of the five tables at all.
- The answer log is append-only **against the service key too** — the trigger
  rejects `UPDATE` and `DELETE` even for `service_role`, which bypasses RLS.
  That is where an accidental delete would actually come from.
- Account erasure still works: deleting the `auth.users` row cascades all 7 of
  that learner's rows away, because the guard permits a delete only once the
  parent user is already gone inside the transaction.
- A learner cannot append their own events to another learner's session.
- `TRUNCATE` is not subject to RLS, so the privilege is revoked rather than
  relied upon.
- `status = 'completed'` and `completed_at is not null` cannot disagree;
  `total_correct` cannot exceed `total_seen`; `items_correct` cannot exceed
  `items_total`; `ended_at` cannot precede `started_at`; an unknown `mode`, a
  `box` above 5 and a `daily_goal_items` of 0 are all rejected.
- A timezone that is not a real IANA zone name is rejected at write time.

## Two decisions this encodes

**Box intervals are not in the database.** The scheduler is code, and code lives
in the repo. The tables hold only which box an item is in and when it is due.

**`box_before` / `box_after` are recorded on every event.** The design requires
that the algorithm can be replaced (box → SM-2 → FSRS) without losing history.
For that, the log has to record what the scheduler decided, not only what the
learner answered.

### Against production — 8 assertions, rolled back

The policies cannot be impersonated on the live project, but the triggers and
CHECK constraints can be exercised there. A `DO` block inserted a learner, a
session and a review event using a real `auth.users` id, tried each invalid
case, and ended by raising — so the whole thing rolled back and all five tables
are still at 0 rows. All eight passed: a bad timezone rejected (23514), a good
one accepted, `UPDATE` and `DELETE` on the log rejected (23001 — the
append-only trigger, not RLS), `completed` without `completed_at` rejected,
`total_correct > total_seen` rejected, `box = 6` rejected.

The object inventory on production matches the test cluster exactly: 4/4/3/4/4
policies, 2/1/2/0/1 triggers, 4/4/4/3/4 check constraints, RLS enabled on all
five, `anon` holding no privilege on any of them, and `authenticated` holding
`INSERT, SELECT` on the log and `INSERT, SELECT, UPDATE` on the rest.
