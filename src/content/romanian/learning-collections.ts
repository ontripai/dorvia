export const CONVERSATION_LESSONS = [
  { href: '/learn-romanian/lectie/bilet', fa: 'یک بلیت یا دو بلیت؟', en: 'One ticket or two?', detailFa: 'درخواست مؤدبانه و تعداد بلیت در باجه', detailEn: 'Polite requests and ticket quantities at the counter' },
  { href: '/learn-romanian/lectie/autobuz-tramvai', fa: 'اتوبوس و تراموا', en: 'Bus and tram', detailFa: 'پرسیدن دربارهٔ اعتبار بلیت در وسیلهٔ دیگر', detailEn: 'Ask whether a ticket works on another vehicle' },
  { href: '/learn-romanian/lectie/metrou', fa: 'متروی بخارست', en: 'Bucharest metro', detailFa: 'انتخاب ده سفر یا اشتراک ماهانه', detailEn: 'Choose ten journeys or a monthly pass' },
] as const;

export const CONVERSATION_GROUPS = [
  { slug: 'transport', fa: 'رفت‌وآمد و بلیت', en: 'Transport and tickets', introFa: 'از باجهٔ بلیت تا اتوبوس، تراموا و مترو؛ درس‌ها را به ترتیب بخوانید.', introEn: 'From the ticket counter to buses, trams and the metro. Follow the lessons in order.', lessons: CONVERSATION_LESSONS },
  { slug: 'shopping', fa: 'خرید روزمره', en: 'Everyday shopping', introFa: 'در فروشگاه کالا بخواهید، مقدار را تغییر دهید و قیمت را بپرسید.', introEn: 'Ask for an item, change the quantity and ask the price in a shop.', lessons: [
    { href: '/learn-romanian/lectie/magazin', fa: 'خرید آب در فروشگاه', en: 'Buying water in a shop', detailFa: 'درخواست مؤدبانه، یک و دو بطری، و پرسیدن قیمت', detailEn: 'Polite requests, one or two bottles, and asking the price' },
  ] },
  { slug: 'directions', fa: 'راه‌یابی در شهر', en: 'Finding your way', introFa: 'نشانی مکان‌ها را بپرسید و پاسخ کوتاه رهگذر را بفهمید.', introEn: 'Ask where places are and understand a short reply.', lessons: [
    { href: '/learn-romanian/lectie/directii', fa: 'ایستگاه مترو کجاست؟', en: 'Where is the metro station?', detailFa: 'نشانی مترو و داروخانه، راست و چپ، و فاصله', detailEn: 'Metro and pharmacy directions, left and right, and distance' },
  ] },
] as const;

export const UPCOMING_CONVERSATION_GROUPS = [
  { fa: 'کافه و غذا', en: 'Cafés and food', detailFa: 'سفارش و پرداخت', detailEn: 'Ordering and paying' },
  { fa: 'کارهای ضروری', en: 'Essential services', detailFa: 'داروخانه و قرار ملاقات', detailEn: 'Pharmacy and appointments' },
] as const;

export const STATION_ENGLISH: Record<string, string> = {
  salutari: 'Greetings and politeness', numere: 'Numbers', timp: 'Time',
  'cuvinte-interogative': 'Question words', pronume: 'Pronouns',
};
