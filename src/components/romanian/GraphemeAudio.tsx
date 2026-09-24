'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AudioClip } from '@/lib/romanian/types';
import { Language } from '@/types';

interface GraphemeAudioProps {
  clips?: AudioClip[];
  currentLang: Language;
  graphemeName?: string;
  className?: string;
}

export function GraphemeAudio({
  clips = [],
  currentLang,
  graphemeName = '',
  className = '',
}: GraphemeAudioProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  // Ensure clips order: Aoede first, Puck second
  const sortedClips = [...clips].sort((a, b) => {
    if (a.voice === 'Aoede') return -1;
    if (b.voice === 'Aoede') return 1;
    return 0;
  });

  const handlePlayToggle = (voice: string) => {
    const currentAudio = audioRefs.current[voice];
    if (!currentAudio) return;

    // If already playing this voice, stop/pause it
    if (playingVoice === voice) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setPlayingVoice(null);
      return;
    }

    // Stop any other currently playing audio
    if (playingVoice && audioRefs.current[playingVoice]) {
      const otherAudio = audioRefs.current[playingVoice];
      if (otherAudio) {
        otherAudio.pause();
        otherAudio.currentTime = 0;
      }
    }

    // Play the clicked audio
    currentAudio.currentTime = 0;
    currentAudio
      .play()
      .then(() => {
        setPlayingVoice(voice);
      })
      .catch(() => {
        setPlayingVoice(null);
      });
  };

  const handleEnded = (voice: string) => {
    if (playingVoice === voice) {
      setPlayingVoice(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
        }
      });
    };
  }, []);

  if (sortedClips.length === 0) {
    return null;
  }

  const isFa = currentLang === 'fa';

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 ${className}`}
      role="group"
      aria-label={isFa ? 'پخش تلفظ صوتی' : 'Audio pronunciation'}
    >
      {sortedClips.map(clip => {
        const isPlaying = playingVoice === clip.voice;
        const ariaLabel = isFa
          ? `پخش تلفظ حرف ${graphemeName} با صدای ${clip.voice}`
          : `Play pronunciation of ${graphemeName || 'letter'} with ${clip.voice} voice`;

        return (
          <div key={clip.voice} className="inline-flex items-center">
            <audio
              ref={el => {
                audioRefs.current[clip.voice] = el;
              }}
              src={clip.src}
              preload="none"
              onEnded={() => handleEnded(clip.voice)}
              onError={() => handleEnded(clip.voice)}
            />
            <button
              type="button"
              onClick={() => handlePlayToggle(clip.voice)}
              aria-label={ariaLabel}
              aria-pressed={isPlaying}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#1554bd]/40 active:scale-95 ${
                isPlaying
                  ? 'bg-[#1554bd] text-white shadow-sm ring-2 ring-[#1554bd]/30'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/60'
              }`}
            >
              {/* Speaker / Playing Icon */}
              {isPlaying ? (
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
              ) : (
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
              <span>{clip.voice}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
