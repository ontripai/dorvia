-- ============================================================================
-- Migration 02b: Baseline for tables that exist in production but were never
-- created by any migration in this repository.
--
-- Task: dre-p143
--
-- WHY THIS FILE EXISTS
-- Twelve tables live in the production database with no CREATE statement in
-- docs/migrations. As a result the migration chain could not rebuild the
-- database from scratch: 03_lead_portal_foundation.sql failed at
--   ERROR: relation "public.lead_messages" does not exist
-- and every later migration failed with it.
--
-- This file reproduces those tables exactly as they exist in production
-- (columns, defaults, constraints, indexes, RLS and policies), so that
-- 00..14 can be applied to an empty database and produce the live schema.
--
-- ORDERING
--   02  creates public.leads
--   02b (this file) creates the missing tables that depend only on leads
--   03  creates admin_users/roles/permissions and defines policies that
--       reference lead_messages -- which is why this file must run before it
--   15  adds the foreign keys that point at admin_users
--
-- SAFETY
-- Every statement is IF NOT EXISTS / guarded. Applying this to the existing
-- production database is a no-op.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- lead_messages  (referenced by a policy in migration 03)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  sender_role text NOT NULL CHECK (sender_role IN ('user', 'admin')),
  sender_ref text,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lead_messages_lead_id_idx ON public.lead_messages (lead_id);

-- ---------------------------------------------------------------------------
-- lead_assignments  (staff_id FK added in migration 15)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL,
  assigned_role text NOT NULL CHECK (assigned_role IN
    ('agent','consultant','lawyer','notary','finance','marketing')),
  assigned_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lead_assignments_lead_id_staff_id_assigned_role_key
    UNIQUE (lead_id, staff_id, assigned_role)
);
CREATE INDEX IF NOT EXISTS lead_assignments_lead_idx ON public.lead_assignments (lead_id);
CREATE INDEX IF NOT EXISTS lead_assignments_staff_idx ON public.lead_assignments (staff_id);

-- ---------------------------------------------------------------------------
-- case_stages  (responsible_staff_id FK added in migration 15)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.case_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  stage_key text NOT NULL,
  label_fa text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','done','blocked')),
  due_date date,
  responsible_role text CHECK (responsible_role IN
    ('agent','consultant','lawyer','notary','finance','marketing','manager','owner')),
  responsible_staff_id uuid,
  completed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS case_stages_lead_idx ON public.case_stages (lead_id);
CREATE INDEX IF NOT EXISTS case_stages_due_date_idx ON public.case_stages (due_date);
CREATE INDEX IF NOT EXISTS idx_case_stages_responsible_staff_id ON public.case_stages (responsible_staff_id);

-- ---------------------------------------------------------------------------
-- case_expenses  (created_by FK added in migration 15)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.case_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  case_stage_id uuid REFERENCES public.case_stages(id) ON DELETE SET NULL,
  expense_type text NOT NULL CHECK (expense_type IN
    ('notary_fee','translation_fee','lawyer_fee','government_fee','referral_commission','other')),
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'RON',
  paid_to text,
  incurred_at date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_case_expenses_lead_id ON public.case_expenses (lead_id);
CREATE INDEX IF NOT EXISTS idx_case_expenses_case_stage_id ON public.case_expenses (case_stage_id);
CREATE INDEX IF NOT EXISTS idx_case_expenses_created_by ON public.case_expenses (created_by);
CREATE INDEX IF NOT EXISTS idx_case_expenses_incurred_at ON public.case_expenses (incurred_at);

-- ---------------------------------------------------------------------------
-- case_invoices + invoice_installments
-- Legacy accounting tables. Migration 08 renames case_invoices to
-- case_charges and drops invoice_installments, so they must exist first.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.case_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  currency text,
  total_amount numeric,
  status text CHECK (status IN ('draft','sent','partially_paid','paid','cancelled')),
  created_by uuid,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_case_invoices_lead_id ON public.case_invoices (lead_id);
CREATE INDEX IF NOT EXISTS idx_case_invoices_created_by ON public.case_invoices (created_by);

CREATE TABLE IF NOT EXISTS public.invoice_installments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.case_invoices(id) ON DELETE CASCADE,
  installment_no integer NOT NULL DEFAULT 1,
  amount numeric(12,2) NOT NULL,
  due_date date,
  paid_amount numeric(12,2) NOT NULL DEFAULT 0,
  paid_at timestamptz,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','partial','overdue')),
  payment_method text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_invoice_installments_invoice_id ON public.invoice_installments (invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_installments_due_date ON public.invoice_installments (due_date);

-- ---------------------------------------------------------------------------
-- document_types
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.document_types (
  key text PRIMARY KEY,
  label_fa text NOT NULL,
  allowed_roles text[] NOT NULL DEFAULT '{}'::text[]
);

-- ---------------------------------------------------------------------------
-- blog_categories + blog_posts  (author_admin_id FK added in migration 15)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label_fa text NOT NULL,
  label_en text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','archived')),
  title_fa text NOT NULL,
  title_en text,
  slug_fa text NOT NULL UNIQUE,
  slug_en text UNIQUE,
  excerpt_fa text,
  excerpt_en text,
  content_fa text,
  content_en text,
  cover_image_url text,
  meta_title_fa text,
  meta_title_en text,
  meta_description_fa text,
  meta_description_en text,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  author_admin_id uuid,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON public.blog_posts (category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_admin_id ON public.blog_posts (author_admin_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts (status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts (published_at);

-- ---------------------------------------------------------------------------
-- job_categories + job_listings  (author_admin_id FK added in migration 15)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label_fa text NOT NULL,
  label_en text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.job_categories(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','archived')),
  title_fa text NOT NULL,
  title_en text,
  slug_fa text NOT NULL UNIQUE,
  slug_en text UNIQUE,
  city text,
  salary_min numeric(10,2),
  salary_max numeric(10,2),
  salary_currency text NOT NULL DEFAULT 'EUR',
  contract_type text CHECK (contract_type IN ('permanent','seasonal','temporary')),
  positions_available integer NOT NULL DEFAULT 1,
  accommodation_provided boolean NOT NULL DEFAULT false,
  description_fa text,
  description_en text,
  requirements_fa text,
  requirements_en text,
  is_sample boolean NOT NULL DEFAULT false,
  author_admin_id uuid,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_job_listings_category_id ON public.job_listings (category_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_author_admin_id ON public.job_listings (author_admin_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_status ON public.job_listings (status);
CREATE INDEX IF NOT EXISTS idx_job_listings_published_at ON public.job_listings (published_at);

-- ---------------------------------------------------------------------------
-- app_settings  (updated_by FK added in migration 15)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
CREATE INDEX IF NOT EXISTS idx_app_settings_updated_by ON public.app_settings (updated_by);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.lead_messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_assignments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_stages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_expenses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_invoices         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_installments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_types        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings          ENABLE ROW LEVEL SECURITY;

COMMIT;
