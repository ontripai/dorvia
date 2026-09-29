'use client';

import React from 'react';
import type { AudioClip } from '@/lib/romanian/types';
import type { Language } from '@/types';

// The historical Aoede/Puck recordings are deliberately not loaded or played.
// Synthesis receives the exact Romanian text displayed for this item.
let activeReset: (() => void) | null = null;

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

  function toggle() {
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
    const voice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('ro'));
    if (!voice) {
      setMessage(isFa ? 'صدای رومانیایی در این مرورگر نصب یا بارگذاری نشده است.' : 'No Romanian voice is available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    activeReset?.();
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
      className={`rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-[#1554bd] hover:bg-blue-50 ${variant === 'compact' ? 'text-[11px]' : ''}`}>
      {playing ? (isFa ? 'توقف' : 'Stop') : (isFa ? '🔊 صدای مصنوعی مرورگر' : '🔊 Browser voice')}
    </button>
    {message && <span role="status" className="text-xs text-amber-900">{message}</span>}
  </div>;
}

export default PronunciationAudio;
