-- ==============================================================================
-- DORVIA Database Security Hardening & Row Level Security (RLS) Policy Suite
-- ==============================================================================
-- Purpose:
-- 1. Enforce Row Level Security (RLS) on all public tables: page_comments & leads.
-- 2. Prevent unauthorized access to PII (leads: names, emails, phones, assessment answers).
-- 3. Restrict public comment submission to 'pending' moderation status only.
-- 4. Restrict public comment reads to 'approved' comments only.
-- 5. Isolate full CRUD privileges strictly to the service_role key (server-side only).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Table: page_comments (Public Comments System)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.page_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'کاربر ناشناس',
  comment_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_page_comments_path_status 
ON public.page_comments(page_path, status, created_at DESC);

-- Enable RLS
ALTER TABLE public.page_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if reapplying
DROP POLICY IF EXISTS "Public users can view approved comments" ON public.page_comments;
DROP POLICY IF EXISTS "Public users can submit new comments" ON public.page_comments;
DROP POLICY IF EXISTS "Service role full access on page_comments" ON public.page_comments;

-- Policy 1.1: Public Read — only approved comments are visible to the public
CREATE POLICY "Public users can view approved comments" 
ON public.page_comments
FOR SELECT 
TO anon, authenticated
USING (status = 'approved');

-- Policy 1.2: Public Write — new comments must always have status 'pending'
CREATE POLICY "Public users can submit new comments" 
ON public.page_comments
FOR INSERT 
TO anon, authenticated
WITH CHECK (status = 'pending');

-- Policy 1.3: Service Role / Admin — full access for server-side operations
CREATE POLICY "Service role full access on page_comments" 
ON public.page_comments
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 2. Table: leads (Unified Leads & PathFinder Assessment Submissions)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'website',
  channel_ref TEXT,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  site_goal TEXT,
  unified_category TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'archived')),
  consent_terms BOOLEAN NOT NULL DEFAULT true,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  raw_meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_source_created 
ON public.leads(source, created_at DESC);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if reapplying
DROP POLICY IF EXISTS "Deny all public reads on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anon inserts with restricted scope" ON public.leads;
DROP POLICY IF EXISTS "Service role full access on leads" ON public.leads;

-- Policy 2.1: Strictly DENY any public SELECT on leads to protect user PII
-- By enabling RLS without a SELECT policy for anon/authenticated, public reads are 100% blocked.

-- Policy 2.2: Service Role / Server Actions / Route Handlers have complete access
CREATE POLICY "Service role full access on leads" 
ON public.leads
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- Verification Checklist:
-- [x] RLS enabled on public.page_comments
-- [x] Public can only SELECT approved comments
-- [x] Public can only INSERT pending comments
-- [x] RLS enabled on public.leads
-- [x] Public SELECT on leads is completely blocked (Zero PII leakage)
-- [x] Service role key isolated to server endpoints (/api/evaluation, /api/assessment)
-- ==============================================================================
