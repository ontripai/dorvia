import React from 'react';

type Scene = 'shopping' | 'cafe' | 'directions' | 'transport' | 'pharmacy' | 'workplace' | 'appointments' | 'housing' | 'banking';
const drawings: Record<Scene, React.ReactNode> = {
  shopping: <><path d="M14 18h5l5 22h22l5-15H22M27 33h19"/><circle cx="28" cy="47" r="3"/><circle cx="43" cy="47" r="3"/><path d="M30 15v10m-5-5h10"/></>,
  cafe: <><path d="M18 27h26v10a11 11 0 0 1-11 11h-4a11 11 0 0 1-11-11zM44 29h4a6 6 0 0 1 0 12h-4M15 51h34M25 13c-6 5 5 6 0 11M34 13c-6 5 5 6 0 11"/></>,
  directions: <><path d="m12 20 13-6 14 6 13-6v31l-13 6-14-6-13 6zM25 14v31M39 31v20"/><path d="M46 24c0 5-7 12-7 12s-7-7-7-12a7 7 0 1 1 14 0Z"/><circle cx="39" cy="24" r="2"/></>,
  transport: <><rect x="16" y="13" width="32" height="35" rx="8"/><path d="M16 32h32M24 48v5M40 48v5M25 18h14"/><circle cx="24" cy="40" r="2"/><circle cx="40" cy="40" r="2"/></>,
  pharmacy: <><rect x="14" y="20" width="36" height="31" rx="5"/><path d="M25 20v-6h14v6M32 28v15M25 35h14"/></>,
  workplace: <><rect x="13" y="24" width="38" height="26" rx="5"/><path d="M24 24v-8h16v8M13 34c12 8 26 8 38 0M29 36h6v7h-6z"/></>,
  appointments: <><rect x="14" y="17" width="36" height="35" rx="5"/><path d="M14 28h36M24 12v10M40 12v10m-17 17 5 5 12-12"/></>,
  housing: <><path d="m10 30 22-19 22 19M16 26v25h32V26M27 51V37h10v14M23 30h2M40 30h2"/></>,
  banking: <><path d="m10 25 22-14 22 14zM15 49h34M11 54h42M18 29v15M27 29v15M37 29v15M46 29v15"/><circle cx="32" cy="20" r="2"/></>,
};
const names: Record<Scene, {fa: string; en: string}> = {
  shopping: {fa:'خرید',en:'Shopping'}, cafe: {fa:'کافه',en:'Café'}, directions: {fa:'راه‌یابی',en:'Directions'}, transport: {fa:'رفت‌وآمد',en:'Transport'}, pharmacy: {fa:'داروخانه',en:'Pharmacy'}, workplace: {fa:'محیط کار',en:'Workplace'}, appointments: {fa:'قرار ملاقات',en:'Appointments'}, housing: {fa:'مسکن',en:'Housing'}, banking: {fa:'بانک',en:'Banking'},
};
export function LessonSceneIllustration({ scene, lang }: { scene: string; lang: 'fa' | 'en' }) {
  if (scene === 'home') scene = 'housing';
  if (!(scene in drawings)) return null;
  const key = scene as Scene;
  return <svg role="img" aria-label={names[key][lang]} width="64" height="64" viewBox="0 0 64 64" className="shrink-0 rounded-2xl bg-sky-100/70 text-[#1554bd]"><circle cx="49" cy="12" r="7" fill="#fbbf24" opacity=".45"/><circle cx="10" cy="50" r="9" fill="#93c5fd" opacity=".4"/><g fill="white" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{drawings[key]}</g></svg>;
}
