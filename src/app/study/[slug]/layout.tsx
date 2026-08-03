import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string }> = {
  'preparatory-year': {
    title: 'دوره سال زبان رومانیایی | در رومانی – DORVIA EUROP',
    desc: 'شرایط ثبت‌نام، شهریه و اطلاعات دوره آمادگی زبان رومانیایی (Preparatory Year) پیش از ورود به دانشگاه.'
  },
  'scholarships': {
    title: 'بورسیه تحصیلی دولت رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای ثبت‌نام در برنامه بورسیه وزارت امور خارجه رومانی ویژه دانشجویان کشورهای غیر عضو اتحادیه اروپا.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'تحصیل در رومانی | در رومانی – DORVIA EUROP',
    desc: 'شرایط تحصیل و اخذ پذیرش دانشگاهی در رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: `https://dorvia.eu/study/${params.slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: `https://dorvia.eu/study/${params.slug}`,
    }
  };
}

export default function StudySubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}