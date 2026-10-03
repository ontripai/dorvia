import type { EverydayScenario } from '@/components/romanian/EverydayScenarioLesson';

export const directionsScenarios: EverydayScenario[] = [
  {
    slug: 'adresa', title: { fa: 'خیابان و شمارهٔ ساختمان', en: 'Street and building number' },
    goal: { fa: 'نشانی مشخص را بپرسید، نام خیابان و شماره را در پاسخ تشخیص دهید.', en: 'Ask for a specific address and recognise the street and building number.' },
    dialogue: [
      { who: 'you', ro: 'Scuzați-mă, unde este strada Florilor?', en: 'Excuse me, where is Florilor Street?', fa: 'ببخشید، خیابان فلوریلور کجاست؟' },
      { who: 'passerby', ro: 'Este prima stradă la dreapta.', en: 'It is the first street on the right.', fa: 'اولین خیابان سمت راست است.' },
      { who: 'you', ro: 'Caut numărul zece.', en: 'I am looking for number ten.', fa: 'دنبال شمارهٔ ده هستم.' },
      { who: 'passerby', ro: 'Numărul zece este după farmacie.', en: 'Number ten is after the pharmacy.', fa: 'شمارهٔ ده بعد از داروخانه است.' },
      { who: 'you', ro: 'Este departe de aici?', en: 'Is it far from here?', fa: 'از اینجا دور است؟' },
      { who: 'passerby', ro: 'Nu, este aproape.', en: 'No, it is close.', fa: 'نه، نزدیک است.' },
    ],
    rules: [
      { title: { fa: 'پرسیدن نام خیابان', en: 'Ask for a street' }, explanation: { fa: 'Unde este ...? یعنی «... کجاست؟». strada شکل معینِ stradă («خیابان») است؛ سپس نام خیابان می‌آید. Scuzați-mă خطاب را مؤدبانه می‌کند.', en: 'Unde este ...? means “Where is ...?” Strada is the definite form of stradă (“street”), followed by its name. Scuzați-mă politely opens the question.' }, examples: [{ ro: 'Scuzați-mă, unde este strada Florilor?', en: 'Excuse me, where is Florilor Street?', fa: 'ببخشید، خیابان فلوریلور کجاست؟' }] },
      { title: { fa: 'راست و ترتیب', en: 'Right and order' }, explanation: { fa: 'prima stradă یعنی «اولین خیابان»؛ la dreapta یعنی «سمت راست». صفت ترتیبی prima پیش از اسم مؤنث stradă آمده است.', en: 'Prima stradă means “the first street”; la dreapta means “to the right”. The feminine ordinal prima precedes stradă.' }, examples: [{ ro: 'Este prima stradă la dreapta.', en: 'It is the first street on the right.', fa: 'اولین خیابان سمت راست است.' }] },
      { title: { fa: 'شماره و نشانهٔ مکانی', en: 'Number and landmark' }, explanation: { fa: 'numărul zece یعنی «شمارهٔ ده». după یعنی «بعد از» و de aici یعنی «از اینجا». برای فاصله، Este departe de aici? بپرسید؛ نزدیک در پاسخ aproape است.', en: 'Numărul zece is “number ten”. După means “after”; de aici means “from here”. Ask Este departe de aici? about distance; aproape means “close”.' }, examples: [{ ro: 'Numărul zece este după farmacie.', en: 'Number ten is after the pharmacy.', fa: 'شمارهٔ ده بعد از داروخانه است.' }, { ro: 'Este departe de aici?', en: 'Is it far from here?', fa: 'از اینجا دور است؟' }] },
    ],
    tasks: [
      { ro: 'Scuzați-mă, unde este strada Florilor?', en: 'Ask where Florilor Street is.', fa: 'نشانی خیابان فلوریلور را بپرسید.', hint: 'Scuzați-mă, unde este strada …?' },
      { ro: 'Caut numărul zece.', en: 'Say you are looking for number ten.', fa: 'بگویید دنبال شمارهٔ ده هستید.', hint: 'Caut numărul … .' },
      { ro: 'Este departe de aici?', en: 'Ask whether it is far from here.', fa: 'بپرسید از اینجا دور است؟', hint: 'Este departe de …?' },
    ],
  },
  {
    slug: 'statie', title: { fa: 'پیدا کردن ایستگاه اتوبوس', en: 'Finding the bus stop' },
    goal: { fa: 'نزدیک‌ترین ایستگاه را بپرسید و جهت پیاده‌روی را بفهمید.', en: 'Ask for the nearest stop and understand walking directions.' },
    dialogue: [
      { who: 'you', ro: 'Unde este cea mai apropiată stație de autobuz?', en: 'Where is the nearest bus stop?', fa: 'نزدیک‌ترین ایستگاه اتوبوس کجاست؟' },
      { who: 'passerby', ro: 'Mergeți drept înainte.', en: 'Go straight ahead.', fa: 'مستقیم بروید.' },
      { who: 'passerby', ro: 'Apoi faceți la stânga.', en: 'Then turn left.', fa: 'سپس به چپ بپیچید.' },
      { who: 'you', ro: 'Stația este lângă bancă?', en: 'Is the stop next to the bank?', fa: 'ایستگاه کنار بانک است؟' },
      { who: 'passerby', ro: 'Da, este chiar lângă bancă.', en: 'Yes, it is right next to the bank.', fa: 'بله، درست کنار بانک است.' },
      { who: 'you', ro: 'Mulțumesc pentru ajutor!', en: 'Thank you for your help!', fa: 'از کمکتان ممنونم!' },
    ],
    rules: [
      { title: { fa: 'نزدیک‌ترین ایستگاه', en: 'The nearest stop' }, explanation: { fa: 'stație de autobuz یعنی «ایستگاه اتوبوس». cea mai apropiată ساخت برترینِ مؤنث برای «نزدیک‌ترین» است و با stație هماهنگ می‌شود. Unde este ...? پرسش مکان است.', en: 'Stație de autobuz means “bus stop”. Cea mai apropiată is the feminine superlative “nearest”, agreeing with stație. Unde este ...? asks for a place.' }, examples: [{ ro: 'Unde este cea mai apropiată stație de autobuz?', en: 'Where is the nearest bus stop?', fa: 'نزدیک‌ترین ایستگاه اتوبوس کجاست؟' }] },
      { title: { fa: 'دو فرمان پشت سر هم', en: 'Two directions in sequence' }, explanation: { fa: 'Mergeți شکل مؤدبانهٔ فرمان «بروید» است. drept înainte یعنی «مستقیم». Apoi یعنی «سپس»؛ faceți la stânga یعنی «به چپ بپیچید». ترتیب دو گام را حفظ کنید.', en: 'Mergeți is the polite command “go”. Drept înainte means “straight ahead”. Apoi means “then”; faceți la stânga means “turn left”. Keep the two steps in order.' }, examples: [{ ro: 'Mergeți drept înainte.', en: 'Go straight ahead.', fa: 'مستقیم بروید.' }, { ro: 'Apoi faceți la stânga.', en: 'Then turn left.', fa: 'سپس به چپ بپیچید.' }] },
      { title: { fa: 'کنار یک نشانهٔ شهری', en: 'Next to a landmark' }, explanation: { fa: 'lângă یعنی «کنار». در lângă bancă، مکان مرجع بانک است. chiar تأکید می‌کند که ایستگاه «درست» کنار آن است.', en: 'Lângă means “next to”. In lângă bancă, the bank is the landmark. Chiar emphasises “right next to”.' }, examples: [{ ro: 'Stația este lângă bancă?', en: 'Is the stop next to the bank?', fa: 'ایستگاه کنار بانک است؟' }] },
    ],
    tasks: [
      { ro: 'Unde este cea mai apropiată stație de autobuz?', en: 'Ask for the nearest bus stop.', fa: 'نشانی نزدیک‌ترین ایستگاه اتوبوس را بپرسید.', hint: 'Unde este cea mai apropiată …?' },
      { ro: 'Apoi faceți la stânga.', en: 'Say “then turn left”.', fa: 'بگویید «سپس به چپ بپیچید».', hint: 'Apoi faceți la … .' },
      { ro: 'Stația este lângă bancă?', en: 'Check whether the stop is next to the bank.', fa: 'بپرسید ایستگاه کنار بانک است؟', hint: 'Stația este lângă …?' },
    ],
  },
  {
    slug: 'repetati', title: { fa: 'تکرار و روشن‌کردن مسیر', en: 'Repeating and clarifying directions' },
    goal: { fa: 'وقتی راهنمایی را نفهمیدید، تکرار آهسته و تأیید جهت بخواهید.', en: 'Ask for a slower repeat and confirm a direction when you do not understand.' },
    dialogue: [
      { who: 'passerby', ro: 'Mergeți înainte și faceți la dreapta.', en: 'Go ahead and turn right.', fa: 'مستقیم بروید و به راست بپیچید.' },
      { who: 'you', ro: 'Nu am înțeles. Puteți repeta, vă rog?', en: 'I did not understand. Could you repeat, please?', fa: 'متوجه نشدم. لطفاً تکرار می‌کنید؟' },
      { who: 'passerby', ro: 'Da. Mergeți drept înainte.', en: 'Yes. Go straight ahead.', fa: 'بله. مستقیم بروید.' },
      { who: 'you', ro: 'Puteți vorbi mai rar, vă rog?', en: 'Could you speak more slowly, please?', fa: 'لطفاً آهسته‌تر صحبت می‌کنید؟' },
      { who: 'passerby', ro: 'La dreapta, după semafor.', en: 'To the right, after the traffic light.', fa: 'به راست، بعد از چراغ راهنمایی.' },
      { who: 'you', ro: 'Deci la dreapta după semafor?', en: 'So, right after the traffic light?', fa: 'پس بعد از چراغ راهنمایی به راست؟' },
      { who: 'passerby', ro: 'Da, exact.', en: 'Yes, exactly.', fa: 'بله، دقیقاً.' },
    ],
    rules: [
      { title: { fa: 'وقتی متوجه نشدید', en: 'When you did not understand' }, explanation: { fa: 'Nu am înțeles. گذشتهٔ فعل a înțelege است: «نفهمیدم». Puteți صورت مؤدبانهٔ «می‌توانید؟» است و repeta مصدر کوتاه «تکرار کردن». vă rog پرسش را مؤدبانه می‌کند.', en: 'Nu am înțeles. means “I did not understand”, using the past of a înțelege. Puteți is polite “can you?” and repeta is the short infinitive “repeat”. Vă rog adds courtesy.' }, examples: [{ ro: 'Nu am înțeles. Puteți repeta, vă rog?', en: 'I did not understand. Could you repeat, please?', fa: 'متوجه نشدم. لطفاً تکرار می‌کنید؟' }] },
      { title: { fa: 'درخواست آهسته‌تر گفتن', en: 'Ask someone to speak more slowly' }, explanation: { fa: 'mai rar یعنی «آهسته‌تر/شمرده‌تر» در گفتار. Puteți vorbi mai rar, vă rog? برای روشن‌کردن مسیر کاربرد دارد. بعد از puteți، مصدر کوتاه vorbi آمده است.', en: 'Mai rar means “more slowly” when speaking. Puteți vorbi mai rar, vă rog? asks someone to slow down. Vorbi is the short infinitive after puteți.' }, examples: [{ ro: 'Puteți vorbi mai rar, vă rog?', en: 'Could you speak more slowly, please?', fa: 'لطفاً آهسته‌تر صحبت می‌کنید؟' }] },
      { title: { fa: 'تأیید یک گام از مسیر', en: 'Confirm one step' }, explanation: { fa: 'Deci یعنی «پس/بنابراین». la dreapta جهت راست و după semafor «بعد از چراغ راهنمایی» است. با تکرار کوتاه همان گام، سوءتفاهم را پیش از حرکت برطرف کنید.', en: 'Deci means “so”. La dreapta is “to the right”; după semafor is “after the traffic light”. Repeating one step as a question checks your understanding.' }, examples: [{ ro: 'Deci la dreapta după semafor?', en: 'So, right after the traffic light?', fa: 'پس بعد از چراغ راهنمایی به راست؟' }] },
    ],
    tasks: [
      { ro: 'Nu am înțeles. Puteți repeta, vă rog?', en: 'Say you did not understand and ask for a repeat.', fa: 'بگویید متوجه نشدید و درخواست تکرار کنید.', hint: 'Nu am înțeles. Puteți …, vă rog?' },
      { ro: 'Puteți vorbi mai rar, vă rog?', en: 'Ask the person to speak more slowly.', fa: 'بخواهید آهسته‌تر صحبت کند.', hint: 'Puteți vorbi mai …, vă rog?' },
      { ro: 'Deci la dreapta după semafor?', en: 'Confirm a right turn after the traffic light.', fa: 'پیچیدن به راست پس از چراغ راهنمایی را تأیید کنید.', hint: 'Deci la dreapta după …?' },
    ],
  },
];

export function getDirectionsScenario(slug: string) { return directionsScenarios.find(scenario => scenario.slug === slug); }

