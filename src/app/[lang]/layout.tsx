import { getDirection } from '@/lib/i18n';
import { isValidLocale } from '@/lib/locale-router';
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
  if (!isValidLocale(params.lang)) {
    notFound();
  }

  const dir = getDirection(params.lang as any);

  return (
    <html lang={params.lang} dir={dir}>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
