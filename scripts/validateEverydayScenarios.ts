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
import audio from '../src/content/romanian/verified-audio.json';

const groups = { workplace: workplaceScenarios, appointments: appointmentScenarios, banking: bankingScenarios, cafe: cafeScenarios, directions: directionsScenarios, pharmacy: pharmacyScenarios, shopping: shoppingScenarios, transport: transportScenarios };
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
    if (lesson.dialogue.length < 9) errors.push(`${id}: fewer than nine dialogue turns`);
    if (lesson.tasks.length < 4) errors.push(`${id}: fewer than four tasks`);
    if (lesson.rules.length < 3) errors.push(`${id}: fewer than three rules`);
    for (const [section, lines] of Object.entries({ dialogue: lesson.dialogue, examples: lesson.rules.flatMap(rule => rule.examples), tasks: lesson.tasks })) {
      for (const [index, line] of lines.entries()) {
        phrases++;
        const label = `${id}/${section}/${index + 1}`;
        if (!line.ro.trim() || !line.en.trim() || !/[\u0600-\u06ff]/.test(line.fa)) errors.push(`${label}: missing translation`);
        const url = recordings[line.ro.normalize('NFC').trim()];
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
