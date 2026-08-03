import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string }> = {
  'registration': {
    title: 'مراحل ثبت شرکت SRL در رومانی | در رومانی – DORVIA EUROP',
    desc: 'مراحل و پیش‌نیازهای قانونی ثبت شرکت با مسئولیت محدود (SRL) در اداره ثبت شرکت‌های رومانی (ONRC).'
  },
  'tax-types': {
    title: 'انواع مالیات شرکت‌ها در رومانی | در رومانی – DORVIA EUROP',
    desc: 'بررسی رژیم‌های مالیاتی شرکت‌های خرد (Micro-Enterprise) و شرکت‌های عادی تحت قوانین مالیاتی ANAF.'
  },
  'bank-account': {
    title: 'افتتاح حساب بانکی شرکتی در رومانی | در رومانی – DORVIA EUROP',
    desc: 'مراحل و مدارک لازم جهت افتتاح حساب‌های جاری تجاری به لئو (RON) و یورو برای شرکت‌های تازه ثبت‌شده.'
  },
  'residency': {
    title: 'اقامت تجاری مدیرعامل در رومانی | در رومانی – DORVIA EUROP',
    desc: 'شرایط اخذ و تمدید اجازه اقامت موقت به عنوان مدیرعامل یا سهام‌دار شرکت تجاری در رومانی.'
  },
  'real-estate-investment': {
    title: 'سرمایه‌گذاری در املاک رومانی | در رومانی – DORVIA EUROP',
    desc: 'ضوابط خرید ملک، آپارتمان و زمین برای اشخاص حقیقی غیراروپایی یا از طریق شرکت تجاری.'
  },
  'startup-tech-investment': {
    title: 'سرمایه‌گذاری استارت‌آپی و فناوری | در رومانی – DORVIA EUROP',
    desc: 'فرصت‌های کارآفرینی در قطب‌های فناوری رومانی (بخارست و کلوژ-نپوکا) و ویزای استارت‌آپ.'
  },
  'annual-tax-reporting': {
    title: 'گزارش‌های مالیاتی سالانه شرکت‌ها | در رومانی – DORVIA EUROP',
    desc: 'تکالیف مالیاتی سالانه و فصلی شرکت‌ها و معرفی خدمات حسابداری رسمی در رومانی.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'ثبت شرکت در رومانی | در رومانی – DORVIA EUROP',
    desc: 'قوانین سرمایه‌گذاری و راه‌اندازی کسب‌وکار در کشور رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: `https://dorvia.eu/company/${params.slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: `https://dorvia.eu/company/${params.slug}`,
    }
  };
}

export default function CompanySubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}