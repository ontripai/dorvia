import { getDirection } from '@/lib/i18n';
import { parseUrlLocale } from '@/lib/locale-router';
import { Language } from '@/types';
import { notFound } from 'next/navigation';
import '@/app/globals.css';
import { AppLayout } from '@/components/AppLayout';

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
      <body>
        <AppLayout initialLang={locale as Language}>{children}</AppLayout>
      </body>
    </html>
  );
}
