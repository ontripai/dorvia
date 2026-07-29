import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'در رومانی | Dar Romania - مرجع مهاجرت، تحصیل، کار و ثبت شرکت در رومانی',
  description: 'پلتفرم جامع راهنمایی و ارزیابی اولیه مهاجرت قانونی به کشور رومانی و اتحادیه اروپا برای ایرانیان سراسر جهان (تحصیل، کار، ثبت شرکت، سرمایه‌گذاری).',
  keywords: ['مهاجرت به رومانی', 'تحصیل در رومانی', 'ویزای کار رومانی', 'ثبت شرکت در رومانی', 'پزشکی رومانی', 'Dar Romania', 'Immigration to Romania'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-slate-50 antialiased selection:bg-[#002B7F] selection:text-white">
        {children}
      </body>
    </html>
  );
}
