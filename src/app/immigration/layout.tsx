import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مهاجرت و اقامت رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای جامع روش‌های قانونی مهاجرت به رومانی، تمدید اقامت، اقامت دائم و اخذ شهروندی.',
  alternates: {
    canonical: 'https://dorvia.eu/immigration',
  },
  openGraph: {
    title: 'مهاجرت و اقامت رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای جامع روش‌های قانونی مهاجرت به رومانی، تمدید اقامت، اقامت دائم و اخذ شهروندی.',
    url: 'https://dorvia.eu/immigration',
  }
};

export default function ImmigrationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}