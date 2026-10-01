import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import ts from 'typescript';
import { ALL_WORDS, ALL_PHRASES, ALL_GRAPHEMES } from '../src/content/romanian/registry';
import { additionalFoundationLessons } from '../src/content/romanian/additional-foundation-lessons';
import { VOWEL_FOUNDATION_LESSONS } from '../src/content/romanian/vowel-foundation-lessons';
import { CIRCUMFLEX_FOUNDATION_LESSON } from '../src/content/romanian/circumflex-foundation-lesson';
import { FINAL_I_FOUNDATION_LESSON } from '../src/content/romanian/final-i-foundation-lesson';
import { NUMBER_GENDER_FOUNDATION_LESSON } from '../src/content/romanian/number-gender-foundation-lesson';

// Only published, fixed lesson text is eligible. User answers are never sent to Azure.
const texts = new Set<string>();
function add(value: unknown) {
  if (typeof value !== 'string') return;
  const text = value.normalize('NFC').trim();
  if (text && text.length <= 300 && !/[\u0600-\u06ff]|https?:|[…]|\.\.\.|[\/·+]|,.*,/u.test(text)
    && !/^(?:half past two|Monday, Tuesday, Wednesday|Saturday, Sunday|Thursday, Friday|today, tomorrow, now|person|place|manner|thing|weekend|kü|b d f l m n p t z|Da, eu am Ana\.|Da, eu ești Ana\.)$/i.test(text)) texts.add(text);
}
for (const word of ALL_WORDS) add(word.lemma);
for (const phrase of ALL_PHRASES) add(phrase.text.ro);
for (const grapheme of ALL_GRAPHEMES) add(grapheme.grapheme);

function collect(value: unknown, parentKey = '') {
  if (Array.isArray(value)) { value.forEach(v => collect(v, parentKey)); return; }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (['ro', 'answer', 'speakingPhrase', 'finalInfinitive', 'displayForm', 'lemma', 'grapheme'].includes(key)) add(child);
    if (key === 'cells' && Array.isArray(child)) child.forEach(add);
    if (child && typeof child === 'object') collect(child, key);
  }
}
for (const source of [additionalFoundationLessons, VOWEL_FOUNDATION_LESSONS, CIRCUMFLEX_FOUNDATION_LESSON, FINAL_I_FOUNDATION_LESSON, NUMBER_GENDER_FOUNDATION_LESSON]) collect(source);

// Alphabet readings, ticket dialogues, and sentence examples also live in TSX.
const sourceDirs = ['src/components/romanian', 'src/app/[lang]/learn-romanian'];
const keys = new Set(['ro', 'sentence', 'name', 'sound', 'word', 'speakingPhrase', 'answer']);
function visitFile(filename: string) {
  const source = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node) && keys.has(node.name.getText(source).replace(/['"]/g, '')) && ts.isStringLiteral(node.initializer)) add(node.initializer.text);
    if (ts.isJsxAttribute(node) && node.name.text === 'label' && node.initializer && ts.isStringLiteral(node.initializer)) add(node.initializer.text);
    ts.forEachChild(node, visit);
  }
  visit(source);
}
function walk(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(name);
    else if (/\.tsx?$/.test(name)) visitFile(name);
  }
}
sourceDirs.forEach(walk);
// Complete the short alphabet syllables and letter names used by generated routes.
for (const sound of ['a','ă','â','î','e','i','o','u','be','de','ef','el','em','en','pe','te','zet','ba','da','fa','la','ma','na','pa','ta','za']) add(sound);
const original = JSON.parse(fs.readFileSync('scripts/romanian-audio-catalog.json', 'utf8')) as Array<{text:string;slug:string;approved:boolean}>;
const catalog = new Map(original.map(item => [item.text, item]));
for (const text of texts) if (!catalog.has(text)) catalog.set(text, { text, slug: `ro-${crypto.createHash('sha256').update(text).digest('hex').slice(0, 16)}`, approved: true });
const output = [...catalog.values()].sort((a,b) => a.text.localeCompare(b.text, 'ro'));
fs.writeFileSync('scripts/romanian-audio-catalog.json', JSON.stringify(output, null, 2) + '\n');
console.log(`${output.length} exact Romanian recordings catalogued.`);
