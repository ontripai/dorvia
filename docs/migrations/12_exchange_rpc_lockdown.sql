-- ============================================================================
-- Migration 12: Exchange RPC Security Lockdown & Search Path Hardening
-- Task: dre-p135
--
-- APPLICATION ORDER NOTICE:
-- This migration is an essential part of the standard sequential migration chain:
--   10_p2p_exchange_schema.sql -> 11_exchange_staff_operations.sql -> 12_exchange_rpc_lockdown.sql
--
-- If the database is ever provisioned or rebuilt from scratch, omitting migration 12
-- will re-introduce the vulnerability: Migration 10 creates fn_exchange_reserve_request_match
-- with default public execution permissions, allowing PostgREST to expose it over
-- /rest/v1/rpc/fn_exchange_reserve_request_match to 'anon' and 'authenticated' roles.
-- Because the function is SECURITY DEFINER and accepts p_acceptor_lead_id directly,
-- unauthenticated clients could reserve matches on behalf of any customer.
--
-- Migration 12 fixes this by:
--   1. Revoking EXECUTE privileges from PUBLIC, anon, and authenticated on
--      fn_exchange_reserve_request_match, granting EXECUTE strictly to service_role.
--      (All legitimate calls originate from server API routes using supabaseAdmin / service_role).
--   2. Enforcing search_path = public, pg_temp on all 9 functions from migration 10
--      via ALTER FUNCTION ... SET search_path, preventing search_path hijacking
--      without modifying function bodies.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Revoke public/client execution on RPC and restrict to service_role only
-- ----------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.fn_exchange_reserve_request_match(uuid, uuid, numeric, uuid, integer)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.fn_exchange_reserve_request_match(uuid, uuid, numeric, uuid, integer)
  TO service_role;

-- ----------------------------------------------------------------------------
-- 2. Lock down search_path = public, pg_temp for all 9 functions from migration 10
-- ----------------------------------------------------------------------------
ALTER FUNCTION public.fn_exchange_reserve_request_match(uuid, uuid, numeric, uuid, integer)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.fn_exchange_events_prevent_mutation()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.fn_exchange_events_prevent_truncate()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.fn_exchange_matches_validate_request_capacity()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.fn_exchange_accounts_validate_destination()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.fn_exchange_authorized_recipients_validate_approval()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.fn_exchange_matches_validate_transition()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.fn_exchange_matches_validate_settled()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.fn_exchange_matches_validate_irr_confirmed()
  SET search_path = public, pg_temp;

COMMIT;
