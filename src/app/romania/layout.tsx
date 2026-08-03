import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شناخت کشور رومانی | در رومانی – DORVIA EUROP',
  description: 'مقدمه‌ای بر جغرافیا، اقتصاد، جامعه، فرهنگ، قوانین کلیدی و شهرهای اصلی کشور رومانی.',
  alternates: {
    canonical: 'https://dorvia.eu/romania',
  },
  openGraph: {
    title: 'شناخت کشور رومانی | در رومانی – DORVIA EUROP',
    description: 'مقدمه‌ای بر جغرافیا، اقتصاد، جامعه، فرهنگ، قوانین کلیدی و شهرهای اصلی کشور رومانی.',
    url: 'https://dorvia.eu/romania',
  }
};

export default function RomaniaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}