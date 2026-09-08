-- 05_referral_partners_and_anniversaries.sql
-- DORVIA Task Brief dre-p71: Referral Partners Tracking + Birthday/Anniversary Automation
--
-- 1. Table referral_partners: Tracks referral partners (read/managed strictly via service_role API routes)
-- 2. RLS enabled on referral_partners without public/authenticated policies (mirroring job_listings)
-- 3. Lead linkage to referral partners via referred_by_partner_id + foreign key index
-- 4. Birthday & Anniversary tracking columns on leads & admin_users with yearly greeting deduplication
-- 5. Updated case_expenses check constraint to accept 'referral_commission'

BEGIN;

-- 1. Create referral_partners table
CREATE TABLE IF NOT EXISTS public.referral_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text,
  email text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Enable RLS (Strict server-side service_role only access, matching job_listings pattern)
ALTER TABLE public.referral_partners ENABLE ROW LEVEL SECURITY;

-- 3. Link leads to referral_partners
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS referred_by_partner_id uuid REFERENCES public.referral_partners(id),
  ADD COLUMN IF NOT EXISTS last_birthday_greeted_year integer,
  ADD COLUMN IF NOT EXISTS last_anniversary_greeted_year integer;

-- Add index on foreign key to satisfy database performance advisors
CREATE INDEX IF NOT EXISTS leads_referred_by_partner_id_idx
  ON public.leads(referred_by_partner_id);

-- 4. Admin Users birthday tracking
ALTER TABLE public.admin_users
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS last_birthday_greeted_year integer;

-- 5. Update case_expenses constraint to include 'referral_commission'
ALTER TABLE public.case_expenses
  DROP CONSTRAINT IF EXISTS case_expenses_expense_type_check;

ALTER TABLE public.case_expenses
  ADD CONSTRAINT case_expenses_expense_type_check
  CHECK (expense_type IN (
    'notary_fee',
    'translation_fee',
    'lawyer_fee',
    'government_fee',
    'referral_commission',
    'other'
  ));

COMMIT;
