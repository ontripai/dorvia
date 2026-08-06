import { Metadata } from 'next';
import { PAGE_META } from '@/lib/pageMeta';
import { LegalContentWrapper } from './LegalContentWrapper';
import { SITE_URL } from '@/config';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = PAGE_META[`legal/${params.slug}`] || PAGE_META['legal'];
  
  const titleMap: Record<string, string> = {
    privacy: 'سیاست حفظ حریم خصوصی | DORVIA EUROP',
    terms: 'شرایط و قوانین استفاده | DORVIA EUROP',
    disclaimer: 'سلب مسئولیت | DORVIA EUROP'
  };

  const descMap: Record<string, string> = {
    privacy: 'اطلاعات مربوط به نحوه جمع‌آوری، پردازش و نگهداری اطلاعات شما توسط DORVIA EUROP.',
    terms: 'قوانین و شرایط استفاده از خدمات و پلتفرم در رومانی (DORVIA EUROP).',
    disclaimer: 'سلب مسئولیت حقوقی در خصوص تضمین نتایج مهاجرتی، تحصیلی و حقوقی.'
  };

  const title = titleMap[params.slug] || meta?.titleFa || 'Legal';
  const description = descMap[params.slug] || 'Legal documentation for DORVIA EUROP.';

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/legal/${params.slug}`
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/legal/${params.slug}`
    }
  };
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  return <LegalContentWrapper slug={params.slug} />;
}
