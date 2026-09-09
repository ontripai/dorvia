-- 07_rate_limit_events.sql
-- DORVIA Task Brief dre-p82: Pre-Public Launch Security & Privacy Hardening
-- Persistent application-level rate limiting events table.

CREATE TABLE IF NOT EXISTS public.rate_limit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rate_limit_events_bucket_created_idx
  ON public.rate_limit_events (bucket_key, created_at DESC);

ALTER TABLE public.rate_limit_events ENABLE ROW LEVEL SECURITY;
-- No public policies — accessible only via service_role key.
