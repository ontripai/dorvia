'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '../types';
import { universitiesData } from '@/lib/universities';
import { EvaluationCTA } from './EvaluationCTA';
import { Breadcrumb } from './Breadcrumb';
import { FaqSchema } from './FaqSchema';
import { ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, Home, ExternalLink } from './Icons';

interface UniversityDetailContentProps {
  slug: string;
  currentLang: Language;
  onOpenEvaluationModal?: () => void;
}

export const UniversityDetailContent: React.FC<UniversityDetailContentProps> = ({
  slug,
  currentLang,
  onOpenEvaluationModal
}) => {
  const [photoFailed, setPhotoFailed] = useState(false);
  const uni = universitiesData.find(u => u.id === slug);

  if (!uni) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl">
          🏛️
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142033]">
          {currentLang === 'fa' ? 'دانشگاه مورد نظر یافت نشد' : 'University Not Found'}
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {currentLang === 'fa'
            ? 'متأسفانه صفحه‌ای برای این شناسه دانشگاه وجود ندارد یا به آدرس دیگری منتقل شده است.'
            : 'Sorry, the requested university profile could not be found or has been moved.'}
        </p>
        <div>
          <Link
            href="/universities"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-[#2F6FED] text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-colors"
          >
            <span>{currentLang === 'fa' ? 'بازگشت به فهرست دانشگاه‌ها' : 'Back to Universities Directory'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const isWarning = uni.warningLevel !== 'none';
  const badgeColors = isWarning
    ? 'bg-amber-100 text-amber-800 border-amber-300'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  const headerColors = isWarning
    ? 'bg-gradient-to-r from-amber-900 to-amber-700'
    : 'bg-gradient-to-r from-[#071B3D] to-[#2F6FED]';

  const formatAmount = (amount?: number, maxAmount?: number, currency?: string, period?: string, feeType?: string) => {
    if (feeType === 'contact' || !amount) {
      return currentLang === 'fa' ? 'تماس با دانشگاه' : 'Contact University';
    }

    const currLabel = currency === 'EUR' ? (currentLang === 'fa' ? 'یورو' : 'EUR') : (currentLang === 'fa' ? 'رون' : 'RON');
    
    let periodLabel = '';
    if (period === 'academic-year') periodLabel = currentLang === 'fa' ? '/ سال تحصیلی' : '/ year';
    if (period === 'calendar-year') periodLabel = currentLang === 'fa' ? '/ سال تقویمی' : '/ calendar year';

    if (currentLang === 'fa') {
      const amtStr = amount.toLocaleString('fa-IR');
      const maxAmtStr = maxAmount ? ' - ' + maxAmount.toLocaleString('fa-IR') : '';
      return `${amtStr}${maxAmtStr} ${currLabel} ${periodLabel}`;
    } else {
      const amtStr = amount.toLocaleString('en-US');
      const maxAmtStr = maxAmount ? '–' + maxAmount.toLocaleString('en-US') : '';
      return `${currLabel} ${amtStr}${maxAmtStr}${periodLabel}`;
    }
  };

  const name = currentLang === 'fa' ? uni.nameFa : uni.nameEn;
  const city = currentLang === 'fa' ? uni.cityFa : uni.cityEn;
  const institutionType = currentLang === 'fa' ? uni.institutionType.fa : uni.institutionType.en;
  const description = currentLang === 'fa' ? uni.descriptionFa : uni.descriptionEn;
  const disclaimerText = currentLang === 'fa' ? uni.disclaimer?.fa : uni.disclaimer?.en;
  const homeTitle = currentLang === 'fa' ? 'خانه' : 'Home';
  const parentTitle = currentLang === 'fa' ? 'دانشگاه‌ها' : 'Universities';
  const Separator = currentLang === 'fa' ? ChevronLeft : ChevronRight;
  const BackArrow = currentLang === 'fa' ? ArrowRight : ArrowLeft;
  const ArrowIcon = currentLang === 'fa' ? ArrowLeft : ArrowRight;

  const uniFaqs = [
    {
      q: currentLang === 'fa' ? `شهریه دانشگاه ${name} چقدر است؟` : `What is the tuition fee at ${name}?`,
      a: currentLang === 'fa'
        ? (uni.tuitionItems && uni.tuitionItems.length > 0 
            ? `شهریه مقاطع مختلف بین ${uni.tuitionItems.map(t => `${t.program.fa}: ${(t.amount || 0).toLocaleString('fa-IR')} ${t.currency}`).join('، ')} است.`
            : `شهریه بر اساس رشته تحصیلی و مقطع متغیر است و مستقیماً توسط دانشگاه تعیین می‌شود.`)
        : (uni.tuitionItems && uni.tuitionItems.length > 0
            ? `Tuition ranges across programs: ${uni.tuitionItems.map(t => `${t.program.en}: €${(t.amount || 0).toLocaleString()}`).join(', ')}.`
            : `Tuition varies depending on program and degree level.`)
    },
    {
      q: currentLang === 'fa' ? `آیا مدرک دانشگاه ${name} در ایران به رسمیت شناخته می‌شود؟` : `Is ${name}'s degree recognised in Iran?`,
      a: (() => {
        const mosStatus = uni.mosRecognition?.status;
        if (currentLang === 'fa') {
          if (mosStatus === 'OUT_OF_MOS_SCOPE') {
            return 'مرجع ارزیابی مدرک این دانشگاه در ایران وزارت بهداشت، درمان و آموزش پزشکی است (سامانهی موحد)، نه وزارت علوم. بر اساس دادهی ما، این دانشگاه در فهرست مورد تایید وزارت بهداشت قرار دارد.\n\nیک توضیح که جای سوءتفاهم زیادی دارد: فهرست «دانشگاههای مورد تایید خارج از کشور» که سازمان امور دانشجویان منتشر میکند، اساساً دانشگاههای پزشکی را در بر نمیگیرد. خود آن اداره کل تصریح کرده که «صرفاً رشتههایی که در حیطه وظایف وزارت علوم میباشد» را بررسی میکند. پس اگر نام این دانشگاه را در آن فهرست پیدا نکردید، این به معنای رد شدن نیست — به این معناست که اصلاً در دامنهی آن فهرست نیست.\n\nاما یک نکته که ممکن است سرنوشت مدرک شما را عوض کند: تایید وزارت بهداشت به رشتههای پزشکی مربوط است، نه لزوماً به همهی رشتههایی که این دانشگاه ارائه میدهد. اگر رشتهی شما بالینی نیست (مثلاً مهندسی پزشکی، فیزیک پزشکی، یا مدیریت خدمات بهداشتی)، ممکن است مرجع ارزیابی مدرک شما وزارت علوم باشد نه وزارت بهداشت. ما نتوانستیم تایید کنیم ایران دقیقاً کجا این مرز را میکشد — پس پیش از ثبتنام، وضعیت رشتهی مشخص خودتان را جداگانه استعلام بگیرید، نه فقط نام دانشگاه را.';
          }
          if (mosStatus === 'LISTED_2026') {
            return 'برای رشتههای غیرپزشکی، مرجع ارزیابی مدرک خارجی در ایران وزارت علوم، تحقیقات و فناوری است، اما خودِ ارزیابی و فهرست دانشگاههای مورد تایید را «سازمان امور دانشجویان» انجام میدهد و منتشر میکند، نه مستقیماً خود وزارتخانه. این فهرست سه سطح دارد: گروه الف (ممتاز)، گروه ب (خوب)، و گروه ج (متوسط).\n\nدر بررسی ما از این فهرست در تاریخ ۲۲ شهریور ۱۴۰۵ (۱۳ سپتامبر ۲۰۲۶)، این دانشگاه در فهرست سال ۲۰۲۶ ذیل گروه ج (متوسط) آمده بود. در فهرست سال ۲۰۲۴ همین دانشگاه در گروه ب بود — یعنی سطح دانشگاهها سالبهسال تغییر میکند و این عدد را نباید ثابت فرض کرد.\n\nچرا این سطح مهم است: طبق اطلاعیهی رسمی همان اداره کل، متقاضیان ادامه تحصیل در مقطع دکتری باید صرفاً در دانشگاههای گروه الف یا گروه ب ثبتنام رسمی کنند، و مدارک صادره از دانشگاههای گروه ج فقط تا مقطع کارشناسی ارشد قابل بررسی و ارزشیابی است. یعنی اگر هدف شما دکتری است، این دانشگاه با وضعیت فعلیاش برای آن هدف مناسب نیست.\n\nو مهمترین قاعده: ملاک، اعتبار دانشگاه در زمان شروع تحصیل شماست، و فهرست هر سال در اسفند بازنشر میشود. همان اداره کل تصریح کرده که هرگونه درخواست بررسی اعتبار دانشگاه در حین تحصیل یا پس از اتمام تحصیل به هیچ عنوان امکانپذیر نیست. پس این چیزی نیست که بتوانید بعداً درستش کنید: پیش از پذیرش، خودتان فهرست را در grad.saorg.ir ببینید و برای دانشگاه و رشته و مقطع مشخص خودتان از سازمان امور دانشجویان پاسخ کتبی بگیرید. آنچه اینجا میخوانید یک عکس تاریخدار از فهرست است، نه جایگزین استعلام.';
          }
          if (mosStatus === 'NOT_IN_2026_LIST') {
            const priorSentence = uni.mosRecognition?.appearedInPriorLists ? ' این دانشگاه در فهرستهای سالهای پیشین حضور داشت؛ آنچه تغییر کرده فهرست سال ۲۰۲۶ است.' : '';
            return `برای رشتههای غیرپزشکی، مرجع ارزیابی مدرک خارجی در ایران وزارت علوم، تحقیقات و فناوری است، اما خودِ ارزیابی و فهرست دانشگاههای مورد تایید را «سازمان امور دانشجویان» انجام میدهد و منتشر میکند، نه مستقیماً خود وزارتخانه. این فهرست سه سطح دارد: گروه الف (ممتاز)، گروه ب (خوب)، و گروه ج (متوسط).\n\nدر بررسی ما از این فهرست در تاریخ ۲۲ شهریور ۱۴۰۵ (۱۳ سپتامبر ۲۰۲۶)، نام این دانشگاه در بخش رومانیِ فهرست سال ۲۰۲۶ دیده نشد. در آن فهرست فقط دو دانشگاه از رومانی آمده بود و هر دو در گروه ج بودند.${priorSentence}\n\nاین جمله را دقیق بخوانید، چون برداشت اشتباه از آن هزینه دارد:\n\n۱. این یافته دربارهی فهرست سال ۲۰۲۶ است. ملاک هر فرد، فهرستِ سالی است که تحصیلش را در آن شروع کرده. اگر شما سالهای قبل در این دانشگاه شروع کردهاید، وضعیت شما با فهرست همان سال سنجیده میشود، نه با فهرست ۲۰۲۶.\n\n۲. فهرست هر سال در اسفند بازنشر میشود و میتواند سال بعد دوباره عوض شود.\n\n۳. ما یک سایت راهنما هستیم، نه مرجع رسمی، و آنچه اینجا میخوانید یک عکس تاریخدار است. اگر تصمیم شما به این موضوع وابسته است، پیش از پذیرش خودتان فهرست را در grad.saorg.ir ببینید و از سازمان امور دانشجویان برای دانشگاه و رشته و مقطع مشخص خودتان پاسخ کتبی بگیرید.\n\nچرا «پیش از پذیرش» را تاکید میکنیم: همان اداره کل تصریح کرده که اعتبار دانشگاه را در زمان شروع به تحصیل در نظر میگیرد و هرگونه درخواست بررسی اعتبار در حین تحصیل یا پس از اتمام تحصیل به هیچ عنوان امکانپذیر نیست. این یعنی اگر پیش از شروع بررسی نکنید، بعداً راه جبرانی وجود ندارد.`;
          }
          // فالبک امن: وقتی mosRecognition تعریف نشده باشد
          return 'مرجع ارزیابی مدرک خارجی در ایران به رشتهی شما بستگی دارد: برای رشتههای غیرپزشکی وزارت علوم، تحقیقات و فناوری است — که فهرست دانشگاههای مورد تایید را از طریق «سازمان امور دانشجویان» در grad.saorg.ir منتشر میکند — و برای پزشکی، دندانپزشکی و داروسازی، وزارت بهداشت، درمان و آموزش پزشکی (سامانهی موحد).\n\nفهرست سازمان امور دانشجویان سه سطح دارد: گروه الف (ممتاز)، گروه ب (خوب)، و گروه ج (متوسط). این سطح پیامد مستقیم دارد: برای مقطع دکتری باید صرفاً در دانشگاههای گروه الف یا ب ثبتنام کنید، و مدارک دانشگاههای گروه ج فقط تا مقطع کارشناسی ارشد قابل بررسی و ارزشیابی است.\n\nوضعیت این دانشگاه مشخص را ما هنوز در آن فهرست بررسی نکردهایم. پس اینجا نه میگوییم هست و نه میگوییم نیست — چون هیچکدام را نمیدانیم و حدس زدن در این موضوع بیمعناست. تا وقتی این صفحه بهروز شود، خودتان فهرست را در grad.saorg.ir ببینید و برای دانشگاه و رشته و مقطع مشخص خودتان از سازمان امور دانشجویان پاسخ کتبی بگیرید.\n\nو این را جدی بگیرید: ملاک، اعتبار دانشگاه در زمان شروع تحصیل شماست، فهرست هر سال در اسفند بازنشر میشود، و همان اداره کل تصریح کرده که هرگونه درخواست بررسی اعتبار در حین تحصیل یا پس از اتمام تحصیل به هیچ عنوان امکانپذیر نیست. یعنی اگر پیش از پذیرش بررسی نکنید، بعداً راه جبرانی وجود ندارد.';
        }

        // English
        if (mosStatus === 'OUT_OF_MOS_SCOPE') {
          return 'For this university, the Iranian authority that evaluates degrees is the Ministry of Health and Medical Education (the "Movahed" system), not the Ministry of Science. Based on our data, this university appears on the Ministry of Health\'s approved list.\n\nOne point that is widely misunderstood: the list of "approved foreign universities" published by the Organization for Students Affairs (SAORG) does not cover medical universities at all. That office states explicitly that it assesses "only fields that fall within the remit of the Ministry of Science." So if you cannot find this university on that list, it has not been rejected — it is simply outside the scope of that list.\n\nBut one point that could change the outcome for your own degree: Ministry of Health approval concerns medical fields, not necessarily every programme the university offers. If your programme is not clinical (biomedical engineering, medical physics, or health services management, for example), the authority evaluating your degree may be the Ministry of Science rather than the Ministry of Health. We could not confirm exactly where Iran draws that line — so before enrolling, check the position for your specific programme, not just the university\'s name.';
        }
        if (mosStatus === 'LISTED_2026') {
          return 'For non-medical fields, the authority that evaluates foreign degrees in Iran is the Ministry of Science, Research and Technology — but the evaluation itself, and the list of approved universities, is handled and published by the Organization for Students Affairs (SAORG), not by the ministry directly. That list has three tiers: Group A (excellent), Group B (good), and Group C (average).\n\nWhen we checked that list on 13 September 2026, this university appeared in the 2026 list under Group C (average). In the 2024 list the same university was in Group B — so tiers change from year to year and should not be treated as fixed.\n\nWhy the tier matters: according to an official notice from the same office, applicants intending to pursue a doctorate must enrol only at Group A or Group B universities, and degrees issued by Group C universities can be evaluated only up to master\'s level. So if your goal is a PhD, this university in its current tier is not suitable for that goal.\n\nAnd the most important rule: what counts is the university\'s standing at the time you start your studies, and the list is republished every year in Esfand. The same office states explicitly that any request to review a university\'s standing during your studies, or after you graduate, is not possible under any circumstances. This is not something you can fix later: before accepting an offer, check the list yourself at grad.saorg.ir and obtain a written determination from SAORG for your specific university, programme and degree level. What you read here is a dated snapshot of the list, not a substitute for that check.';
        }
        if (mosStatus === 'NOT_IN_2026_LIST') {
          const priorSentence = uni.mosRecognition?.appearedInPriorLists ? ' This university did appear in lists from earlier years; what has changed is the 2026 list.' : '';
          return `For non-medical fields, the authority that evaluates foreign degrees in Iran is the Ministry of Science, Research and Technology — but the evaluation itself, and the list of approved universities, is handled and published by the Organization for Students Affairs (SAORG), not by the ministry directly. That list has three tiers: Group A (excellent), Group B (good), and Group C (average).\n\nWhen we checked that list on 13 September 2026, this university did not appear in the Romania section of the 2026 list. Only two Romanian universities appeared there, both in Group C.${priorSentence}\n\nPlease read that carefully, because misreading it is costly:\n\n1. This finding concerns the 2026 list. What counts for any individual is the list for the year in which they started their studies. If you started at this university in an earlier year, your position is assessed against that year's list, not the 2026 one.\n\n2. The list is republished every year in Esfand and can change again next year.\n\n3. We are a guidance site, not an official authority, and what you read here is a dated snapshot. If your decision depends on this, check the list yourself at grad.saorg.ir before accepting an offer, and obtain a written determination from SAORG for your specific university, programme and degree level.\n\nWhy we stress "before accepting": the same office states that it considers a university's standing at the time studies begin, and that any request to review that standing during your studies, or after you graduate, is not possible under any circumstances. If you do not check before you start, there is no way to fix it afterwards.`;
        }
        // Fallback: when mosRecognition is undefined
        return 'Which Iranian authority evaluates your degree depends on your field: for non-medical fields it is the Ministry of Science, Research and Technology — which publishes the list of approved universities through the Organization for Students Affairs (SAORG) at grad.saorg.ir — and for Medicine, Dentistry and Pharmacy it is the Ministry of Health and Medical Education (the "Movahed" system).\n\nThe SAORG list has three tiers: Group A (excellent), Group B (good), and Group C (average). The tier has direct consequences: for a doctorate you must enrol only at a Group A or Group B university, and degrees from Group C universities can be evaluated only up to master\'s level.\n\nWe have not yet checked this specific university against that list. So we are not telling you it is on the list, and we are not telling you it is absent — we do not know, and guessing about this is worthless. Until this page is updated, check the list yourself at grad.saorg.ir and obtain a written determination from SAORG for your specific university, programme and degree level.\n\nAnd take this seriously: what counts is the university\'s standing at the time you start your studies, the list is republished every year in Esfand, and the same office states that any request to review that standing during your studies or after you graduate is not possible under any circumstances. If you do not check before you accept an offer, there is no way to fix it afterwards.';
      })()
    },
    {
      q: currentLang === 'fa' ? `آیا امکان تحصیل به زبان انگلیسی در ${name} وجود دارد؟` : `Are English-taught programs available at ${name}?`,
      a: currentLang === 'fa'
        ? `بله، در این دانشگاه برنامه‌های آموزشی به زبان انگلیسی یا رومانیایی (به همراه دوره سال مقدماتی زبان) ارائه می‌شود. با این حال زبان تدریس دقیق بسته به رشته و مقطع تحصیلی متفاوت است و باید مستقیماً از بخش پذیرش دانشگاه استعلام شود.`
        : `Yes, English-taught and Romanian-taught degree programs are available with preparatory language year options. However, exact teaching languages vary by degree and department and should be confirmed directly with university admissions.`
    },
    ...(uni.mosRecognition?.status === 'OUT_OF_MOS_SCOPE' ? [{
      q: currentLang === 'fa'
        ? 'برای ارزشیابی مدرک پزشکی از رومانی در ایران چه مراحلی لازم است؟'
        : 'What does it take to have a Romanian medical degree evaluated in Iran?',
      a: currentLang === 'fa'
        ? `ارزشیابی مدرک در حوزه‌ی وزارت بهداشت فقط بررسی کاغذی مدارک نیست. طبق سوالات متداول رسمی مرکز خدمات آموزشی، برای هر رشته یک آزمون در ایران در کار است: برای پزشکی عمومی «آزمون پیش‌کارورزی»، برای داروسازی «آزمون ارزشیابی»، و برای دندانپزشکی عمومی «آزمون ملی» — که به گفته‌ی همان منبع معمولاً سالی دو بار برگزار می‌شود.\n\nهمان منبع می‌گوید بعضی متقاضیان از آزمون معاف‌اند، اما شرایط معافیت را به «آیین‌نامه‌ی ارزشیابی دانش‌آموختگان خارج از کشور» ارجاع می‌دهد و خودش توضیح نمی‌دهد. ما آن آیین‌نامه را مستقیماً ندیده‌ایم، پس درباره‌ی اینکه چه کسی معاف می‌شود چیزی نمی‌گوییم. یک نکته‌ی مشخص اما هست: در داروسازی، حتی در صورت معافیت از آزمون، گذراندن ۸ واحد کارآموزی داروخانه الزامی اعلام شده است.\n\nسه قاعده‌ی دیگر که بهتر است پیش از انتخاب دانشگاه بدانید، نه بعد از آن:\n\n۱. اگر در دانشگاهی درس بخوانید که در فهرست مورد تایید نیست، توصیه‌ی رسمی این است که هرچه زودتر به دانشگاه تاییدشده منتقل شوید، و دست‌کم نیمی از دوره باید در دانشگاه تاییدشده گذرانده شده باشد.\n\n۲. تحصیلات غیرحضوری و مکاتبه‌ای، به تصریح ضوابط، «بی‌اعتبار است و ارزشیابی نمی‌شود».\n\n۳. برای کسانی که از ابتدای سال ۲۰۱۹ تحصیل در خارج را شروع کرده‌اند، تمام نکردن دوره در سقف سنوات مجاز پیامد دارد؛ و اگر معافیت تحصیلی دارید، هم تحصیل خارج و هم دوره‌ی تکمیلی داخل کشور باید در سقف سنوات معافیت به پایان برسد.\n\nبرای وضعیت مشخص خودتان، مرجع مرکز خدمات آموزشی وزارت بهداشت است: mohed.behdasht.gov.ir/Assessment`
        : `Having a degree evaluated by Iran's Ministry of Health is not only a review of documents. According to the official FAQ of the ministry's educational services centre, each field involves an examination in Iran: for general medicine the pre-internship exam, for pharmacy the evaluation exam, and for general dentistry the national exam — held, according to that same source, usually twice a year.\n\nThe same source says some applicants are exempt from the exam, but refers the conditions to the "regulation on the evaluation of graduates from abroad" rather than stating them. We have not read that regulation directly, so we say nothing about who qualifies for an exemption. One specific point is stated, though: in pharmacy, even applicants exempt from the exam are required to complete 8 credits of pharmacy internship.\n\nThree further rules worth knowing before you choose a university rather than after:\n\n1. If you study at a university that is not on the approved list, the official advice is to transfer to an approved one as soon as possible, and at least half of the programme must have been completed at an approved university.\n\n2. Distance and correspondence study is, in the explicit words of the rules, "invalid and not evaluated".\n\n3. For those who began studying abroad from the start of 2019, failing to finish within the permitted duration has consequences; and if you hold a student military deferment, both your studies abroad and any supplementary course inside Iran must finish within that deferment period.\n\nFor your own situation, the authority is the Ministry of Health's educational services centre: mohed.behdasht.gov.ir/Assessment`
    }] : [])
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <FaqSchema items={uniFaqs} />
      <Breadcrumb
        customTitle={name}
        customParentPath="/universities"
        customParentTitle={parentTitle}
        currentLang={currentLang}
      />

      {/* CAMPUS PHOTO BANNER (if available) */}
      {uni.photoUrl && !photoFailed && (
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          <Image
            src={uni.photoUrl}
            alt={(currentLang === 'fa' ? uni.photoCaptionFa : uni.photoCaptionEn) || name}
            width={1200}
            height={480}
            quality={85}
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="w-full h-64 sm:h-96 object-cover"
            onError={() => setPhotoFailed(true)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6">
            <p className="text-white text-xs sm:text-sm font-medium">
              {currentLang === 'fa' ? uni.photoCaptionFa : uni.photoCaptionEn}
            </p>
          </div>
        </div>
      )}

      {/* HERO HEADER PANEL */}
      <div className={`${headerColors} rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-4`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${badgeColors}`}>
            {currentLang === 'fa' ? uni.badgeTextFa : uni.badgeTextEn}
          </span>
          {uni.foundedYear && (
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-white/15 text-white border border-white/20">
              {currentLang === 'fa' ? `سال تأسیس: ${uni.foundedYear.toLocaleString('fa-IR')}` : `Founded: ${uni.foundedYear}`}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
          {name}
        </h1>

        <div className="text-sm sm:text-base text-white/80 italic font-medium">
          {uni.officialRomanianName}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90 pt-2 border-t border-white/20">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <span>📍</span>
            <span className="font-semibold">{city}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <span>🏛️</span>
            <span className="font-semibold">{institutionType}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <span>🎓</span>
            <span>{currentLang === 'fa' ? 'سال تحصیلی:' : 'Academic Year:'} {uni.tuitionAcademicYear}</span>
          </div>
        </div>

        {/* Action button in hero */}
        {uni.officialWebsite && (
          <div className="pt-2">
            <a
              href={uni.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-2.5 bg-white text-[#071B3D] hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold shadow transition-all hover:-translate-y-0.5"
            >
              <span>{currentLang === 'fa' ? 'وبسایت رسمی دانشگاه' : 'Official University Website'}</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </div>

      {/* MAIN OVERVIEW & DISCLAIMER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dfe6ef] shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#142033]">
          {currentLang === 'fa' ? 'معرفی و نمای کلی' : 'Overview & About'}
        </h2>
        <p className="text-[#526174] text-sm sm:text-base leading-relaxed">
          {description}
        </p>

        {disclaimerText && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-amber-900 leading-relaxed space-y-1">
            <div className="font-bold flex items-center space-x-1.5 rtl:space-x-reverse">
              <span>⚠️</span>
              <span>{currentLang === 'fa' ? 'نکته و هشدار مهم' : 'Important Notice'}</span>
            </div>
            <p>{disclaimerText}</p>
          </div>
        )}
      </div>

      {/* FACILITIES & KEY HIGHLIGHTS */}
      {uni.facilities && uni.facilities.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dfe6ef] shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#142033]">
              {currentLang === 'fa' ? 'امکانات، پیشینه و ویژگی‌های برجسته' : 'Facilities, Heritage & Key Features'}
            </h2>
            <p className="text-xs sm:text-sm text-[#526174] mt-1">
              {currentLang === 'fa'
                ? 'نکات برجسته درباره پیشینه علمی، ظرفیت‌های بالینی و پژوهشی و استانداردهای آموزشی'
                : 'Key facts regarding academic heritage, clinical and research facilities, and quality standards'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uni.facilities.map((fac, idx) => (
              <div
                key={idx}
                className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 flex items-start space-x-3 rtl:space-x-reverse"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2F6FED]/10 text-[#2F6FED] flex items-center justify-center text-xs font-bold mt-0.5">
                  ✓
                </span>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  {currentLang === 'fa' ? fac.fa : fac.en}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DEGREE LEVELS & PROGRAMS */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dfe6ef] shadow-sm space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#142033]">
            {currentLang === 'fa' ? 'مقاطع و رشته‌های تحصیلی' : 'Degree Levels & Academic Programs'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526174] mt-1">
            {currentLang === 'fa'
              ? 'اطلاعات دوره‌های کارشناسی، کارشناسی ارشد و دکتری ارائه شده در این دانشگاه'
              : 'Undergraduate, Master’s, and Doctoral programs offered at this institution'}
          </p>
        </div>

        {uni.degreeLevels && uni.degreeLevels.length > 0 && (
          <div className="space-y-4">
            {uni.degreeLevels.map((dl, idx) => (
              <div
                key={idx}
                className="border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#f8fafc] to-white space-y-2"
              >
                <div className="inline-block px-3 py-1 bg-[#071B3D] text-white rounded-lg text-xs font-bold">
                  {currentLang === 'fa' ? dl.levelFa : dl.levelEn}
                </div>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  {currentLang === 'fa' ? dl.fieldsFa : dl.fieldsEn}
                </p>
              </div>
            ))}
          </div>
        )}

        {uni.programs && uni.programs.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {currentLang === 'fa' ? 'زمینه‌های تحصیلی کلیدی:' : 'Key Academic Fields:'}
            </div>
            <div className="flex flex-wrap gap-2">
              {uni.programs.map((program, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#eef3f8] text-[#142033] rounded-xl text-xs font-medium border border-[#dfe6ef]"
                >
                  {currentLang === 'fa' ? program.name.fa : program.name.en}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* RANKINGS & STANDINGS */}
      {uni.rankingFacts && uni.rankingFacts.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dfe6ef] shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#142033]">
              {currentLang === 'fa' ? 'رتبه‌بندی و جایگاه علمی (با ذکر منبع)' : 'Rankings & Global Standing (Sourced)'}
            </h2>
            <p className="text-xs sm:text-sm text-[#526174] mt-1">
              {currentLang === 'fa'
                ? 'جایگاه‌های مستند در رتبه‌بندی‌های معتبر بین‌المللی همراه با لینک منبع رسمی'
                : 'Documented positions in recognized global ranking systems with direct source links'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uni.rankingFacts.map((rf, idx) => (
              <div
                key={idx}
                className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#2F6FED] uppercase tracking-wider">
                    {currentLang === 'fa' ? rf.labelFa : rf.labelEn}
                  </span>
                  <p className="text-sm font-extrabold text-[#142033] leading-snug">
                    {currentLang === 'fa' ? rf.valueFa : rf.valueEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <a
                    href={rf.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 rtl:space-x-reverse text-xs font-semibold text-slate-500 hover:text-[#2F6FED] transition-colors"
                  >
                    <span>
                      {currentLang === 'fa' ? `منبع: ${rf.sourceLabelFa}` : `Source: ${rf.sourceLabelEn}`}
                    </span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TUITION & FEES SECTION */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dfe6ef] shadow-sm space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#142033]">
            {currentLang === 'fa' ? 'شهریه و هزینه‌های تحصیلی' : 'Tuition & Fees'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526174] mt-1">
            {currentLang === 'fa'
              ? `بر اساس سند رسمی منتشرشده برای سال تحصیلی ${uni.tuitionAcademicYear}`
              : `Based on official publications for the ${uni.tuitionAcademicYear} academic year`}
          </p>
        </div>

        <div className="space-y-3">
          {uni.tuitionItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] gap-2"
            >
              <span className="font-semibold text-sm text-[#142033]">
                {currentLang === 'fa' ? item.program.fa : item.program.en}
              </span>
              <span className="font-extrabold text-base text-[#2F6FED]" dir="ltr">
                {formatAmount(item.amount, item.maxAmount, item.currency, item.period, item.feeType)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>{currentLang === 'fa' ? 'وضعیت استناد شهریه:' : 'Tuition Verification Status:'}</span>
          <span className="font-bold text-[#142033]">
            {uni.tuitionVerificationStatus === 'OFFICIAL_FIXED' && (currentLang === 'fa' ? '✓ سند رسمی دانشگاه با رقم قطعی' : '✓ Official Fixed Fee Document')}
            {uni.tuitionVerificationStatus === 'CONTACT_UNIVERSITY' && (currentLang === 'fa' ? 'نیاز به استعلام مستقیم از دانشگاه' : 'Direct Inquiry Required')}
            {uni.tuitionVerificationStatus === 'OFFICIAL_RANGE' && (currentLang === 'fa' ? '✓ محدوده رسمی شهریه بر حسب رشته' : '✓ Official Range by Program')}
          </span>
        </div>

        {/* RECOGNITION SOURCES */}
        {uni.recognitionSources && uni.recognitionSources.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {currentLang === 'fa' ? 'اسناد و منابع معتبر:' : 'Authoritative Sources & Documents:'}
            </div>
            <div className="space-y-2">
              {uni.recognitionSources.map((src, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-700 font-medium">
                    {currentLang === 'fa' ? src.name.fa : src.name.en} ({currentLang === 'fa' ? src.issuer.fa : src.issuer.en})
                  </span>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2F6FED] hover:underline font-bold"
                    >
                      {currentLang === 'fa' ? 'مشاهده سند ↗' : 'View Document ↗'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* COST OF LIVING CONTEXTUAL CALLOUT */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 text-center sm:text-start">
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-[#2F6FED] uppercase tracking-wider">
            <span>💰</span>
            <span>{currentLang === 'fa' ? `برآورد هزینه‌های زندگی در ${city}` : `Living Expenses in ${city}`}</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#142033]">
            {currentLang === 'fa'
              ? `هزینه ماهانه زندگی دانشجویی و اجاره مسکن در ${city} چقدر است؟`
              : `What does it cost to live and study in ${city}?`}
          </h3>
          <p className="text-xs sm:text-sm text-[#526174] max-w-xl">
            {currentLang === 'fa'
              ? `برای برآورد دقیق هزینه‌های مسکن، خوابگاه دانشجویی، خوراک، حمل‌ونقل و قبوض در ${city}، از محاسبه‌گر هوشمند هزینه زندگی استفاده کنید.`
              : `Estimate monthly expenses for housing, student dorms, groceries, public transit, and utilities in ${city} using our interactive calculator.`}
          </p>
        </div>
        <Link
          href="/needs/cost-of-living"
          className="flex-shrink-0 inline-flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-[#2F6FED] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <span>{currentLang === 'fa' ? `محاسبه هزینه زندگی در ${city}` : `Calculate Living Cost`}</span>
          <ArrowIcon size={14} />
        </Link>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div id="faq" className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-[#1e293b] border-b border-[#cbd5e1] pb-3">
          {currentLang === 'fa' ? 'سوالات متداول' : 'Frequently Asked Questions'}
        </h3>
        <div className="space-y-6">
          {uniFaqs.map((faq, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-bold text-sm sm:text-base text-[#334155]">{faq.q}</h4>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed whitespace-pre-line">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* OFFICIAL ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#071B3D] rounded-3xl text-white shadow-lg">
        <div>
          <h3 className="text-lg font-bold">
            {currentLang === 'fa' ? 'اطلاعات بیشتر و ثبت‌نام' : 'More Information & Admissions'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            {currentLang === 'fa'
              ? 'برای مشاهده الزامات دقیق و تقویم آموزشی به سایت رسمی دانشگاه مراجعه کنید.'
              : 'Visit the official university portal for exact requirements and academic calendar.'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {uni.officialWebsite && (
            <a
              href={uni.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial text-center px-6 py-3 bg-white text-[#071B3D] hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold shadow transition-all hover:-translate-y-0.5"
            >
              {currentLang === 'fa' ? 'سایت رسمی دانشگاه ↗' : 'Official Website ↗'}
            </a>
          )}
          <Link
            href="/universities"
            className="flex-1 sm:flex-initial text-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-colors"
          >
            {currentLang === 'fa' ? 'همه دانشگاه‌ها' : 'All Universities'}
          </Link>
        </div>
      </div>

      {/* BOTTOM EVALUATION CTA */}
      <EvaluationCTA
        variant="study"
        currentLang={currentLang}
        onOpenModal={onOpenEvaluationModal || (() => {})}
      />
    </div>
  );
};
