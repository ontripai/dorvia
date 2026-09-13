-- ============================================================================
-- Migration: 10_p2p_exchange_schema.sql
-- Project: DORVIA (eufjxgjlahqupxsxmfem)
-- Task: dre-p124 — P2P Currency Exchange Database Schema
-- Date: 2026-09-13
--
-- Non-negotiable Architecture Principles:
--   1. Role assignment by money flow, not requester/acceptor:
--      - eur_payer: hands EUR/RON to Bucharest office / partner exchange
--      - eur_receiver: collects EUR/RON from office / partner exchange upon settlement
--      - irr_payer: executes IRR bank transfer in Iran and uploads proof
--      - irr_receiver: confirms receipt of IRR in Iran
--   2. No automated fund movement: both ends are verified and recorded by humans.
--   3. Partner exchange custody: handled_by defaults to 'partner_exchange',
--      with partner_reference mandatory for auditability.
--   4. Append-only state transitions: exchange_events is strictly INSERT-only,
--      enforced via database trigger preventing UPDATE or DELETE.
--   5. Policies as data, not code: banking calendar, instrument support, partner
--      access levels, and daily limits are stored in schema tables/settings.
--   6. Identity linkage: References existing public.leads and public.lead_documents.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Table: exchange_profiles
-- Thin qualification layer over existing public.leads
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL UNIQUE REFERENCES public.leads(id) ON DELETE CASCADE,
  exchange_status text NOT NULL DEFAULT 'not_requested'
    CHECK (exchange_status IN ('not_requested', 'pending', 'approved', 'rejected', 'suspended')),
  approved_by uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  suspended_reason text,
  completed_trades integer NOT NULL DEFAULT 0 CHECK (completed_trades >= 0),
  failed_trades integer NOT NULL DEFAULT 0 CHECK (failed_trades >= 0),
  free_cancellations_30d integer NOT NULL DEFAULT 0 CHECK (free_cancellations_30d >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. Table: exchange_related_parties
-- Iranian-side first-degree relatives and customer-owned companies
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_related_parties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  party_type text NOT NULL CHECK (party_type IN ('person', 'company')),
  full_name text NOT NULL,
  relationship text NOT NULL
    CHECK (relationship IN ('father', 'mother', 'spouse', 'child', 'sibling', 'own_company')),
  national_id text NOT NULL,
  id_document_id uuid REFERENCES public.lead_documents(id) ON DELETE SET NULL,
  country text NOT NULL DEFAULT 'IR' CHECK (country = 'IR'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verified_by_admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Constraint 5: Company must have relationship = 'own_company', and cannot be approved without id_document_id
  CONSTRAINT chk_related_party_company_own CHECK (party_type != 'company' OR relationship = 'own_company'),
  CONSTRAINT chk_related_party_company_doc CHECK (status != 'approved' OR (party_type != 'company' OR id_document_id IS NOT NULL))
);

-- ============================================================================
-- 3. Table: exchange_authorized_recipients
-- Romanian-side authorized cash/IBAN recipients (must be approved exchange leads)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_authorized_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  recipient_lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  relationship text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'revoked')),
  verified_by_admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT chk_auth_recipient_not_self CHECK (lead_id != recipient_lead_id)
);

-- ============================================================================
-- 4. Table: exchange_partners
-- Licensed partner exchange entities in Romania (RO) and trusted verification partners in Iran (IR)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL CHECK (country IN ('RO', 'IR')), -- Addendum 1: RO or IR
  license_number text,
  role text NOT NULL DEFAULT 'settlement_only' CHECK (role IN ('settlement_only', 'supervisor')),
  access_level text NOT NULL DEFAULT 'summary' CHECK (access_level IN ('summary', 'full_file', 'custom')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. Table: exchange_partner_users
-- Authorized staff operators affiliated with an exchange partner
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_partner_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.exchange_partners(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_in_partner text NOT NULL DEFAULT 'operator' CHECK (role_in_partner IN ('admin', 'operator', 'auditor')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_partner_user UNIQUE (partner_id, user_id)
);

-- ============================================================================
-- 6. Table: exchange_accounts
-- Bank destination accounts (Iranian SHEBA/card or Romanian IBAN)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('IR_SHEBA', 'IR_CARD', 'RO_IBAN')),
  value text NOT NULL,
  holder_name text NOT NULL,
  related_party_id uuid REFERENCES public.exchange_related_parties(id) ON DELETE RESTRICT,
  authorized_recipient_id uuid REFERENCES public.exchange_authorized_recipients(id) ON DELETE RESTRICT,
  verified_at timestamptz,
  verified_by_admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Constraint 4 structural checks:
  -- Romanian account cannot link to related_parties (only self or authorized_recipient)
  CONSTRAINT chk_acc_ro_iban_no_related CHECK (kind != 'RO_IBAN' OR related_party_id IS NULL),
  -- Iranian account cannot link to authorized_recipients (only self or related_party)
  CONSTRAINT chk_acc_ir_no_auth_recipient CHECK (kind NOT IN ('IR_SHEBA', 'IR_CARD') OR authorized_recipient_id IS NULL),
  -- An account cannot link to both
  CONSTRAINT chk_acc_not_both_linked CHECK (related_party_id IS NULL OR authorized_recipient_id IS NULL)
);

