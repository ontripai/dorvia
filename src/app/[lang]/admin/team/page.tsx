'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  Users,
  UserPlus,
  LockKeyhole,
  CheckCircle,
  LogOut,
  Mail,
  User,
  ShieldCheck,
  Settings,
  ArrowRight,
  ArrowLeft,
} from '@/components/Icons';

interface TeamPageProps {
  params: { lang: Language };
}

interface StaffMember {
  id: string;
  full_name: string | null;
  email: string | null;
  role_id: string;
  role: {
    id: string;
    key: string;
    label_fa: string;
    label_en: string;
  };
  is_active: boolean;
  telegram_chat_id: string | null;
  notify_email: boolean;
  notify_telegram: boolean;
  created_at: string;
}

interface RoleOption {
  id: string;
  key: string;
  label_fa: string;
  label_en: string;
}

export default function AdminTeamPage({ params }: TeamPageProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [team, setTeam] = useState<StaffMember[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRoleId, setInviteRoleId] = useState('');
  const [inviting, setInviting] = useState(false);

  // Feedback State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [updatingStaffId, setUpdatingStaffId] = useState<string | null>(null);

  const loadTeamData = async () => {
    try {
      setErrorMessage(null);
      const res = await fetch('/api/admin/team');
      if (res.status === 403) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      if (res.status === 401) {
        router.replace(`/${currentLang}/admin/login`);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setTeam(data.team || []);
        setRoles(data.roles || []);
        setCurrentAdmin(data.currentAdmin || null);
        if (!inviteRoleId && data.roles?.length > 0) {
          // Default to 'agent' or first non-owner role
          const defaultRole = data.roles.find((r: RoleOption) => r.key === 'agent') || data.roles[0];
          setInviteRoleId(defaultRole.id);
        }
      } else {
        setErrorMessage(data.error || (isFa ? 'خطا در بارگذاری اطلاعات تیم.' : 'Failed to load team.'));
      }
    } catch (err) {
      console.error('Failed to load team data:', err);
      setErrorMessage(isFa ? 'خطا در ارتباط با سرور.' : 'Network connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, [currentLang]);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace(`/${currentLang}/admin/login`);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteRoleId) {
      setErrorMessage(isFa ? 'لطفاً ایمیل و نقش را مشخص کنید.' : 'Please provide email and role.');
      return;
    }

    setInviting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/admin/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          full_name: inviteName,
          role_id: inviteRoleId,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(
          isFa
            ? `دعوت‌نامه با موفقیت برای ${inviteEmail} ارسال شد.`
            : `Invitation sent successfully to ${inviteEmail}.`
        );
        setInviteEmail('');
        setInviteName('');
        await loadTeamData();
      } else {
        setErrorMessage(data.error || (isFa ? 'ارسال دعوت‌نامه ناموفق بود.' : 'Failed to send invitation.'));
      }
    } catch (err) {
      console.error('Error inviting staff:', err);
      setErrorMessage(isFa ? 'خطا در ارتباط با سرور.' : 'Network connection error.');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (staffId: string, newRoleId: string) => {
    setUpdatingStaffId(staffId);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/admin/team/${staffId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_id: newRoleId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(isFa ? 'نقش کارمند با موفقیت به‌روزرسانی شد.' : 'Staff role updated successfully.');
        await loadTeamData();
      } else {
        setErrorMessage(data.error || (isFa ? 'تغییر نقش ناموفق بود.' : 'Failed to update role.'));
      }
    } catch (err) {
      console.error('Error updating staff role:', err);
      setErrorMessage(isFa ? 'خطا در ارتباط با سرور.' : 'Network connection error.');
    } finally {
      setUpdatingStaffId(null);
    }
  };

  const handleStatusToggle = async (staffId: string, currentStatus: boolean) => {
    setUpdatingStaffId(staffId);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/admin/team/${staffId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(
          isFa
            ? `وضعیت کارمند به ${!currentStatus ? 'فعال' : 'غیرفعال'} تغییر یافت.`
            : `Staff status updated to ${!currentStatus ? 'Active' : 'Inactive'}.`
        );
        await loadTeamData();
      } else {
        setErrorMessage(data.error || (isFa ? 'تغییر وضعیت ناموفق بود.' : 'Failed to update status.'));
      }
    } catch (err) {
      console.error('Error toggling staff status:', err);
      setErrorMessage(isFa ? 'خطا در ارتباط با سرور.' : 'Network connection error.');
    } finally {
      setUpdatingStaffId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#f7f9fc]">
        <div className="w-10 h-10 border-4 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs sm:text-sm text-[#526174] font-medium">
          {isFa ? 'در حال بارگذاری اطلاعات اعضای تیم...' : 'Loading team members...'}
        </p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#f7f9fc]" dir={isFa ? 'rtl' : 'ltr'}>
        <div className="max-w-md w-full bg-white border border-red-200 rounded-3xl p-8 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <LockKeyhole size={24} />
          </div>
          <h2 className="text-lg font-extrabold text-[#142033]">
            {isFa ? 'عدم دسترسی به مدیریت تیم' : 'Access Denied: Team Management'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isFa
              ? 'مشاهده و ویرایش اعضای تیم و نقش‌ها تنها برای مالکین و مدیران ارشد سیستم مجاز است.'
              : 'Viewing and managing team members and roles requires team.manage permission (Owner or Manager).'}
          </p>
          <Link
            href="/admin/leads"
            className="inline-flex items-center justify-center space-x-1.5 rtl:space-x-reverse px-5 py-2.5 rounded-xl bg-[#071B3D] text-white text-xs font-bold hover:bg-slate-800 transition-all"
          >
            <span>{isFa ? 'بازگشت به فهرست پرونده‌ها' : 'Return to Leads'}</span>
          </Link>
        </div>
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
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse">
                <Users size={13} />
                <span>{isFa ? 'مدیریت تیم و نقش‌های پرسنل' : 'Team & Role Governance'}</span>
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {currentAdmin?.email} ({currentAdmin?.roleKey})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isFa ? 'اعضای تیم و سطوح دسترسی' : 'Staff Directory & Access Control'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isFa
                ? 'دعوت همکاران جدید، تعیین و تغییر نقش‌های اداری، و مدیریت فعال/غیرفعال بودن حساب‌های پرسنل.'
                : 'Invite new staff, assign organizational roles, and govern active/inactive credentials.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/leads"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <span>{isFa ? 'پرونده‌های متقاضیان' : 'Case Files'}</span>
            </Link>

            <Link
              href="/admin/settings"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <Settings size={15} />
              <span>{isFa ? 'تنظیمات من' : 'My Settings'}</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold border border-red-500/30 transition-all cursor-pointer"
            >
              <LogOut size={15} />
              <span>{isFa ? 'خروج' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800">✕</button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-between">
            <span>✓ {successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-800">✕</button>
          </div>
        )}

        {/* MAIN LAYOUT: Grid of Invite Form + Staff Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Invite New Member Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-sm space-y-5 sticky top-6">
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse border-b border-slate-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2F6FED] flex items-center justify-center">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#142033]">
                    {isFa ? 'دعوت همکار جدید به پنل' : 'Invite New Staff Member'}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {isFa ? 'ارسال لینک ثبت‌نام ایمیلی و تخصیص نقش اولیه' : 'Dispatch invite email with initial role'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isFa ? 'ایمیل کاری همکار *' : 'Staff Work Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    placeholder="colleague@dorvia.ro"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-[#2F6FED] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isFa ? 'نام و نام خانوادگی' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={isFa ? 'مثلاً: مریم شریفی' : 'e.g. Maryam Sharifi'}
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#2F6FED] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isFa ? 'نقش سازمانی *' : 'Assigned Role *'}
                  </label>
                  <select
                    value={inviteRoleId}
                    onChange={(e) => setInviteRoleId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:border-[#2F6FED] focus:outline-none transition-colors"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {isFa ? r.label_fa : r.label_en} ({r.key})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {isFa
                      ? 'سطوح دسترسی اسناد و پرونده‌ها بر اساس این نقش اعمال خواهد شد.'
                      : 'Role governs document permissions and assignment visibility.'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full py-3 px-4 rounded-xl bg-[#2F6FED] hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer disabled:opacity-50"
                >
                  <UserPlus size={15} />
                  <span>
                    {inviting
                      ? (isFa ? 'در حال ارسال دعوت‌نامه...' : 'Sending Invitation...')
                      : (isFa ? 'ارسال دعوت‌نامه ورود' : 'Send Staff Invite')}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Team Members Directory (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <h2 className="text-base font-extrabold text-[#142033]">
                  {isFa ? 'فهرست کارکنان ثبت‌شده' : 'Active Staff Roster'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2F6FED] text-xs font-bold font-mono">
                  {team.length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {team.map((member) => (
                <div
                  key={member.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    !member.is_active
                      ? 'border-slate-200 bg-slate-50/70 opacity-75'
                      : 'border-[#dfe6ef] hover:border-slate-300'
                  }`}
                >
                  {/* Left info: avatar, name, email */}
                  <div className="flex items-center space-x-3.5 rtl:space-x-reverse min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                        member.role?.key === 'owner'
                          ? 'bg-amber-100 text-amber-800'
                          : member.role?.key === 'manager'
                          ? 'bg-purple-100 text-purple-800'
                          : member.is_active
                          ? 'bg-blue-100 text-[#2F6FED]'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {member.full_name ? member.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#142033] truncate">
                          {member.full_name || (isFa ? 'کاربر بدون نام' : 'Unnamed User')}
                        </span>
                        {member.id === currentAdmin?.id && (
                          <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-[#2F6FED] text-[10px] font-bold">
                            {isFa ? 'شما' : 'You'}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            member.is_active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-300'
                          }`}
                        >
                          {member.is_active ? (isFa ? 'فعال' : 'Active') : (isFa ? 'معلق / غیرفعال' : 'Suspended')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono" dir="ltr">{member.email || '—'}</span>
                        {member.telegram_chat_id && (
                          <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-mono">
                            TG: {member.telegram_chat_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right actions: Role Select + Active Toggle */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    {/* Role Dropdown */}
                    <div className="relative">
                      <select
                        value={member.role_id}
                        disabled={updatingStaffId === member.id}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer bg-white ${
                          member.role?.key === 'owner'
                            ? 'border-amber-300 text-amber-900 bg-amber-50/50'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {isFa ? r.label_fa : r.label_en} ({r.key})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Active Toggle Button */}
                    <button
                      onClick={() => handleStatusToggle(member.id, member.is_active)}
                      disabled={updatingStaffId === member.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        member.is_active
                          ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {member.is_active ? (isFa ? 'تعلیق / غیرفعال' : 'Deactivate') : (isFa ? 'فعال‌سازی' : 'Activate')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
