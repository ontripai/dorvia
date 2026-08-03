import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string }> = {
  'permit': {
    title: 'مجوز کار رومانی (Aviz de Munca) | در رومانی – DORVIA EUROP',
    desc: 'شرایط قانونی صدور مجوز کار برای نیروی کار خارجی توسط کارفرما و تاییدیه اداره مهاجرت رومانی (IGI).'
  },
  'visa': {
    title: 'ویزای کار رومانی (Type D/AM) | در رومانی – DORVIA EUROP',
    desc: 'مراحل دریافت ویزای بلندمدت کاری رومانی از سفارت پس از صدور مجوز کار.'
  },
  'find-job': {
    title: 'راهنمای کاریابی در رومانی | در رومانی – DORVIA EUROP',
    desc: 'معرفی سایت‌های معتبر کاریابی، نحوه نگارش رزومه استاندارد و فرآیند استخدام در بازار کار رومانی.'
  },
  'contract': {
    title: 'قراردادهای کاری و قانون کار رومانی | در رومانی – DORVIA EUROP',
    desc: 'حقوق قانونی کارگران، ثبت قرارداد در سامانه REVISAL، بیمه کار و بازرسی کار (Inspectia Muncii).'
  },
  'tax': {
    title: 'مالیات بر درآمد حقوق در رومانی | در رومانی – DORVIA EUROP',
    desc: 'آشنایی با نرخ‌های مالیات حقوق، کسورات بیمه درمانی و بازنشستگی از حقوق ناخالص در رومانی.'
  },
  'insurance': {
    title: 'بیمه اجتماعی و سلامت کار در رومانی | در رومانی – DORVIA EUROP',
    desc: 'حقوق درمانی، خدمات پزشکی تحت پوشش بیمه دولتی (CNAS) و سیستم بازنشستگی در رومانی.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'کار در رومانی | در رومانی – DORVIA EUROP',
    desc: 'قوانین و شرایط اشتغال نیروی کار خارجی در کشور رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: `${SITE_URL}/work/${params.slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: `${SITE_URL}/work/${params.slug}`,
    }
  };
}

export default function WorkSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}