import { redirect } from 'next/navigation';
import { Language } from '@/types';

export default function AdminRootPage({ params }: { params: { lang: Language } }) {
  const lang = params.lang || 'fa';
  redirect(`/${lang}/admin/leads`);
}
