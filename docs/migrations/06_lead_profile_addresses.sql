-- 06_lead_profile_addresses.sql
-- DORVIA Task Brief dre-p80: Customer Portal Self-Service Profile Completion
--
-- 1. Add current_address (text, nullable): current residence address of lead/customer
-- 2. Add romania_address (text, nullable): address in Romania after arrival
--
-- Target table: public.leads
-- Live Supabase Project: eufjxgjlahqupxsxmfem

BEGIN;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS current_address text,
  ADD COLUMN IF NOT EXISTS romania_address text;

COMMIT;
