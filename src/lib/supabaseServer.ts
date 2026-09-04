import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

/**
 * Creates a server-side Supabase client with cookie access for Server Components and Route Handlers.
 */
export function createServerComponentClient(request?: Request) {
  let cookieStore: any = null;
  try {
    cookieStore = cookies();
  } catch {
    // May be invoked outside Next.js requestAsyncStorage context (e.g. in test suites)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        if (cookieStore) {
          try {
            const val = cookieStore.get(name)?.value;
            if (val !== undefined) return val;
          } catch {}
        }
        if (request) {
          const cookieHeader = request.headers.get('cookie') || '';
          const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
          return match ? decodeURIComponent(match[1]) : undefined;
        }
        return undefined;
      },
      set(name: string, value: string, options: any) {
        if (cookieStore) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // May be invoked in a Server Component where setting cookies is unsupported.
          }
        }
      },
      remove(name: string, options: any) {
        if (cookieStore) {
          try {
            cookieStore.delete({ name, ...options });
          } catch (error) {
            // May be invoked in a Server Component where deleting cookies is unsupported.
          }
        }
      },
    },
  });
}
