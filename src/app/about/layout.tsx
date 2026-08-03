import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'درباره ما | در رومانی – DORVIA EUROP',
  description: 'درباره پلتفرم در رومانی (DORVIA EUROP)، اهداف ما در تسهیل فرآیند مهاجرت، کار و تحصیل در رومانی.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'درباره ما | در رومانی – DORVIA EUROP',
    description: 'درباره پلتفرم در رومانی (DORVIA EUROP)، اهداف ما در تسهیل فرآیند مهاجرت، کار و تحصیل در رومانی.',
    url: `${SITE_URL}/about`,
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