-- ============================================================================
-- 7. Table: exchange_requests
-- Public peer-to-peer exchange requests / order listings
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE RESTRICT,
  direction text NOT NULL CHECK (direction IN ('RO_TO_IR', 'IR_TO_RO')),
  eur_currency text NOT NULL DEFAULT 'EUR' CHECK (eur_currency IN ('EUR', 'RON')),
  eur_amount numeric(14, 2) NOT NULL CHECK (eur_amount > 0),       -- Constraint 1
  rate numeric(16, 4) NOT NULL CHECK (rate > 0),                   -- Constraint 1
  irr_amount numeric(18, 0) NOT NULL CHECK (irr_amount > 0),       -- Constraint 1
  allow_partial boolean NOT NULL DEFAULT false,
  min_chunk numeric(14, 2) CHECK (min_chunk IS NULL OR (min_chunk > 0 AND min_chunk <= eur_amount)),
  acting_party_id uuid REFERENCES public.exchange_related_parties(id) ON DELETE SET NULL,
  destination_account_id uuid NOT NULL REFERENCES public.exchange_accounts(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'partially_matched', 'fully_matched', 'expired', 'cancelled', 'completed')),
  expires_at timestamptz NOT NULL,
  renewed_count integer NOT NULL DEFAULT 0 CHECK (renewed_count >= 0),
  price_version integer NOT NULL DEFAULT 1 CHECK (price_version >= 1),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 8. Table: exchange_request_prices
-- Audit history of price and rate adjustments on requests
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_request_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.exchange_requests(id) ON DELETE CASCADE,
  version integer NOT NULL CHECK (version >= 1),
  rate numeric(16, 4) NOT NULL CHECK (rate > 0),             -- Constraint 1
  irr_amount numeric(18, 0) NOT NULL CHECK (irr_amount > 0), -- Constraint 1
  changed_at timestamptz NOT NULL DEFAULT now(),
  changed_by uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  CONSTRAINT uq_request_price_version UNIQUE (request_id, version)
);

-- ============================================================================
-- 9. Table: exchange_matches
-- Matched trades executing between requester and acceptor
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.exchange_requests(id) ON DELETE RESTRICT,
  acceptor_lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE RESTRICT,
  amount_eur numeric(14, 2) NOT NULL CHECK (amount_eur > 0),       -- Constraint 1
  rate_snapshot numeric(16, 4) NOT NULL CHECK (rate_snapshot > 0), -- Constraint 1
  amount_irr numeric(18, 0) NOT NULL CHECK (amount_irr > 0),       -- Constraint 1
  fee_eur numeric(14, 2) NOT NULL DEFAULT 0.00 CHECK (fee_eur >= 0),
  status text NOT NULL DEFAULT 'RESERVED' CHECK (status IN (
    'RESERVED',
    'ACCEPTED',
    'CANCELLED_FREE',
    'EUR_RECEIVED',
    'IRR_PROOF_SUBMITTED',
    'IRR_CONFIRMED',
    'SETTLED',
    'DISPUTED',
    'REFUNDED',
    'EXPIRED'
  )),
  eur_payer_lead_id uuid NOT NULL REFERENCES public.leads(id),
  eur_receiver_lead_id uuid NOT NULL REFERENCES public.leads(id),
  irr_payer_lead_id uuid NOT NULL REFERENCES public.leads(id),
  irr_receiver_lead_id uuid NOT NULL REFERENCES public.leads(id),
  destination_account_id uuid NOT NULL REFERENCES public.exchange_accounts(id),
  reserved_until timestamptz NOT NULL,
  eur_due_at timestamptz,
  proof_due_at timestamptz,
  confirm_due_at timestamptz,
  destination_account_revealed_at timestamptz,
  partner_id uuid REFERENCES public.exchange_partners(id) ON DELETE SET NULL,
  partner_confirmed_at timestamptz,
  partner_confirmed_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  partner_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 10. Table: exchange_office_receipts
-- Physical/counter entry of EUR/RON by eur_payer (partner exchange custody)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_office_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.exchange_matches(id) ON DELETE RESTRICT,
  amount numeric(14, 2) NOT NULL CHECK (amount > 0), -- Constraint 1
  currency text NOT NULL DEFAULT 'EUR' CHECK (currency IN ('EUR', 'RON')),
  handled_by text NOT NULL DEFAULT 'partner_exchange'
    CHECK (handled_by IN ('dorvia_office', 'partner_exchange')),
  partner_id uuid REFERENCES public.exchange_partners(id) ON DELETE SET NULL,
  partner_reference text NOT NULL, -- Principle 3: Partner reference is mandatory
  receipt_no text NOT NULL,
  staff_admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 11. Table: exchange_office_payouts
-- Physical/counter release of EUR/RON to eur_receiver or authorized recipient
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_office_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.exchange_matches(id) ON DELETE RESTRICT,
  amount numeric(14, 2) NOT NULL CHECK (amount > 0), -- Constraint 1
  currency text NOT NULL DEFAULT 'EUR' CHECK (currency IN ('EUR', 'RON')),
  handled_by text NOT NULL DEFAULT 'partner_exchange'
    CHECK (handled_by IN ('dorvia_office', 'partner_exchange')),
  partner_id uuid REFERENCES public.exchange_partners(id) ON DELETE SET NULL,
  partner_reference text NOT NULL, -- Principle 3: Partner reference is mandatory
  paid_to_lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE RESTRICT,
  receipt_no text NOT NULL,
  staff_admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 12. Table: exchange_transfer_proofs
