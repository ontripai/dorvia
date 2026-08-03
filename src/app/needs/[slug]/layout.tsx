import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string; noindex?: boolean }> = {
  'currency-exchange': {
    title: 'صرافی و نرخ ارز در رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای تبدیل پول، نرخ‌های رسمی بانک ملی (BNR)، صرافی‌های معتبر و جلوگیری از کارمزدهای پنهان.'
  },
  'driving-license': {
    title: 'گواهینامه رانندگی در رومانی | در رومانی – DORVIA EUROP',
    desc: 'قوانین رانندگی با مجوز بین‌المللی و شرایط تبدیل گواهینامه خارجی در اداره پلیس راهور (DGPCI).'
  },
  'certified-translation': {
    title: 'دارالترجمه رسمی در رومانی | در رومانی – DORVIA EUROP',
    desc: 'یافتن مترجمین رسمی دادگستری رومانی جهت ترجمه مدارک هویتی و تحصیلی به زبان رومانیایی.'
  },
  'notary-public': {
    title: 'دفتر اسناد رسمی در رومانی | در رومانی – DORVIA EUROP',
    desc: 'نقش دفاتر اسناد رسمی (Notar Public)، ثبت قراردادها، وکالت‌نامه‌ها و رسمیت بخشیدن به اسناد ملکی و شرکتی.'
  },
  'iranian-embassy-and-mikhak': {
    title: 'سفارت ایران و سامانه میخک در رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای دریافت خدمات کنسولی، تایید مدارک و وکالت‌نامه‌ها از طریق سامانه میخک سفارت ایران در بخارست.'
  },
  'housing': {
    title: 'اجاره و خرید مسکن در رومانی | در رومانی – DORVIA EUROP',
    desc: 'چک‌لیست قرارداد اجاره مسکن، ثبت در دارایی (ANAF)، ودیعه و شرایط قانونی خرید آپارتمان و ملک.'
  },
  'first-days-checklist': {
    title: 'چک‌لیست روزهای نخست ورود به رومانی | در رومانی – DORVIA EUROP',
    desc: 'اقدامات فوری ۷۲ ساعت، ۷ روز و ۳۰ روز اول ورود شامل تهیه سیم‌کارت، حمل و نقل و حساب بانکی.'
  },
  'health': {
    title: 'خدمات درمانی و سلامت در رومانی | در رومانی – DORVIA EUROP',
    desc: 'آشنایی با سیستم بیمه سلامت عمومی (CNAS)، پزشک خانواده و بیمارستان‌های دولتی و خصوصی رومانی.',
    noindex: true
  },
  'school': {
    title: 'مدارس و سیستم آموزشی مدارس در رومانی | در رومانی – DORVIA EUROP',
    desc: 'آشنایی با سیستم آموزش ابتدایی و متوسطه، ثبت‌نام فرزندان در مدارس دولتی و مدارس بین‌المللی رومانی.',
    noindex: true
  },
  'telecom': {
    title: 'تلفن همراه و اینترنت در رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای خرید سیم‌کارت‌های اعتباری و دائمی (Orange, Vodafone, Digi) و اینترنت خانگی در رومانی.',
    noindex: true
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'نیازهای ضروری در رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای امور اداری و زندگی روزمره در کشور رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    robots: meta.noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: `${SITE_URL}/needs/${params.slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: `${SITE_URL}/needs/${params.slug}`,
    }
  };
}

export default function NeedsSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}