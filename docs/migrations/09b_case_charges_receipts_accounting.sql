-- 08_case_charges_receipts_accounting.sql
-- DORVIA Task Brief dre-p85: Detailed Professional Accounting per Client
--
-- 1. Rename case_invoices to case_charges (multi-charge support per lead).
-- 2. Add description, doc_number, update status check constraint ('open', 'partially_paid', 'paid', 'cancelled').
-- 3. Set default currency strictly to EUR (€).
-- 4. Create case_receipts table with RLS enabled.
-- 5. Create receipt_allocations table with soft-cancel audit fields (status, cancelled_at, cancelled_by).
-- 6. Sequences for auto-generating document numbers: INV-000001, RCT-000001.
-- 7. Complete indexes on ALL foreign keys to satisfy Supabase Performance & Security Advisors (get_advisors).
-- 8. Atomic transaction stored procedure (record_receipt_with_allocations) for ACID compliance.
-- 9. Row Level Security (RLS) enabled on all 3 tables with strictly zero public/anon/authenticated policies.
-- 10. Drop legacy invoice_installments table.
--
-- Target Live Supabase Project: eufjxgjlahqupxsxmfem

BEGIN;

-- 1. Rename case_invoices to case_charges (or create if not existing)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'case_invoices')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'case_charges') THEN
    ALTER TABLE public.case_invoices RENAME TO case_charges;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.case_charges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  doc_number text UNIQUE,
  description text NOT NULL DEFAULT '',
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  currency text NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'partially_paid', 'paid', 'cancelled')),
  notes text,
  created_by uuid REFERENCES public.admin_users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure description & doc_number exist if table was renamed from case_invoices
ALTER TABLE public.case_charges
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS doc_number text UNIQUE;

-- Sequence for charge document numbering (INV-000001...)
CREATE SEQUENCE IF NOT EXISTS public.charge_doc_no_seq START 1;
ALTER TABLE public.case_charges
  ALTER COLUMN doc_number SET DEFAULT ('INV-' || lpad(nextval('public.charge_doc_no_seq')::text, 6, '0'));

-- Update constraints on case_charges
ALTER TABLE public.case_charges
  DROP CONSTRAINT IF EXISTS case_invoices_status_check;

ALTER TABLE public.case_charges
  DROP CONSTRAINT IF EXISTS case_charges_status_check;

ALTER TABLE public.case_charges
  ADD CONSTRAINT case_charges_status_check
  CHECK (status IN ('open', 'partially_paid', 'paid', 'cancelled'));

ALTER TABLE public.case_charges
  DROP CONSTRAINT IF EXISTS case_charges_currency_check;

ALTER TABLE public.case_charges
  ADD CONSTRAINT case_charges_currency_check
  CHECK (currency = 'EUR');

ALTER TABLE public.case_charges
  ALTER COLUMN status SET DEFAULT 'open',
  ALTER COLUMN currency SET DEFAULT 'EUR';

