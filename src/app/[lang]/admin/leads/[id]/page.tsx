'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  FileCheck2,
  Send,
  User,
  Calendar,
  PhoneCall,
  Mail,
  ArrowLeft,
  ArrowRight,
  Clock,
  LogOut,
  LockKeyhole,
  MessageSquare,
  Sparkles
} from '@/components/Icons';

interface LeadDetailPageProps {
  params: { lang: Language; id: string };
}

export default function LeadDetailPage({ params }: LeadDetailPageProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();
  const leadId = params.id;

  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsgText, setNewMsgText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadLeadData = async () => {
    try {
      if (!supabase) {
        router.replace(`/${currentLang}/admin/login`);
        return;
      }

      // Fetch lead detail
      const res = await fetch(`/api/admin/leads/${leadId}`);
      if (res.status === 401 || res.status === 403) {
        router.replace(`/${currentLang}/admin/login?error=unauthorized`);
        return;
      }

      const json = await res.json();
      if (json.lead) {
        setLead(json.lead);
      } else {
        setActionError(json.error || 'Failed to load lead.');
      }

      // Fetch messages
      const msgRes = await fetch(`/api/admin/leads/${leadId}/messages`);
      const msgJson = await msgRes.json();
      if (msgJson.messages) {
        setMessages(msgJson.messages);
      }

      setLoading(false);
    } catch (err) {
      setActionError('Error connecting to admin services.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeadData();
  }, [leadId, currentLang]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Verify Lead Handler
  const handleVerify = async () => {
    if (verifying) return;
    setVerifying(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/verify`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.error || 'Failed to verify lead.');
      } else {
        setActionSuccess(isFa ? 'پرونده لید با موفقیت تأیید شد.' : 'Lead verified successfully.');
        await loadLeadData();
      }
    } catch (err) {
      setActionError('Network error during verification.');
    } finally {
      setVerifying(false);
    }
  };

  // Invite Lead Handler
  const handleInvite = async () => {
    if (inviting) return;
    setInviting(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/invite`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.error || 'Failed to send invite.');
      } else {
        setActionSuccess(
          isFa
            ? 'دعوت‌نامه پورتال متقاضی با موفقیت ارسال شد.'
            : 'Portal invitation dispatched successfully.'
        );
        await loadLeadData();
      }
    } catch (err) {
      setActionError('Network error dispatching invitation.');
    } finally {
      setInviting(false);
    }
  };

  // Send Message Handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim() || sendingMsg) return;

    setSendingMsg(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMsgText.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setActionError(data.error || 'Failed to send message.');
      } else {
        setMessages((prev) => [...prev, data.message]);
        setNewMsgText('');
      }
    } catch (err) {
      setActionError('Error sending message.');
    } finally {
      setSendingMsg(false);
    }
  };

  const getPathwayTitle = (goal: string | null) => {
    switch (goal) {
      case 'study':
        return isFa ? 'تحصیل و بورسیه دانشگاهی' : 'Higher Education & Study';
      case 'work':
        return isFa ? 'اشتغال و ویزای کار' : 'Employment & Work Visa';
      case 'company':
        return isFa ? 'ثبت شرکت و کسب‌وکار' : 'Company Formation';
      case 'investment':
        return isFa ? 'سرمایه‌گذاری در رومانی' : 'Investment in Romania';
      case 'family':
        return isFa ? 'پیوست خانواده' : 'Family Reunification';
      case 'living':
        return isFa ? 'اقامت و استقرار' : 'Settlement & Living';
      default:
        return goal || (isFa ? 'نامشخص' : 'Unspecified');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#f7f9fc]">
        <div className="w-10 h-10 border-4 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs sm:text-sm text-[#526174] font-medium">
          {isFa ? 'در حال بارگذاری جزئیات پرونده...' : 'Loading case details...'}
        </p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-[70vh] max-w-lg mx-auto px-4 py-16 text-center space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
        <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-[#142033]">
            {isFa ? 'پرونده یافت نشد' : 'Case Not Found'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526174]">
            {actionError || (isFa ? 'شناسه لید مورد نظر در سیستم ثبت نشده است.' : 'The requested lead ID does not exist.')}
          </p>
        </div>
        <Link
          href="/admin/leads"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#2F6FED] text-white text-xs font-bold shadow-sm"
        >
          {isFa ? '← بازگشت به لیست لیدها' : '← Back to Leads List'}
        </Link>
      </div>
    );
  }

  const rawMeta = lead.raw_meta as any;
  const pathfinderScore = rawMeta?.profileScore ?? rawMeta?.score ?? null;
  const pathfinderTemp = rawMeta?.leadTemperature ?? null;
  const isVerified = Boolean(lead.verified_at);
  const isInvited = Boolean(lead.invited_at);

  return (
    <div className="min-h-screen bg-[#f7f9fc] py-8 sm:py-10" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
        
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admin/leads"
            className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-[#2F6FED] hover:underline"
          >
            <span>{isFa ? '← بازگشت به فهرست لیدها' : '← Back to Leads List'}</span>
          </Link>
          <div className="text-xs text-slate-500 font-mono">
            ID: {lead.id}
          </div>
        </div>

        {/* Lead Case Header Banner */}
        <div className="bg-[#071B3D] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#0b2b55]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold">
                {lead.status.toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-bold">
                {getPathwayTitle(lead.site_goal || lead.unified_category)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lead.full_name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              {lead.email && <span className="font-mono">{lead.email}</span>}
              {lead.phone && <span className="font-mono">{lead.phone}</span>}
              <span>• {new Date(lead.created_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US')}</span>
            </div>
          </div>

          {/* Quick Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {isVerified ? (
              <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <CheckCircle size={14} />
                <span>{isFa ? 'پرونده تاییدشده' : 'Verified Lead'}</span>
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {isFa ? 'در انتظار بررسی اولیه' : 'Pending Verification'}
              </span>
            )}

            {isInvited ? (
              <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <ShieldCheck size={14} />
                <span>{isFa ? 'دعوت‌شده به پورتال' : 'Portal Invited'}</span>
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-700/40 text-slate-400 border border-slate-600/30">
                {isFa ? 'هنوز دعوت نشده' : 'Not Invited'}
              </span>
            )}
          </div>
        </div>

        {/* Global Action Notifications */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2 rtl:space-x-reverse animate-fadeIn">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center space-x-2 rtl:space-x-reverse animate-fadeIn">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* TWO-STEP ACTION GATE CONTROL BAR */}
        <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-[#142033] uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse">
            <LockKeyhole size={16} className="text-[#2F6FED]" />
            <span>{isFa ? 'گیت ارزیابی و دسترسی متقاضی (تأیید ← دعوت پورتال)' : 'Two-Step Gate: Verify & Invite'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Step 1: Verify Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#142033]">
                    {isFa ? 'مرحله اول: تأیید واجد شرایط بودن پرونده' : 'Step 1: Case Verification'}
                  </span>
                  {isVerified && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ {isFa ? 'تأیید شد' : 'Verified'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#526174] leading-relaxed">
                  {isVerified
                    ? (isFa
                        ? `تأیید شده در تاریخ ${new Date(lead.verified_at).toLocaleDateString('fa-IR')} ${lead.verifier?.full_name ? `توسط ${lead.verifier.full_name}` : ''}`
                        : `Verified on ${new Date(lead.verified_at).toLocaleDateString()} ${lead.verifier?.full_name ? `by ${lead.verifier.full_name}` : ''}`)
                    : (isFa
                        ? 'بررسی صلاحیت اولیه متقاضی بر اساس پاسخ‌ها و مدارک.'
                        : 'Review lead qualifications before unlocking portal invite access.')}
                </p>
              </div>

              {!isVerified && (
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse disabled:opacity-60 cursor-pointer"
                >
                  <CheckCircle size={14} />
                  <span>{verifying ? (isFa ? 'در حال تایید...' : 'Verifying...') : (isFa ? 'تأیید پرونده لید' : 'Verify Lead Case')}</span>
                </button>
              )}
            </div>

            {/* Step 2: Invite Box */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
              !isVerified
                ? 'bg-slate-100/60 border-slate-200 opacity-80'
                : 'bg-blue-50/40 border-blue-200'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#142033]">
                    {isFa ? 'مرحله دوم: ارسال دعوت‌نامه ورود به پورتال' : 'Step 2: Dispatch Portal Invite'}
                  </span>
                  {isInvited && (
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      ✓ {isFa ? 'دعوت شد' : 'Invited'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#526174] leading-relaxed">
                  {!isVerified
                    ? (isFa
                        ? '⚠️ دکمه دعوت غیرفعال است: ابتدا باید پرونده در مرحله ۱ تأیید شود.'
                        : '⚠️ Locked: You must complete Step 1 (Verify) before an invite can be dispatched.')
                    : isInvited
                      ? (isFa
                          ? `دعوت ارسال شد در تاریخ ${new Date(lead.invited_at).toLocaleDateString('fa-IR')} ${lead.inviter?.full_name ? `توسط ${lead.inviter.full_name}` : ''}`
                          : `Invited on ${new Date(lead.invited_at).toLocaleDateString()} ${lead.inviter?.full_name ? `by ${lead.inviter.full_name}` : ''}`)
                      : (isFa
                          ? 'ارسال ایمیل حاوی Magic Link اختصاصی جهت ورود به پورتال.'
                          : 'Send authenticated passwordless magic link to applicant.')}
                </p>
              </div>

              <button
                onClick={handleInvite}
                disabled={!isVerified || inviting}
                className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse ${
                  !isVerified
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#2F6FED] hover:bg-blue-700 text-white cursor-pointer'
                }`}
              >
                <ShieldCheck size={14} />
                <span>
                  {inviting
                    ? (isFa ? 'در حال ارسال دعوت‌نامه...' : 'Dispatching...')
                    : isInvited
                      ? (isFa ? 'ارسال مجدد دعوت‌نامه پورتال' : 'Re-send Portal Invite')
                      : (isFa ? 'ارسال دعوت‌نامه ورود به پورتال' : 'Send Portal Invitation')}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* TWO-COLUMN DETAILS & MESSAGING GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (5 Cols): Lead Information & PathFinder Scores */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Case Details Card */}
            <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-extrabold text-[#142033] border-b border-slate-100 pb-3 flex items-center space-x-2 rtl:space-x-reverse">
                <FileCheck2 size={16} className="text-[#2F6FED]" />
                <span>{isFa ? 'اطلاعات و امتیاز ارزیابی اولیه' : 'Evaluation Assessment Details'}</span>
              </h2>

              {/* PathFinder Score / Temp */}
              {pathfinderScore !== null && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {isFa ? 'امتیاز شانس پذیرش' : 'Profile Score'}
                    </span>
                    <div className="text-xl font-extrabold text-[#2F6FED]">
                      {pathfinderScore} / 100
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {isFa ? 'درجه اولویت پرونده' : 'Lead Readiness'}
                    </span>
                    <div className="text-base font-extrabold text-emerald-700 capitalize">
                      {pathfinderTemp || (isFa ? 'عادی' : 'Standard')}
                    </div>
                  </div>
                </div>
              )}

              {/* Applicant Fields */}
              <div className="space-y-3 text-xs text-[#526174]">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">{isFa ? 'نام و نام خانوادگی' : 'Name'}</span>
                  <span className="font-bold text-[#142033]">{lead.full_name}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">{isFa ? 'ایمیل' : 'Email'}</span>
                  <span className="font-mono text-slate-800" dir="ltr">{lead.email || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">{isFa ? 'شماره تماس' : 'Phone'}</span>
                  <span className="font-mono text-slate-800" dir="ltr">{lead.phone || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">{isFa ? 'منبع جذب' : 'Source'}</span>
                  <span className="font-mono text-slate-800">{lead.source}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">{isFa ? 'کانال ارجاع' : 'Channel Ref'}</span>
                  <span className="font-mono text-slate-800">{lead.channel_ref || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="font-semibold text-slate-600">{isFa ? 'قوانین و رضایت حریم خصوصی' : 'Consent'}</span>
                  <span className="font-bold text-emerald-700">{lead.consent_terms ? '✓ تأییدشده' : '—'}</span>
                </div>
              </div>

              {/* User evaluation note */}
              {lead.message && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#526174] space-y-1">
                  <span className="font-bold text-[#142033] block">
                    {isFa ? 'پیام و توضیحات اولیه متقاضی:' : 'Applicant submission message:'}
                  </span>
                  <p className="leading-relaxed italic">{lead.message}</p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN (7 Cols): Communication & Case Notes Thread */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#dfe6ef] rounded-3xl shadow-sm flex flex-col h-[640px] overflow-hidden">
              
              {/* Chat Thread Header */}
              <div className="p-5 border-b border-[#dfe6ef] bg-[#f8fafc] flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-full bg-[#071B3D] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#142033] text-sm sm:text-base">
                      {isFa ? 'مکاتبه با متقاضی' : 'Applicant Communication Thread'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isFa
                        ? 'پیام‌های ارسالی از این بخش در پورتال لید برای متقاضی نمایش داده می‌شود.'
                        : 'Messages sent here are visible in the applicant case portal.'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-slate-500">
                  {messages.length} {isFa ? 'پیام' : 'msgs'}
                </span>
              </div>

              {/* Chat Message List Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xl">
                      💬
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#142033]">
                      {isFa ? 'هنوز پیامی در این پرونده ثبت نشده است' : 'No messages in this case yet'}
                    </h4>
                    <p className="text-[11px] text-[#526174] max-w-sm">
                      {isFa
                        ? 'می‌توانید اولین پیام مشاوره‌ای یا درخواست مدارک را از کادر زیر ارسال کنید.'
                        : 'Send case inquiries or requested documents instructions below.'}
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAdmin = msg.sender_role === 'admin';
                    const timeString = new Date(msg.created_at).toLocaleTimeString(isFa ? 'fa-IR' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                          <span className="font-semibold text-slate-600">
                            {isAdmin
                              ? (msg.sender_ref || (isFa ? 'شما (ادمین)' : 'You (Admin)'))
                              : (lead.full_name || (isFa ? 'متقاضی' : 'Applicant'))}
                          </span>
                          <span>•</span>
                          <span>{timeString}</span>
                        </div>

                        <div
                          className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs whitespace-pre-wrap ${
                            isAdmin
                              ? 'bg-[#071B3D] text-white rounded-br-xs rtl:rounded-bl-xs rtl:rounded-br-2xl'
                              : 'bg-white text-[#142033] border border-[#dfe6ef] rounded-bl-xs rtl:rounded-br-xs rtl:rounded-bl-2xl'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input & Compose Bar */}
              <div className="p-3 sm:p-4 bg-white border-t border-[#dfe6ef]">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                  <textarea
                    rows={2}
                    value={newMsgText}
                    onChange={(e) => setNewMsgText(e.target.value)}
                    placeholder={isFa ? 'پاسخ یا راهنمایی خود به متقاضی را بنویسید...' : 'Write message to applicant...'}
                    className="flex-1 p-3 rounded-2xl border border-[#dfe6ef] text-xs sm:text-sm text-[#142033] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F6FED] transition-all resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !newMsgText.trim()}
                    className="p-3.5 rounded-2xl bg-[#071B3D] hover:bg-blue-900 active:bg-blue-950 text-white font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
                    title={isFa ? 'ارسال پاسخ' : 'Send message'}
                  >
                    <Send size={18} />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 px-1">
                  <span>{isFa ? 'ارسال با کلید Enter' : 'Press Enter to send'}</span>
                  <span>🔒 {isFa ? 'ارسال به عنوان مشاور رسمی DORVIA' : 'Signed as DORVIA Staff'}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
