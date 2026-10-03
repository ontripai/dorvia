import type { EverydayScenario } from '@/components/romanian/EverydayScenarioLesson';

export const appointmentScenarios: EverydayScenario[] = [
  {
    slug: 'telefon', title: { fa: 'گرفتن وقت تلفنی', en: 'Booking by phone' },
    goal: { fa: 'در تماس تلفنی نوع مراجعه، روز، ساعت و نام خود را روشن و مرحله‌به‌مرحله بیان کنید.', en: 'State the purpose, day, time, and your name clearly during a phone booking.' },
    dialogue: [
      { who: 'desk', ro: 'Bună ziua, recepția clinicii. Cu ce vă pot ajuta?', en: 'Hello, clinic reception. How can I help?', fa: 'سلام، پذیرش درمانگاه. چطور می‌توانم کمک کنم؟' },
      { who: 'you', ro: 'Bună ziua. Aș dori o programare la medic.', en: 'Hello. I would like a doctor’s appointment.', fa: 'سلام. یک وقت ملاقات با پزشک می‌خواهم.' },
      { who: 'desk', ro: 'Este prima dumneavoastră vizită?', en: 'Is this your first visit?', fa: 'این اولین مراجعهٔ شماست؟' },
      { who: 'you', ro: 'Da, este prima mea vizită.', en: 'Yes, it is my first visit.', fa: 'بله، اولین مراجعهٔ من است.' },
      { who: 'desk', ro: 'Avem un loc liber marți la ora zece.', en: 'We have an available slot on Tuesday at ten.', fa: 'سه‌شنبه ساعت ده یک وقت خالی داریم.' },
      { who: 'you', ro: 'Marți la ora zece este bine pentru mine.', en: 'Tuesday at ten works for me.', fa: 'سه‌شنبه ساعت ده برای من مناسب است.' },
      { who: 'desk', ro: 'Cum vă numiți?', en: 'What is your name?', fa: 'نامتان چیست؟' },
      { who: 'you', ro: 'Mă numesc Ana Popescu.', en: 'My name is Ana Popescu.', fa: 'نام من آنا پوپسکو است.' },
      { who: 'desk', ro: 'Am notat. Vă așteptăm marți la zece.', en: 'I have noted it. We will see you on Tuesday at ten.', fa: 'یادداشت کردم. سه‌شنبه ساعت ده منتظرتان هستیم.' },
    ],
    rules: [
      { title: { fa: 'آغاز تماس و درخواست', en: 'Open the call and ask' }, explanation: { fa: 'در تلفن، پذیرش ممکن است بگوید Cu ce vă pot ajuta? («چطور کمک کنم؟»). Aș dori صورت مؤدبانهٔ «می‌خواهم» است. o programare مؤنث و به معنی یک وقت ملاقات است؛ la medic هدف مراجعه را مشخص می‌کند.', en: 'Reception may ask Cu ce vă pot ajuta? (“How can I help?”). Aș dori is a polite “I would like”. O programare is feminine and means an appointment; la medic specifies a doctor.' }, examples: [{ ro: 'Bună ziua. Aș dori o programare la medic.', en: 'Hello. I would like a doctor’s appointment.', fa: 'سلام. یک وقت ملاقات با پزشک می‌خواهم.' }] },
      { title: { fa: 'اولین مراجعه و تأیید وقت', en: 'First visit and confirmation' }, explanation: { fa: 'prima mea vizită یعنی «اولین مراجعهٔ من». برای تأیید پیشنهاد، روز و ساعت را کامل تکرار کنید: Marți la ora zece este bine pentru mine. این کار احتمال اشتباه شنیدن وقت را کم می‌کند.', en: 'Prima mea vizită means “my first visit”. Confirm an offered time by repeating both day and hour: Marți la ora zece este bine pentru mine.' }, examples: [{ ro: 'Da, este prima mea vizită.', en: 'Yes, it is my first visit.', fa: 'بله، اولین مراجعهٔ من است.' }, { ro: 'Marți la ora zece este bine pentru mine.', en: 'Tuesday at ten works for me.', fa: 'سه‌شنبه ساعت ده برای من مناسب است.' }] },
      { title: { fa: 'گفتن نام', en: 'Give your name' }, explanation: { fa: 'Cum vă numiți? پرسش مؤدبانهٔ «نامتان چیست؟» است. Mă numesc ... یعنی «نام من ... است». نام نمونه را در مراجعهٔ واقعی با نام خودتان جایگزین کنید.', en: 'Cum vă numiți? politely asks your name. Mă numesc ... means “My name is ...”. Replace the sample name with your own in a real call.' }, examples: [{ ro: 'Mă numesc Ana Popescu.', en: 'My name is Ana Popescu.', fa: 'نام من آنا پوپسکو است.' }] },
    ],
    tasks: [
      { ro: 'Bună ziua. Aș dori o programare la medic.', en: 'Start a call and ask for an appointment.', fa: 'تماس را آغاز کنید و وقت بخواهید.', hint: 'Bună ziua. Aș dori o … la medic.' },
      { ro: 'Da, este prima mea vizită.', en: 'Say that it is your first visit.', fa: 'بگویید اولین مراجعهٔ شماست.', hint: 'Da, este prima mea … .' },
      { ro: 'Marți la ora zece este bine pentru mine.', en: 'Confirm Tuesday at ten.', fa: 'سه‌شنبه ساعت ده را تأیید کنید.', hint: 'Marți la ora zece este … .' },
      { ro: 'Mă numesc Ana Popescu.', en: 'Give the sample name Ana Popescu.', fa: 'نام نمونهٔ آنا پوپسکو را بگویید.', hint: 'Mă numesc … .' },
    ],
  },
  {
    slug: 'schimbare', title: { fa: 'جابه‌جایی وقت ملاقات', en: 'Rescheduling an appointment' },
    goal: { fa: 'وقت کنونی را مشخص کنید، روز جایگزین بخواهید و ساعت تازه را تأیید کنید.', en: 'Identify your current appointment, ask for another day, and confirm the new time.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua. Am o programare miercuri la ora nouă.', en: 'Hello. I have an appointment Wednesday at nine.', fa: 'سلام. چهارشنبه ساعت نه وقت دارم.' },
      { who: 'desk', ro: 'Pe ce nume este programarea?', en: 'Under what name is the appointment?', fa: 'وقت به چه نامی ثبت شده است؟' },
      { who: 'you', ro: 'Pe numele Ana Popescu.', en: 'Under the name Ana Popescu.', fa: 'به نام آنا پوپسکو.' },
      { who: 'you', ro: 'Aș dori să schimb ziua, dacă se poate.', en: 'I would like to change the day, if possible.', fa: 'اگر ممکن است می‌خواهم روز را عوض کنم.' },
      { who: 'desk', ro: 'Avem un loc liber joi la ora unsprezece.', en: 'We have an available slot Thursday at eleven.', fa: 'پنجشنبه ساعت یازده وقت خالی داریم.' },
      { who: 'you', ro: 'Joi la unsprezece este bine.', en: 'Thursday at eleven works.', fa: 'پنجشنبه ساعت یازده مناسب است.' },
      { who: 'desk', ro: 'Am schimbat programarea pentru joi.', en: 'I have changed the appointment to Thursday.', fa: 'وقت را به پنجشنبه تغییر دادم.' },
      { who: 'you', ro: 'Deci joi la ora unsprezece, corect?', en: 'So Thursday at eleven, correct?', fa: 'پس پنجشنبه ساعت یازده، درست است؟' },
      { who: 'desk', ro: 'Da, corect.', en: 'Yes, correct.', fa: 'بله، درست است.' },
    ],
    rules: [
      { title: { fa: 'مشخص کردن وقت کنونی', en: 'Identify the existing appointment' }, explanation: { fa: 'Am o programare یعنی «وقت دارم» و am از a avea است. روز و ساعت را پس از آن بیاورید. Pe ce nume? می‌پرسد وقت به نام چه کسی است؛ پاسخ کوتاه با Pe numele ... می‌آید.', en: 'Am o programare means “I have an appointment”; am comes from a avea. Add the day and hour. Pe ce nume? asks whose name it is under; answer Pe numele ...' }, examples: [{ ro: 'Bună ziua. Am o programare miercuri la ora nouă.', en: 'Hello. I have an appointment Wednesday at nine.', fa: 'سلام. چهارشنبه ساعت نه وقت دارم.' }, { ro: 'Pe numele Ana Popescu.', en: 'Under the name Ana Popescu.', fa: 'به نام آنا پوپسکو.' }] },
      { title: { fa: 'درخواست تغییر', en: 'Request a change' }, explanation: { fa: 'Aș dori să schimb ziua یعنی «مایلم روز را عوض کنم». بعد از aș dori، برای بیان عمل از să + فعل صرف‌شده استفاده شده است: să schimb. dacă se poate یعنی «اگر ممکن است».', en: 'Aș dori să schimb ziua means “I would like to change the day”. The action after aș dori uses să + conjugated verb: să schimb. Dacă se poate means “if possible”.' }, examples: [{ ro: 'Aș dori să schimb ziua, dacă se poate.', en: 'I would like to change the day, if possible.', fa: 'اگر ممکن است می‌خواهم روز را عوض کنم.' }] },
      { title: { fa: 'بازخوانی وقت تازه', en: 'Read back the new time' }, explanation: { fa: 'Deci یعنی «پس». پس از اعلام تغییر، روز و ساعت جدید را به صورت سؤال تکرار کنید و با corect? تأیید بخواهید. تا وقتی پذیرش پاسخ ندهد، تغییر را قطعی فرض نکنید.', en: 'Deci means “so”. Repeat the new day and hour as a question, ending with corect? Wait for reception to confirm the change.' }, examples: [{ ro: 'Deci joi la ora unsprezece, corect?', en: 'So Thursday at eleven, correct?', fa: 'پس پنجشنبه ساعت یازده، درست است؟' }] },
    ],
    tasks: [
      { ro: 'Bună ziua. Am o programare miercuri la ora nouă.', en: 'State your existing Wednesday appointment.', fa: 'وقت کنونی چهارشنبه را بگویید.', hint: 'Am o programare miercuri la ora … .' },
      { ro: 'Pe numele Ana Popescu.', en: 'Give the sample booking name.', fa: 'نام نمونهٔ ثبت وقت را بگویید.', hint: 'Pe numele … .' },
      { ro: 'Aș dori să schimb ziua, dacă se poate.', en: 'Politely request a different day.', fa: 'مؤدبانه تغییر روز را بخواهید.', hint: 'Aș dori să schimb … .' },
      { ro: 'Deci joi la ora unsprezece, corect?', en: 'Confirm the new Thursday time.', fa: 'وقت تازهٔ پنجشنبه را تأیید کنید.', hint: 'Deci joi la ora …, corect?' },
    ],
  },
  {
    slug: 'anulare', title: { fa: 'لغو وقت ملاقات', en: 'Cancelling an appointment' },
    goal: { fa: 'وقت را با نام و زمان مشخص کنید، درخواست لغو بدهید و نتیجه را تأیید کنید.', en: 'Identify the booking by name and time, request cancellation, and confirm the result.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua. Vreau să anulez o programare.', en: 'Hello. I want to cancel an appointment.', fa: 'سلام. می‌خواهم یک وقت را لغو کنم.' },
      { who: 'desk', ro: 'Pe ce nume este programarea?', en: 'Under what name is the appointment?', fa: 'وقت به چه نامی است؟' },
      { who: 'you', ro: 'Pe numele Ana Popescu.', en: 'Under the name Ana Popescu.', fa: 'به نام آنا پوپسکو.' },
      { who: 'desk', ro: 'Pentru ce zi aveți programarea?', en: 'For which day is your appointment?', fa: 'وقت شما برای چه روزی است؟' },
      { who: 'you', ro: 'Pentru vineri la ora zece.', en: 'For Friday at ten.', fa: 'برای جمعه ساعت ده.' },
      { who: 'desk', ro: 'Am găsit programarea. Doriți să o anulez?', en: 'I found the appointment. Would you like me to cancel it?', fa: 'وقت را پیدا کردم. می‌خواهید لغوش کنم؟' },
      { who: 'you', ro: 'Da, vă rog să o anulați.', en: 'Yes, please cancel it.', fa: 'بله، لطفاً آن را لغو کنید.' },
      { who: 'desk', ro: 'Programarea este anulată.', en: 'The appointment has been cancelled.', fa: 'وقت لغو شد.' },
      { who: 'you', ro: 'Vă mulțumesc pentru confirmare.', en: 'Thank you for confirming.', fa: 'از تأییدتان سپاسگزارم.' },
    ],
    rules: [
      { title: { fa: 'درخواست لغو', en: 'Ask to cancel' }, explanation: { fa: 'Vreau să anulez یعنی «می‌خواهم لغو کنم». پس از vreau، ساخت să + فعل صرف‌شده آمده است. برای بیان رسمی‌تر می‌توانید Aș dori să anulez بگویید. در این درس خودِ لغو را تنها پس از تأیید پذیرش کامل بدانید.', en: 'Vreau să anulez means “I want to cancel”, using să + a conjugated verb. Aș dori să anulez is more formal. Consider it cancelled only after reception confirms.' }, examples: [{ ro: 'Bună ziua. Vreau să anulez o programare.', en: 'Hello. I want to cancel an appointment.', fa: 'سلام. می‌خواهم یک وقت را لغو کنم.' }] },
      { title: { fa: 'شناسایی وقت', en: 'Identify the booking' }, explanation: { fa: 'Pe numele ... نام ثبت‌شده را می‌دهد. Pentru ce zi? یعنی «برای چه روزی؟»؛ پاسخ می‌تواند روز و ساعت را با هم بیاورد: Pentru vineri la ora zece. نام و وقت در گفت‌وگو نمونه هستند.', en: 'Pe numele ... gives the booking name. Pentru ce zi? asks for which day. Reply with day and hour: Pentru vineri la ora zece. The name and time here are examples.' }, examples: [{ ro: 'Pe numele Ana Popescu.', en: 'Under the name Ana Popescu.', fa: 'به نام آنا پوپسکو.' }, { ro: 'Pentru vineri la ora zece.', en: 'For Friday at ten.', fa: 'برای جمعه ساعت ده.' }] },
      { title: { fa: 'درخواست و تأیید نهایی', en: 'Request and final confirmation' }, explanation: { fa: 'vă rog să o anulați یعنی «لطفاً آن را لغو کنید»؛ o به programare برمی‌گردد. Programarea este anulată. جملهٔ تأیید نهایی با فعل a fi و صفت anulată است.', en: 'Vă rog să o anulați means “please cancel it”; o refers to programare. Programarea este anulată. is the final confirmation with a fi and anulată.' }, examples: [{ ro: 'Da, vă rog să o anulați.', en: 'Yes, please cancel it.', fa: 'بله، لطفاً آن را لغو کنید.' }, { ro: 'Programarea este anulată.', en: 'The appointment has been cancelled.', fa: 'وقت لغو شد.' }] },
    ],
    tasks: [
      { ro: 'Bună ziua. Vreau să anulez o programare.', en: 'State that you want to cancel.', fa: 'بگویید می‌خواهید وقت را لغو کنید.', hint: 'Vreau să anulez o … .' },
      { ro: 'Pe numele Ana Popescu.', en: 'Give the sample booking name.', fa: 'نام نمونهٔ ثبت وقت را بگویید.', hint: 'Pe numele … .' },
      { ro: 'Pentru vineri la ora zece.', en: 'Give the Friday appointment time.', fa: 'وقت جمعه ساعت ده را بگویید.', hint: 'Pentru vineri la ora … .' },
      { ro: 'Da, vă rog să o anulați.', en: 'Confirm the cancellation request.', fa: 'درخواست لغو را تأیید کنید.', hint: 'Da, vă rog să o … .' },
    ],
  },
  {
    slug: 'receptie', title: { fa: 'ورود و معرفی در پذیرش', en: 'Checking in at reception' },
    goal: { fa: 'پس از ورود نام و ساعت وقت را بگویید، محل انتظار را بپرسید و راهنمایی را بفهمید.', en: 'Give your name and appointment time, ask where to wait, and understand the reply.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua. Am o programare la ora zece.', en: 'Hello. I have an appointment at ten.', fa: 'سلام. ساعت ده وقت دارم.' },
      { who: 'desk', ro: 'Bună ziua. Cum vă numiți?', en: 'Hello. What is your name?', fa: 'سلام. نامتان چیست؟' },
      { who: 'you', ro: 'Mă numesc Ana Popescu.', en: 'My name is Ana Popescu.', fa: 'نام من آنا پوپسکو است.' },
      { who: 'desk', ro: 'Da, sunteți pe listă.', en: 'Yes, you are on the list.', fa: 'بله، نامتان در فهرست است.' },
      { who: 'you', ro: 'Unde trebuie să aștept?', en: 'Where should I wait?', fa: 'کجا باید منتظر بمانم؟' },
      { who: 'desk', ro: 'Vă rog să așteptați în sala de așteptare.', en: 'Please wait in the waiting room.', fa: 'لطفاً در اتاق انتظار منتظر بمانید.' },
      { who: 'you', ro: 'Este la etajul întâi?', en: 'Is it on the first floor?', fa: 'در طبقهٔ اول است؟' },
      { who: 'desk', ro: 'Da, urcați scările și faceți la dreapta.', en: 'Yes, go up the stairs and turn right.', fa: 'بله، از پله‌ها بالا بروید و به راست بپیچید.' },
      { who: 'you', ro: 'Am înțeles. Mulțumesc!', en: 'I understand. Thank you!', fa: 'متوجه شدم. متشکرم!' },
    ],
    rules: [
      { title: { fa: 'معرفی وقت و نام', en: 'State your time and name' }, explanation: { fa: 'Am o programare la ora zece. یعنی «ساعت ده وقت دارم». نام خود را با Mă numesc ... بگویید. sunteți pe listă یعنی «در فهرست هستید» و sunteți شکل مؤدبانهٔ a fi است.', en: 'Am o programare la ora zece. gives the time. Say your name with Mă numesc ... Sunteți pe listă means “you are on the list”; sunteți is the polite a fi form.' }, examples: [{ ro: 'Bună ziua. Am o programare la ora zece.', en: 'Hello. I have an appointment at ten.', fa: 'سلام. ساعت ده وقت دارم.' }, { ro: 'Mă numesc Ana Popescu.', en: 'My name is Ana Popescu.', fa: 'نام من آنا پوپسکو است.' }] },
      { title: { fa: 'محل انتظار', en: 'Where to wait' }, explanation: { fa: 'Unde یعنی «کجا» و trebuie să aștept یعنی «باید منتظر بمانم». sala de așteptare «اتاق انتظار» است. پرسش دربارهٔ طبقه با Este la etajul întâi? ساخته می‌شود.', en: 'Unde means “where”; trebuie să aștept means “should I wait”. Sala de așteptare is the waiting room. Ask about a floor with Este la etajul întâi?' }, examples: [{ ro: 'Unde trebuie să aștept?', en: 'Where should I wait?', fa: 'کجا باید منتظر بمانم؟' }, { ro: 'Este la etajul întâi?', en: 'Is it on the first floor?', fa: 'در طبقهٔ اول است؟' }] },
      { title: { fa: 'فهمیدن راهنمایی پذیرش', en: 'Understand the receptionist’s directions' }, explanation: { fa: 'urcați شکل مؤدبانهٔ «بالا بروید» است؛ scările یعنی «پله‌ها» و faceți la dreapta یعنی «به راست بپیچید». دو گام را به ترتیب انجام دهید.', en: 'Urcați is polite “go up”; scările is “the stairs”; faceți la dreapta means “turn right”. Follow the steps in order.' }, examples: [{ ro: 'Da, urcați scările și faceți la dreapta.', en: 'Yes, go up the stairs and turn right.', fa: 'بله، از پله‌ها بالا بروید و به راست بپیچید.' }] },
    ],
    tasks: [
      { ro: 'Bună ziua. Am o programare la ora zece.', en: 'State your appointment at ten.', fa: 'وقت ساعت ده را اعلام کنید.', hint: 'Am o programare la ora … .' },
      { ro: 'Mă numesc Ana Popescu.', en: 'Give the sample name.', fa: 'نام نمونه را بگویید.', hint: 'Mă numesc … .' },
      { ro: 'Unde trebuie să aștept?', en: 'Ask where to wait.', fa: 'محل انتظار را بپرسید.', hint: 'Unde trebuie să …?' },
      { ro: 'Este la etajul întâi?', en: 'Ask if it is on the first floor.', fa: 'بپرسید در طبقهٔ اول است؟', hint: 'Este la etajul …?' },
    ],
  },
  {
    slug: 'documente', title: { fa: 'مدارک و پرسش در پذیرش', en: 'Documents at reception' },
    goal: { fa: 'دربارهٔ مدارک لازم بپرسید، مدرک همراه را نشان دهید و کمبود را روشن کنید.', en: 'Ask which documents are needed, show what you have, and clarify a missing item.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua. Ce documente trebuie să prezint?', en: 'Hello. Which documents should I present?', fa: 'سلام. چه مدارکی باید ارائه کنم؟' },
      { who: 'desk', ro: 'Aveți un act de identitate?', en: 'Do you have an identity document?', fa: 'مدرک شناسایی دارید؟' },
      { who: 'you', ro: 'Da, am pașaportul aici.', en: 'Yes, I have my passport here.', fa: 'بله، گذرنامه‌ام اینجاست.' },
      { who: 'desk', ro: 'Aveți și confirmarea programării?', en: 'Do you also have the appointment confirmation?', fa: 'تأییدیهٔ وقت را هم دارید؟' },
      { who: 'you', ro: 'O am pe telefon. Este suficient?', en: 'I have it on my phone. Is that enough?', fa: 'در تلفنم دارم. کافی است؟' },
      { who: 'desk', ro: 'Da, îmi puteți arăta ecranul.', en: 'Yes, you can show me the screen.', fa: 'بله، می‌توانید صفحه را نشان دهید.' },
      { who: 'you', ro: 'Mai este nevoie de altceva?', en: 'Is anything else needed?', fa: 'چیز دیگری هم لازم است؟' },
      { who: 'desk', ro: 'Nu, acestea sunt suficiente.', en: 'No, these are sufficient.', fa: 'نه، این‌ها کافی هستند.' },
      { who: 'you', ro: 'Vă mulțumesc pentru ajutor.', en: 'Thank you for your help.', fa: 'از کمکتان سپاسگزارم.' },
    ],
    rules: [
      { title: { fa: 'پرسیدن دربارهٔ مدارک', en: 'Ask which documents are needed' }, explanation: { fa: 'Ce documente یعنی «چه مدارکی». trebuie să prezint ساخت «باید ارائه کنم» است؛ după să فعل prezint صرف شده است. این سؤال فهرست واقعی مدارک را از همان پذیرش می‌گیرد و فرض نمی‌کند همهٔ مراکز یکسان‌اند.', en: 'Ce documente means “which documents”. Trebuie să prezint means “should I present”, with a conjugated verb after să. Ask the actual reception desk; requirements vary.' }, examples: [{ ro: 'Bună ziua. Ce documente trebuie să prezint?', en: 'Hello. Which documents should I present?', fa: 'سلام. چه مدارکی باید ارائه کنم؟' }] },
      { title: { fa: 'پاسخ با a avea', en: 'Answer with a avea' }, explanation: { fa: 'Aveți ...? صورت مؤدبانهٔ «دارید؟» است. Da, am ... یعنی «بله، دارم». pașaportul صورت معین «گذرنامه» است. برای تأییدیه، O am pe telefon. یعنی «آن را در تلفن دارم»؛ o به confirmarea (مؤنث) برمی‌گردد.', en: 'Aveți ...? politely asks “Do you have ...?” Da, am ... means “Yes, I have ...”. Pașaportul is “the passport”. O am pe telefon. means “I have it on my phone”; o refers to feminine confirmarea.' }, examples: [{ ro: 'Da, am pașaportul aici.', en: 'Yes, I have my passport here.', fa: 'بله، گذرنامه‌ام اینجاست.' }, { ro: 'O am pe telefon. Este suficient?', en: 'I have it on my phone. Is that enough?', fa: 'در تلفنم دارم. کافی است؟' }] },
      { title: { fa: 'پرسش نهایی دربارهٔ کمبود', en: 'Check whether anything else is needed' }, explanation: { fa: 'Mai ... altceva? می‌پرسد آیا «چیز دیگری» لازم است. nevoie de یعنی «نیاز به». در پاسخ acestea sunt suficiente، acestea «این‌ها»، sunt «هستند» و suficiente «کافی» است.', en: 'Mai ... altceva? asks whether “anything else” is needed. Nevoie de means “need for”. In acestea sunt suficiente, acestea is “these”, sunt “are”, and suficiente “sufficient”.' }, examples: [{ ro: 'Mai este nevoie de altceva?', en: 'Is anything else needed?', fa: 'چیز دیگری هم لازم است؟' }, { ro: 'Nu, acestea sunt suficiente.', en: 'No, these are sufficient.', fa: 'نه، این‌ها کافی هستند.' }] },
    ],
    tasks: [
      { ro: 'Bună ziua. Ce documente trebuie să prezint?', en: 'Ask which documents are required.', fa: 'دربارهٔ مدارک لازم بپرسید.', hint: 'Ce documente trebuie să …?' },
      { ro: 'Da, am pașaportul aici.', en: 'Say that you have your passport.', fa: 'بگویید گذرنامه همراه دارید.', hint: 'Da, am pașaportul … .' },
      { ro: 'O am pe telefon. Este suficient?', en: 'Say the confirmation is on your phone and ask if it is enough.', fa: 'بگویید تأییدیه در تلفن است و کافی بودنش را بپرسید.', hint: 'O am pe telefon. Este …?' },
      { ro: 'Mai este nevoie de altceva?', en: 'Ask whether anything else is needed.', fa: 'بپرسید چیز دیگری لازم است؟', hint: 'Mai este nevoie de …?' },
    ],
  },
];

export function getAppointmentScenario(slug: string) { return appointmentScenarios.find(scenario => scenario.slug === slug); }

