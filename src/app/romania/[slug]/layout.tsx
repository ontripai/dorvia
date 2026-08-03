import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string; noindex?: boolean }> = {
  'economy': {
    title: 'اقتصاد و صنایع رومانی | در رومانی – DORVIA EUROP',
    desc: 'تحلیل اقتصاد رومانی، بخش‌های فعال مانند خودروسازی و فناوری اطلاعات، درآمدها و رشد اقتصادی بازار کار.'
  },
  'society': {
    title: 'جامعه و زندگی اجتماعی در رومانی | در رومانی – DORVIA EUROP',
    desc: 'ساختار اجتماعی، زبان رسمی، آداب رفتار اجتماعی، سیستم آموزش عمومی و ادغام فرهنگی مهاجران.'
  },
  'culture-and-arts': {
    title: 'فرهنگ، هنر و میراث رومانی | در رومانی – DORVIA EUROP',
    desc: 'میراث فرهنگی غنی، قلعه‌های ترانسیلوانیا، موسیقی کلاسیک، جشن‌های سنتی و معماری بخارست.'
  },
  'laws-and-regulations': {
    title: 'قوانین و مقررات عمومی رومانی | در رومانی – DORVIA EUROP',
    desc: 'آشنایی با سیستم حقوقی رومانی، قوانین عمومی مدنی، حمایت از مصرف‌کننده و حقوق مالکیت معنوی.'
  },
  'tourism': {
    title: 'جاذبه‌های گردشگری رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای سفر به مناطق دیدنی رومانی، طبیعت کوه‌های کارپات، قلعه دراکولا و سواحل دریای سیاه.',
    noindex: true
  },
  'cities': {
    title: 'شهرهای اصلی کشور رومانی | در رومانی – DORVIA EUROP',
    desc: 'بررسی کامل شهرهای مهم جهت کار و تحصیل نظیر بخارست، کلوژ-نپوکا، تیمیشوارا، یاش و براشوف.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'شناخت رومانی | در رومانی – DORVIA EUROP',
    desc: 'اطلاعات عمومی و تخصصی درباره کشور رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    robots: meta.noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: `${SITE_URL}/romania/${params.slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: `${SITE_URL}/romania/${params.slug}`,
    }
  };
}

export default function RomaniaSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}