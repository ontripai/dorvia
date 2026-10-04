import React from 'react';

export type AudioIconName = 'play' | 'stop' | 'previous' | 'next' | 'repeat' | 'start' | 'eye' | 'eye-off' | 'volume' | 'mic';
const shapes: Record<AudioIconName, React.ReactNode> = {
  play: <path d="m9 5 11 7-11 7z" fill="currentColor"/>,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>,
  previous: <><path d="m18 5-10 7 10 7z" fill="currentColor"/><path d="M5 5v14"/></>,
  next: <><path d="m6 5 10 7-10 7z" fill="currentColor"/><path d="M19 5v14"/></>,
  repeat: <><path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/></>,
  start: <><path d="m12 5-7 7 7 7M5 12h10a5 5 0 0 1 0 10"/></>,
  eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  'eye-off': <><path d="m3 3 18 18M10 5a10 10 0 0 1 2 0c7 0 10 7 10 7a16 16 0 0 1-3 4M6 6a17 17 0 0 0-4 6s3 7 10 7a11 11 0 0 0 5-1"/></>,
  volume: <><path d="M11 5 6 9H3v6h3l5 4zM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></>,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></>,
};

export function AudioControlIcon({ name }: { name: AudioIconName }) {
  return <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{shapes[name]}</svg>;
}
