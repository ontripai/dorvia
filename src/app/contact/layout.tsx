import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ارتباط با ما | در رومانی – DORVIA EUROP',
  description: 'ارتباط با کارشناسان DORVIA EUROP جهت مشاوره و ارزیابی پرونده‌های مهاجرتی رومانی.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'ارتباط با ما | در رومانی – DORVIA EUROP',
    description: 'ارتباط با کارشناسان DORVIA EUROP جهت مشاوره و ارزیابی پرونده‌های مهاجرتی رومانی.',
    url: `${SITE_URL}/contact`,
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}