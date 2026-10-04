import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { EverydayScenarioLesson } from '@/components/romanian/EverydayScenarioLesson';
import { familyCafeLesson } from '@/content/romanian/family-story';
import { LOCALES } from '@/lib/locale-router';
export function generateStaticParams(){return LOCALES.map(lang=>({lang}));}
export function generateMetadata({params}:{params:{lang:string}}):Metadata {const lang=params.lang==='fa'?'fa':'en';return {title:`${familyCafeLesson.title[lang]} | DORVIA`,description:familyCafeLesson.goal[lang],robots:{index:false,follow:false}};}
export default function FamilyCafePage({params,searchParams}:{params:{lang:string};searchParams:{story?:string}}){
 if(!LOCALES.includes(params.lang as 'fa'|'en')) notFound(); const lang=params.lang as 'fa'|'en';const fa=lang==='fa';const story=searchParams.story==='home-breakfast';
 const intro=story ? <aside className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50 p-5"><h2 className="text-xl font-bold">{fa?'همراه النا در کافه':'At the café with Elena'}</h2><p>{fa?'صبحانه را با خانواده می‌خورید؛ در این بخش فقط نوشیدنی خود را سفارش دهید. پس از تمرین به خانه برگردید.':'Have breakfast with the family; this part focuses only on ordering your drink. Return home after the practice.'}</p></aside> : undefined;
 const continuation=story ? <aside className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><h3 className="font-bold">{fa?'دوباره به خانه برگردید':'Return home again'}</h3><p>{fa?'آنا جمله‌های سفارش را با شما مرور می‌کند؛ واژهٔ تازه‌ای اضافه نمی‌شود.':'Ana reviews your ordering sentences with you; no new vocabulary is added.'}</p><Link href="/learn-romanian/lectie/acasa/mic-dejun?return=cafe" className="inline-flex min-h-12 items-center rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{fa?'برگشت به خانه پس از کافه':'Return home after the café'}</Link></aside> : undefined;
 return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8" dir={fa?'rtl':'ltr'}><Breadcrumb currentLang={lang} disableJsonLd items={[{label:fa?'آموزش رومانیایی':'Learn Romanian',href:'/learn-romanian'},{label:fa?'کافه و غذا':'Cafés and food',href:'/learn-romanian/lectie/tema/cafe'},{label:familyCafeLesson.title[lang]}]}/><EverydayScenarioLesson lang={lang} lesson={familyCafeLesson} topic={{fa:'کافه و غذا',en:'Cafés and food'}} counterpart={{fa:'کارمند کافه',en:'Café staff'}} topicHref="/learn-romanian/lectie/tema/cafe" footer={{fa:'این درس را می‌توانید مستقل یا در داستان خانواده انجام دهید.',en:'Study this lesson independently or in the family story.'}} storyIntro={intro} continuation={continuation}/></main>;
}
