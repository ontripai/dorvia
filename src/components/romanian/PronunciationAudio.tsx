'use client';

import React from 'react';
import type { AudioClip } from '@/lib/romanian/types';
import type { Language } from '@/types';

// The historical Aoede/Puck recordings are deliberately not loaded or played.
// Synthesis receives the exact Romanian text displayed for this item.
let activeReset: (() => void) | null = null;
let romanianVoice: SpeechSynthesisVoice | undefined;
let voiceLookup: Promise<SpeechSynthesisVoice | undefined> | null = null;

function findRomanianVoice(): Promise<SpeechSynthesisVoice | undefined> {
  const synthesis = window.speechSynthesis;
  const immediate = romanianVoice ?? synthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('ro'));
  if (immediate) { romanianVoice = immediate; return Promise.resolve(immediate); }
  if (voiceLookup) return voiceLookup;
  voiceLookup = new Promise(resolve => {
    let finished = false;
    const finish = (voice?: SpeechSynthesisVoice) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      synthesis.removeEventListener('voiceschanged', retry);
      romanianVoice = voice;
      voiceLookup = null;
      resolve(voice);
    };
    const retry = () => finish(synthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('ro')));
    const timer = window.setTimeout(() => finish(), 1500);
    synthesis.addEventListener('voiceschanged', retry);
  });
  return voiceLookup;
}

export interface PronunciationAudioProps {
  clips?: AudioClip[]; // Kept for existing callers; never used for playback.
  currentLang: Language;
  label: string;
  variant?: 'labelled' | 'compact';
  className?: string;
}

export function PronunciationAudio({
  currentLang,
  label,
  variant = 'labelled',
  className = '',
}: PronunciationAudioProps) {
  const isFa = currentLang === 'fa';
  const [playing, setPlaying] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const resetRef = React.useRef<() => void>(() => {});
  resetRef.current = () => setPlaying(false);
  const reset = React.useCallback(() => resetRef.current(), []);

  React.useEffect(() => () => {
    if (activeReset === reset) {
      window.speechSynthesis?.cancel();
      activeReset = null;
    }
  }, [reset]);

  React.useEffect(() => {
    if ('speechSynthesis' in window) void findRomanianVoice();
  }, []);

  async function toggle() {
    if (!('speechSynthesis' in window)) {
      setMessage(isFa ? 'پخش مصنوعی در این مرورگر پشتیبانی نمی‌شود.' : 'Browser speech is unavailable.');
      return;
    }
    if (activeReset === reset) {
      window.speechSynthesis.cancel();
      activeReset = null;
      setPlaying(false);
      return;
    }
    setLoading(true);
    const voice = await findRomanianVoice();
    setLoading(false);
    if (!voice) {
      setMessage(isFa ? 'صدای رومانیایی در این مرورگر نصب یا بارگذاری نشده است.' : 'No Romanian voice is available in this browser.');
      return;
    }
    if (activeReset) {
      window.speechSynthesis.cancel();
      activeReset();
    }
    const utterance = new SpeechSynthesisUtterance(label);
    utterance.voice = voice;
    utterance.lang = 'ro-RO';
    utterance.rate = 0.8;
    utterance.onend = utterance.onerror = () => {
      if (activeReset === reset) activeReset = null;
      reset();
    };
    activeReset = reset;
    setMessage('');
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  }

  return <div className={`inline-flex flex-col items-start gap-1 ${className}`}>
    <button type="button" onClick={toggle} aria-pressed={playing}
      aria-label={isFa ? `پخش مصنوعی رومانیایی: ${label}` : `Play Romanian browser voice: ${label}`}
      disabled={loading}
      aria-busy={loading}
      className={`rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-[#1554bd] hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60 ${variant === 'compact' ? 'text-[11px]' : ''}`}>
      {loading ? (isFa ? 'در حال آماده‌سازی صدا…' : 'Loading voice…') : playing ? (isFa ? 'توقف' : 'Stop') : (isFa ? '🔊 پخش' : '🔊 Play')}
    </button>
    {message && <span role="status" className="text-xs text-amber-900">{message}</span>}
  </div>;
}

export default PronunciationAudio;
