export const CONVERSATION_LESSONS = [
  { href: '/learn-romanian/lectie/bilet', fa: 'یک بلیت یا دو بلیت؟', en: 'One ticket or two?', detailFa: 'درخواست مؤدبانه و تعداد بلیت در باجه', detailEn: 'Polite requests and ticket quantities at the counter' },
  { href: '/learn-romanian/lectie/autobuz-tramvai', fa: 'اتوبوس و تراموا', en: 'Bus and tram', detailFa: 'پرسیدن دربارهٔ اعتبار بلیت در وسیلهٔ دیگر', detailEn: 'Ask whether a ticket works on another vehicle' },
  { href: '/learn-romanian/lectie/metrou', fa: 'متروی بخارست', en: 'Bucharest metro', detailFa: 'انتخاب ده سفر یا اشتراک ماهانه', detailEn: 'Choose ten journeys or a monthly pass' },
] as const;

export const STATION_ENGLISH: Record<string, string> = {
  salutari: 'Greetings and politeness', numere: 'Numbers', timp: 'Time',
  'cuvinte-interogative': 'Question words', pronume: 'Pronouns',
};
