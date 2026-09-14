-- ============================================================================
-- Migration 14: Enforce Verified Destination Bank Accounts
-- Task: dre-p142
--
-- Prevents unverified bank accounts from being designated as destination accounts
-- for exchange requests or exchange matches.
--
-- Rules:
-- 1. Trigger fires strictly BEFORE INSERT (not UPDATE) on:
--    - public.exchange_requests
--    - public.exchange_matches
-- 2. Function public.fn_exchange_require_verified_destination is SECURITY DEFINER
--    with search_path = public, pg_temp.
-- 3. Execution permissions restricted strictly to service_role.
-- ============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.fn_exchange_require_verified_destination()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_verified timestamptz;
BEGIN
  SELECT verified_at INTO v_verified
  FROM public.exchange_accounts WHERE id = NEW.destination_account_id;

  IF v_verified IS NULL THEN
    RAISE EXCEPTION 'Destination account % is not verified by staff', NEW.destination_account_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Revoke execute from public/anon/authenticated and grant strictly to service_role
REVOKE ALL ON FUNCTION public.fn_exchange_require_verified_destination()
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.fn_exchange_require_verified_destination()
  TO service_role;

-- Attach trigger to public.exchange_requests
DROP TRIGGER IF EXISTS trg_exchange_requests_require_verified_destination ON public.exchange_requests;
CREATE TRIGGER trg_exchange_requests_require_verified_destination
BEFORE INSERT ON public.exchange_requests
FOR EACH ROW EXECUTE FUNCTION public.fn_exchange_require_verified_destination();

-- Attach trigger to public.exchange_matches
DROP TRIGGER IF EXISTS trg_exchange_matches_require_verified_destination ON public.exchange_matches;
CREATE TRIGGER trg_exchange_matches_require_verified_destination
BEFORE INSERT ON public.exchange_matches
FOR EACH ROW EXECUTE FUNCTION public.fn_exchange_require_verified_destination();

COMMIT;
