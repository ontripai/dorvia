import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'کار و اشتغال در رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای کاریابی، اخذ مجوز کار (Aviz de Munca)، ویزای کاری و قوانین استخدام اتباع خارجی در رومانی.',
  alternates: {
    canonical: 'https://dorvia.eu/work',
  },
  openGraph: {
    title: 'کار و اشتغال در رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای کاریابی، اخذ مجوز کار (Aviz de Munca)، ویزای کاری و قوانین استخدام اتباع خارجی در رومانی.',
    url: 'https://dorvia.eu/work',
  }
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}