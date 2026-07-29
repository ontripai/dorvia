import { faTranslations } from './translations/fa';
import { enTranslations } from './translations/en';
import { Language, Direction } from '../types';

export const defaultLanguage: Language = 'fa';

export const languages: { id: Language; label: string; dir: Direction; flag: string }[] = [
  { id: 'fa', label: 'فارسی (Persian)', dir: 'rtl', flag: '🇮🇷' },
  { id: 'en', label: 'English', dir: 'ltr', flag: '🇬🇧' }
];

export function getTranslations(lang: Language) {
  return lang === 'en' ? enTranslations : faTranslations;
}

export function getDirection(lang: Language): Direction {
  return lang === 'fa' ? 'rtl' : 'ltr';
}
