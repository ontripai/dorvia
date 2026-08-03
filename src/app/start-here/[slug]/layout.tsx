import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string }> = {
  'planning-to-come': {
    title: 'برنامه‌ریزی قبل از سفر به رومانی | در رومانی – DORVIA EUROP',
    desc: 'مراحل آماده‌سازی مدارک تحصیلی، کاری و هویتی، سوءپیشینه، بیمه مسافرتی و اقدامات پیش از پرواز.'
  },
  'just-arrived': {
    title: 'اقدامات پس از ورود به رومانی | در رومانی – DORVIA EUROP',
    desc: 'اولین اقدامات در فرودگاه، تهیه سیم‌کارت محلی، کارت حمل و نقل شهری و هماهنگی آدرس مسکن.'
  },
  'living-here': {
    title: 'زندگی و استقرار بلندمدت در رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای افتتاح حساب بانکی دائمی، تمدید سالانه اقامت، خرید ملک، قوانین کار و مالیات شخصی.'
  },
  'pre-departure-checklist': {
    title: 'چک‌لیست قبل از پرواز به رومانی | در رومانی – DORVIA EUROP',
    desc: 'لیست لوازم ضروری، ارز مجاز مسافرتی، اسناد و تاییدیه اقامتگاه دانشجویی یا اجاره‌ای قبل از سفر.'
  },
  'first-three-days': {
    title: 'سه روز اول ورود به رومانی | در رومانی – DORVIA EUROP',
    desc: 'اقدامات حیاتی ۷۲ ساعت اول از ترانسفر فرودگاهی تا ثبت حضوری در دانشگاه یا معرفی به محل کار.'
  },
  'first-month': {
    title: 'ماه اول استقرار در رومانی | در رومانی – DORVIA EUROP',
    desc: 'کارهای اداری ماه اول شامل ثبت قرارداد در ANAF، تست‌های پزشکی، و ثبت درخواست کارت اقامت موقت.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'شروع از اینجا | در رومانی – DORVIA EUROP',
    desc: 'راهنمای گام به گام ورود و استقرار در کشور رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: `${SITE_URL}/start-here/${params.slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: `${SITE_URL}/start-here/${params.slug}`,
    }
  };
}

export default function StartHereSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}