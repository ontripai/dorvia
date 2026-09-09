import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@/lib/supabaseServer';
import { Language } from '@/types';
import { PortalLoginForm } from './PortalLoginForm';

export const dynamic = 'force-dynamic';

interface PortalLoginPageProps {
  params: { lang: Language };
}

export default async function PortalLoginPage({ params }: PortalLoginPageProps) {
  const currentLang = params.lang || 'fa';

  // Authoritative server-side cookie session check (dre-p57 / dre-p80)
  // If user already has an active Supabase session in their browser cookies,
  // immediately redirect server-side to the customer dashboard.
  try {
    const supabase = createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect(`/${currentLang}/portal/dashboard`);
    }
  } catch (err: any) {
    // Next.js redirect throws a NEXT_REDIRECT error which must be rethrown
    if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.message?.includes('NEXT_REDIRECT')) {
      throw err;
    }
    // Otherwise fallback to rendering the login form
  }

  return <PortalLoginForm currentLang={currentLang} />;
}
