import { getLocalizedMetadata } from '@/lib/metadata';
import { Language } from '@/types';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const locale: Language = 'fa';
  return getLocalizedMetadata('evaluation', locale);
}


export default function EvaluationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
