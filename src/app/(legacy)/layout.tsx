import { SITE_URL } from '@/config';
import type { Metadata, Viewport } from 'next';

import { getDirection } from '@/lib/i18n';
import type { Language } from '@/types';
import '../globals.css';
import { AppLayout } from '@/components/AppLayout';
import { StructuredData } from '@/components/StructuredData';

import { getLocalizedMetadata } from '@/lib/metadata';

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'production';

export async function generateMetadata(): Promise<Metadata> {
  const locale: Language = 'fa';

  const baseMeta = getLocalizedMetadata('home', locale);

  return {
    ...baseMeta,
    robots: isProduction ? {
      index: true,
      follow: true,
    } : {
      index: false,
      follow: false,
    },
    icons: {
      icon: '/images/logo/dorvia-logo-primary-transparent-3000.png',
      shortcut: '/favicon.ico',
      apple: '/images/logo/dorvia-logo-primary-transparent-3000.png',
    }
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import { Inter, Manrope, Vazirmatn } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-manrope' });
const vazirmatn = Vazirmatn({ subsets: ['arabic'], display: 'swap', variable: '--font-vazirmatn' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale: Language = 'fa';

  return (
    <html lang={locale} dir={getDirection(locale)}>
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${manrope.variable} ${vazirmatn.variable} min-h-screen bg-slate-50 antialiased text-slate-900 selection:bg-[#002B7F] selection:text-white`}>
        <AppLayout initialLang={locale}>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
