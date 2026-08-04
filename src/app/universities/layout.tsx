import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'دانشگاه‌های معتبر رومانی | در رومانی – DORVIA EUROP',
  description: 'جستجو و بررسی دانشگاه‌های دولتی و تخصصی رومانی بر اساس شهریه، رشته‌ها و شهر محل تحصیل.',
  alternates: {
    canonical: `${SITE_URL}/universities`,
  },
  openGraph: {
    title: 'دانشگاه‌های معتبر رومانی | در رومانی – DORVIA EUROP',
    description: 'جستجو و بررسی دانشگاه‌های دولتی و تخصصی رومانی بر اساس شهریه، رشته‌ها و شهر محل تحصیل.',
    url: `${SITE_URL}/universities`,
  }
};

export default function UniversitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}