/**
 * dre-p186 — آزمون جای خالی.
 *
 * نقصی که این تسک بست روی سایت زنده بود: عبارت `Mă numesc {{name}}.` عیناً با
 * همان آکولادها به یادگیرنده نشان داده می‌شد، در حالی که صدایش جای خالی را
 * حذف می‌کرد. نوشته و صدا با هم نمی‌خواندند.
 */
import { splitPlaceholders, spokenForm, hasPlaceholder } from '../src/lib/romanian/placeholders';
import { validateRomanianContent } from '../src/lib/romanian/validator';
import {
  ALL_WORDS, ALL_VERBS, ALL_GRAPHEMES, ALL_PHRASES, ALL_DIALOGUES, ALL_DOMAINS,
} from '../src/content/romanian/registry';

let failed = 0;
const check = (n: string, ok: boolean, d?: string) => {
  if (ok) console.log(`[PASS] ${n}`);
  else { failed++; console.error(`[FAIL] ${n}${d ? ` — ${d}` : ''}`); }
};
const ctx = () => ({
  phrases: JSON.parse(JSON.stringify(ALL_PHRASES)),
  words: JSON.parse(JSON.stringify(ALL_WORDS)),
  verbs: JSON.parse(JSON.stringify(ALL_VERBS)),
  graphemes: JSON.parse(JSON.stringify(ALL_GRAPHEMES)),
  dialogues: JSON.parse(JSON.stringify(ALL_DIALOGUES)),
  domains: JSON.parse(JSON.stringify(ALL_DOMAINS)),
});

console.log('============================================================');
console.log('DRE-P186 — PLACEHOLDERS');
console.log('============================================================\n');

const segs = splitPlaceholders('Mă numesc {{name}}.');
check('the sentence splits into text, slot, text', segs.length === 3, JSON.stringify(segs));
check('the slot carries its name', 'slot' in segs[1] && segs[1].slot === 'name');
check('text before the slot is kept', 't' in segs[0] && segs[0].t === 'Mă numesc ');
check('text after the slot is kept', 't' in segs[2] && segs[2].t === '.');
check('a sentence with no placeholder is one segment', splitPlaceholders('Bună ziua!').length === 1);
check('empty input gives no segments', splitPlaceholders('').length === 0);
check('two slots both survive', splitPlaceholders('{{a}} and {{b}}').filter(s => 'slot' in s).length === 2);
check('hasPlaceholder detects one', hasPlaceholder('Mă numesc {{name}}.'));
check('hasPlaceholder is false otherwise', !hasPlaceholder('Bună ziua!'));

// متن گفتاری باید دقیقاً همان باشد که صدا با آن ساخته شد
check('the spoken form drops the slot and its trailing stop',
  spokenForm('Mă numesc {{name}}.') === 'Mă numesc', `"${spokenForm('Mă numesc {{name}}.')}"`);
check('the spoken form of a plain sentence is unchanged',
  spokenForm('Bună ziua!') === 'Bună ziua', `"${spokenForm('Bună ziua!')}"`);

// V39 روی داده‌ی واقعی
check('published content passes V39', validateRomanianContent(ctx()).filter(e => e.rule === 'V39').length === 0);

// قرمز: جای خالی ناشناس
{
  const c = ctx();
  const target = c.phrases.find((p: any) => p.id === 'p-core-ma-numesc');
  check('the placeholder phrase exists in the registry', !!target);
  if (target) {
    target.text.ro = 'Mă numesc {{naem}}.';
    target.text.en = 'My name is {{naem}}.';
    target.text.fa = 'نام من {{naem}} است.';
    const errs = validateRomanianContent(c).filter(e => e.rule === 'V39');
    check('V39 catches a typo in the placeholder name', errs.length > 0,
      'a typo here would reach the learner without failing any build');
  }
}

// قرمز: جای خالی فقط در یک زبان
{
  const c = ctx();
  const target = c.phrases.find((p: any) => p.id === 'p-core-ma-numesc');
  if (target) {
    target.text.fa = 'نام من است.';
    const errs = validateRomanianContent(c).filter(e => e.rule === 'V39');
    check('V39 catches a placeholder missing from one language', errs.length > 0,
      errs.map(e => e.message).join(' | '));
  }
}

// سبز: هیچ عبارتی جای خالی نداشته باشد
{
  const c = ctx();
  for (const p of c.phrases) for (const k of ['ro', 'en', 'fa'])
    if (p.text?.[k]) p.text[k] = String(p.text[k]).replace(/\{\{[^}]*\}\}/g, 'X');
  check('content with no placeholders at all passes V39',
    validateRomanianContent(c).filter(e => e.rule === 'V39').length === 0);
}

console.log('');
if (failed > 0) { console.error(`❌ DRE-P186: ${failed} assertion(s) failed.`); process.exit(1); }
console.log('============================================================');
console.log('✅ ALL DRE-P186 PLACEHOLDER TESTS PASSED!');
console.log('============================================================');
