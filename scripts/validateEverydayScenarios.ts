import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { appointmentScenarios } from '../src/content/romanian/appointment-scenarios';
import { bankingScenarios } from '../src/content/romanian/banking-scenarios';
import { cafeScenarios } from '../src/content/romanian/cafe-scenarios';
import { directionsScenarios } from '../src/content/romanian/directions-scenarios';
import { pharmacyScenarios } from '../src/content/romanian/pharmacy-scenarios';
import { shoppingScenarios } from '../src/content/romanian/shopping-scenarios';
import { transportScenarios } from '../src/content/romanian/transport-scenarios';
import { workplaceScenarios } from '../src/content/romanian/workplace-scenarios';
import { housingScenarios } from '../src/content/romanian/housing-scenarios';
import { homeStoryLessons, homeReturnDialogue, homeVerbTimes, familyCafeLesson, cafeReturnDialogue } from '../src/content/romanian/family-story';
import { audioRecordingKey } from '../src/lib/romanian/playVerifiedAudio';
import audio from '../src/content/romanian/verified-audio.json';

const groups = { home: homeStoryLessons, shortCafe: [familyCafeLesson], housing: housingScenarios, workplace: workplaceScenarios, appointments: appointmentScenarios, banking: bankingScenarios, cafe: cafeScenarios, directions: directionsScenarios, pharmacy: pharmacyScenarios, shopping: shoppingScenarios, transport: transportScenarios };
const recordings: Record<string, string> = audio;
const errors: string[] = [];
let lessons = 0;
let phrases = 0;
for (const [topic, scenarios] of Object.entries(groups)) {
  const slugs = new Set<string>();
  for (const lesson of scenarios) {
    lessons++;
    const id = `${topic}/${lesson.slug}`;
    if (slugs.has(lesson.slug)) errors.push(`${id}: duplicate slug`);
    slugs.add(lesson.slug);
    if ((topic === 'home' || topic === 'shortCafe') && lesson.dialogue.length !== 8) errors.push(`${id}: short home lessons must have exactly eight turns`);
    if ((topic !== 'home' && topic !== 'shortCafe') && lesson.dialogue.length < 9) errors.push(`${id}: fewer than nine dialogue turns`);
    if (lesson.tasks.length < 4) errors.push(`${id}: fewer than four tasks`);
    if (lesson.rules.length < ((topic === 'home' || topic === 'shortCafe') ? 2 : 3)) errors.push(`${id}: fewer than three rules`);
    for (const [section, lines] of Object.entries({ dialogue: lesson.dialogue, examples: lesson.rules.flatMap(rule => rule.examples), tasks: lesson.tasks })) {
      for (const [index, line] of lines.entries()) {
        phrases++;
        const label = `${id}/${section}/${index + 1}`;
        if (!line.ro.trim() || !line.en.trim() || !/[\u0600-\u06ff]/.test(line.fa)) errors.push(`${label}: missing translation`);
        const url = recordings[audioRecordingKey(line.ro, section === 'tasks' && 'answerVoice' in lesson ? lesson.answerVoice : ('audioVoice' in line ? line.audioVoice : undefined))];
        if (!url) errors.push(`${label}: missing exact-text audio: ${line.ro}`);
        else if (!url.startsWith('/audio/romanian/verified/') || !existsSync(join(process.cwd(), 'public', url))) errors.push(`${label}: missing or invalid audio file: ${url}`);
      }
    }
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Everyday scenarios: ${lessons} lessons, ${phrases} phrases; translations, depth and exact-text audio files passed. Pronunciation requires listening review.`);

const targetWords = new Set<string>();
for (const lesson of [...homeStoryLessons, familyCafeLesson]) {
  if (lesson.vocabulary.length !== 5 || new Set(lesson.vocabulary.map(w => w.ro)).size !== 5) throw new Error('Each short home lesson must teach exactly five distinct targets');
  if (!lesson.setting?.fa || !lesson.setting?.en) throw new Error('A short story lesson needs a real scene');
  const hostVoice = lesson.dialogue.find(x => x.who !== 'you')?.audioVoice;
  const guestVoice = lesson.dialogue.find(x => x.who === 'you')?.audioVoice;
  if (!hostVoice || !guestVoice || hostVoice === guestVoice) throw new Error('Story dialogue needs two different recorded voices');
  for (const word of lesson.vocabulary) {
    if (targetWords.has(word.ro)) throw new Error('Repeated new target across home lessons: ' + word.ro);
    targetWords.add(word.ro);
  }
}
const storyPhrases = [...homeVerbTimes, ...homeReturnDialogue, ...cafeReturnDialogue, ...[...homeStoryLessons, familyCafeLesson].flatMap(l => [...l.dialogue, ...l.tasks.map(t => ({...t, audioVoice:l.answerVoice})), ...l.vocabulary, ...l.vocabulary.flatMap(w => [w.example, ...(w.alternatives ?? [])]), ...l.tasks.flatMap(t => (t.alternatives ?? []).map(ro => ({ro, en: t.en, fa: t.fa, audioVoice:l.answerVoice})))])];
for (const phrase of storyPhrases) {
  if (!phrase.en || !/[\u0600-\u06ff]/.test(phrase.fa)) throw new Error('Story phrase needs Romanian, English and Persian');
  const url = recordings[audioRecordingKey(phrase.ro, 'audioVoice' in phrase ? phrase.audioVoice : undefined)];
  if (!url || !existsSync(join(process.cwd(), 'public', url))) throw new Error('Story needs exact-text audio: ' + phrase.ro);
}
console.log('Family story: six short lessons, exactly five distinct targets each, cousin gender alternative, return-home dialogue and exact-text audio checked.');
