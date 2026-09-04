'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Language } from '../types';
import {
  Search,
  X,
  ChevronLeft,
  Landmark,
  GraduationCap,
  BriefcaseBusiness,
  Building2,
  House,
  Users,
  Home,
  Scale,
  MessageSquare,
  PhoneCall,
  CheckCircle,
  FileCheck2
} from './Icons';

type SearchCategoryKey = 'all' | 'guides' | 'universities' | 'immigration' | 'needs' | 'work-business' | 'romania';

interface SearchItem {
  id: string;
  categoryKey: SearchCategoryKey;
  title: Record<Language, string>;
  categoryLabel: Record<Language, string>;
  description?: Record<Language, string>;
  route: string;
  icon?: React.ReactNode;
  badge?: Record<Language, string>;
}

interface SearchDialogProps {
  currentLang: Language;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  currentLang,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategoryKey>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const categories: { key: SearchCategoryKey; label: Record<Language, string> }[] = [
    { key: 'all', label: { fa: 'همه', en: 'All' } },
    { key: 'guides', label: { fa: 'راهنماها و چک‌لیست', en: 'Guides' } },
    { key: 'universities', label: { fa: 'دانشگاه‌ها و تحصیل', en: 'Universities' } },
    { key: 'immigration', label: { fa: 'مهاجرت و اقامت', en: 'Immigration' } },
    { key: 'needs', label: { fa: 'نیازهای زندگی', en: 'Living Essentials' } },
    { key: 'work-business', label: { fa: 'کار و کسب‌وکار', en: 'Work & Business' } },
    { key: 'romania', label: { fa: 'شهرهای رومانی', en: 'Cities & Country' } },
  ];

