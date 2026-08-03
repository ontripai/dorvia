import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ثبت شرکت و کسب‌وکار در رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای ثبت شرکت SRL، قوانین مالیاتی شرکت‌های میکرو، افتتاح حساب بانکی شرکتی و اقامت مدیرعامل در رومانی.',
  alternates: {
    canonical: 'https://dorvia.eu/company',
  },
  openGraph: {
    title: 'ثبت شرکت و کسب‌وکار در رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای ثبت شرکت SRL، قوانین مالیاتی شرکت‌های میکرو، افتتاح حساب بانکی شرکتی و اقامت مدیرعامل در رومانی.',
    url: 'https://dorvia.eu/company',
  }
};

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}