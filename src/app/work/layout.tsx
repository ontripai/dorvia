import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'کار و اشتغال در رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای کاریابی، اخذ مجوز کار (Aviz de Munca)، ویزای کاری و قوانین استخدام اتباع خارجی در رومانی.',
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    title: 'کار و اشتغال در رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای کاریابی، اخذ مجوز کار (Aviz de Munca)، ویزای کاری و قوانین استخدام اتباع خارجی در رومانی.',
    url: `${SITE_URL}/work`,
  }
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}