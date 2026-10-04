import assert from 'node:assert/strict';
import { playVerifiedSequence, stopVerifiedAudio } from '../src/lib/romanian/playVerifiedAudio';
import recordings from '../src/content/romanian/verified-audio.json';

const clips: FakeAudio[] = [];
class FakeAudio {
  playbackRate = 1;
  paused = false;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public src: string) { clips.push(this); }
  play() { return Promise.resolve(); }
  pause() { this.paused = true; }
}
Object.assign(globalThis, { Audio: FakeAudio });
const timers = new Map<number, () => void>();
let id = 0;
Object.assign(globalThis, {
  setTimeout: (callback: () => void) => { timers.set(++id, callback); return id; },
  clearTimeout: (key: number) => timers.delete(key),
});
function tick() { const first = timers.entries().next().value; assert.ok(first); timers.delete(first[0]); first[1](); }
const text = Object.keys(recordings)[0];
let errors = 0;
const states: boolean[] = [];
playVerifiedSequence([{ text }, { text }], () => errors++, value => states.push(value), { rate: 0.8 });
assert.equal(clips.at(-1)?.playbackRate, 0.8);
const old = clips.at(-1)!;
old.onended!();
stopVerifiedAudio();
assert.equal(timers.size, 0, 'Stopping in a gap cancels the next clip');
assert.equal(states.at(-1), false);
const count = clips.length;
old.onended!();
assert.equal(clips.length, count, 'Stale audio cannot restart a cancelled sequence');
playVerifiedSequence([{ pauseMs: 6000 }, { text }], () => errors++);
assert.equal(clips.length, count, 'The learner turn is silent');
tick(); tick();
assert.equal(clips.length, count + 1, 'The counterpart follows the silent turn');
stopVerifiedAudio();
playVerifiedSequence([{ text: '__missing_recording__' }], () => errors++);
assert.equal(errors, 1, 'Missing clips fail before starting');
const positions: number[] = [];
playVerifiedSequence([{ text }], () => errors++, undefined, { repeat: true, onLine: value => positions.push(value) });
clips.at(-1)!.onended!(); tick();
assert.deepEqual(positions, [0, 0], 'Loop restarts at the selected first step');
stopVerifiedAudio();
playVerifiedSequence([{ text }], () => errors++, value => states.push(value));
clips.at(-1)!.onerror!();
assert.equal(errors, 2);
assert.equal(states.at(-1), false, 'Audio errors release playback state');
const sharedText = 'Am o sticlă de apă.';
const maleKey = `ro-RO-EmilNeural:${sharedText}`;
const registry: Record<string,string> = recordings;
assert.ok(registry[maleKey], 'The second speaker needs a real registered clip');
playVerifiedSequence([{text: sharedText, audioVoice: 'ro-RO-AlinaNeural'}, {text: sharedText, audioVoice: 'ro-RO-EmilNeural'}], () => errors++);
assert.equal(clips.at(-1)?.src, registry[sharedText]);
clips.at(-1)!.onended!(); tick();
assert.equal(clips.at(-1)?.src, registry[maleKey], 'Identical words use the selected speaker recording');
assert.notEqual(registry[maleKey], registry[sharedText]);
stopVerifiedAudio();
const onlyDefault = Object.keys(registry).find(key => !key.includes('Neural:') && !registry[`ro-RO-EmilNeural:${key}`])!;
const beforeMissingVoice = clips.length;
playVerifiedSequence([{text: onlyDefault, audioVoice: 'ro-RO-EmilNeural'}], () => errors++);
assert.equal(clips.length, beforeMissingVoice, 'A missing speaker clip must not silently use the other voice');
assert.equal(errors, 3);
console.log('Listening playback: speaker selection, no silent voice fallback, speed, cancellation, silent role, loop and errors passed.');
