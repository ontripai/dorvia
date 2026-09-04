-- 04_fix_rbac_rls_policies.sql
-- DORVIA Task Brief dre-p57: Fix Row Level Security (RLS) on RBAC tables
--
-- Background:
-- In migration 03_lead_portal_foundation.sql, RLS was enabled on admin_users,
-- roles, permissions, and role_permissions, but zero policies were created.
-- In PostgreSQL / Supabase, RLS enabled with 0 policies completely blocks
-- all queries by non-service_role callers (e.g. 'authenticated' users),
-- returning 0 rows even when records exist.
-- Supabase Security Advisor flagged this with code: rls_enabled_no_policy.
--
-- This migration adds secure, explicit RLS policies for all 4 tables:
-- 1. admin_users: Authenticated users can only SELECT their own record (id = auth.uid()).
--    All mutations (INSERT/UPDATE/DELETE) remain restricted to service_role only.
-- 2. roles: Authenticated users can SELECT lookup roles data.
-- 3. permissions: Authenticated users can SELECT lookup permissions catalog.
-- 4. role_permissions: Authenticated users can SELECT role-permission mappings.

BEGIN;

-- 1. admin_users
DROP POLICY IF EXISTS admin_users_select_own ON public.admin_users;
CREATE POLICY admin_users_select_own ON public.admin_users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- 2. roles
DROP POLICY IF EXISTS roles_select_authenticated ON public.roles;
CREATE POLICY roles_select_authenticated ON public.roles
  FOR SELECT TO authenticated
  USING (true);

-- 3. permissions
DROP POLICY IF EXISTS permissions_select_authenticated ON public.permissions;
CREATE POLICY permissions_select_authenticated ON public.permissions
  FOR SELECT TO authenticated
  USING (true);

-- 4. role_permissions
DROP POLICY IF EXISTS role_permissions_select_authenticated ON public.role_permissions;
CREATE POLICY role_permissions_select_authenticated ON public.role_permissions
  FOR SELECT TO authenticated
  USING (true);

-- 5. Additional safety on leads & lead_messages
-- Ensure authenticated users linked to leads can select their own records
-- (Already created in 03, reinforced here with IF NOT EXISTS checks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'leads_select_own'
  ) THEN
    CREATE POLICY leads_select_own ON public.leads
      FOR SELECT TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lead_messages' AND policyname = 'lead_messages_select_own'
  ) THEN
    CREATE POLICY lead_messages_select_own ON public.lead_messages
      FOR SELECT TO authenticated
      USING (lead_id IN (SELECT id FROM public.leads WHERE user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lead_documents' AND policyname = 'lead_documents_select_own'
  ) THEN
    CREATE POLICY lead_documents_select_own ON public.lead_documents
      FOR SELECT TO authenticated
      USING (lead_id IN (SELECT id FROM public.leads WHERE user_id = auth.uid()));
  END IF;
END $$;

COMMIT;
