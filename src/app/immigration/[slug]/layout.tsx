import type { Metadata } from 'next';

const metaMap: Record<string, { title: string; desc: string }> = {
  'residence-renewal': {
    title: 'تمدید اجازه اقامت رومانی | در رومانی – DORVIA EUROP',
    desc: 'مراحل، مدارک و قوانین تمدید اجازه اقامت موقت (Permis de Ședere) برای دانشجویان، کارکنان و کارآفرینان در رومانی.'
  },
  'long-term-residence': {
    title: 'اقامت بلندمدت و دائم رومانی | در رومانی – DORVIA EUROP',
    desc: 'شرایط اخذ اقامت دائم رومانی، قانون ۵ سال حضور مستمر، تمکن مالی و اثبات آشنایی با زبان رومانیایی.'
  },
  'citizenship': {
    title: 'حقوق شهروندی و تابعیت رومانی | در رومانی – DORVIA EUROP',
    desc: 'راهنمای کامل دریافت پاسپورت و تابعیت رومانی از طریق اقامت طولانی‌مدت یا شرایط قانونی خاص.'
  },
  'family-reunification': {
    title: 'پیوند با خانواده در رومانی | در رومانی – DORVIA EUROP',
    desc: 'قوانین و مراحل الحاق به خانواده در رومانی ویژه همسر و فرزندان اتباع خارجی مقیم قانونی.'
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = metaMap[params.slug] || {
    title: 'مهاجرت به رومانی | در رومانی – DORVIA EUROP',
    desc: 'انواع روش‌های مهاجرت و اقامت قانونی در کشور رومانی.'
  };
  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: `https://dorvia.eu/immigration/${params.slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      url: `https://dorvia.eu/immigration/${params.slug}`,
    }
  };
}

export default function ImmigrationSubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}