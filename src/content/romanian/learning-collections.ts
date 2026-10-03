export const CONVERSATION_LESSONS = [
  { href: '/learn-romanian/lectie/bilet', fa: 'یک بلیت یا دو بلیت؟', en: 'One ticket or two?', detailFa: 'درخواست مؤدبانه و تعداد بلیت در باجه', detailEn: 'Polite requests and ticket quantities at the counter' },
  { href: '/learn-romanian/lectie/transport/automat', fa: 'دستگاه بلیت و پرداخت', en: 'Ticket machine and payment', detailFa: 'انتخاب نوع سفر، قیمت، پرداخت و دریافت بلیت', detailEn: 'Journey type, price, payment and ticket collection' },
  { href: '/learn-romanian/lectie/autobuz-tramvai', fa: 'اتوبوس و تراموا', en: 'Bus and tram', detailFa: 'پرسیدن دربارهٔ اعتبار بلیت در وسیلهٔ دیگر', detailEn: 'Ask whether a ticket works on another vehicle' },
  { href: '/learn-romanian/lectie/metrou', fa: 'متروی بخارست', en: 'Bucharest metro', detailFa: 'انتخاب ده سفر یا اشتراک ماهانه', detailEn: 'Choose ten journeys or a monthly pass' },
  { href: '/learn-romanian/lectie/transport/traseu', fa: 'خط و جهت حرکت', en: 'Route and direction of travel', detailFa: 'شمارهٔ خط، جهت، تعداد ایستگاه و پیاده‌شدن', detailEn: 'Line number, direction, stops and getting off' },
  { href: '/learn-romanian/lectie/transport/legatura', fa: 'تعویض وسیله و از دست دادن ایستگاه', en: 'Transfer and missed stop', detailFa: 'رد شدن از ایستگاه، برگشت و بررسی اعتبار بلیت', detailEn: 'Missed stop, return route and ticket validity' },
] as const;

