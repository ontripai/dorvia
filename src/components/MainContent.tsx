import React, { useState } from 'react';
import { Language, University, City, ServiceItem } from '../types';
import { getTranslations } from '../lib/i18n';
import { featuredUniversities, featuredCities, mainServices, sampleArticles } from '../lib/data';
import { PathwayCard } from './PathwayCard';
import { UniversityCard } from './UniversityCard';
import { CityCard } from './CityCard';
import { ServiceCard } from './ServiceCard';
import { LeadForm } from './LeadForm';
import { TrustSection } from './TrustSection';

interface MainContentProps {
  currentLang: Language;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onOpenEvaluationModal: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  currentLang,
  activeRoute,
  onNavigate,
  onOpenEvaluationModal
}) => {
  const t = getTranslations(currentLang);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // Filter state for Universities page
  const [uniSearch, setUniSearch] = useState('');
  const [uniTypeFilter, setUniTypeFilter] = useState('all');

  // Filter state for Cities page
  const [citySearch, setCitySearch] = useState('');

  // RENDER PAGE BY ROUTE ID
  switch (activeRoute) {
    
    // -------------------------------------------------------------
    // 1. HOME PAGE
    // -------------------------------------------------------------
    case 'home':
    default:
      return (
        <div className="space-y-16">
          
          {/* Section 1: Hero Section */}
          <section className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-[#002B7F] to-slate-900 text-white p-8 sm:p-14 lg:p-20 overflow-hidden shadow-2xl">
            {/* Romania Flag Colors Lighting Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#002B7F]/60 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FCD116]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#CE1126]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
              
              <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[#FCD116] text-xs sm:text-sm font-bold animate-pulse">
                <span>🇪🇺</span>
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                {t.hero.headline}
              </h1>

              <p className="text-slate-200 text-base sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                {t.hero.subheadline}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onOpenEvaluationModal}
                  className="w-full sm:w-auto px-8 py-4 bg-[#FCD116] hover:bg-yellow-400 text-slate-950 font-extrabold rounded-2xl text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#002B7F]"></span>
                  <span>{t.hero.ctaPrimary}</span>
                </button>

                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-base border border-white/30 backdrop-blur transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <span>📞</span>
                  <span>{t.hero.ctaSecondary}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 font-medium pt-2">
                ✓ {t.hero.trustNote}
              </p>

            </div>
          </section>

          {/* Section 2: Main Pathways */}
          <section className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-[#002B7F] font-extrabold text-xs tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full">
                {currentLang === 'fa' ? 'مسیرهای قانونی مهاجرت' : 'Legal Immigration Pathways'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                {t.pathways.title}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                {t.pathways.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PathwayCard
                currentLang={currentLang}
                title={t.pathways.study.title}
                desc={t.pathways.study.desc}
                icon="🎓"
                badge={currentLang === 'fa' ? 'پرطرفدار' : 'Popular'}
                onClick={() => onNavigate('study')}
              />
              <PathwayCard
                currentLang={currentLang}
                title={t.pathways.work.title}
                desc={t.pathways.work.desc}
                icon="💼"
                badge={currentLang === 'fa' ? 'بازار کار فوری' : 'In Demand'}
                onClick={() => onNavigate('work')}
              />
              <PathwayCard
                currentLang={currentLang}
                title={t.pathways.company.title}
                desc={t.pathways.company.desc}
                icon="🏢"
                badge={currentLang === 'fa' ? 'مالیات ۱٪' : '1% Micro Tax'}
                onClick={() => onNavigate('company')}
              />
              <PathwayCard
                currentLang={currentLang}
                title={t.pathways.investment.title}
                desc={t.pathways.investment.desc}
                icon="📈"
                onClick={() => onNavigate('immigration')}
              />
              <PathwayCard
                currentLang={currentLang}
                title={t.pathways.family.title}
                desc={t.pathways.family.desc}
                icon="👨‍👩‍👧‍👦"
                onClick={() => onNavigate('immigration')}
              />
              <PathwayCard
                currentLang={currentLang}
                title={t.pathways.living.title}
                desc={t.pathways.living.desc}
                icon="🏛️"
                onClick={() => onNavigate('living')}
              />
            </div>
          </section>

          {/* Section 3: Why Romania */}
          <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80 space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {t.whyRomania.title}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                {t.whyRomania.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.whyRomania.items.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#002B7F] text-[#FCD116] flex items-center justify-center font-extrabold text-sm mb-3">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Featured Universities */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[#002B7F] font-extrabold text-xs uppercase tracking-wider">
                  {currentLang === 'fa' ? 'دانشگاه‌های برجسته' : 'Featured Universities'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {currentLang === 'fa' ? 'دانشگاه‌های معتبر بین‌المللی رومانی' : 'Accredited Romanian Universities'}
                </h2>
              </div>
              <button
                onClick={() => onNavigate('universities')}
                className="text-xs sm:text-sm font-bold text-[#002B7F] hover:underline flex items-center space-x-1 rtl:space-x-reverse"
              >
                <span>{currentLang === 'fa' ? 'مشاهده همه دانشگاه‌ها' : 'View All Universities'}</span>
                <span>←</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredUniversities.map((uni) => (
                <UniversityCard
                  key={uni.id}
                  university={uni}
                  currentLang={currentLang}
                  onSelect={(u) => {
                    setSelectedUniversity(u);
                    onNavigate('study');
                  }}
                />
              ))}
            </div>
          </section>

          {/* Section 5: Featured Cities */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[#002B7F] font-extrabold text-xs uppercase tracking-wider">
                  {currentLang === 'fa' ? 'شهرهای مهم' : 'Key Cities'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {currentLang === 'fa' ? 'بهترین شهرهای رومانی برای زندگی و تحصیل' : 'Top Cities for Living & Business'}
                </h2>
              </div>
              <button
                onClick={() => onNavigate('cities')}
                className="text-xs sm:text-sm font-bold text-[#002B7F] hover:underline flex items-center space-x-1 rtl:space-x-reverse"
              >
                <span>{currentLang === 'fa' ? 'مشاهده همه شهرها' : 'Explore All Cities'}</span>
                <span>←</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCities.slice(0, 3).map((city) => (
                <CityCard
                  key={city.id}
                  city={city}
                  currentLang={currentLang}
                  onSelect={(c) => {
                    setSelectedCity(c);
                    onNavigate('cities');
                  }}
                />
              ))}
            </div>
          </section>

          {/* Section 6: Our Services Preview */}
          <section className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-[#002B7F] font-extrabold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                {currentLang === 'fa' ? 'خدمات تخصصی' : 'Our Professional Services'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                {currentLang === 'fa' ? 'پشتیبانی جامع پرونده شما در رومانی' : 'End-to-End Professional Guidance'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mainServices.slice(0, 3).map((svc) => (
                <ServiceCard
                  key={svc.id}
                  service={svc}
                  currentLang={currentLang}
                  onSelect={() => onNavigate('services')}
                />
              ))}
            </div>
          </section>

          {/* Section 7: Interactive Lead Capture Form Section */}
          <section id="evaluation-form-section" className="py-4">
            <LeadForm currentLang={currentLang} />
          </section>

          {/* Section 8: Latest Articles & Resources */}
          <section className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {currentLang === 'fa' ? 'آخرین مقالات و راهنماهای کاربردی' : 'Latest Articles & Legal Updates'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="text-[#002B7F] bg-blue-50 px-2.5 py-1 rounded-md">{article.category[currentLang]}</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-[#002B7F] cursor-pointer" onClick={() => onNavigate('articles')}>
                    {article.title[currentLang]}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {article.excerpt[currentLang]}
                  </p>
                  <button onClick={() => onNavigate('articles')} className="text-xs font-bold text-[#002B7F] pt-2 block">
                    {currentLang === 'fa' ? 'مطالعه مقاله كامل ←' : 'Read Full Article →'}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Section 9: Trust & Ethical Standards */}
          <TrustSection currentLang={currentLang} />

          {/* Section 10: Final CTA Banner */}
          <section className="bg-gradient-to-r from-[#002B7F] to-[#001D54] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold">
                {currentLang === 'fa' ? 'نیاز به راهنمایی در انتخاب مسیر مناسب دارید؟' : 'Ready to Start Your European Journey?'}
              </h2>
              <p className="text-slate-200 text-sm sm:text-base">
                {currentLang === 'fa' 
                  ? 'هم‌اکنون اطلاعات اولیه خود را ارسال کنید تا رزومه شما توسط کارشناسان ما ارزیابی شود.'
                  : 'Submit your profile details for an initial legal and academic feasibility review.'}
              </p>
              <button
                onClick={onOpenEvaluationModal}
                className="px-8 py-4 bg-[#FCD116] hover:bg-yellow-400 text-slate-950 font-extrabold rounded-2xl text-base shadow-xl transition-transform transform hover:scale-105"
              >
                {t.hero.ctaPrimary}
              </button>
            </div>
          </section>

        </div>
      );

    // -------------------------------------------------------------
    // 2. IMMIGRATION TO ROMANIA
    // -------------------------------------------------------------
    case 'immigration':
      return (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-gradient-to-r from-slate-900 to-[#002B7F] text-white rounded-3xl p-8 sm:p-14 space-y-4">
            <span className="text-[#FCD116] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'روش‌های ورود و اقامت' : 'Legal Residence Pathways'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold">
              {currentLang === 'fa' ? 'مهاجرت به کشور رومانی' : 'Immigration to Romania'}
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'بررسی کامل کلیه روش‌های قانونی مهاجرت، اخذ اقامت موقت و دائم اتحادیه اروپا در کشور رومانی بر اساس قوانین رسمی وزارت کشور و اداره کل مهاجرت (IGI).'
                : 'Complete legal overview of temporary and long-term European residency pathways in Romania.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xl font-bold text-[#002B7F]">🎓 {t.pathways.study.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.pathways.study.desc}</p>
              <button onClick={() => onNavigate('study')} className="text-xs font-bold text-[#002B7F] hover:underline">
                {currentLang === 'fa' ? 'جزئیات تحصیل در رومانی ←' : 'Study Details →'}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xl font-bold text-[#002B7F]">💼 {t.pathways.work.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.pathways.work.desc}</p>
              <button onClick={() => onNavigate('work')} className="text-xs font-bold text-[#002B7F] hover:underline">
                {currentLang === 'fa' ? 'جزئیات اشتغال و ویزای کار ←' : 'Work Permit Details →'}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xl font-bold text-[#002B7F]">🏢 {t.pathways.company.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.pathways.company.desc}</p>
              <button onClick={() => onNavigate('company')} className="text-xs font-bold text-[#002B7F] hover:underline">
                {currentLang === 'fa' ? 'جزئیات ثبت شرکت ←' : 'Company Formation Details →'}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xl font-bold text-[#002B7F]">👨‍👩‍👧‍👦 {t.pathways.family.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentLang === 'fa'
                  ? 'بر طبق قوانین IGI، دارندگان اقامت قانونی تحصیلی یا کاری می‌توانند برای الحاق همسر و فرزندان زیر ۱۸ سال اقدام نمایند.'
                  : 'Legal resident visa holders can apply for family reunification under IGI regulations.'}
              </p>
            </div>
          </div>

          <TrustSection currentLang={currentLang} />
          <LeadForm currentLang={currentLang} />
        </div>
      );

    // -------------------------------------------------------------
    // 3. STUDY IN ROMANIA
    // -------------------------------------------------------------
    case 'study':
      return (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-14 space-y-4">
            <span className="text-[#FCD116] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'پذیرش تحصیلی ۲۰۲۶' : 'Higher Education 2026'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold">
              {currentLang === 'fa' ? 'تحصیل در دانشگاه‌های معتبر رومانی' : 'Study in Romania'}
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'تحصیل در قلب اروپا به زبان‌های انگلیسی، فرانسوی یا رومانیایی با شهریه بسیار مناسب، مدرک معتبر در کل اتحادیه اروپا و امکان کار دانشجویی.'
                : 'Accredited European university degrees in English & French with affordable tuition and student work permits.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h2 className="text-xl font-bold text-slate-900">
                  {currentLang === 'fa' ? 'چرا تحصیل در رومانی؟' : 'Why Study in Romania?'}
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">✓ <span>{currentLang === 'fa' ? 'پذیرش در رشته‌های پزشکی، دندانپزشکی و داروسازی به زبان انگلیسی' : 'Medicine & Dentistry in English without entrance exams'}</span></li>
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">✓ <span>{currentLang === 'fa' ? 'شهریه سالانه بسیار مناسب (۲,۰۰۰ تا ۸,۵۰۰ یورو)' : 'Affordable tuition (€2,000–€8,500/yr)'}</span></li>
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">✓ <span>{currentLang === 'fa' ? 'اجازه کار دانشجویی پاره‌وقت در حین تحصیل' : 'Part-time student work authorization'}</span></li>
                  <li className="flex items-center space-x-2 rtl:space-x-reverse">✓ <span>{currentLang === 'fa' ? 'مدرک رسمی اتحادیه اروپا مورد تایید وزارت علوم و بهداشت' : 'Fully EU accredited degree recognized globally'}</span></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">
                  {currentLang === 'fa' ? 'دانشگاه‌های پیشنهادی' : 'Featured Universities'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredUniversities.map((uni) => (
                    <UniversityCard key={uni.id} university={uni} currentLang={currentLang} onSelect={() => {}} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <LeadForm currentLang={currentLang} isModal={true} />
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 4. WORK IN ROMANIA
    // -------------------------------------------------------------
    case 'work':
      return (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-gradient-to-r from-slate-900 to-[#002B7F] text-white rounded-3xl p-8 sm:p-14 space-y-4">
            <span className="text-[#FCD116] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'اشتغال و مجوز کار' : 'Work Permits & Careers'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold">
              {currentLang === 'fa' ? 'کار و اشتغال در رومانی' : 'Work in Romania'}
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'راهنمای کامل بازار کار، حوزه‌های شغلی مورد نیاز (IT، مهندسی، ساخت‌وساز) و فرآیند قانونی دریافت مجوز اشتغال Aviz de Munca.'
                : 'Job market opportunities, in-demand sectors (IT, Engineering, Construction), and official Work Permit rules.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-2xl">💻</div>
              <h3 className="font-bold text-slate-900">{currentLang === 'fa' ? 'صنعت فناوری اطلاعات (IT)' : 'IT & Software'}</h3>
              <p className="text-xs text-slate-600">{currentLang === 'fa' ? 'تقاضای بسیار بالا برای توسعه‌دهندگان با حقوق یورو و زبان انگلیسی.' : 'High demand for developers with Euro salaries and English environment.'}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-2xl">⚙️</div>
              <h3 className="font-bold text-slate-900">{currentLang === 'fa' ? 'مهندسی و صنایع' : 'Engineering & Industry'}</h3>
              <p className="text-xs text-slate-600">{currentLang === 'fa' ? 'صنایع خودروسازی، برق و مکانیک در شهرهای کلوژ، تیمیشوارا و بخارست.' : 'Automotive & precision manufacturing in Cluj, Timisoara & Bucharest.'}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-2xl">🏗️</div>
              <h3 className="font-bold text-slate-900">{currentLang === 'fa' ? 'ساخت‌وساز و عمران' : 'Construction & Infrastructure'}</h3>
              <p className="text-xs text-slate-600">{currentLang === 'fa' ? 'کمبود شدید نیروی کار فنی و متخصص در پروژه‌های بزرگ عمران اروپایی.' : 'Significant labor demands across major EU infrastructure projects.'}</p>
            </div>
          </div>

          <LeadForm currentLang={currentLang} />
        </div>
      );

    // -------------------------------------------------------------
    // 5. COMPANY REGISTRATION
    // -------------------------------------------------------------
    case 'company':
      return (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-gradient-to-r from-slate-900 via-[#002B7F] to-slate-900 text-white rounded-3xl p-8 sm:p-14 space-y-4">
            <span className="text-[#FCD116] font-bold text-xs uppercase tracking-wider">
              {currentLang === 'fa' ? 'سرمایه‌گذاری و تجارت' : 'Business & SRL Formation'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold">
              {currentLang === 'fa' ? 'ثبت شرکت در رومانی (SRL)' : 'Company Registration in Romania'}
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'ثبت شرکت با مسئولیت محدود SRL در رومانی با کم‌ترین نرخ مالیات در اروپا (۱٪)، افتتاح حساب بانکی شرکتی و اخذ اقامت تجاری.'
                : 'Form your SRL company with Europe’s lowest micro-corporate tax option (1%) and executive residency.'}
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">{currentLang === 'fa' ? 'مزایای ثبت شرکت SRL در رومانی' : 'Benefits of SRL Incorporation'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
              <div className="bg-white p-4 rounded-xl border border-slate-200">✓ {currentLang === 'fa' ? 'مالیات ۱ درصدی بر درآمد برای شرکت‌های میکرو' : '1% micro-company income tax rate option'}</div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">✓ {currentLang === 'fa' ? 'سرمایه اولیه ناچیز (حدود ۱ یورو)' : 'Low minimum share capital (~1 EUR)'}</div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">✓ {currentLang === 'fa' ? 'دسترس آزاد به کل بازار ۵۰۰ میلیونی اتحادیه اروپا' : 'Direct access to the 500M EU consumer market'}</div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">✓ {currentLang === 'fa' ? 'احتمال دریافت اقامت تجاری برای مدیرعامل' : 'Business manager residence permit eligibility'}</div>
            </div>
          </div>

          <LeadForm currentLang={currentLang} />
        </div>
      );

    // -------------------------------------------------------------
    // 6. LIVING IN ROMANIA
    // -------------------------------------------------------------
    case 'living':
      return (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-8 sm:p-14 space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold">
              {currentLang === 'fa' ? 'زندگی و استقرار در رومانی' : 'Living in Romania'}
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-3xl">
              {currentLang === 'fa'
                ? 'هزینه‌های زندگی، اجاره مسکن، بیمه درمانی، سیستم آموزشی و امنیت اجتماعی در رومانی.'
                : 'Cost of living, apartment rentals, healthcare, schooling, and safety metrics across Romania.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900">🏠 {currentLang === 'fa' ? 'اجاره مسکن' : 'Housing & Rent'}</h3>
              <p className="text-xs text-slate-600">{currentLang === 'fa' ? 'آپارتمان یک‌خوابه بین ۳۰۰ تا ۶۰۰ یورو در ماه بسته به شهر.' : '1-bedroom apartment €300–€600/month depending on city.'}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900">🛒 {currentLang === 'fa' ? 'هزینه خوراک و زندگی' : 'Food & Living Costs'}</h3>
              <p className="text-xs text-slate-600">{currentLang === 'fa' ? 'حدود ۳۰۰ تا ۵۰۰ یورو در ماه برای یک فرد مجرد.' : 'Approx €300–€500/month per single individual.'}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900">🛡️ {currentLang === 'fa' ? 'امنیت اجتماعی' : 'Social Safety'}</h3>
              <p className="text-xs text-slate-600">{currentLang === 'fa' ? 'نرخ بسیار پایین جرم و جنایت و محیطی بسیار امن برای خانواده‌ها.' : 'Low crime rate and highly secure environment for families.'}</p>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 7. UNIVERSITIES LISTING
    // -------------------------------------------------------------
    case 'universities':
      const filteredUnis = featuredUniversities.filter((uni) => {
        const nameMatches = uni.name[currentLang].toLowerCase().includes(uniSearch.toLowerCase());
        const cityMatches = uni.city[currentLang].toLowerCase().includes(uniSearch.toLowerCase());
        return nameMatches || cityMatches;
      });

      return (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{t.nav.universities}</h1>
            <p className="text-slate-600 text-sm mt-1">
              {currentLang === 'fa' ? 'فهرست دانشگاه‌های معتبر رومانی با تاییدیه بین‌المللی' : 'Accredited Romanian Universities Directory'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <input
              type="text"
              value={uniSearch}
              onChange={(e) => setUniSearch(e.target.value)}
              placeholder={currentLang === 'fa' ? 'جستجوی نام دانشگاه یا شهر...' : 'Search university or city...'}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B7F]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnis.map((uni) => (
              <UniversityCard key={uni.id} university={uni} currentLang={currentLang} onSelect={() => onNavigate('study')} />
            ))}
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 8. CITIES LISTING
    // -------------------------------------------------------------
    case 'cities':
      const filteredCities = featuredCities.filter((c) =>
        c.name[currentLang].toLowerCase().includes(citySearch.toLowerCase()) ||
        c.romanianName.toLowerCase().includes(citySearch.toLowerCase())
      );

      return (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{t.nav.cities}</h1>
            <p className="text-slate-600 text-sm mt-1">
              {currentLang === 'fa' ? 'معرفی شهرهای مهم رومانی برای زندگی، تحصیل و کار' : 'Key Romanian Cities Overview'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder={currentLang === 'fa' ? 'جستجوی شهر...' : 'Search city...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B7F]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <CityCard key={city.id} city={city} currentLang={currentLang} onSelect={() => {}} />
            ))}
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 9. ABOUT ROMANIA
    // -------------------------------------------------------------
    case 'about-romania':
      return (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-gradient-to-r from-slate-900 to-[#002B7F] text-white rounded-3xl p-8 sm:p-14 space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold">
              {currentLang === 'fa' ? 'درباره کشور رومانی' : 'About Romania'}
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
              {currentLang === 'fa'
                ? 'کشوری با تاریخ کهن، طبیعت بی‌نظیر، عضو رسمی اتحادیه اروپا و حوزه شنگن و یکی از سریع‌ترین اقتصادهای روبه‌رشد اروپا.'
                : 'A vibrant EU & Schengen nation blending rich history, breathtaking nature, and rapid economic growth.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 leading-relaxed">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">🌍 {currentLang === 'fa' ? 'جغرافیا و طبیعت' : 'Geography & Nature'}</h3>
              <p>{currentLang === 'fa' ? 'واقع در جنوب شرق اروپا با کوه‌های سرسبز کارپات، دلتای رود دانوب و سواحل زیبای دریای سیاه.' : 'Located in Southeastern Europe featuring the Carpathian Alps and Black Sea coastline.'}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">💼 {currentLang === 'fa' ? 'اقتصاد و فناوری' : 'Economy & Tech'}</h3>
              <p>{currentLang === 'fa' ? 'یکی از بالاترین سرعت‌های اینترنت در جهان و قطب اصلی نرم‌افزار و صنایع خودروسازی اروپا.' : 'Ranked among top countries worldwide for internet speed and tech startup density.'}</p>
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 10. SERVICES
    // -------------------------------------------------------------
    case 'services':
      return (
        <div className="space-y-12 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{t.nav.services}</h1>
            <p className="text-slate-600 text-sm mt-1">
              {currentLang === 'fa' ? 'خدمات تخصصی مشاوره و همراهی پرونده‌های قانونی رومانی' : 'Professional Advisory & Administrative Support'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainServices.map((svc) => (
              <ServiceCard key={svc.id} service={svc} currentLang={currentLang} onSelect={onOpenEvaluationModal} />
            ))}
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 11. ARTICLES
    // -------------------------------------------------------------
    case 'articles':
      return (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{t.nav.articles}</h1>
            <p className="text-slate-600 text-sm mt-1">
              {currentLang === 'fa' ? 'مقالات، راهنماها و اخبار رسمی قوانین مهاجرتی رومانی' : 'Articles, Guides & Legal Updates'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleArticles.map((art) => (
              <div key={art.id} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs text-[#002B7F] bg-blue-50 px-2.5 py-1 rounded font-semibold">{art.category[currentLang]}</span>
                <h3 className="font-bold text-slate-900 text-base">{art.title[currentLang]}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{art.excerpt[currentLang]}</p>
              </div>
            ))}
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 12. ABOUT US
    // -------------------------------------------------------------
    case 'about':
      return (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-gradient-to-r from-slate-900 to-[#002B7F] text-white rounded-3xl p-8 sm:p-14 space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold">
              {currentLang === 'fa' ? 'درباره پلتفرم «در رومانی»' : 'About Dar Romania'}
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
              {t.brand.description}
            </p>
          </div>

          <TrustSection currentLang={currentLang} />
        </div>
      );

    // -------------------------------------------------------------
    // 13. CONTACT US
    // -------------------------------------------------------------
    case 'contact':
      return (
        <div className="space-y-12 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{t.nav.contact}</h1>
            <p className="text-slate-600 text-sm mt-1">
              {currentLang === 'fa' ? 'راه‌های ارتباطی با مشاوران ما در بخارست' : 'Contact Our Advisory Team in Bucharest'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900">📍 {currentLang === 'fa' ? 'دفتر رومانی:' : 'Bucharest Office:'}</div>
                <p className="text-xs text-slate-600">Bucharest, Romania</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900">✉️ {currentLang === 'fa' ? 'ایمیل رسمی:' : 'Email Address:'}</div>
                <p className="text-xs text-slate-600">info@darromania.com</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900">💬 {currentLang === 'fa' ? 'ارتباط مستقیم واتس‌اپ:' : 'WhatsApp Direct:'}</div>
                <p className="text-xs text-slate-600">+40 700 000 000</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <LeadForm currentLang={currentLang} />
            </div>
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // 14. LEGAL PAGES
    // -------------------------------------------------------------
    case 'legal/privacy':
    case 'legal/terms':
    case 'legal/disclaimer':
      return (
        <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto bg-white p-8 rounded-3xl border border-slate-200">
          <h1 className="text-3xl font-extrabold text-slate-900 border-b border-slate-200 pb-4">
            {activeRoute.includes('privacy') 
              ? (currentLang === 'fa' ? 'سیاست حریم خصوصی' : 'Privacy Policy')
              : (currentLang === 'fa' ? 'شرایط و قوانین استفاده' : 'Terms & Legal Conditions')}
          </h1>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>{t.disclaimer.text}</p>
            <p>
              {currentLang === 'fa'
                ? 'تمامی اطلاعات دریافت شده در فرم ارزیابی اولیه صرفاً جهت بررسی صلاحیت اولیه پرونده نگهداری شده و محرمانه تلقی می‌گردد.'
                : 'All information provided via evaluation forms is kept strictly confidential under EU GDPR regulations.'}
            </p>
          </div>
        </div>
      );
  }
};
