import verifiedAudio from '@/content/romanian/verified-audio.json';

const recordings: Record<string, string> = verifiedAudio;
let active: HTMLAudioElement | null = null;

export function stopVerifiedAudio() {
  active?.pause();
  active = null;
}

/** Play fixed lesson lines in order; never send learner input to a speech service. */
export function playVerifiedAudio(lines: string | string[], onError: () => void, onState?: (playing: boolean) => void) {
  stopVerifiedAudio();
  const urls = (Array.isArray(lines) ? lines : [lines]).map(line => recordings[line.normalize('NFC').trim()]);
  if (urls.some(url => !url)) { onError(); onState?.(false); return; }
  let index = 0;
  function next() {
    if (index === urls.length) { active = null; onState?.(false); return; }
    const audio = new Audio(urls[index++]);
    active = audio;
    audio.onended = () => { if (active === audio) next(); };
    audio.onerror = () => { if (active === audio) { active = null; onState?.(false); onError(); } };
    onState?.(true);
    void audio.play().catch(() => { if (active === audio) { active = null; onState?.(false); onError(); } });
  }
  next();
}
