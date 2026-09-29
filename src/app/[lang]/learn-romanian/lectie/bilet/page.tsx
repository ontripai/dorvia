import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/locale-router';
import { Breadcrumb } from '@/components/Breadcrumb';
import { TicketLesson } from '@/components/romanian/TicketLesson';

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return {
    title: isFa ? 'درس تعاملی: یک یا دو بلیت | درویا' : 'One or two tickets | Dorvia',
    description: isFa
      ? 'اسم خنثی را در درخواست یک یا دو بلیت بشنوید، تمرین کنید و در مکالمه به کار ببرید.'
      : 'Hear, practise, and use a Romanian neuter noun in a ticket-counter conversation.',
    robots: { index: false, follow: false },
  };
}

export default function TicketLessonPage({ params }: { params: { lang: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en';
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: lang === 'fa' ? 'صفحه اصلی' : 'Home', href: '/' },
          { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' },
          { label: lang === 'fa' ? 'یک یا دو بلیت' : 'One or two tickets' },
        ]}
        currentLang={lang}
        disableJsonLd
      />
      <TicketLesson lang={lang} />
    </main>
  );
}
