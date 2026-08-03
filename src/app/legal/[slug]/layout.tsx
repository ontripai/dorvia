import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'قوانین و شرایط استفاده | در رومانی – DORVIA EUROP',
  robots: {
    index: false,
    follow: true,
  }
};

export default function LegalSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}