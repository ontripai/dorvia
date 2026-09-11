'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  Users,
  LockKeyhole,
  LogOut,
  Settings,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Clock,
  BriefcaseBusiness,
  BookOpen,
  Handshake,
} from '@/components/Icons';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
  Cell,
} from 'recharts';

// SVG Icons tailored for the dashboard
function DownloadIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CalendarIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function TrendingUpIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function RefreshIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function BarChartIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function DollarIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function TargetIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

interface ReportsPageProps {
  params: { lang: Language };
}

interface AdminProfile {
  adminUserId: string;
  email: string;
  fullName: string | null;
  roleKey: string;
  roleLabelFa: string;
  roleLabelEn: string;
  permissions: string[];
}

interface TabItem {
  id: string;
  labelFa: string;
  labelEn: string;
}

export default function AdminReportsPage({ params }: ReportsPageProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();

  // Client hydration check for Recharts
  const [mounted, setMounted] = useState(false);

  // Admin Profile & Allowed Tabs
  const [adminUser, setAdminUser] = useState<AdminProfile | null>(null);
  const [availableTabs, setAvailableTabs] = useState<TabItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Date Range State
  const [preset, setPreset] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [fromDate, setFromDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return d.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Tab Data States
  const [loadingData, setLoadingData] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [overviewData, setOverviewData] = useState<any>(null);
  const [myCasesData, setMyCasesData] = useState<any>(null);
  const [financeData, setFinanceData] = useState<any>(null);
  const [marketingData, setMarketingData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Fetch Admin Profile and Context on mount
  useEffect(() => {
    let isMounted = true;

    async function initContext() {
      try {
        setLoadingAuth(true);
        const res = await fetch('/api/admin/reports/context');
        if (res.status === 401 || res.status === 403) {
          router.replace(`/${currentLang}/admin/login?error=unauthorized`);
          return;
        }

        const data = await res.json();
        if (isMounted && data.admin) {
          setAdminUser(data.admin);
          setAvailableTabs(data.availableTabs || []);

          // Set sensible default tab
          const tabs: TabItem[] = data.availableTabs || [];
          if (tabs.length > 0) {
            // Default to overview if available, otherwise first tab
            const hasOverview = tabs.some((t) => t.id === 'overview');
            setActiveTab(hasOverview ? 'overview' : tabs[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to initialize reports context:', err);
        if (isMounted) {
          setErrorMsg(isFa ? 'خطا در بارگذاری اطلاعات احراز هویت.' : 'Auth initialization failed.');
        }
      } finally {
        if (isMounted) setLoadingAuth(false);
      }
    }

    initContext();

    return () => {
      isMounted = false;
    };
  }, [currentLang, router, isFa]);

  // Apply quick presets
  const handlePresetSelect = (p: '7d' | '30d' | '90d') => {
    setPreset(p);
    const today = new Date();
    const to = today.toISOString().split('T')[0];
    const days = p === '7d' ? 6 : p === '30d' ? 29 : 89;
    const from = new Date(today.getTime() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    setFromDate(from);
    setToDate(to);
  };

  // 2. Fetch data for current active tab whenever tab or date range changes
  const fetchTabData = async () => {
    if (!activeTab) return;
    setLoadingData(true);
    setErrorMsg(null);

    try {
      const url = `/api/admin/reports/${activeTab}?from=${fromDate}&to=${toDate}`;
      const res = await fetch(url);

      if (res.status === 403) {
        setErrorMsg(
          isFa
            ? 'شما به داده‌های این بخش دسترسی مجاز ندارید (خطای ۴۰۳).'
            : 'Forbidden. You lack permissions for this report section (403).'
        );
        setLoadingData(false);
        return;
      }

      if (res.status === 401) {
        router.replace(`/${currentLang}/admin/login`);
        return;
      }

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || (isFa ? 'خطا در دریافت داده‌ها.' : 'Error fetching report data.'));
        setLoadingData(false);
        return;
      }

      if (activeTab === 'overview') setOverviewData(json);
      else if (activeTab === 'my-cases') setMyCasesData(json);
      else if (activeTab === 'finance') setFinanceData(json);
      else if (activeTab === 'marketing') setMarketingData(json);
    } catch (err: any) {
      console.error('Failed to fetch tab data:', err);
      setErrorMsg(isFa ? 'خطای شبکه در دریافت اطلاعات گزارش.' : 'Network error loading report.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!loadingAuth && activeTab) {
      fetchTabData();
    }
  }, [activeTab, fromDate, toDate, loadingAuth]);

  // 3. Handle CSV Export
  const handleExportCsv = async () => {
    if (!activeTab) return;
    setExportingCsv(true);

    try {
      const url = `/api/admin/reports/${activeTab}?format=csv&from=${fromDate}&to=${toDate}`;
      const res = await fetch(url);

      if (!res.ok) {
        alert(isFa ? 'خطا در تولید خروجی اکسل/CSV.' : 'Failed to generate CSV export.');
        return;
      }

      const blob = await res.blob();
      const disposition = res.headers.get('content-disposition');
      let filename = `${activeTab}-report-${fromDate}-to-${toDate}.csv`;

      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('CSV export failed:', err);
      alert(isFa ? 'خطای شبکه در دانلود خروجی.' : 'Network error exporting file.');
    } finally {
      setExportingCsv(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace(`/${currentLang}/admin/login`);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#f7f9fc]">
        <div className="w-10 h-10 border-4 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs sm:text-sm text-[#526174] font-medium">
          {isFa ? 'در حال بارگذاری مرکز گزارش‌ها و داشبورد مدیریتی...' : 'Loading analytics & reports center...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] py-8 sm:py-10" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">

        {/* Top Header Bar */}
        <div className="bg-[#071B3D] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#0b2b55]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#2F6FED]/30 text-[#8ec5ff] border border-[#2F6FED]/40 rounded-full text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse">
                <BarChartIcon size={13} />
                <span>{isFa ? 'داشبورد گزارش‌گیری و هوش کسب‌وکار' : 'Business Intelligence & Reports'}</span>
              </span>
              <span className="text-xs text-slate-300">
                {adminUser?.fullName ? `${adminUser.fullName} (${adminUser.roleLabelFa})` : adminUser?.email}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isFa ? 'مرکز تحلیل داده‌ها و گزارش‌های عملکردی' : 'Performance Analytics & Reports'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isFa
                ? 'مشاهده وضعیت پرونده‌ها، روند جذب متقاضیان، پیگیری مطالبات مالی و ارزیابی بهره‌وری به تفکیک بازه زمانی.'
                : 'Monitor case stages, applicant trends, invoice collections, and operational velocity across customized time horizons.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/leads"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <BriefcaseBusiness size={15} />
              <span>{isFa ? 'پرونده‌ها' : 'Leads'}</span>
            </Link>

            {(adminUser?.roleKey === 'owner' || adminUser?.roleKey === 'manager' || adminUser?.permissions?.includes('team.manage')) && (
              <Link
                href="/admin/team"
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                <Users size={15} />
                <span>{isFa ? 'تیم' : 'Team'}</span>
              </Link>
            )}

            {(adminUser?.roleKey === 'owner' || adminUser?.roleKey === 'manager' || adminUser?.roleKey === 'marketing' || adminUser?.permissions?.includes('blog.edit')) && (
              <Link
                href="/admin/blog"
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                <BookOpen size={15} />
                <span>{isFa ? 'مدیریت بلاگ' : 'Blog'}</span>
              </Link>
            )}

            {(adminUser?.roleKey === 'owner' || adminUser?.roleKey === 'manager' || adminUser?.roleKey === 'marketing' || adminUser?.permissions?.includes('jobs.edit')) && (
              <Link
                href="/admin/jobs"
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                <BriefcaseBusiness size={15} />
                <span>{isFa ? 'فرصت‌های شغلی' : 'Jobs'}</span>
              </Link>
            )}

            {(adminUser?.roleKey === 'owner' || adminUser?.roleKey === 'manager' || adminUser?.roleKey === 'finance') && (
              <Link
                href="/admin/referral-partners"
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                <Handshake size={15} />
                <span>{isFa ? 'همکاران معرف' : 'Referral Partners'}</span>
              </Link>
            )}

            <Link
              href="/admin/settings"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <Settings size={15} />
              <span>{isFa ? 'تنظیمات من' : 'My Settings'}</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
            >
              <LogOut size={15} />
              <span>{isFa ? 'خروج' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Global Date Range & Toolbar Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#dfe6ef] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Quick Presets & Custom Pickers */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1 rtl:space-x-reverse bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => handlePresetSelect('7d')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  preset === '7d'
                    ? 'bg-white text-[#2F6FED] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isFa ? '۷ روز اخیر' : 'Last 7 Days'}
              </button>
              <button
                onClick={() => handlePresetSelect('30d')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  preset === '30d'
                    ? 'bg-white text-[#2F6FED] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isFa ? '۳۰ روز اخیر' : 'Last 30 Days'}
              </button>
              <button
                onClick={() => handlePresetSelect('90d')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  preset === '90d'
                    ? 'bg-white text-[#2F6FED] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isFa ? '۹۰ روز اخیر' : 'Last 90 Days'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <span className="font-semibold text-slate-500">{isFa ? 'از:' : 'From:'}</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setPreset('custom');
                  }}
                  className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <span className="font-semibold text-slate-500">{isFa ? 'تا:' : 'To:'}</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setPreset('custom');
                  }}
                  className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={fetchTabData}
              disabled={loadingData}
              title={isFa ? 'بروزرسانی داده‌ها' : 'Refresh'}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
            >
              <RefreshIcon size={16} className={loadingData ? 'animate-spin text-[#2F6FED]' : ''} />
            </button>
          </div>

          {/* CSV Export Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              disabled={exportingCsv || loadingData}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <DownloadIcon size={15} />
              <span>
                {exportingCsv
                  ? (isFa ? 'در حال خروجی گرفتن...' : 'Exporting CSV...')
                  : (isFa ? 'دریافت خروجی CSV (اکسل)' : 'Export CSV (Excel)')}
              </span>
            </button>
          </div>
        </div>

        {/* Role-gated Tabs Header */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          {availableTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
                  isActive
                    ? 'bg-[#071B3D] text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {tab.id === 'overview' && <BarChartIcon size={15} />}
                {tab.id === 'my-cases' && <Users size={15} />}
                {tab.id === 'finance' && <DollarIcon size={15} />}
                {tab.id === 'marketing' && <TargetIcon size={15} />}
                <span>{isFa ? tab.labelFa : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center space-x-2 rtl:space-x-reverse">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading indicator for tab content */}
        {loadingData && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* TAB 1: COMPANY OVERVIEW («نمای کلی شرکت») */}
        {!loadingData && activeTab === 'overview' && overviewData && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'کل پرونده‌های ثبت‌شده' : 'Total Leads'}</span>
                  <Users size={18} className="text-[#2F6FED]" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#071B3D]">
                  {overviewData.summary?.totalLeads ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'مجموع سوابق در دیتابیس' : 'All-time database records'}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'لیدهای بازه انتخابی' : 'Leads in Range'}</span>
                  <TrendingUpIcon size={18} className="text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                  {overviewData.summary?.rangeLeadsCount ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? `از ${fromDate} تا ${toDate}` : `${fromDate} to ${toDate}`}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'اقدام فوری / سررسید' : 'Urgent Stages'}</span>
                  <AlertCircle size={18} className="text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                  {overviewData.summary?.urgentCasesCount ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'سررسید تا ۲۴ ساعت آینده' : 'Due within next 24 hours'}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'کارمندان فعال' : 'Active Staff'}</span>
                  <LockKeyhole size={18} className="text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#071B3D]">
                  {overviewData.summary?.activeStaffCount ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'پرسنل اداری و وکلا' : 'Staff & legal specialists'}
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Growth Trend Chart */}
              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#071B3D]">
                    {isFa ? 'روند ثبت روزانه لید در بازه انتخابی' : 'Daily Lead Registration Growth'}
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    {overviewData.dailyTrend?.length ?? 0} {isFa ? 'روز' : 'days'}
                  </span>
                </div>
                <div className="h-[280px] w-full" dir="ltr">
                  {mounted && overviewData.dailyTrend && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={overviewData.dailyTrend}>
                        <defs>
                          <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2F6FED" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#2F6FED" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#071B3D',
                            borderColor: '#0b2b55',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '12px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          name={isFa ? 'تعداد لید' : 'Leads'}
                          stroke="#2F6FED"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#leadGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Status Breakdown Bar Chart */}
              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#071B3D]">
                    {isFa ? 'تفکیک وضعیت کل پرونده‌ها' : 'Leads Distribution by Status'}
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    {isFa ? 'کل پرونده‌ها' : 'All Cases'}
                  </span>
                </div>
                <div className="h-[280px] w-full" dir="ltr">
                  {mounted && overviewData.statusBreakdown && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={overviewData.statusBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" />
                        <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#64748b' }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#071B3D',
                            borderColor: '#0b2b55',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="count" name={isFa ? 'تعداد' : 'Count'} radius={[6, 6, 0, 0]}>
                          {overviewData.statusBreakdown.map((entry: any, index: number) => {
                            const colors: Record<string, string> = {
                              new: '#3b82f6',
                              contacted: '#f59e0b',
                              qualified: '#10b981',
                              closed: '#64748b',
                              archived: '#94a3b8',
                            };
                            return <Cell key={`cell-${index}`} fill={colors[entry.status] || '#2F6FED'} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Staff Workload Table */}
            <div className="bg-white border border-[#dfe6ef] rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#071B3D]">
                    {isFa ? 'توزیع حجم کاری پرسنل' : 'Staff Workload Distribution'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isFa ? 'تعداد پرونده‌های تخصیص‌یافته و وضعیت مراحل باز هر کارشناس' : 'Assigned cases and pending/overdue stages per team member'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
                  {overviewData.staffWorkload?.length ?? 0} {isFa ? 'نفر' : 'members'}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                    <tr>
                      <th className="py-3.5 px-6">{isFa ? 'نام پرسنل' : 'Staff Member'}</th>
                      <th className="py-3.5 px-6">{isFa ? 'نقش' : 'Role'}</th>
                      <th className="py-3.5 px-6 text-center">{isFa ? 'پرونده‌های تخصیص‌یافته' : 'Assigned Cases'}</th>
                      <th className="py-3.5 px-6 text-center">{isFa ? 'مراحل باز' : 'Open Stages'}</th>
                      <th className="py-3.5 px-6 text-center">{isFa ? 'مراحل سررسیدگذشته' : 'Overdue Stages'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {overviewData.staffWorkload?.map((sw: any) => (
                      <tr key={sw.staffId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-6 font-bold text-slate-900">{sw.fullName}</td>
                        <td className="py-3.5 px-6">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold border border-slate-200">
                            {sw.roleLabelFa}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-center font-bold text-[#2F6FED]">
                          {sw.assignedCasesCount}
                        </td>
                        <td className="py-3.5 px-6 text-center font-bold">
                          {sw.pendingStagesCount}
                        </td>
                        <td className="py-3.5 px-6 text-center font-bold">
                          {sw.overdueStagesCount > 0 ? (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[11px]">
                              {sw.overdueStagesCount}
                            </span>
                          ) : (
                            <span className="text-slate-400">۰</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Urgent Stages Table */}
            <div className="bg-white border border-[#dfe6ef] rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#071B3D] flex items-center gap-2">
                    <AlertCircle size={18} className="text-amber-500" />
                    <span>{isFa ? 'پرونده‌ها و مراحل نیازمند اقدام فوری' : 'Urgent Stages Requiring Action'}</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isFa ? 'مراحلی که وضعیت آن‌ها انجام‌نشده است و سررسید آن‌ها امروز یا فرداست' : 'Incomplete stages due today or tomorrow'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
                  {overviewData.urgentCases?.length ?? 0} {isFa ? 'مورد' : 'cases'}
                </span>
              </div>
              <div className="overflow-x-auto">
                {overviewData.urgentCases?.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    {isFa ? 'هیچ مرحله فوری یا سررسیدگذشته‌ای وجود ندارد.' : 'No urgent stages found.'}
                  </div>
                ) : (
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="py-3.5 px-6">{isFa ? 'نام متقاضی' : 'Applicant'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'عنوان مرحله' : 'Stage Title'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'سررسید' : 'Due Date'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'وضعیت' : 'Status'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'مسئول' : 'Assignee'}</th>
                        <th className="py-3.5 px-6 text-center">{isFa ? 'اقدام' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {overviewData.urgentCases?.map((uc: any) => (
                        <tr key={uc.stageId} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-slate-900">{uc.leadFullName}</td>
                          <td className="py-3.5 px-6">{uc.stageLabelFa}</td>
                          <td className="py-3.5 px-6">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                uc.isOverdue
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {uc.dueDate} {uc.isOverdue ? (isFa ? '(سررسید گذشته)' : '(Overdue)') : ''}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-slate-600">{uc.status}</td>
                          <td className="py-3.5 px-6 font-medium text-slate-800">
                            {uc.responsibleStaffName || uc.responsibleRole || '-'}
                          </td>
                          <td className="py-3.5 px-6 text-center">
                            <Link
                              href={`/admin/leads/${uc.leadId}`}
                              className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                            >
                              <span>{isFa ? 'مشاهده پرونده' : 'View'}</span>
                              {isFa ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY CASES («پرونده‌های من») */}
        {!loadingData && activeTab === 'my-cases' && myCasesData && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'پرونده‌های تخصیص‌یافته به من' : 'My Assigned Cases'}</span>
                  <Users size={18} className="text-[#2F6FED]" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#071B3D]">
                  {myCasesData.summary?.totalAssignedCases ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'پرونده‌های فعال تحت مدیریت شما' : 'Active cases managed by you'}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'مراحل باز و در انتظار' : 'Pending Stages'}</span>
                  <Clock size={18} className="text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                  {myCasesData.summary?.pendingStagesCount ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'مراحل انجام نشده' : 'Incomplete stages'}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'مراحل سررسیدگذشته' : 'Overdue Stages'}</span>
                  <AlertCircle size={18} className="text-rose-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">
                  {myCasesData.summary?.overdueStagesCount ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'اقدام فوری مورد نیاز است' : 'Urgent review needed'}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'تکمیل‌شده در بازه' : 'Completed in Range'}</span>
                  <CheckCircle size={18} className="text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                  {myCasesData.summary?.completedStagesInRange ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? `از ${fromDate} تا ${toDate}` : 'Within selected dates'}
                </div>
              </div>
            </div>

            {/* Pending & Overdue Stages Table */}
            <div className="bg-white border border-[#dfe6ef] rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#071B3D]">
                    {isFa ? 'مراحل باز و وظایف من' : 'My Open & Pending Tasks'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isFa ? 'مرتب‌شده بر اساس سررسید انجام' : 'Sorted by due date'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
                  {myCasesData.pendingStages?.length ?? 0} {isFa ? 'مرحله' : 'stages'}
                </span>
              </div>
              <div className="overflow-x-auto">
                {myCasesData.pendingStages?.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    {isFa ? 'شما در حال حاضر مرحله باز یا سررسیدگذشته‌ای ندارید. عالی است!' : 'No open tasks at this moment. Great job!'}
                  </div>
                ) : (
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="py-3.5 px-6">{isFa ? 'نام متقاضی' : 'Applicant'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'عنوان مرحله' : 'Stage Title'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'وضعیت' : 'Status'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'سررسید' : 'Due Date'}</th>
                        <th className="py-3.5 px-6 text-center">{isFa ? 'اقدام' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {myCasesData.pendingStages?.map((ps: any) => (
                        <tr key={ps.stageId} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-slate-900">{ps.leadFullName}</td>
                          <td className="py-3.5 px-6">{ps.stageLabelFa}</td>
                          <td className="py-3.5 px-6 text-slate-600">{ps.status}</td>
                          <td className="py-3.5 px-6">
                            {ps.dueDate ? (
                              <span
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                  ps.isOverdue
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {ps.dueDate} {ps.isOverdue ? (isFa ? '⚠️ سررسید گذشته' : '⚠️ Overdue') : ''}
                              </span>
                            ) : (
                              <span className="text-slate-400">{isFa ? 'تعیین نشده' : 'No date'}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-6 text-center">
                            <Link
                              href={`/admin/leads/${ps.leadId}`}
                              className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-[#2F6FED]/10 hover:bg-[#2F6FED]/20 text-[#2F6FED] rounded-lg text-xs font-bold transition-all"
                            >
                              <span>{isFa ? 'ورود به پرونده' : 'Open Case'}</span>
                              {isFa ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* My Assigned Cases Table */}
            <div className="bg-white border border-[#dfe6ef] rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#071B3D]">
                    {isFa ? 'فهرست پرونده‌های تخصیص‌یافته به من' : 'All Assigned Leads'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isFa ? 'پرونده‌هایی که به عنوان کارشناس یا وکیل به شما واگذار شده است' : 'Cases assigned to your staff profile'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
                  {myCasesData.assignedCases?.length ?? 0} {isFa ? 'پرونده' : 'cases'}
                </span>
              </div>
              <div className="overflow-x-auto">
                {myCasesData.assignedCases?.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    {isFa ? 'هیچ پرونده‌ای به حساب شما تخصیص داده نشده است.' : 'No cases assigned yet.'}
                  </div>
                ) : (
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="py-3.5 px-6">{isFa ? 'نام متقاضی' : 'Applicant'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'شماره تماس / ایمیل' : 'Contact'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'نقش تخصیص' : 'Assigned Role'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'وضعیت پرونده' : 'Case Status'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'منبع جذب' : 'Source'}</th>
                        <th className="py-3.5 px-6 text-center">{isFa ? 'اقدام' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {myCasesData.assignedCases?.map((c: any) => (
                        <tr key={c.assignmentId} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-slate-900">{c.fullName}</td>
                          <td className="py-3.5 px-6 text-slate-500">
                            {c.phone || c.email || '-'}
                          </td>
                          <td className="py-3.5 px-6">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold">
                              {c.assignedRole}
                            </span>
                          </td>
                          <td className="py-3.5 px-6">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold border border-slate-200">
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-slate-500">{c.source}</td>
                          <td className="py-3.5 px-6 text-center">
                            <Link
                              href={`/admin/leads/${c.leadId}`}
                              className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                            >
                              <span>{isFa ? 'مشاهده پرونده' : 'View'}</span>
                              {isFa ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FINANCE («مالی») */}
        {!loadingData && activeTab === 'finance' && financeData && (
          <div className="space-y-8 animate-fadeIn">
            {/* Financial KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'درآمد کل بازه' : 'Revenue'}</span>
                  <DollarIcon size={18} className="text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                  {financeData.summary?.totalRevenue?.toLocaleString() ?? 0} €
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'مجموع دریافتی‌های وصول‌شده' : 'Collected receipts'}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'هزینه‌های بازه' : 'Expenses'}</span>
                  <DollarIcon size={18} className="text-rose-600" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-rose-600">
                  {financeData.summary?.totalExpenses?.toLocaleString() ?? 0} €
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'ترجمه، نوتر، وکالت و غیره' : 'Translation, legal, etc.'}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'سود خالص بازه' : 'Net Profit'}</span>
                  <TrendingUpIcon size={18} className="text-[#2F6FED]" />
                </div>
                <div
                  className={`text-xl sm:text-2xl font-extrabold ${
                    (financeData.summary?.netProfit ?? 0) >= 0
                      ? 'text-[#2F6FED]'
                      : 'text-rose-600'
                  }`}
                >
                  {financeData.summary?.netProfit?.toLocaleString() ?? 0} €
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'تفاضل دریافتی‌ها و هزینه‌ها' : 'Receipts minus expenses'}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'خدمات دارای مانده' : 'Open Charges'}</span>
                  <AlertCircle size={18} className="text-amber-500" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-600">
                  {financeData.summary?.outstandingInvoicesCount ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'بدهکاری‌های تسویه‌نشده' : 'Unpaid charges count'}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2 col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'مجموع مانده مطالبات' : 'Outstanding Sum'}</span>
                  <DollarIcon size={18} className="text-purple-600" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-purple-700">
                  {financeData.summary?.totalOutstandingAmount?.toLocaleString() ?? 0} €
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'کل مبالغ وصول‌نشده شرکت' : 'Total uncollected receivables'}
                </div>
              </div>
            </div>

            {/* Financial Composed Chart */}
            <div className="bg-white border border-[#dfe6ef] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#071B3D]">
                    {isFa
                      ? `روند دریافتی، هزینه و سود خالص (${financeData.summary?.timeSeriesMode === 'daily' ? 'روزانه' : 'هفتگی'})`
                      : `Receipts vs Expenses vs Profit (${financeData.summary?.timeSeriesMode})`}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isFa ? 'نمایش مقایسه‌ای جریان مالی بر حسب یورو (€)' : 'Comparative financial trends in EUR (€)'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
                  {financeData.timeSeries?.length ?? 0} {isFa ? 'نقطه زمانی' : 'periods'}
                </span>
              </div>
              <div className="h-[320px] w-full" dir="ltr">
                {mounted && financeData.timeSeries && (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={financeData.timeSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#071B3D',
                          borderColor: '#0b2b55',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '12px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name={isFa ? 'دریافتی (€)' : 'Receipts (€)'} fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name={isFa ? 'هزینه (€)' : 'Expenses (€)'} fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        name={isFa ? 'سود خالص (€)' : 'Net Profit (€)'}
                        stroke="#2F6FED"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Per-Client Financial Breakdown Table */}
            <div className="bg-white border border-[#dfe6ef] rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#071B3D]">
                    {isFa ? 'صورت وضعیت مالی و مانده مطالبات به تفکیک هر پرونده/مشتری' : 'Per-Client Receivables & Financial Breakdown'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isFa ? 'سرجمع بدهکاری‌ها، دریافتی‌ها و خالص مانده طلب شرکت از هر متقاضی' : 'Total charges, receipts, and outstanding balances per lead'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">
                  {financeData.clientBreakdown?.length ?? 0} {isFa ? 'مشتری' : 'clients'}
                </span>
              </div>
              <div className="overflow-x-auto">
                {!financeData.clientBreakdown || financeData.clientBreakdown.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    {isFa ? 'هیچ تراکنش مالی برای مشتریان در این بازه ثبت نشده است.' : 'No client accounting records found for this period.'}
                  </div>
                ) : (
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="py-3.5 px-6">{isFa ? 'متقاضی' : 'Applicant'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'اطلاعات تماس' : 'Contact'}</th>
                        <th className="py-3.5 px-6 text-center">{isFa ? 'تعداد خدمات / واریزی' : 'Charges / Receipts'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'مجموع خدمات (بدهکاری)' : 'Total Charges'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'مجموع دریافتی (بستانکاری)' : 'Total Received'}</th>
                        <th className="py-3.5 px-6 font-bold">{isFa ? 'مانده طلب شرکت' : 'Balance Due'}</th>
                        <th className="py-3.5 px-6 text-center">{isFa ? 'اقدام' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {financeData.clientBreakdown.map((client: any) => {
                        const bal = Number(client.outstandingBalance) || 0;
                        return (
                          <tr key={client.leadId} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-6 font-bold text-slate-900">{client.fullName}</td>
                            <td className="py-3.5 px-6 text-slate-500">
                              <span className="font-mono text-[11px] block">{client.phone || '-'}</span>
                              {client.email && <span className="text-[11px] text-slate-400 truncate block">{client.email}</span>}
                            </td>
                            <td className="py-3.5 px-6 text-center text-slate-500">
                              <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px]">
                                {client.chargesCount} {isFa ? 'خدمت' : 'chg'} / {client.receiptsCount} {isFa ? 'واریزی' : 'rcpt'}
                              </span>
                            </td>
                            <td className="py-3.5 px-6 font-bold text-slate-800">
                              {Number(client.totalCharges || 0).toLocaleString()} €
                            </td>
                            <td className="py-3.5 px-6 text-emerald-600 font-bold">
                              {Number(client.totalReceipts || 0).toLocaleString()} €
                            </td>
                            <td className="py-3.5 px-6 font-extrabold">
                              {bal > 0 ? (
                                <span className="text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                                  {bal.toLocaleString()} € {isFa ? 'بدهکار' : 'due'}
                                </span>
                              ) : bal < 0 ? (
                                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                  {Math.abs(bal).toLocaleString()} € {isFa ? 'بستانکار' : 'credit'}
                                </span>
                              ) : (
                                <span className="text-slate-400">0 € ({isFa ? 'تسویه کامل' : 'settled'})</span>
                              )}
                            </td>
                            <td className="py-3.5 px-6 text-center">
                              <Link
                                href={`/admin/leads/${client.leadId}?tab=5`}
                                className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                              >
                                <span>{isFa ? 'دفتر حساب' : 'Ledger'}</span>
                                {isFa ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Outstanding Charges Table */}
            <div className="bg-white border border-[#dfe6ef] rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#071B3D]">
                    {isFa ? 'فهرست بدهکاری‌های باز و پیگیری مطالبات' : 'Open Charges & Collections'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isFa ? 'خدمات و بدهکاری‌های پرداخت‌نشده یا دارای مانده معوق' : 'Charges with unpaid balances'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
                  {financeData.outstandingInvoices?.length ?? 0} {isFa ? 'مورد' : 'charges'}
                </span>
              </div>
              <div className="overflow-x-auto">
                {financeData.outstandingInvoices?.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    {isFa ? 'هیچ بدهکاری دارای مانده‌ای یافت نشد. همه مطالبات تسویه شده‌اند.' : 'All charges are fully settled.'}
                  </div>
                ) : (
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="py-3.5 px-6">{isFa ? 'نام متقاضی' : 'Applicant'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'وضعیت' : 'Status'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'مبلغ خدمت' : 'Total Amount'}</th>
                        <th className="py-3.5 px-6">{isFa ? 'پرداخت‌شده' : 'Paid Amount'}</th>
                        <th className="py-3.5 px-6 font-bold text-rose-600">{isFa ? 'مانده بدهی' : 'Remaining'}</th>
                        <th className="py-3.5 px-6 text-center">{isFa ? 'اقدام' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {financeData.outstandingInvoices?.map((inv: any) => (
                        <tr key={inv.invoiceId} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-slate-900">{inv.leadFullName}</td>
                          <td className="py-3.5 px-6">
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[11px] font-bold">
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-6">{inv.totalAmount?.toLocaleString()} €</td>
                          <td className="py-3.5 px-6 text-emerald-600 font-bold">
                            {inv.paidAmount?.toLocaleString()} €
                          </td>
                          <td className="py-3.5 px-6 text-rose-600 font-extrabold">
                            {inv.remainingAmount?.toLocaleString()} €
                          </td>
                          <td className="py-3.5 px-6 text-center">
                            <Link
                              href={`/admin/leads/${inv.leadId}?tab=5`}
                              className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                            >
                              <span>{isFa ? 'مشاهده در پرونده' : 'View'}</span>
                              {isFa ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MARKETING («بازاریابی») */}
        {!loadingData && activeTab === 'marketing' && marketingData && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'لیدهای جذب‌شده در بازه' : 'Acquired Leads'}</span>
                  <Users size={18} className="text-[#2F6FED]" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#071B3D]">
                  {marketingData.summary?.totalLeadsInRange ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? `ثبت‌شده از ${fromDate} تا ${toDate}` : 'Within selected date range'}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'لیدهای واجد شرایط' : 'Qualified Leads'}</span>
                  <CheckCircle size={18} className="text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                  {marketingData.summary?.qualifiedCount ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'وضعیت qualified' : 'Marked as qualified'}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'نرخ تبدیل لید' : 'Conversion Rate'}</span>
                  <TargetIcon size={18} className="text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-700">
                  {marketingData.summary?.conversionRatePercent ?? 0}%
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'نسبت واجدین شرایط به کل' : 'Qualified / Total in range'}
                </div>
              </div>

              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>{isFa ? 'کانال‌های فعال ورودی' : 'Active Channels'}</span>
                  <TrendingUpIcon size={18} className="text-blue-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#071B3D]">
                  {marketingData.sourcesBreakdown?.length ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isFa ? 'وب‌سایت، بات، واتساپ' : 'Web, Telegram bot, WhatsApp'}
                </div>
              </div>
            </div>

            {/* Marketing Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Trend by Source Chart */}
              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#071B3D]">
                    {isFa ? 'روند روزانه ثبت لید به تفکیک کانال' : 'Daily Trend by Acquisition Channel'}
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    {marketingData.dailyTrendBySource?.length ?? 0} {isFa ? 'روز' : 'days'}
                  </span>
                </div>
                <div className="h-[280px] w-full" dir="ltr">
                  {mounted && marketingData.dailyTrendBySource && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={marketingData.dailyTrendBySource}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#071B3D',
                            borderColor: '#0b2b55',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '12px',
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="website"
                          name={isFa ? 'وب‌سایت' : 'Website'}
                          stackId="1"
                          stroke="#2F6FED"
                          fill="#2F6FED"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="telegram_bot"
                          name={isFa ? 'بات تلگرام' : 'Telegram Bot'}
                          stackId="1"
                          stroke="#0088cc"
                          fill="#0088cc"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="whatsapp"
                          name={isFa ? 'واتساپ' : 'WhatsApp'}
                          stackId="1"
                          stroke="#25D366"
                          fill="#25D366"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Source Distribution Bar Chart */}
              <div className="bg-white border border-[#dfe6ef] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#071B3D]">
                    {isFa ? 'سهم کانال‌های ورودی در بازه' : 'Acquisition Channels Share'}
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    {isFa ? 'درصد و تعداد' : 'Percentage & Count'}
                  </span>
                </div>
                <div className="h-[280px] w-full" dir="ltr">
                  {mounted && marketingData.sourcesBreakdown && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={marketingData.sourcesBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f8" />
                        <XAxis dataKey="source" tick={{ fontSize: 11, fill: '#64748b' }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#071B3D',
                            borderColor: '#0b2b55',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="count" name={isFa ? 'تعداد لید' : 'Leads'} radius={[6, 6, 0, 0]}>
                          {marketingData.sourcesBreakdown.map((entry: any, index: number) => {
                            const colors: Record<string, string> = {
                              website: '#2F6FED',
                              telegram_bot: '#0088cc',
                              whatsapp: '#25D366',
                            };
                            return <Cell key={`cell-m-${index}`} fill={colors[entry.source] || '#8b5cf6'} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Channels Table */}
            <div className="bg-white border border-[#dfe6ef] rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#071B3D]">
                    {isFa ? 'جدول عملکرد کانال‌های ورودی' : 'Channel Performance Summary'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isFa ? 'تعداد و درصد سهم هر کانال در بازه انتخابی' : 'Count and relative share per acquisition source'}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                    <tr>
                      <th className="py-3.5 px-6">{isFa ? 'کانال ورودی' : 'Source'}</th>
                      <th className="py-3.5 px-6">{isFa ? 'تعداد لید' : 'Leads Count'}</th>
                      <th className="py-3.5 px-6">{isFa ? 'درصد سهم از کل' : 'Share (%)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {marketingData.sourcesBreakdown?.map((sb: any) => (
                      <tr key={sb.source} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-6 font-bold text-slate-900">
                          {sb.source === 'website'
                            ? (isFa ? 'وب‌سایت' : 'Website')
                            : sb.source === 'telegram_bot'
                            ? (isFa ? 'بات تلگرام' : 'Telegram Bot')
                            : sb.source === 'whatsapp'
                            ? (isFa ? 'واتساپ' : 'WhatsApp')
                            : sb.source}
                        </td>
                        <td className="py-3.5 px-6 font-bold text-[#2F6FED]">{sb.count}</td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{sb.percentage}%</span>
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#2F6FED] rounded-full"
                                style={{ width: `${Math.min(100, sb.percentage)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
