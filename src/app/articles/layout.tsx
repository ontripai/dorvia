import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مقالات و راهنماها | در رومانی – DORVIA EUROP',
  description: 'مقالات، راهنماها و آخرین به‌روزرسانی‌های قوانین مهاجرتی، کار و تحصیل در رومانی.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://dorvia.eu/articles',
  },
  openGraph: {
    title: 'مقالات و راهنماها | در رومانی – DORVIA EUROP',
    description: 'مقالات، راهنماها و آخرین به‌روزرسانی‌های قوانین مهاجرتی، کار و تحصیل در رومانی.',
    url: 'https://dorvia.eu/articles',
  }
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}