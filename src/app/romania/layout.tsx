import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شناخت کشور رومانی | در رومانی – DORVIA EUROP',
  description: 'مقدمه‌ای بر جغرافیا، اقتصاد، جامعه، فرهنگ، قوانین کلیدی و شهرهای اصلی کشور رومانی.',
  alternates: {
    canonical: `${SITE_URL}/romania`,
  },
  openGraph: {
    title: 'شناخت کشور رومانی | در رومانی – DORVIA EUROP',
    description: 'مقدمه‌ای بر جغرافیا، اقتصاد، جامعه، فرهنگ، قوانین کلیدی و شهرهای اصلی کشور رومانی.',
    url: `${SITE_URL}/romania`,
  }
};

export default function RomaniaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}