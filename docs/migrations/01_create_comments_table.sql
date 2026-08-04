-- =====================================================
-- Supabase Table Migration: Public Comments System
-- Task: DRE-P02-INFRA-T01-M01
-- =====================================================

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'کاربر ناشناس',
  comment_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash TEXT
);

-- Index for fast lookup of approved comments per page_path
CREATE INDEX IF NOT EXISTS idx_comments_page_status 
ON public.comments(page_path, status, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: Allow anyone to view 'approved' comments
CREATE POLICY "Public users can view approved comments" 
ON public.comments
FOR SELECT 
USING (status = 'approved');

-- 2. Public Insert Policy: Allow anyone to submit a new comment (always defaults to status = 'pending')
CREATE POLICY "Public users can submit new comments" 
ON public.comments
FOR INSERT 
WITH CHECK (status = 'pending');

-- 3. Service Role / Admin Policy: Full access for authenticated service role
CREATE POLICY "Full access for service role admin" 
ON public.comments
FOR ALL 
USING (true)
WITH CHECK (true);
