import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ثبت شرکت و کسب‌وکار در رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای ثبت شرکت SRL، قوانین مالیاتی شرکت‌های میکرو، افتتاح حساب بانکی شرکتی و اقامت مدیرعامل در رومانی.',
  alternates: {
    canonical: `${SITE_URL}/company`,
  },
  openGraph: {
    title: 'ثبت شرکت و کسب‌وکار در رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای ثبت شرکت SRL، قوانین مالیاتی شرکت‌های میکرو، افتتاح حساب بانکی شرکتی و اقامت مدیرعامل در رومانی.',
    url: `${SITE_URL}/company`,
  }
};

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}