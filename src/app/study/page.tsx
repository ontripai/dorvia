'use client';

import { useAppContext } from '../../components/AppLayout';
import { featuredUniversities } from '../../lib/data';
import { UniversityCard } from '../../components/UniversityCard';
import { EvaluationCTA } from '../../components/EvaluationCTA';

export default function StudyHubPage() {
  const { currentLang, onNavigate , onOpenEvaluationModal } = useAppContext();

  return (
    <div className="space-y-12 animate-fadeIn max-w-[1280px] mx-auto px-4 py-8">
      <div className="dark-hero-panel rounded-3xl p-8 sm:p-14 space-y-4 shadow-xl">
        <span className="text-[#F4F7FC] font-bold text-xs uppercase tracking-wider">
          {currentLang === 'fa' ? 'آموزش عالی رومانی' : 'Higher Education'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {currentLang === 'fa' ? 'تحصیل در دانشگاه‌های معتبر رومانی' : 'Study in Romania'}
        </h1>
        <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
          {currentLang === 'fa'
            ? 'تحصیل به زبان‌های انگلیسی و فرانسوی با شهریه‌های اقتصادی، مدارک معتبر اتحادیه اروپا و امکان کار دانشجویی.'
            : 'Accredited European university degrees in English & French with balanced tuition and student work permits.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="editorial-card p-6 space-y-4 bg-white">
            <h2 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? 'مزایای تحصیل در رومانی' : 'Why Study in Romania?'}
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[#526174]">
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-[#2F6FED] flex items-center justify-center text-[10px] font-bold">✓</span>
                <span>{currentLang === 'fa' ? 'پذیرش در رشته‌های پزشکی و مهندسی به زبان انگلیسی' : 'Medicine & Engineering in English'}</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-[#2F6FED] flex items-center justify-center text-[10px] font-bold">✓</span>
                <span>{currentLang === 'fa' ? 'شهریه سالانه متعادل بر اساس رشته و دانشگاه' : 'Balanced annual tuition rates'}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? 'دانشگاه‌های پیشنهادی' : 'Featured Universities'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredUniversities.map((uni) => (
                <UniversityCard key={uni.id} university={uni} currentLang={currentLang} onSelect={() => onNavigate('universities')} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#142033]">
              {currentLang === 'fa' ? 'مسیرهای تحصیلی' : 'Study Pathways'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" onClick={() => onNavigate('study/scholarships')}>
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'بورسیه تحصیلی دولتی' : 'Government Scholarships'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'معافیت کامل از شهریه و هزینه ثبت‌نام' : 'Full tuition waiver and stipend'}</p>
              </div>
              <div className="editorial-card p-4 space-y-2 bg-white cursor-pointer hover:border-[#2F6FED] transition-colors" onClick={() => onNavigate('study/preparatory-year')}>
                <h4 className="font-bold text-[#2F6FED]">{currentLang === 'fa' ? 'سال زبان (پیش‌دانشگاهی)' : 'Language Preparatory Year'}</h4>
                <p className="text-xs text-[#526174]">{currentLang === 'fa' ? 'دوره آموزش زبان رومانیایی پیش از دانشگاه' : 'Romanian language course before degree'}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
        </div>
      </div>
    </div>
  );
}
