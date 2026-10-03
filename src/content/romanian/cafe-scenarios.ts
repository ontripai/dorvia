import type { EverydayScenario } from '@/components/romanian/EverydayScenarioLesson';

export const cafeScenarios: EverydayScenario[] = [
  {
    slug: 'mic-dejun', title: { fa: 'صبحانه در کافه', en: 'Breakfast at a café' },
    goal: { fa: 'برای صبحانه نوشیدنی و خوراکی بخواهید و به پرسش پیشخدمت پاسخ دهید.', en: 'Order a drink and something to eat for breakfast, then answer the server.' },
    dialogue: [
      { who: 'you', ro: 'Bună dimineața!', en: 'Good morning!', fa: 'صبح بخیر!' },
      { who: 'server', ro: 'Ce doriți?', en: 'What would you like?', fa: 'چه میل دارید؟' },
      { who: 'you', ro: 'Aș dori un ceai și un croissant, vă rog.', en: 'I would like a tea and a croissant, please.', fa: 'لطفاً یک چای و یک کروسان می‌خواهم.' },
      { who: 'server', ro: 'Doriți și apă?', en: 'Would you like water too?', fa: 'آب هم می‌خواهید؟' },
      { who: 'you', ro: 'Da, o apă plată, vă rog.', en: 'Yes, still water, please.', fa: 'بله، لطفاً یک آب بدون گاز.' },
      { who: 'server', ro: 'Sigur. Poftiți!', en: 'Certainly. Here you are!', fa: 'حتماً. بفرمایید!' },
    ],
    rules: [
      { title: { fa: 'درخواست مؤدبانه: Aș dori', en: 'Polite request: Aș dori' }, explanation: { fa: 'Aș dori یعنی «مایلم/می‌خواهم» و در سفارش مؤدبانه‌تر از vreau است. نام چیز درخواستی را پس از آن بیاورید و در پایان vă rog بگویید.', en: 'Aș dori means “I would like” and is a polite way to order. Put the item after it and add vă rog (“please”) at the end.' }, examples: [{ ro: 'Aș dori un ceai și un croissant, vă rog.', en: 'I would like a tea and a croissant, please.', fa: 'لطفاً یک چای و یک کروسان می‌خواهم.' }] },
      { title: { fa: 'یک، و، هم', en: 'One, and, also' }, explanation: { fa: 'ceai و croissant در این کاربرد با un می‌آیند. آب (apă) اسم مؤنث است و با o می‌آید. și بین دو قلم یعنی «و»؛ در Doriți și apă? معنی «هم» می‌دهد.', en: 'Ceai and croissant take un here. Apă (“water”) is feminine and takes o. Și joins two items as “and”; in Doriți și apă? it means “also”.' }, examples: [{ ro: 'Doriți și apă?', en: 'Would you like water too?', fa: 'آب هم می‌خواهید؟' }, { ro: 'Da, o apă plată, vă rog.', en: 'Yes, still water, please.', fa: 'بله، لطفاً یک آب بدون گاز.' }] },
      { title: { fa: 'فهمیدن پرسش پیشخدمت', en: 'Understand the server' }, explanation: { fa: 'Ce یعنی «چه» و doriți صورت مؤدبانهٔ «میل دارید» است. وقتی پیشخدمت Ce doriți? می‌پرسد، پاسخ را با Aș dori آغاز کنید.', en: 'Ce means “what”; doriți is the polite “would you like”. When the server asks Ce doriți?, begin your reply with Aș dori.' }, examples: [{ ro: 'Ce doriți?', en: 'What would you like?', fa: 'چه میل دارید؟' }] },
    ],
    tasks: [
      { ro: 'Aș dori un ceai și un croissant, vă rog.', en: 'Politely order tea and a croissant.', fa: 'چای و کروسان را مؤدبانه سفارش دهید.', hint: 'Aș dori un ceai și …, vă rog.' },
      { ro: 'Da, o apă plată, vă rog.', en: 'Also ask for still water.', fa: 'آب بدون گاز هم بخواهید.', hint: 'Da, o apă …, vă rog.' },
      { ro: 'Bună dimineața!', en: 'Greet the server in the morning.', fa: 'صبح به پیشخدمت سلام کنید.', hint: 'Bună …!' },
    ],
  },
  {
    slug: 'schimbare-comanda', title: { fa: 'تغییر در سفارش', en: 'Changing an order' },
    goal: { fa: 'قهوه را بدون شیر یا شکر بخواهید و اشتباه در سفارش را مؤدبانه اصلاح کنید.', en: 'Order coffee without milk or sugar and politely correct an order.' },
    dialogue: [
      { who: 'you', ro: 'Aș dori o cafea fără lapte, vă rog.', en: 'I would like a coffee without milk, please.', fa: 'لطفاً یک قهوه بدون شیر می‌خواهم.' },
      { who: 'server', ro: 'Cu zahăr?', en: 'With sugar?', fa: 'با شکر؟' },
      { who: 'you', ro: 'Nu, fără zahăr, vă rog.', en: 'No, without sugar, please.', fa: 'نه، لطفاً بدون شکر.' },
      { who: 'server', ro: 'Poftiți cafeaua cu lapte.', en: 'Here is the coffee with milk.', fa: 'بفرمایید قهوه با شیر.' },
      { who: 'you', ro: 'Scuzați-mă, am cerut cafea fără lapte.', en: 'Excuse me, I asked for coffee without milk.', fa: 'ببخشید، قهوه بدون شیر خواسته بودم.' },
      { who: 'server', ro: 'Îmi pare rău. O schimb imediat.', en: 'I am sorry. I will change it right away.', fa: 'متأسفم. همین حالا عوضش می‌کنم.' },
    ],
    rules: [
      { title: { fa: 'با و بدون', en: 'With and without' }, explanation: { fa: 'cu یعنی «با» و fără یعنی «بدون». بعد از آنها نام ماده می‌آید: cu lapte / fără lapte، cu zahăr / fără zahăr. برای جلوگیری از اشتباه، ویژگی مورد نظر را همان هنگام سفارش بگویید.', en: 'Cu means “with”; fără means “without”. Follow either with the ingredient: cu lapte / fără lapte, cu zahăr / fără zahăr. State the preference when ordering.' }, examples: [{ ro: 'Aș dori o cafea fără lapte, vă rog.', en: 'I would like a coffee without milk, please.', fa: 'لطفاً یک قهوه بدون شیر می‌خواهم.' }, { ro: 'Nu, fără zahăr, vă rog.', en: 'No, without sugar, please.', fa: 'نه، لطفاً بدون شکر.' }] },
      { title: { fa: 'اصلاح مؤدبانه', en: 'Correct politely' }, explanation: { fa: 'Scuzați-mă یعنی «ببخشید». am cerut گذشتهٔ فعل a cere برای «من درخواست کردم» است. پس از آن سفارش درست را بگویید: cafea fără lapte. این ساختار به صورت روشن اشتباه را بیان می‌کند.', en: 'Scuzați-mă means “excuse me”. Am cerut is the past form “I asked for” from a cere. Then say the correct item, cafea fără lapte, to state the mismatch clearly.' }, examples: [{ ro: 'Scuzați-mă, am cerut cafea fără lapte.', en: 'Excuse me, I asked for coffee without milk.', fa: 'ببخشید، قهوه بدون شیر خواسته بودم.' }] },
      { title: { fa: 'پاسخ کوتاه به سؤال', en: 'Short answer to a question' }, explanation: { fa: 'در سؤال کوتاه Cu zahăr? فعل حذف شده، اما منظور «با شکر میل دارید؟» است. می‌توانید با Nu, fără zahăr, vă rog. پاسخ دهید؛ لازم نیست کل سفارش را تکرار کنید.', en: 'Cu zahăr? is a short question meaning “With sugar?” You can answer Nu, fără zahăr, vă rog. without repeating the whole order.' }, examples: [{ ro: 'Cu zahăr?', en: 'With sugar?', fa: 'با شکر؟' }] },
    ],
    tasks: [
      { ro: 'Aș dori o cafea fără lapte, vă rog.', en: 'Order coffee without milk.', fa: 'قهوهٔ بدون شیر سفارش دهید.', hint: 'Aș dori o cafea fără … .' },
      { ro: 'Nu, fără zahăr, vă rog.', en: 'Answer that you do not want sugar.', fa: 'بگویید شکر نمی‌خواهید.', hint: 'Nu, fără …, vă rog.' },
      { ro: 'Scuzați-mă, am cerut cafea fără lapte.', en: 'Politely explain that you asked for coffee without milk.', fa: 'مؤدبانه بگویید قهوه بدون شیر خواسته‌اید.', hint: 'Scuzați-mă, am cerut … .' },
    ],
  },
  {
    slug: 'plata', title: { fa: 'صورتحساب و پرداخت', en: 'Bill and payment' },
    goal: { fa: 'صورتحساب بخواهید، روش پرداخت را بپرسید و رسید بگیرید.', en: 'Ask for the bill, check a payment method, and request the receipt.' },
    dialogue: [
      { who: 'you', ro: 'Nota, vă rog.', en: 'The bill, please.', fa: 'لطفاً صورتحساب.' },
      { who: 'server', ro: 'Sigur. Poftiți nota.', en: 'Certainly. Here is the bill.', fa: 'حتماً. بفرمایید صورتحساب.' },
      { who: 'you', ro: 'Pot plăti cu cardul?', en: 'Can I pay by card?', fa: 'می‌توانم با کارت پرداخت کنم؟' },
      { who: 'server', ro: 'Da, puteți plăti cu cardul.', en: 'Yes, you can pay by card.', fa: 'بله، می‌توانید با کارت پرداخت کنید.' },
      { who: 'you', ro: 'Îmi dați bonul, vă rog?', en: 'Could you give me the receipt, please?', fa: 'لطفاً رسید را به من می‌دهید؟' },
      { who: 'server', ro: 'Poftiți bonul. Mulțumesc!', en: 'Here is the receipt. Thank you!', fa: 'بفرمایید رسید. متشکرم!' },
    ],
    rules: [
      { title: { fa: 'صورتحساب و رسید', en: 'Bill and receipt' }, explanation: { fa: 'nota صورتحساب مبلغ سفارش است؛ bonul رسید پرداخت است. در پایان غذا Nota, vă rog. بگویید و پس از پرداخت برای رسید از bonul استفاده کنید.', en: 'Nota is the bill showing what you owe; bonul is the receipt after payment. Ask Nota, vă rog. at the end, then ask for bonul after paying.' }, examples: [{ ro: 'Nota, vă rog.', en: 'The bill, please.', fa: 'لطفاً صورتحساب.' }, { ro: 'Îmi dați bonul, vă rog?', en: 'Could you give me the receipt, please?', fa: 'لطفاً رسید را به من می‌دهید؟' }] },
      { title: { fa: 'پرسش دربارهٔ پرداخت با کارت', en: 'Ask about paying by card' }, explanation: { fa: 'Pot صورت اول‌شخص a putea («می‌توانم») است. پس از آن مصدر کوتاه plăti («پرداخت کردن») می‌آید. cu cardul یعنی «با کارت». برای پرداخت نقدی عبارت în numerar به کار می‌رود.', en: 'Pot is “I can” from a putea. It is followed by the short infinitive plăti (“pay”). Cu cardul means “by card”; în numerar means “in cash”.' }, examples: [{ ro: 'Pot plăti cu cardul?', en: 'Can I pay by card?', fa: 'می‌توانم با کارت پرداخت کنم؟' }] },
      { title: { fa: 'درخواست رسید', en: 'Request a receipt' }, explanation: { fa: 'Îmi یعنی «به من» و dați صورت مؤدبانهٔ «می‌دهید» است. Îmi dați bonul, vă rog? یک پرسش مؤدبانه برای دریافت رسید است. پاسخ Poftiți bonul. یعنی «بفرمایید رسید».', en: 'Îmi means “to me”; dați is polite “give”. Îmi dați bonul, vă rog? politely requests the receipt. Poftiți bonul. means “Here is the receipt.”' }, examples: [{ ro: 'Poftiți bonul. Mulțumesc!', en: 'Here is the receipt. Thank you!', fa: 'بفرمایید رسید. متشکرم!' }] },
    ],
    tasks: [
      { ro: 'Nota, vă rog.', en: 'Ask for the bill.', fa: 'صورتحساب بخواهید.', hint: 'Nota, … .' },
      { ro: 'Pot plăti cu cardul?', en: 'Ask if you can pay by card.', fa: 'بپرسید آیا می‌توانید با کارت پرداخت کنید.', hint: 'Pot plăti cu …?' },
      { ro: 'Îmi dați bonul, vă rog?', en: 'Politely ask for the receipt.', fa: 'مؤدبانه رسید بخواهید.', hint: 'Îmi dați …, vă rog?' },
    ],
  },
];

export function getCafeScenario(slug: string) { return cafeScenarios.find(scenario => scenario.slug === slug); }