-- Iranian bank transfer statements/proofs from BOTH payer and receiver
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_transfer_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.exchange_matches(id) ON DELETE RESTRICT,
  side text NOT NULL CHECK (side IN ('payer', 'receiver')), -- Addendum 2: payer or receiver
  uploaded_by_lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE RESTRICT,
  proof_type text NOT NULL DEFAULT 'account_statement'
    CHECK (proof_type IN ('account_statement', 'transfer_receipt', 'other')),
  instrument text NOT NULL DEFAULT 'satna'
    CHECK (instrument IN ('card_to_card', 'paya', 'satna', 'other')),
  document_id uuid NOT NULL REFERENCES public.lead_documents(id) ON DELETE RESTRICT,
  account_id uuid NOT NULL REFERENCES public.exchange_accounts(id) ON DELETE RESTRICT,
  bank_reference text,
  statement_period_from timestamptz,
  statement_period_to timestamptz,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  verified_by_admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  verified_at timestamptz,
  verification_channel text CHECK (verification_channel IS NULL OR length(verification_channel) <= 32),
  verification_result text CHECK (verification_result IS NULL OR verification_result IN ('confirmed', 'inconclusive', 'rejected')),
  verification_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 13. Table: exchange_disputes
-- Dispute proceedings and resolutions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.exchange_matches(id) ON DELETE RESTRICT,
  opened_by_lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE RESTRICT,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'under_review', 'resolved_payout', 'resolved_refund', 'closed')),
  evidence_document_ids uuid[] NOT NULL DEFAULT '{}',
  resolution text,
  resolved_by_admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 14. Table: exchange_events
-- Immutable, append-only audit trail of every state transition and event
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES public.exchange_matches(id) ON DELETE SET NULL,
  request_id uuid REFERENCES public.exchange_requests(id) ON DELETE SET NULL,
  actor text NOT NULL,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  from_status text,
  to_status text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 15. Table: exchange_banking_calendar
-- Weekly schedule configuration per jurisdiction (IR / RO)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_banking_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text UNIQUE NOT NULL CHECK (country IN ('IR', 'RO')),
  weekly_closed integer[] NOT NULL DEFAULT '{5}', -- 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  updated_by_admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Seed initial default banking calendar:
INSERT INTO public.exchange_banking_calendar (country, weekly_closed)
VALUES
  ('IR', '{5}'),      -- Iran: Friday closed by default
  ('RO', '{0, 6}')    -- Romania: Sunday (0) and Saturday (6) closed
ON CONFLICT (country) DO NOTHING;

-- ============================================================================
-- 16. Table: exchange_nonbanking_days
-- Manual bank holiday calendar managed by administrators
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exchange_nonbanking_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  country text NOT NULL CHECK (country IN ('IR', 'RO')),
  reason text NOT NULL,
  created_by_admin_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nonbanking_date_country UNIQUE (date, country)
);


-- ============================================================================
-- SECTION B: INDEXES FOR PERFORMANCE & FOREIGN KEYS
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_exchange_profiles_status ON public.exchange_profiles (exchange_status);
CREATE INDEX IF NOT EXISTS idx_exchange_profiles_approved_by ON public.exchange_profiles (approved_by);

