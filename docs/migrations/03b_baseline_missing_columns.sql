-- ============================================================================
-- Migration 03b: Baseline for missing columns on core tables
-- Task: dre-p143
--
-- Adds 23 columns across admin_users, lead_documents, and leads that exist
-- in production but were missing in the original migration sequence before
-- migration 09.
--
-- RULES:
--   - Strictly ADD COLUMN IF NOT EXISTS
--   - No ALTER TYPE, DROP, or foreign key constraints
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- admin_users (3 columns)
-- ---------------------------------------------------------------------------
ALTER TABLE public.admin_users
  ADD COLUMN IF NOT EXISTS telegram_chat_id text,
  ADD COLUMN IF NOT EXISTS notify_email boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_telegram boolean NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- lead_documents (5 columns)
-- ---------------------------------------------------------------------------
ALTER TABLE public.lead_documents
  ADD COLUMN IF NOT EXISTS document_type text,
  ADD COLUMN IF NOT EXISTS language text,
  ADD COLUMN IF NOT EXISTS translation_of_document_id uuid,
  ADD COLUMN IF NOT EXISTS translation_office text,
  ADD COLUMN IF NOT EXISTS is_certified_translation boolean NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- leads (15 columns)
-- ---------------------------------------------------------------------------
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS bot_major text,
  ADD COLUMN IF NOT EXISTS bot_sub text,
  ADD COLUMN IF NOT EXISTS admin_comment text,
  ADD COLUMN IF NOT EXISTS family_group_id uuid,
  ADD COLUMN IF NOT EXISTS national_id_or_passport text,
  ADD COLUMN IF NOT EXISTS address_city text,
  ADD COLUMN IF NOT EXISTS employment_status text,
  ADD COLUMN IF NOT EXISTS applied_job_listing_id uuid,
  ADD COLUMN IF NOT EXISTS relation_to_primary text,
  ADD COLUMN IF NOT EXISTS is_family_primary boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS anniversary_date date,
  ADD COLUMN IF NOT EXISTS address_line text,
  ADD COLUMN IF NOT EXISTS address_postal_code text,
  ADD COLUMN IF NOT EXISTS education_level text;

COMMIT;
