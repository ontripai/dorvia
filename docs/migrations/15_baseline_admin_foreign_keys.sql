-- ============================================================================
-- Migration 15: Foreign keys and policies that depend on admin_users
--
-- Task: dre-p143
--
-- Companion to 02b_baseline_legacy_tables.sql. The tables created there run
-- before 03_lead_portal_foundation.sql (because migration 03 defines a policy
-- on lead_messages), so at that point public.admin_users does not exist yet.
-- This file adds the remaining foreign keys and the row-level security
-- policies once every referenced table is in place.
--
-- SAFETY: every statement is guarded; applying this to the existing
-- production database is a no-op.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Foreign keys pointing at admin_users
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  r record;
  v_tbl text;
BEGIN
  FOR r IN
    SELECT * FROM (VALUES
      ('lead_assignments', NULL,           'staff_id',             'lead_assignments_staff_id_fkey',       'ON DELETE CASCADE'),
      ('case_stages',      NULL,           'responsible_staff_id', 'case_stages_responsible_staff_id_fkey','ON DELETE SET NULL'),
      ('case_expenses',    NULL,           'created_by',           'case_expenses_created_by_fkey',        ''),
      ('case_invoices',    'case_charges', 'created_by',           'case_invoices_created_by_fkey',        ''),
      ('blog_posts',       NULL,           'author_admin_id',      'blog_posts_author_admin_id_fkey',      ''),
      ('job_listings',     NULL,           'author_admin_id',      'job_listings_author_admin_id_fkey',    ''),
      ('app_settings',     NULL,           'updated_by',           'app_settings_updated_by_fkey',         '')
    ) AS v(tbl, tbl_renamed, col, fk_name, on_delete)
  LOOP
    -- migration 09b renames case_invoices -> case_charges; resolve whichever exists
    v_tbl := NULL;
    IF EXISTS (SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = r.tbl) THEN
      v_tbl := r.tbl;
    ELSIF r.tbl_renamed IS NOT NULL
      AND EXISTS (SELECT 1 FROM information_schema.tables
                   WHERE table_schema = 'public' AND table_name = r.tbl_renamed) THEN
      v_tbl := r.tbl_renamed;
    END IF;

    IF v_tbl IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = r.fk_name)
    THEN
      EXECUTE format(
        'ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES public.admin_users(id) %s',
        v_tbl, r.fk_name, r.col, r.on_delete
      );
    END IF;
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- 2. Row level security policies
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS lead_assignments_select_own ON public.lead_assignments;
CREATE POLICY lead_assignments_select_own ON public.lead_assignments
  FOR SELECT TO authenticated
  USING (staff_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS case_stages_select_via_assignment ON public.case_stages;
CREATE POLICY case_stages_select_via_assignment ON public.case_stages
  FOR SELECT TO authenticated
  USING (
    lead_id IN (SELECT la.lead_id FROM public.lead_assignments la
                 WHERE la.staff_id = (SELECT auth.uid()))
    OR lead_id IN (SELECT l.id FROM public.leads l
                    WHERE l.user_id = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS document_types_select_authenticated ON public.document_types;
CREATE POLICY document_types_select_authenticated ON public.document_types
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS case_expenses_service_role_only ON public.case_expenses;
CREATE POLICY case_expenses_service_role_only ON public.case_expenses
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS app_settings_service_role_only ON public.app_settings;
CREATE POLICY app_settings_service_role_only ON public.app_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS blog_categories_public_read ON public.blog_categories;
CREATE POLICY blog_categories_public_read ON public.blog_categories
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS blog_categories_service_role_write ON public.blog_categories;
CREATE POLICY blog_categories_service_role_write ON public.blog_categories
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS blog_posts_public_read_published ON public.blog_posts;
CREATE POLICY blog_posts_public_read_published ON public.blog_posts
  FOR SELECT TO public USING (status = 'published');

DROP POLICY IF EXISTS blog_posts_service_role_all ON public.blog_posts;
CREATE POLICY blog_posts_service_role_all ON public.blog_posts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS job_categories_public_read ON public.job_categories;
CREATE POLICY job_categories_public_read ON public.job_categories
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS job_categories_service_role_write ON public.job_categories;
CREATE POLICY job_categories_service_role_write ON public.job_categories
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS job_listings_public_read_published ON public.job_listings;
CREATE POLICY job_listings_public_read_published ON public.job_listings
  FOR SELECT TO public USING (status = 'published');

DROP POLICY IF EXISTS job_listings_service_role_all ON public.job_listings;
CREATE POLICY job_listings_service_role_all ON public.job_listings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- invoice_installments is dropped by migration 09b; guard its policy
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
              WHERE table_schema='public' AND table_name='invoice_installments') THEN
    DROP POLICY IF EXISTS invoice_installments_service_role_only ON public.invoice_installments;
    CREATE POLICY invoice_installments_service_role_only ON public.invoice_installments
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- case_invoices is renamed to case_charges by migration 09b; resolve either name
DO $$
DECLARE v_tbl text;
BEGIN
  SELECT table_name INTO v_tbl
    FROM information_schema.tables
   WHERE table_schema = 'public'
     AND table_name IN ('case_invoices', 'case_charges')
   ORDER BY CASE table_name WHEN 'case_invoices' THEN 0 ELSE 1 END
   LIMIT 1;

  IF v_tbl IS NOT NULL THEN
    EXECUTE format('DROP POLICY IF EXISTS case_invoices_service_role_only ON public.%I', v_tbl);
    EXECUTE format(
      'CREATE POLICY case_invoices_service_role_only ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true)',
      v_tbl);
  END IF;
END $$;

COMMIT;
