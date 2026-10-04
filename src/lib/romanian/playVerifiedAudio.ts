import verifiedAudio from '../../content/romanian/verified-audio.json';

const recordings: Record<string, string> = verifiedAudio;
export type ListeningStep = { text?: string; pauseMs?: number };
export type ListeningOptions = { rate?: number; gapMs?: number; repeat?: boolean; onLine?: (index: number) => void };
let active: HTMLAudioElement | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let generation = 0;
let reportState: ((playing: boolean) => void) | undefined;

export function stopVerifiedAudio() {
  generation++;
  if (timer !== null) clearTimeout(timer);
  timer = null;
  active?.pause();
  active = null;
  const report = reportState;
  reportState = undefined;
  report?.(false);
}

/** Fixed recorded phrases only. Silent steps leave time for the learner's role. */
export function playVerifiedSequence(steps: ListeningStep[], onError: () => void, onState?: (playing: boolean) => void, options: ListeningOptions = {}) {
  stopVerifiedAudio();
  const token = generation;
  const urls = steps.map(step => step.text ? recordings[step.text.normalize('NFC').trim()] : undefined);
  if (steps.some((step, i) => step.text && !urls[i])) { onError(); onState?.(false); return; }
  if (!steps.length) { onState?.(false); return; }
  reportState = onState;
  onState?.(true);
  let index = 0;
  const current = () => token === generation;
  function finish() { if (current()) stopVerifiedAudio(); }
  function fail() { if (current()) { finish(); onError(); } }
  function delay(ms: number, callback: () => void) {
    timer = setTimeout(() => { timer = null; if (current()) callback(); }, ms);
  }
  function advance() {
    if (!current()) return;
    index++;
    if (index === steps.length) {
      if (!options.repeat) { finish(); return; }
      index = 0;
    }
    delay(options.gapMs ?? 350, next);
  }
  function next() {
    if (!current()) return;
    options.onLine?.(index);
    const step = steps[index];
    if (!step.text) { delay(Math.max(250, step.pauseMs ?? 6000), advance); return; }
    const audio = new Audio(urls[index]);
    active = audio;
    audio.playbackRate = options.rate ?? 1;
    audio.onended = () => { if (current() && active === audio) { active = null; advance(); } };
    audio.onerror = fail;
    void audio.play().catch(fail);
  }
  next();
}

export function playVerifiedAudio(lines: string | string[], onError: () => void, onState?: (playing: boolean) => void) {
  playVerifiedSequence((Array.isArray(lines) ? lines : [lines]).map(text => ({ text })), onError, onState, { gapMs: 0 });
}