export const CONVERSATION_GROUPS = [
  { slug: 'transport', fa: 'رفت‌وآمد و بلیت', en: 'Transport and tickets', introFa: 'از باجهٔ بلیت تا اتوبوس، تراموا و مترو؛ درس‌ها را به ترتیب بخوانید.', introEn: 'From the ticket counter to buses, trams and the metro. Follow the lessons in order.', lessons: CONVERSATION_LESSONS },
  { slug: 'shopping', fa: 'خرید روزمره', en: 'Everyday shopping', introFa: 'در فروشگاه کالا بخواهید، مقدار را تغییر دهید و قیمت را بپرسید.', introEn: 'Ask for an item, change the quantity and ask the price in a shop.', lessons: [
    { href: '/learn-romanian/lectie/magazin', fa: 'خرید آب در فروشگاه', en: 'Buying water in a shop', detailFa: 'درخواست مؤدبانه، یک و دو بطری، و پرسیدن قیمت', detailEn: 'Polite requests, one or two bottles, and asking the price' },
    { href: '/learn-romanian/lectie/magazin/brutarie', fa: 'خرید از نانوایی', en: 'At the bakery', detailFa: 'نان تازه، تعداد و پرسیدن قیمت', detailEn: 'Fresh bread, quantity, and the price' },
    { href: '/learn-romanian/lectie/magazin/fructe', fa: 'میوه و مقدار', en: 'Fruit and quantity', detailFa: 'یک کیلو، نیم کیلو و درخواست کیسه', detailEn: 'One kilo, half a kilo, and a bag' },
    { href: '/learn-romanian/lectie/magazin/marime', fa: 'اندازه و رنگ در فروشگاه', en: 'Size and colour in a shop', detailFa: 'اندازهٔ لباس، رنگ و اتاق پرو', detailEn: 'Clothing size, colour, and the fitting room' },
    { href: '/learn-romanian/lectie/magazin/stoc', fa: 'کالای ناموجود و جایگزین', en: 'Out of stock and alternatives', detailFa: 'جست‌وجوی کالا، موجودی، جایگزین و قیمت', detailEn: 'Find an item, check stock, an alternative and its price' },
    { href: '/learn-romanian/lectie/magazin/casa', fa: 'صندوق، پرداخت و رسید', en: 'Checkout, payment and receipt', detailFa: 'مبلغ نهایی، کارت، کیسه و رسید', detailEn: 'Total, card payment, bag and receipt' },
    { href: '/learn-romanian/lectie/magazin/retur', fa: 'بازگرداندن کالا', en: 'Returning an item', detailFa: 'توضیح مشکل، رسید و پرسیدن امکان تعویض', detailEn: 'Explain an issue, show a receipt and ask about an exchange' },
  ] },
  { slug: 'directions', fa: 'راه‌یابی در شهر', en: 'Finding your way', introFa: 'نشانی مکان‌ها را بپرسید و پاسخ کوتاه رهگذر را بفهمید.', introEn: 'Ask where places are and understand a short reply.', lessons: [
    { href: '/learn-romanian/lectie/directii', fa: 'ایستگاه مترو کجاست؟', en: 'Where is the metro station?', detailFa: 'نشانی مترو و داروخانه، راست و چپ، و فاصله', detailEn: 'Metro and pharmacy directions, left and right, and distance' },
    { href: '/learn-romanian/lectie/directii/adresa', fa: 'خیابان و شمارهٔ ساختمان', en: 'Street and building number', detailFa: 'نام خیابان، شماره و نشانهٔ مکانی', detailEn: 'Street name, number, and landmark' },
    { href: '/learn-romanian/lectie/directii/punct-reper', fa: 'نشانهٔ مکانی و ورودی ساختمان', en: 'Landmark and building entrance', detailFa: 'پیدا کردن پلاک و ورودی اصلی ساختمان', detailEn: 'Find the building number and main entrance' },
    { href: '/learn-romanian/lectie/directii/statie', fa: 'پیدا کردن ایستگاه اتوبوس', en: 'Finding the bus stop', detailFa: 'نزدیک‌ترین ایستگاه و دو گام مسیر', detailEn: 'Nearest stop and two walking directions' },
    { href: '/learn-romanian/lectie/directii/drum-inchis', fa: 'راه بسته و مسیر جایگزین', en: 'Closed road and alternative route', detailFa: 'پرسیدن راه پیاده و تأیید گام‌های جایگزین', detailEn: 'Ask for a walking route and confirm an alternative' },
    { href: '/learn-romanian/lectie/directii/repetati', fa: 'تکرار و روشن‌کردن مسیر', en: 'Repeating and clarifying directions', detailFa: 'درخواست تکرار آهسته و تأیید جهت', detailEn: 'Ask for a slow repeat and confirm a turn' },
  ] },
  { slug: 'cafe', fa: 'کافه و غذا', en: 'Cafés and food', introFa: 'سفارش ساده بدهید، نوع نوشیدنی را مشخص کنید و صورتحساب بخواهید.', introEn: 'Place a simple order, specify a drink, and ask for the bill.', lessons: [
    { href: '/learn-romanian/lectie/cafenea', fa: 'سفارش در کافه', en: 'Ordering in a café', detailFa: 'درخواست قهوه یا چای، واژهٔ «بدون» و درخواست صورتحساب', detailEn: 'Ask for coffee or tea, use “without”, and request the bill' },
    { href: '/learn-romanian/lectie/cafenea/mic-dejun', fa: 'صبحانه در کافه', en: 'Breakfast at a café', detailFa: 'چای، کروسان و آب بدون گاز در گفت‌وگوی صبحانه', detailEn: 'Tea, a croissant, and still water in a breakfast conversation' },
    { href: '/learn-romanian/lectie/cafenea/masa', fa: 'میز، منو و سفارش در سالن', en: 'A table, the menu and dining in', detailFa: 'میز برای دو نفر، منو، نوشیدنی و غذا', detailEn: 'Table for two, menu, drinks and food' },
    { href: '/learn-romanian/lectie/cafenea/ingrediente', fa: 'مواد غذا و حساسیت', en: 'Ingredients and an allergy', detailFa: 'پرسیدن مواد، بیان حساسیت و درخواست بررسی', detailEn: 'Ask about ingredients, state an allergy and request a check' },
    { href: '/learn-romanian/lectie/cafenea/schimbare-comanda', fa: 'تغییر در سفارش', en: 'Changing an order', detailFa: 'با و بدون شیر یا شکر؛ اصلاح مؤدبانهٔ سفارش', detailEn: 'With or without milk and sugar; politely correct an order' },
    { href: '/learn-romanian/lectie/cafenea/plata', fa: 'صورتحساب و پرداخت', en: 'Bill and payment', detailFa: 'صورتحساب، پرداخت با کارت و درخواست رسید', detailEn: 'The bill, paying by card, and requesting a receipt' },
    { href: '/learn-romanian/lectie/cafenea/la-pachet', fa: 'سفارش بیرون‌بر', en: 'Ordering takeaway', detailFa: 'سفارش، زمان آماده‌شدن و بررسی هنگام تحویل', detailEn: 'Order, pickup time and checking the item' },
  ] },
  { slug: 'appointments', fa: 'قرار ملاقات و پذیرش', en: 'Appointments and reception', introFa: 'از تماس اولیه تا تغییر یا لغو وقت، ورود به پذیرش و پرسیدن مدارک؛ هر موقعیت را در درس جدا تمرین کنید.', introEn: 'From the first call to rescheduling, cancelling, checking in, and asking about documents, practise each situation separately.', lessons: [
    { href: '/learn-romanian/lectie/programare', fa: 'گرفتن وقت ملاقات', en: 'Booking an appointment', detailFa: 'درخواست مؤدبانه، پرسیدن روز و اعلام ساعت', detailEn: 'Polite request, choosing a day and stating a time' },
    { href: '/learn-romanian/lectie/programare/telefon', fa: 'گرفتن وقت تلفنی', en: 'Booking by phone', detailFa: 'اولین مراجعه، نام، روز و ساعت در یک تماس کامل', detailEn: 'First visit, name, day and time in a full call' },
    { href: '/learn-romanian/lectie/programare/schimbare', fa: 'جابه‌جایی وقت', en: 'Rescheduling', detailFa: 'وقت قبلی، روز جایگزین و تأیید نهایی', detailEn: 'Old slot, new day and final confirmation' },
    { href: '/learn-romanian/lectie/programare/anulare', fa: 'لغو وقت', en: 'Cancelling', detailFa: 'شناسایی وقت و دریافت تأیید لغو', detailEn: 'Identify a booking and confirm cancellation' },
    { href: '/learn-romanian/lectie/programare/receptie', fa: 'ورود به پذیرش', en: 'Checking in', detailFa: 'معرفی نام و وقت و پیدا کردن اتاق انتظار', detailEn: 'Give name and time, find the waiting room' },
    { href: '/learn-romanian/lectie/programare/documente', fa: 'مدارک در پذیرش', en: 'Documents at reception', detailFa: 'پرسیدن مدارک، نشان دادن تأییدیه و بررسی کمبود', detailEn: 'Ask for requirements, show confirmation, check missing items' },
  ] },
  { slug: 'pharmacy', fa: 'داروخانه', en: 'Pharmacy', introFa: 'از گفت‌وگوی عمومی شروع کنید؛ سپس هر نیاز را در یک درس جداگانه تمرین کنید.', introEn: 'Start with the general conversation, then practise each need in a focused lesson.', lessons: [
    { href: '/learn-romanian/lectie/farmacie', fa: 'گفت‌وگوی اصلی در داروخانه', en: 'General pharmacy conversation', detailFa: 'موجودی دارو، نسخه و درخواست توضیح', detailEn: 'Medicine availability, prescription, and asking for an explanation' },
    { href: '/learn-romanian/lectie/farmacie/reteta', fa: 'نسخه، موجودی و توضیح داروساز', en: 'Prescription, stock and pharmacist explanation', detailFa: 'نشان دادن نسخه، بررسی موجودی و خواندن برچسب', detailEn: 'Show a prescription, check stock and clarify the label' },
    { href: '/learn-romanian/lectie/farmacie/durere-cap', fa: 'سردرد', en: 'Headache', detailFa: 'بیان درد، زمان شروع و پرسیدن گزینه‌ها', detailEn: 'Describe pain, when it started, and ask about options' },
    { href: '/learn-romanian/lectie/farmacie/raceala', fa: 'علائم سرماخوردگی و راهنمایی', en: 'Cold symptoms and advice', detailFa: 'بیان علائم، زمان شروع و پرسیدن زمان مراجعه به پزشک', detailEn: 'Symptoms, duration and when to see a doctor' },
    { href: '/learn-romanian/lectie/farmacie/arsura', fa: 'سوختگی', en: 'Burn', detailFa: 'بیان محل سوختگی و درخواست بررسی لوازم لازم', detailEn: 'Describe a burn and ask about appropriate supplies' },
    { href: '/learn-romanian/lectie/farmacie/vitamine', fa: 'ویتامین‌ها', en: 'Vitamins', detailFa: 'پرسیدن گزینه‌ها و خواندن برچسب', detailEn: 'Ask about options and read labels' },
    { href: '/learn-romanian/lectie/farmacie/igiena', fa: 'بهداشت و مراقبت', en: 'Hygiene and care', detailFa: 'شامپو، کرم دست و پرسیدن قیمت', detailEn: 'Shampoo, hand cream, and asking the price' },
  ] },
  { slug: 'banking', fa: 'کارهای بانکی', en: 'Banking', introFa: 'از گرفتن نوبت شعبه تا پرسیدن شرایط حساب، مشکل کارت و تأیید انتقال؛ هر موقعیت را جدا تمرین کنید.', introEn: 'From a branch queue to account terms, a card issue and transfer confirmation, practise each situation separately.', lessons: [
    { href: '/learn-romanian/lectie/banca/sucursala', fa: 'نوبت و راهنمایی در شعبه', en: 'Queue and help at the branch', detailFa: 'گفتن نوع کار، دستگاه نوبت و باجه', detailEn: 'Purpose, queue machine and service desk' },
    { href: '/learn-romanian/lectie/banca/cont', fa: 'پرسش دربارهٔ حساب بانکی', en: 'Asking about a bank account', detailFa: 'مدارک، کارمزد و شرایط مکتوب', detailEn: 'Documents, fees and written terms' },
    { href: '/learn-romanian/lectie/banca/card', fa: 'کارت و مشکل خودپرداز', en: 'Card and ATM issue', detailFa: 'توضیح خطا و راه رسمی مسدود کردن کارت', detailEn: 'Describe an error and ask about official card blocking' },
    { href: '/learn-romanian/lectie/banca/transfer', fa: 'انتقال وجه و رسید', en: 'Transfer and receipt', detailFa: 'گیرنده، مبلغ، کارمزد و تأییدیه', detailEn: 'Recipient, total, fee and confirmation' },
  ] },
] as const;

