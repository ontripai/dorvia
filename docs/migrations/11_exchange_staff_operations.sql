-- ============================================================================
-- Migration: 11_exchange_staff_operations.sql
-- Project: DORVIA (eufjxgjlahqupxsxmfem)
-- Task: dre-p132 — Exchange Staff Operations (API & DB Layer)
-- Date: 2026-09-14
--
-- Non-negotiable Principles:
--   1. Transactional state machine advancement: EUR receipt (ACCEPTED -> EUR_RECEIVED)
--      and EUR payout (IRR_CONFIRMED -> SETTLED) are executed inside atomic plpgsql
--      stored procedures with FOR UPDATE locking, eliminating orphaned financial records.
--   2. Strict authorization & recipient validation: payout lead MUST either be the
--      designated eur_receiver_lead_id or an approved authorized recipient for that lead.
--   3. Append-only staff audit events: every staff action logs an immutable event in
--      exchange_events with actor = 'staff' and actor_user_id = staff_admin_id.
--   4. Idempotency & double-click protection: enforced via unique database indexes
--      uq_exchange_office_receipts_match and uq_exchange_office_payouts_match.
--   5. Backfill permission catalog: backfills unseeded permissions used by the admin
--      codebase and links all to 'owner', while giving exchange operations to manager.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Permission Catalog Backfill & Role-Permission Wiring
-- ============================================================================

INSERT INTO public.permissions (key, label_fa, label_en, description) VALUES
  ('exchange.view', 'مشاهدهٔ معاملات ارز', 'View exchange matches', 'Allows viewing exchange matches, audit events, and case files in admin portal'),
  ('exchange.manage', 'ثبت دریافت و پرداخت ارز', 'Record exchange receipts/payouts', 'Allows recording physical EUR receipt and payout, which advances the match state machine'),
  -- Backfill existing codebase permissions that were never seeded in prior migrations:
  ('finance.view', 'مشاهدهٔ امور مالی', 'View financial records', 'Allows viewing financial invoices, charges, and accounting reports'),
  ('finance.edit', 'ویرایش امور مالی', 'Edit financial records', 'Allows creating and editing invoices, charges, and receipts'),
  ('jobs.edit', 'مدیریت فرصت‌های شغلی', 'Edit job listings', 'Allows creating and modifying recruitment job postings and categories'),
  ('jobs.publish', 'انتشار فرصت‌های شغلی', 'Publish job listings', 'Allows publishing or unpublishing recruitment job postings'),
  ('blog.edit', 'مدیریت مقالات وبلاگ', 'Edit blog articles', 'Allows authoring and editing blog posts and media'),
  ('blog.publish', 'انتشار مقالات وبلاگ', 'Publish blog articles', 'Allows publishing or unpublishing blog articles'),
  ('reports.view', 'مشاهدهٔ گزارش‌ها', 'View reports', 'Allows viewing high-level analytics, finance, marketing, and operational reports'),
  ('case_stages.view', 'مشاهدهٔ مراحل پرونده', 'View case stages', 'Allows viewing lead case workflow stages and timeline'),
  ('case_stages.edit', 'ویرایش مراحل پرونده', 'Edit case stages', 'Allows updating case stages, due dates, and stage statuses'),
  ('team.manage', 'مدیریت تیم و کارمندان', 'Manage team members', 'Allows inviting and managing internal admin team members and staff roles'),
  ('assignments.manage', 'مدیریت تخصیص پرونده‌ها', 'Manage case assignments', 'Allows assigning and reassigning client cases to staff members')
ON CONFLICT (key) DO NOTHING;

-- Wire owner: full access to ALL permissions (existing and backfilled)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
WHERE r.key = 'owner'
ON CONFLICT DO NOTHING;

