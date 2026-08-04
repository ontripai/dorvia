import { SITE_URL, isProduction } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'خدمات تخصصی مهاجرتی | در رومانی – DORVIA EUROP',
  description: 'خدمات پذیرش تحصیلی، ویزای کار، ثبت شرکت، تایید مدارک و همراهی پس از ورود در کشور رومانی.',
  robots: isProduction ?  {
    index: false,
    follow: true,
  } : undefined,
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: 'خدمات تخصصی مهاجرتی | در رومانی – DORVIA EUROP',
    description: 'خدمات پذیرش تحصیلی، ویزای کار، ثبت شرکت، تایید مدارک و همراهی پس از ورود در کشور رومانی.',
    url: `${SITE_URL}/services`,
  }
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}