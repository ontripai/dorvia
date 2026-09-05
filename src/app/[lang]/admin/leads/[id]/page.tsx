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
  Sparkles,
  Download,
  Upload,
  FileText,
  FilePlus,
  Languages,
  Users,
  UserPlus,
  Trash2,
} from '@/components/Icons';

interface LeadDetailPageProps {
  params: { lang: Language; id: string };
}

interface AdminDocument {
  id: string;
  lead_id: string;
  document_type: string;
  language: string | null;
  translation_of_document_id: string | null;
  translation_office: string | null;
  is_certified_translation: boolean;
  uploaded_by_role: 'lead' | 'admin';
  uploaded_by_admin_id: string | null;
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
  uploader?: {
    id: string;
    full_name: string | null;
  };
}

interface AllowedDocType {
  key: string;
  label_fa: string;
  allowed_roles: string[];
}

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LeadDetailPage({ params }: LeadDetailPageProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();
  const leadId = params.id;

  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'assignments'>('details');
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsgText, setNewMsgText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);

  // Case Staff Assignments State (dre-p65)
  const [assignments, setAssignments] = useState<any[]>([]);
  const [availableStaff, setAvailableStaff] = useState<any[]>([]);
  const [canManageAssignments, setCanManageAssignments] = useState(false);
  const [assigningStaff, setAssigningStaff] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedAssignedRole, setSelectedAssignedRole] = useState('agent');
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [assignmentSuccess, setAssignmentSuccess] = useState<string | null>(null);

  // Documents State
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [allowedDocTypes, setAllowedDocTypes] = useState<AllowedDocType[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDocType, setUploadDocType] = useState<string>('');
  const [uploadLanguage, setUploadLanguage] = useState<string>('فارسی');
  const [uploadParentDocId, setUploadParentDocId] = useState<string | null>(null);
  const [uploadTranslationOffice, setUploadTranslationOffice] = useState<string>('');
  const [uploadIsCertified, setUploadIsCertified] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Translation Edit Modal State
  const [editingDoc, setEditingDoc] = useState<AdminDocument | null>(null);
  const [editCertified, setEditCertified] = useState<boolean>(false);
  const [editOffice, setEditOffice] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadLeadData = async () => {
    try {
      // Fetch lead detail
      const res = await fetch(`/api/admin/leads/${leadId}`);
      if (res.status === 401 || res.status === 403) {
        router.replace(`/${currentLang}/admin/login?error=unauthorized`);
        return;
      }

      const json = await res.json().catch(() => null);
      if (json?.lead) {
        setLead(json.lead);
        if (json.familyMembers) {
          setFamilyMembers(json.familyMembers);
        }
      } else {
        setActionError(json?.error || (isFa ? 'پرونده لید یافت نشد.' : 'Failed to load lead.'));
      }

      // Fetch messages
      const msgRes = await fetch(`/api/admin/leads/${leadId}/messages`);
      const msgJson = await msgRes.json().catch(() => null);
      if (msgJson?.messages) {
        setMessages(msgJson.messages);
      }

      // Fetch documents
      await loadAdminDocuments();

      // Fetch assignments (dre-p65)
      await loadLeadAssignments();

      setLoading(false);

      // Optional client SDK hydration fallback without blocking
      if (supabase) {
        await supabase.auth.getUser().catch(() => null);
      }
    } catch (err) {
      setActionError(isFa ? 'خطا در برقراری ارتباط با سرور.' : 'Error connecting to admin services.');
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

  // Documents Handlers
  const loadAdminDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/documents`);
      const json = await res.json().catch(() => null);
      if (json?.success) {
        setDocuments(json.documents || []);
        if (json.allowedDocumentTypes?.length) {
          setAllowedDocTypes(json.allowedDocumentTypes);
          if (!uploadDocType) {
            setUploadDocType(json.allowedDocumentTypes[0].key);
          }
        }
      }
    } catch (err) {
      console.error('Error loading admin documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const openStaffNewDocument = () => {
    setUploadParentDocId(null);
    setUploadLanguage('فارسی');
    setUploadTranslationOffice('');
    setUploadIsCertified(false);
    setUploadFile(null);
    setUploadError(null);
    setUploadSuccess(null);
    if (allowedDocTypes.length > 0) {
      setUploadDocType(allowedDocTypes[0].key);
    }
    setShowUploadModal(true);
  };

  const openStaffAddTranslation = (parentDoc: AdminDocument) => {
    setUploadParentDocId(parentDoc.id);
    setUploadDocType(parentDoc.document_type);
    setUploadLanguage('رومانیایی');
    setUploadTranslationOffice('');
    setUploadIsCertified(true);
    setUploadFile(null);
    setUploadError(null);
    setUploadSuccess(null);
    setShowUploadModal(true);
  };

  const handleStaffUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadDocType) {
      setUploadError(isFa ? 'لطفاً فایل و نوع مدرک را مشخص کنید.' : 'File and document type required.');
      return;
    }

    if (uploadFile.size > 50 * 1024 * 1024) {
      setUploadError(isFa ? 'حجم فایل نباید از ۵۰ مگابایت بیشتر باشد.' : 'File must be under 50MB.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('document_type', uploadDocType);
      formData.append('language', uploadLanguage.trim() || 'فارسی');
      if (uploadParentDocId) {
        formData.append('translation_of_document_id', uploadParentDocId);
      }
      if (uploadTranslationOffice) {
        formData.append('translation_office', uploadTranslationOffice.trim());
      }
      formData.append('is_certified_translation', uploadIsCertified ? 'true' : 'false');

      const res = await fetch(`/api/admin/leads/${leadId}/documents`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || (isFa ? 'خطا در بارگذاری مدرک توسط پرسنل' : 'Upload failed'));
      }

      setUploadSuccess(isFa ? 'مدرک با موفقیت از طرف مشتری ثبت و بارگذاری شد.' : 'Document uploaded successfully.');
      setUploadFile(null);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(null);
        setUploadParentDocId(null);
      }, 1200);
      await loadAdminDocuments();
    } catch (err: any) {
      setUploadError(err?.message || (isFa ? 'خطا در بارگذاری مدرک' : 'Upload error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSaveTranslationEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    setSavingEdit(true);
    setEditError(null);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/documents/${editingDoc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_certified_translation: editCertified,
          translation_office: editOffice.trim() || null,
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || (isFa ? 'خطا در ذخیره تغییرات ترجمه' : 'Update failed'));
      }

      setEditingDoc(null);
      await loadAdminDocuments();
    } catch (err: any) {
      setEditError(err?.message || (isFa ? 'خطا در ویرایش ترجمه' : 'Update error'));
    } finally {
      setSavingEdit(false);
    }
  };

  const getRelationLabel = (relation: string | null) => {
    switch (relation) {
      case 'self':
        return isFa ? 'متقاضی اصلی (سرپرست)' : 'Primary Applicant';
      case 'spouse':
        return isFa ? 'همسر' : 'Spouse';
      case 'child':
        return isFa ? 'فرزند' : 'Child';
      case 'parent':
        return isFa ? 'پدر / مادر' : 'Parent';
      case 'sibling':
        return isFa ? 'خواهر / برادر' : 'Sibling';
      default:
        return isFa ? 'سایر اعضا' : relation || 'Other';
    }
  };

  const getAssignedRoleLabel = (role: string) => {
    switch (role) {
      case 'agent':
        return isFa ? 'مشاور ارشد پرونده' : 'Lead Case Agent';
      case 'consultant':
        return isFa ? 'مشاور تخصصی مهاجرت' : 'Immigration Consultant';
      case 'lawyer':
        return isFa ? 'وکیل حقوقی پرونده' : 'Case Attorney';
      case 'notary':
        return isFa ? 'امور اسناد رسمی و ترجمه' : 'Notary & Translation Specialist';
      case 'finance':
        return isFa ? 'کارشناس امور مالی' : 'Financial Specialist';
      case 'marketing':
        return isFa ? 'پشتیبانی و ارتباط با متقاضی' : 'Client Success & Relations';
      default:
        return role;
    }
  };

  const loadLeadAssignments = async () => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/assignments`);
      const json = await res.json().catch(() => null);
      if (json?.success) {
        setAssignments(json.assignments || []);
        setAvailableStaff(json.availableStaff || []);
        setCanManageAssignments(Boolean(json.canManage));
        if (json.availableStaff?.length > 0 && !selectedStaffId) {
          setSelectedStaffId(json.availableStaff[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId || !selectedAssignedRole) {
      setAssignmentError(isFa ? 'لطفاً کارمند و نقش را انتخاب کنید.' : 'Please select staff and role.');
      return;
    }

    setAssigningStaff(true);
    setAssignmentError(null);
    setAssignmentSuccess(null);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staff_id: selectedStaffId,
          assigned_role: selectedAssignedRole,
        }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setAssignmentSuccess(isFa ? 'کارمند با موفقیت به پرونده تخصیص داده شد.' : 'Staff assigned successfully.');
        await loadLeadAssignments();
      } else {
        setAssignmentError(json.error || (isFa ? 'تخصیص کارمند ناموفق بود.' : 'Failed to assign staff.'));
      }
    } catch (err) {
      console.error('Error assigning staff:', err);
      setAssignmentError(isFa ? 'خطا در ارتباط با سرور.' : 'Network connection error.');
    } finally {
      setAssigningStaff(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    setDeletingAssignmentId(assignmentId);
    setAssignmentError(null);
    setAssignmentSuccess(null);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/assignments/${assignmentId}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setAssignmentSuccess(isFa ? 'تخصیص همکار با موفقیت حذف شد.' : 'Assignment removed successfully.');
        await loadLeadAssignments();
      } else {
        setAssignmentError(json.error || (isFa ? 'حذف تخصیص ناموفق بود.' : 'Failed to remove assignment.'));
      }
    } catch (err) {
      console.error('Error deleting assignment:', err);
      setAssignmentError(isFa ? 'خطا در ارتباط با سرور.' : 'Network connection error.');
    } finally {
      setDeletingAssignmentId(null);
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

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-3 border-b border-[#dfe6ef] pb-3">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'details'
                ? 'bg-[#071B3D] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileCheck2 size={16} />
            <span>{isFa ? 'جزئیات پرونده و مکاتبه' : 'Case Details & Chat'}</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'documents'
                ? 'bg-[#071B3D] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText size={16} />
            <span>{isFa ? 'مدارک و ترجمه‌ها' : 'Documents & Translations'}</span>
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

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
              activeTab === 'assignments'
                ? 'bg-[#071B3D] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users size={16} />
            <span>{isFa ? 'تیم پرونده و تخصیص‌ها' : 'Case Staff & Team'}</span>
            {assignments.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'assignments' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                }`}
              >
                {assignments.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: CASE DETAILS & MESSAGING */}
        {activeTab === 'details' && (
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

                {/* Documents Quick Link Box */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#2F6FED] flex items-center justify-center">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#142033]">
                        {isFa ? 'مدارک متقاضی' : 'Lead Documents'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isFa ? `${documents.length} مدرک در دسترس شما` : `${documents.length} files available`}
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

                {/* Case Staff Team Quick Link Box (dre-p65) */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Users size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#142033]">
                        {isFa ? 'تیم رسیدگی به پرونده' : 'Assigned Case Staff'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isFa ? `${assignments.length} همکار تخصیص‌یافته` : `${assignments.length} staff assigned`}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className="text-xs font-bold text-[#2F6FED] hover:underline cursor-pointer"
                  >
                    {isFa ? 'مشاهده تیم ←' : 'View Team →'}
                  </button>
                </div>

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

                  {lead.national_id_or_passport && (
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-600">{isFa ? 'کد ملی / گذرنامه' : 'National ID / Passport'}</span>
                      <span className="font-mono text-slate-800" dir="ltr">{lead.national_id_or_passport}</span>
                    </div>
                  )}

                  {lead.date_of_birth && (
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-600">{isFa ? 'تاریخ تولد' : 'Date of Birth'}</span>
                      <span className="font-mono text-slate-800" dir="ltr">{lead.date_of_birth}</span>
                    </div>
                  )}

                  {lead.anniversary_date && (
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-600">{isFa ? 'تاریخ سالگرد ازدواج' : 'Anniversary Date'}</span>
                      <span className="font-mono text-slate-800" dir="ltr">{lead.anniversary_date}</span>
                    </div>
                  )}

                  {(lead.address_city || lead.address_line || lead.address_postal_code) && (
                    <div className="flex items-start justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-600 shrink-0">{isFa ? 'نشانی سکونت' : 'Address'}</span>
                      <span className="font-medium text-[#142033] text-end leading-relaxed">
                        {[lead.address_city, lead.address_line, lead.address_postal_code ? `(${lead.address_postal_code})` : ''].filter(Boolean).join('، ')}
                      </span>
                    </div>
                  )}

                  {lead.employment_status && (
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-600">{isFa ? 'وضعیت اشتغال' : 'Employment'}</span>
                      <span className="font-medium text-[#142033]">{lead.employment_status}</span>
                    </div>
                  )}

                  {lead.education_level && (
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-600">{isFa ? 'سطح تحصیلات' : 'Education'}</span>
                      <span className="font-medium text-[#142033]">{lead.education_level}</span>
                    </div>
                  )}

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

              {/* Family Group Members Card (dre-p63) */}
              {lead.family_group_id && (
                <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                      <Users size={16} className="text-[#2F6FED]" />
                      <span>{isFa ? 'اعضای همین خانواده' : 'Family Group Members'}</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2F6FED] text-[10px] font-mono font-bold">
                      {familyMembers.length} {isFa ? 'عضو' : 'members'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {isFa
                      ? 'پرونده‌های متصل به شناسه گروه خانوادگی مشترک:'
                      : 'Linked case files in the same family group:'}
                  </p>

                  <div className="space-y-2">
                    {familyMembers.map((member) => (
                      <div
                        key={member.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                          member.id === lead.id
                            ? 'bg-blue-50/50 border-blue-200'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-[#142033] truncate">
                              {member.full_name}
                            </span>
                            {member.is_family_primary && (
                              <span className="px-1.5 py-0.5 rounded-md bg-[#071B3D] text-white text-[9px] font-bold">
                                {isFa ? 'سرپرست' : 'Primary'}
                              </span>
                            )}
                            {member.id === lead.id && (
                              <span className="text-[10px] text-blue-600 font-bold">
                                ({isFa ? 'پرونده فعلی' : 'Current'})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#2F6FED]">
                            {getRelationLabel(member.relation_to_primary)}
                            {member.phone ? ` • ${member.phone}` : ''}
                          </div>
                        </div>

                        {member.id !== lead.id && (
                          <Link
                            href={`/admin/leads/${member.id}`}
                            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-[#071B3D] transition-colors shrink-0"
                          >
                            {isFa ? 'مشاهده پرونده ←' : 'View Case →'}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

                  <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span>{isFa ? 'کانال رسمی' : 'Official'}</span>
                  </span>
                </div>

                {/* Message list body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xl">
                        💬
                      </div>
                      <h4 className="text-sm font-bold text-[#142033]">
                        {isFa ? 'پیامی هنوز ثبت نشده است' : 'No messages yet'}
                      </h4>
                      <p className="text-xs text-[#526174] max-w-sm">
                        {isFa
                          ? 'اولین پیام یا راهنمایی تکمیلی را برای این متقاضی ارسال کنید.'
                          : 'Send the first message or instructions to this lead.'}
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isStaff = msg.sender_role === 'staff' || msg.sender_role === 'admin';
                      const timeString = new Date(msg.created_at).toLocaleTimeString(isFa ? 'fa-IR' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                            <span className="font-semibold text-slate-600">
                              {isStaff ? (isFa ? 'شما (تیم DORVIA)' : 'You (Staff)') : lead.full_name}
                            </span>
                            <span>•</span>
                            <span>{timeString}</span>
                          </div>

                          <div
                            className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs whitespace-pre-wrap ${
                              isStaff
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
        )}

        {/* TAB 2: CASE DOCUMENTS & TRANSLATIONS */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <FileText size={22} className="text-[#2F6FED]" />
                  <span>{isFa ? 'اسناد و ترجمه‌های پرونده متقاضی' : 'Applicant Case Documents & Translations'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#526174] mt-1">
                  {isFa
                    ? 'فهرست مدارک بارگذاری‌شده با اعمال فیلترینگ سطوح دسترسی نقش سازمانی شما.'
                    : 'List of documents with server-side role-based access filtering applied.'}
                </p>
              </div>

              <button
                onClick={openStaffNewDocument}
                className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-3 rounded-2xl bg-[#071B3D] hover:bg-blue-950 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Upload size={16} />
                <span>{isFa ? 'آپلود مدرک از طرف مشتری' : 'Upload on Behalf of Client'}</span>
              </button>
            </div>

            {/* Documents List */}
            {loadingDocs ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3 bg-white border border-[#dfe6ef] rounded-3xl p-12 text-center">
                <div className="w-8 h-8 border-3 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 font-medium">
                  {isFa ? 'در حال بارگذاری فهرست مدارک...' : 'Loading case documents...'}
                </p>
              </div>
            ) : documents.length === 0 ? (
              <div className="bg-white border border-[#dfe6ef] rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                  📂
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#142033]">
                    {isFa ? 'هیچ مدرکی در دسترس نیست' : 'No documents accessible'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#526174] max-w-md mx-auto leading-relaxed">
                    {isFa
                      ? 'هنوز مدرکی برای این پرونده ثبت نشده است یا نوع مدارک ثبت‌شده خارج از حیطه دسترسی نقش سازمانی شماست.'
                      : 'No documents recorded, or registered documents are outside your staff role permissions.'}
                  </p>
                </div>
                {allowedDocTypes.length > 0 && (
                  <button
                    onClick={openStaffNewDocument}
                    className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-2.5 rounded-xl bg-[#071B3D] hover:bg-blue-950 text-white text-xs font-bold shadow-sm cursor-pointer"
                  >
                    <Upload size={15} />
                    <span>{isFa ? 'آپلود مدرک جدید' : 'Upload Document'}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. Original Documents */}
                {documents
                  .filter((d) => !d.translation_of_document_id)
                  .map((doc) => {
                    const translations = documents.filter((d) => d.translation_of_document_id === doc.id);
                    const typeLabel = doc.document_types?.label_fa || doc.document_type;
                    const isStaffUpload = doc.uploaded_by_role === 'admin';

                    return (
                      <div
                        key={doc.id}
                        className="bg-white border border-[#dfe6ef] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                      >
                        {/* Parent Document Row */}
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
                                {isStaffUpload ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                    {isFa
                                      ? `توسط پرسنل: ${doc.uploader?.full_name || 'کارشناس'}`
                                      : `By Staff: ${doc.uploader?.full_name || 'Staff'}`}
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {isFa ? 'توسط متقاضی' : 'By Applicant'}
                                  </span>
                                )}
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
                              onClick={() => openStaffAddTranslation(doc)}
                              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-all cursor-pointer"
                              title={isFa ? 'افزودن ترجمه برای این مدرک' : 'Add Translation'}
                            >
                              <Languages size={14} />
                              <span>{isFa ? 'افزودن ترجمه' : 'Add Translation'}</span>
                            </button>

                            <a
                              href={`/api/admin/leads/${leadId}/documents/${doc.id}/download`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl bg-[#071B3D] hover:bg-blue-950 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
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
                                  ? `ترجمه‌های متصل به این مدرک (${translations.length}):`
                                  : `Translations attached to this document (${translations.length}):`}
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
                                          : (isFa ? 'ترجمه عادی' : 'Standard Translation')}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                                        {isFa ? `زبان: ${trans.language || 'رومانیایی'}` : `Lang: ${trans.language || 'RO'}`}
                                      </span>
                                      {trans.translation_office && (
                                        <span className="text-[11px] text-slate-700 font-medium">
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

                                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                    <button
                                      onClick={() => {
                                        setEditingDoc(trans);
                                        setEditCertified(trans.is_certified_translation);
                                        setEditOffice(trans.translation_office || '');
                                        setEditError(null);
                                      }}
                                      className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 cursor-pointer"
                                    >
                                      <span>✏️</span>
                                      <span>{isFa ? 'ویرایش مشخصات' : 'Edit'}</span>
                                    </button>

                                    <a
                                      href={`/api/admin/leads/${leadId}/documents/${trans.id}/download`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-[#071B3D] hover:bg-blue-950 text-white text-[11px] font-bold shadow-2xs"
                                    >
                                      <Download size={12} />
                                      <span>{isFa ? 'دانلود' : 'Download'}</span>
                                    </a>
                                  </div>
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
                      {isFa ? 'سایر ترجمه‌های مستقل' : 'Other Standalone Translations'}
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
                            href={`/api/admin/leads/${leadId}/documents/${orphan.id}/download`}
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

        {/* TAB 3: CASE STAFF & ASSIGNMENTS (dre-p65) */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            
            {/* Feedback Alerts */}
            {assignmentError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-between">
                <span>⚠️ {assignmentError}</span>
                <button onClick={() => setAssignmentError(null)} className="text-red-500 hover:text-red-800">✕</button>
              </div>
            )}

            {assignmentSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-between">
                <span>✓ {assignmentSuccess}</span>
                <button onClick={() => setAssignmentSuccess(null)} className="text-emerald-500 hover:text-emerald-800">✕</button>
              </div>
            )}

            {/* Top Row: Info & Assign Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Assign Form (5 Cols) - Only if canManageAssignments */}
              {canManageAssignments ? (
                <div className="lg:col-span-5">
                  <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-sm space-y-5 sticky top-6">
                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse border-b border-slate-100 pb-4">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2F6FED] flex items-center justify-center">
                        <UserPlus size={18} />
                      </div>
                      <div>
                        <h2 className="text-sm font-extrabold text-[#142033]">
                          {isFa ? 'تخصیص کارمند به این پرونده' : 'Assign Staff to Case'}
                        </h2>
                        <p className="text-[11px] text-slate-500">
                          {isFa ? 'تعیین همکار مسئول و نقش اجرایی در این پرونده' : 'Designate staff and case responsibility'}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleCreateAssignment} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {isFa ? 'انتخاب همکار *' : 'Select Staff Member *'}
                        </label>
                        <select
                          value={selectedStaffId}
                          onChange={(e) => setSelectedStaffId(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:border-[#2F6FED] focus:outline-none transition-colors"
                        >
                          {availableStaff.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.full_name || 'Staff'} ({s.roles?.label_fa || s.roles?.key || 'کارمند'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {isFa ? 'نقش تخصیص‌یافته در این پرونده *' : 'Assigned Case Role *'}
                        </label>
                        <select
                          value={selectedAssignedRole}
                          onChange={(e) => setSelectedAssignedRole(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:border-[#2F6FED] focus:outline-none transition-colors"
                        >
                          <option value="agent">{isFa ? 'مشاور ارشد پرونده (Agent)' : 'Lead Case Agent'}</option>
                          <option value="consultant">{isFa ? 'مشاور تخصصی مهاجرت (Consultant)' : 'Immigration Consultant'}</option>
                          <option value="lawyer">{isFa ? 'وکیل حقوقی پرونده (Lawyer)' : 'Case Attorney'}</option>
                          <option value="notary">{isFa ? 'امور اسناد رسمی و ترجمه (Notary)' : 'Notary Specialist'}</option>
                          <option value="finance">{isFa ? 'کارشناس امور مالی (Finance)' : 'Financial Specialist'}</option>
                          <option value="marketing">{isFa ? 'پشتیبانی و ارتباط با متقاضی (Marketing)' : 'Client Success'}</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={assigningStaff || availableStaff.length === 0}
                        className="w-full py-3 px-4 rounded-xl bg-[#2F6FED] hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer disabled:opacity-50"
                      >
                        <UserPlus size={15} />
                        <span>
                          {assigningStaff
                            ? (isFa ? 'در حال ثبت تخصیص...' : 'Assigning...')
                            : (isFa ? 'ثبت تخصیص کارمند' : 'Assign to Case')}
                        </span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : null}

              {/* Roster of Assigned Staff (7 or 12 Cols) */}
              <div className={canManageAssignments ? 'lg:col-span-7' : 'lg:col-span-12'}>
                <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Users size={16} className="text-[#2F6FED]" />
                      <h3 className="text-sm font-extrabold text-[#142033]">
                        {isFa ? 'تیم پرونده و همکاران مسئول' : 'Case Staff Roster'}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2F6FED] text-xs font-mono font-bold">
                      {assignments.length} {isFa ? 'همکار' : 'staff'}
                    </span>
                  </div>

                  {assignments.length === 0 ? (
                    <div className="py-12 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Users size={22} />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {isFa
                          ? 'هنوز هیچ کارمندی به این پرونده تخصیص داده نشده است.'
                          : 'No staff members currently assigned to this case file.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {assignments.map((assign) => (
                        <div
                          key={assign.id}
                          className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2F6FED] flex items-center justify-center font-bold text-sm shrink-0">
                              {assign.staff?.full_name ? assign.staff.full_name.charAt(0).toUpperCase() : 'S'}
                            </div>

                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-[#142033] truncate">
                                  {assign.staff?.full_name || (isFa ? 'کارمند DORVIA' : 'Staff Member')}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#2F6FED] border border-blue-200 text-[10px] font-bold">
                                  {getAssignedRoleLabel(assign.assigned_role)}
                                </span>
                              </div>

                              <div className="text-[11px] text-slate-500">
                                {isFa ? 'نقش سازمانی:' : 'Role:'}{' '}
                                <span className="font-semibold text-slate-700">
                                  {assign.staff?.roles?.label_fa || assign.staff?.roles?.key || '—'}
                                </span>
                                {' • '}
                                <span className="text-[10px]">
                                  {new Date(assign.assigned_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {canManageAssignments && (
                            <button
                              onClick={() => handleDeleteAssignment(assign.id)}
                              disabled={deletingAssignmentId === assign.id}
                              className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all flex items-center space-x-1.5 rtl:space-x-reverse self-end sm:self-center cursor-pointer shrink-0 disabled:opacity-50"
                              title={isFa ? 'حذف تخصیص' : 'Remove Assignment'}
                            >
                              <Trash2 size={13} />
                              <span>{deletingAssignmentId === assign.id ? (isFa ? 'در حال حذف...' : 'Removing...') : (isFa ? 'حذف' : 'Remove')}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

            </div>

          </div>
        )}

        {/* STAFF UPLOAD MODAL */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
            <div
              className="bg-white border border-[#dfe6ef] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
              dir={isFa ? 'rtl' : 'ltr'}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-[#071B3D] flex items-center justify-center">
                    {uploadParentDocId ? <Languages size={20} /> : <Upload size={20} />}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#142033]">
                      {uploadParentDocId
                        ? (isFa ? 'افزودن ترجمه از طرف متقاضی' : 'Add Translation on Behalf of Client')
                        : (isFa ? 'آپلود مدرک جدید از طرف متقاضی' : 'Upload Document on Behalf of Client')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isFa
                        ? 'مدرک با دسترسی سازمانی پرسنل آپلود می‌شود.'
                        : 'Uploaded directly via staff service credentials.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadParentDocId(null);
                    setUploadFile(null);
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

              {/* Upload Form */}
              <form onSubmit={handleStaffUpload} className="space-y-4">
                {/* Document Type (if original) */}
                {!uploadParentDocId ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142033] block">
                      {isFa ? 'نوع مدرک (مجاز برای نقش شما)' : 'Document Type'}
                    </label>
                    <select
                      value={uploadDocType}
                      onChange={(e) => setUploadDocType(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#071B3D]"
                    >
                      {allowedDocTypes.map((dt) => (
                        <option key={dt.key} value={dt.key}>
                          {dt.label_fa}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-[#2F6FED]">
                      {isFa ? 'مدرک مرجع برای این ترجمه:' : 'Parent Reference:'}
                    </span>{' '}
                    <span>{documents.find((d) => d.id === uploadParentDocId)?.file_name}</span>
                  </div>
                )}

                {/* Language Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#142033] block">
                    {isFa ? 'زبان مدرک' : 'Document Language'}
                  </label>
                  <input
                    type="text"
                    value={uploadLanguage}
                    onChange={(e) => setUploadLanguage(e.target.value)}
                    placeholder={uploadParentDocId ? 'مثال: رومانیایی یا انگلیسی' : 'مثال: فارسی'}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#071B3D]"
                  />
                  <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                    <span className="text-slate-400">{isFa ? 'انتخاب سریع:' : 'Quick select:'}</span>
                    <button
                      type="button"
                      onClick={() => setUploadLanguage('فارسی')}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px]"
                    >
                      فارسی
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadLanguage('رومانیایی')}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px]"
                    >
                      رومانیایی
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadLanguage('انگلیسی')}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px]"
                    >
                      انگلیسی
                    </button>
                  </div>
                </div>

                {/* Translation Specific Fields */}
                {uploadParentDocId && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#142033] block">
                        {isFa ? 'نام دارالترجمه رسمی (اختیاری)' : 'Translation Office'}
                      </label>
                      <input
                        type="text"
                        value={uploadTranslationOffice}
                        onChange={(e) => setUploadTranslationOffice(e.target.value)}
                        placeholder={isFa ? 'مثال: دارالترجمه رسمی دانشجو' : 'e.g., Certified Translation Office'}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#071B3D]"
                      />
                    </div>

                    <label className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-bold text-[#142033] cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={uploadIsCertified}
                        onChange={(e) => setUploadIsCertified(e.target.checked)}
                        className="w-4 h-4 rounded text-[#071B3D] focus:ring-[#071B3D]"
                      />
                      <span>{isFa ? 'این ترجمه دارای مهر رسمی دادگستری/وزارت امور خارجه است' : 'Certified translation'}</span>
                    </label>
                  </>
                )}

                {/* File Picker Box */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#142033] block">
                    {isFa ? 'انتخاب فایل سند' : 'Choose File'}
                  </label>
                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#071B3D] bg-slate-50/50 text-center transition-all cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.heic,.mp4,.mov,.webm"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setUploadFile(file);
                        setUploadError(null);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-[#071B3D] flex items-center justify-center mx-auto">
                        <Upload size={18} />
                      </div>
                      {uploadFile ? (
                        <div>
                          <div className="text-xs font-bold text-[#142033] break-all">{uploadFile.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {formatBytes(uploadFile.size)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs font-bold text-[#142033]">
                            {isFa ? 'فایل را اینجا رها کنید یا کلیک نمایید' : 'Click or drag file here'}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {isFa
                              ? 'PDF, Word, تصاویر و ویدیو (حداکثر ۵۰ مگابایت)'
                              : 'PDF, Word, Images or Video (max 50MB)'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadParentDocId(null);
                      setUploadFile(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
                  >
                    {isFa ? 'انصراف' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !uploadFile}
                    className="px-5 py-2.5 rounded-xl bg-[#071B3D] hover:bg-blue-900 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {uploading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isFa ? 'در حال ارسال...' : 'Uploading...'}</span>
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        <span>{isFa ? 'بارگذاری سند' : 'Upload Document'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT TRANSLATION MODAL */}
        {editingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
            <div
              className="bg-white border border-[#dfe6ef] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
              dir={isFa ? 'rtl' : 'ltr'}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Languages size={20} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#142033]">
                      {isFa ? 'ویرایش مشخصات ترجمه رسمی' : 'Edit Translation Details'}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {editingDoc.file_name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {editError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {editError}
                </div>
              )}

              <form onSubmit={handleSaveTranslationEdit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#142033] block">
                    {isFa ? 'نام دارالترجمه رسمی' : 'Translation Office'}
                  </label>
                  <input
                    type="text"
                    value={editOffice}
                    onChange={(e) => setEditOffice(e.target.value)}
                    placeholder={isFa ? 'مثال: دارالترجمه رسمی دانشجو' : 'e.g., Certified Translation Office'}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#071B3D]"
                  />
                </div>

                <label className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-bold text-[#142033] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editCertified}
                    onChange={(e) => setEditCertified(e.target.checked)}
                    className="w-4 h-4 rounded text-[#071B3D] focus:ring-[#071B3D]"
                  />
                  <span>{isFa ? 'این ترجمه دارای مهر رسمی دادگستری/وزارت امور خارجه است' : 'Certified translation with official stamp'}</span>
                </label>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={savingEdit}
                    onClick={() => setEditingDoc(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
                  >
                    {isFa ? 'انصراف' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-5 py-2.5 rounded-xl bg-[#071B3D] hover:bg-blue-900 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {savingEdit ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isFa ? 'در حال ذخیره...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <span>{isFa ? 'ذخیره تغییرات' : 'Save Changes'}</span>
                    )}
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
