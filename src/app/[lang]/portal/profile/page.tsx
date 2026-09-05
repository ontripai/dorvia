'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  ShieldCheck,
  CheckCircle,
  FileCheck2,
  LogOut,
  User,
  Users,
  Calendar,
  LockKeyhole,
  PhoneCall,
  Mail,
  ArrowLeft,
  ArrowRight,
  Clock,
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  FileText,
} from '@/components/Icons';

interface PortalProfileProps {
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
  admin_comment?: string | null;
  message: string | null;
  verified_at: string | null;
  verified_by: string | null;
  invited_at: string | null;
  invited_by: string | null;
  family_group_id: string | null;
  relation_to_primary: string | null;
  is_family_primary: boolean;
  date_of_birth: string | null;
  anniversary_date: string | null;
  national_id_or_passport: string | null;
  address_line: string | null;
  address_city: string | null;
  address_postal_code: string | null;
  employment_status: string | null;
  education_level: string | null;
  created_at: string;
}

interface FamilyMember {
  id: string;
  full_name: string;
  relation_to_primary: string | null;
  is_family_primary: boolean;
  date_of_birth: string | null;
  phone: string | null;
  national_id_or_passport: string | null;
  status: string;
  created_at: string;
}

export default function PortalProfilePage({ params }: PortalProfileProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState<LeadProfile | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // Editable Profile Form State
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressPostalCode, setAddressPostalCode] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [anniversaryDate, setAnniversaryDate] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [educationLevel, setEducationLevel] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Add Family Member Modal State
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState<'spouse' | 'child' | 'parent' | 'sibling' | 'other'>('spouse');
  const [newMemberDob, setNewMemberDob] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberNationalId, setNewMemberNationalId] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [memberSuccess, setMemberSuccess] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/portal/profile');
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success || !data?.lead) {
        if (res.status === 401) {
          router.push(`/${currentLang}/portal/login`);
          return;
        }
        setLead(null);
      } else {
        const l: LeadProfile = data.lead;
        setLead(l);
        setFamilyMembers(data.familyMembers || []);

        // Populate form inputs
        setPhone(l.phone || '');
        setAddressLine(l.address_line || '');
        setAddressCity(l.address_city || '');
        setAddressPostalCode(l.address_postal_code || '');
        setDateOfBirth(l.date_of_birth || '');
        setAnniversaryDate(l.anniversary_date || '');
        setNationalId(l.national_id_or_passport || '');
        setEmploymentStatus(l.employment_status || '');
        setEducationLevel(l.education_level || '');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setLead(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [currentLang]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const res = await fetch('/api/portal/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim() || null,
          address_line: addressLine.trim() || null,
          address_city: addressCity.trim() || null,
          address_postal_code: addressPostalCode.trim() || null,
          date_of_birth: dateOfBirth.trim() || null,
          anniversary_date: anniversaryDate.trim() || null,
          national_id_or_passport: nationalId.trim() || null,
          employment_status: employmentStatus.trim() || null,
          education_level: educationLevel.trim() || null,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || (isFa ? 'خطا در ذخیره مشخصات پروفایل' : 'Failed to update profile'));
      }

      setProfileSuccess(isFa ? 'اطلاعات پروفایل شما با موفقیت ذخیره و به‌روزرسانی شد.' : 'Profile updated successfully.');
      if (data.lead) {
        setLead(data.lead);
      }
      setTimeout(() => setProfileSuccess(null), 3500);
    } catch (err: any) {
      setProfileError(err?.message || (isFa ? 'خطا در به‌روزرسانی پروفایل' : 'Profile update error'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddFamilyMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) {
      setMemberError(isFa ? 'لطفاً نام و نام خانوادگی عضو خانواده را وارد کنید.' : 'Full name is required.');
      return;
    }

    setAddingMember(true);
    setMemberError(null);
    setMemberSuccess(null);

    try {
      const res = await fetch('/api/portal/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: newMemberName.trim(),
          relation_to_primary: newMemberRelation,
          date_of_birth: newMemberDob.trim() || null,
          phone: newMemberPhone.trim() || null,
          national_id_or_passport: newMemberNationalId.trim() || null,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || (isFa ? 'خطا در ثبت عضو جدید خانواده' : 'Failed to add family member'));
      }

      setMemberSuccess(isFa ? 'عضو جدید خانواده با موفقیت به شبکه متصل گردید.' : 'Family member added successfully.');
      setNewMemberName('');
      setNewMemberDob('');
      setNewMemberPhone('');
      setNewMemberNationalId('');
      setTimeout(() => {
        setShowAddFamilyModal(false);
        setMemberSuccess(null);
      }, 1500);
      await loadProfile();
    } catch (err: any) {
      setMemberError(err?.message || (isFa ? 'خطا در ثبت عضو خانواده' : 'Error adding family member'));
    } finally {
      setAddingMember(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    router.push(`/${currentLang}/portal/login`);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return {
          label: isFa ? 'در انتظار بررسی اولیه' : 'Pending Review',
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
          {isFa ? 'در حال بارگذاری پروفایل پرونده...' : 'Loading profile...'}
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
          <p className="text-xs sm:text-sm text-[#526174]">
            {isFa
              ? 'لطفاً وارد حساب کاربری مرتبط با پرونده خود شوید.'
              : 'Please sign in with the account linked to your case file.'}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-5 py-2.5 rounded-xl bg-[#071B3D] text-white text-xs font-bold shadow-sm"
        >
          {isFa ? 'ورود مجدد' : 'Sign In'}
        </button>
      </div>
    );
  }

  const statusBadge = getStatusBadge(lead.status);

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
              {isFa ? `پروفایل متقاضی: ${lead.full_name}` : `Applicant Profile: ${lead.full_name}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isFa
                ? 'مدیریت اطلاعات فردی، اقامتی و تشکیل پرونده اعضای خانواده به منظور پیوست یا اقدام همزمان در رومانی.'
                : 'Manage personal credentials, residence details and link family members for concurrent or reunification processing.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${currentLang}/portal/dashboard`}
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
            >
              <FileCheck2 size={15} />
              <span>{isFa ? '← بازگشت به داشبورد' : '← Back to Dashboard'}</span>
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

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-3 border-b border-[#dfe6ef] pb-3">
          <Link
            href={`/${currentLang}/portal/dashboard`}
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          >
            <FileCheck2 size={16} />
            <span>{isFa ? 'خلاصه پرونده و گفتگو' : 'Case Overview & Chat'}</span>
          </Link>

          <Link
            href={`/${currentLang}/portal/dashboard`}
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          >
            <FileText size={16} />
            <span>{isFa ? 'مدارک من' : 'My Documents'}</span>
          </Link>

          <div
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center space-x-2 rtl:space-x-reverse bg-[#2F6FED] text-white shadow-sm"
          >
            <User size={16} />
            <span>{isFa ? 'پروفایل و شبکه خانواده' : 'Profile & Family Network'}</span>
          </div>
        </div>

        {/* STATUS ALERTS */}
        {profileSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2 rtl:space-x-reverse animate-fadeIn">
            <CheckCircle size={18} />
            <span>{profileSuccess}</span>
          </div>
        )}
        {profileError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm animate-fadeIn">
            {profileError}
          </div>
        )}

        {/* MAIN PROFILE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT / TOP COLUMN (4 COLS): Read-Only Case Details & Badges */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Case Institutional Details Card */}
            <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-extrabold text-[#142033] border-b border-slate-100 pb-3 flex items-center space-x-2 rtl:space-x-reverse">
                <LockKeyhole size={16} className="text-[#2F6FED]" />
                <span>{isFa ? 'وضعیت رسمی پرونده (نظارت کارشناسی)' : 'Institutional Status & Roadmap'}</span>
              </h2>

              <div className="space-y-3.5">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">
                    {isFa ? 'وضعیت حقوقی پرونده' : 'Legal Case Status'}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${statusBadge.className}`}>
                    {statusBadge.label}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">
                    {isFa ? 'دسته‌بندی مسیر مهاجرت' : 'Immigration Pathway'}
                  </span>
                  <span className="text-xs font-bold text-[#142033]">
                    {lead.unified_category || lead.site_goal || (isFa ? 'تعیین‌نشده' : 'Unassigned')}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">
                    {isFa ? 'ایمیل حساب کاربری' : 'Primary Account Email'}
                  </span>
                  <span className="text-xs font-mono text-slate-700">
                    {lead.email || '—'}
                  </span>
                </div>

                {lead.verified_at && (
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block mb-1">
                      {isFa ? 'تأیید اولیه واجد شرایط بودن' : 'Initial Qualification'}
                    </span>
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle size={14} />
                      <span>{new Date(lead.verified_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US')}</span>
                    </span>
                  </div>
                )}

                {lead.invited_at && (
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block mb-1">
                      {isFa ? 'تاریخ صدور دعوت پورتال' : 'Portal Access Granted'}
                    </span>
                    <span className="text-xs text-blue-700 font-bold flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{new Date(lead.invited_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US')}</span>
                    </span>
                  </div>
                )}

                {lead.admin_comment && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <span className="font-bold block">{isFa ? 'یادداشت رسمی تیم DORVIA:' : 'Advisor Note:'}</span>
                    <p className="leading-relaxed">{lead.admin_comment}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center gap-1.5">
                <span>🔒</span>
                <span>{isFa ? 'ویرایش این بخش صرفاً از طریق کارشناس پرونده ممکن است.' : 'Protected fields managed by DORVIA legal team.'}</span>
              </div>
            </div>

            {/* Family Group Badge */}
            <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                <Users size={16} className="text-[#2F6FED]" />
                <span>{isFa ? 'شناسه شبکه خانواده' : 'Family Network Group'}</span>
              </h3>

              {lead.family_group_id ? (
                <div className="space-y-2">
                  <div className="text-xs text-slate-600">
                    {isFa ? 'عضو گروه خانوادگی:' : 'Family Group ID:'}
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 break-all">
                    {lead.family_group_id}
                  </div>
                  <div className="text-[11px] font-bold text-[#2F6FED]">
                    {lead.is_family_primary
                      ? (isFa ? '★ شما متقاضی اصلی (سرپرست خانواده) هستید' : '★ Primary Family Applicant')
                      : (isFa ? `عضو خانواده (${getRelationLabel(lead.relation_to_primary)})` : `Member (${lead.relation_to_primary})`)}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isFa
                    ? 'هنوز پرونده خانوادگی برای شما ثبت نشده است. با ثبت اولین عضو، پرونده گروهی به صورت خودکار ایجاد می‌شود.'
                    : 'No family group linked. Registering your first family member creates an interconnected family file.'}
                </p>
              )}
            </div>

          </div>

          {/* RIGHT / MAIN COLUMN (8 COLS): Editable Profile Form + Family Network */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Customer Editable Form Card */}
            <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base sm:text-lg font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                  <User size={18} className="text-[#2F6FED]" />
                  <span>{isFa ? 'مشخصات هویتی و اطلاعات تماس فردی' : 'Personal & Contact Information'}</span>
                </h2>
                <p className="text-xs text-[#526174] mt-1">
                  {isFa
                    ? 'اطلاعات زیر مستقیماً جهت تکمیل فرم‌های مهاجرتی و صدور وکالت‌نامه رسمی استفاده می‌شود.'
                    : 'This information is used for official Romanian immigration forms and legal documentation.'}
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142033] block">
                      {isFa ? 'شماره تلفن همراه (با پیش‌شماره)' : 'Phone Number'}
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+98 912 000 0000"
                      dir="ltr"
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                    />
                  </div>

                  {/* National ID / Passport */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142033] block">
                      {isFa ? 'شماره کارت ملی یا گذرنامه' : 'National ID or Passport Number'}
                    </label>
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder={isFa ? 'مثال: ۰۰۱۲۳۴۵۶۷۸ یا پاسپورت' : 'e.g., A12345678'}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142033] block">
                      {isFa ? 'تاریخ تولد (میلادی)' : 'Date of Birth (YYYY-MM-DD)'}
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                    />
                  </div>

                  {/* Anniversary Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142033] block">
                      {isFa ? 'تاریخ سالگرد ازدواج / پیوند (در صورت تأهل)' : 'Anniversary Date (Optional)'}
                    </label>
                    <input
                      type="date"
                      value={anniversaryDate}
                      onChange={(e) => setAnniversaryDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                    />
                  </div>

                  {/* Employment Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142033] block">
                      {isFa ? 'وضعیت شغلی فعلی' : 'Current Employment Status'}
                    </label>
                    <select
                      value={employmentStatus}
                      onChange={(e) => setEmploymentStatus(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                    >
                      <option value="">{isFa ? 'انتخاب کنید...' : 'Select status...'}</option>
                      <option value="employed">{isFa ? 'شاغل تمام‌وقت / کارمند' : 'Employed (Full-time)'}</option>
                      <option value="business_owner">{isFa ? 'صاحب کسب‌وکار / کارآفرین' : 'Business Owner / Entrepreneur'}</option>
                      <option value="freelancer">{isFa ? 'خویش‌فرما / فریلنسر' : 'Freelancer / Self-Employed'}</option>
                      <option value="student">{isFa ? 'دانشجو / پژوهشگر' : 'Student / Academic'}</option>
                      <option value="retired">{isFa ? 'بازنشسته' : 'Retired'}</option>
                      <option value="other">{isFa ? 'سایر' : 'Other'}</option>
                    </select>
                  </div>

                  {/* Education Level */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142033] block">
                      {isFa ? 'آخرین مدرک تحصیلی' : 'Highest Education Level'}
                    </label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                    >
                      <option value="">{isFa ? 'انتخاب کنید...' : 'Select level...'}</option>
                      <option value="high_school">{isFa ? 'دیپلم متوسطه' : 'High School Diploma'}</option>
                      <option value="bachelor">{isFa ? 'کارشناسی (لیسانس)' : "Bachelor's Degree"}</option>
                      <option value="master">{isFa ? 'کارشناسی ارشد (فوق‌لیسانس)' : "Master's Degree"}</option>
                      <option value="phd">{isFa ? 'دکتری تخصصی / فوق‌دکتری' : 'Ph.D. / Doctorate'}</option>
                      <option value="other">{isFa ? 'سایر مدارک تخصصی' : 'Other'}</option>
                    </select>
                  </div>

                </div>

                {/* Residential Address Fields */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142033] block">
                      {isFa ? 'نشانی دقیق محل سکونت فعلی' : 'Current Residential Address'}
                    </label>
                    <input
                      type="text"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder={isFa ? 'نام خیابان، کوچه، پلاک، واحد' : 'Street name, building, apartment number'}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#142033] block">
                        {isFa ? 'شهر و کشور محل سکونت' : 'City & Country'}
                      </label>
                      <input
                        type="text"
                        value={addressCity}
                        onChange={(e) => setAddressCity(e.target.value)}
                        placeholder={isFa ? 'مثال: تهران یا بخارست' : 'e.g., Tehran, Bucharest'}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#142033] block">
                        {isFa ? 'کد پستی ۱۰ رقمی' : 'Postal Code'}
                      </label>
                      <input
                        type="text"
                        value={addressPostalCode}
                        onChange={(e) => setAddressPostalCode(e.target.value)}
                        placeholder="1234567890"
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-3 rounded-2xl bg-[#2F6FED] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingProfile ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isFa ? 'در حال ذخیره‌سازی...' : 'Saving Changes...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        <span>{isFa ? 'ذخیره مشخصات پروفایل' : 'Save Profile Changes'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Family Network Section */}
            <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#142033] flex items-center space-x-2 rtl:space-x-reverse">
                    <Users size={20} className="text-[#2F6FED]" />
                    <span>{isFa ? 'اعضای خانواده متقاضی (شبکه خانوادگی)' : 'Family Network Members'}</span>
                  </h2>
                  <p className="text-xs text-[#526174] mt-1">
                    {isFa
                      ? 'همسر، فرزندان و بستگانی که قصد دارند در قالب پرونده پیوست یا اقامت همزمان همراه شما باشند.'
                      : 'Spouse, children, or relatives participating in reunification or concurrent immigration.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddFamilyModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#071B3D] hover:bg-blue-950 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2 shrink-0"
                >
                  <Users size={15} />
                  <span>{isFa ? '+ افزودن عضو خانواده' : '+ Add Family Member'}</span>
                </button>
              </div>

              {/* Family Members List */}
              {familyMembers.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                    👨‍👩‍👧‍👦
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    {isFa ? 'هنوز عضو خانواده‌ای اضافه نشده است' : 'No family members added yet'}
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {isFa
                      ? 'اگر قصد دارید همسر یا فرزندانتان را در پرونده اقامت رومانی همراه کنید، مشخصات اولیه آن‌ها را ثبت نمایید.'
                      : 'If you plan to include family members in your Romanian residency application, add them here.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {familyMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        member.id === lead.id
                          ? 'bg-blue-50/40 border-blue-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-extrabold text-[#142033]">
                              {member.full_name}
                            </span>
                            {member.is_family_primary && (
                              <span className="px-2 py-0.5 rounded-full bg-[#071B3D] text-white text-[9px] font-bold">
                                {isFa ? 'سرپرست' : 'Primary'}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#2F6FED] font-bold">
                            {getRelationLabel(member.relation_to_primary)}
                          </div>
                          {member.phone && (
                            <div className="text-[11px] text-slate-500 font-mono">
                              {member.phone}
                            </div>
                          )}
                          {member.date_of_birth && (
                            <div className="text-[10px] text-slate-400">
                              {isFa ? 'تولد: ' : 'DOB: '}
                              {member.date_of_birth}
                            </div>
                          )}
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                          {member.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* MODAL: ADD FAMILY MEMBER */}
        {showAddFamilyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
            <div
              className="bg-white border border-[#dfe6ef] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
              dir={isFa ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#2F6FED] flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#142033]">
                      {isFa ? 'افزودن عضو خانواده به پرونده' : 'Add Family Member to Case'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isFa ? 'ثبت مشخصات و اتصال به گروه خانوادگی' : 'Connect relative to family network'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddFamilyModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {memberSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-1.5 rtl:space-x-reverse">
                  <CheckCircle size={16} />
                  <span>{memberSuccess}</span>
                </div>
              )}
              {memberError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {memberError}
                </div>
              )}

              <form onSubmit={handleAddFamilyMember} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#142033] block">
                    {isFa ? 'نام و نام خانوادگی عضو خانواده *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder={isFa ? 'مثال: سارا محمدی' : 'e.g., Jane Doe'}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#142033] block">
                    {isFa ? 'نسبت با متقاضی اصلی *' : 'Relationship to Primary Applicant *'}
                  </label>
                  <select
                    value={newMemberRelation}
                    onChange={(e: any) => setNewMemberRelation(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                  >
                    <option value="spouse">{isFa ? 'همسر' : 'Spouse'}</option>
                    <option value="child">{isFa ? 'فرزند' : 'Child'}</option>
                    <option value="parent">{isFa ? 'پدر / مادر' : 'Parent'}</option>
                    <option value="sibling">{isFa ? 'خواهر / برادر' : 'Sibling'}</option>
                    <option value="other">{isFa ? 'سایر بستگان' : 'Other Relative'}</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142033] block">
                      {isFa ? 'تاریخ تولد (میلادی)' : 'Date of Birth'}
                    </label>
                    <input
                      type="date"
                      value={newMemberDob}
                      onChange={(e) => setNewMemberDob(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142033] block">
                      {isFa ? 'شماره تماس (اختیاری)' : 'Phone (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={newMemberPhone}
                      onChange={(e) => setNewMemberPhone(e.target.value)}
                      placeholder="+98 912..."
                      dir="ltr"
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#142033] block">
                    {isFa ? 'شماره شناسنامه / کد ملی / گذرنامه (اختیاری)' : 'National ID or Passport (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={newMemberNationalId}
                    onChange={(e) => setNewMemberNationalId(e.target.value)}
                    placeholder={isFa ? 'مثال: شماره گذرنامه یا کد ملی' : 'ID or Passport'}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                  />
                </div>

                <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl leading-relaxed border border-slate-200">
                  ℹ️ {isFa
                    ? 'عضو جدید خانواده با وضعیت جدید ثبت شده و پس از بررسی تیم حقوقی DORVIA، دسترسی و مراحل ویزای وی آغاز خواهد شد.'
                    : 'The family member will be registered under your family file. DORVIA staff will process their profile following evaluation.'}
                </p>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={addingMember}
                    onClick={() => setShowAddFamilyModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
                  >
                    {isFa ? 'انصراف' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={addingMember || !newMemberName.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {addingMember ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isFa ? 'در حال ثبت...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <span>{isFa ? 'ثبت عضو خانواده' : 'Save Member'}</span>
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
