'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  ShieldCheck,
  CheckCircle,
  FileCheck2,
  MessageSquare,
  Send,
  LogOut,
  User,
  Calendar,
  Sparkles,
  PhoneCall,
  Mail,
  ArrowLeft,
  ArrowRight,
  Clock,
  Building2,
  GraduationCap,
  BriefcaseBusiness
} from '@/components/Icons';

interface PortalDashboardProps {
  params: { lang: Language };
}

interface LeadProfile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  site_goal: string | null;
  unified_category: string | null;
  status: string;
  message: string | null;
  created_at: string;
  raw_meta: any;
}

interface LeadMessage {
  id: string;
  lead_id: string;
  sender_role: string;
  sender_ref: string | null;
  text: string;
  created_at: string;
}

export default function PortalDashboardPage({ params }: PortalDashboardProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState<LeadProfile | null>(null);
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Initial Load: Check Auth & Fetch Lead + Messages via RLS
  useEffect(() => {
    let isMounted = true;

    async function loadPortalData() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { user }, error: authErr } = await supabase.auth.getUser();

      if (authErr || !user) {
        router.replace(`/${currentLang}/portal/login`);
        return;
      }

      // Fetch own lead record via RLS policy `leads_select_own`
      const { data: leadData, error: leadErr } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!isMounted) return;

      if (leadErr || !leadData) {
        // Not linked or not found
        setLoading(false);
        return;
      }

      setLead(leadData as LeadProfile);

      // Fetch messages via RLS policy `lead_messages_select_own`
      const { data: msgData, error: msgErr } = await supabase
        .from('lead_messages')
        .select('*')
        .eq('lead_id', leadData.id)
        .order('created_at', { ascending: true });

      if (!isMounted) return;

      if (!msgErr && msgData) {
        setMessages(msgData as LeadMessage[]);
      }

      setLoading(false);
    }

    loadPortalData();

    return () => {
      isMounted = false;
    };
  }, [currentLang, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 2. Send Message Handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || sending) return;

    setSending(true);
    setSendError(null);

    try {
      const res = await fetch('/api/portal/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newMessageText.trim() }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setSendError(result.error || (isFa ? 'خطا در ارسال پیام' : 'Failed to send message'));
      } else if (result.message) {
        setMessages((prev) => [...prev, result.message]);
        setNewMessageText('');
      }
    } catch (err) {
      setSendError(isFa ? 'خطای شبکه در ارتباط با سرور' : 'Network error while sending message');
    } finally {
      setSending(false);
    }
  };

  // 3. Sign Out Handler
  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace(`/${currentLang}/portal/login`);
  };

  const getPathwayTitle = (goal: string | null) => {
    switch (goal) {
      case 'study':
        return isFa ? 'تحصیل و بورسیه دانشگاهی' : 'Higher Education & Study';
      case 'work':
        return isFa ? 'اشتغال و ویزای کار' : 'Employment & Work Visa';
      case 'company':
        return isFa ? 'ثبت شرکت و راه‌اندازی کسب‌وکار' : 'Company Formation & Business';
      case 'investment':
        return isFa ? 'سرمایه‌گذاری در رومانی' : 'Investment in Romania';
      case 'family':
        return isFa ? 'پیوست خانواده' : 'Family Reunification';
      case 'living':
        return isFa ? 'اقامت و استقرار' : 'Settlement & Living';
      default:
        return goal || (isFa ? 'عمومی' : 'General');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return {
          label: isFa ? 'در انتظار بررسی اولیه' : 'Pending Initial Review',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'contacted':
        return {
          label: isFa ? 'در حال مکاتبه' : 'In Discussion',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'qualified':
        return {
          label: isFa ? 'ارزیابی‌شده و واجد شرایط' : 'Reviewed & Qualified',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'closed':
      case 'archived':
        return {
          label: isFa ? 'تکمیل‌شده' : 'Completed',
          className: 'bg-slate-100 text-slate-700 border-slate-300',
        };
      default:
        return {
          label: status,
          className: 'bg-slate-100 text-slate-700 border-slate-300',
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs sm:text-sm text-[#526174] font-medium">
          {isFa ? 'در حال بارگذاری پورتال پرونده...' : 'Loading case portal...'}
        </p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-[70vh] max-w-lg mx-auto px-4 py-16 text-center space-y-6" dir={isFa ? 'rtl' : 'ltr'}>
        <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-[#142033]">
            {isFa ? 'پرونده‌ای برای این حساب یافت نشد' : 'No Linked Case Found'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526174] leading-relaxed">
            {isFa
              ? 'این حساب کاربری هنوز به پرونده ثبت‌شده‌ای در سامانه DORVIA متصل نشده است. اگر اخیراً فرم ارزیابی را پر کرده‌اید، منتظر تایید تیم بررسی بمانید.'
              : 'This account is not yet linked to an active case file. If you recently completed an evaluation, please allow our team time to verify your profile.'}
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={handleSignOut}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
          >
            {isFa ? 'خروج از حساب' : 'Sign Out'}
          </button>
          <Link
            href="/assessment"
            className="px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            {isFa ? 'تکمیل فرم ارزیابی' : 'Complete Assessment'}
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(lead.status);
  const rawMeta = lead.raw_meta as any;
  const pathfinderScore = rawMeta?.profileScore ?? rawMeta?.score ?? null;
  const pathfinderTemp = rawMeta?.leadTemperature ?? null;

  return (
    <div className="min-h-screen bg-[#f7f9fc] py-8 sm:py-12" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
        
        {/* TOP BAR / PORTAL HEADER */}
        <div className="bg-[#071B3D] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#0b2b55]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse">
                <ShieldCheck size={14} />
                <span>{isFa ? 'پورتال رسمی پرونده' : 'Official Case Portal'}</span>
              </span>
              <span className="text-xs text-slate-300">
                {isFa ? 'شناسه پرونده:' : 'Case ID:'} <span className="font-mono text-slate-200">{lead.id.substring(0, 8)}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isFa ? `سلام، ${lead.full_name}` : `Welcome, ${lead.full_name}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isFa
                ? 'در این بخش می‌توانید خلاصه ارزیابی مهاجرتی خود را مشاهده کرده و مستقیماً با کارشناسان و وکلای پرونده خود در DORVIA گفتگو کنید.'
                : 'Review your case roadmap and communicate directly with your dedicated DORVIA advisory team.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
            >
              <LogOut size={15} />
              <span>{isFa ? 'خروج از پورتال' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* MAIN TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT/PRIMARY COLUMN (5 Cols): Case Status & Assessment Overview */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Case Summary Card */}
            <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-[#dfe6ef] pb-4 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <FileCheck2 size={18} className="text-[#2F6FED]" />
                  <span>{isFa ? 'وضعیت و نتایج ارزیابی' : 'Assessment & Profile'}</span>
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>
              </div>

              {/* Pathway highlight */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200/60 space-y-2">
                <span className="text-[11px] font-bold text-[#2F6FED] uppercase tracking-wider">
                  {isFa ? 'مسیر اصلی پرونده:' : 'Primary Pathway:'}
                </span>
                <div className="text-base font-extrabold text-[#142033]">
                  {getPathwayTitle(lead.site_goal || lead.unified_category)}
                </div>
                {rawMeta?.secondaryRoute && (
                  <div className="text-xs text-[#526174]">
                    <span>{isFa ? 'مسیر جایگزین پیشنهادی: ' : 'Alternative route: '}</span>
                    <span className="font-semibold text-slate-700">{getPathwayTitle(rawMeta.secondaryRoute)}</span>
                  </div>
                )}
              </div>

              {/* Score / Temperature (if PathFinder was taken) */}
              {pathfinderScore !== null && (
                <div className="grid grid-cols-2 gap-3 pt-1">
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

              {/* Applicant Details */}
              <div className="space-y-3 pt-2 text-xs text-[#526174]">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                    <User size={14} className="text-slate-400" />
                    <span>{isFa ? 'نام و نام خانوادگی' : 'Full Name'}</span>
                  </span>
                  <span className="font-bold text-[#142033]">{lead.full_name}</span>
                </div>

                {lead.email && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                      <Mail size={14} className="text-slate-400" />
                      <span>{isFa ? 'ایمیل تاییدشده' : 'Email'}</span>
                    </span>
                    <span className="font-mono text-slate-700" dir="ltr">{lead.email}</span>
                  </div>
                )}

                {lead.phone && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                      <PhoneCall size={14} className="text-slate-400" />
                      <span>{isFa ? 'شماره تماس / واتساپ' : 'Phone / WhatsApp'}</span>
                    </span>
                    <span className="font-mono text-slate-700" dir="ltr">{lead.phone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2">
                  <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{isFa ? 'تاریخ ثبت اولیه' : 'Submission Date'}</span>
                  </span>
                  <span className="font-medium text-slate-700">
                    {new Date(lead.created_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Initial message note */}
              {lead.message && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#526174] space-y-1">
                  <span className="font-bold text-[#142033] block">
                    {isFa ? 'یادداشت اولیه شما در ارزیابی:' : 'Your initial evaluation note:'}
                  </span>
                  <p className="leading-relaxed italic">{lead.message}</p>
                </div>
              )}
            </div>

            {/* Quick Links Card */}
            <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-sm space-y-3 text-xs">
              <span className="font-bold text-[#142033] uppercase tracking-wider block border-b border-slate-100 pb-2">
                {isFa ? 'دسترسی سریع به راهنماها' : 'Helpful Guides'}
              </span>
              <div className="space-y-2 font-medium text-[#2F6FED]">
                <Link href="/needs/cost-of-living" className="hover:underline flex items-center justify-between py-1">
                  <span>💰 {isFa ? 'محاسبه‌گر هزینه زندگی در شهرهای رومانی' : 'Cost of Living Calculator'}</span>
                  <span>←</span>
                </Link>
                <Link href="/universities" className="hover:underline flex items-center justify-between py-1">
                  <span>🏛️ {isFa ? 'فهرست دانشگاه‌های معتبر رومانی' : 'Verified Universities Directory'}</span>
                  <span>←</span>
                </Link>
                <Link href="/needs/first-days-checklist" className="hover:underline flex items-center justify-between py-1">
                  <span>📋 {isFa ? 'چک‌لیست روزهای نخست ورود به رومانی' : 'First-Days Arrival Checklist'}</span>
                  <span>←</span>
                </Link>
              </div>
            </div>

          </div>

          {/* RIGHT/COMMUNICATION COLUMN (7 Cols): Bidirectional Messaging Thread */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#dfe6ef] rounded-3xl shadow-sm flex flex-col h-[680px] overflow-hidden">
              
              {/* Chat Thread Header */}
              <div className="p-5 sm:p-6 border-b border-[#dfe6ef] bg-[#f8fafc] flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#142033] text-sm sm:text-base">
                      {isFa ? 'مکاتبه با کارشناسان DORVIA' : 'Direct Advisory Thread'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isFa
                        ? 'پیام‌های ارسالی مستقیماً توسط تیم مشاورین مهاجرتی بررسی و پاسخ داده می‌شود.'
                        : 'Securely monitored by DORVIA relocation advisors.'}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{isFa ? 'فعال' : 'Active'}</span>
                </span>
              </div>

              {/* Chat Message List Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2F6FED] flex items-center justify-center text-xl">
                      💬
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#142033]">
                        {isFa ? 'هنوز پیامی رد و بدل نشده است' : 'No messages yet'}
                      </h4>
                      <p className="text-xs text-[#526174] max-w-sm leading-relaxed">
                        {isFa
                          ? 'می‌توانید اولین پرسش، مدارک تکمیلی یا ابهامات پرونده خود را در کادر زیر بنویسید تا کارشناس شما در کوتاه‌ترین زمان پاسخ دهد.'
                          : 'Ask questions or provide additional case background below. Our advisors will respond directly.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isUserMsg = msg.sender_role === 'user' || msg.sender_role === 'lead';
                    const timeString = new Date(msg.created_at).toLocaleTimeString(isFa ? 'fa-IR' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isUserMsg ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                          <span className="font-semibold text-slate-600">
                            {isUserMsg ? (isFa ? 'شما' : 'You') : (isFa ? 'تیم پشتیبانی DORVIA' : 'DORVIA Team')}
                          </span>
                          <span>•</span>
                          <span>{timeString}</span>
                        </div>

                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs whitespace-pre-wrap ${
                            isUserMsg
                              ? 'bg-[#2F6FED] text-white rounded-br-xs rtl:rounded-bl-xs rtl:rounded-br-2xl'
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
                {sendError && (
                  <div className="mb-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    {sendError}
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                  <textarea
                    rows={2}
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder={isFa ? 'پیام خود را بنویسید...' : 'Type your message...'}
                    className="flex-1 p-3 rounded-2xl border border-[#dfe6ef] text-xs sm:text-sm text-[#142033] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F6FED] focus:border-transparent transition-all resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessageText.trim()}
                    className="p-3.5 rounded-2xl bg-[#2F6FED] hover:bg-blue-700 active:bg-blue-800 text-white font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
                    title={isFa ? 'ارسال پیام' : 'Send message'}
                  >
                    <Send size={18} />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 px-1">
                  <span>{isFa ? 'ارسال با کلید Enter' : 'Press Enter to send'}</span>
                  <span>🔒 {isFa ? 'مکاتبه رمزنگاری‌شده و محرمانه' : 'Encrypted & Confidential'}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
