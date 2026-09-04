import { createBrowserClient } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { LeadFormData } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

// Create client conditionally (uses cookie-based browser client in browser for auth session continuity)
export const supabase: SupabaseClient<Database> | null = isConfigured 
  ? (typeof window !== 'undefined'
      ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
      : createClient<Database>(supabaseUrl, supabaseAnonKey)) 
  : null;

export interface CommentItem {
  id: string;
  page_path: string;
  name: string;
  comment_text: string;
  rating?: number | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  ip_hash?: string | null;
}

export async function submitLeadForm(formData: LeadFormData) {
  try {
    if (!supabase) {
      return { success: false, error: 'Database unconfigured' };
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          site_goal: formData.mainGoal,
          message: formData.message,
          consent_terms: formData.privacyConsent || (formData as any).privacyAcknowledgment || true,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error submitting lead form to Supabase (Internal)');
    return { success: false, error: 'Submission failed' };
  }
}

export async function fetchApprovedComments(pagePath: string): Promise<CommentItem[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('page_comments')
      .select('*')
      .eq('page_path', pagePath)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error (Internal)');
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching comments (Internal)');
    return [];
  }
}

export async function submitComment(payload: {
  page_path: string;
  name?: string;
  comment_text: string;
  rating?: number;
  honeypot?: string;
}) {
  if (payload.honeypot) {
    return { success: true, message: 'Fake success for bots' };
  }

  if (!supabase) {
    return { success: false, error: 'ارسال نظر در حال حاضر غیرفعال است. (System Unconfigured)' };
  }

  try {
    const { error } = await supabase
      .from('page_comments')
      .insert([
        {
          page_path: payload.page_path,
          name: payload.name || 'کاربر ناشناس',
          comment_text: payload.comment_text,
          rating: payload.rating,
          status: 'pending'
        }
      ]);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error submitting comment (Internal)');
    return { success: false, error: 'متاسفانه خطایی رخ داد.' };
  }
}

// Ensure admin operations cannot be run client-side by purging them entirely from the client library
export async function fetchAdminComments() {
  throw new Error('Unauthorized');
}

export async function updateCommentStatus(id: string, status: 'approved' | 'rejected') {
  throw new Error('Unauthorized');
}

export async function deleteComment(id: string) {
  throw new Error('Unauthorized');
}
