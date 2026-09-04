'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  FileCheck2,
  Users,
  Search,
  LogOut,
  Mail,
  PhoneCall,
  Clock,
  ArrowLeft,
  ArrowRight,
  LockKeyhole
} from '@/components/Icons';

interface AdminLeadsPageProps {
  params: { lang: Language };
}

interface LeadRecord {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  source: string;
  status: string;
  site_goal: string | null;
  unified_category: string | null;
  verified_at: string | null;
  verified_by: string | null;
  invited_at: string | null;
  invited_by: string | null;
  created_at: string;
  raw_meta: any;
}

export default function AdminLeadsPage({ params }: AdminLeadsPageProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // 1. Check user session
        if (!supabase) {
          router.replace(`/${currentLang}/admin/login`);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace(`/${currentLang}/admin/login`);
          return;
        }

        setAdminUser(user);

        // 2. Fetch leads via server API
        const res = await fetch('/api/admin/leads');
        if (res.status === 401 || res.status === 403) {
          router.replace(`/${currentLang}/admin/login?error=unauthorized`);
          return;
        }

        const json = await res.json();
        if (isMounted) {
          if (json.leads) {
            setLeads(json.leads);
          } else {
            setFetchError(json.error || 'Failed to load leads');
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setFetchError('Connection error loading admin leads.');
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [currentLang, router]);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace(`/${currentLang}/admin/login`);
  };

  // Filter leads
  const filteredLeads = leads.filter((item) => {
    const matchesSearch =
      !searchTerm.trim() ||
      item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // KPI calculations
  const totalLeads = leads.length;
  const verifiedCount = leads.filter((l) => l.verified_at).length;
  const invitedCount = leads.filter((l) => l.invited_at).length;
  const pendingReviewCount = leads.filter((l) => !l.verified_at).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return { label: isFa ? 'جدید' : 'New', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'contacted':
        return { label: isFa ? 'در حال مکاتبه' : 'Contacted', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'qualified':
        return { label: isFa ? 'واجد شرایط' : 'Qualified', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'closed':
      case 'archived':
        return { label: isFa ? 'بسته شده' : 'Closed', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#f7f9fc]">
        <div className="w-10 h-10 border-4 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs sm:text-sm text-[#526174] font-medium">
          {isFa ? 'در حال بارگذاری پنل مدیریت DORVIA...' : 'Loading DORVIA admin panel...'}
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
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse">
                <LockKeyhole size={13} />
                <span>{isFa ? 'پنل مدیریت و ارزیابی لیدها' : 'Lead Management Console'}</span>
              </span>
              <span className="text-xs text-slate-300">
                {adminUser?.email}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isFa ? 'مدیریت پرونده‌های متقاضیان' : 'Applicant Case Files'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isFa
                ? 'فهرست متقاضیان، بررسی نتایج ارزیابی اولیه، تایید پرونده‌ها و صدور دعوت‌نامه ورود به پورتال.'
                : 'Review lead evaluations, verify eligibility, and dispatch secure portal invitations.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
            >
              <LogOut size={15} />
              <span>{isFa ? 'خروج از پنل' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>{isFa ? 'کل لیدها' : 'Total Leads'}</span>
              <Users size={18} className="text-[#2F6FED]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#142033]">{totalLeads}</div>
          </div>

          <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>{isFa ? 'تأییدشده' : 'Verified'}</span>
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{verifiedCount}</div>
          </div>

          <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>{isFa ? 'دعوت‌شده به پورتال' : 'Portal Invited'}</span>
              <ShieldCheck size={18} className="text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700">{invitedCount}</div>
          </div>

          <div className="bg-white border border-[#dfe6ef] rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>{isFa ? 'در انتظار بررسی' : 'Pending Review'}</span>
              <Clock size={18} className="text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">{pendingReviewCount}</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#dfe6ef] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isFa ? 'جستجو بر اساس نام، ایمیل یا شماره تماس...' : 'Search by name, email, or phone...'}
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[#dfe6ef] text-xs sm:text-sm text-[#142033] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F6FED] transition-all"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            {[
              { key: 'all', label: isFa ? 'همه' : 'All' },
              { key: 'new', label: isFa ? 'جدید' : 'New' },
              { key: 'contacted', label: isFa ? 'مکاتبه' : 'Contacted' },
              { key: 'qualified', label: isFa ? 'واجد شرایط' : 'Qualified' },
              { key: 'closed', label: isFa ? 'بسته' : 'Closed' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === tab.key
                    ? 'bg-[#2F6FED] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Leads Table Container */}
        <div className="bg-white border border-[#dfe6ef] rounded-3xl shadow-sm overflow-hidden">
          {fetchError && (
            <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs">
              {fetchError}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead className="bg-[#f8fafc] border-b border-[#dfe6ef] text-[#526174] font-bold">
                <tr>
                  <th className="py-4 px-4 sm:px-6 text-start">{isFa ? 'نام متقاضی' : 'Applicant'}</th>
                  <th className="py-4 px-4 text-start">{isFa ? 'تماس' : 'Contact'}</th>
                  <th className="py-4 px-4 text-start">{isFa ? 'منبع' : 'Source'}</th>
                  <th className="py-4 px-4 text-start">{isFa ? 'وضعیت' : 'Status'}</th>
                  <th className="py-4 px-4 text-center">{isFa ? 'تأیید' : 'Verified'}</th>
                  <th className="py-4 px-4 text-center">{isFa ? 'دعوت' : 'Invited'}</th>
                  <th className="py-4 px-4 text-start">{isFa ? 'تاریخ ثبت' : 'Date'}</th>
                  <th className="py-4 px-4 sm:px-6 text-end">{isFa ? 'عملیات' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfe6ef]/60">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 text-xs sm:text-sm">
                      {isFa ? 'هیچ رکوردی با این مشخصات یافت نشد.' : 'No matching leads found.'}
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((item) => {
                    const statusBadge = getStatusBadge(item.status);
                    const formattedDate = new Date(item.created_at).toLocaleDateString(
                      isFa ? 'fa-IR' : 'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    );

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                        onClick={() => router.push(`/${currentLang}/admin/leads/${item.id}`)}
                      >
                        {/* Name & ID */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="font-extrabold text-[#142033] group-hover:text-[#2F6FED] transition-colors">
                            {item.full_name}
                          </div>
                          <div className="font-mono text-[11px] text-slate-400">
                            {item.id.substring(0, 8)}
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-4 px-4 text-xs text-slate-600 space-y-0.5">
                          {item.email ? (
                            <div className="font-mono" dir="ltr">{item.email}</div>
                          ) : (
                            <span className="text-slate-400 italic">{isFa ? 'بدون ایمیل' : 'No email'}</span>
                          )}
                          {item.phone && (
                            <div className="font-mono text-slate-500" dir="ltr">{item.phone}</div>
                          )}
                        </td>

                        {/* Source */}
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-medium">
                            {item.source}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadge.bg}`}>
                            {statusBadge.label}
                          </span>
                        </td>

                        {/* Verified Badge */}
                        <td className="py-4 px-4 text-center">
                          {item.verified_at ? (
                            <span className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle size={12} />
                              <span>{isFa ? 'تأییدشده' : 'Verified'}</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
                              {isFa ? 'بررسی نشده' : 'Pending'}
                            </span>
                          )}
                        </td>

                        {/* Invited Badge */}
                        <td className="py-4 px-4 text-center">
                          {item.invited_at ? (
                            <span className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              <ShieldCheck size={12} />
                              <span>{isFa ? 'دعوت‌شده' : 'Invited'}</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-400">
                              {isFa ? 'ارسال‌نشده' : 'Uninvited'}
                            </span>
                          )}
                        </td>

                        {/* Created Date */}
                        <td className="py-4 px-4 text-slate-500 text-xs">
                          {formattedDate}
                        </td>

                        {/* Action Link */}
                        <td className="py-4 px-4 sm:px-6 text-end">
                          <span className="inline-flex items-center space-x-1 rtl:space-x-reverse text-xs font-bold text-[#2F6FED] hover:underline">
                            <span>{isFa ? 'مشاهده پرونده' : 'View Case'}</span>
                            <span>{isFa ? '←' : '→'}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
