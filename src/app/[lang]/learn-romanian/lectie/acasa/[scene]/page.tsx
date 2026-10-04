import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EverydayScenarioLesson } from '@/components/romanian/EverydayScenarioLesson';
import { meetFamilyLesson, homeRoomLesson, familyBreakfastLesson } from '@/content/romanian/family-story';
import { FamilyHomeReturn } from '@/components/romanian/FamilyHomeReturn';
import { LOCALES } from '@/lib/locale-router';
const lessons = { familia: meetFamilyLesson, camera: homeRoomLesson, 'mic-dejun': familyBreakfastLesson };
function getLesson(scene: string) { return lessons[scene as keyof typeof lessons]; }
export function generateStaticParams() { return LOCALES.flatMap(lang => Object.keys(lessons).map(scene => ({lang, scene}))); }
export function generateMetadata({params, searchParams}: {params: {lang: string; scene: string}; searchParams: {return?: string}}): Metadata {
  const lesson = getLesson(params.scene); if (!lesson) return {};
  const lang = params.lang === 'fa' ? 'fa' : 'en';
  return {title: `${lesson.title[lang]} | DORVIA`, description: lesson.goal[lang], robots: {index: false, follow: false}};
}
export default function HomeScenePage({params, searchParams}: {params: {lang: string; scene: string}; searchParams: {return?: string}}) {
  const lesson = getLesson(params.scene); if (!lesson || !LOCALES.includes(params.lang as 'fa'|'en')) notFound();
  const lang = params.lang as 'fa'|'en'; const fa = lang === 'fa'; const room = params.scene === 'camera'; const breakfast = params.scene === 'mic-dejun';
  if (breakfast && searchParams.return === 'cafe') return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8"><FamilyHomeReturn key="cafe" lang={lang} visit="cafe"/></main>;
  const intro = <aside className="space-y-3 rounded-2xl border border-blue-200 bg-sky-50 p-5"><h2 className="text-xl font-bold">{fa ? 'یک موقعیت کوتاه؛ پنج واژهٔ تازه' : 'One short situation; five new words'}</h2><p>{fa ? 'شما پسرعمو یا دخترعموی بچه‌ها هستید. هر درس یک لحظهٔ کوتاه از دیدار خانوادگی است؛ دلیل صحبت را در توضیح صحنه می‌بینید. پنج واژهٔ هدف مشخص‌اند و بقیه از پایه‌ها و درس‌های قبلی مرور می‌شوند.' : 'You are the children’s cousin. Each lesson is one short moment in the family visit; the scene explains why the conversation happens. Five targets are marked, with the rest reviewing foundations and earlier lessons.'}</p><Link href="/learn-romanian/lectie/acasa/bun-venit" className="text-[#1554bd] underline">{fa ? 'آشنایی با خانواده و نقش شما' : 'Meet the family and your role'}</Link></aside>;
  const next = breakfast ? {href:'/learn-romanian/lectie/cafenea/cu-familia?story=home-breakfast',fa:'سفارش چای در کافه',en:'Order tea at the café',detailFa:'همراه النا به کافه بروید. درس بعد فقط پنج واژهٔ تازه دارد؛ سپس به خانه برگردید و جمله‌ها را مرور کنید.',detailEn:'Go to the café with Elena. The next lesson has only five new words; return home afterwards to review.'} : room ? {href:'/learn-romanian/lectie/magazin?story=home-welcome',fa:'خرید آب در فروشگاه',en:'Buy water at the shop',detailFa:'بعد از استراحت برای خرید آب می‌روید و برای مرور به خانه برمی‌گردید. هر بخش یک جلسهٔ جداست.',detailEn:'After a rest, buy water and return home to review. Each part is a separate session.'} : {href:'/learn-romanian/lectie/acasa/camera',fa:'درس ۳: خانه و اتاق',en:'Lesson 3: house and room',detailFa:'برای امروز همین مقدار کافی است؛ درس بعد پنج واژهٔ متفاوت دارد.',detailEn:'This is enough for today; the next lesson has five different words.'};
  const continuation = <aside className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><h3 className="font-bold">{fa ? 'ادامهٔ داستان؛ یک جلسهٔ دیگر' : 'Continue the story in another session'}</h3><p>{fa ? next.detailFa : next.detailEn}</p><Link href={next.href} className="inline-flex min-h-12 items-center rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{fa ? next.fa : next.en}</Link></aside>;
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8" dir={fa ? 'rtl' : 'ltr'}><Breadcrumb currentLang={lang} disableJsonLd items={[{label: fa ? 'آموزش رومانیایی' : 'Learn Romanian',href:'/learn-romanian'},{label:fa ? 'در خانه' : 'At home',href:'/learn-romanian/lectie/tema/home'},{label:lesson.title[lang]}]}/><EverydayScenarioLesson lang={lang} lesson={lesson} counterpart={breakfast ? {fa:'النا',en:'Elena'} : {fa:'آنا',en:'Ana'}} topic={{fa:'در خانه؛ داستان خانواده',en:'At home: the family story'}} topicHref="/learn-romanian/lectie/tema/home" footer={{fa:'این داستان خیالی است؛ هر درس را می‌توانید مستقل انجام دهید.',en:'This story is fictional; every lesson can be studied independently.'}} storyIntro={intro} continuation={continuation}/></main>;
}
