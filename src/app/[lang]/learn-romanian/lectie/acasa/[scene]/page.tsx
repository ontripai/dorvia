import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Breadcrumb } from '@/components/Breadcrumb';
import { EverydayScenarioLesson } from '@/components/romanian/EverydayScenarioLesson';
import { meetFamilyLesson, homeRoomLesson } from '@/content/romanian/family-story';
import { LOCALES } from '@/lib/locale-router';
const lessons = { familia: meetFamilyLesson, camera: homeRoomLesson };
function getLesson(scene: string) { return lessons[scene as keyof typeof lessons]; }
export function generateStaticParams() { return LOCALES.flatMap(lang => Object.keys(lessons).map(scene => ({lang, scene}))); }
export function generateMetadata({params}: {params: {lang: string; scene: string}}): Metadata {
  const lesson = getLesson(params.scene); if (!lesson) return {};
  const lang = params.lang === 'fa' ? 'fa' : 'en';
  return {title: `${lesson.title[lang]} | DORVIA`, description: lesson.goal[lang], robots: {index: false, follow: false}};
}
export default function HomeScenePage({params}: {params: {lang: string; scene: string}}) {
  const lesson = getLesson(params.scene); if (!lesson || !LOCALES.includes(params.lang as 'fa'|'en')) notFound();
  const lang = params.lang as 'fa'|'en'; const fa = lang === 'fa'; const room = params.scene === 'camera';
  const intro = <aside className="space-y-3 rounded-2xl border border-blue-200 bg-sky-50 p-5"><h2 className="text-xl font-bold">{fa ? 'یک موقعیت کوتاه؛ پنج واژهٔ تازه' : 'One short situation; five new words'}</h2><p>{fa ? 'شما پسرعمو یا دخترعموی بچه‌ها هستید. امروز با آنا، زن‌عموی خود، صحبت می‌کنید. هر درس هشت نوبت کوتاه دارد. ضمیرها، سلام و تشکر، و فعل‌های «بودن» و «داشتن» از پایه‌ها مرور می‌شوند؛ صرف‌های آن‌ها واژهٔ تازه نیستند.' : 'You are the children’s cousin. Today you talk with Ana, your aunt by marriage. Each lesson has eight short turns. Pronouns, greetings, thanks, a fi and a avea review the foundations; their conjugations are not new words.'}</p><Link href="/learn-romanian/lectie/acasa/bun-venit" className="text-[#1554bd] underline">{fa ? 'آشنایی با خانواده و نقش شما' : 'Meet the family and your role'}</Link></aside>;
  const continuation = <aside className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><h3 className="font-bold">{room ? (fa ? 'ادامهٔ داستان در فروشگاه' : 'Continue the story at the shop') : (fa ? 'درس بعد: خانه و اتاق' : 'Next lesson: the house and room')}</h3><p>{room ? (fa ? 'بعد از استراحت، همراه آنا برای خرید آب می‌روید؛ سپس برای گفت‌وگوی مرور به خانه برمی‌گردید. هر بخش را می‌توانید در جلسه‌ای جدا انجام دهید.' : 'After a rest, go with Ana to buy water, then return home for a review conversation. You can do each part in a separate session.') : (fa ? 'امروز همین مقدار کافی است؛ در درس بعد پنج واژهٔ متفاوت برای خانه و اتاق یاد می‌گیرید.' : 'This is enough for today; the next lesson teaches five different words for the house and room.')}</p><Link href={room ? '/learn-romanian/lectie/magazin?story=home-welcome' : '/learn-romanian/lectie/acasa/camera'} className="inline-flex min-h-12 items-center rounded-xl bg-[#1554bd] px-5 py-3 font-bold text-white">{room ? (fa ? 'خرید آب در فروشگاه' : 'Buy water at the shop') : (fa ? 'درس ۳: خانه و اتاق' : 'Lesson 3: house and room')}</Link></aside>;
  return <main className="mx-auto max-w-4xl space-y-6 px-4 py-8" dir={fa ? 'rtl' : 'ltr'}><Breadcrumb currentLang={lang} disableJsonLd items={[{label: fa ? 'آموزش رومانیایی' : 'Learn Romanian',href:'/learn-romanian'},{label:fa ? 'در خانه' : 'At home',href:'/learn-romanian/lectie/tema/home'},{label:lesson.title[lang]}]}/><EverydayScenarioLesson lang={lang} lesson={lesson} counterpart={{fa:'آنا',en:'Ana'}} topic={{fa:'در خانه؛ داستان خانواده',en:'At home: the family story'}} topicHref="/learn-romanian/lectie/tema/home" footer={{fa:'این داستان خیالی است؛ هر درس را می‌توانید مستقل انجام دهید.',en:'This story is fictional; every lesson can be studied independently.'}} storyIntro={intro} continuation={continuation}/></main>;
}