  const searchIndex: SearchItem[] = [
    // 1. GUIDES & START HERE
    {
      id: 'assessment',
      categoryKey: 'guides',
      title: { fa: 'ارزیابی هوشمند و تعیین مسیر (PathFinder)', en: 'DORVIA PathFinder — Smart Case Assessment' },
      categoryLabel: { fa: 'ابزار هوشمند', en: 'Smart Tool' },
      description: { fa: 'ارزیابی رایگان شرایط شما بر اساس هدف، مدرک تحصیلی و سوابق', en: 'Free profile scoring and custom pathway recommendation' },
      route: 'assessment',
      icon: <FileCheck2 size={18} className="text-[#2F6FED]" />,
      badge: { fa: 'پیشنهادی', en: 'Recommended' }
    },
    {
      id: 'start-here',
      categoryKey: 'guides',
      title: { fa: 'شروع از اینجا — نقشه راه جامع و گام به گام', en: 'Start Here — Step-by-Step Relocation Roadmap' },
      categoryLabel: { fa: 'نقشه راه', en: 'Roadmap' },
      description: { fa: 'راهنمای مرحله‌به‌مرحله از قبل از سفر تا استقرار کامل در رومانی', en: 'End-to-end guidance from pre-departure to permanent settlement' },
      route: 'start-here',
      icon: <Home size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'planning-to-come',
      categoryKey: 'guides',
      title: { fa: 'چک‌لیست قبل از سفر به رومانی', en: 'Pre-departure Checklist for Romania' },
      categoryLabel: { fa: 'چک‌لیست', en: 'Checklist' },
      description: { fa: 'آماده‌سازی اسناد، تاییدات سفارت، امور مالی و بستن چمدان', en: 'Document legalization, embassy steps, and essential preparations' },
      route: 'start-here/planning-to-come',
      icon: <Home size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'newly-arrived',
      categoryKey: 'guides',
      title: { fa: 'سه روز اول ورود به رومانی — راهنمای تازه واردین', en: 'First 3 Days in Romania — Newly Arrived Guide' },
      categoryLabel: { fa: 'چک‌لیست', en: 'Checklist' },
      description: { fa: 'سیم‌کارت، اسکان اولیه، ثبت حضور و اقدامات اورژانسی', en: 'SIM card, initial shelter, arrival declaration, and early setup' },
      route: 'start-here/newly-arrived',
      icon: <Home size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'settling-in',
      categoryKey: 'guides',
      title: { fa: 'ماه اول در رومانی — تثبیت و کارهای اداری', en: 'First Month in Romania — Settling In' },
      categoryLabel: { fa: 'چک‌لیست', en: 'Checklist' },
      description: { fa: 'افتتاح حساب بانکی، قرارداد اجاره مسکن و پرونده IGI', en: 'Bank account opening, lease contracts, and IGI permit filing' },
      route: 'start-here/settling-in',
      icon: <Home size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'first-days-checklist',
      categoryKey: 'guides',
      title: { fa: 'چک‌لیست تعاملی روزهای نخست ورود (۹ سناریو)', en: 'Interactive First-Days Arrival Checklist (9 Scenarios)' },
      categoryLabel: { fa: 'راهنمای عملیاتی', en: 'Operational Guide' },
      description: { fa: 'چک‌لیست سفارشی بر اساس سناریوی دانشجویی، کاری، شرکتی یا خانوادگی', en: 'Personalized checklists for students, employees, founders, and families' },
      route: 'needs/first-days-checklist',
      icon: <CheckCircle size={18} className="text-[#2F6FED]" />
    },

    // 2. UNIVERSITIES & STUDY
    {
      id: 'universities-hub',
      categoryKey: 'universities',
      title: { fa: 'فهرست دانشگاه‌های معتبر و شهریه‌ها', en: 'Universities in Romania & Tuition Directory' },
      categoryLabel: { fa: 'تحصیل در رومانی', en: 'Study' },
      description: { fa: 'رشته‌های پزشکی، دندانپزشکی، مهندسی، IT و مدیریت', en: 'Medicine, Dentistry, Engineering, Computer Science & Business degrees' },
      route: 'universities',
      icon: <GraduationCap size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'umf-carol-davila',
      categoryKey: 'universities',
      title: { fa: 'دانشگاه علوم پزشکی و داروسازی کارول داویلا بخارست', en: 'Carol Davila University of Medicine & Pharmacy (Bucharest)' },
      categoryLabel: { fa: 'دانشگاه تخصصی', en: 'University' },
      description: { fa: 'پزشکی و دندانپزشکی انگلیسی، تاییدیه وزارت بهداشت ایران', en: 'English-taught Medicine & Dentistry, Iran MOH accredited' },
      route: 'universities/umf-carol-davila',
      icon: <GraduationCap size={18} className="text-[#2F6FED]" />,
      badge: { fa: 'تاییدیه بهداشت', en: 'MOH Approved' }
    },
    {
      id: 'umf-victor-babes',
      categoryKey: 'universities',
      title: { fa: 'دانشگاه پزشکی و داروسازی ویکتور بابش تیمیشوارا', en: 'Victor Babeș University of Medicine & Pharmacy (Timișoara)' },
      categoryLabel: { fa: 'دانشگاه تخصصی', en: 'University' },
      description: { fa: 'دانشکده‌های پزشکی و داروسازی معتبر بین‌المللی', en: 'Top-tier international medical education in western Romania' },
      route: 'universities/umf-victor-babes',
      icon: <GraduationCap size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'study-requirements',
      categoryKey: 'universities',
      title: { fa: 'مدارک و الزامات پذیرش دانشگاه‌های رومانی', en: 'University Admission Requirements & Legalization' },
      categoryLabel: { fa: 'تحصیل در رومانی', en: 'Study' },
      description: { fa: 'مراحل تایید مدارک تحصیلی در وزارت آموزش رومانی (CNRED)', en: 'Document validation via the Romanian Ministry of Education (CNRED)' },
      route: 'study/requirements',
      icon: <GraduationCap size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'study-visa',
      categoryKey: 'universities',
      title: { fa: 'ویزای تحصیلی بلندمدت رومانی (نوع D/SD)', en: 'Type D/SD Student Visa for Romania' },
      categoryLabel: { fa: 'تحصیل در رومانی', en: 'Study' },
      description: { fa: 'مدارک سفارت، تمکن مالی، بیمه و وقت مصاحبه', en: 'Embassy checklist, proof of funds, insurance, and interview' },
      route: 'study/visa-type-d',
      icon: <GraduationCap size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'scholarships',
      categoryKey: 'universities',
      title: { fa: 'بورسیه تحصیلی دولتی وزارت امور خارجه رومانی (MAE)', en: 'Romanian Government Scholarships (MFA / MAE)' },
      categoryLabel: { fa: 'تحصیل در رومانی', en: 'Study' },
      description: { fa: 'معافیت شهریه، خوابگاه رایگان و کمک‌هزینه ماهانه', en: 'Full tuition waiver, free housing, and monthly stipend details' },
      route: 'study/scholarships',
      icon: <GraduationCap size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'preparatory-year',
      categoryKey: 'universities',
      title: { fa: 'سال آمادگی زبان رومانیایی (An Pregătitor)', en: 'Romanian Language Preparatory Year' },
      categoryLabel: { fa: 'تحصیل در رومانی', en: 'Study' },
      description: { fa: 'دوره یک‌ساله زبان رومانیایی برای ورود به رشته‌های غیرانگلیسی', en: '1-year intensive language foundation course for academic entry' },
      route: 'study/preparatory-year',
      icon: <GraduationCap size={18} className="text-[#2F6FED]" />
    },

    // 3. IMMIGRATION & RESIDENCE
    {
      id: 'immigration-hub',
      categoryKey: 'immigration',
      title: { fa: 'مرکز مهاجرت و اقامت در رومانی', en: 'Immigration & Residence Hub' },
      categoryLabel: { fa: 'مهاجرت و اقامت', en: 'Immigration' },
      description: { fa: 'انواع اقامت موقت، دائم، پیوست خانواده و قوانین شنگن', en: 'Temporary, permanent residence, family permits & Schengen rules' },
      route: 'immigration',
      icon: <Users size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'igi-process',
      categoryKey: 'immigration',
      title: { fa: 'مراحل اداره کل مهاجرت رومانی (IGI) و کارت اقامت', en: 'General Inspectorate for Immigration (IGI) Process' },
      categoryLabel: { fa: 'مهاجرت و اقامت', en: 'Immigration' },
      description: { fa: 'نوبت‌گیری پورتال IGI، انگشت‌نگاری و دریافت Permis de Ședere', en: 'IGI portal bookings, biometrics, and residence permit card issuance' },
      route: 'immigration/igi-process',
      icon: <Users size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'family-reunification',
      categoryKey: 'immigration',
      title: { fa: 'پیوست خانواده — اقامت قانونی همسر و فرزندان', en: 'Family Reunification in Romania' },
      categoryLabel: { fa: 'مهاجرت و اقامت', en: 'Immigration' },
      description: { fa: 'شرایط الحاق خانواده به دارندگان اقامت کاری، شرکتی و تحصیلی', en: 'Bringing spouses and children to join valid residence holders' },
      route: 'immigration/family-reunification',
      icon: <Users size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'residence-renewal',
      categoryKey: 'immigration',
      title: { fa: 'تمدید کارت اقامت در رومانی', en: 'Residence Permit Renewal in Romania' },
      categoryLabel: { fa: 'مهاجرت و اقامت', en: 'Immigration' },
      description: { fa: 'مهلت قانونی ۳۰ روزه قبل از انقضا و مدارک تمدید IGI', en: '30-day legal deadline before expiry and required renewal documents' },
      route: 'immigration/residence-renewal',
      icon: <Users size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'citizenship',
      categoryKey: 'immigration',
      title: { fa: 'تابعیت و پاسپورت رومانی — شرایط و آزمون', en: 'Romanian Citizenship & Passport Guide' },
      categoryLabel: { fa: 'مهاجرت و اقامت', en: 'Immigration' },
      description: { fa: 'شرایط ۸ سال اقامت، آزمون زبان، قانون اساسی و سوگند', en: '8-year residency requirement, language exam, constitution & oath' },
      route: 'immigration/citizenship',
      icon: <Users size={18} className="text-[#2F6FED]" />
    },

    // 4. LIVING ESSENTIALS (NEEDS)
    {
      id: 'needs-hub',
      categoryKey: 'needs',
      title: { fa: 'نیازهای زندگی و استقرار در رومانی', en: 'Living Essentials & Expat Life Hub' },
      categoryLabel: { fa: 'نیازهای زندگی', en: 'Essentials' },
      description: { fa: 'بانک، بیمه، مسکن، گواهینامه، دارالترجمه و زبان', en: 'Banking, healthcare, housing, driving license, translations & language' },
      route: 'needs',
      icon: <Landmark size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'driving-license',
      categoryKey: 'needs',
      title: { fa: 'گواهینامه رانندگی در رومانی: تبدیل، صدور و قوانین OMAI', en: 'Driving License in Romania: Exchange & New Issuance' },
      categoryLabel: { fa: 'نیازهای زندگی', en: 'Essentials' },
      description: { fa: 'قوانین رانندگی با گواهینامه خارجی، گواهینامه بین‌المللی و تبدیل', en: 'Foreign license rules, International Driving Permits (IDP), and tests' },
      route: 'needs/driving-license',
      icon: <House size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'banking',
      categoryKey: 'needs',
      title: { fa: 'افتتاح حساب بانکی برای اتباع خارجی در رومانی', en: 'Opening a Bank Account for Foreign Residents' },
      categoryLabel: { fa: 'نیازهای زندگی', en: 'Essentials' },
      description: { fa: 'مقایسه BCR, BRD, BT, ING و نکات افتتاح حساب برای ایرانیان', en: 'Bank comparison, required CNP docs, and compliance tips' },
      route: 'needs/banking',
      icon: <Landmark size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'currency-exchange',
      categoryKey: 'needs',
      title: { fa: 'صرافی، تبدیل پول و نرخ زنده BNR', en: 'Currency Exchange & Live BNR Rates' },
      categoryLabel: { fa: 'نیازهای زندگی', en: 'Essentials' },
      description: { fa: 'فید زنده نرخ لئو (RON)، یورو، دلار و صرافی‌های مجاز', en: 'Live Romanian Leu (RON) rates, licensed kiosks & card payments' },
      route: 'needs/currency-exchange',
      icon: <Landmark size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'certified-translation',
      categoryKey: 'needs',
      title: { fa: 'دارالترجمه رسمی و مترجمین مجاز وزارت دادگستری', en: 'Certified Legal Translations in Romania' },
      categoryLabel: { fa: 'نیازهای زندگی', en: 'Essentials' },
      description: { fa: 'ترجمه رسمی رومانیایی به فارسی و انگلیسی با تایید نوتاری', en: 'Ministry of Justice authorized translators, notary legalization' },
      route: 'needs/certified-translation',
      icon: <Landmark size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'romanian-language',
      categoryKey: 'needs',
      title: { fa: 'آموزش زبان رومانیایی — دوره‌های رایگان IOM و موسسات', en: 'Romanian Language Courses & Free Integration Programs' },
      categoryLabel: { fa: 'نیازهای زندگی', en: 'Essentials' },
      description: { fa: 'کلاس‌های رایگان سازمان بین‌المللی مهاجرت، شوتنر و دوره‌های خصوصی', en: 'IOM free courses, Schottener Foundation, and private academies' },
      route: 'needs/romanian-language-courses',
      icon: <Landmark size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'notary-public',
      categoryKey: 'needs',
      title: { fa: 'دفتر اسناد رسمی (Notar Public) و الزام حضور مترجم', en: 'Notary Public Services & Sworn Translator Legal Rules' },
      categoryLabel: { fa: 'نیازهای زندگی', en: 'Essentials' },
      description: { fa: 'تنظیم وکالت‌نامه، قرارداد اجاره، اساسنامه و حضور مترجم قسم‌خورده', en: 'Powers of attorney, lease authentication, bylaws & translator requirements' },
      route: 'needs/notary-public',
      icon: <Landmark size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'housing',
      categoryKey: 'needs',
      title: { fa: 'راهنمای اجاره و خرید مسکن در شهرهای رومانی', en: 'Housing & Property Rental Guide in Romania' },
      categoryLabel: { fa: 'نیازهای زندگی', en: 'Essentials' },
      description: { fa: 'پلتفرم‌های معتبر (Imobiliare, Storia)، ثبت قرارداد در ANAF و ودیعه', en: 'Trusted portals, ANAF contract registration, deposits & tenant rights' },
      route: 'needs/housing',
      icon: <House size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'iranian-embassy',
      categoryKey: 'needs',
      title: { fa: 'سفارت ایران در بخارست و خدمات سامانه میخک', en: 'Iranian Embassy in Bucharest & Mikhak Portal' },
      categoryLabel: { fa: 'نیازهای زندگی', en: 'Essentials' },
      description: { fa: 'تایید وکالت‌نامه‌ها، تمدید گذرنامه، شناسنامه و امور دانشجویی', en: 'Consular authorizations, passport renewal, birth registry & Mikhak' },
      route: 'needs/iranian-embassy-and-mikhak',
      icon: <Landmark size={18} className="text-[#2F6FED]" />
    },

    // 5. WORK & BUSINESS
    {
      id: 'work-hub',
      categoryKey: 'work-business',
      title: { fa: 'کار و اشتغال در رومانی', en: 'Work & Employment in Romania' },
      categoryLabel: { fa: 'کار', en: 'Work' },
      description: { fa: 'ویزای کار، مجوز اشتغال، قرارداد و حقوق و دستمزد', en: 'Work permits, long-stay work visas, contracts and taxation' },
      route: 'work',
      icon: <BriefcaseBusiness size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'work-permit',
      categoryKey: 'work-business',
      title: { fa: 'مجوز کار در رومانی (Aviz de Muncă)', en: 'Work Authorization (Aviz de Muncă) in Romania' },
      categoryLabel: { fa: 'کار', en: 'Work' },
      description: { fa: 'مراحل دریافت مجوز کار توسط کارفرما از اداره کل مهاجرت', en: 'Employer quotas, IGI approval steps, and employee documentation' },
      route: 'work/work-permit',
      icon: <BriefcaseBusiness size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'digital-nomad',
      categoryKey: 'work-business',
      title: { fa: 'ویزای دیجیتال نومد رومانی (دورکاری بین‌المللی)', en: 'Romania Digital Nomad Visa' },
      categoryLabel: { fa: 'کار', en: 'Work' },
      description: { fa: 'اقامت برای فریلنسرها و دورکاران شرکت‌های خارج از رومانی', en: 'Residency for remote employees and international freelancers' },
      route: 'work/digital-nomad',
      icon: <BriefcaseBusiness size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'company-hub',
      categoryKey: 'work-business',
      title: { fa: 'ثبت شرکت (SRL) و کارآفرینی در رومانی', en: 'Company Formation (SRL) & Business Hub' },
      categoryLabel: { fa: 'کسب‌وکار', en: 'Business' },
      description: { fa: 'مراحل ثبت در اداره ثبت شرکت‌ها (ONRC) و نرخ مالیاتی ۱٪ تا ۱۶٪', en: 'ONRC incorporation, 1% micro-company tax regime, and director permits' },
      route: 'company',
      icon: <Building2 size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'investment',
      categoryKey: 'work-business',
      title: { fa: 'فرصت‌های سرمایه‌گذاری و استارت‌آپی در رومانی', en: 'Investment & Startup Opportunities in Romania' },
      categoryLabel: { fa: 'کسب‌وکار', en: 'Business' },
      description: { fa: 'سرمایه‌گذاری در املاک تجاری، زیرساخت‌های IT و انرژی', en: 'Real estate, IT tech hubs, and European business incentives' },
      route: 'company/investment',
      icon: <Building2 size={18} className="text-[#2F6FED]" />
    },

    // 6. ROMANIA & CITIES
    {
      id: 'cities-hub',
      categoryKey: 'romania',
      title: { fa: 'شهرهای مهم رومانی؛ مقایسه زندگی، کار و دانشگاه', en: 'Key Romanian Cities Comparison' },
      categoryLabel: { fa: 'شناخت رومانی', en: 'Discover Romania' },
      description: { fa: 'بررسی جامع بخارست، کلوژ، تیمیشوارا، یاش، براشوف، کنستانتسا و سیبیو', en: 'In-depth review of Bucharest, Cluj, Timișoara, Iași, Brașov & Sibiu' },
      route: 'romania/cities',
      icon: <Building2 size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'city-bucharest',
      categoryKey: 'romania',
      title: { fa: 'بخارست — پایتخت اقتصادی و دانشگاهی رومانی', en: 'Bucharest — Economic & Academic Capital' },
      categoryLabel: { fa: 'شناخت شهر', en: 'City Guide' },
      description: { fa: 'هزینه‌ها، برترین دانشگاه‌ها، حمل‌ونقل و بازار کار در بخارست', en: 'Living costs, public transport, top medical/tech universities & jobs' },
      route: 'romania/cities/bucharest',
      icon: <Building2 size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'city-cluj',
      categoryKey: 'romania',
      title: { fa: 'کلوژ-ناپوکا — قطب فناوری و شهر دانشجویی ترانسیلوانیا', en: 'Cluj-Napoca — Tech Hub & Student City' },
      categoryLabel: { fa: 'شناخت شهر', en: 'City Guide' },
      description: { fa: 'پایتخت IT رومانی، دانشگاه بابهش بویای و فضای بین‌المللی', en: 'Silicon Valley of Eastern Europe, UBB university, vibrant culture' },
      route: 'romania/cities/cluj-napoca',
      icon: <Building2 size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'city-timisoara',
      categoryKey: 'romania',
      title: { fa: 'تیمیشوارا — شهر فرهنگی و دانشگاهی غرب رومانی', en: 'Timișoara — European Capital of Culture' },
      categoryLabel: { fa: 'شناخت شهر', en: 'City Guide' },
      description: { fa: 'دانشگاه‌های پزشکی و فنی، صنایع خودروسازی و نزدیکی به مرز اروپا', en: 'Medical & polytechnic hubs, automotive industries, near EU borders' },
      route: 'romania/cities/timisoara',
      icon: <Building2 size={18} className="text-[#2F6FED]" />
    },
    {
      id: 'romania-economy',
      categoryKey: 'romania',
      title: { fa: 'اقتصاد رومانی، صنایع، تورم و نرخ دستمزدها', en: 'Economy of Romania, Wages & Key Industries' },
      categoryLabel: { fa: 'شناخت رومانی', en: 'Discover Romania' },
      description: { fa: 'رشد اقتصادی، فناوری اطلاعات، صنایع خودروسازی و درآمدها', en: 'GDP growth, tech ecosystem, automotive exports, and net average salaries' },
      route: 'romania/economy',
      icon: <Building2 size={18} className="text-[#2F6FED]" />
    }
  ];

