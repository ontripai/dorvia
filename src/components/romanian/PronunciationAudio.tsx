'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AudioClip } from '@/lib/romanian/types';
import { Language } from '@/types';

/* ---------------------------------------------------------------------------
 * Module-level exclusive player (dre-p170).
 *
 * Why module level and not component state: a station page renders one
 * PronunciationAudio per word, per dependent form, and per phrase. Component
 * state can only stop a clip inside its own card, so clicking `eu` and then
 * `mă` would play both at once. One shared reference guarantees that starting
 * any clip stops whatever was playing, in any card.
 *
 * Why `new Audio(...)` and not an <audio> element in JSX: the numbers station
 * has 55 words x 2 voices. Rendering 110 <audio> nodes costs DOM and hydration
 * for something most visitors never click. Nothing is created until a play.
 * ------------------------------------------------------------------------- */

let currentAudio: HTMLAudioElement | null = null;
let currentReset: (() => void) | null = null;

function releaseCurrent() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentReset) {
    currentReset();
  }
  currentAudio = null;
  currentReset = null;
}

function playExclusive(src: string, reset: () => void): Promise<void> {
  releaseCurrent();

  const audio = new Audio(src);
  currentAudio = audio;
  currentReset = reset;

  const finish = () => {
    if (currentAudio === audio) {
      currentAudio = null;
      currentReset = null;
    }
    reset();
  };

  audio.addEventListener('ended', finish, { once: true });
  audio.addEventListener('error', finish, { once: true });

  return audio.play().catch(err => {
    if (currentAudio === audio) {
      currentAudio = null;
      currentReset = null;
    }
    reset();
    throw err;
  });
}

function stopIfOwnedBy(reset: () => void) {
  if (currentReset === reset) {
    releaseCurrent();
  }
}

/* ------------------------------------------------------------------------- */

export interface PronunciationAudioProps {
  clips?: AudioClip[];
  currentLang: Language;
  /** The word, phrase, or letter being pronounced — used in aria-label and title. */
  label?: string;
  /**
   * `labelled` shows the voice name beside the icon (alphabet pages, one item
   * per page). `compact` is icon-only for dense station lists.
   */
  variant?: 'labelled' | 'compact';
  className?: string;
}

export function PronunciationAudio({
  clips = [],
  currentLang,
  label = '',
  variant = 'labelled',
  className = '',
}: PronunciationAudioProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const resetRef = useRef<() => void>(() => {});

  resetRef.current = () => setPlayingVoice(null);

  const reset = useCallback(() => {
    resetRef.current();
  }, []);

  // If this instance is the one currently playing when it unmounts, stop it.
  useEffect(() => {
    return () => {
      stopIfOwnedBy(reset);
    };
  }, [reset]);

  // Aoede first, Puck second — stable order across every card.
  const sortedClips = [...clips].sort((a, b) => {
    if (a.voice === b.voice) return 0;
    if (a.voice === 'Aoede') return -1;
    if (b.voice === 'Aoede') return 1;
    return 0;
  });

  if (sortedClips.length === 0) {
    // No audio for this entry: render nothing at all. Not a disabled button,
    // not a greyed icon, not a "coming soon" label. (dre-p168)
    return null;
  }

  const isFa = currentLang === 'fa';
  const isCompact = variant === 'compact';

  const handleToggle = (clip: AudioClip) => {
    if (playingVoice === clip.voice) {
      releaseCurrent();
      setPlayingVoice(null);
      return;
    }

    setPlayingVoice(clip.voice);
    playExclusive(clip.src, reset).catch(() => setPlayingVoice(null));
  };

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 ${className}`}
      role="group"
      aria-label={isFa ? 'پخش تلفظ صوتی' : 'Audio pronunciation'}
    >
      {sortedClips.map(clip => {
        const isPlaying = playingVoice === clip.voice;
        const ariaLabel = isFa
          ? `پخش تلفظ ${label} با صدای ${clip.voice}`
          : `Play pronunciation of ${label || 'this item'} with the ${clip.voice} voice`;

        return (
          <button
            key={clip.voice}
            type="button"
            onClick={() => handleToggle(clip)}
            aria-label={ariaLabel}
            aria-pressed={isPlaying}
            title={ariaLabel}
            className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#1554bd]/40 active:scale-95 ${
              isCompact ? 'p-1.5 text-[11px]' : 'px-3 py-1.5 text-xs'
            } ${
              isPlaying
                ? 'bg-[#1554bd] text-white shadow-sm ring-2 ring-[#1554bd]/30'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/60'
            }`}
          >
            {isPlaying ? (
              /* Speaker Icon with sound waves (pulsing active state) */
              <svg
                className="w-3.5 h-3.5 animate-pulse text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            ) : isCompact ? (
              /* Speaker Icon (compact idle state — dre-p170 Section 2) */
              <svg
                className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            ) : (
              /* Play Circle Icon (labelled idle state — alphabet pages) */
              <svg
                className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {!isCompact && <span>{clip.voice}</span>}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Backwards-compatible alias for alphabet pages that may still import GraphemeAudio
 * with `graphemeName`. Kept so dre-p170 remains 100% backwards-compatible.
 */
export function GraphemeAudio({
  clips,
  currentLang,
  graphemeName = '',
  className = '',
}: {
  clips?: AudioClip[];
  currentLang: Language;
  graphemeName?: string;
  className?: string;
}) {
  return (
    <PronunciationAudio
      clips={clips}
      currentLang={currentLang}
      label={graphemeName}
      variant="labelled"
      className={className}
    />
  );
}

export default PronunciationAudio;

