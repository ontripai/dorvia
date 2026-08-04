import { isProduction } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'قوانین و شرایط استفاده | در رومانی – DORVIA EUROP',
  robots: isProduction ?  {
    index: false,
    follow: true,
  } : undefined
};

export default function LegalSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}