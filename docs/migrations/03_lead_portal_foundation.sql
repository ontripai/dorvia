-- 03_lead_portal_foundation.sql
-- Phase 1 of the DORVIA Lead Portal: auth linkage on leads, real RBAC for the
-- future admin panel, and a documents metadata scaffold for the future
-- documents phase. No UI/route changes ship with this migration.
--
-- IMPORTANT: this file must actually be EXECUTED against the live Supabase
-- project (eufjxgjlahqupxsxmfem), not just committed to the repo. A prior
-- migration (docs/migrations/02_security_rls_policies.sql, from PR #58) was
-- committed but never run — do not repeat that mistake.

BEGIN;

-- 1. Link leads to Supabase Auth users + track the verify/invite gate
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS verified_by uuid,
  ADD COLUMN IF NOT EXISTS invited_at timestamptz,
  ADD COLUMN IF NOT EXISTS invited_by uuid;

CREATE UNIQUE INDEX IF NOT EXISTS leads_user_id_unique
  ON public.leads(user_id) WHERE user_id IS NOT NULL;

-- 2. RBAC: roles / permissions / role_permissions / admin_users
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label_fa text NOT NULL,
  label_en text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label_fa text NOT NULL,
  label_en text NOT NULL,
  description text
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES public.roles(id),
  full_name text,
  permission_overrides jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Now that admin_users exists, wire up the FKs on leads
ALTER TABLE public.leads
  ADD CONSTRAINT leads_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.admin_users(id),
  ADD CONSTRAINT leads_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.admin_users(id);

-- 3. Document metadata scaffold (Phase 3 will use this; created now so the
-- schema is finalized in one pass — the Storage bucket itself does not exist
-- yet and is NOT created by this migration, confirmed via
-- `select * from storage.buckets` returning empty on 2026-09-04).
CREATE TABLE IF NOT EXISTS public.lead_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  uploaded_by_role text NOT NULL CHECK (uploaded_by_role IN ('lead','admin')),
  uploaded_by_admin_id uuid REFERENCES public.admin_users(id),
  storage_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  size_bytes bigint,
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_documents ENABLE ROW LEVEL SECURITY;
-- Deliberately NO policies on roles/permissions/role_permissions/admin_users:
-- these are read/written only via server-side API routes using the
-- service_role client (supabaseAdmin), never directly from the browser.

CREATE POLICY leads_select_own ON public.leads
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY lead_messages_select_own ON public.lead_messages
  FOR SELECT USING (lead_id IN (SELECT id FROM public.leads WHERE user_id = auth.uid()));

CREATE POLICY lead_documents_select_own ON public.lead_documents
  FOR SELECT USING (lead_id IN (SELECT id FROM public.leads WHERE user_id = auth.uid()));

-- 5. Seed the initial permission catalog
INSERT INTO public.permissions (key, label_fa, label_en, description) VALUES
  ('leads.view', 'مشاهدهٔ لیدها', 'View leads', NULL),
  ('leads.edit', 'ویرایش لیدها', 'Edit leads', NULL),
  ('leads.verify', 'تأیید/وریفای لید', 'Verify a lead', 'Marks a lead as reviewed and eligible for a portal invite'),
  ('leads.invite', 'ارسال دعوت پورتال', 'Send portal invite', 'Sends the magic-link invite; requires the lead to already be verified'),
  ('messages.view', 'مشاهدهٔ پیامها', 'View messages', NULL),
  ('messages.send', 'ارسال پیام', 'Send messages', NULL),
  ('documents.view', 'مشاهدهٔ مدارک', 'View documents', NULL),
  ('documents.upload', 'آپلود مدرک', 'Upload documents', NULL),
  ('documents.delete', 'حذف مدرک', 'Delete documents', NULL),
  ('admins.manage', 'مدیریت کاربران ادمین', 'Manage admin users/roles', NULL)
ON CONFLICT (key) DO NOTHING;

-- 6. Seed the initial roles
INSERT INTO public.roles (key, label_fa, label_en, description) VALUES
  ('owner', 'مالک', 'Owner', 'Full access, including managing other admins'),
  ('manager', 'مدیر', 'Manager', 'Full day-to-day access; cannot manage admin users'),
  ('agent', 'کارشناس', 'Agent', 'Day-to-day leads/messages/documents work; can verify leads but cannot send portal invites'),
  ('viewer', 'ناظر', 'Viewer', 'Read-only access')
ON CONFLICT (key) DO NOTHING;

-- 7. Wire up role_permissions
-- owner: every permission
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
WHERE r.key = 'owner'
ON CONFLICT DO NOTHING;

-- manager: every permission except admins.manage
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
WHERE r.key = 'manager' AND p.key <> 'admins.manage'
ON CONFLICT DO NOTHING;

-- agent: day-to-day work, including verify, but NOT invite (deliberate gate)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
WHERE r.key = 'agent' AND p.key IN (
  'leads.view', 'leads.edit', 'leads.verify',
  'messages.view', 'messages.send',
  'documents.view', 'documents.upload'
)
ON CONFLICT DO NOTHING;

-- viewer: read-only
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
WHERE r.key = 'viewer' AND p.key IN ('leads.view', 'messages.view', 'documents.view')
ON CONFLICT DO NOTHING;

COMMIT;
