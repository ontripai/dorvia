import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شهرهای رومانی | در رومانی – DORVIA EUROP',
  description: 'راهنمای شهرهای مهم کشور رومانی از جمله بخارست، کلوژ-نپوکا، تیمیشوارا و یاش.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://dorvia.eu/cities',
  },
  openGraph: {
    title: 'شهرهای رومانی | در رومانی – DORVIA EUROP',
    description: 'راهنمای شهرهای مهم کشور رومانی از جمله بخارست، کلوژ-نپوکا، تیمیشوارا و یاش.',
    url: 'https://dorvia.eu/cities',
  }
};

export default function CitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}