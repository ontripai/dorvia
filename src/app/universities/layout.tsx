import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'دانشگاه‌های معتبر رومانی | در رومانی – DORVIA EUROP',
  description: 'جستجو و بررسی دانشگاه‌های دولتی و تخصصی رومانی بر اساس شهریه، رشته‌ها و شهر محل تحصیل.',
  alternates: {
    canonical: 'https://dorvia.eu/universities',
  },
  openGraph: {
    title: 'دانشگاه‌های معتبر رومانی | در رومانی – DORVIA EUROP',
    description: 'جستجو و بررسی دانشگاه‌های دولتی و تخصصی رومانی بر اساس شهریه، رشته‌ها و شهر محل تحصیل.',
    url: 'https://dorvia.eu/universities',
  }
};

export default function UniversitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}