-- Wire manager: full day-to-day operations including exchange management
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
WHERE r.key = 'manager' AND p.key IN ('exchange.view', 'exchange.manage')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. Unique Constraints on Office Receipts and Payouts (Idempotency Guard)
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_exchange_office_receipts_match
  ON public.exchange_office_receipts (match_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_exchange_office_payouts_match
  ON public.exchange_office_payouts (match_id);

-- ============================================================================
-- 3. Stored Procedure: fn_exchange_record_office_receipt
-- Advances match from ACCEPTED -> EUR_RECEIVED
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_exchange_record_office_receipt(
  p_match_id uuid,
  p_amount numeric,
  p_currency text,
  p_handled_by text,
  p_partner_id uuid,
  p_partner_reference text,
  p_receipt_no text,
  p_staff_admin_id uuid,
  p_occurred_at timestamptz DEFAULT now(),
  p_note text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_match public.exchange_matches%ROWTYPE;
  v_receipt_id uuid;
  v_expected_eur numeric(14, 2);
BEGIN
  -- 1. Lock match record exclusively for update
  SELECT * INTO v_match
  FROM public.exchange_matches
  WHERE id = p_match_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Exchange match % not found', p_match_id;
  END IF;

  -- 2. State machine gate: must be in ACCEPTED status
  IF v_match.status <> 'ACCEPTED' THEN
    RAISE EXCEPTION 'Cannot record office receipt for match % in status % (expected ACCEPTED)',
      p_match_id, v_match.status;
  END IF;

  -- 3. Currency and amount validation
  IF p_currency NOT IN ('EUR', 'RON') THEN
    RAISE EXCEPTION 'Unsupported receipt currency %: must be EUR or RON', p_currency;
  END IF;

  IF p_currency = 'EUR' THEN
    v_expected_eur := v_match.amount_eur + v_match.fee_eur;
    IF p_amount <> v_expected_eur THEN
      RAISE EXCEPTION 'Invalid EUR receipt amount %: expected exactly % (amount_eur % + fee_eur %)',
        p_amount, v_expected_eur, v_match.amount_eur, v_match.fee_eur;
    END IF;
  ELSIF p_currency = 'RON' THEN
    IF p_note IS NULL OR trim(p_note) = '' THEN
      RAISE EXCEPTION 'Note containing conversion rate is mandatory when receiving RON';
    END IF;
    IF p_amount <= 0 THEN
      RAISE EXCEPTION 'Receipt amount must be positive';
    END IF;
  END IF;

  -- Validate mandatory reference fields
  IF p_partner_reference IS NULL OR trim(p_partner_reference) = '' THEN
    RAISE EXCEPTION 'partner_reference is mandatory';
  END IF;

  IF p_receipt_no IS NULL OR trim(p_receipt_no) = '' THEN
    RAISE EXCEPTION 'receipt_no is mandatory';
  END IF;

  -- 4. Insert office receipt record
  INSERT INTO public.exchange_office_receipts (
    match_id,
    amount,
    currency,
    handled_by,
    partner_id,
    partner_reference,
    receipt_no,
    staff_admin_id,
    occurred_at,
    note
  ) VALUES (
    p_match_id,
    p_amount,
    p_currency,
    coalesce(p_handled_by, 'partner_exchange'),
    p_partner_id,
    p_partner_reference,
    p_receipt_no,
    p_staff_admin_id,
    coalesce(p_occurred_at, now()),
    p_note
  )
  RETURNING id INTO v_receipt_id;

  -- 5. Transition match state to EUR_RECEIVED
  UPDATE public.exchange_matches
  SET
    status = 'EUR_RECEIVED',
    updated_at = now()
  WHERE id = p_match_id;

  -- 6. Record append-only audit event
  INSERT INTO public.exchange_events (
    match_id,
    request_id,
    actor,
    actor_user_id,
    from_status,
    to_status,
    payload
  ) VALUES (
    p_match_id,
    v_match.request_id,
    'staff',
    p_staff_admin_id,
    'ACCEPTED',
    'EUR_RECEIVED',
    jsonb_build_object(
      'receipt_id', v_receipt_id,
      'receipt_no', p_receipt_no,
      'partner_reference', p_partner_reference,
      'amount', p_amount,
      'currency', p_currency,
      'handled_by', coalesce(p_handled_by, 'partner_exchange')
    )
  );

  RETURN v_receipt_id;
END;
$$;

-- Restrict execution to service_role only
REVOKE ALL ON FUNCTION public.fn_exchange_record_office_receipt(uuid, numeric, text, text, uuid, text, text, uuid, timestamptz, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fn_exchange_record_office_receipt(uuid, numeric, text, text, uuid, text, text, uuid, timestamptz, text) TO service_role;

-- ============================================================================
-- 4. Stored Procedure: fn_exchange_record_office_payout
-- Advances match from IRR_CONFIRMED -> SETTLED
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_exchange_record_office_payout(
  p_match_id uuid,
  p_amount numeric,
  p_currency text,
  p_handled_by text,
  p_partner_id uuid,
  p_partner_reference text,
  p_paid_to_lead_id uuid,
  p_receipt_no text,
  p_staff_admin_id uuid,
  p_occurred_at timestamptz DEFAULT now(),
  p_note text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_match public.exchange_matches%ROWTYPE;
  v_payout_id uuid;
  v_is_authorized boolean := false;
BEGIN
  -- 1. Lock match record exclusively for update
  SELECT * INTO v_match
  FROM public.exchange_matches
  WHERE id = p_match_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Exchange match % not found', p_match_id;
  END IF;

  -- 2. State machine gate: must be in IRR_CONFIRMED status
  IF v_match.status <> 'IRR_CONFIRMED' THEN
    RAISE EXCEPTION 'Cannot record office payout for match % in status % (expected IRR_CONFIRMED)',
      p_match_id, v_match.status;
  END IF;

  -- 3. Currency and amount validation
  IF p_currency NOT IN ('EUR', 'RON') THEN
    RAISE EXCEPTION 'Unsupported payout currency %: must be EUR or RON', p_currency;
  END IF;

  IF p_currency = 'EUR' THEN
    -- Fee is retained by the platform, payout must equal amount_eur
    IF p_amount <> v_match.amount_eur THEN
      RAISE EXCEPTION 'Invalid EUR payout amount %: expected exactly % (fee is retained)',
        p_amount, v_match.amount_eur;
    END IF;
  ELSIF p_currency = 'RON' THEN
    IF p_note IS NULL OR trim(p_note) = '' THEN
      RAISE EXCEPTION 'Note containing conversion rate is mandatory when paying out RON';
    END IF;
    IF p_amount <= 0 THEN
      RAISE EXCEPTION 'Payout amount must be positive';
    END IF;
  END IF;

  -- 4. Strict recipient validation
  IF p_paid_to_lead_id IS NULL THEN
    RAISE EXCEPTION 'paid_to_lead_id is mandatory';
  END IF;

  IF p_paid_to_lead_id <> v_match.eur_receiver_lead_id THEN
    -- Check if recipient is an approved authorized recipient for this customer
    SELECT EXISTS (
      SELECT 1 FROM public.exchange_authorized_recipients
      WHERE lead_id = v_match.eur_receiver_lead_id
        AND recipient_lead_id = p_paid_to_lead_id
        AND status = 'approved'
    ) INTO v_is_authorized;

    IF NOT v_is_authorized THEN
      RAISE EXCEPTION 'Lead % is neither EUR receiver % nor an approved authorized recipient',
        p_paid_to_lead_id, v_match.eur_receiver_lead_id;
    END IF;
  END IF;

  -- Validate mandatory reference fields
  IF p_partner_reference IS NULL OR trim(p_partner_reference) = '' THEN
    RAISE EXCEPTION 'partner_reference is mandatory';
  END IF;

  IF p_receipt_no IS NULL OR trim(p_receipt_no) = '' THEN
    RAISE EXCEPTION 'receipt_no is mandatory';
  END IF;

  -- 5. Insert office payout record
  INSERT INTO public.exchange_office_payouts (
    match_id,
    amount,
    currency,
    handled_by,
    partner_id,
    partner_reference,
    paid_to_lead_id,
    receipt_no,
    staff_admin_id,
    occurred_at,
    note
  ) VALUES (
    p_match_id,
    p_amount,
    p_currency,
    coalesce(p_handled_by, 'partner_exchange'),
    p_partner_id,
    p_partner_reference,
    p_paid_to_lead_id,
    p_receipt_no,
    p_staff_admin_id,
    coalesce(p_occurred_at, now()),
    p_note
  )
  RETURNING id INTO v_payout_id;

  -- 6. Transition match state to SETTLED
  -- This activates trg_exchange_matches_validate_settled which validates
  -- the presence of the exchange_office_payouts record and partner confirmation.
  UPDATE public.exchange_matches
  SET
    status = 'SETTLED',
    updated_at = now()
  WHERE id = p_match_id;

  -- 7. Record append-only audit event
  INSERT INTO public.exchange_events (
    match_id,
    request_id,
    actor,
    actor_user_id,
    from_status,
    to_status,
    payload
  ) VALUES (
    p_match_id,
    v_match.request_id,
    'staff',
    p_staff_admin_id,
    'IRR_CONFIRMED',
    'SETTLED',
    jsonb_build_object(
      'payout_id', v_payout_id,
      'receipt_no', p_receipt_no,
      'partner_reference', p_partner_reference,
      'amount', p_amount,
      'currency', p_currency,
      'paid_to_lead_id', p_paid_to_lead_id,
      'handled_by', coalesce(p_handled_by, 'partner_exchange')
    )
  );

  RETURN v_payout_id;
END;
$$;

-- Restrict execution to service_role only
REVOKE ALL ON FUNCTION public.fn_exchange_record_office_payout(uuid, numeric, text, text, uuid, text, uuid, text, uuid, timestamptz, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fn_exchange_record_office_payout(uuid, numeric, text, text, uuid, text, uuid, text, uuid, timestamptz, text) TO service_role;

COMMIT;
