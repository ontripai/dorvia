import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مهاجرت و اقامت رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای جامع روش‌های قانونی مهاجرت به رومانی، تمدید اقامت، اقامت دائم و اخذ شهروندی.',
  alternates: {
    canonical: `${SITE_URL}/immigration`,
  },
  openGraph: {
    title: 'مهاجرت و اقامت رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای جامع روش‌های قانونی مهاجرت به رومانی، تمدید اقامت، اقامت دائم و اخذ شهروندی.',
    url: `${SITE_URL}/immigration`,
  }
};

export default function ImmigrationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}