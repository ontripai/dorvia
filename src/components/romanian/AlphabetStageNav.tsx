'use client';
import { LessonStageNav } from './LessonStageNav';

export const alphabetStages = {
  fa: ['شنیدن', 'نمونه و قاعده', 'نوشتن', 'گفتن', 'نتیجه'],
  en: ['Listen', 'Example and rule', 'Write', 'Speak', 'Result'],
} as const;

export function AlphabetStageNav({ lang, stage, onSelect }: { lang: 'fa' | 'en'; stage: number; onSelect: (stage: number) => void }) {
  return <LessonStageNav lang={lang} labels={alphabetStages[lang]} stage={stage} onSelect={onSelect} />;
}
