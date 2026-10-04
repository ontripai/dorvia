const escapeXml = text => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

// Editorial choices, not a universal rule: Romanian information questions
// must not all receive the rising ending used for neutral yes/no questions.
export function romanianSpeechSsml(text, voice, intonation) {
  if (!['ro-RO-AlinaNeural', 'ro-RO-EmilNeural'].includes(voice)) throw new Error('Unknown voice');
  if (intonation && !['yes-no', 'information'].includes(intonation)) throw new Error('Unknown intonation');
  if (intonation && !text.trim().endsWith('?')) throw new Error('Question intonation requires a question');
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/gu) ?? [];
  const body = sentences.map(sentence => {
    const escaped = escapeXml(sentence.trim());
    if (!sentence.trim().endsWith('?') || !intonation) return `<s>${escaped}</s>`;
    const contour = intonation === 'yes-no'
      ? '(0%,+0%) (60%,-5%) (100%,+80%)'
      : '(0%,+0%) (35%,+10%) (100%,-8%)';
    return `<s><prosody contour="${contour}">${escaped}</prosody></s>`;
  }).join('');
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ro-RO"><voice name="${voice}">${body}</voice></speak>`;
}
