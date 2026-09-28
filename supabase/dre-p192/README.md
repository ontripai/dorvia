# dre-p192 — anonymous learner sessions, and two duplicate indexes

Two findings from a Supabase advisor sweep on 2026-09-28. One of them we
introduced ourselves in dre-p188.

## 1. Anonymous sign-ins widened three policies

dre-p188 turned on Supabase anonymous sign-ins so a Romanian learner can
practise without giving an email. An anonymous user carries the `authenticated`
role, so **every policy written `to authenticated USING (true)` widened from
"signed-in client" to "anyone who opens the practice page"** the moment that
setting went on.

The security advisor flagged 35 tables, but a flag is not a leak: nearly all of
those policies are scoped to `user_id = auth.uid()`, and an anonymous user owns
no rows. Rather than reason about it, the question was asked directly:

```sql
select tablename, policyname, qual from pg_policies
where cmd in ('SELECT','ALL') and roles::text like '%authenticated%'
  and btrim(lower(qual)) in ('true','(true)');
```

Exactly three: `document_types`, `exchange_banking_calendar`,
`exchange_nonbanking_days`.

### Measured on production, before the change

With a simulated anonymous JWT inside a rolled-back transaction:

| table | rows visible to an anonymous learner |
|---|---|
| `document_types` | **16** |
| `exchange_banking_calendar` | **2** |
| `exchange_nonbanking_days` | 0 (table is empty) |
| `leads` | 0 |
| `admin_users` | 0 |
| `lead_messages` | 0 |
| `exchange_requests` | 0 |

The four zeroes are the important half: **no client data was ever exposed.** What
was exposed is two internal lookup tables, and `exchange_banking_calendar`
carries `updated_by_admin_id` — an admin's user id, readable by any visitor.

Also checked: there is no permissive **write** policy for `authenticated`
anywhere (`INSERT`/`UPDATE`/`DELETE` with `with_check` of `true` returns
nothing), and all six `romanian_*` tables are correctly scoped on both `USING`
and `WITH CHECK`.

### The fix, and why it cannot break anything

Not by turning anonymous sign-ins off — by excluding anonymous sessions from
those three policies, via the `is_anonymous` JWT claim.

* The two calendar tables are read server-side through `supabaseAdmin`
  (`src/lib/exchangeCalendar.ts`), and `service_role` bypasses RLS entirely.
* There is no session-less reader: the policies were already `to authenticated`,
  and a request with no session runs as `anon`, which has no policy on these
  tables at all.

So the change removes exactly one thing: the anonymous learner's access.

`coalesce(..., false)` is deliberate. A token minted before anonymous sign-ins
existed carries no `is_anonymous` claim; it is treated as **not** anonymous and
keeps its access. Anonymous tokens always carry the claim, so the side that must
close, closes.

## 2. Two duplicate indexes on `case_charges`

```
case_charges_created_by_idx  =  idx_case_invoices_created_by
case_charges_lead_id_idx     =  idx_case_invoices_lead_id
```

The names tell the story: the table used to be `case_invoices`, was renamed, and
the indexes were recreated under the new names without the old ones being
dropped. Every write pays for both. The `case_invoices`-named ones go.

## Verification

### On a throwaway cluster — 15 assertions, all passing

```
createdb t && psql -d t -f test-harness.sql -f migrations.sql
psql -d t -f tests.sql
```

Run on PostgreSQL 16.13. `test-harness.sql` stubs the `anon` / `authenticated` /
`service_role` roles, `auth.uid()` and — new for this task — **`auth.jwt()`**,
which is what `is_anonymous_session()` reads. It then recreates the four
production tables with their real column shapes, the three pre-migration
policies exactly as production had them, and seeds the production row counts
(16 / 2 / 0).

`tests.sql` checks **both directions of every rule**:

1. an anonymous learner sees 0 rows in all three tables;
2. an ordinary signed-in client still sees all 16 and all 2 — if this goes to 0,
   the migration has broken the portal and must be reverted;
3. a token with no `is_anonymous` claim is treated as not anonymous and keeps
   its access;
4. the signed-out `anon` role reaches none of it (true before the migration too,
   asserted so a future change cannot quietly open these tables);
5. the two duplicates are gone **by name**, and the two keepers survive — so
   dropping the wrong one of the pair fails here.

### The suite was proved able to fail

A test that can only pass is not a test. Three deliberate injections, each of
which made it go red at exactly the right assertion:

| injection | result |
|---|---|
| restore `using (true)` on `document_types` | `FAIL anonymous sees no document_types — got 16, want 0` |
| drop the keeper instead of the duplicate | `FAIL case_charges_created_by_idx survives — got 0, want 1` |
| make `is_anonymous_session()` always return `false` | `FAIL anonymous sees no document_types — got 16, want 0` |

The third is the one worth keeping in mind: it is the rubber-stamp failure mode,
where the guard exists but always says yes.

### Still to do on production

After applying, re-run the two-directional check against production inside a
transaction that is rolled back — the anonymous side must read 0, the ordinary
side must still read 16.
