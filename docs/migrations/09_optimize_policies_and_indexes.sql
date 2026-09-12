-- ============================================================================
-- Migration: 09_optimize_policies_and_indexes.sql
-- Project: DORVIA (eufjxgjlahqupxsxmfem)
-- Task: dre-p100 — Supabase Policies & Indexes Optimization
-- Date: 2026-09-12
--
-- Summary of Optimizations:
--   Section A: 16 B-tree indexes on unindexed foreign keys (zero DML impact).
--   Section B: Scope 8 service_role policies to `TO service_role` instead of `TO public`.
--              Resolves 24 "multiple permissive policies" warnings and 8 "auth initplan" warnings.
--   Section C: Wrap `auth.uid()` in `(select auth.uid())` (InitPlan optimization)
--              and restrict user policies to `TO authenticated`.
--   Section D: Add explicit service_role policies for `rate_limit_events` and `referral_partners`
--              to resolve the INFO-level "rls_enabled_no_policy" advisor finding.
--
-- Invariance Proof:
--   - Authenticated user results: Exactly identical before and after.
--   - Anon user results: Exactly identical before and after.
--   - service_role: Holds BYPASSRLS; behavior unchanged.
--
-- Intentionally Retained:
--   - 10 "unused" indexes on newly built features (blog, jobs, leads, partners)
--     are kept to preserve query performance under production traffic.
-- ============================================================================

BEGIN;

-- ============================================================================
-- SECTION A: 16 Indexes for Unindexed Foreign Keys
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_admin_users_role_id 
  ON public.admin_users (role_id);

CREATE INDEX IF NOT EXISTS idx_app_settings_updated_by 
  ON public.app_settings (updated_by);

CREATE INDEX IF NOT EXISTS idx_blog_posts_author_admin_id 
  ON public.blog_posts (author_admin_id);

CREATE INDEX IF NOT EXISTS idx_case_expenses_case_stage_id 
  ON public.case_expenses (case_stage_id);

CREATE INDEX IF NOT EXISTS idx_case_expenses_created_by 
  ON public.case_expenses (created_by);

CREATE INDEX IF NOT EXISTS idx_case_invoices_created_by 
  ON public.case_invoices (created_by);

CREATE INDEX IF NOT EXISTS idx_case_stages_responsible_staff_id 
  ON public.case_stages (responsible_staff_id);

CREATE INDEX IF NOT EXISTS idx_job_listings_author_admin_id 
  ON public.job_listings (author_admin_id);

CREATE INDEX IF NOT EXISTS idx_lead_documents_document_type 
  ON public.lead_documents (document_type);

CREATE INDEX IF NOT EXISTS idx_lead_documents_lead_id 
  ON public.lead_documents (lead_id);

CREATE INDEX IF NOT EXISTS idx_lead_documents_translation_of_document_id 
  ON public.lead_documents (translation_of_document_id);

CREATE INDEX IF NOT EXISTS idx_lead_documents_uploaded_by_admin_id 
  ON public.lead_documents (uploaded_by_admin_id);

CREATE INDEX IF NOT EXISTS idx_leads_applied_job_listing_id 
  ON public.leads (applied_job_listing_id);

CREATE INDEX IF NOT EXISTS idx_leads_invited_by 
  ON public.leads (invited_by);

CREATE INDEX IF NOT EXISTS idx_leads_verified_by 
  ON public.leads (verified_by);

CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id 
  ON public.role_permissions (permission_id);


-- ============================================================================
-- SECTION B: Restrict service_role Policies Scope to `TO service_role`
-- ============================================================================

