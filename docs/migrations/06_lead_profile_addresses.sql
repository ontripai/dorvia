-- 06_lead_profile_addresses.sql
-- DORVIA Task Brief dre-p80: Customer Portal Self-Service Profile Completion
--
-- Three separate address concepts, distinct from the existing
-- address_line/address_city/address_postal_code (used for "current residence"
-- in the admin case file and portal profile — untouched by this migration):
-- 1. iran_address: home-country (Iran) address
-- 2. other_residency_address: address in another country, only if the
--    customer already holds residency somewhere other than Iran (optional)
-- 3. romania_address: address in Romania after arrival
--
-- Target table: public.leads
-- Live Supabase Project: eufjxgjlahqupxsxmfem

BEGIN;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS iran_address text,
  ADD COLUMN IF NOT EXISTS other_residency_address text,
  ADD COLUMN IF NOT EXISTS romania_address text;

COMMIT;
