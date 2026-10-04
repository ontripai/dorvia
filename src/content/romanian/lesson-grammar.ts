import { CORE_VERBS } from './core-verbs';
export type GrammarCopy = { fa: string; en: string };
export type GrammarExample = GrammarCopy & { ro: string };
export type GrammarTopic = { id: string; title: GrammarCopy; explanation: GrammarCopy; warning: GrammarCopy; headers: GrammarCopy[]; rows: string[][]; examples: GrammarExample[]; sources: { label: string; url: string }[]; bookPages: string };
const B = (fa: string, en: string): GrammarCopy => ({ fa, en });
const E = (ro: string, en: string, fa: string): GrammarExample => ({ ro, en, fa });
const dex = (...words: string[]) => words.map(word => ({ label: `dexonline · ${word}`, url: `https://dexonline.ro/definitie/${encodeURIComponent(word)}` }));
export const GRAMMAR_TOPICS: GrammarTopic[] = [
 { id:'gender', title:B('اسم: مذکر، مؤنث و خنثی؛ مفرد و جمع','Nouns: masculine, feminine, neuter; singular and plural'),
 explanation:B('جنس دستوری ویژگی اسم است؛ لزوماً جنسیت یک انسان نیست. اسم مذکر با un / doi، مؤنث با o / două و خنثی با un / două شناخته می‌شود. اسم خنثی در مفرد با الگوی مذکر و در جمع با الگوی مؤنث هماهنگ می‌شود. اسم را همراه جنس و جمعش یاد بگیرید، نه فقط معنی آن.', 'Grammatical gender belongs to the noun; it does not necessarily describe a person’s sex. Masculine nouns use un / doi, feminine nouns o / două, and neuter nouns un / două. Neuter agreement follows masculine singular and feminine plural patterns. Learn a noun with its gender and plural, not just its meaning.'),
 warning:B('پایان -ă اغلب نشانهٔ مؤنث است، اما قانون قطعی نیست؛ tată «پدر» مذکر است. جمع هم همیشه با افزودن یک پسوند ثابت ساخته نمی‌شود. جنس را از شکل مفرد و جمع و فرهنگ بررسی کنید.', 'Final -ă often suggests feminine gender, but it is not a reliable rule: tată (father) is masculine. Plurals do not all take one suffix. Check the singular, plural and dictionary.'),
 headers:[B('جنس','Gender'),B('یک','One'),B('دو','Two'),B('جمع معین','Definite plural')],rows:[['masculin','un frate','doi frați','frații'],['feminin','o cameră','două camere','camerele'],['neutru','un bilet','două bilete','biletele']],
 examples:[E('Am un bilet.','I have a ticket.','یک بلیت دارم.'),E('Am două bilete.','I have two tickets.','دو بلیت دارم.')],sources:dex('frate','cameră','bilet'),bookPages:'48–51' },
 { id:'articles', title:B('حرف تعریف: نامعین و معین','Articles: indefinite and definite'),
 explanation:B('وقتی چیزی را برای اولین بار معرفی می‌کنیم معمولاً un یا o می‌آوریم؛ برای جمع نامعین niște به معنی «چند/مقداری» کاربرد دارد. وقتی چیز مشخص یا شناخته‌شده است، حرف تعریف معین معمولاً به انتهای اسم می‌چسبد: bilet → biletul. این پسوند بخشی از اسمِ صرف‌شده است و جدا نوشته نمی‌شود.', 'Use un or o to introduce an unspecified item; niște can introduce an unspecified plural or amount. For an identified item, the definite article usually attaches to the noun: bilet → biletul. Write the attached article as part of the inflected noun.'),
 warning:B('un فقط برای مذکر نیست؛ اسم خنثیِ مفرد هم un می‌گیرد. niște همیشه «چند عدد» نیست: niște apă یعنی مقداری آب. پسوندهای جدول الگوهای نمونه‌اند، نه دستور همگانی برای همهٔ اسم‌ها.', 'Un also goes with neuter singular nouns. Niște does not always mean several countable items: niște apă means some water. These endings illustrate patterns, not a universal rule.'),
 headers:[B('اسم','Noun'),B('نامعین','Indefinite'),B('معین مفرد','Definite singular'),B('معین جمع','Definite plural')],rows:[['frate','un frate','fratele','frații'],['cameră','o cameră','camera','camerele'],['bilet','un bilet','biletul','biletele']],
 examples:[E('Unde este biletul?','Where is the ticket?','بلیتِ مشخص کجاست؟')],sources:dex('cameră','bilet','frate'),bookPages:'49–51, 62–63' },
 { id:'adjectives',title:B('صفت: هماهنگی با اسم و جای صفت','Adjectives: agreement and position'),
 explanation:B('صفت توصیفی معمولاً بعد از اسم می‌آید و با جنس و شمار همان اسم هماهنگ می‌شود. در «o cameră frumoasă»، cameră مؤنث مفرد است، پس frumoasă می‌آید. در «două bilete frumoase»، اسم خنثی جمع است، پس صفت شکل جمع مؤنث را می‌گیرد. صفت قبل از اسم هم ممکن است؛ گاهی تأکید، سبک یا معنی تغییر می‌کند.', 'Descriptive adjectives usually follow the noun and agree with its gender and number. Cameră is feminine singular, so use frumoasă. Neuter plural bilete takes feminine plural agreement: frumoase. Adjectives can precede nouns too; emphasis, style or meaning may change.'),
 warning:B('همهٔ صفت‌ها چهار شکل ندارند: mare / mari دو شکل دارد و در مفرد برای هر سه جنس mare است. obosit / obosită دربارهٔ شخص سخنگو تغییر می‌کند؛ Mi-e foame با جنس گوینده عوض نمی‌شود.', 'Not all adjectives have four forms: mare / mari has two, with mare for every singular gender. Obosit / obosită changes with the speaker’s gender; Mi-e foame does not.'),
 headers:[B('صفت','Adjective'),B('مفرد مذکر/خنثی','M./N. singular'),B('مفرد مؤنث','F. singular'),B('جمع مذکر','M. plural'),B('جمع مؤنث/خنثی','F./N. plural')],rows:[['beautiful','frumos','frumoasă','frumoși','frumoase'],['tired','obosit','obosită','obosiți','obosite'],['big','mare','mare','mari','mari'],['fresh','proaspăt','proaspătă','proaspeți','proaspete']],
 examples:[E('Sunt obosit.','I am tired (male speaker).','خسته‌ام؛ گویندهٔ مرد.'),E('Sunt obosită.','I am tired (female speaker).','خسته‌ام؛ گویندهٔ زن.'),E('Ce cameră frumoasă!','What a beautiful room!','چه اتاق زیبایی!')],sources:dex('frumos','mare','obosit','proaspăt'),bookPages:'66–67' },
 { id:'prepositions',title:B('حروف اضافه: مکان، مبدأ، همراهی و هدف','Prepositions: location, origin, accompaniment and purpose'),
 explanation:B('حرف اضافه رابطهٔ دو بخش جمله را مشخص می‌کند. în «داخل»، pe «روی»، sub «زیر»، lângă «کنار»، la «در/نزد/به» و din «از داخل/اهل» است؛ ترجمه با موقعیت تغییر می‌کند. cu همراهی یا وسیله و fără نبودن چیزی را نشان می‌دهد. de می‌تواند نوع یا کاربرد را بیان کند؛ de la مبدأ یک مکان و pentru هدف یا گیرنده را بیان می‌کند.', 'A preposition expresses a relationship. În means in, pe on, sub under, lângă beside, la at/to, and din from inside or origin; context determines the translation. Cu expresses accompaniment or means and fără absence. De can describe type or purpose; de la marks an origin and pentru a purpose or recipient.'),
 warning:B('هر «از» فارسی din نیست: din casă «از داخل خانه» و de la brutărie «از نانوایی» است. acasă یک قید به معنی «در خانه/به خانه» است، نه حرف اضافه. حرف تعریف پس از حرف اضافه به ساختار بستگی دارد: pe masă، اما pe masa din cameră؛ این دو را با یک قانون مکانیکی عوض نکنید.', 'Not every “from” is din: compare din casă (from inside the house) and de la brutărie (from the bakery). Acasă is an adverb, not a preposition. Article use after prepositions depends on the construction: pe masă, but pe masa din cameră.'),
 headers:[B('رابطه','Relationship'),B('نمونه رومانیایی','Romanian pattern'),B('معنی فارسی','Persian meaning'),B('معنی انگلیسی','English meaning')],rows:[['în','în cameră','داخل اتاق','in the room'],['pe','pe masă','روی میز','on the table'],['la','la cafenea','در/به کافه','at/to the café'],['lângă','lângă casă','کنار خانه','next to the house'],['din','din Iran','اهل ایران','from Iran'],['de la','de la brutărie','از نانوایی','from the bakery'],['cu / fără','cu lapte / fără zahăr','با شیر / بدون شکر','with milk / without sugar'],['de / pentru','o masă de cafea / pentru tine','میز قهوه / برای تو','a coffee table / for you']],
 examples:[E('Sunt din Iran.','I am from Iran.','اهل ایران هستم.'),E('Biletul este pe masă.','The ticket is on the table.','بلیت روی میز است.')],sources:dex('pe','de'),bookPages:'52–53, 63' },
 { id:'possession',title:B('مالکیت، مضاف و مضاف‌الیه','Possession, possessive forms and the genitive'),
 explanation:B('در فارسی «اتاقِ من» داریم؛ در رومانیایی camera mea. mea با اتاقِ مؤنث هماهنگ می‌شود، نه با جنس صاحب اتاق. برای نام صاحب، اسمِ صاحب شکل اضافی می‌گیرد: camera Anei «اتاق آنا» و camera lui Mihai «اتاق میهای». برای اسم عام: camera mamei «اتاق مادر». در این ساختارها نام چیزِ متعلق و نام صاحب دو نقش متفاوت دارند.', 'Romanian uses camera mea for my room. Mea agrees with the feminine room, not with the owner’s gender. A named owner uses the genitive: camera Anei and camera lui Mihai. A common noun owner also changes form: camera mamei. The possessed item and its owner have different grammatical roles.'),
 warning:B('meu / mea / mei / mele با چیزِ متعلق هماهنگ می‌شوند. اما lui «مال او، مرد» و ei «مال او، زن» صاحب را مشخص می‌کنند و با چیزِ متعلق عوض نمی‌شوند. نام‌های مؤنث همیشه یک الگو ندارند: Ana → Anei، اما lui Carmen. de به‌تنهایی جایگزین عمومیِ مضاف‌الیه نیست.', 'Meu / mea / mei / mele agree with the possessed item. Lui (his) and ei (her) identify the owner and do not change with the item. Feminine names have exceptions: Ana → Anei, but lui Carmen. De is not a general replacement for the genitive.'),
 headers:[B('چیزِ متعلق','Possessed item'),B('مال من','My'),B('مال تو','Your'),B('صاحب مشخص','Named owner')],rows:[['M./N. singular','fratele meu / biletul meu','fratele tău / biletul tău','biletul lui Mihai'],['F. singular','camera mea','camera ta','camera Anei'],['M. plural','frații mei','frații tăi','frații Anei'],['F./N. plural','camerele mele / biletele mele','camerele tale / biletele tale','camerele Anei']],
 examples:[E('Camera este a mea.','The room is mine.','اتاق مال من است.'),E('Camera Anei este mare.','Ana’s room is big.','اتاق آنا بزرگ است.')],sources:dex('meu','al','cameră'),bookPages:'152–155, 158–159' },
 { id:'genitive-article',title:B('al / a / ai / ale و شکل‌های اضافی','Al / a / ai / ale and genitive forms'),
 explanation:B('وقتی مالکیت به‌صورت مستقل بیان شود، یا چیزِ متعلق در ساختاری باشد که این حرف تعریف را لازم دارد، al / a / ai / ale می‌آید: biletul este al meu، camera este a mea. این شکل هم با چیزِ متعلق هماهنگ می‌شود. در «camera Anei» بعد از اسم معینِ بدون فاصله‌گذار معمولاً a نمی‌آوریم؛ اما «o cameră a Anei» ساختار دیگری است.', 'Al / a / ai / ale appears in standalone possession and constructions that require the possessive article: biletul este al meu, camera este a mea. It agrees with the possessed item. Do not add a mechanically to camera Anei; compare the different construction o cameră a Anei.'),
 warning:B('در «اتاقِ مادر»، mamei شکل صاحب است. در «اتاق مال من است»، a شکل مؤنث مفردِ چیزِ متعلق است. حالت اضافه (genitiv) مالکیت و رابطه را بیان می‌کند؛ حالت داتیو (dativ) معمولاً گیرنده را مشخص می‌کند. شکل‌هایشان گاهی یکسان است، ولی نقششان یکی نیست.', 'Mamei marks the owner; a in camera este a mea agrees with the feminine room. The genitive expresses possession or a relationship; the dative commonly marks a recipient. Their forms can coincide, but their functions differ.'),
 headers:[B('جنس و شمار چیز','Item gender/number'),B('صورت','Form'),B('نمونه','Example'),B('مالک نامعین','Indefinite owner')],rows:[['M./N. singular','al','biletul este al meu','biletul unui student'],['F. singular','a','camera este a mea','camera unei studente'],['M. plural','ai','frații sunt ai mei','frații unor studenți'],['F./N. plural','ale','biletele sunt ale mele','biletele unor studente']],
 examples:[E('Biletul este al meu.','The ticket is mine.','بلیت مال من است.')],sources:dex('al','meu'),bookPages:'158–159' },
 { id:'sentence',title:B('فاعل، مفعول، منفی‌سازی و سؤال','Subject, object, negation and questions'),
 explanation:B('در جملهٔ «Eu am un bilet»، eu فاعل، am فعل و un bilet مفعول مستقیم است. در «Camera este mare»، mare صفتی است که با کمک فعل بودن، اتاق را توصیف می‌کند؛ مفعول نیست. ترتیب معمولِ جملهٔ ساده فاعل + فعل + بقیه است، اما رومانیایی ترتیب انعطاف‌پذیر دارد. حذف ضمیر وقتی شخص از صرف فعل و بافت روشن است، طبیعی است.', 'In Eu am un bilet, eu is the subject, am the verb and un bilet the direct object. In Camera este mare, mare is a predicative adjective, not an object. Simple statements often use subject + verb + the rest, but Romanian word order is flexible. Omit a subject pronoun when the verb and context identify the person.'),
 warning:B('برای منفی‌سازی ساده nu پیش از فعل صرف‌شده می‌آید. در سؤال بله/خیر، ترتیب خبری می‌تواند باقی بماند و لحن عوض شود: Ai un bilet? سؤال‌های cine / unde / cum را با همان فراز پایانیِ همهٔ سؤال‌های بله/خیر نخوانید. سؤال و پاسخ باید دربارهٔ همان موقعیت باشند.', 'For simple negation, nu precedes the conjugated verb. A yes/no question can retain statement order with question intonation: Ai un bilet? Information questions with cine / unde / cum need not use the same final rise. Keep questions and replies tied to the situation.'),
 headers:[B('نقش','Role'),B('بخش جمله','Sentence part'),B('معنی فارسی','Persian meaning'),B('معنی انگلیسی','English meaning')],rows:[['subject','eu','من','I'],['verb','am','دارم','have'],['direct object','un bilet','یک بلیت','a ticket'],['negation','nu am','ندارم','do not have']],
 examples:[E('Nu am un bilet.','I do not have a ticket.','بلیت ندارم.'),E('Ai un bilet?','Do you have a ticket?','بلیت داری؟')],sources:dex('fi','avea'),bookPages:'26–31, 78–79' },
];
export const GRAMMAR_PERSONS = ['eu','tu','el / ea','noi','voi','ei / ele'];
export const GRAMMAR_VERBS = [
 {lemma:'a fi',meaning:B('بودن','to be'),forms:['sunt','ești','este','suntem','sunteți','sunt'],past:'fost',source:'fi',tokens:['sunt','ești','este','e','suntem','sunteți']},
 {lemma:'a avea',meaning:B('داشتن','to have'),forms:['am','ai','are','avem','aveți','au'],past:'avut',source:'avea',tokens:['am','ai','are','avem','aveți','au']},
 {lemma:'a intra',meaning:B('داخل شدن','to enter'),forms:['intru','intri','intră','intrăm','intrați','intră'],past:'intrat',source:'intra',tokens:['intru','intri','intră','intrăm','intrați']},
 {lemma:'a merge',meaning:B('رفتن','to go'),forms:['merg','mergi','merge','mergem','mergeți','merg'],past:'mers',source:'merge',tokens:['merg','mergi','merge','mergem','mergeți']},
 {lemma:'a pune',meaning:B('گذاشتن','to put'),forms:['pun','pui','pune','punem','puneți','pun'],past:'pus',source:'pune',tokens:['pun','pui','pune','punem','puneți']},
 {lemma:'a cumpăra',meaning:B('خریدن','to buy'),forms:['cumpăr','cumperi','cumpără','cumpărăm','cumpărați','cumpără'],past:'cumpărat',source:'cumpăra',tokens:['cumpăr','cumperi','cumpără','cumpărăm','cumpărați','cumpărat']},
 {lemma:'a aduce',meaning:B('آوردن','to bring'),forms:['aduc','aduci','aduce','aducem','aduceți','aduc'],past:'adus',source:'aduce',tokens:['aduc','aduci','aduce','aducem','aduceți','adu']},
 {lemma:'a plăti',meaning:B('پرداخت کردن','to pay'),forms:['plătesc','plătești','plătește','plătim','plătiți','plătesc'],past:'plătit',source:'plati',tokens:['plătesc','plătești','plătește','plătim','plătiți','plăti']},
];
export const GRAMMAR_NOUNS = [
 {lemma:'bagaj',gender:'n',plural:'bagaje',definite:'bagajul',forms:['bagaj','bagajul']},
 {lemma:'bilet',gender:'n',plural:'bilete',definite:'biletul',forms:['bilet','biletul','bilete','biletele']},
 {lemma:'cameră',gender:'f',plural:'camere',definite:'camera',forms:['cameră','camera','camere']},
 {lemma:'pat',gender:'n',plural:'paturi',definite:'patul',forms:['pat','patul']},
 {lemma:'familie',gender:'f',plural:'familii',definite:'familia',forms:['familie','familia']},
 {lemma:'frate',gender:'m',plural:'frați',definite:'fratele',forms:['frate','fratele','frați']},
 {lemma:'soră',gender:'f',plural:'surori',definite:'sora',forms:['soră','sora','surori']},
 {lemma:'cafenea',gender:'f',plural:'cafenele',definite:'cafeneaua',forms:['cafenea','cafeneaua']},
 {lemma:'masă',gender:'f',plural:'mese',definite:'masa',forms:['masă','masa']},
 {lemma:'pâine',gender:'f',plural:'pâini',definite:'pâinea',forms:['pâine','pâinea','pâini']},
];
export function grammarWords(text:string) { return new Set(text.normalize('NFC').toLocaleLowerCase('ro-RO').match(/[\p{L}]+/gu) ?? []); }
export function grammarVerbsFor(text:string,foundation:boolean) {
 if(foundation)return GRAMMAR_VERBS.slice(0,2);
 const words=grammarWords(text);
 const extra=CORE_VERBS.filter(v=>!GRAMMAR_VERBS.some(g=>g.lemma===v.infinitive)).map(v=>({
   lemma:v.infinitive,meaning:{fa:v.translations.fa,en:v.translations.en},
   forms:Object.values(v.conjugation.prezent),past:v.participiu ?? '',
   source:v.infinitive.slice(2),tokens:Object.values(v.conjugation.prezent),
 }));
 return [...GRAMMAR_VERBS,...extra].filter(v=>v.tokens.some(t=>words.has(t)));
}
export function isGrammarLessonPath(path:string) {
 const route=path.replace(/^\/(?:fa|en)\/learn-romanian\/?/u,'');
 return /^(?:fundamente|alfabet)\/[^/]+\/?$/u.test(route) || /^lectie\/(?!tema(?:\/|$))[^/]+(?:\/[^/]+)?\/?$/u.test(route);
}
