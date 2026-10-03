import type { EverydayScenario } from '@/components/romanian/EverydayScenarioLesson';

export const bankingScenarios: EverydayScenario[] = [
  {
    slug: 'sucursala', title: { fa: 'نوبت و راهنمایی در شعبه', en: 'Queue and help at the branch' },
    goal: { fa: 'نوع کار را به پذیرش بگویید، نوبت بگیرید و باجهٔ درست را پیدا کنید.', en: 'Explain your need, take a queue number, and find the right desk.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua. Am nevoie de informații despre un cont.', en: 'Hello. I need information about an account.', fa: 'سلام. دربارهٔ یک حساب اطلاعات می‌خواهم.' },
      { who: 'clerk', ro: 'Bună ziua. Aveți o programare?', en: 'Hello. Do you have an appointment?', fa: 'سلام. وقت قبلی دارید؟' },
      { who: 'you', ro: 'Nu, nu am programare. Pot lua un număr de ordine?', en: 'No, I do not. Can I take a queue number?', fa: 'نه، وقت ندارم. می‌توانم شمارهٔ نوبت بگیرم؟' },
      { who: 'clerk', ro: 'Da, luați un număr de la aparat.', en: 'Yes, take a number from the machine.', fa: 'بله، از دستگاه شماره بگیرید.' },
      { who: 'you', ro: 'Ce opțiune aleg pe ecran?', en: 'Which option should I choose on the screen?', fa: 'کدام گزینه را روی صفحه انتخاب کنم؟' },
      { who: 'clerk', ro: 'Alegeți serviciul pentru informații despre cont.', en: 'Choose the service for account information.', fa: 'خدمت مربوط به اطلاعات حساب را انتخاب کنید.' },
      { who: 'you', ro: 'Unde văd când vine rândul meu?', en: 'Where can I see when it is my turn?', fa: 'کجا می‌بینم چه زمانی نوبتم می‌شود؟' },
      { who: 'clerk', ro: 'Urmăriți numărul pe afișaj și mergeți la ghișeul indicat.', en: 'Watch the number on the display and go to the indicated desk.', fa: 'شماره را روی نمایشگر دنبال کنید و به باجهٔ اعلام‌شده بروید.' },
      { who: 'you', ro: 'Am înțeles. Mulțumesc pentru ajutor!', en: 'I understand. Thank you for your help!', fa: 'متوجه شدم. از راهنمایی‌تان ممنونم!' },
    ],
    rules: [
      { title: { fa: 'گفتن نوع درخواست', en: 'Explain your request' }, explanation: { fa: 'Am nevoie de ... یعنی «به ... نیاز دارم». despre un cont یعنی «دربارهٔ یک حساب». برای سؤال روشن، موضوع کارتان را در همان آغاز بگویید.', en: 'Am nevoie de ... means “I need ...”. Despre un cont means “about an account”. State your purpose at the start.' }, examples: [{ ro: 'Am nevoie de informații despre un cont.', en: 'I need information about an account.', fa: 'دربارهٔ یک حساب اطلاعات می‌خواهم.' }] },
      { title: { fa: 'نوبت و وقت قبلی', en: 'Queue and appointment' }, explanation: { fa: 'programare وقت قبلی و număr de ordine شمارهٔ نوبت است. Nu am ... پاسخ منفی به پرسش Aveți ...? است.', en: 'Programare is an appointment; număr de ordine is a queue number. Nu am ... answers Aveți ...? negatively.' }, examples: [{ ro: 'Pot lua un număr de ordine?', en: 'Can I take a queue number?', fa: 'می‌توانم شمارهٔ نوبت بگیرم؟' }] },
      { title: { fa: 'نمایشگر و باجه', en: 'Display and desk' }, explanation: { fa: 'afișaj نمایشگر و ghișeu باجه است. Unde văd ...? یعنی «کجا می‌بینم ...؟». شمارهٔ خود را با نمایشگر تطبیق دهید.', en: 'Afișaj is the display; ghișeu is the service desk. Unde văd ...? asks where to look.' }, examples: [{ ro: 'Unde văd când vine rândul meu?', en: 'Where can I see when it is my turn?', fa: 'کجا می‌بینم چه زمانی نوبتم می‌شود؟' }] },
    ],
    tasks: [
      { ro: 'Am nevoie de informații despre un cont.', en: 'Say you need account information.', fa: 'دربارهٔ حساب اطلاعات بخواهید.', hint: 'Am nevoie de ...' },
      { ro: 'Nu, nu am programare. Pot lua un număr de ordine?', en: 'Say you have no appointment and ask for a number.', fa: 'نداشتن وقت و درخواست نوبت را بیان کنید.', hint: 'Nu, nu am ... Pot lua ...?' },
      { ro: 'Ce opțiune aleg pe ecran?', en: 'Ask which screen option to choose.', fa: 'گزینهٔ صفحه را بپرسید.', hint: 'Ce opțiune ...?' },
      { ro: 'Unde văd când vine rândul meu?', en: 'Ask where to see your turn.', fa: 'محل نمایش نوبت را بپرسید.', hint: 'Unde văd ...?' },
    ],
  },
  {
    slug: 'cont', title: { fa: 'پرسش دربارهٔ حساب بانکی', en: 'Asking about a bank account' },
    goal: { fa: 'مدارک، هزینه‌ها و دسترسی به حساب را پیش از تصمیم‌گیری از کارمند بانک بپرسید.', en: 'Ask the bank about documents, fees, and access before deciding.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua. Aș dori informații despre deschiderea unui cont.', en: 'Hello. I would like information about opening an account.', fa: 'سلام. دربارهٔ باز کردن حساب اطلاعات می‌خواهم.' },
      { who: 'clerk', ro: 'Bună ziua. Pentru cine este contul?', en: 'Hello. Who is the account for?', fa: 'سلام. حساب برای چه کسی است؟' },
      { who: 'you', ro: 'Pentru mine. Ce documente îmi trebuie?', en: 'For me. What documents do I need?', fa: 'برای خودم. چه مدارکی لازم دارم؟' },
      { who: 'clerk', ro: 'Vă explic lista actuală de documente.', en: 'I will explain the current document list.', fa: 'فهرست فعلی مدارک را برایتان توضیح می‌دهم.' },
      { who: 'you', ro: 'Există un comision lunar?', en: 'Is there a monthly fee?', fa: 'کارمزد ماهانه‌ای وجود دارد؟' },
      { who: 'clerk', ro: 'Depinde de tipul contului. Verificăm condițiile.', en: 'It depends on the account type. Let us check the terms.', fa: 'به نوع حساب بستگی دارد. شرایط را بررسی می‌کنیم.' },
      { who: 'you', ro: 'Pot folosi aplicația și cardul pentru acest cont?', en: 'Can I use the app and a card with this account?', fa: 'برای این حساب می‌توانم از برنامه و کارت استفاده کنم؟' },
      { who: 'clerk', ro: 'Vă arăt opțiunile și costurile în scris.', en: 'I will show you the options and costs in writing.', fa: 'گزینه‌ها و هزینه‌ها را به‌صورت مکتوب نشان می‌دهم.' },
      { who: 'you', ro: 'Mulțumesc. Vreau să citesc condițiile înainte de a decide.', en: 'Thank you. I want to read the terms before deciding.', fa: 'ممنون. می‌خواهم پیش از تصمیم‌گیری شرایط را بخوانم.' },
    ],
    rules: [
      { title: { fa: 'درخواست اطلاعات دربارهٔ حساب', en: 'Ask for account information' }, explanation: { fa: 'Aș dori informații despre ... یعنی «دربارهٔ ... اطلاعات می‌خواهم». deschiderea unui cont یعنی «باز کردن یک حساب».', en: 'Aș dori informații despre ... means “I would like information about ...”. Deschiderea unui cont is “opening an account”.' }, examples: [{ ro: 'Aș dori informații despre deschiderea unui cont.', en: 'I would like information about opening an account.', fa: 'دربارهٔ باز کردن حساب اطلاعات می‌خواهم.' }] },
      { title: { fa: 'مدارک و هزینه‌ها', en: 'Documents and fees' }, explanation: { fa: 'Ce documente îmi trebuie? مدارک لازم را می‌پرسد. Există ...? یعنی «آیا ... وجود دارد؟». هزینه و شرایط واقعی را از همان بانک بگیرید.', en: 'Ce documente îmi trebuie? asks about required documents. Există ...? asks whether something exists. Check actual terms with the bank.' }, examples: [{ ro: 'Există un comision lunar?', en: 'Is there a monthly fee?', fa: 'کارمزد ماهانه‌ای وجود دارد؟' }] },
      { title: { fa: 'شرایط مکتوب پیش از تصمیم', en: 'Written terms before deciding' }, explanation: { fa: 'în scris یعنی «به‌صورت مکتوب» و înainte de a decide یعنی «پیش از تصمیم‌گیری». این جمله برای درخواست فرصت خواندن شرایط کاربرد دارد.', en: 'În scris means “in writing”; înainte de a decide means “before deciding”. Use this phrase to ask for time to read terms.' }, examples: [{ ro: 'Vreau să citesc condițiile înainte de a decide.', en: 'I want to read the terms before deciding.', fa: 'می‌خواهم پیش از تصمیم‌گیری شرایط را بخوانم.' }] },
    ],
    tasks: [
      { ro: 'Aș dori informații despre deschiderea unui cont.', en: 'Ask about opening an account.', fa: 'دربارهٔ باز کردن حساب بپرسید.', hint: 'Aș dori informații ...' },
      { ro: 'Pentru mine. Ce documente îmi trebuie?', en: 'Say it is for you and ask about documents.', fa: 'مدارک لازم را بپرسید.', hint: 'Pentru mine. Ce documente ...?' },
      { ro: 'Există un comision lunar?', en: 'Ask about a monthly fee.', fa: 'کارمزد ماهانه را بپرسید.', hint: 'Există un ...?' },
      { ro: 'Vreau să citesc condițiile înainte de a decide.', en: 'Ask to read the terms first.', fa: 'بگویید پیش از تصمیم شرایط را می‌خوانید.', hint: 'Vreau să citesc ...' },
    ],
  },
  {
    slug: 'card', title: { fa: 'کارت و مشکل خودپرداز', en: 'Card and ATM issue' },
    goal: { fa: 'مشکل کارت را بدون گفتن رمز توضیح دهید و راه امن تماس با بانک را بپرسید.', en: 'Describe a card issue without disclosing the PIN and ask how to contact the bank safely.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua. Cardul meu nu funcționează la bancomat.', en: 'Hello. My card does not work at the ATM.', fa: 'سلام. کارتم در خودپرداز کار نمی‌کند.' },
      { who: 'clerk', ro: 'A apărut un mesaj pe ecran?', en: 'Did a message appear on the screen?', fa: 'پیامی روی صفحه ظاهر شد؟' },
      { who: 'you', ro: 'Da, dar nu am înțeles mesajul.', en: 'Yes, but I did not understand the message.', fa: 'بله، اما پیام را نفهمیدم.' },
      { who: 'clerk', ro: 'Puteți descrie ce scria, fără să spuneți codul PIN?', en: 'Can you describe what it said without telling me your PIN?', fa: 'می‌توانید نوشته را بدون گفتن رمز کارت توضیح دهید؟' },
      { who: 'you', ro: 'Da. Tranzacția a fost refuzată. Ce pot verifica?', en: 'Yes. The transaction was declined. What can I check?', fa: 'بله. تراکنش رد شد. چه چیزی را می‌توانم بررسی کنم؟' },
      { who: 'clerk', ro: 'Vă explic cum verificați situația prin canalul oficial.', en: 'I will explain how to check it through the official channel.', fa: 'توضیح می‌دهم چطور از مسیر رسمی وضعیت را بررسی کنید.' },
      { who: 'you', ro: 'Dacă pierd cardul, cum îl blochez?', en: 'If I lose the card, how do I block it?', fa: 'اگر کارت را گم کنم، چطور آن را مسدود کنم؟' },
      { who: 'clerk', ro: 'Vă arăt numărul oficial de contact al băncii.', en: 'I will show you the bank’s official contact number.', fa: 'شمارهٔ رسمی تماس بانک را به شما نشان می‌دهم.' },
      { who: 'you', ro: 'Mulțumesc. Nu voi comunica nimănui codul PIN.', en: 'Thank you. I will not share my PIN with anyone.', fa: 'ممنون. رمز کارتم را به کسی نمی‌گویم.' },
    ],
    rules: [
      { title: { fa: 'شرح مشکل کارت', en: 'Describe a card problem' }, explanation: { fa: 'Cardul meu nu funcționează یعنی «کارتم کار نمی‌کند». la bancomat محل مشکل را مشخص می‌کند. پیام صفحه را توصیف کنید.', en: 'Cardul meu nu funcționează means “my card does not work”; la bancomat specifies the ATM. Describe the screen message.' }, examples: [{ ro: 'Cardul meu nu funcționează la bancomat.', en: 'My card does not work at the ATM.', fa: 'کارتم در خودپرداز کار نمی‌کند.' }] },
      { title: { fa: 'اگر کارت گم شود', en: 'If the card is lost' }, explanation: { fa: 'Dacă یعنی «اگر». Cum îl blochez? یعنی «چطور آن را مسدود کنم؟». îl به card برمی‌گردد. راه رسمی بانک را بپرسید.', en: 'Dacă means “if”. Cum îl blochez? asks how to block it; îl refers to card. Ask for the bank’s official channel.' }, examples: [{ ro: 'Dacă pierd cardul, cum îl blochez?', en: 'If I lose the card, how do I block it?', fa: 'اگر کارت را گم کنم، چطور آن را مسدود کنم؟' }] },
      { title: { fa: 'حفظ رمز', en: 'Keep the PIN private' }, explanation: { fa: 'Nu voi comunica ... یعنی «اعلام نخواهم کرد». codul PIN رمز کارت است. این جمله به زبان‌آموز کمک می‌کند مرز روشنی در مکالمه بگذارد.', en: 'Nu voi comunica ... means “I will not disclose”. Codul PIN is the card PIN. This phrase sets a clear boundary.' }, examples: [{ ro: 'Nu voi comunica nimănui codul PIN.', en: 'I will not share my PIN with anyone.', fa: 'رمز کارتم را به کسی نمی‌گویم.' }] },
    ],
    tasks: [
      { ro: 'Cardul meu nu funcționează la bancomat.', en: 'Describe the ATM problem.', fa: 'مشکل کارت در خودپرداز را بگویید.', hint: 'Cardul meu nu ...' },
      { ro: 'Da, dar nu am înțeles mesajul.', en: 'Say you did not understand the message.', fa: 'بگویید پیام را نفهمیدید.', hint: 'Da, dar nu ...' },
      { ro: 'Dacă pierd cardul, cum îl blochez?', en: 'Ask how to block a lost card.', fa: 'مسدود کردن کارت گمشده را بپرسید.', hint: 'Dacă pierd cardul ...?' },
      { ro: 'Nu voi comunica nimănui codul PIN.', en: 'Say you will not share the PIN.', fa: 'بگویید رمز را به کسی نمی‌دهید.', hint: 'Nu voi comunica ...' },
    ],
  },
  {
    slug: 'transfer', title: { fa: 'انتقال وجه و رسید', en: 'Transfer and receipt' },
    goal: { fa: 'پیش از تأیید انتقال، نام گیرنده، مبلغ، هزینه و رسید را روشن کنید.', en: 'Clarify the recipient, amount, fee, and receipt before confirming a transfer.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua. Aș dori informații despre un transfer bancar.', en: 'Hello. I would like information about a bank transfer.', fa: 'سلام. دربارهٔ انتقال بانکی اطلاعات می‌خواهم.' },
      { who: 'clerk', ro: 'Desigur. Aveți datele beneficiarului?', en: 'Of course. Do you have the recipient’s details?', fa: 'البته. اطلاعات گیرنده را دارید؟' },
      { who: 'you', ro: 'Da. Vreau să verific numele și contul înainte de plată.', en: 'Yes. I want to check the name and account before payment.', fa: 'بله. می‌خواهم پیش از پرداخت نام و حساب را بررسی کنم.' },
      { who: 'clerk', ro: 'Verificați cu atenție toate datele afișate.', en: 'Check all displayed details carefully.', fa: 'همهٔ اطلاعات نمایش‌داده‌شده را با دقت بررسی کنید.' },
      { who: 'you', ro: 'Care este suma totală și există un comision?', en: 'What is the total amount and is there a fee?', fa: 'مبلغ کل چقدر است و کارمزدی وجود دارد؟' },
      { who: 'clerk', ro: 'Vă arăt suma și costurile înainte de confirmare.', en: 'I will show you the amount and costs before confirmation.', fa: 'پیش از تأیید، مبلغ و هزینه‌ها را نشان می‌دهم.' },
      { who: 'you', ro: 'Pot primi o confirmare a transferului?', en: 'Can I receive a transfer confirmation?', fa: 'می‌توانم تأییدیهٔ انتقال بگیرم؟' },
      { who: 'clerk', ro: 'Vă explic ce confirmare este disponibilă.', en: 'I will explain what confirmation is available.', fa: 'توضیح می‌دهم چه تأییدیه‌ای در دسترس است.' },
      { who: 'you', ro: 'Mulțumesc. Confirm doar după ce verific toate datele.', en: 'Thank you. I will confirm only after checking all the details.', fa: 'ممنون. فقط پس از بررسی همهٔ اطلاعات تأیید می‌کنم.' },
    ],
    rules: [
      { title: { fa: 'اطلاعات گیرنده', en: 'Recipient details' }, explanation: { fa: 'beneficiarul یعنی «گیرنده». Vreau să verific ... یعنی «می‌خواهم ... را بررسی کنم». نام و حساب را قبل از تأیید با اطلاعات خود تطبیق دهید.', en: 'Beneficiarul is the recipient. Vreau să verific ... means “I want to check ...”. Match the name and account details before confirming.' }, examples: [{ ro: 'Vreau să verific numele și contul înainte de plată.', en: 'I want to check the name and account before payment.', fa: 'می‌خواهم پیش از پرداخت نام و حساب را بررسی کنم.' }] },
      { title: { fa: 'مبلغ و کارمزد', en: 'Amount and fee' }, explanation: { fa: 'Care este suma totală? مبلغ کل را می‌پرسد. Există un comision? دربارهٔ کارمزد سؤال می‌کند. مبلغ واقعی و هزینه را از بانک تأیید کنید.', en: 'Care este suma totală? asks the total. Există un comision? asks whether there is a fee. Confirm actual amounts with the bank.' }, examples: [{ ro: 'Care este suma totală și există un comision?', en: 'What is the total amount and is there a fee?', fa: 'مبلغ کل چقدر است و کارمزدی وجود دارد؟' }] },
      { title: { fa: 'تأییدیهٔ انتقال', en: 'Transfer confirmation' }, explanation: { fa: 'Pot primi ...? یعنی «می‌توانم دریافت کنم؟». confirmare a transferului تأییدیهٔ انتقال است. تنها پس از بررسی جزئیات، انتقال را تأیید کنید.', en: 'Pot primi ...? asks “Can I receive ...?” Confirmare a transferului is the transfer confirmation. Confirm only after reviewing details.' }, examples: [{ ro: 'Pot primi o confirmare a transferului?', en: 'Can I receive a transfer confirmation?', fa: 'می‌توانم تأییدیهٔ انتقال بگیرم؟' }] },
    ],
    tasks: [
      { ro: 'Aș dori informații despre un transfer bancar.', en: 'Ask about a bank transfer.', fa: 'دربارهٔ انتقال بانکی بپرسید.', hint: 'Aș dori informații ...' },
      { ro: 'Vreau să verific numele și contul înainte de plată.', en: 'Ask to verify recipient details.', fa: 'بررسی نام و حساب را بخواهید.', hint: 'Vreau să verific ...' },
      { ro: 'Care este suma totală și există un comision?', en: 'Ask about the total and fee.', fa: 'مبلغ کل و کارمزد را بپرسید.', hint: 'Care este suma ...?' },
      { ro: 'Pot primi o confirmare a transferului?', en: 'Ask for a transfer confirmation.', fa: 'تأییدیهٔ انتقال بخواهید.', hint: 'Pot primi ...?' },
    ],
  },
];

export function getBankingScenario(slug: string) { return bankingScenarios.find(scenario => scenario.slug === slug); }
