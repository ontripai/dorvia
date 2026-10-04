'use client';

import React from 'react';
import { AudioControlIcon } from './AudioControlIcon';
import { stopVerifiedAudio, playVerifiedAudio } from '@/lib/romanian/playVerifiedAudio';

type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
};
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

export function VoiceAnswer({ lang, target, onAnswer }: { lang: 'fa' | 'en'; target: string; onAnswer: (text: string) => void }) {
  const fa = lang === 'fa';
  const t = (persian: string, english: string) => fa ? persian : english;
  const [supported, setSupported] = React.useState(false);
  const [recordable, setRecordable] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [requesting, setRequesting] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [url, setUrl] = React.useState('');
  const recognition = React.useRef<Recognition | null>(null);
  const recorder = React.useRef<MediaRecorder | null>(null);
  const stream = React.useRef<MediaStream | null>(null);
  const objectUrl = React.useRef('');
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = React.useRef(false);
  const attempt = React.useRef(0);
  const audio = React.useRef<HTMLAudioElement | null>(null);
  const callback = React.useRef(onAnswer);
  callback.current = onAnswer;
  function releaseStream() { stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; }
  function stopCapture() {
    attempt.current++;
    const speech = recognition.current;
    if (speech) { speech.onresult = null; speech.onerror = null; speech.onend = null; speech.abort(); recognition.current = null; }
    if (recorder.current?.state === 'recording') recorder.current.stop();
    releaseStream();
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (alive.current) { setListening(false); setRecording(false); setRequesting(false); }
  }
  React.useEffect(() => {
    alive.current = true;
    const browser = window as SpeechWindow;
    setSupported(Boolean(browser.SpeechRecognition || browser.webkitSpeechRecognition));
    setRecordable(Boolean(typeof navigator.mediaDevices?.getUserMedia === 'function' && typeof window.MediaRecorder === 'function'));
    const onHidden = () => { if (document.hidden) stopCapture(); };
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      alive.current = false;
      stopCapture();
      if (recorder.current) { recorder.current.onstop = null; recorder.current.ondataavailable = null; }
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, []);
  function speak() {
    if (listening) { recognition.current?.stop(); return; }
    stopCapture(); stopVerifiedAudio(); audio.current?.pause(); setMessage('');
    const browser = window as SpeechWindow;
    const Constructor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Constructor) return;
    const current = ++attempt.current;
    const speech = new Constructor(); recognition.current = speech;
    speech.lang = 'ro-RO'; speech.continuous = false; speech.interimResults = false;
    speech.onresult = event => {
      if (!alive.current || current !== attempt.current) return;
      const text = event.results[0]?.[0]?.transcript?.trim();
      if (text) { callback.current(text); setMessage(t('جملهٔ شنیده‌شده در کادر پاسخ قرار گرفت. اگر مرورگر واژه‌ای را اشتباه شنید، آن را ویرایش کنید.', 'The recognised sentence is in the answer box. Edit any word the browser misheard.')); }
    };
    speech.onerror = event => {
      if (!alive.current || current !== attempt.current || event.error === 'aborted') return;
      const denied = event.error === 'not-allowed' || event.error === 'service-not-allowed';
      setMessage(denied ? t('اجازهٔ میکروفون داده نشد. در تنظیمات سایت اجازه بدهید؛ می‌توانید پاسخ را تایپ کنید.', 'Microphone permission was denied. Allow it in site settings, or type your answer.') : t('تشخیص گفتار انجام نشد. در محیط آرام دوباره بگویید یا پاسخ را تایپ کنید؛ این خطا امتیاز شما را کم نمی‌کند.', 'Speech could not be recognised. Try again in a quiet place or type; this does not lower your score.'));
    };
    speech.onend = () => { if (alive.current && current === attempt.current) { setListening(false); recognition.current = null; if (timer.current) clearTimeout(timer.current); timer.current = null; } };
    try { speech.start(); setListening(true); timer.current = setTimeout(() => speech.stop(), 30000); }
    catch { setListening(false); setMessage(t('میکروفون شروع نشد؛ دوباره تلاش کنید یا تایپ کنید.', 'The microphone could not start; try again or type.')); }
  }
  async function record() {
    if (recording) { stopCapture(); return; }
    stopCapture(); stopVerifiedAudio(); audio.current?.pause(); setMessage(''); setRequesting(true);
    const current = ++attempt.current;
    try {
      const captured = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!alive.current || current !== attempt.current) { captured.getTracks().forEach(track => track.stop()); return; }
      stream.current = captured;
      // Let each browser choose its supported recording container (including iOS).
      const device = new MediaRecorder(captured); recorder.current = device;
      const chunks: Blob[] = [];
      device.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      device.onstop = () => {
        captured.getTracks().forEach(track => track.stop());
        if (stream.current === captured) stream.current = null;
        if (!alive.current || recorder.current !== device) return;
        recorder.current = null;
        if (chunks.length) {
          if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
          objectUrl.current = URL.createObjectURL(new Blob(chunks, { type: device.mimeType }));
          setUrl(objectUrl.current);
        }
        setRecording(false); setRequesting(false);
        if (timer.current) clearTimeout(timer.current);
      };
      device.onerror = () => { if (recorder.current !== device) return; stopCapture(); setMessage(t('ضبط صدا انجام نشد؛ دوباره تلاش کنید.', 'Recording failed. Please try again.')); };
      device.start(); setRecording(true); setRequesting(false);
      timer.current = setTimeout(stopCapture, 30000);
    } catch {
      releaseStream();
      if (alive.current && current === attempt.current) { setRequesting(false); setMessage(t('ضبط صدا شروع نشد. اجازهٔ میکروفون و تنظیمات مرورگر را بررسی کنید.', 'Recording could not start. Check microphone permission and browser settings.')); }
    }
  }
  const button = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-[#1554bd] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50';
  return <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
    <div className="flex flex-wrap gap-3">
      {supported && <button type="button" disabled={recording || requesting} aria-pressed={listening} onClick={speak} className={`${button.replace("bg-white", "bg-[#1554bd]").replace("text-[#1554bd]", "text-white")}`}><AudioControlIcon name="mic"/>{listening ? t('پایان گفتن پاسخ', 'Finish speaking') : t('پاسخ صوتی', 'Speak answer')}</button>}
      {recordable && <button type="button" disabled={listening || requesting} aria-pressed={recording} onClick={() => void record()} className={button}><AudioControlIcon name={recording ? "stop" : "mic"}/>{requesting ? t('در انتظار اجازهٔ میکروفون…', 'Waiting for microphone permission…') : recording ? t('پایان ضبط', 'Finish recording') : t('ضبط صدای خود', 'Record yourself')}</button>}
      <button type="button" className={button} disabled={listening || recording || requesting} onClick={() => { audio.current?.pause(); playVerifiedAudio(target, () => setMessage(t('صدای نمونه در دسترس نیست.', 'Model audio is unavailable.'))); }}><AudioControlIcon name="volume"/>{t('صدای نمونه', 'Model audio')}</button>
    </div>
    {(listening || recording) && <p role="status" className="font-semibold text-[#1554bd]">{listening ? t('اکنون جمله را به رومانیایی بگویید…', 'Say the sentence in Romanian now…') : t('در حال ضبط؛ حداکثر ۳۰ ثانیه.', 'Recording, up to 30 seconds.')}</p>}
    {message && <p role="status" className="text-sm">{message}</p>}
    {url && <div className="space-y-2"><p className="text-sm font-semibold">{t('صدای خود را با نمونه مقایسه کنید', 'Compare your voice with the model')}</p><audio ref={audio} controls src={url} className="w-full" onPlay={stopVerifiedAudio}/><button type="button" className="text-sm text-[#1554bd] underline" onClick={() => { audio.current?.pause(); URL.revokeObjectURL(objectUrl.current); objectUrl.current = ''; setUrl(''); }}>{t('پاک کردن ضبط', 'Clear recording')}</button></div>}
    <p className="text-xs text-slate-600">{t('بررسی جملهٔ گفته‌شده؛ بدون نمرهٔ دقیق تلفظ. تشخیص گفتار ممکن است از سرویس مرورگر استفاده کند.', 'Checks the spoken sentence, not a precise pronunciation score. Recognition may use the browser’s speech service.')}</p>
    <details className="text-xs leading-6 text-slate-600"><summary className="cursor-pointer font-semibold">{t('راهنمای تمرین صوتی', 'Voice practice help')}</summary><p className="mt-2">{t('پاسخ صوتی، جملهٔ تشخیص‌داده‌شده را بررسی می‌کند؛ نمرهٔ دقیق تلفظ نیست. تشخیص گفتار ممکن است از سرویس مرورگر استفاده کند. ضبطِ شنیدن صدای خود فقط در همین صفحه می‌ماند. در مرورگرهای پشتیبانی‌نشده پاسخ را تایپ کنید.', 'Voice answers check the recognised sentence, not a precise pronunciation score. Recognition may use the browser’s speech service. Self-recordings stay on this page. Type your answer when recognition is unsupported.')}</p></details>
  </div>;
}