export const CONVERSATION_SECTIONS: Record<string, { fa: string; en: string; detailFa: string; detailEn: string; lessonIndexes: number[] }[]> = {
  transport: [
    { fa: 'خرید بلیت', en: 'Buying tickets', detailFa: 'تعداد، نوع و اعتبار بلیت را از باجه و دستگاه بپرسید.', detailEn: 'Ask about quantity, type and validity at a counter or machine.', lessonIndexes: [0, 1] },
    { fa: 'استفاده از وسیلهٔ نقلیه', en: 'Using transport', detailFa: 'اتوبوس، تراموا و مترو را در موقعیت واقعی تمرین کنید.', detailEn: 'Practise buses, trams, and metro in context.', lessonIndexes: [2, 3] },
    { fa: 'در طول مسیر', en: 'During the journey', detailFa: 'خط و جهت را تأیید کنید و بعد از رد شدن از ایستگاه راه برگشت را بپرسید.', detailEn: 'Confirm route and direction, then ask how to return after a missed stop.', lessonIndexes: [4, 5] },
  ],
  shopping: [
    { fa: 'مواد غذایی و مقدار', en: 'Food and quantity', detailFa: 'کالا، تعداد، وزن و قیمت را مشخص کنید.', detailEn: 'Specify the item, count, weight, and price.', lessonIndexes: [0, 1, 2] },
    { fa: 'پوشاک', en: 'Clothing', detailFa: 'اندازه و رنگ را بپرسید و لباس را امتحان کنید.', detailEn: 'Ask about size and colour and try on an item.', lessonIndexes: [3] },
    { fa: 'موجودی و جایگزین', en: 'Stock and alternatives', detailFa: 'کالای ناموجود را پیگیری و گزینهٔ دیگری انتخاب کنید.', detailEn: 'Ask about an unavailable item and choose another option.', lessonIndexes: [4] },
    { fa: 'صندوق و خدمات پس از خرید', en: 'Checkout and after purchase', detailFa: 'پرداخت، رسید و درخواست تعویض را تمرین کنید.', detailEn: 'Practise payment, receipts and asking for an exchange.', lessonIndexes: [5, 6] },
  ],
  directions: [
    { fa: 'آدرس و نشانه‌ها', en: 'Addresses and landmarks', detailFa: 'مکان، خیابان، شماره، پلاک و ورودی را پیدا کنید.', detailEn: 'Find a place, street, number, plaque and entrance.', lessonIndexes: [0, 1, 2] },
    { fa: 'ایستگاه و مسیر جایگزین', en: 'Stops and alternative routes', detailFa: 'دستورهای پیاده‌روی را دنبال کنید و هنگام بسته بودن راه مسیر دیگری بپرسید.', detailEn: 'Follow walking steps and ask for an alternative when a street is closed.', lessonIndexes: [3, 4] },
    { fa: 'رفع ابهام', en: 'Clarifying directions', detailFa: 'تکرار آهسته بخواهید و یک گام را تأیید کنید.', detailEn: 'Ask for a slow repeat and confirm a step.', lessonIndexes: [5] },
  ],
  cafe: [
    { fa: 'نشستن و سفارش', en: 'Dining in and ordering', detailFa: 'گفت‌وگوی اصلی، صبحانه و درخواست میز و منو را تمرین کنید.', detailEn: 'Practise the basic exchange, breakfast, tables and menus.', lessonIndexes: [0, 1, 2] },
    { fa: 'مواد و نیازهای غذایی', en: 'Ingredients and dietary needs', detailFa: 'مواد غذا و حساسیت را روشن بگویید و بررسی بخواهید.', detailEn: 'Clarify ingredients and allergies and ask for a check.', lessonIndexes: [3] },
    { fa: 'تغییر و پرداخت', en: 'Changes and payment', detailFa: 'سفارش را اصلاح کنید و صورتحساب و رسید بخواهید.', detailEn: 'Correct an order and request the bill and receipt.', lessonIndexes: [4, 5] },
    { fa: 'بیرون‌بر', en: 'Takeaway', detailFa: 'سفارش بیرون‌بر، زمان تحویل و تأیید جزئیات.', detailEn: 'Order takeaway, ask about pickup and check details.', lessonIndexes: [6] },
  ],
  appointments: [
    { fa: 'گرفتن وقت', en: 'Booking', detailFa: 'درخواست حضوری و گفت‌وگوی کامل تلفنی.', detailEn: 'An in-person request and a full phone call.', lessonIndexes: [0, 1] },
    { fa: 'مدیریت وقت', en: 'Managing a booking', detailFa: 'وقت را جابه‌جا یا لغو کنید و نتیجه را تأیید کنید.', detailEn: 'Reschedule or cancel, then confirm the result.', lessonIndexes: [2, 3] },
    { fa: 'روز مراجعه', en: 'On the day', detailFa: 'در پذیرش نام و وقت را بگویید و مدارک لازم را بپرسید.', detailEn: 'Check in and ask about required documents.', lessonIndexes: [4, 5] },
  ],
  pharmacy: [
    { fa: 'نسخه و موجودی', en: 'Prescription and stock', detailFa: 'از گفت‌وگوی عمومی به نسخه، موجودی و توضیح برچسب بروید.', detailEn: 'Move from the general exchange to prescriptions, stock and labels.', lessonIndexes: [0, 1] },
    { fa: 'توضیح علائم', en: 'Describing symptoms', detailFa: 'سردرد، سرماخوردگی و سوختگی را دقیق بیان کنید و از متخصص راهنمایی بخواهید.', detailEn: 'Describe headache, cold symptoms and a burn; ask a professional for guidance.', lessonIndexes: [2, 3, 4] },
    { fa: 'محصول و مراقبت', en: 'Products and care', detailFa: 'دربارهٔ ویتامین‌ها و محصولات بهداشتی پرسش کنید.', detailEn: 'Ask about vitamins and hygiene products.', lessonIndexes: [5, 6] },
  ],
  banking: [
    { fa: 'ورود به شعبه', en: 'At the branch', detailFa: 'نوبت بگیرید و دربارهٔ مدارک و شرایط حساب پرسش کنید.', detailEn: 'Take a number and ask about account documents and terms.', lessonIndexes: [0, 1] },
    { fa: 'کارت و انتقال', en: 'Card and transfer', detailFa: 'مشکل کارت و جزئیات انتقال را با کارمند بانک روشن کنید.', detailEn: 'Clarify a card issue and transfer details with the bank.', lessonIndexes: [2, 3] },
  ],
};

export const UPCOMING_CONVERSATION_GROUPS = [
  { fa: 'مسکن و اجاره', en: 'Housing and renting', detailFa: 'بازدید، قرارداد و مشکلات خانه', detailEn: 'Viewing, contract and home issues' },
  { fa: 'کار و محیط کار', en: 'Workplace', detailFa: 'معرفی، برنامهٔ کار و درخواست کمک', detailEn: 'Introductions, schedule and asking for help' },
] as const;

export const STATION_ENGLISH: Record<string, string> = {
  salutari: 'Greetings and politeness', numere: 'Numbers', timp: 'Time',
  'cuvinte-interogative': 'Question words', pronume: 'Pronouns',
};
