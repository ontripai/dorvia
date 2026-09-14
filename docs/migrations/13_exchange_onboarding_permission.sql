-- ============================================================================
-- Migration: 13_exchange_onboarding_permission.sql
-- Project: DORVIA (eufjxgjlahqupxsxmfem)
-- Task: dre-p139 — Exchange Customer Onboarding Permission
-- Date: 2026-09-14
--
-- Adds 'exchange.onboarding' permission to grant authorized staff (owner, manager)
-- the ability to approve exchange customer profiles, verify bank accounts, and
-- approve related parties and authorized recipients.
-- ============================================================================

BEGIN;

INSERT INTO public.permissions (key, label_fa, label_en, description) VALUES
  ('exchange.onboarding', 'پذیرش مشتری تبادل ارز', 'Approve exchange customers',
   'Approve exchange profiles, verify bank accounts, and approve related parties and authorized recipients')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
WHERE r.key IN ('owner', 'manager') AND p.key = 'exchange.onboarding'
ON CONFLICT DO NOTHING;

COMMIT;
