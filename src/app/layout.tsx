import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'در رومانی | DORVIA EUROP - مرجع مهاجرت، تحصیل، کار و ثبت شرکت در رومانی',
  description: 'پلتفرم جامع راهنمایی و ارزیابی اولیه مهاجرت قانونی به کشور رومانی و اتحادیه اروپا برای ایرانیان سراسر جهان (تحصیل، کار، ثبت شرکت، سرمایه‌گذاری).',
  keywords: ['مهاجرت به رومانی', 'تحصیل در رومانی', 'ویزای کار رومانی', 'ثبت شرکت در رومانی', 'پزشکی رومانی', 'DORVIA EUROP', 'Immigration to Romania'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-slate-50 antialiased selection:bg-[#2F6FED] selection:text-white">
        {children}
      </body>
    </html>
  );
}
