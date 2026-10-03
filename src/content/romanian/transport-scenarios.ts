import type { EverydayScenario } from '@/components/romanian/EverydayScenarioLesson';

export const transportScenarios: EverydayScenario[] = [
  {
    slug: 'automat', title: { fa: 'دستگاه بلیت و پرداخت', en: 'Ticket machine and payment' },
    goal: { fa: 'در دستگاه بلیت نوع سفر را انتخاب کنید، روش پرداخت را بپرسید و رسید را بررسی کنید.', en: 'Choose a ticket at a machine, ask about payment, and check the receipt.' },
    dialogue: [
      { who: 'you', ro: 'Scuzați-mă, pot cumpăra un bilet de la acest automat?', en: 'Excuse me, can I buy a ticket from this machine?', fa: 'ببخشید، می‌توانم از این دستگاه بلیت بخرم؟' },
      { who: 'other', ro: 'Da. Alegeți mai întâi tipul de călătorie.', en: 'Yes. First choose the type of journey.', fa: 'بله. اول نوع سفر را انتخاب کنید.' },
      { who: 'you', ro: 'Vreau o singură călătorie. Unde apăs?', en: 'I want a single journey. Where do I press?', fa: 'یک سفر می‌خواهم. کجا را بزنم؟' },
      { who: 'other', ro: 'Apăsați aici, apoi verificați prețul pe ecran.', en: 'Press here, then check the price on the screen.', fa: 'اینجا را بزنید، سپس قیمت را روی صفحه بررسی کنید.' },
      { who: 'you', ro: 'Pot plăti cu cardul?', en: 'Can I pay by card?', fa: 'می‌توانم با کارت پرداخت کنم؟' },
      { who: 'other', ro: 'Uitați-vă la opțiunile de plată afișate.', en: 'Look at the payment options shown.', fa: 'گزینه‌های پرداخت نمایش‌داده‌شده را نگاه کنید.' },
      { who: 'you', ro: 'Am plătit. De unde iau biletul?', en: 'I have paid. Where do I take the ticket from?', fa: 'پرداخت کردم. بلیت را از کجا بردارم؟' },
      { who: 'other', ro: 'Este în fanta de jos. Păstrați și bonul.', en: 'It is in the slot below. Keep the receipt too.', fa: 'در شکاف پایین است. رسید را هم نگه دارید.' },
      { who: 'you', ro: 'Mulțumesc. Verific acum biletul și bonul.', en: 'Thank you. I will check the ticket and receipt now.', fa: 'ممنون. اکنون بلیت و رسید را بررسی می‌کنم.' },
    ],
    rules: [
      { title: { fa: 'درخواست راهنمایی برای دستگاه', en: 'Ask for machine help' }, explanation: { fa: 'Pot cumpăra ...? یعنی «می‌توانم ... بخرم؟». de la acest automat محل خرید را مشخص می‌کند. برای کار با دستگاه، نوع بلیت و قیمت را روی صفحه بررسی کنید.', en: 'Pot cumpăra ...? asks whether you can buy something. De la acest automat specifies the machine; check the ticket type and price on its screen.' }, examples: [{ ro: 'Pot cumpăra un bilet de la acest automat?', en: 'Can I buy a ticket from this machine?', fa: 'می‌توانم از این دستگاه بلیت بخرم؟' }] },
      { title: { fa: 'دستورهای روی صفحه', en: 'Screen instructions' }, explanation: { fa: 'apăsați صورت مؤدبانهٔ «بزنید» است. mai întâi یعنی «اول» و apoi یعنی «بعد». این دو واژه ترتیب مراحل را روشن می‌کنند.', en: 'Apăsați is the polite “press”. Mai întâi means “first” and apoi means “then”; they show the sequence.' }, examples: [{ ro: 'Apăsați aici, apoi verificați prețul pe ecran.', en: 'Press here, then check the price on the screen.', fa: 'اینجا را بزنید، سپس قیمت را روی صفحه بررسی کنید.' }] },
      { title: { fa: 'بلیت و رسید', en: 'Ticket and receipt' }, explanation: { fa: 'biletul بلیت و bonul رسید پرداخت است. De unde iau ...? می‌پرسد چیزی را از کجا بردارید. پس از پرداخت، هر دو را بررسی کنید.', en: 'Biletul is the ticket; bonul is the receipt. De unde iau ...? asks where to collect something. Check both after payment.' }, examples: [{ ro: 'De unde iau biletul?', en: 'Where do I take the ticket from?', fa: 'بلیت را از کجا بردارم؟' }] },
    ],
    tasks: [
      { ro: 'Pot cumpăra un bilet de la acest automat?', en: 'Ask whether the machine sells tickets.', fa: 'بپرسید دستگاه بلیت می‌فروشد؟', hint: 'Pot cumpăra ...?' },
      { ro: 'Vreau o singură călătorie. Unde apăs?', en: 'Choose one journey and ask where to press.', fa: 'یک سفر انتخاب کنید و جای دکمه را بپرسید.', hint: 'Vreau o singură ...' },
      { ro: 'Pot plăti cu cardul?', en: 'Ask about paying by card.', fa: 'پرداخت با کارت را بپرسید.', hint: 'Pot plăti ...?' },
      { ro: 'Am plătit. De unde iau biletul?', en: 'Say you paid and ask where the ticket is.', fa: 'بگویید پرداخت کردید و محل بلیت را بپرسید.', hint: 'Am plătit. De unde ...?' },
    ],
  },
  {
    slug: 'traseu', title: { fa: 'خط و جهت حرکت', en: 'Route and direction of travel' },
    goal: { fa: 'شمارهٔ خط، جهت درست و ایستگاه پیاده‌شدن را پیش از حرکت تأیید کنید.', en: 'Confirm the line, direction, and stop before travelling.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua. Acest autobuz merge spre centru?', en: 'Hello. Does this bus go towards the centre?', fa: 'سلام. این اتوبوس به سمت مرکز می‌رود؟' },
      { who: 'other', ro: 'Da, dar verificați numărul liniei.', en: 'Yes, but check the line number.', fa: 'بله، ولی شمارهٔ خط را بررسی کنید.' },
      { who: 'you', ro: 'Este linia potrivită pentru Piața Unirii?', en: 'Is this the right line for Piața Unirii?', fa: 'این خط برای پیاتسا اونیری مناسب است؟' },
      { who: 'other', ro: 'Da, merge în acea direcție.', en: 'Yes, it goes in that direction.', fa: 'بله، در آن جهت می‌رود.' },
      { who: 'you', ro: 'Câte stații sunt până acolo?', en: 'How many stops are there until then?', fa: 'تا آنجا چند ایستگاه است؟' },
      { who: 'other', ro: 'Sunt câteva stații. Urmăriți numele pe ecran.', en: 'There are a few stops. Follow the names on the screen.', fa: 'چند ایستگاه است. نام‌ها را روی صفحه دنبال کنید.' },
      { who: 'you', ro: 'Trebuie să schimb autobuzul?', en: 'Do I need to change buses?', fa: 'باید اتوبوس را عوض کنم؟' },
      { who: 'other', ro: 'Nu pentru această destinație. Coborâți la Piața Unirii.', en: 'Not for this destination. Get off at Piața Unirii.', fa: 'برای این مقصد نه. در پیاتسا اونیری پیاده شوید.' },
      { who: 'you', ro: 'Am înțeles. Verific și afișajul. Mulțumesc!', en: 'I understand. I will check the display too. Thank you!', fa: 'متوجه شدم. نمایشگر را هم بررسی می‌کنم. ممنون!' },
    ],
    rules: [
      { title: { fa: 'مقصد و جهت', en: 'Destination and direction' }, explanation: { fa: 'merge spre ... یعنی «به سمت ... می‌رود». پیش از سوارشدن، شمارهٔ خط و جهت آن را جداگانه تأیید کنید.', en: 'Merge spre ... means “goes towards ...”. Confirm both the route number and direction before boarding.' }, examples: [{ ro: 'Acest autobuz merge spre centru?', en: 'Does this bus go towards the centre?', fa: 'این اتوبوس به سمت مرکز می‌رود؟' }] },
      { title: { fa: 'چند ایستگاه مانده؟', en: 'How many stops?' }, explanation: { fa: 'Câte stații ...? با اسم جمع مؤنث stații برای پرسیدن تعداد ایستگاه‌ها به کار می‌رود. până acolo یعنی «تا آنجا».', en: 'Câte stații ...? asks for the number of stops using feminine plural stații. Până acolo means “until there”.' }, examples: [{ ro: 'Câte stații sunt până acolo?', en: 'How many stops are there until then?', fa: 'تا آنجا چند ایستگاه است؟' }] },
      { title: { fa: 'تعویض و پیاده‌شدن', en: 'Changing and getting off' }, explanation: { fa: 'Trebuie să ...? یعنی «آیا باید ...؟». coborâți دستور مؤدبانهٔ «پیاده شوید» است. نام ایستگاه را با afișajul یا نمایشگر هم تطبیق دهید.', en: 'Trebuie să ...? asks whether something is necessary. Coborâți is polite “get off”. Cross-check the stop name on the display.' }, examples: [{ ro: 'Trebuie să schimb autobuzul?', en: 'Do I need to change buses?', fa: 'باید اتوبوس را عوض کنم؟' }] },
    ],
    tasks: [
      { ro: 'Acest autobuz merge spre centru?', en: 'Ask whether the bus goes towards the centre.', fa: 'جهت اتوبوس را بپرسید.', hint: 'Acest autobuz merge ...?' },
      { ro: 'Este linia potrivită pentru Piața Unirii?', en: 'Check the line for Piața Unirii.', fa: 'مناسب بودن خط برای مقصد را بپرسید.', hint: 'Este linia potrivită ...?' },
      { ro: 'Câte stații sunt până acolo?', en: 'Ask how many stops remain.', fa: 'تعداد ایستگاه‌ها را بپرسید.', hint: 'Câte stații ...?' },
      { ro: 'Trebuie să schimb autobuzul?', en: 'Ask whether you need a transfer.', fa: 'لزوم تعویض اتوبوس را بپرسید.', hint: 'Trebuie să ...?' },
    ],
  },
  {
    slug: 'legatura', title: { fa: 'تعویض وسیله و از دست دادن ایستگاه', en: 'Transfer and missed stop' },
    goal: { fa: 'پس از عبور از ایستگاه، محل پیاده‌شدن و مسیر برگشت را با پرسش روشن پیدا کنید.', en: 'After missing a stop, ask where to get off and how to return.' },
    dialogue: [
      { who: 'you', ro: 'Scuzați-mă, am trecut de stația mea.', en: 'Excuse me, I have passed my stop.', fa: 'ببخشید، از ایستگاهم رد شده‌ام.' },
      { who: 'other', ro: 'La ce stație voiați să coborâți?', en: 'At which stop did you want to get off?', fa: 'می‌خواستید در کدام ایستگاه پیاده شوید؟' },
      { who: 'you', ro: 'La stația Universitate. Unde pot coborî acum?', en: 'At Universitate. Where can I get off now?', fa: 'در ایستگاه اونیورسیتاته. حالا کجا می‌توانم پیاده شوم؟' },
      { who: 'other', ro: 'Coborâți la următoarea stație.', en: 'Get off at the next stop.', fa: 'در ایستگاه بعدی پیاده شوید.' },
      { who: 'you', ro: 'Cum mă întorc spre Universitate?', en: 'How do I go back towards Universitate?', fa: 'چطور به سمت اونیورسیتاته برگردم؟' },
      { who: 'other', ro: 'Verificați stația de pe partea opusă.', en: 'Check the stop on the opposite side.', fa: 'ایستگاه سمت مقابل را بررسی کنید.' },
      { who: 'you', ro: 'Am nevoie de un alt bilet pentru întoarcere?', en: 'Do I need another ticket for the return?', fa: 'برای برگشت بلیت دیگری لازم دارم؟' },
      { who: 'other', ro: 'Verificați valabilitatea biletului înainte să urcați.', en: 'Check the ticket validity before boarding.', fa: 'پیش از سوارشدن اعتبار بلیت را بررسی کنید.' },
      { who: 'you', ro: 'Mulțumesc. Voi verifica direcția și biletul.', en: 'Thank you. I will check the direction and the ticket.', fa: 'ممنون. جهت و بلیت را بررسی می‌کنم.' },
    ],
    rules: [
      { title: { fa: 'عبور از ایستگاه', en: 'Missing a stop' }, explanation: { fa: 'Am trecut de stația mea یعنی «از ایستگاه خودم رد شده‌ام». فعل گذشتهٔ am trecut رویدادی را که رخ داده بیان می‌کند.', en: 'Am trecut de stația mea means “I have passed my stop”. The past form am trecut describes what happened.' }, examples: [{ ro: 'Am trecut de stația mea.', en: 'I have passed my stop.', fa: 'از ایستگاهم رد شده‌ام.' }] },
      { title: { fa: 'پرسیدن مسیر برگشت', en: 'Ask for a return route' }, explanation: { fa: 'Unde pot coborî acum? محل پیاده‌شدن را می‌پرسد و Cum mă întorc spre ...? مسیر برگشت را. spre جهت مقصد را نشان می‌دهد.', en: 'Unde pot coborî acum? asks where to get off; Cum mă întorc spre ...? asks how to return towards a place.' }, examples: [{ ro: 'Cum mă întorc spre Universitate?', en: 'How do I go back towards Universitate?', fa: 'چطور به سمت اونیورسیتاته برگردم؟' }] },
      { title: { fa: 'اعتبار بلیت', en: 'Ticket validity' }, explanation: { fa: 'Am nevoie de ...? یعنی «آیا ... لازم دارم؟». برای برگشت، اعتبار بلیت را پیش از سوارشدن از منبع مربوط یا دستگاه بررسی کنید.', en: 'Am nevoie de ...? asks whether something is needed. Check ticket validity before boarding for the return.' }, examples: [{ ro: 'Am nevoie de un alt bilet pentru întoarcere?', en: 'Do I need another ticket for the return?', fa: 'برای برگشت بلیت دیگری لازم دارم؟' }] },
    ],
    tasks: [
      { ro: 'Scuzați-mă, am trecut de stația mea.', en: 'Say you missed your stop.', fa: 'بگویید از ایستگاه رد شده‌اید.', hint: 'Scuzați-mă, am trecut ...' },
      { ro: 'La stația Universitate. Unde pot coborî acum?', en: 'Name the stop and ask where to get off.', fa: 'نام ایستگاه و محل پیاده‌شدن را بپرسید.', hint: 'La stația ... Unde pot ...?' },
      { ro: 'Cum mă întorc spre Universitate?', en: 'Ask how to get back.', fa: 'مسیر برگشت را بپرسید.', hint: 'Cum mă întorc ...?' },
      { ro: 'Am nevoie de un alt bilet pentru întoarcere?', en: 'Ask if another ticket is needed.', fa: 'نیاز به بلیت دیگر را بپرسید.', hint: 'Am nevoie de ...?' },
    ],
  },
];

export function getTransportScenario(slug: string) { return transportScenarios.find(scenario => scenario.slug === slug); }
