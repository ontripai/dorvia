import { getLocalizedMetadata } from '@/lib/metadata';
import { Language } from '@/types';
import { SITE_URL } from '@/config';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  return getLocalizedMetadata('company/investment', params.lang as Language);
}


export default function CompanyInvestmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}