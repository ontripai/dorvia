'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  Landmark,
  Clock,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Search,
  LogOut,
  Settings,
  Users,
  BriefcaseBusiness,
  BookOpen,
  Handshake,
  ChartNoAxesCombined,
} from '@/components/Icons';

interface AdminExchangeListPageProps {
  params: { lang: Language };
}

interface LeadCompact {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

interface PartnerCompact {
  id: string;
  name: string;
  country: string;
  role: string;
}

interface RequestCompact {
  id: string;
  direction: 'EUR_TO_IRR' | 'IRR_TO_EUR';
  eur_amount: number;
  rate: number;
  irr_amount: number;
  min_chunk: number;
  requester_lead_id: string;
}

interface MatchRecord {
  id: string;
  request_id: string;
  acceptor_lead_id: string;
  amount_eur: number;
  rate_snapshot: number;
  amount_irr: number;
  fee_eur: number;
  status: string;
  eur_payer_lead_id: string;
  eur_receiver_lead_id: string;
  irr_payer_lead_id: string;
  irr_receiver_lead_id: string;
  destination_account_id: string | null;
  reserved_until: string;
  eur_due_at: string | null;
  proof_due_at: string | null;
  confirm_due_at: string | null;
  destination_account_revealed_at: string | null;
  partner_id: string | null;
  partner_confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  request?: RequestCompact | null;
  eur_payer?: LeadCompact | null;
  eur_receiver?: LeadCompact | null;
  irr_payer?: LeadCompact | null;
  irr_receiver?: LeadCompact | null;
  partner?: PartnerCompact | null;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminExchangeListPage({ params }: AdminExchangeListPageProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Admin user context for navigation
  const [adminUser, setAdminUser] = useState<any>(null);

  // Data state
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  // Actionable Counter metrics (Fetched independently so staff always sees total actionable count)
  const [pendingEurReceiptCount, setPendingEurReceiptCount] = useState<number>(0);
  const [pendingEurPayoutCount, setPendingEurPayoutCount] = useState<number>(0);

  // Filter state (Default: 'ACCEPTED,IRR_CONFIRMED')
  const [statusFilter, setStatusFilter] = useState<string>('ACCEPTED,IRR_CONFIRMED');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Fetch current admin context from /api/admin/leads (for permissions and nav bar)
  useEffect(() => {
    let isMounted = true;
    async function loadAdminUser() {
      try {
        const res = await fetch('/api/admin/leads');
        if (res.status === 401) {
          router.replace(`/${currentLang}/admin/login?error=unauthorized`);
          return;
        }
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.admin) {
            setAdminUser(json.admin);
          }
        }
      } catch (err) {
        console.error('Error fetching admin context:', err);
      }
    }
    loadAdminUser();
    return () => {
      isMounted = false;
    };
  }, [currentLang, router]);

  // 2. Fetch actionable counters (total ACCEPTED and IRR_CONFIRMED counts across all pages)
  const loadCounters = useCallback(async () => {
    try {
      const [accRes, irrRes] = await Promise.all([
        fetch('/api/admin/exchange/matches?status=ACCEPTED&limit=1'),
        fetch('/api/admin/exchange/matches?status=IRR_CONFIRMED&limit=1'),
      ]);

      if (accRes.ok) {
        const accJson = await accRes.json();
        setPendingEurReceiptCount(accJson?.pagination?.total ?? 0);
      }
      if (irrRes.ok) {
        const irrJson = await irrRes.json();
        setPendingEurPayoutCount(irrJson?.pagination?.total ?? 0);
      }
    } catch (err) {
      console.error('Error fetching exchange counters:', err);
    }
  }, []);

