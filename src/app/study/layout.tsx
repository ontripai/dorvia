import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تحصیل در رومانی | در رومانی – DORVIA EUROP',
  description: 'تحصیل در دانشگاه‌های معتبر رومانی به زبان انگلیسی، پذیرش بدون کنکور، مدارک معتبر اتحادیه اروپا و شهریه اقتصادی.',
  alternates: {
    canonical: 'https://dorvia.eu/study',
  },
  openGraph: {
    title: 'تحصیل در رومانی | در رومانی – DORVIA EUROP',
    description: 'تحصیل در دانشگاه‌های معتبر رومانی به زبان انگلیسی، پذیرش بدون کنکور، مدارک معتبر اتحادیه اروپا و شهریه اقتصادی.',
    url: 'https://dorvia.eu/study',
  }
};

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}