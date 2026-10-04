import assert from 'node:assert/strict';
import { matchesRomanianAnswer, normalizeRomanianAnswer } from '../src/lib/romanian/answerFeedback';
const target = 'O sticlă de apă, vă rog.';
for (const answer of ['O sticlă de apă ,vă rog?', 'O sticlă de apă vă rog', 'o sticla de apa, va rog.', '  O   sticlă de apă ,  vă rog! ', 'O sticlă de apă.']) {
  assert.ok(matchesRomanianAnswer(answer, target), `Accept writing variation: ${answer}`);
}
for (const answer of ['', '0 sticlă de apă, vă rog.', 'Un sticlă de apă, vă rog.', 'Două sticle de apă, vă rog.', 'O sticlă de lapte, vă rog.']) {
  assert.ok(!matchesRomanianAnswer(answer, target), `Keep meaningful correction: ${answer}`);
}
assert.ok(!matchesRomanianAnswer('Doi bilete, vă rog.', 'Două bilete, vă rog.'));
assert.ok(!matchesRomanianAnswer('Două bilet, vă rog.', 'Două bilete, vă rog.'));
assert.ok(matchesRomanianAnswer('Este valabil si in tramvai', 'Este valabil și în tramvai?'));
assert.equal(normalizeRomanianAnswer('Poftiţi!'), normalizeRomanianAnswer('Poftiți.'));
assert.equal(normalizeRomanianAnswer('apă'.normalize('NFD')), normalizeRomanianAnswer('apă'));
console.log('Supportive answer checks: punctuation, spacing, accents and optional politeness accepted; wrong words, number and noun forms still corrected.');
