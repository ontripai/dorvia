import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { EverydayScenarioLesson } from '@/components/romanian/EverydayScenarioLesson';
import { familyBakeryLesson } from '@/content/romanian/family-story';
import { LOCALES } from '@/lib/locale-router';
export function generateStaticParams(){return LOCALES.map(lang=>({lang}));}
export function generateMetadata({params}:{params:{lang:string}}):Metadata {const lang=params.lang==='fa'?'fa':'en';return {title:`${familyBakeryLesson.title[lang]} | DORVIA`,description:familyBakeryLesson.goal[lang],robots:{index:false,follow:false}};}
export default function FamilyBakeryPage({params,searchParams}:{params:{lang:string};searchParams:{story?:string}}){
 if(!LOCALES.includes(params.lang as 'fa'|'en')) notFound(); const lang=params.lang as 'fa'|'en';const fa=lang==='fa';const story=searchParams.story==='home-bread';
 const intro=story ? <aside className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50 p-5"><h2 className="text-xl font-bold">{fa?'خرید نان برای آنا':'Buying bread for Ana'}</h2><p>{fa?'آنا در خانه منتظر نان است. یک نان بخرید و رسید را همراه بیاورید.':'Ana is waiting for the bread at home. Buy one loaf and bring the receipt.'}</p></aside> : undefined;
 const continuation=story ? <aside className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><h3 className="font-bold">{fa?'دوباره به خانه برگردید':'Return home again'}</h3><p>{fa?'آنا دربارهٔ نان و رسید می‌پرسد؛ خرید را با همان فعل در گذشته تعریف کنید.':'Ana asks about the bread and receipt; describe the purchase using the same verb in the past.'}</p><Link href="/learn-romanian/lectie/acasa/paine?return=bakery" className="inline-flex min-h-12 items-center rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{fa?'برگشت به خانه با نان':'Return home with bread'}</Link></aside> : undefined;
 return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8" dir={fa?'rtl':'ltr'}><Breadcrumb currentLang={lang} disableJsonLd items={[{label:fa?'آموزش رومانیایی':'Learn Romanian',href:'/learn-romanian'},{label:fa?'خرید روزمره':'Everyday shopping',href:'/learn-romanian/lectie/tema/shopping'},{label:familyBakeryLesson.title[lang]}]}/><EverydayScenarioLesson lang={lang} lesson={familyBakeryLesson} topic={{fa:'خرید روزمره',en:'Everyday shopping'}} counterpart={{fa:'فروشندهٔ نانوایی',en:'Baker'}} topicHref="/learn-romanian/lectie/tema/shopping" footer={{fa:'این درس را می‌توانید مستقل یا در داستان خانواده انجام دهید.',en:'Study this lesson independently or in the family story.'}} storyIntro={intro} continuation={continuation}/></main>;
}
