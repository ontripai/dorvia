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
  BriefcaseBusiness,
  Download,
  Upload,
  FileText,
  FilePlus,
  Languages,
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

interface LeadDocument {
  id: string;
  lead_id: string;
  document_type: string;
  language: string | null;
  translation_of_document_id: string | null;
  translation_office: string | null;
  is_certified_translation: boolean;
  uploaded_by_role: 'lead' | 'admin';
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  label: string | null;
  created_at: string;
  document_types?: {
    key: string;
    label_fa: string;
    allowed_roles: string[];
  };
}

interface DocumentTypeItem {
  key: string;
  label_fa: string;
}

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PortalDashboardPage({ params }: PortalDashboardProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'overview' | 'documents'>('overview');
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState<LeadProfile | null>(null);
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Documents State
  const [documents, setDocuments] = useState<LeadDocument[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeItem[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [targetParentDoc, setTargetParentDoc] = useState<LeadDocument | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<string>('national_id');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('فارسی');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Initial Load: Authoritative Server API Check (uses secure session cookies)
  useEffect(() => {
    let isMounted = true;

    async function loadPortalData() {
      try {
        const res = await fetch('/api/portal/dashboard');

        if (res.status === 401) {
          router.replace(`/${currentLang}/portal/login?error=unauthorized`);
          return;
        }

        const json = await res.json().catch(() => null);

        if (res.status === 403) {
          // User is authenticated but has no linked lead profile
          if (isMounted) {
            setLead(null);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          if (json?.lead) {
            setLead(json.lead as LeadProfile);
            if (json.messages) {
              setMessages(json.messages as LeadMessage[]);
            }
          } else {
            setLead(null);
          }
          setLoading(false);
        }

        // Optional: Trigger client-side SDK hydration in background without blocking
        if (supabase) {
          await supabase.auth.getUser().catch(() => null);
        }
      } catch (err) {
        console.error('Error loading portal dashboard:', err);
        if (isMounted) {
          setLoading(false);
        }
      }
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

  // 3. Documents Handlers
  const loadDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch('/api/portal/documents');
      const json = await res.json().catch(() => null);
      if (json?.success) {
        setDocuments(json.documents || []);
        if (json.documentTypes?.length) {
          setDocumentTypes(json.documentTypes);
          if (!selectedDocType) {
            setSelectedDocType(json.documentTypes[0].key);
          }
        }
      }
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (lead) {
      loadDocuments();
    }
  }, [lead]);

  const openNewDocumentModal = () => {
    setTargetParentDoc(null);
    setSelectedLanguage('فارسی');
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(null);
    if (documentTypes.length > 0) {
      setSelectedDocType(documentTypes[0].key);
    }
    setShowUploadModal(true);
  };

  const openAddTranslationModal = (parentDoc: LeadDocument) => {
    setTargetParentDoc(parentDoc);
    setSelectedDocType(parentDoc.document_type);
    setSelectedLanguage('رومانیایی');
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(null);
    setShowUploadModal(true);
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedDocType || !lead) {
      setUploadError(isFa ? 'لطفاً ابتدا فایل مورد نظر را انتخاب نمایید.' : 'Please select a file to upload.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setUploadError(isFa ? 'حجم فایل نباید از ۵۰ مگابایت بیشتر باشد.' : 'File size exceeds 50MB limit.');
      return;
    }

    const allowedMime = [
      'image/jpeg', 'image/png', 'image/webp', 'image/heic',
      'application/pdf', 'video/mp4', 'video/quicktime', 'video/webm',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (selectedFile.type && !allowedMime.includes(selectedFile.type.toLowerCase())) {
      setUploadError(isFa ? 'فرمت فایل مجاز نیست (فرمت‌های مجاز: PDF, Word, تصاویر و ویدیو).' : 'Disallowed file format.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const cleanFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${lead.id}/${selectedDocType}/${Date.now()}-${cleanFileName}`;

      if (!supabase) {
        throw new Error('Supabase client unconfigured');
      }

      // 1. Direct browser client upload to private Storage bucket lead-documents
      const { error: storageError } = await supabase.storage
        .from('lead-documents')
        .upload(storagePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (storageError) {
        console.error('Storage upload error:', storageError);
        throw new Error(isFa ? `خطا در آپلود فایل در فضای ابری: ${storageError.message}` : `Storage error: ${storageError.message}`);
      }

      // 2. Register metadata via POST /api/portal/documents
      const res = await fetch('/api/portal/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: selectedDocType,
          language: selectedLanguage.trim() || (targetParentDoc ? 'رومانیایی' : 'فارسی'),
          translation_of_document_id: targetParentDoc?.id || null,
          storage_path: storagePath,
          file_name: selectedFile.name,
          mime_type: selectedFile.type,
          size_bytes: selectedFile.size,
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || (isFa ? 'خطا در ثبت اطلاعات مدرک' : 'Failed to save document metadata'));
      }

      setUploadSuccess(isFa ? 'مدرک با موفقیت بارگذاری و ثبت شد.' : 'Document uploaded and registered successfully.');
      setSelectedFile(null);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(null);
        setTargetParentDoc(null);
      }, 1200);
      await loadDocuments();
    } catch (err: any) {
      setUploadError(err?.message || (isFa ? 'خطایی در ارسال مدرک رخ داد.' : 'An error occurred during upload.'));
    } finally {
      setUploading(false);
    }
  };

  // 4. Sign Out Handler
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

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-3 border-b border-[#dfe6ef] pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'overview'
                ? 'bg-[#2F6FED] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileCheck2 size={16} />
            <span>{isFa ? 'خلاصه پرونده و گفتگو' : 'Case Overview & Chat'}</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'documents'
                ? 'bg-[#2F6FED] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText size={16} />
            <span>{isFa ? 'مدارک من' : 'My Documents'}</span>
            {documents.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'documents' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                {documents.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: OVERVIEW & CHAT */}
        {activeTab === 'overview' && (
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

                {/* Documents Quick Preview Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#2F6FED] flex items-center justify-center">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#142033]">
                        {isFa ? 'مدارک و اسناد پرونده' : 'Case Documents'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isFa ? `${documents.length} مدرک ثبت شده` : `${documents.length} files attached`}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className="text-xs font-bold text-[#2F6FED] hover:underline cursor-pointer"
                  >
                    {isFa ? 'مشاهده مدارک ←' : 'View Docs →'}
                  </button>
                </div>

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
        )}

        {/* TAB 2: MY DOCUMENTS & TRANSLATIONS */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <FileText size={22} className="text-[#2F6FED]" />
                  <span>{isFa ? 'اسناد، مدارک و ترجمه‌های رسمی پرونده' : 'Case Documents & Translations'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#526174] mt-1">
                  {isFa
                    ? 'مدارک هویتی، سوابق تحصیلی، رزومه و ترجمه‌های تاییدشده خود را جهت پیشبرد پرونده بارگذاری کنید.'
                    : 'Upload identity proofs, educational certificates, and certified translations.'}
                </p>
              </div>

              <button
                onClick={openNewDocumentModal}
                className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-3 rounded-2xl bg-[#2F6FED] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Upload size={16} />
                <span>{isFa ? 'آپلود مدرک جدید' : 'Upload New Document'}</span>
              </button>
            </div>

            {/* Documents List */}
            {loadingDocs ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3 bg-white border border-[#dfe6ef] rounded-3xl p-12 text-center">
                <div className="w-8 h-8 border-3 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 font-medium">
                  {isFa ? 'در حال بارگذاری فهرست مدارک...' : 'Loading documents...'}
                </p>
              </div>
            ) : documents.length === 0 ? (
              <div className="bg-white border border-[#dfe6ef] rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2F6FED] flex items-center justify-center mx-auto text-2xl">
                  📁
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#142033]">
                    {isFa ? 'هنوز مدرکی بارگذاری نشده است' : 'No documents uploaded yet'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#526174] max-w-md mx-auto leading-relaxed">
                    {isFa
                      ? 'برای شروع ارزیابی دقیق، اولین مدرک خود (مانند کارت ملی، شناسنامه یا مدرک تحصیلی) را بارگذاری نمایید.'
                      : 'Upload your first document (identity card, passport, or degree) to begin.'}
                  </p>
                </div>
                <button
                  onClick={openNewDocumentModal}
                  className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  <Upload size={15} />
                  <span>{isFa ? 'بارگذاری اولین مدرک' : 'Upload First Document'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. Render Original Documents */}
                {documents
                  .filter((d) => !d.translation_of_document_id)
                  .map((doc) => {
                    const translations = documents.filter((d) => d.translation_of_document_id === doc.id);
                    const typeLabel = doc.document_types?.label_fa || doc.document_type;

                    return (
                      <div
                        key={doc.id}
                        className="bg-white border border-[#dfe6ef] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                      >
                        {/* Original Document Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start space-x-3 rtl:space-x-reverse">
                            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2F6FED] flex items-center justify-center shrink-0">
                              <FileText size={22} />
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-[#2F6FED] border border-blue-200">
                                  {typeLabel}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                  {isFa ? `زبان: ${doc.language || 'فارسی'}` : `Lang: ${doc.language || 'FA'}`}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-500 bg-slate-50">
                                  {formatBytes(doc.size_bytes)}
                                </span>
                              </div>
                              <h4 className="text-sm sm:text-base font-bold text-[#142033] break-all">
                                {doc.file_name}
                              </h4>
                              <div className="text-[11px] text-slate-400">
                                {isFa ? 'تاریخ بارگذاری:' : 'Uploaded:'}{' '}
                                {new Date(doc.created_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            <button
                              onClick={() => openAddTranslationModal(doc)}
                              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-all cursor-pointer"
                              title={isFa ? 'افزودن ترجمه برای این سند' : 'Add Translation'}
                            >
                              <Languages size={14} />
                              <span>{isFa ? 'افزودن ترجمه' : 'Add Translation'}</span>
                            </button>

                            <a
                              href={`/api/portal/documents/${doc.id}/download`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                            >
                              <Download size={14} />
                              <span>{isFa ? 'دانلود سند' : 'Download'}</span>
                            </a>
                          </div>
                        </div>

                        {/* Nested Translations Sub-section */}
                        {translations.length > 0 && (
                          <div className="mr-4 sm:mr-8 rtl:mr-4 rtl:sm:mr-8 ltr:ml-4 ltr:sm:ml-8 pt-3 border-t border-slate-100 space-y-2">
                            <div className="text-[11px] font-bold text-slate-500 flex items-center space-x-1.5 rtl:space-x-reverse mb-2">
                              <Languages size={13} className="text-amber-600" />
                              <span>
                                {isFa
                                  ? `ترجمه‌های ثبت‌شده برای این مدرک (${translations.length}):`
                                  : `Translations for this document (${translations.length}):`}
                              </span>
                            </div>

                            <div className="space-y-2">
                              {translations.map((trans) => (
                                <div
                                  key={trans.id}
                                  className="p-3 sm:p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                  <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                                        {trans.is_certified_translation
                                          ? (isFa ? 'ترجمه رسمی تأییدشده' : 'Certified Translation')
                                          : (isFa ? 'ترجمه' : 'Translation')}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                                        {isFa ? `زبان: ${trans.language || 'رومانیایی'}` : `Lang: ${trans.language || 'RO'}`}
                                      </span>
                                      {trans.translation_office && (
                                        <span className="text-[11px] text-slate-600">
                                          🏛️ {trans.translation_office}
                                        </span>
                                      )}
                                      <span className="text-[10px] font-mono text-slate-400">
                                        {formatBytes(trans.size_bytes)}
                                      </span>
                                    </div>
                                    <div className="text-xs font-bold text-[#142033]">
                                      {trans.file_name}
                                    </div>
                                  </div>

                                  <a
                                    href={`/api/portal/documents/${trans.id}/download`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#142033] text-[11px] font-bold border border-slate-200 shadow-2xs self-end sm:self-center shrink-0"
                                  >
                                    <Download size={12} />
                                    <span>{isFa ? 'دانلود ترجمه' : 'Download'}</span>
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })}

                {/* 2. Orphaned Translations (if any) */}
                {documents.filter((d) => d.translation_of_document_id && !documents.some((p) => p.id === d.translation_of_document_id)).length > 0 && (
                  <div className="pt-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {isFa ? 'سایر ترجمه‌های مستقل' : 'Other Translations'}
                    </h4>
                    {documents
                      .filter((d) => d.translation_of_document_id && !documents.some((p) => p.id === d.translation_of_document_id))
                      .map((orphan) => (
                        <div
                          key={orphan.id}
                          className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-800">{orphan.file_name}</div>
                            <div className="text-[10px] text-slate-400">
                              {orphan.document_types?.label_fa || orphan.document_type} • {orphan.language}
                            </div>
                          </div>
                          <a
                            href={`/api/portal/documents/${orphan.id}/download`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold"
                          >
                            <Download size={13} />
                          </a>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* UPLOAD DOCUMENT MODAL */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
            <div
              className="bg-white border border-[#dfe6ef] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
              dir={isFa ? 'rtl' : 'ltr'}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2F6FED] flex items-center justify-center">
                    {targetParentDoc ? <Languages size={20} /> : <Upload size={20} />}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#142033]">
                      {targetParentDoc
                        ? (isFa ? 'افزودن ترجمه مدرک' : 'Add Document Translation')
                        : (isFa ? 'آپلود مدرک جدید' : 'Upload New Document')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {targetParentDoc
                        ? (isFa
                            ? `ترجمه برای: ${targetParentDoc.file_name}`
                            : `Translation for: ${targetParentDoc.file_name}`)
                        : (isFa
                            ? 'مدارک با سقف ۵۰ مگابایت مجاز هستند.'
                            : 'Allowed up to 50MB per file.')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setTargetParentDoc(null);
                    setSelectedFile(null);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Status Alerts */}
              {uploadError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {uploadError}
                </div>
              )}
              {uploadSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-1.5 rtl:space-x-reverse">
                  <CheckCircle size={15} />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleUploadDocument} className="space-y-4">
                {/* Document Type (if original) */}
                {!targetParentDoc ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142033] block">
                      {isFa ? 'نوع مدرک' : 'Document Type'}
                    </label>
                    <select
                      value={selectedDocType}
                      onChange={(e) => setSelectedDocType(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                    >
                      {documentTypes.map((dt) => (
                        <option key={dt.key} value={dt.key}>
                          {dt.label_fa}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-[#2F6FED]">
                      {isFa ? 'مدرک اصلی مرجع:' : 'Parent Reference:'}
                    </span>{' '}
                    <span>{targetParentDoc.file_name}</span>
                    <div className="text-[11px] text-slate-500">
                      {targetParentDoc.document_types?.label_fa || targetParentDoc.document_type}
                    </div>
                  </div>
                )}

                {/* Language Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#142033] block">
                    {isFa ? 'زبان مدرک' : 'Document Language'}
                  </label>
                  <input
                    type="text"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    placeholder={targetParentDoc ? 'مثال: رومانیایی یا انگلیسی' : 'مثال: فارسی'}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                  />
                  <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                    <span className="text-slate-400">{isFa ? 'انتخاب سریع:' : 'Quick select:'}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('فارسی')}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px]"
                    >
                      فارسی
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('رومانیایی')}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px]"
                    >
                      رومانیایی
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('انگلیسی')}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px]"
                    >
                      انگلیسی
                    </button>
                  </div>
                </div>

                {/* File Picker Box */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#142033] block">
                    {isFa ? 'انتخاب فایل سند' : 'Choose File'}
                  </label>
                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#2F6FED] bg-slate-50/50 hover:bg-blue-50/20 text-center transition-all cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.heic,.mp4,.mov,.webm"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setSelectedFile(file);
                        setUploadError(null);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2F6FED] flex items-center justify-center mx-auto">
                        <Upload size={18} />
                      </div>
                      {selectedFile ? (
                        <div>
                          <div className="text-xs font-bold text-[#142033] break-all">{selectedFile.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {formatBytes(selectedFile.size)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs font-bold text-[#142033]">
                            {isFa ? 'فایل را اینجا رها کنید یا کلیک نمایید' : 'Click or drag file here'}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {isFa
                              ? 'PDF, Word, تصاویر (JPG, PNG, WEBP) و ویدیو (حداکثر ۵۰ مگابایت)'
                              : 'PDF, Word, Images or Video (max 50MB)'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => {
                      setShowUploadModal(false);
                      setTargetParentDoc(null);
                      setSelectedFile(null);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    {isFa ? 'انصراف' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="px-6 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse"
                  >
                    {uploading && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                    <span>
                      {uploading
                        ? (isFa ? 'در حال آپلود...' : 'Uploading...')
                        : (isFa ? 'تأیید و ارسال مدرک' : 'Upload Document')}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
