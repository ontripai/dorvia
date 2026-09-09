/**
 * Authoritative Supabase public project configuration.
 *
 * Security Guarantee:
 * - Returns only public client/anon keys, NEVER SUPABASE_SERVICE_ROLE_KEY.
 * - If NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from the runtime environment (e.g. Vercel),
 *   it falls back to SUPABASE_ANON_KEY, and then to the project's public anon key.
 * - The anon key is inherently public by Supabase design (role: 'anon', strictly gated by RLS).
 */

export const KNOWN_SUPABASE_URL = 'https://eufjxgjlahqupxsxmfem.supabase.co';

export const KNOWN_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Zmp4Z2psYWhxdXB4c3htZmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTYxNTcsImV4cCI6MjEwNDAzMjE1N30.98vajN-OAhF9T_qT46Bi5sjsUQYDt9PNOkQ8zHiwZ6U';

export function getSupabaseAnonKey(): string {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (envKey) {
    // Assert that the environment variable was not accidentally set to the service_role key
    if (serviceRoleKey && envKey === serviceRoleKey) {
      console.error(
        '[Security Warning] Service role key detected where anon key was expected! Refusing to use service_role key as anon key.'
      );
      return KNOWN_SUPABASE_ANON_KEY;
    }
    return envKey;
  }

  return KNOWN_SUPABASE_ANON_KEY;
}

export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    KNOWN_SUPABASE_URL
  );
}
