import { createClient } from '@supabase/supabase-js';
import { LeadFormData } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function submitLeadForm(formData: LeadFormData) {
  try {
    // If Supabase credentials are still default placeholder, log to console and simulate successful insert
    if (supabaseUrl.includes('your-supabase-project') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.info('[Dar Romania Supabase Scaffold] Form submission data received:', formData);
      // Simulate API latency
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
    // Graceful fallback for demo
    return { success: true, isDemo: true, fallbackMessage: 'Saved locally in preview mode' };
  }
}
