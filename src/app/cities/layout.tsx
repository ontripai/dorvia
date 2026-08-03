import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شهرهای رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای شهرهای مهم کشور رومانی از جمله بخارست، کلوژ-نپوکا، تیمیشوارا و یاش.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${SITE_URL}/cities`,
  },
  openGraph: {
    title: 'شهرهای رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای شهرهای مهم کشور رومانی از جمله بخارست، کلوژ-نپوکا، تیمیشوارا و یاش.',
    url: `${SITE_URL}/cities`,
  }
};

export default function CitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}