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
  {
    slug: 'masa', title: { fa: 'میز، منو و سفارش در سالن', en: 'A table, the menu and dining in' },
    goal: { fa: 'برای دو نفر میز بخواهید، منو را بگیرید و سفارش را با پیشخدمت روشن کنید.', en: 'Ask for a table for two, request the menu, and clarify your order.' },
    dialogue: [
      { who: 'you', ro: 'Bună seara. Aveți o masă pentru două persoane?', en: 'Good evening. Do you have a table for two?', fa: 'عصر بخیر. برای دو نفر میز دارید؟' },
      { who: 'server', ro: 'Da, avem o masă lângă fereastră.', en: 'Yes, we have a table by the window.', fa: 'بله، کنار پنجره یک میز داریم.' },
      { who: 'you', ro: 'Este bine. Ne aduceți meniul, vă rog?', en: 'That works. Could you bring us the menu, please?', fa: 'خوب است. لطفاً منو را برایمان می‌آورید؟' },
      { who: 'server', ro: 'Sigur. Doriți ceva de băut?', en: 'Certainly. Would you like something to drink?', fa: 'حتماً. نوشیدنی میل دارید؟' },
      { who: 'you', ro: 'Două ape plate, vă rog.', en: 'Two still waters, please.', fa: 'لطفاً دو آب بدون گاز.' },
      { who: 'server', ro: 'Și ce doriți de mâncare?', en: 'And what would you like to eat?', fa: 'و برای غذا چه میل دارید؟' },
      { who: 'you', ro: 'Aș dori supa de legume.', en: 'I would like the vegetable soup.', fa: 'سوپ سبزیجات می‌خواهم.' },
      { who: 'server', ro: 'O supă de legume. Mai doriți ceva?', en: 'One vegetable soup. Would you like anything else?', fa: 'یک سوپ سبزیجات. چیز دیگری می‌خواهید؟' },
      { who: 'you', ro: 'Nu acum, mulțumesc. Acesta este tot.', en: 'Not now, thank you. That is all.', fa: 'فعلاً نه، ممنون. همین است.' },
    ],
    rules: [
      { title: { fa: 'درخواست میز برای چند نفر', en: 'Ask for a table' }, explanation: { fa: 'o masă برای «یک میز» و pentru două persoane برای «برای دو نفر» است. از Aveți ...? برای پرسیدن موجود بودن میز استفاده کنید.', en: 'O masă means “a table”; pentru două persoane means “for two people”. Use Aveți ...? to ask whether one is available.' }, examples: [{ ro: 'Aveți o masă pentru două persoane?', en: 'Do you have a table for two?', fa: 'برای دو نفر میز دارید؟' }] },
      { title: { fa: 'منو را برای ما بیاورید', en: 'Bring us the menu' }, explanation: { fa: 'Ne یعنی «به ما/برای ما» و پیش از aduceți می‌آید. meniul شکل معینِ meniu است. vă rog درخواست را مؤدبانه می‌کند.', en: 'Ne means “to us” and precedes aduceți. Meniul is the definite form of meniu. Vă rog makes the request polite.' }, examples: [{ ro: 'Ne aduceți meniul, vă rog?', en: 'Could you bring us the menu, please?', fa: 'لطفاً منو را برایمان می‌آورید؟' }] },
      { title: { fa: 'نوشیدنی و غذا', en: 'Drink and food' }, explanation: { fa: 'ceva de băut یعنی «چیزی برای نوشیدن» و de mâncare یعنی «برای خوردن». در پاسخ، تعداد را قبل از اسم بیاورید: două ape plate.', en: 'Ceva de băut means “something to drink”; de mâncare means “to eat”. Put a number before an item: două ape plate.' }, examples: [{ ro: 'Două ape plate, vă rog.', en: 'Two still waters, please.', fa: 'لطفاً دو آب بدون گاز.' }] },
    ],
    tasks: [
      { ro: 'Aveți o masă pentru două persoane?', en: 'Ask for a table for two.', fa: 'برای دو نفر میز بخواهید.', hint: 'Aveți o masă pentru ...?' },
      { ro: 'Ne aduceți meniul, vă rog?', en: 'Ask the server to bring the menu.', fa: 'از پیشخدمت منو بخواهید.', hint: 'Ne aduceți ...?' },
      { ro: 'Două ape plate, vă rog.', en: 'Order two still waters.', fa: 'دو آب بدون گاز سفارش دهید.', hint: 'Două ape ...' },
      { ro: 'Aș dori supa de legume.', en: 'Order vegetable soup.', fa: 'سوپ سبزیجات سفارش دهید.', hint: 'Aș dori ...' },
    ],
  },
  {
    slug: 'ingrediente', title: { fa: 'مواد غذا و حساسیت', en: 'Ingredients and an allergy' },
    goal: { fa: 'مواد غذا را بپرسید، حساسیت خود را روشن بیان کنید و از بررسی آشپزخانه مطمئن شوید.', en: 'Ask about ingredients, state an allergy clearly, and request a kitchen check.' },
    dialogue: [
      { who: 'you', ro: 'Scuzați-mă, ce ingrediente are această supă?', en: 'Excuse me, what ingredients does this soup contain?', fa: 'ببخشید، این سوپ چه موادی دارد؟' },
      { who: 'server', ro: 'Are legume și smântână.', en: 'It contains vegetables and cream.', fa: 'سبزیجات و خامه دارد.' },
      { who: 'you', ro: 'Am alergie la lapte. Conține și alte produse lactate?', en: 'I have a milk allergy. Does it contain other dairy products?', fa: 'به شیر حساسیت دارم. لبنیات دیگری هم دارد؟' },
      { who: 'server', ro: 'Nu știu sigur. Verific la bucătărie.', en: 'I am not certain. I will check with the kitchen.', fa: 'مطمئن نیستم. از آشپزخانه بررسی می‌کنم.' },
      { who: 'you', ro: 'Vă rog să verificați și sosul.', en: 'Please check the sauce too.', fa: 'لطفاً سس را هم بررسی کنید.' },
      { who: 'server', ro: 'Bucătarul spune că sosul conține unt.', en: 'The chef says the sauce contains butter.', fa: 'آشپز می‌گوید سس کره دارد.' },
      { who: 'you', ro: 'Atunci nu pot mânca acest fel. Aveți altă opțiune?', en: 'Then I cannot eat this dish. Do you have another option?', fa: 'پس نمی‌توانم این غذا را بخورم. گزینهٔ دیگری دارید؟' },
      { who: 'server', ro: 'Pot întreba despre o salată fără sos.', en: 'I can ask about a salad without dressing.', fa: 'می‌توانم دربارهٔ سالاد بدون سس بپرسم.' },
      { who: 'you', ro: 'Mulțumesc. Vă rog să confirmați ingredientele înainte de comandă.', en: 'Thank you. Please confirm the ingredients before I order.', fa: 'ممنون. لطفاً پیش از سفارش مواد آن را تأیید کنید.' },
    ],
    rules: [
      { title: { fa: 'پرسیدن مواد تشکیل‌دهنده', en: 'Ask about ingredients' }, explanation: { fa: 'Ce ingrediente are ...? یعنی «... چه موادی دارد؟». conține یعنی «حاوی است» و برای پرسیدن دربارهٔ مادهٔ مشخص مفید است.', en: 'Ce ingrediente are ...? asks what an item contains. Conține means “contains” and helps ask about a specific ingredient.' }, examples: [{ ro: 'Ce ingrediente are această supă?', en: 'What ingredients does this soup contain?', fa: 'این سوپ چه موادی دارد؟' }] },
      { title: { fa: 'بیان واضح حساسیت', en: 'State an allergy clearly' }, explanation: { fa: 'Am alergie la ... یعنی «به ... حساسیت دارم». موضوع را روشن بگویید و از کارکنان بخواهید مواد غذا و سس را بررسی کنند؛ حدس دربارهٔ ایمنی غذا کافی نیست.', en: 'Am alergie la ... clearly states an allergy. Ask staff to check both food and sauce ingredients rather than assuming safety.' }, examples: [{ ro: 'Am alergie la lapte.', en: 'I have a milk allergy.', fa: 'به شیر حساسیت دارم.' }] },
      { title: { fa: 'درخواست بررسی و تأیید', en: 'Request a check and confirmation' }, explanation: { fa: 'Vă rog să verificați ... یعنی «لطفاً ... را بررسی کنید». قبل از ثبت سفارش، با să confirmați ingredientele تأیید روشن بخواهید.', en: 'Vă rog să verificați ... asks someone to check. Before ordering, request explicit confirmation with să confirmați ingredientele.' }, examples: [{ ro: 'Vă rog să verificați și sosul.', en: 'Please check the sauce too.', fa: 'لطفاً سس را هم بررسی کنید.' }] },
    ],
    tasks: [
      { ro: 'Ce ingrediente are această supă?', en: 'Ask about the soup ingredients.', fa: 'مواد سوپ را بپرسید.', hint: 'Ce ingrediente ...?' },
      { ro: 'Am alergie la lapte.', en: 'State a milk allergy.', fa: 'حساسیت به شیر را بیان کنید.', hint: 'Am alergie ...' },
      { ro: 'Vă rog să verificați și sosul.', en: 'Ask staff to check the sauce too.', fa: 'بررسی سس را هم درخواست کنید.', hint: 'Vă rog să ...' },
      { ro: 'Mulțumesc. Vă rog să confirmați ingredientele înainte de comandă.', en: 'Ask for confirmation before ordering.', fa: 'پیش از سفارش تأیید مواد را بخواهید.', hint: 'Mulțumesc. Vă rog să ...' },
    ],
  },
  {
    slug: 'la-pachet', title: { fa: 'سفارش بیرون‌بر', en: 'Ordering takeaway' },
    goal: { fa: 'غذای بیرون‌بر سفارش دهید، زمان آماده‌شدن را بپرسید و اقلام سفارش را هنگام تحویل بررسی کنید.', en: 'Order takeaway, ask when it will be ready, and check the items at pickup.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua. Aș dori un sandviș la pachet.', en: 'Hello. I would like a sandwich to take away.', fa: 'سلام. یک ساندویچ بیرون‌بر می‌خواهم.' },
      { who: 'server', ro: 'Sigur. Ce fel de sandviș doriți?', en: 'Certainly. What kind of sandwich would you like?', fa: 'حتماً. چه نوع ساندویچی می‌خواهید؟' },
      { who: 'you', ro: 'Un sandviș cu legume, fără brânză, vă rog.', en: 'A vegetable sandwich without cheese, please.', fa: 'لطفاً یک ساندویچ سبزیجات بدون پنیر.' },
      { who: 'server', ro: 'Doriți și o băutură?', en: 'Would you like a drink too?', fa: 'نوشیدنی هم می‌خواهید؟' },
      { who: 'you', ro: 'Da, o apă plată. Când este gata comanda?', en: 'Yes, a still water. When will the order be ready?', fa: 'بله، یک آب بدون گاز. سفارش چه وقت آماده می‌شود؟' },
      { who: 'server', ro: 'În aproximativ zece minute. Vă dau un număr de comandă.', en: 'In about ten minutes. I will give you an order number.', fa: 'حدود ده دقیقه دیگر. یک شمارهٔ سفارش به شما می‌دهم.' },
      { who: 'you', ro: 'Mulțumesc. Pot plăti acum cu cardul?', en: 'Thank you. Can I pay by card now?', fa: 'ممنون. می‌توانم الان با کارت پرداخت کنم؟' },
      { who: 'server', ro: 'Da. Poftiți comanda: un sandviș și o apă.', en: 'Yes. Here is your order: one sandwich and one water.', fa: 'بله. بفرمایید سفارش شما: یک ساندویچ و یک آب.' },
      { who: 'you', ro: 'Este fără brânză, corect? Mulțumesc!', en: 'It is without cheese, correct? Thank you!', fa: 'بدون پنیر است، درست است؟ ممنون!' },
    ],
    rules: [
      { title: { fa: 'سفارش بیرون‌بر', en: 'Takeaway order' }, explanation: { fa: 'la pachet یعنی «بیرون‌بر». آن را پس از نام خوراکی بیاورید. با fără brânză می‌توانید پنیر را حذف کنید.', en: 'La pachet means “to take away”. Put it after the item. Use fără brânză to request no cheese.' }, examples: [{ ro: 'Aș dori un sandviș la pachet.', en: 'I would like a sandwich to take away.', fa: 'یک ساندویچ بیرون‌بر می‌خواهم.' }] },
      { title: { fa: 'زمان آماده‌شدن', en: 'When it will be ready' }, explanation: { fa: 'Când este gata comanda? زمان آماده‌شدن سفارش را می‌پرسد. în aproximativ zece minute یعنی «حدود ده دقیقه دیگر».', en: 'Când este gata comanda? asks when the order will be ready. În aproximativ zece minute means “in about ten minutes”.' }, examples: [{ ro: 'Când este gata comanda?', en: 'When will the order be ready?', fa: 'سفارش چه وقت آماده می‌شود؟' }] },
      { title: { fa: 'تأیید جزئیات هنگام تحویل', en: 'Check at pickup' }, explanation: { fa: 'هنگام تحویل ویژگی مهم سفارش را با Este fără ... , corect? بررسی کنید. corect? یعنی «درست است؟» و پاسخ روشن می‌خواهد.', en: 'At pickup, check a key requirement with Este fără ... , corect? Corect? asks for a clear confirmation.' }, examples: [{ ro: 'Este fără brânză, corect? Mulțumesc!', en: 'It is without cheese, correct? Thank you!', fa: 'بدون پنیر است، درست است؟ ممنون!' }] },
    ],
    tasks: [
      { ro: 'Aș dori un sandviș la pachet.', en: 'Order a takeaway sandwich.', fa: 'ساندویچ بیرون‌بر بخواهید.', hint: 'Aș dori ... la pachet.' },
      { ro: 'Un sandviș cu legume, fără brânză, vă rog.', en: 'Specify vegetables and no cheese.', fa: 'سبزیجات و بدون پنیر بودن را مشخص کنید.', hint: 'Un sandviș cu ... fără ...' },
      { ro: 'Da, o apă plată. Când este gata comanda?', en: 'Add water and ask when it will be ready.', fa: 'آب اضافه کنید و زمان آماده‌شدن را بپرسید.', hint: 'Da, o apă plată. Când ...?' },
      { ro: 'Este fără brânză, corect? Mulțumesc!', en: 'Confirm it has no cheese at pickup.', fa: 'موقع تحویل نبود پنیر را تأیید کنید.', hint: 'Este fără ... corect?' },
    ],
  },
];

export function getCafeScenario(slug: string) { return cafeScenarios.find(scenario => scenario.slug === slug); }