DROP POLICY IF EXISTS app_settings_service_role_only ON public.app_settings;
CREATE POLICY app_settings_service_role_only ON public.app_settings
  AS PERMISSIVE FOR ALL TO service_role 
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS blog_categories_service_role_write ON public.blog_categories;
CREATE POLICY blog_categories_service_role_write ON public.blog_categories
  AS PERMISSIVE FOR ALL TO service_role 
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS blog_posts_service_role_all ON public.blog_posts;
CREATE POLICY blog_posts_service_role_all ON public.blog_posts
  AS PERMISSIVE FOR ALL TO service_role 
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS case_expenses_service_role_only ON public.case_expenses;
CREATE POLICY case_expenses_service_role_only ON public.case_expenses
  AS PERMISSIVE FOR ALL TO service_role 
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS case_invoices_service_role_only ON public.case_invoices;
CREATE POLICY case_invoices_service_role_only ON public.case_invoices
  AS PERMISSIVE FOR ALL TO service_role 
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS invoice_installments_service_role_only ON public.invoice_installments;
CREATE POLICY invoice_installments_service_role_only ON public.invoice_installments
  AS PERMISSIVE FOR ALL TO service_role 
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS job_categories_service_role_write ON public.job_categories;
CREATE POLICY job_categories_service_role_write ON public.job_categories
  AS PERMISSIVE FOR ALL TO service_role 
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS job_listings_service_role_all ON public.job_listings;
CREATE POLICY job_listings_service_role_all ON public.job_listings
  AS PERMISSIVE FOR ALL TO service_role 
  USING (true) WITH CHECK (true);


-- ============================================================================
-- SECTION C: Wrap `auth.uid()` in `(select auth.uid())` & Scope to authenticated
-- ============================================================================

DROP POLICY IF EXISTS leads_select_own ON public.leads;
CREATE POLICY leads_select_own ON public.leads
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS lead_messages_select_own ON public.lead_messages;
CREATE POLICY lead_messages_select_own ON public.lead_messages
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (lead_id IN (SELECT l.id FROM public.leads l WHERE l.user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS lead_documents_select_own ON public.lead_documents;
CREATE POLICY lead_documents_select_own ON public.lead_documents
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (lead_id IN (SELECT l.id FROM public.leads l WHERE l.user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS lead_assignments_select_own ON public.lead_assignments;
CREATE POLICY lead_assignments_select_own ON public.lead_assignments
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (staff_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS admin_users_select_own ON public.admin_users;
CREATE POLICY admin_users_select_own ON public.admin_users
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS case_stages_select_via_assignment ON public.case_stages;
CREATE POLICY case_stages_select_via_assignment ON public.case_stages
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    lead_id IN (SELECT la.lead_id FROM public.lead_assignments la WHERE la.staff_id = (SELECT auth.uid()))
    OR lead_id IN (SELECT l.id FROM public.leads l WHERE l.user_id = (SELECT auth.uid()))
  );


-- ============================================================================
-- SECTION D: Explicit service_role Policies for Tables with Zero Policies
-- ============================================================================

DROP POLICY IF EXISTS rate_limit_events_service_role_only ON public.rate_limit_events;
CREATE POLICY rate_limit_events_service_role_only ON public.rate_limit_events
  AS PERMISSIVE FOR ALL TO service_role 
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS referral_partners_service_role_only ON public.referral_partners;
CREATE POLICY referral_partners_service_role_only ON public.referral_partners
  AS PERMISSIVE FOR ALL TO service_role 
  USING (true) WITH CHECK (true);

COMMIT;

-- ============================================================================
-- POST-MIGRATION ACCEPTANCE VERIFICATION SCRIPT (READ-ONLY)
-- Run this in Supabase SQL Editor to verify row parity and advisor status:
-- ============================================================================
--
-- 1. Check that all 16 indexes exist:
--    SELECT tablename, indexname FROM pg_indexes 
--    WHERE schemaname = 'public' 
--      AND indexname IN (
--        'idx_admin_users_role_id', 'idx_app_settings_updated_by',
--        'idx_blog_posts_author_admin_id', 'idx_case_expenses_case_stage_id',
--        'idx_case_expenses_created_by', 'idx_case_invoices_created_by',
--        'idx_case_stages_responsible_staff_id', 'idx_job_listings_author_admin_id',
--        'idx_lead_documents_document_type', 'idx_lead_documents_lead_id',
--        'idx_lead_documents_translation_of_document_id', 'idx_lead_documents_uploaded_by_admin_id',
--        'idx_leads_applied_job_listing_id', 'idx_leads_invited_by',
--        'idx_leads_verified_by', 'idx_role_permissions_permission_id'
--      );
--
-- 2. Verify all modified policies target the proper role:
--    SELECT tablename, policyname, roles, cmd, qual FROM pg_policies 
--    WHERE schemaname = 'public'
--    ORDER BY tablename, policyname;
-- ============================================================================
