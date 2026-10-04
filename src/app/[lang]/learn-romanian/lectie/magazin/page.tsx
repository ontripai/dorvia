import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { ShopLesson } from '@/components/romanian/ShopLesson';
import { LOCALES } from '@/lib/locale-router';

export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isFa = params.lang === 'fa';
  return { title: isFa ? 'خرید در فروشگاه | درس رومانیایی | درویا' : 'Buying in a shop | Romanian lesson | Dorvia', description: isFa ? 'درس ۱۵ دقیقه‌ای خرید آب، شمارش بطری و پرسیدن قیمت به رومانیایی.' : 'A 15-minute Romanian lesson on buying water, counting bottles and asking the price.', robots: { index: false, follow: false } };
}
export default function ShopLessonPage({ params, searchParams }: { params: { lang: string }; searchParams: { story?: string } }) {
  if (!LOCALES.includes(params.lang as 'fa' | 'en')) notFound();
  const lang = params.lang as 'fa' | 'en';
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><Breadcrumb items={[{ label: lang === 'fa' ? 'خانه' : 'Home', href: '/' }, { label: lang === 'fa' ? 'آموزش رومانیایی' : 'Learn Romanian', href: '/learn-romanian' }, { label: lang === 'fa' ? 'مکالمه‌های روزمره' : 'Everyday conversations', href: '/learn-romanian/lectie' }, { label: lang === 'fa' ? 'خرید در فروشگاه' : 'Shopping in a store' }]} currentLang={lang} disableJsonLd />{searchParams.story === 'home-welcome' && <aside dir={lang === 'fa' ? 'rtl' : 'ltr'} className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50 p-5"><h2 className="text-xl font-bold">{lang === 'fa' ? 'ادامهٔ داستان: همراه آنا در فروشگاه' : 'Story continuation: at the shop with Ana'}</h2><p>{lang === 'fa' ? 'برای خانه آب می‌خرید. درس خرید را انجام دهید؛ در پایان به خانه برگردید و به آنا بگویید چه چیزی آورده‌اید.' : 'You are buying water for the home. Practise the shopping lesson, then return home and tell Ana what you brought.'}</p></aside>}<ShopLesson lang={lang} />{searchParams.story === 'home-welcome' && <aside dir={lang === 'fa' ? 'rtl' : 'ltr'} className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><h2 className="text-xl font-bold">{lang === 'fa' ? 'خرید تمام شد؟ داستان در خانه ادامه دارد' : 'Finished shopping? The story continues at home'}</h2><Link href="/learn-romanian/lectie/acasa/bun-venit?return=shop" className="inline-flex min-h-12 items-center rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{lang === 'fa' ? 'برگشت به خانه و گفت‌وگو دربارهٔ خرید' : 'Return home and talk about the shopping'}</Link></aside>}</main>;
}