CREATE INDEX IF NOT EXISTS idx_exchange_related_parties_lead_id ON public.exchange_related_parties (lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_related_parties_status ON public.exchange_related_parties (status);
CREATE INDEX IF NOT EXISTS idx_exchange_related_parties_doc_id ON public.exchange_related_parties (id_document_id);

CREATE INDEX IF NOT EXISTS idx_exchange_auth_recipients_lead_id ON public.exchange_authorized_recipients (lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_auth_recipients_recipient ON public.exchange_authorized_recipients (recipient_lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_auth_recipients_status ON public.exchange_authorized_recipients (status);

CREATE INDEX IF NOT EXISTS idx_exchange_accounts_lead_id ON public.exchange_accounts (lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_accounts_related_party ON public.exchange_accounts (related_party_id);
CREATE INDEX IF NOT EXISTS idx_exchange_accounts_auth_recipient ON public.exchange_accounts (authorized_recipient_id);

CREATE INDEX IF NOT EXISTS idx_exchange_partner_users_partner ON public.exchange_partner_users (partner_id);
CREATE INDEX IF NOT EXISTS idx_exchange_partner_users_user ON public.exchange_partner_users (user_id);

CREATE INDEX IF NOT EXISTS idx_exchange_requests_requester ON public.exchange_requests (requester_lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_requests_status ON public.exchange_requests (status);
CREATE INDEX IF NOT EXISTS idx_exchange_requests_dest_acc ON public.exchange_requests (destination_account_id);
CREATE INDEX IF NOT EXISTS idx_exchange_requests_acting_party ON public.exchange_requests (acting_party_id);

CREATE INDEX IF NOT EXISTS idx_exchange_request_prices_request ON public.exchange_request_prices (request_id);

CREATE INDEX IF NOT EXISTS idx_exchange_matches_request_id ON public.exchange_matches (request_id);
CREATE INDEX IF NOT EXISTS idx_exchange_matches_status ON public.exchange_matches (status);
CREATE INDEX IF NOT EXISTS idx_exchange_matches_eur_payer ON public.exchange_matches (eur_payer_lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_matches_eur_receiver ON public.exchange_matches (eur_receiver_lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_matches_irr_payer ON public.exchange_matches (irr_payer_lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_matches_irr_receiver ON public.exchange_matches (irr_receiver_lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_matches_partner ON public.exchange_matches (partner_id);

CREATE INDEX IF NOT EXISTS idx_exchange_office_receipts_match ON public.exchange_office_receipts (match_id);
CREATE INDEX IF NOT EXISTS idx_exchange_office_receipts_partner ON public.exchange_office_receipts (partner_id);

CREATE INDEX IF NOT EXISTS idx_exchange_office_payouts_match ON public.exchange_office_payouts (match_id);
CREATE INDEX IF NOT EXISTS idx_exchange_office_payouts_paid_to ON public.exchange_office_payouts (paid_to_lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_office_payouts_partner ON public.exchange_office_payouts (partner_id);

CREATE INDEX IF NOT EXISTS idx_exchange_transfer_proofs_match ON public.exchange_transfer_proofs (match_id);
CREATE INDEX IF NOT EXISTS idx_exchange_transfer_proofs_side ON public.exchange_transfer_proofs (side);
CREATE INDEX IF NOT EXISTS idx_exchange_transfer_proofs_doc ON public.exchange_transfer_proofs (document_id);

CREATE INDEX IF NOT EXISTS idx_exchange_disputes_match ON public.exchange_disputes (match_id);
CREATE INDEX IF NOT EXISTS idx_exchange_disputes_status ON public.exchange_disputes (status);

CREATE INDEX IF NOT EXISTS idx_exchange_events_match ON public.exchange_events (match_id);
CREATE INDEX IF NOT EXISTS idx_exchange_events_request ON public.exchange_events (request_id);
CREATE INDEX IF NOT EXISTS idx_exchange_events_created ON public.exchange_events (created_at);
CREATE INDEX IF NOT EXISTS idx_exchange_nonbanking_days_lookup ON public.exchange_nonbanking_days (country, date);

-- Fix 2 (dre-p125): Complete foreign key indexing coverage across all exchange tables
CREATE INDEX IF NOT EXISTS idx_exchange_matches_acceptor ON public.exchange_matches (acceptor_lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_matches_dest_acc ON public.exchange_matches (destination_account_id);
CREATE INDEX IF NOT EXISTS idx_exchange_matches_partner_confirmed_by ON public.exchange_matches (partner_confirmed_by_user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_transfer_proofs_uploader ON public.exchange_transfer_proofs (uploaded_by_lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_transfer_proofs_account ON public.exchange_transfer_proofs (account_id);
CREATE INDEX IF NOT EXISTS idx_exchange_transfer_proofs_verified_by ON public.exchange_transfer_proofs (verified_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_exchange_disputes_opener ON public.exchange_disputes (opened_by_lead_id);
CREATE INDEX IF NOT EXISTS idx_exchange_disputes_resolver ON public.exchange_disputes (resolved_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_exchange_events_actor ON public.exchange_events (actor_user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_office_receipts_staff ON public.exchange_office_receipts (staff_admin_id);
CREATE INDEX IF NOT EXISTS idx_exchange_office_payouts_staff ON public.exchange_office_payouts (staff_admin_id);
CREATE INDEX IF NOT EXISTS idx_exchange_related_parties_verified_by ON public.exchange_related_parties (verified_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_exchange_auth_recipients_verified_by ON public.exchange_authorized_recipients (verified_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_exchange_accounts_verified_by ON public.exchange_accounts (verified_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_exchange_request_prices_changed_by ON public.exchange_request_prices (changed_by);
CREATE INDEX IF NOT EXISTS idx_exchange_banking_calendar_updated_by ON public.exchange_banking_calendar (updated_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_exchange_nonbanking_days_created_by ON public.exchange_nonbanking_days (created_by_admin_id);


-- ============================================================================
-- SECTION C: DATABASE FUNCTIONS & TRIGGERS (CONSTRAINTS 2, 3, 4, 6, 7, 8, 9, 10, 11)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Constraint 9: exchange_events is append-only (reject UPDATE and DELETE)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_exchange_events_prevent_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'exchange_events is append-only: updates and deletes are prohibited';
END;
$$;

DROP TRIGGER IF EXISTS trg_exchange_events_prevent_mutation ON public.exchange_events;
CREATE TRIGGER trg_exchange_events_prevent_mutation
BEFORE UPDATE OR DELETE ON public.exchange_events
FOR EACH ROW EXECUTE FUNCTION public.fn_exchange_events_prevent_mutation();

-- Fix 1 (dre-p125): Statement-level trigger preventing TRUNCATE on audit log
CREATE OR REPLACE FUNCTION public.fn_exchange_events_prevent_truncate()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'exchange_events is append-only: truncate is prohibited';
END;
$$;

DROP TRIGGER IF EXISTS trg_exchange_events_prevent_truncate ON public.exchange_events;
CREATE TRIGGER trg_exchange_events_prevent_truncate
BEFORE TRUNCATE ON public.exchange_events
FOR EACH STATEMENT EXECUTE FUNCTION public.fn_exchange_events_prevent_truncate();


-- ----------------------------------------------------------------------------
-- Constraint 2 & 3: Match capacity limits and allow_partial enforcement
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_exchange_matches_validate_request_capacity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_request public.exchange_requests%ROWTYPE;
  v_allocated_eur numeric;
  v_other_matches_count integer;
BEGIN
  SELECT * INTO v_request
  FROM public.exchange_requests
  WHERE id = NEW.request_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request with id % does not exist', NEW.request_id;
  END IF;

  -- Enforce only for active, non-cancelled/expired matches
  IF NEW.status NOT IN ('CANCELLED_FREE', 'REFUNDED', 'EXPIRED') THEN
    SELECT COALESCE(SUM(amount_eur), 0), COUNT(*)
    INTO v_allocated_eur, v_other_matches_count
    FROM public.exchange_matches
    WHERE request_id = NEW.request_id
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND status NOT IN ('CANCELLED_FREE', 'REFUNDED', 'EXPIRED');

    -- Constraint 2: Total matches amount_eur <= request.eur_amount
    IF (v_allocated_eur + NEW.amount_eur) > v_request.eur_amount THEN
      RAISE EXCEPTION 'Total active matches amount_eur (%) exceeds request eur_amount (%)',
        (v_allocated_eur + NEW.amount_eur), v_request.eur_amount;
    END IF;

    -- Constraint 3: If allow_partial is false, only one match allowed, exactly equal to total request
    IF NOT v_request.allow_partial THEN
      IF v_other_matches_count > 0 THEN
        RAISE EXCEPTION 'Request % does not allow partial matches and already has an active match', NEW.request_id;
      END IF;
      IF NEW.amount_eur != v_request.eur_amount THEN
        RAISE EXCEPTION 'Request % does not allow partial matches: match amount (%) must exactly equal request amount (%)',
          NEW.request_id, NEW.amount_eur, v_request.eur_amount;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_exchange_matches_validate_request_capacity ON public.exchange_matches;
CREATE TRIGGER trg_exchange_matches_validate_request_capacity
BEFORE INSERT OR UPDATE OF amount_eur, status, request_id ON public.exchange_matches
FOR EACH ROW EXECUTE FUNCTION public.fn_exchange_matches_validate_request_capacity();


-- ----------------------------------------------------------------------------
-- Constraint 4: Verify account destination eligibility and approval
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_exchange_accounts_validate_destination()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_status text;
  v_owner_lead_id uuid;
BEGIN
  IF NEW.kind = 'RO_IBAN' THEN
    IF NEW.related_party_id IS NOT NULL THEN
      RAISE EXCEPTION 'Romanian accounts (RO_IBAN) cannot link to exchange_related_parties';
    END IF;
    IF NEW.authorized_recipient_id IS NOT NULL THEN
      SELECT status, lead_id INTO v_status, v_owner_lead_id
      FROM public.exchange_authorized_recipients
      WHERE id = NEW.authorized_recipient_id;

      IF NOT FOUND OR v_status != 'approved' THEN
        RAISE EXCEPTION 'Romanian accounts must belong to customer or an approved authorized_recipient';
      END IF;
      IF v_owner_lead_id != NEW.lead_id THEN
        RAISE EXCEPTION 'authorized_recipient does not belong to the account owner lead';
      END IF;
    END IF;
  ELSIF NEW.kind IN ('IR_SHEBA', 'IR_CARD') THEN
    IF NEW.authorized_recipient_id IS NOT NULL THEN
      RAISE EXCEPTION 'Iranian accounts cannot link to exchange_authorized_recipients';
    END IF;
    IF NEW.related_party_id IS NOT NULL THEN
      SELECT status, lead_id INTO v_status, v_owner_lead_id
      FROM public.exchange_related_parties
      WHERE id = NEW.related_party_id;

      IF NOT FOUND OR v_status != 'approved' THEN
        RAISE EXCEPTION 'Iranian accounts must belong to customer or an approved related_party';
      END IF;
      IF v_owner_lead_id != NEW.lead_id THEN
        RAISE EXCEPTION 'related_party does not belong to the account owner lead';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_exchange_accounts_validate_destination ON public.exchange_accounts;
CREATE TRIGGER trg_exchange_accounts_validate_destination
BEFORE INSERT OR UPDATE OF kind, related_party_id, authorized_recipient_id, lead_id ON public.exchange_accounts
FOR EACH ROW EXECUTE FUNCTION public.fn_exchange_accounts_validate_destination();


-- ----------------------------------------------------------------------------
-- Constraint 6: exchange_authorized_recipients recipient_lead_id must have approved profile
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_exchange_authorized_recipients_validate_approval()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_prof_status text;
BEGIN
  IF NEW.status = 'approved' THEN
    SELECT exchange_status INTO v_prof_status
    FROM public.exchange_profiles
    WHERE lead_id = NEW.recipient_lead_id;

    IF NOT FOUND OR v_prof_status != 'approved' THEN
      RAISE EXCEPTION 'recipient_lead_id (%) must have an approved exchange_profile before recipient authorization can be approved',
        NEW.recipient_lead_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_exchange_authorized_recipients_validate_approval ON public.exchange_authorized_recipients;
CREATE TRIGGER trg_exchange_authorized_recipients_validate_approval
BEFORE INSERT OR UPDATE OF status, recipient_lead_id ON public.exchange_authorized_recipients
FOR EACH ROW EXECUTE FUNCTION public.fn_exchange_authorized_recipients_validate_approval();


-- ----------------------------------------------------------------------------
-- Constraint 10: Legal state machine transitions enforcement
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_exchange_matches_validate_transition()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF NOT (
      (OLD.status = 'RESERVED' AND NEW.status IN ('ACCEPTED', 'CANCELLED_FREE', 'EXPIRED')) OR
      (OLD.status = 'ACCEPTED' AND NEW.status IN ('EUR_RECEIVED', 'EXPIRED', 'DISPUTED')) OR
      (OLD.status = 'EUR_RECEIVED' AND NEW.status IN ('IRR_PROOF_SUBMITTED', 'EXPIRED', 'DISPUTED', 'REFUNDED')) OR
      (OLD.status = 'IRR_PROOF_SUBMITTED' AND NEW.status IN ('IRR_CONFIRMED', 'EXPIRED', 'DISPUTED')) OR
      (OLD.status = 'IRR_CONFIRMED' AND NEW.status IN ('SETTLED', 'DISPUTED')) OR
      (OLD.status = 'DISPUTED' AND NEW.status IN ('SETTLED', 'REFUNDED'))
    ) THEN
      RAISE EXCEPTION 'Illegal state machine transition from % to % for match %',
        OLD.status, NEW.status, NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_exchange_matches_validate_transition ON public.exchange_matches;
CREATE TRIGGER trg_exchange_matches_validate_transition
BEFORE UPDATE OF status ON public.exchange_matches
FOR EACH ROW EXECUTE FUNCTION public.fn_exchange_matches_validate_transition();


-- ----------------------------------------------------------------------------
-- Constraint 7: Settlement prerequisites
-- Requires: previous IRR_CONFIRMED (or DISPUTED), office payout row, supervisor approval if applicable
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_exchange_matches_validate_settled()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_payout_count integer;
  v_partner_role text;
BEGIN
  IF NEW.status = 'SETTLED' AND (OLD.status IS NULL OR OLD.status != 'SETTLED') THEN
    IF OLD.status != 'IRR_CONFIRMED' AND OLD.status != 'DISPUTED' THEN
      RAISE EXCEPTION 'Match % cannot transition to SETTLED from % (requires IRR_CONFIRMED or DISPUTED)',
        NEW.id, OLD.status;
    END IF;

    SELECT COUNT(*) INTO v_payout_count
    FROM public.exchange_office_payouts
    WHERE match_id = NEW.id;

    IF v_payout_count = 0 THEN
      RAISE EXCEPTION 'Cannot settle match % without an exchange_office_payouts record', NEW.id;
    END IF;

    IF NEW.partner_id IS NOT NULL THEN
      SELECT role INTO v_partner_role
      FROM public.exchange_partners
      WHERE id = NEW.partner_id;

      IF v_partner_role = 'supervisor' AND NEW.partner_confirmed_at IS NULL THEN
        RAISE EXCEPTION 'Cannot settle match % supervised by partner % without partner_confirmed_at',
          NEW.id, NEW.partner_id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_exchange_matches_validate_settled ON public.exchange_matches;
CREATE TRIGGER trg_exchange_matches_validate_settled
BEFORE UPDATE OF status ON public.exchange_matches
FOR EACH ROW EXECUTE FUNCTION public.fn_exchange_matches_validate_settled();


-- ----------------------------------------------------------------------------
-- Constraint 11 (Addendum 2): IRR_CONFIRMED requires receiver account proof
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_exchange_matches_validate_irr_confirmed()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_receiver_proof_count integer;
BEGIN
  IF NEW.status = 'IRR_CONFIRMED' AND (OLD.status IS NULL OR OLD.status != 'IRR_CONFIRMED') THEN
    SELECT COUNT(*) INTO v_receiver_proof_count
    FROM public.exchange_transfer_proofs
    WHERE match_id = NEW.id AND side = 'receiver';

    IF v_receiver_proof_count = 0 THEN
      RAISE EXCEPTION 'Cannot transition match % to IRR_CONFIRMED without receiver proof of transfer in exchange_transfer_proofs',
        NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_exchange_matches_validate_irr_confirmed ON public.exchange_matches;
CREATE TRIGGER trg_exchange_matches_validate_irr_confirmed
BEFORE UPDATE OF status ON public.exchange_matches
FOR EACH ROW EXECUTE FUNCTION public.fn_exchange_matches_validate_irr_confirmed();


-- ----------------------------------------------------------------------------
-- Constraint 8: Concurrency serialization via row locking RPC
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_exchange_reserve_request_match(
  p_request_id uuid,
  p_acceptor_lead_id uuid,
  p_amount_eur numeric,
  p_destination_account_id uuid,
  p_reserved_minutes integer DEFAULT 30
)
RETURNS public.exchange_matches
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request public.exchange_requests%ROWTYPE;
  v_match public.exchange_matches;
  v_eur_payer uuid;
  v_eur_receiver uuid;
  v_irr_payer uuid;
  v_irr_receiver uuid;
  v_amount_irr numeric;
BEGIN
  -- Constraint 8: Explicit row lock on request to prevent race conditions
  SELECT * INTO v_request
  FROM public.exchange_requests
  WHERE id = p_request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Exchange request % not found', p_request_id;
  END IF;

  IF v_request.status NOT IN ('open', 'partially_matched') THEN
    RAISE EXCEPTION 'Exchange request % is not open for matching (status: %)', p_request_id, v_request.status;
  END IF;

  IF v_request.requester_lead_id = p_acceptor_lead_id THEN
    RAISE EXCEPTION 'User cannot accept their own exchange request';
  END IF;

  -- Derive 4 roles based on money direction
  IF v_request.direction = 'RO_TO_IR' THEN
    v_eur_payer := v_request.requester_lead_id;
    v_irr_receiver := v_request.requester_lead_id;
    v_eur_receiver := p_acceptor_lead_id;
    v_irr_payer := p_acceptor_lead_id;
  ELSE -- 'IR_TO_RO'
    v_eur_payer := p_acceptor_lead_id;
    v_irr_receiver := p_acceptor_lead_id;
    v_eur_receiver := v_request.requester_lead_id;
    v_irr_payer := v_request.requester_lead_id;
  END IF;

  v_amount_irr := ROUND(p_amount_eur * v_request.rate);

  INSERT INTO public.exchange_matches (
    request_id,
    acceptor_lead_id,
    amount_eur,
    rate_snapshot,
    amount_irr,
    status,
    eur_payer_lead_id,
    eur_receiver_lead_id,
    irr_payer_lead_id,
    irr_receiver_lead_id,
    destination_account_id,
    reserved_until,
    destination_account_revealed_at
  ) VALUES (
    p_request_id,
    p_acceptor_lead_id,
    p_amount_eur,
    v_request.rate,
    v_amount_irr,
    'RESERVED',
    v_eur_payer,
    v_eur_receiver,
    v_irr_payer,
    v_irr_receiver,
    p_destination_account_id,
    now() + (p_reserved_minutes || ' minutes')::interval,
    now()
  )
  RETURNING * INTO v_match;

  -- Automatically append audit event
  INSERT INTO public.exchange_events (
    match_id,
    request_id,
    actor,
    actor_user_id,
    from_status,
    to_status,
    payload
  ) VALUES (
    v_match.id,
    p_request_id,
    'system_reserve_rpc',
    auth.uid(),
    NULL,
    'RESERVED',
    jsonb_build_object(
      'amount_eur', p_amount_eur,
      'acceptor_lead_id', p_acceptor_lead_id,
      'reserved_until', v_match.reserved_until
    )
  );

  RETURN v_match;
END;
$$;


-- ============================================================================
-- SECTION D: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS across all 16 tables
ALTER TABLE public.exchange_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_related_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_authorized_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_partner_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_request_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_office_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_office_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_transfer_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_banking_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_nonbanking_days ENABLE ROW LEVEL SECURITY;

-- 1. Service Role full bypass on all 16 tables (dre-p100 pattern)
DROP POLICY IF EXISTS exchange_profiles_service_role ON public.exchange_profiles;
CREATE POLICY exchange_profiles_service_role ON public.exchange_profiles
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_related_parties_service_role ON public.exchange_related_parties;
CREATE POLICY exchange_related_parties_service_role ON public.exchange_related_parties
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_authorized_recipients_service_role ON public.exchange_authorized_recipients;
CREATE POLICY exchange_authorized_recipients_service_role ON public.exchange_authorized_recipients
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_partners_service_role ON public.exchange_partners;
CREATE POLICY exchange_partners_service_role ON public.exchange_partners
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_partner_users_service_role ON public.exchange_partner_users;
CREATE POLICY exchange_partner_users_service_role ON public.exchange_partner_users
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_accounts_service_role ON public.exchange_accounts;
CREATE POLICY exchange_accounts_service_role ON public.exchange_accounts
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_requests_service_role ON public.exchange_requests;
CREATE POLICY exchange_requests_service_role ON public.exchange_requests
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_request_prices_service_role ON public.exchange_request_prices;
CREATE POLICY exchange_request_prices_service_role ON public.exchange_request_prices
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_matches_service_role ON public.exchange_matches;
CREATE POLICY exchange_matches_service_role ON public.exchange_matches
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_office_receipts_service_role ON public.exchange_office_receipts;
CREATE POLICY exchange_office_receipts_service_role ON public.exchange_office_receipts
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_office_payouts_service_role ON public.exchange_office_payouts;
CREATE POLICY exchange_office_payouts_service_role ON public.exchange_office_payouts
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_transfer_proofs_service_role ON public.exchange_transfer_proofs;
CREATE POLICY exchange_transfer_proofs_service_role ON public.exchange_transfer_proofs
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_disputes_service_role ON public.exchange_disputes;
CREATE POLICY exchange_disputes_service_role ON public.exchange_disputes
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_events_service_role ON public.exchange_events;
CREATE POLICY exchange_events_service_role ON public.exchange_events
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_banking_calendar_service_role ON public.exchange_banking_calendar;
CREATE POLICY exchange_banking_calendar_service_role ON public.exchange_banking_calendar
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS exchange_nonbanking_days_service_role ON public.exchange_nonbanking_days;
CREATE POLICY exchange_nonbanking_days_service_role ON public.exchange_nonbanking_days
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 2. Authenticated user-level policies using (select auth.uid()) (InitPlan optimization)

-- exchange_profiles: Customers can view their own profile
CREATE POLICY exchange_profiles_select_own ON public.exchange_profiles
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())));

-- exchange_related_parties: Customers manage their own related parties
CREATE POLICY exchange_related_parties_select_own ON public.exchange_related_parties
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())));

CREATE POLICY exchange_related_parties_insert_own ON public.exchange_related_parties
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())));

-- exchange_authorized_recipients: Visible to either the customer or the nominated recipient
CREATE POLICY exchange_auth_recipients_select_own ON public.exchange_authorized_recipients
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
    recipient_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY exchange_auth_recipients_insert_own ON public.exchange_authorized_recipients
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())));

-- exchange_accounts:
-- 1. Customers see their own accounts
-- 2. Counterparts see destination account only during active match after RESERVED
CREATE POLICY exchange_accounts_select_policy ON public.exchange_accounts
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
    (
      id IN (
        SELECT destination_account_id
        FROM public.exchange_matches
        WHERE (
          eur_payer_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
          eur_receiver_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
          irr_payer_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
          irr_receiver_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid()))
        )
        AND status NOT IN ('CANCELLED_FREE', 'EXPIRED')
      )
    )
  );

CREATE POLICY exchange_accounts_insert_own ON public.exchange_accounts
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())));

-- exchange_partners & partner users: Partner staff can view their own partner entity
CREATE POLICY exchange_partners_select_member ON public.exchange_partners
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    id IN (SELECT partner_id FROM public.exchange_partner_users WHERE user_id = (SELECT auth.uid()) AND is_active = true)
  );

CREATE POLICY exchange_partner_users_select_member ON public.exchange_partner_users
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    partner_id IN (SELECT partner_id FROM public.exchange_partner_users WHERE user_id = (SELECT auth.uid()) AND is_active = true)
  );

