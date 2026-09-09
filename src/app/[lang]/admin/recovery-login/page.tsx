import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Language } from '@/types';
import AdminRecoveryForm from './AdminRecoveryForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ورود اضطراری مدیریت | DORVIA',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

interface RecoveryLoginPageProps {
  params: { lang: Language };
}

export default function AdminRecoveryLoginPage({ params }: RecoveryLoginPageProps) {
  const currentLang = params.lang || 'fa';

  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center bg-[#071322]">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <AdminRecoveryForm currentLang={currentLang} />
    </Suspense>
  );
}
