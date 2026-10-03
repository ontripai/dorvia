// Check every recorded text surfaced by published learning modules and staged dialogues.
// Run with: node --import tsx scripts/auditRomanianVerifiedAudio.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import manifest from '../src/content/romanian/verified-audio.json' with { type: 'json' };
import catalog from './romanian-audio-catalog.json' with { type: 'json' };
import { ALL_WORDS, ALL_PHRASES } from '../src/content/romanian/registry.ts';
import { spokenForm } from '../src/lib/romanian/placeholders.ts';
import { additionalFoundationLessons } from '../src/content/romanian/additional-foundation-lessons.ts';

const required = new Set();
const add = text => { if (text?.trim()) required.add(text.normalize('NFC').trim()); };
for (const word of ALL_WORDS.filter(x => x.status === 'published')) add(word.lemma);
for (const phrase of ALL_PHRASES.filter(x => x.status === 'published')) {
  add(phrase.text.ro.includes('{{') ? spokenForm(phrase.text.ro) : phrase.text.ro);
  add(phrase.informalVariant?.ro);
}
for (const lesson of Object.values(additionalFoundationLessons)) {
  for (const rule of lesson.rules) for (const example of rule.examples) add(example.ro);
  for (const task of lesson.practice) add(task.answer);
}

function scan(file, visitNode) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = node => { visitNode(node, source); ts.forEachChild(node, visit); };
  visit(source);
}
for (const file of ['src/components/romanian/ShopLesson.tsx', 'src/components/romanian/DirectionsLesson.tsx', 'src/components/romanian/CafeLesson.tsx', 'src/components/romanian/AppointmentLesson.tsx']) {
  scan(file, (node, source) => {
    if (ts.isObjectLiteralExpression(node)) {
      const field = node.properties.find(p => ts.isPropertyAssignment(p) && p.name.getText(source) === 'ro');
      if (field && ts.isStringLiteral(field.initializer)) add(field.initializer.text);
    }
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'example' && ts.isStringLiteral(node.arguments[0])) add(node.arguments[0].text);
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(source) === 'Example') {
      const field = node.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.text === 'ro');
      if (field && ts.isStringLiteral(field.initializer)) add(field.initializer.text);
    }
  });
}
scan('src/components/romanian/CGPatternPractice.tsx', (node, source) => {
  if (!ts.isPropertyAssignment(node) || node.name.getText(source) !== 'syllables' || !ts.isArrayLiteralExpression(node.initializer)) return;
  for (const item of node.initializer.elements) if (ts.isStringLiteral(item)) add(item.text);
});
const catalogSet = new Set(catalog.map(item => item.text));
const missingCatalog = [...required].filter(text => !catalogSet.has(text));
const missingManifest = [...required].filter(text => !manifest[text]);
const missingFile = [...required].filter(text => manifest[text] && (!fs.existsSync(path.join('public', manifest[text])) || fs.statSync(path.join('public', manifest[text])).size < 100));
console.log(`Required ${required.size}; catalog ${catalog.length}; verified ${Object.keys(manifest).length}`);
for (const [name, list] of [['catalog', missingCatalog], ['verified recording', missingManifest], ['audio file', missingFile]]) {
  console.log(`${name} missing: ${list.length}`);
  if (list.length) console.log(list.join('\n'));
}
if (missingCatalog.length || missingManifest.length || missingFile.length) process.exitCode = 1;