-- 2. Create case_receipts table
CREATE TABLE IF NOT EXISTS public.case_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  doc_number text UNIQUE,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'EUR' CHECK (currency = 'EUR'),
  received_at date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text CHECK (payment_method IN ('bank_transfer', 'cash', 'card')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  notes text,
  created_by uuid REFERENCES public.admin_users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Sequence for receipt document numbering (RCT-000001...)
CREATE SEQUENCE IF NOT EXISTS public.receipt_doc_no_seq START 1;
ALTER TABLE public.case_receipts
  ALTER COLUMN doc_number SET DEFAULT ('RCT-' || lpad(nextval('public.receipt_doc_no_seq')::text, 6, '0'));

-- 3. Create receipt_allocations table with audit & soft-cancel support
CREATE TABLE IF NOT EXISTS public.receipt_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id uuid NOT NULL REFERENCES public.case_receipts(id) ON DELETE CASCADE,
  charge_id uuid NOT NULL REFERENCES public.case_charges(id) ON DELETE RESTRICT,
  amount numeric NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  cancelled_at timestamptz,
  cancelled_by uuid REFERENCES public.admin_users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure soft-cancel columns exist if table already exists
ALTER TABLE public.receipt_allocations
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_by uuid REFERENCES public.admin_users(id);

-- 4. Complete Performance & Foreign Key Indexes to satisfy Supabase Advisors (get_advisors)
CREATE INDEX IF NOT EXISTS case_charges_lead_id_idx ON public.case_charges (lead_id);
CREATE INDEX IF NOT EXISTS case_charges_created_by_idx ON public.case_charges (created_by);
CREATE INDEX IF NOT EXISTS case_receipts_lead_id_idx ON public.case_receipts (lead_id);
CREATE INDEX IF NOT EXISTS case_receipts_created_by_idx ON public.case_receipts (created_by);
CREATE INDEX IF NOT EXISTS receipt_allocations_receipt_id_idx ON public.receipt_allocations (receipt_id);
CREATE INDEX IF NOT EXISTS receipt_allocations_charge_id_idx ON public.receipt_allocations (charge_id);
CREATE INDEX IF NOT EXISTS receipt_allocations_cancelled_by_idx ON public.receipt_allocations (cancelled_by);

-- 5. Enable Row Level Security (RLS) - Server-side service_role only (no public/anon/authenticated policies)
ALTER TABLE public.case_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_allocations ENABLE ROW LEVEL SECURITY;

-- 6. Atomic Stored Procedure: record_receipt_with_allocations
CREATE OR REPLACE FUNCTION public.record_receipt_with_allocations(
  p_lead_id uuid,
  p_amount numeric,
  p_currency text,
  p_payment_method text,
  p_received_at date,
  p_notes text,
  p_created_by uuid,
  p_allocations jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_receipt_id uuid;
  v_doc_number text;
  v_alloc_record jsonb;
  v_charge_id uuid;
  v_alloc_amount numeric;
  v_total_allocated numeric := 0;
  v_charge_total numeric;
  v_charge_status text;
  v_active_allocated numeric;
  v_remaining numeric;
  v_new_charge_status text;
  v_result jsonb;
BEGIN
  -- Validate lead exists
  IF NOT EXISTS (SELECT 1 FROM public.leads WHERE id = p_lead_id) THEN
    RAISE EXCEPTION 'Lead not found (ID: %)', p_lead_id;
  END IF;

  -- Validate total amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Receipt amount must be strictly greater than 0';
  END IF;

  -- Generate document number
  v_doc_number := 'RCT-' || lpad(nextval('public.receipt_doc_no_seq')::text, 6, '0');

  -- Insert receipt
  INSERT INTO public.case_receipts (
    lead_id,
    doc_number,
    amount,
    currency,
    received_at,
    payment_method,
    status,
    notes,
    created_by
  ) VALUES (
    p_lead_id,
    v_doc_number,
    p_amount,
    p_currency,
    COALESCE(p_received_at, CURRENT_DATE),
    p_payment_method,
    'active',
    p_notes,
    p_created_by
  )
  RETURNING id INTO v_receipt_id;

  -- Process and validate allocations atomically if provided
  IF p_allocations IS NOT NULL AND jsonb_array_length(p_allocations) > 0 THEN
    FOR v_alloc_record IN SELECT * FROM jsonb_array_elements(p_allocations)
    LOOP
      v_charge_id := (v_alloc_record->>'charge_id')::uuid;
      v_alloc_amount := (v_alloc_record->>'amount')::numeric;

      IF v_alloc_amount <= 0 THEN
        CONTINUE;
      END IF;

      v_total_allocated := v_total_allocated + v_alloc_amount;

      -- Lock target charge row for update to prevent concurrent double allocation
      SELECT total_amount, status
        INTO v_charge_total, v_charge_status
        FROM public.case_charges
       WHERE id = v_charge_id AND lead_id = p_lead_id
         FOR UPDATE;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Charge % does not exist or does not belong to lead %', v_charge_id, p_lead_id;
      END IF;

      IF v_charge_status = 'cancelled' THEN
        RAISE EXCEPTION 'Cannot allocate payment to a cancelled charge (%)', v_charge_id;
      END IF;

      -- Calculate active allocated sum so far
      SELECT COALESCE(SUM(amount), 0)
        INTO v_active_allocated
        FROM public.receipt_allocations
       WHERE charge_id = v_charge_id AND status = 'active';

      v_remaining := v_charge_total - v_active_allocated;
      IF v_alloc_amount > v_remaining THEN
        RAISE EXCEPTION 'Allocation amount (%) exceeds remaining unpaid balance (%) for charge %',
          v_alloc_amount, v_remaining, v_charge_id;
      END IF;

      -- Insert active allocation
      INSERT INTO public.receipt_allocations (
        receipt_id,
        charge_id,
        amount,
        status
      ) VALUES (
        v_receipt_id,
        v_charge_id,
        v_alloc_amount,
        'active'
      );

      -- Update charge status
      IF (v_active_allocated + v_alloc_amount) >= v_charge_total THEN
        v_new_charge_status := 'paid';
      ELSE
        v_new_charge_status := 'partially_paid';
      END IF;

      UPDATE public.case_charges
         SET status = v_new_charge_status,
             updated_at = now()
       WHERE id = v_charge_id;
    END LOOP;

    -- Ensure total allocated does not exceed receipt total
    IF v_total_allocated > p_amount THEN
      RAISE EXCEPTION 'Total allocated amount (%) exceeds total receipt amount (%)',
        v_total_allocated, p_amount;
    END IF;
  END IF;

  -- Build return payload
  SELECT jsonb_build_object(
    'id', r.id,
    'lead_id', r.lead_id,
    'doc_number', r.doc_number,
    'amount', r.amount,
    'currency', r.currency,
    'received_at', r.received_at,
    'payment_method', r.payment_method,
    'status', r.status,
    'notes', r.notes,
    'allocated_amount', v_total_allocated,
    'unallocated_amount', (p_amount - v_total_allocated),
    'created_at', r.created_at
  ) INTO v_result
  FROM public.case_receipts r
  WHERE r.id = v_receipt_id;

  RETURN v_result;
END;
$$;

-- 7. Drop legacy invoice_installments table
DROP TABLE IF EXISTS public.invoice_installments CASCADE;

COMMIT;