  const normalize = (str: string) =>
    str.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, ' ').trim();

  const filteredResults = useMemo(() => {
    return searchIndex.filter((item) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && item.categoryKey !== selectedCategory) {
        return false;
      }

      // 2. Query Filter
      if (!query.trim()) return true;
      const q = normalize(query);
      const titleFa = normalize(item.title.fa);
      const titleEn = normalize(item.title.en);
      const descFa = normalize(item.description?.fa || '');
      const descEn = normalize(item.description?.en || '');
      const catFa = normalize(item.categoryLabel.fa);
      const catEn = normalize(item.categoryLabel.en);

      return (
        titleFa.includes(q) ||
        titleEn.includes(q) ||
        descFa.includes(q) ||
        descEn.includes(q) ||
        catFa.includes(q) ||
        catEn.includes(q)
      );
    });
  }, [query, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<SearchCategoryKey, number> = {
      all: 0,
      guides: 0,
      universities: 0,
      immigration: 0,
      needs: 0,
      'work-business': 0,
      romania: 0
    };

    searchIndex.forEach((item) => {
      const q = normalize(query);
      if (q) {
        const titleFa = normalize(item.title.fa);
        const titleEn = normalize(item.title.en);
        const descFa = normalize(item.description?.fa || '');
        const descEn = normalize(item.description?.en || '');
        const matches =
          titleFa.includes(q) ||
          titleEn.includes(q) ||
          descFa.includes(q) ||
          descEn.includes(q);
        if (!matches) return;
      }
      counts.all++;
      counts[item.categoryKey]++;
    });

    return counts;
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-[#071B3D]/80 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 lg:p-16 animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#dfe6ef] flex flex-col max-h-[85vh]">
        
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-[#dfe6ef] flex items-center space-x-3 rtl:space-x-reverse bg-slate-50/70">
          <Search size={22} className="text-[#2F6FED] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              currentLang === 'fa'
                ? 'جستجوی راهنماها، دانشگاه‌ها، ویزا، بانک، زبان و شهرها...'
                : 'Search guides, universities, visas, banking, language & cities...'
            }
            className="w-full bg-transparent border-none text-sm sm:text-base font-semibold text-[#142033] focus:outline-none placeholder-[#788697]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/80 text-[#142033] hover:bg-slate-300 transition-colors shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            const count = categoryCounts[cat.key];
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#2F6FED] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.label[currentLang]}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-2.5 flex-1 bg-slate-50/40">
          {filteredResults.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-xl">
                🔍
              </div>
              <p className="text-sm font-semibold">
                {currentLang === 'fa'
                  ? 'نتیجه‌ای برای عبارت جستجویافته پیدا نشد.'
                  : 'No results found for your query.'}
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-[#2F6FED] font-bold hover:underline cursor-pointer"
              >
                {currentLang === 'fa' ? 'پاک‌کردن فیلترها و نمایش همه موارد' : 'Clear search and show all items'}
              </button>
            </div>
          ) : (
            filteredResults.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.route);
                  onClose();
                }}
                className="w-full text-start p-3.5 sm:p-4 rounded-2xl bg-white border border-[#dfe6ef] hover:border-[#2F6FED] hover:bg-blue-50/40 transition-all flex items-center justify-between group cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-start space-x-3.5 rtl:space-x-reverse min-w-0 pr-2">
                  <div className="p-2.5 rounded-xl bg-[#2F6FED]/10 shrink-0 mt-0.5 group-hover:bg-[#2F6FED]/20 transition-colors">
                    {item.icon}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-xs sm:text-sm text-[#142033] group-hover:text-[#2F6FED] transition-colors truncate">
                        {item.title[currentLang]}
                      </h4>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          {item.badge[currentLang]}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-[11px] sm:text-xs text-[#526174] line-clamp-1 leading-relaxed">
                        {item.description[currentLang]}
                      </p>
                    )}
                    <span className="inline-block text-[10px] text-[#788697] font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.categoryLabel[currentLang]}
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl text-slate-400 group-hover:text-[#2F6FED] group-hover:bg-blue-100/50 transition-colors shrink-0">
                  <ChevronLeft size={16} className="rtl:rotate-0 rotate-180" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-white border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between px-6">
          <span>
            {currentLang === 'fa'
              ? `${filteredResults.length} نتیجه یافت شد`
              : `${filteredResults.length} items found`}
          </span>
          <span className="hidden sm:inline text-slate-400">
            {currentLang === 'fa' ? 'برای بستن پنجره کلید ESC را فشار دهید' : 'Press ESC to close'}
          </span>
        </div>

      </div>
    </div>
  );
};
