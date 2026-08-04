import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'نیازهای زندگی در رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای ضروری زندگی روزمره در رومانی شامل امور مالی، مسکن، خدمات درمانی، مدارس، رانندگی و کارهای اداری.',
  alternates: {
    canonical: `${SITE_URL}/needs`,
  },
  openGraph: {
    title: 'نیازهای زندگی در رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای ضروری زندگی روزمره در رومانی شامل امور مالی، مسکن، خدمات درمانی، مدارس، رانندگی و کارهای اداری.',
    url: `${SITE_URL}/needs`,
  }
};

export default function NeedsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}