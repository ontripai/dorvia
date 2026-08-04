const fs = require('fs');

const content = `import { SITE_URL } from '@/config';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppLayout } from '../components/AppLayout';

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'production';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'دوریا اروپا | DORVIA EUROP - مرجع مهاجرت، اقامت، کار و ویزای تحصیلی در رومانی',
  description: 'اپلیکیشن جامع برای ارزیابی و مشاوره رایگان مهاجرت به رومانی و اتحادیه اروپا. دریافت اطلاعات به‌روز درباره شرایط کار، تحصیل، ثبت شرکت (سرمایه‌گذاری) و پیوست خانواده.',
  keywords: ['مهاجرت به رومانی', 'اقامت در رومانی', 'کاریابی رومانی', 'ویزای تحصیلی در رومانی', 'ثبت شرکت رومانی', 'DORVIA EUROP', 'Immigration to Romania'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'دوریا اروپا | DORVIA EUROP - مرجع مهاجرت، اقامت، کار و ویزای تحصیلی در رومانی',
    description: 'اپلیکیشن جامع برای ارزیابی و مشاوره رایگان مهاجرت به رومانی و اتحادیه اروپا. دریافت اطلاعات به‌روز درباره شرایط کار، تحصیل، ثبت شرکت (سرمایه‌گذاری) و پیوست خانواده.',
    url: '/',
  },
  robots: isProduction ? {
    index: true,
    follow: true,
  } : {
    index: false,
    follow: false,
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-slate-50 antialiased text-slate-900 selection:bg-[#002B7F] selection:text-white">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
`;

fs.writeFileSync('src/app/layout.tsx', content, 'utf8');
