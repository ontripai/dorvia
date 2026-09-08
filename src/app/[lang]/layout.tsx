import { getDirection } from '@/lib/i18n';
import { parseUrlLocale } from '@/lib/locale-router';
import { Language } from '@/types';
import { notFound } from 'next/navigation';
import '@/app/globals.css';
import { AppLayout } from '@/components/AppLayout';
import { StructuredData } from '@/components/StructuredData';

import type { Viewport } from 'next';
import { Manrope, Vazirmatn } from 'next/font/google';

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

import { isJobBoardPubliclyEnabled } from '@/lib/jobBoardHelper';

export default async function RootLayout({
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
  const jobBoardEnabled = await isJobBoardPubliclyEnabled();

  return (
    <html lang={locale} dir={dir}>
      <head>
        <StructuredData />
      </head>
      <body className={`${manrope.variable} ${vazirmatn.variable} min-h-screen bg-slate-50 antialiased text-slate-900 selection:bg-[#002B7F] selection:text-white`}>
        <AppLayout initialLang={locale as Language} jobBoardEnabled={jobBoardEnabled}>{children}</AppLayout>
      </body>
    </html>
  );
}
