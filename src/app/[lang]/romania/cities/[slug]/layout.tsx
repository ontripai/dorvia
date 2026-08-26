import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string }> = {
  'bucharest': {
    title: 'راهنمای زندگی و تحصیل در بخارست | DORVIA EUROP',
    desc: 'هزینه مسکن، حمل‌ونقل عمومی، دانشگاه‌ها و محله‌های پیشنهادی بخارست، پایتخت رومانی.'
  },
  'cluj-napoca': {
    title: 'راهنمای زندگی و تحصیل در کلوژ-نپوکا | DORVIA EUROP',
    desc: 'هزینه مسکن، حمل‌ونقل عمومی، دانشگاه‌ها و محله‌های پیشنهادی کلوژ-نپوکا، قطب فناوری رومانی.'
  },
  'timisoara': {
    title: 'راهنمای زندگی و تحصیل در تیمیشوارا | DORVIA EUROP',
    desc: 'هزینه مسکن، حمل‌ونقل عمومی، دانشگاه‌ها و محله‌های پیشنهادی تیمیشوارا در غرب رومانی.'
  },
  'iasi': {
    title: 'راهنمای زندگی و تحصیل در یاش | DORVIA EUROP',
    desc: 'هزینه مسکن، حمل‌ونقل عمومی، دانشگاه‌ها و محله‌های پیشنهادی یاش، مرکز تاریخی و دانشگاهی رومانی.'
  },
  'brasov': {
    title: 'راهنمای زندگی و تحصیل در براشوف | DORVIA EUROP',
    desc: 'هزینه مسکن، حمل‌ونقل عمومی، دانشگاه‌ها و محله‌های پیشنهادی براشوف، دروازه کوهستان کارپات.'
  },
  'constanta': {
    title: 'راهنمای زندگی و تحصیل در کونستانتسا | DORVIA EUROP',
    desc: 'هزینه مسکن، حمل‌ونقل عمومی، دانشگاه‌ها و محله‌های پیشنهادی کونستانتسا، شهر ساحلی دریای سیاه.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'راهنمای شهرهای رومانی | DORVIA EUROP',
    desc: 'راهنمای زندگی، تحصیل و کار در شهرهای مختلف رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: `${SITE_URL}/romania/cities/${params.slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: `${SITE_URL}/romania/cities/${params.slug}`,
    }
  };
}

export default function CityDetailSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
