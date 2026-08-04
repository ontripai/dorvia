import { SITE_URL, isProduction } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مقالات و راهنماها | در رومانی – DORVIA EUROP',
  description: 'مقالات، راهنماها و آخرین به‌روزرسانی‌های قوانین مهاجرتی، کار و تحصیل در رومانی.',
  robots: isProduction ?  {
    index: false,
    follow: true,
  } : undefined,
  alternates: {
    canonical: `${SITE_URL}/articles`,
  },
  openGraph: {
    title: 'مقالات و راهنماها | در رومانی – DORVIA EUROP',
    description: 'مقالات، راهنماها و آخرین به‌روزرسانی‌های قوانین مهاجرتی، کار و تحصیل در رومانی.',
    url: `${SITE_URL}/articles`,
  }
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}