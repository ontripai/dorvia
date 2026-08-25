import { getDirection } from '@/lib/i18n';
import { parseUrlLocale } from '@/lib/locale-router';
import { Language } from '@/types';
import { notFound } from 'next/navigation';
import '@/app/globals.css';
import { AppLayout } from '@/components/AppLayout';
import { StructuredData } from '@/components/StructuredData';

import type { Viewport } from 'next';
import { Inter, Manrope, Vazirmatn } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-manrope' });
const vazirmatn = Vazirmatn({ subsets: ['arabic'], display: 'swap', variable: '--font-vazirmatn' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateStaticParams() {
  return [{ lang: 'fa' }, { lang: 'en' }];
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const locale = parseUrlLocale(params.lang);

  if (!locale) {
    notFound();
  }

  const dir = getDirection(locale as Language);

  return (
    <html lang={locale} dir={dir}>
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${manrope.variable} ${vazirmatn.variable} min-h-screen bg-slate-50 antialiased text-slate-900 selection:bg-[#002B7F] selection:text-white`}>
        <AppLayout initialLang={locale as Language}>{children}</AppLayout>
      </body>
    </html>
  );
}
