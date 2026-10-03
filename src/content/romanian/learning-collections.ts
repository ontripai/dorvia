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
  { slug: 'cafe', fa: 'کافه و غذا', en: 'Cafés and food', introFa: 'سفارش ساده بدهید، نوع نوشیدنی را مشخص کنید و صورتحساب بخواهید.', introEn: 'Place a simple order, specify a drink, and ask for the bill.', lessons: [
    { href: '/learn-romanian/lectie/cafenea', fa: 'سفارش در کافه', en: 'Ordering in a café', detailFa: 'درخواست قهوه یا چای، واژهٔ «بدون» و درخواست صورتحساب', detailEn: 'Ask for coffee or tea, use “without”, and request the bill' },
  ] },
  { slug: 'appointments', fa: 'قرار ملاقات و پذیرش', en: 'Appointments and reception', introFa: 'در پذیرش درمانگاه وقت ملاقات بگیرید و روز و ساعت را مشخص کنید.', introEn: 'Ask for an appointment at a clinic desk and choose a day and time.', lessons: [
    { href: '/learn-romanian/lectie/programare', fa: 'گرفتن وقت ملاقات', en: 'Booking an appointment', detailFa: 'درخواست مؤدبانه، پرسیدن روز و اعلام ساعت', detailEn: 'Polite request, choosing a day and stating a time' },
  ] },
  { slug: 'pharmacy', fa: 'داروخانه', en: 'Pharmacy', introFa: 'از گفت‌وگوی عمومی شروع کنید؛ سپس هر نیاز را در یک درس جداگانه تمرین کنید.', introEn: 'Start with the general conversation, then practise each need in a focused lesson.', lessons: [
    { href: '/learn-romanian/lectie/farmacie', fa: 'گفت‌وگوی اصلی در داروخانه', en: 'General pharmacy conversation', detailFa: 'موجودی دارو، نسخه و درخواست توضیح', detailEn: 'Medicine availability, prescription, and asking for an explanation' },
    { href: '/learn-romanian/lectie/farmacie/durere-cap', fa: 'سردرد', en: 'Headache', detailFa: 'بیان درد، زمان شروع و پرسیدن گزینه‌ها', detailEn: 'Describe pain, when it started, and ask about options' },
    { href: '/learn-romanian/lectie/farmacie/arsura', fa: 'سوختگی', en: 'Burn', detailFa: 'بیان محل سوختگی و درخواست بررسی لوازم لازم', detailEn: 'Describe a burn and ask about appropriate supplies' },
    { href: '/learn-romanian/lectie/farmacie/vitamine', fa: 'ویتامین‌ها', en: 'Vitamins', detailFa: 'پرسیدن گزینه‌ها و خواندن برچسب', detailEn: 'Ask about options and read labels' },
    { href: '/learn-romanian/lectie/farmacie/igiena', fa: 'بهداشت و مراقبت', en: 'Hygiene and care', detailFa: 'شامپو، کرم دست و پرسیدن قیمت', detailEn: 'Shampoo, hand cream, and asking the price' },
  ] },
] as const;

export const UPCOMING_CONVERSATION_GROUPS = [
  { fa: 'کارهای بانکی', en: 'Banking', detailFa: 'پرسیدن دربارهٔ حساب و نوبت در شعبه', detailEn: 'Asking about an account and a turn at the branch' },
] as const;

export const STATION_ENGLISH: Record<string, string> = {
  salutari: 'Greetings and politeness', numere: 'Numbers', timp: 'Time',
  'cuvinte-interogative': 'Question words', pronume: 'Pronouns',
};