-- exchange_requests:
-- 1. Requester sees their own requests
-- 2. Active open requests visible to qualified leads with approved profile
CREATE POLICY exchange_requests_select_policy ON public.exchange_requests
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    requester_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
    (
      status IN ('open', 'partially_matched') AND
      EXISTS (
        SELECT 1 FROM public.exchange_profiles ep
        JOIN public.leads l ON l.id = ep.lead_id
        WHERE l.user_id = (SELECT auth.uid()) AND ep.exchange_status = 'approved'
      )
    )
  );

CREATE POLICY exchange_requests_insert_own ON public.exchange_requests
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (
    requester_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid()))
  );

-- exchange_request_prices: readable by users who can see the request
CREATE POLICY exchange_request_prices_select ON public.exchange_request_prices
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    request_id IN (
      SELECT id FROM public.exchange_requests
      WHERE requester_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            status IN ('open', 'partially_matched')
    )
  );

-- exchange_matches:
-- Participants see matches they are involved in; partner users see matches assigned to their partner
CREATE POLICY exchange_matches_select_policy ON public.exchange_matches
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    eur_payer_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
    eur_receiver_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
    irr_payer_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
    irr_receiver_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
    (
      partner_id IS NOT NULL AND
      partner_id IN (
        SELECT partner_id FROM public.exchange_partner_users
        WHERE user_id = (SELECT auth.uid()) AND is_active = true
      )
    )
  );

