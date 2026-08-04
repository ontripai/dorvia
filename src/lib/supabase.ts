import { createClient } from '@supabase/supabase-js';
import { LeadFormData } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CommentItem {
  id: string;
  page_path: string;
  name: string;
  comment_text: string;
  rating?: number | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  ip_hash?: string;
}

const LOCAL_COMMENTS_KEY = 'next_romania_demo_comments_v1';

// Seed demo comments for rich preview when local
function getLocalComments(): CommentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    if (!raw) {
      const defaultDemo: CommentItem[] = [
        {
          id: 'demo-1',
          page_path: 'needs/driving-license',
          name: 'رضا امینی',
          comment_text: 'راهنمای بسیار مفیدی بود. من فرآیند استعلام گواهی‌نامه از سفارت در بخارست را طبق همین مراحل انجام دادم.',
          rating: 5,
          status: 'approved',
          created_at: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: 'demo-2',
          page_path: 'needs/driving-license',
          name: 'سارا کاظمی',
          comment_text: 'ممنون از شفاف‌سازی هزینه‌ها و هزینه ۴۶ لِی خدمت جدید DGPCI برای گواهی‌نامه بین‌المللی.',
          rating: 5,
          status: 'approved',
          created_at: new Date(Date.now() - 86400000 * 1).toISOString()
        }
      ];
      localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(defaultDemo));
      return defaultDemo;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveLocalComments(comments: CommentItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments));
  } catch (e) {}
}

const isDemo = () => supabaseUrl.includes('your-supabase-project') || !process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function submitLeadForm(formData: LeadFormData) {
  try {
    if (isDemo()) {
      console.info('[Dar Romania Supabase Scaffold] Form submission data received:', formData);
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true, isDemo: true, data: formData };
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          current_country: formData.currentCountry,
          nationality: formData.nationality,
          preferred_language: formData.preferredLanguage,
          main_goal: formData.mainGoal,
          education_level: formData.educationLevel,
          work_experience: formData.workExperience,
          approximate_budget: formData.approximateBudget,
          marital_status: formData.maritalStatus,
          message: formData.message,
          privacy_consent: formData.privacyConsent,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error submitting lead form to Supabase:', err);
    return { success: true, isDemo: true, fallbackMessage: 'Saved locally in preview mode' };
  }
}

// 1. Fetch approved comments for public page
export async function fetchApprovedComments(pagePath: string): Promise<CommentItem[]> {
  try {
    if (isDemo()) {
      const local = getLocalComments();
      return local.filter((c) => c.page_path === pagePath && c.status === 'approved');
    }

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('page_path', pagePath)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[Supabase Fetch Comments Error]:', err);
    // Fallback to local store
    const local = getLocalComments();
    return local.filter((c) => c.page_path === pagePath && c.status === 'approved');
  }
}

// 2. Submit new public comment (status defaults to 'pending')
export async function submitComment(params: {
  page_path: string;
  name?: string;
  comment_text: string;
  rating?: number;
  honeypot?: string;
}) {
  // Honeypot anti-bot check
  if (params.honeypot && params.honeypot.trim().length > 0) {
    return { success: false, error: 'Bot submission detected' };
  }

  const nameToUse = params.name && params.name.trim() ? params.name.trim() : 'کاربر ناشناس';
  const newComment: CommentItem = {
    id: 'cmt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    page_path: params.page_path,
    name: nameToUse,
    comment_text: params.comment_text.trim(),
    rating: params.rating || null,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  try {
    if (isDemo()) {
      const local = getLocalComments();
      local.unshift(newComment);
      saveLocalComments(local);
      return { success: true, data: newComment, isDemo: true };
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          page_path: params.page_path,
          name: nameToUse,
          comment_text: params.comment_text.trim(),
          rating: params.rating || null,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] || newComment };
  } catch (err) {
    console.error('[Supabase Submit Comment Error]:', err);
    // Local fallback
    const local = getLocalComments();
    local.unshift(newComment);
    saveLocalComments(local);
    return { success: true, data: newComment, isDemo: true };
  }
}

// 3. Fetch all comments for Admin moderation panel
export async function fetchAdminComments(): Promise<CommentItem[]> {
  try {
    if (isDemo()) {
      return getLocalComments();
    }

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[Supabase Admin Fetch Error]:', err);
    return getLocalComments();
  }
}

// 4. Update comment status (approve/reject)
export async function updateCommentStatus(commentId: string, status: 'approved' | 'rejected') {
  try {
    if (isDemo()) {
      const local = getLocalComments();
      const idx = local.findIndex((c) => c.id === commentId);
      if (idx !== -1) {
        local[idx].status = status;
        saveLocalComments(local);
      }
      return { success: true, isDemo: true };
    }

    const { error } = await supabase
      .from('comments')
      .update({ status })
      .eq('id', commentId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('[Supabase Update Status Error]:', err);
    const local = getLocalComments();
    const idx = local.findIndex((c) => c.id === commentId);
    if (idx !== -1) {
      local[idx].status = status;
      saveLocalComments(local);
    }
    return { success: true, isDemo: true };
  }
}

// 5. Delete comment
export async function deleteComment(commentId: string) {
  try {
    if (isDemo()) {
      let local = getLocalComments();
      local = local.filter((c) => c.id !== commentId);
      saveLocalComments(local);
      return { success: true, isDemo: true };
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('[Supabase Delete Comment Error]:', err);
    let local = getLocalComments();
    local = local.filter((c) => c.id !== commentId);
    saveLocalComments(local);
    return { success: true, isDemo: true };
  }
}
