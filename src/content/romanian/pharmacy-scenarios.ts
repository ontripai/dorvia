export type LocalizedPhrase = { ro: string; en: string; fa: string };
export type PharmacyScenario = {
  slug: string; title: { fa: string; en: string }; goal: { fa: string; en: string };
  dialogue: (LocalizedPhrase & { who: 'you' | 'pharmacist' })[];
  rules: { title: { fa: string; en: string }; explanation: { fa: string; en: string }; examples: LocalizedPhrase[] }[];
  tasks: (LocalizedPhrase & { hint: string })[];
};

export const pharmacyScenarios: PharmacyScenario[] = [
  {
    slug: 'durere-cap', title: { fa: 'سردرد در داروخانه', en: 'A headache at the pharmacy' },
    goal: { fa: 'علائم را ساده بیان کنید، دربارهٔ گزینه‌ها بپرسید و از داروساز توضیح بخواهید.', en: 'Describe a symptom, ask about options, and request an explanation from the pharmacist.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua!', en: 'Hello!', fa: 'سلام!' },
      { who: 'you', ro: 'Mă doare capul.', en: 'I have a headache.', fa: 'سرم درد می‌کند.' },
      { who: 'you', ro: 'Aveți ceva pentru durere de cap?', en: 'Do you have anything for a headache?', fa: 'چیزی برای سردرد دارید؟' },
      { who: 'pharmacist', ro: 'De când vă doare capul?', en: 'How long have you had the headache?', fa: 'از چه زمانی سرتان درد می‌کند؟' },
      { who: 'you', ro: 'De azi dimineață.', en: 'Since this morning.', fa: 'از امروز صبح.' },
      { who: 'you', ro: 'Ce opțiuni am?', en: 'What options do I have?', fa: 'چه گزینه‌هایی دارم؟' },
      { who: 'pharmacist', ro: 'Vă explic opțiunile.', en: 'I will explain the options.', fa: 'گزینه‌ها را برایتان توضیح می‌دهم.' },
    ],
    rules: [
      { title: { fa: 'بیان درد: Mă doare + عضو بدن', en: 'Describe pain: Mă doare + body part' }, explanation: { fa: 'Mă یعنی «مرا» و doare شکل سوم‌شخص مفرد فعل a durea است. در Mă doare capul، capul («سر») با حرف تعریف معین در پایان آمده است. این الگو برای یک عضو مفرد بدن به کار می‌رود؛ در این درس فقط همین نمونه را تمرین کنید.', en: 'Mă means “me”; doare is the third-person singular of a durea. Capul is the definite form of “head”. This pattern describes pain in one singular body part; practise this example first.' }, examples: [{ ro: 'Mă doare capul.', en: 'I have a headache.', fa: 'سرم درد می‌کند.' }] },
      { title: { fa: 'پرسیدن دربارهٔ گزینه‌ها', en: 'Ask about options' }, explanation: { fa: 'Aveți شکل مؤدبانهٔ «دارید؟» است. ceva یعنی «چیزی» و pentru durere de cap یعنی «برای سردرد». می‌توانید بدون درخواست داروی مشخص، سؤال کنید چه گزینه‌هایی دارید: Ce opțiuni am? در این جمله am صورت «من دارم» از a avea است.', en: 'Aveți is the polite “do you have?”; ceva means “anything”, and pentru durere de cap means “for a headache”. Ask Ce opțiuni am? (“What options do I have?”) without naming a medicine. Am is “I have” from a avea.' }, examples: [{ ro: 'Aveți ceva pentru durere de cap?', en: 'Do you have anything for a headache?', fa: 'چیزی برای سردرد دارید؟' }, { ro: 'Ce opțiuni am?', en: 'What options do I have?', fa: 'چه گزینه‌هایی دارم؟' }] },
      { title: { fa: 'پاسخ به پرسش زمان', en: 'Answer a question about time' }, explanation: { fa: 'De când? یعنی «از چه زمانی؟». برای پاسخ کوتاه، de + زمان می‌آید: De azi dimineață. یعنی «از امروز صبح». زمان واقعی علائم را به داروساز بگویید.', en: 'De când? asks “Since when?” A short answer uses de + time: De azi dimineață. means “Since this morning.” Tell the pharmacist the actual duration.' }, examples: [{ ro: 'De azi dimineață.', en: 'Since this morning.', fa: 'از امروز صبح.' }] },
    ],
    tasks: [
      { ro: 'Mă doare capul.', en: 'Say that you have a headache.', fa: 'بگویید سرتان درد می‌کند.', hint: 'Mă doare … .' },
      { ro: 'De azi dimineață.', en: 'Say “since this morning”.', fa: 'بگویید «از امروز صبح».', hint: 'De azi … .' },
      { ro: 'Ce opțiuni am?', en: 'Ask what options you have.', fa: 'بپرسید چه گزینه‌هایی دارید.', hint: 'Ce … am?' },
    ],
  },
  {
    slug: 'arsura', title: { fa: 'توضیح سوختگی', en: 'Explaining a burn' },
    goal: { fa: 'محل سوختگی را بگویید، درخواست بررسی کنید و نام وسایل لازم را از داروساز بپرسید.', en: 'Describe where a burn is, ask for an assessment, and ask the pharmacist about supplies.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua!', en: 'Hello!', fa: 'سلام!' },
      { who: 'you', ro: 'Am o arsură la mână.', en: 'I have a burn on my hand.', fa: 'روی دستم سوختگی دارم.' },
      { who: 'you', ro: 'Puteți să vă uitați, vă rog?', en: 'Could you take a look, please?', fa: 'می‌توانید لطفاً نگاهی بیندازید؟' },
      { who: 'pharmacist', ro: 'Vă rog să îmi arătați.', en: 'Please show me.', fa: 'لطفاً به من نشان دهید.' },
      { who: 'you', ro: 'De ce materiale am nevoie?', en: 'What supplies do I need?', fa: 'به چه لوازمی نیاز دارم؟' },
      { who: 'pharmacist', ro: 'Vă explic după ce mă uit.', en: 'I will explain after I take a look.', fa: 'بعد از بررسی توضیح می‌دهم.' },
    ],
    rules: [
      { title: { fa: 'بیان مشکل و محل آن', en: 'Describe the problem and its location' }, explanation: { fa: 'Am صورت «من دارم» از a avea است. o arsură یعنی «یک سوختگی» و la mână محل آن را مشخص می‌کند. در مراجعهٔ واقعی، محل و وضعیت را دقیق و صادقانه بیان کنید.', en: 'Am means “I have” from a avea. O arsură is “a burn”; la mână locates it on the hand. Give an accurate description of the actual situation.' }, examples: [{ ro: 'Am o arsură la mână.', en: 'I have a burn on my hand.', fa: 'روی دستم سوختگی دارم.' }] },
      { title: { fa: 'درخواست مؤدبانهٔ بررسی', en: 'Politely ask for an assessment' }, explanation: { fa: 'Puteți صورت مؤدبانهٔ «می‌توانید؟» از a putea است. پس از آن să + فعل می‌آید: să vă uitați یعنی «نگاه کنید». vă rog درخواست را مؤدبانه می‌کند.', en: 'Puteți is the polite “can you?” from a putea. It is followed by să + verb: să vă uitați means “to take a look”. Vă rog makes the request polite.' }, examples: [{ ro: 'Puteți să vă uitați, vă rog?', en: 'Could you take a look, please?', fa: 'می‌توانید لطفاً نگاهی بیندازید؟' }] },
      { title: { fa: 'پرسیدن دربارهٔ لوازم', en: 'Ask about supplies' }, explanation: { fa: 'De ce materiale am nevoie? یعنی «به چه لوازمی نیاز دارم؟». ساختار a avea nevoie de («نیاز داشتن به») در این پرسش با de ce در آغاز جمله آمده است. انتخاب لوازم به بررسی فرد متخصص بستگی دارد؛ این درس محصولی تجویز نمی‌کند.', en: 'De ce materiale am nevoie? means “What supplies do I need?” It uses a avea nevoie de (“to need”), with de ce at the start of the question. Ask a qualified professional what is appropriate; the lesson does not choose products.' }, examples: [{ ro: 'De ce materiale am nevoie?', en: 'What supplies do I need?', fa: 'به چه لوازمی نیاز دارم؟' }] },
    ],
    tasks: [
      { ro: 'Am o arsură la mână.', en: 'Say you have a burn on your hand.', fa: 'بگویید روی دستتان سوختگی دارید.', hint: 'Am o … la mână.' },
      { ro: 'Puteți să vă uitați, vă rog?', en: 'Politely ask the pharmacist to take a look.', fa: 'مؤدبانه بخواهید نگاهی بیندازد.', hint: 'Puteți să vă …, vă rog?' },
      { ro: 'De ce materiale am nevoie?', en: 'Ask what supplies you need.', fa: 'دربارهٔ لوازم لازم سؤال کنید.', hint: 'De ce … am nevoie?' },
    ],
  },
  {
    slug: 'vitamine', title: { fa: 'پرسیدن دربارهٔ ویتامین‌ها', en: 'Asking about vitamins' },
    goal: { fa: 'بگویید برای چه کسی می‌پرسید، گزینه‌ها را بخواهید و برچسب محصول را بررسی کنید.', en: 'Say whom you are asking for, ask about options, and check a product label.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua!', en: 'Hello!', fa: 'سلام!' },
      { who: 'you', ro: 'Caut informații despre vitamine.', en: 'I am looking for information about vitamins.', fa: 'دربارهٔ ویتامین‌ها اطلاعات می‌خواهم.' },
      { who: 'pharmacist', ro: 'Pentru cine?', en: 'For whom?', fa: 'برای چه کسی؟' },
      { who: 'you', ro: 'Pentru mine.', en: 'For me.', fa: 'برای خودم.' },
      { who: 'you', ro: 'Ce variante aveți?', en: 'What options do you have?', fa: 'چه گزینه‌هایی دارید؟' },
      { who: 'you', ro: 'Pot să citesc eticheta?', en: 'May I read the label?', fa: 'می‌توانم برچسب را بخوانم؟' },
      { who: 'pharmacist', ro: 'Da, desigur.', en: 'Yes, of course.', fa: 'بله، حتماً.' },
    ],
    rules: [
      { title: { fa: 'درخواست اطلاعات، بدون نام بردن محصول', en: 'Ask for information without naming a product' }, explanation: { fa: 'Caut یعنی «جست‌وجو می‌کنم» از a căuta. informații جمع «اطلاعات» است و despre یعنی «دربارهٔ». Caut informații despre vitamine. به داروساز می‌گوید ابتدا می‌خواهید اطلاعات بگیرید.', en: 'Caut means “I am looking for” from a căuta. Informații is plural “information”, and despre means “about”. This sentence asks for information first.' }, examples: [{ ro: 'Caut informații despre vitamine.', en: 'I am looking for information about vitamins.', fa: 'دربارهٔ ویتامین‌ها اطلاعات می‌خواهم.' }] },
      { title: { fa: 'برای چه کسی؟', en: 'For whom?' }, explanation: { fa: 'Pentru cine? یعنی «برای چه کسی؟». پاسخ کوتاه Pentru mine. یعنی «برای خودم». برای محصول واقعی، مشخصات فرد و شرایط مرتبط را به داروساز بگویید.', en: 'Pentru cine? means “For whom?” The short answer Pentru mine. means “For me.” Give the pharmacist the relevant facts about the intended person.' }, examples: [{ ro: 'Pentru mine.', en: 'For me.', fa: 'برای خودم.' }] },
      { title: { fa: 'گزینه‌ها و برچسب', en: 'Options and labels' }, explanation: { fa: 'Ce variante aveți? یعنی «چه گزینه‌هایی دارید؟»؛ aveți شکل مؤدبانهٔ a avea است. Pot să citesc eticheta? یعنی «می‌توانم برچسب را بخوانم؟»؛ pot + să + فعل، توانایی یا اجازه را می‌پرسد. eticheta شکل معین «برچسب» است.', en: 'Ce variante aveți? asks “What options do you have?” Aveți is the polite form of a avea. Pot să citesc eticheta? asks permission to read the label; pot + să + verb expresses “may I/can I”. Eticheta is “the label”.' }, examples: [{ ro: 'Ce variante aveți?', en: 'What options do you have?', fa: 'چه گزینه‌هایی دارید؟' }, { ro: 'Pot să citesc eticheta?', en: 'May I read the label?', fa: 'می‌توانم برچسب را بخوانم؟' }] },
    ],
    tasks: [
      { ro: 'Caut informații despre vitamine.', en: 'Say you are looking for information about vitamins.', fa: 'بگویید دربارهٔ ویتامین‌ها اطلاعات می‌خواهید.', hint: 'Caut informații despre … .' },
      { ro: 'Pentru mine.', en: 'Answer “for me”.', fa: 'پاسخ دهید «برای خودم».', hint: 'Pentru … .' },
      { ro: 'Pot să citesc eticheta?', en: 'Ask to read the label.', fa: 'اجازهٔ خواندن برچسب را بخواهید.', hint: 'Pot să citesc …?' },
    ],
  },
  {
    slug: 'igiena', title: { fa: 'لوازم بهداشتی و مراقبتی', en: 'Hygiene and care products' },
    goal: { fa: 'شامپو و کرم دست را پیدا کنید و دربارهٔ نوع محصول و قیمت بپرسید.', en: 'Find shampoo and hand cream, then ask about a product type and price.' },
    dialogue: [
      { who: 'you', ro: 'Bună ziua!', en: 'Hello!', fa: 'سلام!' },
      { who: 'you', ro: 'Caut un șampon pentru păr uscat.', en: 'I am looking for a shampoo for dry hair.', fa: 'شامپویی برای موی خشک می‌خواهم.' },
      { who: 'pharmacist', ro: 'Avem mai multe variante.', en: 'We have several options.', fa: 'چند گزینه داریم.' },
      { who: 'you', ro: 'Aveți și o cremă de mâini?', en: 'Do you also have a hand cream?', fa: 'کرم دست هم دارید؟' },
      { who: 'pharmacist', ro: 'Da, este aici.', en: 'Yes, it is here.', fa: 'بله، اینجاست.' },
      { who: 'you', ro: 'Cât costă?', en: 'How much does it cost?', fa: 'چقدر قیمت دارد؟' },
      { who: 'pharmacist', ro: 'Prețul este pe etichetă.', en: 'The price is on the label.', fa: 'قیمت روی برچسب است.' },
    ],
    rules: [
      { title: { fa: 'نوع محصول: برای + ویژگی', en: 'Product type: for + feature' }, explanation: { fa: 'Caut یعنی «دنبالِ ... هستم». șampon اسم خنثی است و در مفرد un می‌گیرد. pentru păr uscat یعنی «برای موی خشک»؛ صفت uscat پس از اسم păr آمده است. این فقط نمونه‌ای برای یادگیری توصیف محصول است.', en: 'Caut means “I am looking for”. Șampon is neuter and takes un in the singular. Pentru păr uscat means “for dry hair”; the adjective uscat follows păr. This is an example of describing a product.' }, examples: [{ ro: 'Caut un șampon pentru păr uscat.', en: 'I am looking for a shampoo for dry hair.', fa: 'شامپویی برای موی خشک می‌خواهم.' }] },
      { title: { fa: 'پرسیدن دربارهٔ محصول دوم', en: 'Ask about another product' }, explanation: { fa: 'Aveți یعنی «دارید؟» در خطاب مؤدبانه. și در این جمله «هم/نیز» است. cremă اسم مؤنث و o cremă شکل «یک کرم» است. de mâini نوع آن را مشخص می‌کند: کرم دست.', en: 'Aveți is polite “do you have?” Și means “also” here. Cremă is feminine, so o cremă means “a cream”. De mâini specifies “hand cream”.' }, examples: [{ ro: 'Aveți și o cremă de mâini?', en: 'Do you also have a hand cream?', fa: 'کرم دست هم دارید؟' }] },
      { title: { fa: 'پرسیدن قیمت و خواندن برچسب', en: 'Ask the price and read the label' }, explanation: { fa: 'Cât costă? یعنی «چقدر قیمت دارد؟». در Prețul este pe etichetă، prețul شکل معین «قیمت»، este «است» و pe etichetă «روی برچسب» است. قیمت واقعی را از روی برچسب همان محصول بررسی کنید.', en: 'Cât costă? means “How much does it cost?” In Prețul este pe etichetă, prețul is “the price”, este is “is”, and pe etichetă is “on the label”. Check the actual product label for its price.' }, examples: [{ ro: 'Prețul este pe etichetă.', en: 'The price is on the label.', fa: 'قیمت روی برچسب است.' }] },
    ],
    tasks: [
      { ro: 'Caut un șampon pentru păr uscat.', en: 'Ask for shampoo for dry hair.', fa: 'شامپو برای موی خشک بخواهید.', hint: 'Caut un șampon pentru … .' },
      { ro: 'Aveți și o cremă de mâini?', en: 'Ask whether they also have hand cream.', fa: 'بپرسید کرم دست هم دارند؟', hint: 'Aveți și o …?' },
      { ro: 'Cât costă?', en: 'Ask how much it costs.', fa: 'قیمت را بپرسید.', hint: 'Cât …?' },
    ],
  },
];

export function getPharmacyScenario(slug: string) { return pharmacyScenarios.find(scenario => scenario.slug === slug); }