-- exchange_transfer_proofs: match participants and partner users can view
CREATE POLICY exchange_transfer_proofs_select ON public.exchange_transfer_proofs
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    match_id IN (
      SELECT id FROM public.exchange_matches
      WHERE eur_payer_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            eur_receiver_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            irr_payer_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            irr_receiver_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            (partner_id IS NOT NULL AND partner_id IN (
              SELECT partner_id FROM public.exchange_partner_users WHERE user_id = (SELECT auth.uid()) AND is_active = true
            ))
    )
  );

CREATE POLICY exchange_transfer_proofs_insert ON public.exchange_transfer_proofs
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (
    uploaded_by_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid()))
  );

-- exchange_office_receipts & payouts: readable by match participants
CREATE POLICY exchange_office_receipts_select ON public.exchange_office_receipts
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    match_id IN (
      SELECT id FROM public.exchange_matches
      WHERE eur_payer_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            eur_receiver_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid()))
    )
  );

CREATE POLICY exchange_office_payouts_select ON public.exchange_office_payouts
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    match_id IN (
      SELECT id FROM public.exchange_matches
      WHERE eur_payer_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            eur_receiver_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid()))
    )
  );

-- exchange_disputes: readable and insertable by match participants
CREATE POLICY exchange_disputes_select ON public.exchange_disputes
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    match_id IN (
      SELECT id FROM public.exchange_matches
      WHERE eur_payer_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            eur_receiver_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            irr_payer_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            irr_receiver_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid()))
    )
  );

CREATE POLICY exchange_disputes_insert ON public.exchange_disputes
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (
    opened_by_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid()))
  );

-- exchange_events: readable by match participants
CREATE POLICY exchange_events_select ON public.exchange_events
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (
    match_id IN (
      SELECT id FROM public.exchange_matches
      WHERE eur_payer_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            eur_receiver_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            irr_payer_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid())) OR
            irr_receiver_lead_id IN (SELECT id FROM public.leads WHERE user_id = (SELECT auth.uid()))
    )
  );

-- Calendar & non-banking days: readable by all authenticated users
CREATE POLICY exchange_banking_calendar_select ON public.exchange_banking_calendar
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (true);

CREATE POLICY exchange_nonbanking_days_select ON public.exchange_nonbanking_days
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (true);

COMMIT;
