import React from 'react';
import { Language } from '../types';
import { getTranslations } from '../lib/i18n';

interface TrustSectionProps {
  currentLang: Language;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ currentLang }) => {
  const t = getTranslations(currentLang);

  const trustPillars = [
    {
      icon: '🛡️',
      title: currentLang === 'fa' ? 'شفافیت ۱۰۰٪ قانونی' : '100% Legal Transparency',
      desc: currentLang === 'fa' ? 'تمامی رویه‌ها طبق آخرین بخشنامه‌ها و قوانین رسمی وزارت خارجه و اداره مهاجرت رومانی (IGI) ارائه می‌شوند.' : 'All procedures comply strictly with official Romanian Ministry of Foreign Affairs & IGI directives.'
    },
    {
      icon: '⚖️',
      title: currentLang === 'fa' ? 'تعهد اخلاقی و بدون وعده کاذب' : 'Ethical Advisory & No False Claims',
      desc: currentLang === 'fa' ? 'ما هیچ‌گاه تضمین صددرصدی صدور ویزا نمی‌دهیم؛ زیرا مرجع نهایی تصمیم‌گیری فقط سفارت و دولت رومانی است.' : 'We never sell guaranteed visas. Final approval remains strictly under official embassy jurisdiction.'
    },
    {
      icon: '🎯',
      title: currentLang === 'fa' ? 'پشتیبانی مرحله به مرحله' : 'Step-by-Step Relocation Support',
      desc: currentLang === 'fa' ? 'همراهی از نخستین ارزیابی رزومه تا دریافت پذیرش، آماده‌سازی سفارت، اجاره مسکن و کارت اقامت.' : 'Guidance from initial document review to university admission, embassy prep, housing, and residence card.'
    },
    {
      icon: '🇪🇺',
      title: currentLang === 'fa' ? 'تخصص در اتحادیه اروپا و شنگن' : 'EU & Schengen Area Expertise',
      desc: currentLang === 'fa' ? 'رومانی عضو منطقه شنگن است. شرایط سفر اتباع غیراروپایی به سایر کشورهای شنگن به نوع و اعتبار ویزا یا کارت اقامت و مقررات جاری بستگی دارد.' : 'Romania is a member of the Schengen Area. Travel conditions for non-EU citizens to other Schengen countries depend on the type and validity of the visa or residence permit and current regulations.'
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white rounded-3xl my-12 px-6 sm:px-10 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background Romanian Colors Glow Accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#071B3D]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#2F6FED]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 bg-yellow-400/10 text-[#F4F7FC] rounded-full text-xs font-bold mb-3 border border-yellow-400/20">
            {currentLang === 'fa' ? 'اصول کاری ما' : 'Our Professional Ethics'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentLang === 'fa' ? 'تعهد ما: صداقت، اعتبار و مسیر قانونی' : 'Our Commitment: Integrity, Transparency & Legal Rigor'}
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            {currentLang === 'fa' 
              ? 'پلتفرم «در رومانی» با رویکردی کاملاً خدمات‌محور و شفاف، شما را از نخستین قدم تا استقرار نهایی راهنمایی می‌کند.'
              : 'Dar Romania operates with full compliance, providing objective advisory without unrealistic promises.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((pillar, idx) => (
            <div key={idx} className="bg-slate-800/80 backdrop-blur border border-slate-700/70 p-6 rounded-2xl space-y-3 hover:border-[#2F6FED]/50 transition-colors">
              <div className="text-3xl">{pillar.icon}</div>
              <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* Legal Mandatory Notice Box */}
        <div className="mt-10 p-4 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start space-x-3 rtl:space-x-reverse">
          <span className="text-amber-400 font-bold text-lg leading-none">⚠️</span>
          <div>
            <strong className="block text-amber-300 font-bold mb-1">
              {currentLang === 'fa' ? 'یادداشت حقوقی مهم:' : 'Important Legal Notice:'}
            </strong>
            <span>{t.disclaimer.text}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