  // 3. Fetch matches list from /api/admin/exchange/matches
  const loadMatches = useCallback(async () => {
    setLoading(true);
    setErrorStatus(null);
    setErrorMessage(null);

    try {
      const paramsUrl = new URLSearchParams();
      if (statusFilter && statusFilter !== 'ALL') {
        paramsUrl.set('status', statusFilter);
      }
      paramsUrl.set('page', String(currentPage));
      paramsUrl.set('limit', '20');

      const res = await fetch(`/api/admin/exchange/matches?${paramsUrl.toString()}`);

      if (res.status === 401) {
        router.replace(`/${currentLang}/admin/login?error=unauthorized`);
        return;
      }

      if (res.status === 403) {
        setErrorStatus(403);
        setErrorMessage(
          isFa
            ? 'شما به بخش تبادل ارز دسترسی ندارید.'
            : 'You do not have permission to access the Currency Exchange module.'
        );
        setLoading(false);
        return;
      }

      const json = await res.json();
      if (!res.ok) {
        setErrorStatus(res.status);
        setErrorMessage(json.error || (isFa ? 'خطا در دریافت اطلاعات معاملات.' : 'Failed to load exchange matches.'));
        setLoading(false);
        return;
      }

      setMatches(json.matches || []);
      if (json.pagination) {
        setPagination(json.pagination);
      }
    } catch (err: any) {
      console.error('Network error loading exchange matches:', err);
      setErrorStatus(500);
      setErrorMessage(
        isFa
          ? 'خطا در برقراری ارتباط با سرور. لطفا مجددا تلاش کنید.'
          : 'Network connection error. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [statusFilter, currentPage, currentLang, router, isFa]);

  useEffect(() => {
    loadCounters();
  }, [loadCounters]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace(`/${currentLang}/admin/login`);
  };

  // Helper for active deadline resolution
  const getActiveDeadline = (match: MatchRecord) => {
    let deadlineStr: string | null = null;
    let label = '';

    if (match.status === 'ACCEPTED') {
      deadlineStr = match.eur_due_at;
      label = isFa ? 'مهلت دریافت یورو' : 'EUR Receipt Due';
    } else if (match.status === 'EUR_RECEIVED') {
      deadlineStr = match.proof_due_at;
      label = isFa ? 'مهلت ارسال فیش ریال' : 'IRR Proof Due';
    } else if (match.status === 'IRR_PROOF_SUBMITTED') {
      deadlineStr = match.confirm_due_at;
      label = isFa ? 'مهلت تایید انتقال ریال' : 'IRR Confirm Due';
    }

    if (!deadlineStr) {
      return { hasDeadline: false, label: '—', text: '—', tone: 'neutral' as const };
    }

    const dueTime = new Date(deadlineStr).getTime();
    const now = Date.now();
    const diffHours = (dueTime - now) / (1000 * 60 * 60);

    let tone: 'red' | 'amber' | 'neutral' = 'neutral';
    if (diffHours < 0) {
      tone = 'red';
    } else if (diffHours <= 24) {
      tone = 'amber';
    }

    const formattedDate = new Intl.DateTimeFormat(isFa ? 'fa-IR' : 'en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(deadlineStr));

    return {
      hasDeadline: true,
      label,
      text: formattedDate,
      tone,
      isExpired: diffHours < 0,
      diffHours: Math.round(diffHours),
    };
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return {
          label: isFa ? 'پذیرفته‌شده (منتظر دریافت یورو)' : 'Accepted (Awaiting EUR)',
          badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-300 font-bold',
        };
      case 'EUR_RECEIVED':
        return {
          label: isFa ? 'یورو دریافت شد (منتظر انتقال ریال)' : 'EUR Received (Awaiting IRR)',
          badgeClass: 'bg-blue-500/10 text-blue-700 border-blue-300 font-bold',
        };
      case 'IRR_PROOF_SUBMITTED':
        return {
          label: isFa ? 'فیش ریال ارسال شد' : 'IRR Proof Submitted',
          badgeClass: 'bg-purple-500/10 text-purple-700 border-purple-300 font-bold',
        };
      case 'IRR_CONFIRMED':
        return {
          label: isFa ? 'ریال تایید شد (منتظر پرداخت یورو)' : 'IRR Confirmed (Awaiting Payout)',
          badgeClass: 'bg-emerald-500/15 text-emerald-700 border-emerald-400 font-bold animate-pulse',
        };
      case 'SETTLED':
        return {
          label: isFa ? 'تسویه‌شده و پایان‌یافته' : 'Settled & Completed',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        };
      case 'CANCELLED':
        return {
          label: isFa ? 'لغو شده' : 'Cancelled',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'EXPIRED':
        return {
          label: isFa ? 'منقضی شده' : 'Expired',
          badgeClass: 'bg-slate-100 text-slate-500 border-slate-200',
        };
      case 'DISPUTED':
        return {
          label: isFa ? 'دارای اختلاف' : 'Disputed',
          badgeClass: 'bg-red-500/15 text-red-700 border-red-300 font-bold',
        };
      case 'REFUNDED':
        return {
          label: isFa ? 'مسترد شده' : 'Refunded',
          badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
        };
      default:
        return {
          label: status,
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        };
    }
  };

  // Filtered by search term on client side
  const displayedMatches = useMemo(() => {
    if (!searchQuery.trim()) return matches;
    const q = searchQuery.toLowerCase().trim();
    return matches.filter((m) => {
      const payerName = m.eur_payer?.full_name?.toLowerCase() || '';
      const receiverName = m.eur_receiver?.full_name?.toLowerCase() || '';
      const irrPayerName = m.irr_payer?.full_name?.toLowerCase() || '';
      const irrReceiverName = m.irr_receiver?.full_name?.toLowerCase() || '';
      const matchId = m.id.toLowerCase();
      return (
        payerName.includes(q) ||
        receiverName.includes(q) ||
        irrPayerName.includes(q) ||
        irrReceiverName.includes(q) ||
        matchId.includes(q)
      );
    });
  }, [matches, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f7f9fc] py-8 sm:py-10" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
        
        {/* Top Header Bar */}
        <div className="bg-[#071B3D] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#0b2b55]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse">
                <Landmark size={13} />
                <span>{isFa ? 'کنسول عملیات صرافی و تبادل ارز' : 'Exchange Staff Operations Console'}</span>
              </span>
              {adminUser?.email && (
                <span className="text-xs text-slate-300">{adminUser.email}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isFa ? 'مدیریت و تسویه معاملات تبادل ارز' : 'Currency Exchange Operations'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isFa
                ? 'نظارت بر معاملات همتا-به-همتا، ثبت دریافت فیزیکی یورو در پیشخوان، تایید فیش‌های واریز ریالی و آزادسازی پرداخت یورو.'
                : 'Monitor P2P currency exchange matches, record counter EUR receipts, inspect IRR proofs, and authorize payouts.'}
            </p>
          </div>

          {/* Top Navigation Links */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/leads"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <Users size={15} />
              <span>{isFa ? 'پرونده‌های متقاضیان' : 'Leads'}</span>
            </Link>

            {(adminUser?.roleKey === 'owner' || adminUser?.roleKey === 'manager' || adminUser?.permissions?.includes('team.manage')) && (
              <Link
                href="/admin/team"
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                <Users size={15} />
                <span>{isFa ? 'مدیریت تیم' : 'Team'}</span>
              </Link>
            )}

            <Link
              href="/admin/reports"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <ChartNoAxesCombined size={15} />
              <span>{isFa ? 'گزارش‌ها و آمار' : 'Reports'}</span>
            </Link>

            {(adminUser?.roleKey === 'owner' || adminUser?.roleKey === 'manager' || adminUser?.permissions?.includes('finance.view') || adminUser?.permissions?.includes('finance.edit')) && (
              <Link
                href="/admin/referral-partners"
                className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                <Handshake size={15} />
                <span>{isFa ? 'همکاران معرف' : 'Referrals'}</span>
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
              <span>{isFa ? 'خروج از پنل' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* 403 Forbidden State */}
        {errorStatus === 403 ? (
          <div className="bg-white border border-rose-200 rounded-3xl p-10 text-center shadow-sm space-y-4 max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800">
              {isFa ? 'عدم دسترسی به تبادل ارز' : 'Access Restricted'}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isFa
                ? 'شما به بخش تبادل ارز دسترسی ندارید. این ماژول تنها در اختیار کارکنان دارای مجوزهای سازمانی exchange.view یا exchange.manage قرار دارد.'
                : 'You do not have permission to access the Currency Exchange module. Contact your organization administrator if you require access.'}
            </p>
            <div className="pt-2">
              <Link
                href="/admin/leads"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-2.5 rounded-xl bg-[#2F6FED] text-white text-xs font-bold hover:bg-[#2558c4] transition-all shadow-sm"
              >
                <span>{isFa ? 'بازگشت به پرونده‌های متقاضیان' : 'Back to Leads'}</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Actionable Staff Counter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Card 1: Awaiting EUR Receipt */}
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('ACCEPTED');
                  setCurrentPage(1);
                }}
                className={`text-start rounded-2xl p-6 border transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between ${
                  statusFilter === 'ACCEPTED'
                    ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-white border-[#dfe6ef] hover:border-amber-300'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-700 text-xs font-bold">
                    <Clock size={16} />
                    <span>{isFa ? 'اقدام کارمند: منتظر دریافت یورو' : 'Action Required: Awaiting EUR Receipt'}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {isFa ? 'معاملات پذیرفته‌شده در انتظار دریافت نقدی' : 'Accepted Matches Pending Counter Cash'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isFa
                      ? 'مشتری یورو را در دفتر یا صرافی همکار تحویل دهد تا وضعیت به EUR_RECEIVED ارتقا یابد.'
                      : 'Customer must deposit EUR at desk before match moves to EUR_RECEIVED.'}
                  </p>
                </div>
                <div className="ms-4 shrink-0 flex flex-col items-center justify-center min-w-[72px] h-[72px] rounded-2xl bg-amber-500 text-white shadow-md">
                  <span className="text-2xl font-black">{pendingEurReceiptCount}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    {isFa ? 'پرونده' : 'CASES'}
                  </span>
                </div>
              </button>

              {/* Card 2: Awaiting EUR Payout */}
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('IRR_CONFIRMED');
                  setCurrentPage(1);
                }}
                className={`text-start rounded-2xl p-6 border transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between ${
                  statusFilter === 'IRR_CONFIRMED'
                    ? 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/30'
                    : 'bg-white border-[#dfe6ef] hover:border-emerald-300'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-700 text-xs font-bold">
                    <CheckCircle size={16} />
                    <span>{isFa ? 'اقدام کارمند: منتظر پرداخت یورو' : 'Action Required: Awaiting EUR Payout'}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {isFa ? 'معاملات تاییدشده ریالی در انتظار پرداخت یورو' : 'IRR Confirmed Matches Pending Payout'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isFa
                      ? 'واریز ریالی در بانک ایران احراز شده؛ یورو باید به متقاضی یا نماینده مجاز پرداخت و تسویه شود.'
                      : 'Iranian transfer verified; EUR payout must be released to settle match.'}
                  </p>
                </div>
                <div className="ms-4 shrink-0 flex flex-col items-center justify-center min-w-[72px] h-[72px] rounded-2xl bg-emerald-600 text-white shadow-md">
                  <span className="text-2xl font-black">{pendingEurPayoutCount}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    {isFa ? 'پرونده' : 'CASES'}
                  </span>
                </div>
              </button>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white border border-[#dfe6ef] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-600">
                  {isFa ? 'فیلتر وضعیت:' : 'Status Filter:'}
                </span>

                {/* Preset default button */}
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('ACCEPTED,IRR_CONFIRMED');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    statusFilter === 'ACCEPTED,IRR_CONFIRMED'
                      ? 'bg-[#071B3D] text-white border-[#071B3D]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isFa ? '⚡ فقط منتظر اقدام من (پیش‌فرض)' : '⚡ Actionable for Staff (Default)'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('ALL');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    statusFilter === 'ALL'
                      ? 'bg-[#071B3D] text-white border-[#071B3D]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isFa ? 'همه وضعیت‌ها' : 'All Statuses'}
                </button>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#2F6FED]"
                >
                  <option value="ACCEPTED,IRR_CONFIRMED">
                    {isFa ? 'منتظر اقدام (ACCEPTED + IRR_CONFIRMED)' : 'Actionable (ACCEPTED + IRR_CONFIRMED)'}
                  </option>
                  <option value="ALL">{isFa ? 'تمامی وضعیت‌ها' : 'All Statuses'}</option>
                  <option value="ACCEPTED">{isFa ? 'ACCEPTED (منتظر دریافت یورو)' : 'ACCEPTED (Awaiting EUR)'}</option>
                  <option value="EUR_RECEIVED">{isFa ? 'EUR_RECEIVED (منتظر فیش ریال)' : 'EUR_RECEIVED (Awaiting IRR)'}</option>
                  <option value="IRR_PROOF_SUBMITTED">{isFa ? 'IRR_PROOF_SUBMITTED (فیش ثبت شد)' : 'IRR_PROOF_SUBMITTED'}</option>
                  <option value="IRR_CONFIRMED">{isFa ? 'IRR_CONFIRMED (منتظر پرداخت یورو)' : 'IRR_CONFIRMED (Awaiting Payout)'}</option>
                  <option value="SETTLED">{isFa ? 'SETTLED (تسویه‌شده)' : 'SETTLED'}</option>
                  <option value="CANCELLED">{isFa ? 'CANCELLED (لغو شده)' : 'CANCELLED'}</option>
                  <option value="EXPIRED">{isFa ? 'EXPIRED (منقضی)' : 'EXPIRED'}</option>
                  <option value="DISPUTED">{isFa ? 'DISPUTED (اختلاف)' : 'DISPUTED'}</option>
                  <option value="REFUNDED">{isFa ? 'REFUNDED (مسترد شده)' : 'REFUNDED'}</option>
                </select>
              </div>

              {/* Search input */}
              <div className="relative min-w-[260px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isFa ? 'جستجو بر اساس نام طرفین یا شناسه...' : 'Search by name or match ID...'}
                  className="w-full ps-9 pe-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#2F6FED]"
                />
                <div className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={14} />
                </div>
              </div>
            </div>

            {/* Error Message if fetch failed */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2 rtl:space-x-reverse">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Matches Table / States */}
            <div className="bg-white border border-[#dfe6ef] rounded-3xl shadow-xs overflow-hidden">
              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {isFa ? 'در حال دریافت معاملات تبادل ارز...' : 'Loading exchange matches...'}
                  </p>
                </div>
              ) : displayedMatches.length === 0 ? (
                /* Empty State */
                <div className="py-20 px-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                    <Landmark size={28} />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {isFa ? 'هنوز هیچ معامله‌ای ثبت نشده است.' : 'No exchange matches found yet.'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    {isFa
                      ? statusFilter === 'ACCEPTED,IRR_CONFIRMED'
                        ? 'در حال حاضر هیچ معامله‌ای در وضعیت‌های منتظر اقدام کارمند (دریافت یا پرداخت یورو) وجود ندارد.'
                        : 'معامله‌ای منطبق با فیلتر انتخاب‌شده یافت نشد.'
                      : 'There are currently no exchange matches pending staff counter actions.'}
                  </p>
                  {statusFilter !== 'ALL' && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStatusFilter('ALL');
                          setCurrentPage(1);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                      >
                        {isFa ? 'مشاهده تمام معاملات' : 'View all matches'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Matches Table */
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                        <th className="py-3.5 px-4 text-start">{isFa ? 'جهت معامله' : 'Direction'}</th>
                        <th className="py-3.5 px-4 text-start">{isFa ? 'مبلغ یورو' : 'EUR Amount'}</th>
                        <th className="py-3.5 px-4 text-start">{isFa ? 'نرخ' : 'Rate'}</th>
                        <th className="py-3.5 px-4 text-start">{isFa ? 'مبلغ ریال' : 'IRR Amount'}</th>
                        <th className="py-3.5 px-4 text-start">{isFa ? 'وضعیت' : 'Status'}</th>
                        <th className="py-3.5 px-4 text-start">{isFa ? 'طرفین یورو' : 'EUR Parties'}</th>
                        <th className="py-3.5 px-4 text-start">{isFa ? 'تاریخ ایجاد' : 'Created At'}</th>
                        <th className="py-3.5 px-4 text-start">{isFa ? 'مهلت فعال' : 'Active Deadline'}</th>
                        <th className="py-3.5 px-4 text-center">{isFa ? 'عملیات' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {displayedMatches.map((m) => {
                        const statusInfo = getStatusBadge(m.status);
                        const deadline = getActiveDeadline(m);
                        const directionLabel =
                          m.request?.direction === 'EUR_TO_IRR'
                            ? (isFa ? 'یورو به ریال' : 'EUR → IRR')
                            : (isFa ? 'ریال به یورو' : 'IRR → EUR');

                        const createdAtFormatted = new Intl.DateTimeFormat(isFa ? 'fa-IR' : 'en-US', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        }).format(new Date(m.created_at));

                        return (
                          <tr
                            key={m.id}
                            className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                            onClick={() => router.push(`/${currentLang}/admin/exchange/${m.id}`)}
                          >
                            {/* Direction */}
                            <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                              <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                                {directionLabel}
                              </span>
                            </td>

                            {/* EUR Amount */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="font-extrabold text-slate-900 text-sm">
                                {m.amount_eur.toLocaleString('en-US')}
                              </span>
                              <span className="text-[10px] text-slate-500 ms-1 font-semibold">EUR</span>
                              {m.fee_eur > 0 && (
                                <span className="block text-[10px] text-amber-700 font-medium">
                                  +{m.fee_eur} EUR {isFa ? 'کارمزد' : 'fee'}
                                </span>
                              )}
                            </td>

                            {/* Rate */}
                            <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-600">
                              {m.rate_snapshot ? m.rate_snapshot.toLocaleString('en-US') : '—'}
                            </td>

                            {/* IRR Amount */}
                            <td className="py-4 px-4 whitespace-nowrap font-bold text-slate-900">
                              <span>{m.amount_irr ? m.amount_irr.toLocaleString('en-US') : '—'}</span>
                              <span className="text-[10px] text-slate-500 ms-1 font-semibold">IRR</span>
                            </td>

                            {/* Status Badge */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-[11px] border ${statusInfo.badgeClass}`}
                              >
                                {statusInfo.label}
                              </span>
                            </td>

                            {/* EUR Parties (Payer -> Receiver) */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="text-[11px] leading-tight space-y-0.5">
                                <div>
                                  <span className="text-slate-400 text-[10px]">{isFa ? 'پرداخت:' : 'From:'} </span>
                                  <span className="font-semibold text-slate-800">
                                    {m.eur_payer?.full_name || (isFa ? 'ناشناس' : 'Unknown')}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400 text-[10px]">{isFa ? 'دریافت:' : 'To:'} </span>
                                  <span className="font-semibold text-slate-800">
                                    {m.eur_receiver?.full_name || (isFa ? 'ناشناس' : 'Unknown')}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Created At */}
                            <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                              {createdAtFormatted}
                            </td>

                            {/* Active Deadline */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              {deadline.hasDeadline ? (
                                <div
                                  className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
                                    deadline.tone === 'red'
                                      ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
                                      : deadline.tone === 'amber'
                                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                                      : 'bg-slate-50 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  <Clock size={12} />
                                  <span>{deadline.text}</span>
                                  {deadline.isExpired && (
                                    <span className="text-[10px] font-black ms-0.5">
                                      ({isFa ? 'گذشته' : 'Overdue'})
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>

                            {/* Action / View Dossier */}
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              <Link
                                href={`/admin/exchange/${m.id}`}
                                className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 rounded-xl bg-[#2F6FED] hover:bg-[#2558c4] text-white text-xs font-bold transition-all shadow-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>{isFa ? 'بررسی پرونده' : 'View Dossier'}</span>
                                {isFa ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination bar */}
              {pagination.totalPages > 1 && (
                <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/60">
                  <div className="text-xs text-slate-500 font-medium">
                    {isFa
                      ? `صفحه ${pagination.page} از ${pagination.totalPages} (مجموع ${pagination.total} معامله)`
                      : `Page ${pagination.page} of ${pagination.totalPages} (${pagination.total} total matches)`}
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button
                      type="button"
                      disabled={currentPage <= 1 || loading}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      {isFa ? 'قبلی' : 'Previous'}
                    </button>
                    <button
                      type="button"
                      disabled={currentPage >= pagination.totalPages || loading}
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      {isFa ? 'بعدی' : 'Next'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
