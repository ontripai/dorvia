/**
 * dre-p187 — سه قلم باز که هیچ‌کدام به آنتی‌گرویتی یا سهمیه ربط نداشتند
 *
 * ۱. گلاس فارسی `azi`/`astăzi` هر دو «امروز» بود و V31 فقط انگلیسی را می‌دید.
 * ۲. دو فعل تکراری `a fi` و `a avea`، و V33 که عمداً فقط published را می‌دید.
 * ۳. تعریف `register` در types.ts که با کاربردش در داده نمی‌خواند.
 *
 * قلم سوم آزمون ندارد — تغییرش یک کامنت است، و کامنت را نمی‌شود آزمود. ولی
 * سنجه‌ای که تعریف را اصلاح کرد **اینجا قفل می‌شود**: هیچ عبارت منتشرشده‌ی
 * `neutral` نباید صورت خطاب دوم‌شخص داشته باشد. اگر روزی داشت، یعنی یا برچسب
 * غلط است یا تعریف باید باز دوباره نوشته شود — و بهتر است بیلد بگوید.
 */
import {
  ALL_WORDS,
  ALL_PHRASES,
  ALL_VERBS,
  ALL_GRAPHEMES,
  ALL_DIALOGUES,
  ALL_DOMAINS,
} from '../src/content/romanian/registry';
import { validateRomanianContent } from '../src/lib/romanian/validator';
import type { RomanianValidationContext } from '../src/lib/romanian/validator';

function ctx(): RomanianValidationContext {
  return {
    phrases: JSON.parse(JSON.stringify(ALL_PHRASES)),
    words: JSON.parse(JSON.stringify(ALL_WORDS)),
    verbs: JSON.parse(JSON.stringify(ALL_VERBS)),
    graphemes: JSON.parse(JSON.stringify(ALL_GRAPHEMES)),
    dialogues: JSON.parse(JSON.stringify(ALL_DIALOGUES)),
    domains: JSON.parse(JSON.stringify(ALL_DOMAINS)),
  };
}

