'use client';

import React from 'react';
import type { AudioClip } from '@/lib/romanian/types';
import type { Language } from '@/types';
import verifiedAudio from '@/content/romanian/verified-audio.json';

// Only explicitly approved exact-text files may be played. Legacy Aoede/Puck
// recordings are excluded; unapproved text continues to use browser speech.
let activeReset: (() => void) | null = null;
let romanianVoice: SpeechSynthesisVoice | undefined;
let voiceLookup: Promise<SpeechSynthesisVoice | undefined> | null = null;
let activeAudio: HTMLAudioElement | null = null;
const recordings: Record<string, string> = verifiedAudio;

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
      activeAudio?.pause();
      activeAudio = null;
      window.speechSynthesis?.cancel();
      activeReset = null;
    }
  }, [reset]);

  React.useEffect(() => {
    if ('speechSynthesis' in window) void findRomanianVoice();
  }, []);

  async function toggle() {
    const recording = recordings[label.normalize('NFC').trim()];
    if (recording) {
      if (activeReset === reset) {
        activeAudio?.pause();
        activeAudio = null;
        activeReset = null;
        setPlaying(false);
        return;
      }
      if (activeReset) {
        activeAudio?.pause();
        window.speechSynthesis?.cancel();
        activeReset();
      }
      const audio = new Audio(recording);
      activeAudio = audio;
      activeReset = reset;
      audio.onended = audio.onerror = () => {
        if (activeAudio !== audio) return;
        activeAudio = null;
        activeReset = null;
        reset();
        if (audio.error) setMessage(isFa ? 'فایل صوتی در دسترس نیست.' : 'Audio file is unavailable.');
      };
      setMessage('');
      setPlaying(true);
      try { await audio.play(); }
      catch {
        if (activeAudio === audio) { activeAudio = null; activeReset = null; }
        reset();
        setMessage(isFa ? 'پخش فایل صوتی ممکن نشد.' : 'Could not play audio.');
      }
      return;
    }
    if (!('speechSynthesis' in window)) {
      setMessage(isFa ? 'پخش مصنوعی در این مرورگر پشتیبانی نمی‌شود.' : 'Browser speech is unavailable.');
      return;
    }
    if (activeReset === reset) {
      activeAudio?.pause();
      activeAudio = null;
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
      activeAudio?.pause();
      activeAudio = null;
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
      aria-label={recordings[label.normalize('NFC').trim()] ? (isFa ? `پخش رومانیایی: ${label}` : `Play Romanian: ${label}`) : (isFa ? `پخش مصنوعی رومانیایی: ${label}` : `Play Romanian browser voice: ${label}`)}
      disabled={loading}
      aria-busy={loading}
      className={`rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-[#1554bd] hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60 ${variant === 'compact' ? 'text-[11px]' : ''}`}>
      {loading ? (isFa ? 'در حال آماده‌سازی صدا…' : 'Loading voice…') : playing ? (isFa ? 'توقف' : 'Stop') : (isFa ? '🔊 پخش' : '🔊 Play')}
    </button>
    {message && <span role="status" className="text-xs text-amber-900">{message}</span>}
  </div>;
}

export default PronunciationAudio;
