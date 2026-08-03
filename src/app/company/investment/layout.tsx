import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سرمایه‌گذاری در رومانی | در رومانی – DORVIA EUROP',
  description: 'فرصت‌های سرمایه‌گذاری ملکی و استارت‌آپی در رومانی و اخذ اقامت از طریق سرمایه‌گذاری.',
  alternates: {
    canonical: `${SITE_URL}/company/investment`,
  },
  openGraph: {
    title: 'سرمایه‌گذاری در رومانی | در رومانی – DORVIA EUROP',
    description: 'فرصت‌های سرمایه‌گذاری ملکی و استارت‌آپی در رومانی و اخذ اقامت از طریق سرمایه‌گذاری.',
    url: `${SITE_URL}/company/investment`,
  }
};

export default function CompanyInvestmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}