let failed = 0;
function check(name: string, ok: boolean, detail?: string) {
  if (ok) console.log(`[PASS] ${name}`);
  else {
    failed++;
    console.error(`[FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('============================================================');
console.log('DRE-P187 — PERSIAN GLOSS, VERB UNIQUENESS, REGISTER');
console.log('============================================================\n');

/* ------------------------------------------------ V31 — گلاس فارسی */

check(
  'GREEN V31: the live registry is clean in both languages',
  validateRomanianContent(ctx()).filter(e => e.rule === 'V31').length === 0
);

// قلبِ نقص: پیش از p187 این حالت واقعیِ داده بود و بیلد سبز می‌ماند.
{
  const c = ctx();
  const azi = c.words!.find(w => w.id === 'w-time-azi');
  const astazi = c.words!.find(w => w.id === 'w-time-astazi');
  if (!azi || !astazi) {
    failed++;
    console.error('[FAIL] Fixture missing: w-time-azi / w-time-astazi.');
  } else {
    check(
      'fixture: both Persian glosses start out disambiguated',
      /\(/.test(azi.translations.fa) && /\(/.test(astazi.translations.fa),
      `azi="${azi.translations.fa}" astăzi="${astazi.translations.fa}"`
    );
    azi.translations.fa = azi.translations.fa.replace(/\s*\([^)]*\)/, '');
    astazi.translations.fa = astazi.translations.fa.replace(/\s*\([^)]*\)/, '');
    const errs = validateRomanianContent(c).filter(e => e.rule === 'V31');
    check(
      'RED V31: collapsing the Persian glosses of azi/astăzi is caught',
      errs.length >= 2,
      `${errs.length} V31 error(s)`
    );
    check(
      'RED V31: the message says Persian, not English',
      errs.some(e => /Persian gloss/.test(e.message)),
      errs.map(e => e.message).join(' | ')
    );
    // انگلیسی هنوز رفع‌ابهام دارد، پس قاعده‌ی قدیم اینجا سبز می‌ماند:
    check(
      'RED V31: the English-only rule would have missed it',
      !errs.some(e => /English gloss/.test(e.message)),
      'an English error appeared, so this no longer isolates the Persian gap'
    );
  }
}

// زبان‌ها هرگز با هم مقایسه نمی‌شوند.
{
  const c = ctx();
  const w = c.words!.find(x => x.status === 'published' && x.translations?.en && x.translations?.fa);
  if (!w) throw new Error('Fixture missing: no published word with both glosses.');
  const clone = JSON.parse(JSON.stringify(w));
  clone.id = 'test-p187-cross-lang';
  clone.lemma = w.lemma + 'xx';
  clone.formOf = undefined;
  clone.status = 'published';
  // گلاس انگلیسیِ این مدخل را برابر گلاس فارسیِ همان مدخل می‌گذاریم.
  clone.translations.en = w.translations.fa;
  clone.translations.fa = 'یک معنای کاملاً دیگر که هیچ‌جا نیست';
  c.words!.push(clone);
  const errs = validateRomanianContent(c).filter(
    e => e.rule === 'V31' && e.entityId === 'test-p187-cross-lang'
  );
  check(
    'V31: an English gloss equal to some Persian gloss is not a collision',
    errs.length === 0,
    errs.map(e => e.message).join(' | ')
  );
}

/* ------------------------------------------------------ V33 — افعال */

check(
  'GREEN V33: no two verbs share an infinitive, in any status',
  validateRomanianContent(ctx()).filter(e => e.rule === 'V33').length === 0
);

check(
  'the two duplicate drafts are gone',
  !ALL_VERBS.some(v => v.id === 'v-core-a-fi' || v.id === 'v-core-a-avea'),
  ALL_VERBS.filter(v => /v-core-a-(fi|avea)$/.test(v.id)).map(v => v.id).join(', ')
);

// چیزی که حذف شد نباید چیزی را از دست داده باشد: هر دو مصدر هنوز در رجیستری‌اند.
for (const inf of ['a fi', 'a avea']) {
  const live = ALL_VERBS.filter(v => v.infinitive === inf && v.status === 'published');
  check(
    `"${inf}" is still published exactly once`,
    live.length === 1,
    `${live.length} published entries: ${live.map(v => v.id).join(', ')}`
  );
}

/* ------------------------------- register — سنجه‌ای که تعریف را اصلاح کرد */

/**
 * `\b` روی رومانیایی غلط است: ș و ă و â در ASCII «غیرواژه»‌اند، پس `\bte\b`
 * داخل «românește» جفت می‌شود — دقیقاً مثبت کاذبی که اولین اندازه‌گیری این
 * سنجه را خراب کرد. پس رشته به توکن شکسته می‌شود، نه با مرز واژه.
 */
const tokens = (ro: string): string[] =>
  ro.toLowerCase().split(/[^\p{L}\p{M}'-]+/u).filter(Boolean);

// فقط صورت‌های بی‌ابهام. «zi» (اسم: روز) و «spune» («se spune») عمداً بیرون‌اند.
const ADDRESS_FORMS = new Set([
  'tu', 'ție', 'ești', 'erai', 'vrei', 'poți', 'știi', 'te', 'ți', 'vino', 'stai',
  'dumneavoastră', 'dvs', 'vă', 'sunteți', 'aveți', 'puteți', 'vreți', 'știți',
]);

{
  const offenders: string[] = [];
  for (const p of ALL_PHRASES) {
    if (p.register !== 'neutral' || p.status !== 'published') continue;
    const hits = tokens(String(p.text?.ro ?? '')).filter(w => ADDRESS_FORMS.has(w));
    if (hits.length) offenders.push(`${p.id} ("${p.text.ro}" -> ${hits.join(', ')})`);
  }
  check(
    'no published "neutral" phrase carries a form of address',
    offenders.length === 0,
    offenders.join('; ')
  );
}

// و کنترل مثبت: توکن‌شکن واقعاً صورت خطاب را پیدا می‌کند.
check(
  'control: the tokeniser finds "vă" in "Vă rog."',
  tokens('Vă rog.').some(w => ADDRESS_FORMS.has(w))
);
check(
  'control: the tokeniser does NOT find "te" inside "românește"',
  !tokens('Nu vorbesc românește.').some(w => ADDRESS_FORMS.has(w))
);

/* ------------------------- خط فارسی فارسی می‌ماند: هیچ حرف لاتینی در گلاس فا

  اولین رفعِ قلم ۱ که نوشتم این بود: `امروز (= astăzi)` — عیناً همان الگوی
  انگلیسی. V31 را راضی می‌کرد و سبز هم شد، ولی **غلط بود**: یک صورت رومانیایی با
  دیاکریتیک را وسط رشته‌ی فارسیِ ترجمه‌پذیر می‌گذاشت، درست همان کاری که V35 در
  قطعه‌های `{t}` ممنوع کرده و به‌جایش `ref` می‌خواهد. سنجیدم و دیدم آن گلاس
  **تنها** گلاس فارسیِ کل رجیستری بود که دیاکریتیک رومانیایی داشت — یعنی الگو در
  این پیکره بیگانه است.

  جایش رفع‌ابهامی نشست که ادعای تازه‌ای نمی‌سازد و لاتین هم ندارد: «صورت کوتاه» و
  «صورت بلند». این همان چیزی است که `usageNote` از قبل با استناد می‌گفت
  («هم‌معنی کوتاه‌ترِ astăzi») و با نگاه به خود دو رشته هم راست است.

  این assertion همان اشتباه را می‌بندد، برای من و برای هر کس بعد از من.
*/
{
  const LATIN = /[A-Za-z\u0103\u00e2\u00ee\u015f\u0219\u0163\u021b\u0102\u00c2\u00ce\u015e\u0218\u0162\u021a]/;
  const PLACEHOLDER = /\{\{[^}]*\}\}/g;
  const offenders: string[] = [];
  const scan = (id: string, fa?: string) => {
    if (!fa) return;
    // {{name}} عمداً مستثناست — جایگزین است نه متن، و V39 خودش قیدش می‌زند.
    if (LATIN.test(fa.replace(PLACEHOLDER, ''))) offenders.push(`${id}: "${fa}"`);
  };
  for (const w of ALL_WORDS) if (w.status === 'published') scan(w.id, w.translations?.fa);
  for (const v of ALL_VERBS) if (v.status === 'published') scan(v.id, (v as { translations?: { fa?: string } }).translations?.fa);
  for (const p of ALL_PHRASES) if (p.status === 'published') scan(p.id, p.text?.fa);
  check(
    'no published Persian gloss carries Latin script outside a {{placeholder}}',
    offenders.length === 0,
    offenders.join('; ')
  );
  // کنترل مثبت: خودِ سنجه کار می‌کند.
  const probe: string[] = [];
  const LATIN_TEST = (fa: string) => LATIN.test(fa.replace(PLACEHOLDER, ''));
  check('control: the scanner flags "امروز (= astăzi)"', LATIN_TEST('امروز (= astăzi)'));
  check('control: the scanner passes "امروز (صورت کوتاه)"', !LATIN_TEST('امروز (صورت کوتاه)'));
  check('control: the scanner passes "اسم من {{name}} است."', !LATIN_TEST('اسم من {{name}} است.'));
  void probe;
}

/* ------------------------------------------- چرا آزمونِ سطحِ تمرین اینجا نیست

  اول یک سنجش سطح محصول نوشتم: «هیچ سؤال بازشناسی دو گزینه با یک گلاس فارسی
  نداشته باشد». سبز شد — و بعد آزمودمش با خراب‌کردن عمدی فیلترِ دیستراکتور در
  `exercise.ts`. **باز سبز ماند.** یعنی تاوتولوژی بود، و اگر نگهش می‌داشتم یک
  آزمون بی‌اثر را پوشش حساب کرده بودیم.

  دلیلش این است که `content.ts` هنگام import اعتبارسنجی را اجرا می‌کند و در خطا
  throw می‌کند. پس تصادم گلاس هرگز به تولیدکننده‌ی تمرین **نمی‌رسد**؛ V31 جلوتر
  از آن می‌ایستد. قطعی‌بودن و ساخت گزینه‌ها هم از قبل در سوئیت dre-p182 آزموده
  می‌شود.
*/

console.log('');
if (failed > 0) {
  console.error(`❌ DRE-P187: ${failed} assertion(s) failed.`);
  process.exit(1);
}
console.log('============================================================');
console.log('✅ ALL DRE-P187 TESTS PASSED!');
console.log('============================================================');
