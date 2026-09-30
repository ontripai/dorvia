export type VowelFoundationSlug = 'a' | 'e' | 'i' | 'o' | 'u';
export type VowelWordPosition = 'start' | 'middle' | 'end';

export type VowelSample = {
  wordId: string;
  displayForm?: string;
  position: VowelWordPosition;
  pronunciationFa: string;
  ipa: string;
  noteFa: string;
  noteEn: string;
};

export type VowelFoundationLessonData = {
  titleFa: string;
  titleEn: string;
  introFa: string;
  introEn: string;
  samples: [VowelSample, VowelSample, VowelSample];
  speakingPhrase: string;
  speakingFa: string;
  speakingEn: string;
  speakingNoteFa: string;
  speakingNoteEn: string;
};

export const VOWEL_FOUNDATION_LESSONS: Record<VowelFoundationSlug, VowelFoundationLessonData> = {
  a: {
    titleFa: 'صدای حرف A را یاد بگیر',
    titleEn: 'Learn the sound of A',
    introFa: 'صدای روشن a را تنها بشنو، سپس جای آن را در واژه و یک درخواست ساده پیدا کن.',
    introEn: 'Hear the clear vowel a on its own, then find it in words and a simple request.',
    samples: [
      { wordId: 'w-apa', position: 'start', pronunciationFa: 'آپَ', ipa: '/ˈa.pə/', noteFa: 'اسم مؤنث. برای آب به‌عنوان ماده معمولاً مفرد می‌آید؛ جمع ape برای آب‌ها یا انواع آب است.', noteEn: 'Feminine noun. Water as a substance is usually singular; plural ape refers to waters or types of water.' },
      { wordId: 'w-card', position: 'middle', pronunciationFa: 'کارد', ipa: '/kard/', noteFa: 'اسم خنثیِ قرض‌گرفته‌شده: un card؛ جمع carduri و صورت معرفهٔ cardul.', noteEn: 'Neuter loanword: un card; plural carduri and definite form cardul.' },
      { wordId: 'w-casa', displayForm: 'casa', position: 'end', pronunciationFa: 'کاسا', ipa: '/ˈka.sa/', noteFa: 'اینجا صورت معرفهٔ مفردِ casă است؛ a پایانی نشانهٔ حرف تعریف مؤنث است.', noteEn: 'Here this is the definite singular form of casă; final a marks the feminine article.' },
    ],
    speakingPhrase: 'O apă, vă rog.', speakingFa: 'یک آب، لطفاً.', speakingEn: 'A water, please.',
    speakingNoteFa: 'در کافه یا رستوران برای سفارش یک بطری آب به کار می‌رود.',
    speakingNoteEn: 'A natural request for a bottle of water in a café or restaurant.',
  },
  e: {
    titleFa: 'صدای حرف E را یاد بگیر',
    titleEn: 'Learn the sound of E',
    introFa: 'صدای e را تنها بشنو و سه جای آن را در واژه‌ها بررسی کن؛ حرف e در آغاز واژه ممکن است کمی لغزشِ آغازین داشته باشد.',
    introEn: 'Hear e on its own and find it in three positions. Word-initial e can have a slight glide in pronunciation.',
    samples: [
      { wordId: 'w-elev', position: 'start', pronunciationFa: 'یِلِو', ipa: '/jeˈlev/', noteFa: 'اسم مذکر: un elev؛ جمع elevi و صورت معرفهٔ elevul.', noteEn: 'Masculine noun: un elev; plural elevi and definite form elevul.' },
      { wordId: 'w-telefon', position: 'middle', pronunciationFa: 'تِلِفون', ipa: '/te.leˈfon/', noteFa: 'اسم خنثی: un telefon؛ جمع telefoane و صورت معرفهٔ telefonul.', noteEn: 'Neuter noun: un telefon; plural telefoane and definite form telefonul.' },
      { wordId: 'w-rece', position: 'end', pronunciationFa: 'رِچه', ipa: '/ˈre.t͡ʃe/', noteFa: 'صفت «سرد». در مفرد برای مذکر و مؤنث rece و در جمع reci است؛ با اسم هماهنگ می‌شود.', noteEn: 'Adjective meaning “cold”: rece for masculine and feminine singular, reci in the plural; it agrees with the noun.' },
    ],
    speakingPhrase: 'Elevul este aici.', speakingFa: 'دانش‌آموز اینجاست.', speakingEn: 'The pupil is here.',
    speakingNoteFa: 'elevul شکل معرفهٔ elev است؛ este یعنی «است» و aici یعنی «اینجا».',
    speakingNoteEn: 'Elevul is the definite form of elev; este means “is” and aici means “here”.',
  },
  i: {
    titleFa: 'صدای حرف I را یاد بگیر',
    titleEn: 'Learn the sound of I',
    introFa: 'واکهٔ i را تنها بشنو. در واژهٔ taxi، i پایانی واضح خوانده می‌شود؛ با i کم‌آوای بعضی صورت‌های جمع فرق دارد.',
    introEn: 'Hear vowel i on its own. Final i in taxi is clearly pronounced, unlike the reduced final i in some plural forms.',
    samples: [
      { wordId: 'w-inima', position: 'start', pronunciationFa: 'ای‌نیمَ', ipa: '/iˈni.mə/', noteFa: 'اسم مؤنث: o inimă؛ جمع inimi و صورت معرفهٔ inima.', noteEn: 'Feminine noun: o inimă; plural inimi and definite form inima.' },
      { wordId: 'w-bilet', position: 'middle', pronunciationFa: 'بی‌لِت', ipa: '/biˈlet/', noteFa: 'اسم خنثی: un bilet؛ جمع bilete و صورت معرفهٔ biletul.', noteEn: 'Neuter noun: un bilet; plural bilete and definite form biletul.' },
      { wordId: 'w-taxi', position: 'end', pronunciationFa: 'تاکسی', ipa: '/ˈtak.si/', noteFa: 'اسم خنثیِ قرض‌گرفته‌شده: un taxi؛ جمع taxiuri و صورت معرفهٔ taxiul. i پایانی این واژه شنیده می‌شود.', noteEn: 'Neuter loanword: un taxi; plural taxiuri and definite form taxiul. The final i is pronounced.' },
    ],
    speakingPhrase: 'Un taxi, vă rog.', speakingFa: 'یک تاکسی، لطفاً.', speakingEn: 'A taxi, please.',
    speakingNoteFa: 'یک درخواست کوتاه و مؤدبانه برای گرفتن تاکسی.',
    speakingNoteEn: 'A short, polite request for a taxi.',
  },
  o: {
    titleFa: 'صدای حرف O را یاد بگیر',
    titleEn: 'Learn the sound of O',
    introFa: 'صدای گرد و کوتاه o را تنها بشنو و آن را در آغاز، میانه و پایان واژه پیدا کن.',
    introEn: 'Hear the rounded vowel o on its own and find it at the beginning, middle and end of words.',
    samples: [
      { wordId: 'w-oras', position: 'start', pronunciationFa: 'اُراش', ipa: '/oˈraʃ/', noteFa: 'اسم خنثی: un oraș؛ جمع orașe و صورت معرفهٔ orașul.', noteEn: 'Neuter noun: un oraș; plural orașe and definite form orașul.' },
      { wordId: 'w-telefon', position: 'middle', pronunciationFa: 'تِلِفون', ipa: '/te.leˈfon/', noteFa: 'در telefon، حرف o در میانهٔ واژه است. اسم خنثی: un telefon؛ جمع telefoane.', noteEn: 'In telefon, o is medial. Neuter noun: un telefon; plural telefoane.' },
      { wordId: 'w-radio', position: 'end', pronunciationFa: 'رادی‌اُ', ipa: '/ˈra.di.o/', noteFa: 'اسم خنثی برای دستگاه/رسانه: un radio؛ جمع radiouri و صورت معرفهٔ radioul.', noteEn: 'Neuter noun for the device or medium: un radio; plural radiouri and definite form radioul.' },
    ],
    speakingPhrase: 'Orașul este mare.', speakingFa: 'شهر بزرگ است.', speakingEn: 'The city is large.',
    speakingNoteFa: 'orașul شکل معرفهٔ oraș است؛ mare صفتی است که با اسم مذکر مفرد هماهنگ شده.',
    speakingNoteEn: 'Orașul is the definite form of oraș; mare is the adjective agreeing with this singular noun.',
  },
  u: {
    titleFa: 'صدای حرف U را یاد بگیر',
    titleEn: 'Learn the sound of U',
    introFa: 'صدای u را تنها بشنو. در ghișeu، u در پایان واژه می‌آید و صدای مشخص خودش را دارد.',
    introEn: 'Hear u on its own. In ghișeu, final u has its own clear sound.',
    samples: [
      { wordId: 'w-unde', position: 'start', pronunciationFa: 'اوندِ', ipa: '/ˈun.de/', noteFa: 'قید پرسشیِ تغییرناپذیر: «کجا؟»؛ جنس و جمع ندارد.', noteEn: 'Invariable question adverb meaning “where”; it has no gender or plural.' },
      { wordId: 'w-ajutor', position: 'middle', pronunciationFa: 'اَژوتور', ipa: '/a.ʒuˈtor/', noteFa: 'اسم خنثی: un ajutor؛ جمع ajutoare و صورت معرفهٔ ajutorul.', noteEn: 'Neuter noun: un ajutor; plural ajutoare and definite form ajutorul.' },
      { wordId: 'w-ghiseu', position: 'end', pronunciationFa: 'گی‌شِئو', ipa: '/ɡiˈʃew/', noteFa: 'اسم خنثی: un ghișeu؛ جمع ghișee و صورت معرفهٔ ghișeul.', noteEn: 'Neuter noun: un ghișeu; plural ghișee and definite form ghișeul.' },
    ],
    speakingPhrase: 'Unde este ghișeul?', speakingFa: 'باجه کجاست؟', speakingEn: 'Where is the service counter?',
    speakingNoteFa: 'یک پرسش روزمره در اداره، ایستگاه یا محل ارائهٔ خدمات.',
    speakingNoteEn: 'A practical question at an office, station or service point.',
  },
};
