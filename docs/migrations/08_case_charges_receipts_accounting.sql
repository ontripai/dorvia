-- 08_case_charges_receipts_accounting.sql
-- DORVIA Task Brief dre-p85: Detailed Professional Accounting per Client
--
-- 1. Rename case_invoices to case_charges (multi-charge support per lead).
-- 2. Add description, doc_number, update status check constraint ('open', 'partially_paid', 'paid', 'cancelled').
-- 3. Set default currency to EUR.
-- 4. Create case_receipts table with RLS enabled (strictly server-side service_role access).
-- 5. Create receipt_allocations table with RLS enabled (strictly server-side service_role access).
-- 6. Sequences for auto-generating document numbers: INV-000001, RCT-000001.
-- 7. Drop legacy invoice_installments table.
--
-- Target Live Supabase Project: eufjxgjlahqupxsxmfem

BEGIN;

-- 1. Rename case_invoices to case_charges
ALTER TABLE IF EXISTS public.case_invoices RENAME TO case_charges;

-- 2. Add description and doc_number columns, set currency to EUR
ALTER TABLE public.case_charges
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS doc_number text UNIQUE;

-- Sequence for charge document numbering (INV-000001...)
CREATE SEQUENCE IF NOT EXISTS public.charge_doc_no_seq START 1;
ALTER TABLE public.case_charges
  ALTER COLUMN doc_number SET DEFAULT ('INV-' || lpad(nextval('public.charge_doc_no_seq')::text, 6, '0'));

-- Update status constraint on case_charges
ALTER TABLE public.case_charges
  DROP CONSTRAINT IF EXISTS case_invoices_status_check;

ALTER TABLE public.case_charges
  DROP CONSTRAINT IF EXISTS case_charges_status_check;

ALTER TABLE public.case_charges
  ADD CONSTRAINT case_charges_status_check
  CHECK (status IN ('open', 'partially_paid', 'paid', 'cancelled'));

ALTER TABLE public.case_charges
  ALTER COLUMN status SET DEFAULT 'open',
  ALTER COLUMN currency SET DEFAULT 'EUR';

-- 3. Create case_receipts table
CREATE TABLE IF NOT EXISTS public.case_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  doc_number text UNIQUE,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'EUR',
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

-- 4. Create receipt_allocations table
CREATE TABLE IF NOT EXISTS public.receipt_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id uuid NOT NULL REFERENCES public.case_receipts(id) ON DELETE CASCADE,
  charge_id uuid NOT NULL REFERENCES public.case_charges(id) ON DELETE RESTRICT,
  amount numeric NOT NULL CHECK (amount > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Create performance indexes
CREATE INDEX IF NOT EXISTS case_charges_lead_id_idx ON public.case_charges (lead_id);
CREATE INDEX IF NOT EXISTS case_receipts_lead_id_idx ON public.case_receipts (lead_id);
CREATE INDEX IF NOT EXISTS receipt_allocations_receipt_id_idx ON public.receipt_allocations (receipt_id);
CREATE INDEX IF NOT EXISTS receipt_allocations_charge_id_idx ON public.receipt_allocations (charge_id);

-- 6. Enable Row Level Security (RLS) - Server-side service_role only (no public/anon/authenticated policies)
ALTER TABLE public.case_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_allocations ENABLE ROW LEVEL SECURITY;

-- 7. Drop legacy invoice_installments table
DROP TABLE IF EXISTS public.invoice_installments CASCADE;

COMMIT;
