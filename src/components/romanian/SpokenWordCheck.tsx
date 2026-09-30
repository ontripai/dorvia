'use client';

import React from 'react';

type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
};
type RecognitionWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

export function SpokenWordCheck({ word, lang }: { word: string; lang: 'fa' | 'en' }) {
  const [available, setAvailable] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [error, setError] = React.useState('');
  const recognitionRef = React.useRef<Recognition | null>(null);
  const isFa = lang === 'fa';

  React.useEffect(() => {
    const browser = window as RecognitionWindow;
    setAvailable(Boolean(browser.SpeechRecognition || browser.webkitSpeechRecognition));
    return () => recognitionRef.current?.abort();
  }, []);

  function start() {
    if (listening) { recognitionRef.current?.stop(); return; }
    const browser = window as RecognitionWindow;
    const Constructor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Constructor) return;
    const recognition = new Constructor(); recognitionRef.current = recognition;
    recognition.lang = 'ro-RO'; recognition.continuous = false; recognition.interimResults = false;
    recognition.onresult = event => setTranscript(event.results[0]?.[0]?.transcript?.trim() || '');
    recognition.onerror = event => { if (event.error !== 'aborted') setError(`${isFa ? 'تشخیص گفتار انجام نشد؛ دوباره تلاش کنید یا پاسخ را بنویسید.' : 'Speech recognition failed; retry or type.'} (${event.error})`); };
    recognition.onend = () => { recognitionRef.current = null; setListening(false); };
    setTranscript(''); setError('');
    try { recognition.start(); setListening(true); }
    catch { recognitionRef.current = null; setError(isFa ? 'میکروفون آغاز نشد.' : 'Microphone could not start.'); }
  }

  const matched = transcript.normalize('NFC').toLocaleLowerCase('ro-RO').replace(/[.!?،,]+$/g, '').trim() === word.toLocaleLowerCase('ro-RO');
  return <div className="space-y-2 text-sm">
    {available ? <button type="button" aria-pressed={listening} onClick={start} className="rounded-xl border border-[#1554bd] px-4 py-2 font-semibold text-[#1554bd]">{listening ? isFa ? 'پایان شنیدن' : 'Stop listening' : isFa ? '🎙️ گفتن واژه' : '🎙️ Say the word'}</button> : <p className="text-slate-600">{isFa ? 'تشخیص گفتار در این مرورگر در دسترس نیست؛ واژه را بلند تکرار کنید.' : 'Speech recognition is unavailable here; repeat the word aloud.'}</p>}
    {error && <p role="status" className="text-amber-900">{error}</p>}
    {transcript && <p role="status" className={matched ? 'text-emerald-800' : 'text-amber-900'}>{isFa ? 'متن شنیده‌شده: ' : 'Transcribed: '}<span lang="ro" dir="ltr">{transcript}</span>{matched ? isFa ? ' · با واژهٔ هدف یکسان است.' : ' · matches the target word.' : isFa ? ' · با متن هدف یکسان نیست؛ دوباره بگویید.' : ' · does not match the target text; try again.'}</p>}
    <p className="text-xs text-slate-500">{isFa ? 'این بررسی فقط متن را مقایسه می‌کند و دقت تلفظ را اندازه نمی‌گیرد.' : 'This compares transcribed text only; it does not measure pronunciation accuracy.'}</p>
  </div>;
}
