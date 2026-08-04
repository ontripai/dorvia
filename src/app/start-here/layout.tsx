import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شروع از اینجا – راهنمای گام به گام | در رومانی – DORVIA EUROP',
  description: 'راهنمای تعاملی و گام به گام ورود و استقرار در کشور رومانی ویژه دانشجویان، نیروی کار و سرمایه‌گذاران.',
  alternates: {
    canonical: `${SITE_URL}/start-here`,
  },
  openGraph: {
    title: 'شروع از اینجا – راهنمای گام به گام | در رومانی – DORVIA EUROP',
    description: 'راهنمای تعاملی و گام به گام ورود و استقرار در کشور رومانی ویژه دانشجویان، نیروی کار و سرمایه‌گذاران.',
    url: `${SITE_URL}/start-here`,
  }
};

export default function StartHereLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}