import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'نیازهای زندگی در رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای ضروری زندگی روزمره در رومانی شامل امور مالی، مسکن، خدمات درمانی، مدارس، رانندگی و کارهای اداری.',
  alternates: {
    canonical: 'https://dorvia.eu/needs',
  },
  openGraph: {
    title: 'نیازهای زندگی در رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای ضروری زندگی روزمره در رومانی شامل امور مالی، مسکن، خدمات درمانی، مدارس، رانندگی و کارهای اداری.',
    url: 'https://dorvia.eu/needs',
  }
};

export default function NeedsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}