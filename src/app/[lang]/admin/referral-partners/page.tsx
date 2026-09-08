'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  Handshake,
  Users,
  Search,
  Plus,
  ArrowLeft,
  ArrowRight,
  LogOut,
  Settings,
  ChartNoAxesCombined,
  BookOpen,
  BriefcaseBusiness,
  AlertCircle,
  CheckCircle,
  Clock,
} from '@/components/Icons';

interface ReferralPartnersPageProps {
  params: { lang: Language };
}

interface PartnerItem {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  leads_count: number;
  qualified_leads_count?: number;
  closed_leads_count?: number;
}

interface LinkedLead {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  site_goal: string | null;
  created_at: string;
}

export default function ReferralPartnersAdminPage({ params }: ReferralPartnersPageProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [canEdit, setCanEdit] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLeadsModal, setShowLeadsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    notes: '',
    is_active: true,
  });
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [activePartnerLeads, setActivePartnerLeads] = useState<LinkedLead[]>([]);
  const [activePartnerName, setActivePartnerName] = useState<string>('');
  const [partnerToDelete, setPartnerToDelete] = useState<PartnerItem | null>(null);

  // Feedback states
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Load partners via Server API route (NO direct supabaseAdmin)
  const loadPartners = async () => {
    try {
      setLoading(true);
      setActionError(null);

      const res = await fetch('/api/admin/referral-partners');
      if (res.status === 401 || res.status === 403) {
        router.replace(`/${currentLang}/admin/login?error=unauthorized`);
        return;
      }

      const json = await res.json().catch(() => null);
      if (json?.success && Array.isArray(json.partners)) {
        setPartners(json.partners);
        setCanEdit(Boolean(json.canEdit));
      } else {
        setActionError(json?.error || (isFa ? 'خطا در بارگذاری فهرست همکاران معرف.' : 'Failed to load referral partners.'));
      }
    } catch (err: any) {
      console.error('Error fetching referral partners:', err);
      setActionError(isFa ? 'خطا در ارتباط با سرور.' : 'Network connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();

    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setAdminUser(user);
        }
      });
    }
  }, [currentLang]);

  // Filtered partners
  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const matchesSearch =
        !searchTerm.trim() ||
        p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.includes(searchTerm);

      const matchesStatus =
        activeFilter === 'all' ||
        (activeFilter === 'active' && p.is_active) ||
        (activeFilter === 'inactive' && !p.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [partners, searchTerm, activeFilter]);

  // Overall statistics
  const stats = useMemo(() => {
    const total = partners.length;
    const active = partners.filter((p) => p.is_active).length;
    const totalReferredLeads = partners.reduce((sum, p) => sum + (p.leads_count || 0), 0);
    const totalQualified = partners.reduce((sum, p) => sum + (p.qualified_leads_count || 0), 0);
    return { total, active, totalReferredLeads, totalQualified };
  }, [partners]);

  // Handler: Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      full_name: '',
      phone: '',
      email: '',
      notes: '',
      is_active: true,
    });
    setFormError(null);
    setShowAddModal(true);
  };

  // Handler: Submit Add
  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      setFormError(isFa ? 'نام و نام‌خانوادگی همکار الزامی است.' : 'Partner full name is required.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      const res = await fetch('/api/admin/referral-partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json().catch(() => null);
      if (res.ok && json?.success && json?.partner) {
        setPartners((prev) => [json.partner, ...prev]);
        setShowAddModal(false);
        setActionSuccess(isFa ? 'همکار معرف جدید با موفقیت ثبت شد.' : 'New referral partner created successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
      } else {
        setFormError(json?.error || (isFa ? 'خطا در ثبت اطلاعات همکار معرف.' : 'Failed to create partner.'));
      }
    } catch (err: any) {
      setFormError(err?.message || (isFa ? 'خطای سرور.' : 'Server exception.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Handler: Open Edit Modal
  const handleOpenEdit = (partner: PartnerItem) => {
    setEditingPartnerId(partner.id);
    setFormData({
      full_name: partner.full_name || '',
      phone: partner.phone || '',
      email: partner.email || '',
      notes: partner.notes || '',
      is_active: partner.is_active,
    });
    setFormError(null);
    setShowEditModal(true);
  };

  // Handler: Submit Edit
  const handleUpdatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartnerId) return;

    if (!formData.full_name.trim()) {
      setFormError(isFa ? 'نام و نام‌خانوادگی همکار الزامی است.' : 'Partner full name is required.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      const res = await fetch(`/api/admin/referral-partners/${editingPartnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json().catch(() => null);
      if (res.ok && json?.success && json?.partner) {
        setPartners((prev) =>
          prev.map((p) => (p.id === editingPartnerId ? { ...p, ...json.partner } : p))
        );
        setShowEditModal(false);
        setActionSuccess(isFa ? 'اطلاعات همکار معرف با موفقیت ویرایش شد.' : 'Partner updated successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
      } else {
        setFormError(json?.error || (isFa ? 'خطا در به‌روزرسانی همکار معرف.' : 'Failed to update partner.'));
      }
    } catch (err: any) {
      setFormError(err?.message || (isFa ? 'خطای سرور.' : 'Server exception.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Handler: View Linked Leads
  const handleViewLeads = async (partner: PartnerItem) => {
    setActivePartnerName(partner.full_name);
    setActivePartnerLeads([]);
    setShowLeadsModal(true);

    try {
      const res = await fetch(`/api/admin/referral-partners/${partner.id}`);
      const json = await res.json().catch(() => null);
      if (json?.success && Array.isArray(json.partner?.leads)) {
        setActivePartnerLeads(json.partner.leads);
      }
    } catch (err) {
      console.error('Error fetching partner leads:', err);
    }
  };

  // Handler: Delete partner
  const handleConfirmDelete = (partner: PartnerItem) => {
    setPartnerToDelete(partner);
    setActionError(null);
    setShowDeleteConfirmModal(true);
  };

  const executeDeletePartner = async () => {
    if (!partnerToDelete) return;

    try {
      setSubmitting(true);
      setActionError(null);

      const res = await fetch(`/api/admin/referral-partners/${partnerToDelete.id}`, {
        method: 'DELETE',
      });

      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        setPartners((prev) => prev.filter((p) => p.id !== partnerToDelete.id));
        setShowDeleteConfirmModal(false);
        setPartnerToDelete(null);
        setActionSuccess(isFa ? 'همکار معرف با موفقیت حذف شد.' : 'Referral partner deleted.');
        setTimeout(() => setActionSuccess(null), 4000);
      } else {
        setActionError(json?.error || (isFa ? 'امکان حذف همکار وجود ندارد.' : 'Failed to delete partner.'));
        setShowDeleteConfirmModal(false);
      }
    } catch (err: any) {
      setActionError(err?.message || (isFa ? 'خطا در ارتباط با سرور.' : 'Network error.'));
      setShowDeleteConfirmModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace(`/${currentLang}/admin/login`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return { label: isFa ? 'جدید' : 'New', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'contacted':
        return { label: isFa ? 'در حال مکاتبه' : 'Contacted', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'qualified':
        return { label: isFa ? 'واجد شرایط' : 'Qualified', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'closed':
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
          {isFa ? 'در حال بارگذاری اطلاعات همکاران معرف دورویا...' : 'Loading DORVIA referral partners...'}
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
                <Handshake size={14} />
                <span>{isFa ? 'مدیریت شرکا و معرفین' : 'Partners & Referrals'}</span>
              </span>
              <span className="text-xs text-slate-300">
                {adminUser?.email}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isFa ? 'شبکه همکاران معرف (Referral Partners)' : 'Referral Partners Network'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isFa
                ? 'ثبت و پایش همکاران معرف، گزارش لیدهای معرفی‌شده و تجمیع پرونده‌های منتسب بدون مداخله در فرآیند محاسبات مالی.'
                : 'Track referral partners, view referred lead histories, and oversee partnership cases.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/leads"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <span>{isFa ? 'پرونده‌ها' : 'Leads'}</span>
            </Link>

            <Link
              href="/admin/team"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <Users size={15} />
              <span>{isFa ? 'مدیریت تیم' : 'Team'}</span>
            </Link>

            <Link
              href="/admin/reports"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <ChartNoAxesCombined size={15} />
              <span>{isFa ? 'گزارش‌ها' : 'Reports'}</span>
            </Link>

            <Link
              href="/admin/blog"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <BookOpen size={15} />
              <span>{isFa ? 'بلاگ' : 'Blog'}</span>
            </Link>

            <Link
              href="/admin/jobs"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <BriefcaseBusiness size={15} />
              <span>{isFa ? 'فرصت‌های شغلی' : 'Jobs'}</span>
            </Link>

            <Link
              href="/admin/settings"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <Settings size={15} />
              <span>{isFa ? 'تنظیمات' : 'Settings'}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold border border-rose-400/30 transition-all"
            >
              <LogOut size={15} />
              <span>{isFa ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center space-x-2 rtl:space-x-reverse animate-fadeIn">
            <CheckCircle size={18} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center space-x-2 rtl:space-x-reverse animate-fadeIn">
            <AlertCircle size={18} />
            <span>{actionError}</span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 block mb-1">
              {isFa ? 'کل همکاران معرف' : 'Total Partners'}
            </span>
            <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
              <span className="text-3xl font-extrabold text-[#071B3D]">{stats.total}</span>
              <span className="text-xs text-slate-400 font-medium">{isFa ? 'شخص / شرکت' : 'entities'}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-emerald-600 block mb-1">
              {isFa ? 'همکاران فعال' : 'Active Partners'}
            </span>
            <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
              <span className="text-3xl font-extrabold text-emerald-700">{stats.active}</span>
              <span className="text-xs text-emerald-500 font-medium">{isFa ? 'آماده معرفی' : 'active'}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-blue-600 block mb-1">
              {isFa ? 'مجموع پرونده‌های جذب‌شده' : 'Total Referred Leads'}
            </span>
            <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
              <span className="text-3xl font-extrabold text-blue-700">{stats.totalReferredLeads}</span>
              <span className="text-xs text-blue-400 font-medium">{isFa ? 'متقاضی' : 'leads'}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-purple-600 block mb-1">
              {isFa ? 'پرونده‌های واجد شرایط' : 'Qualified Cases'}
            </span>
            <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
              <span className="text-3xl font-extrabold text-purple-700">{stats.totalQualified}</span>
              <span className="text-xs text-purple-400 font-medium">{isFa ? 'پرونده فعال' : 'in progress'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Search Filter */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute right-3.5 rtl:right-3.5 ltr:left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isFa ? 'جستجو بر اساس نام، شماره تلفن یا ایمیل...' : 'Search partners...'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED] transition-all"
              />
            </div>

            <div className="flex items-center space-x-1 rtl:space-x-reverse bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === 'all'
                    ? 'bg-white text-[#071B3D] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isFa ? 'همه' : 'All'}
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === 'active'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isFa ? 'فقط فعال' : 'Active'}
              </button>
              <button
                onClick={() => setActiveFilter('inactive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === 'inactive'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isFa ? 'غیرفعال' : 'Inactive'}
              </button>
            </div>
          </div>

          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center justify-center space-x-1.5 rtl:space-x-reverse px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all whitespace-nowrap"
            >
              <Plus size={16} />
              <span>{isFa ? 'افزودن همکار معرف جدید' : 'New Referral Partner'}</span>
            </button>
          )}
        </div>

        {/* Partners Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right rtl:text-right ltr:text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-4 sm:px-6">{isFa ? 'نام و مشخصات همکار' : 'Partner Name'}</th>
                  <th className="p-4 sm:px-6">{isFa ? 'اطلاعات تماس' : 'Contact'}</th>
                  <th className="p-4 sm:px-6 text-center">{isFa ? 'وضعیت' : 'Status'}</th>
                  <th className="p-4 sm:px-6 text-center">{isFa ? 'پرونده‌های منتسب' : 'Referred Leads'}</th>
                  <th className="p-4 sm:px-6">{isFa ? 'تاریخ ثبت' : 'Registered Date'}</th>
                  <th className="p-4 sm:px-6 text-center">{isFa ? 'عملیات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPartners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                      {isFa
                        ? 'هیچ همکار معرفی با شرایط فیلتر انتخاب‌شده یافت نشد.'
                        : 'No referral partners found matching criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredPartners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 sm:px-6">
                        <div className="font-bold text-[#071B3D] text-sm sm:text-base">
                          {partner.full_name}
                        </div>
                        {partner.notes && (
                          <div className="text-xs text-slate-500 truncate max-w-xs mt-0.5" title={partner.notes}>
                            {partner.notes}
                          </div>
                        )}
                      </td>

                      <td className="p-4 sm:px-6">
                        <div className="text-xs text-slate-700 font-medium">{partner.phone || '—'}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{partner.email || '—'}</div>
                      </td>

                      <td className="p-4 sm:px-6 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                            partner.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          {partner.is_active ? (isFa ? 'فعال' : 'Active') : isFa ? 'غیرفعال' : 'Inactive'}
                        </span>
                      </td>

                      <td className="p-4 sm:px-6 text-center">
                        <button
                          onClick={() => handleViewLeads(partner)}
                          className="inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-all"
                        >
                          <span>{partner.leads_count}</span>
                          <span>{isFa ? 'پرونده' : 'leads'}</span>
                        </button>
                      </td>

                      <td className="p-4 sm:px-6 text-xs text-slate-500 font-mono">
                        {new Date(partner.created_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US')}
                      </td>

                      <td className="p-4 sm:px-6 text-center">
                        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => handleViewLeads(partner)}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title={isFa ? 'مشاهده پرونده‌ها' : 'View cases'}
                          >
                            <Users size={16} />
                          </button>

                          {canEdit && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(partner)}
                                className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                              >
                                {isFa ? 'ویرایش' : 'Edit'}
                              </button>

                              <button
                                onClick={() => handleConfirmDelete(partner)}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all"
                              >
                                {isFa ? 'حذف' : 'Delete'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL: ADD PARTNER */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#071B3D] flex items-center space-x-2 rtl:space-x-reverse">
                <Handshake size={20} className="text-[#2F6FED]" />
                <span>{isFa ? 'ثبت همکار معرف جدید' : 'New Referral Partner'}</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePartner} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isFa ? 'نام و نام‌خانوادگی / نام شرکت یا نماینده *' : 'Full Name / Agency *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder={isFa ? 'مثال: مهندس رضوانی (دفتر شیراز)' : 'e.g. John Doe Consulting'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isFa ? 'شماره تماس / واتس‌اپ' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+98 912 000 0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isFa ? 'ایمیل' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="partner@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isFa ? 'توضیحات و یادداشت‌های هماهنگی' : 'Notes & Collaboration Details'}
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={isFa ? 'زمینه معرفی، نحوه توافق، اطلاعات حساب یا شهر فعالیت...' : 'Notes...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                />
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse pt-1">
                <input
                  type="checkbox"
                  id="add_is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#2F6FED] rounded focus:ring-[#2F6FED]"
                />
                <label htmlFor="add_is_active" className="text-slate-700 font-bold cursor-pointer">
                  {isFa ? 'همکار فعال است (در لیست انتخابگر لیدها نمایش داده شود)' : 'Active (Available in dropdown)'}
                </label>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {submitting ? (isFa ? 'در حال ثبت...' : 'Saving...') : isFa ? 'ثبت همکار معرف' : 'Save Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PARTNER */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#071B3D] flex items-center space-x-2 rtl:space-x-reverse">
                <Handshake size={20} className="text-[#2F6FED]" />
                <span>{isFa ? 'ویرایش اطلاعات همکار معرف' : 'Edit Referral Partner'}</span>
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleUpdatePartner} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isFa ? 'نام و نام‌خانوادگی / نام شرکت یا نماینده *' : 'Full Name / Agency *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isFa ? 'شماره تماس / واتس‌اپ' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isFa ? 'ایمیل' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isFa ? 'توضیحات و یادداشت‌های هماهنگی' : 'Notes & Details'}
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
                />
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse pt-1">
                <input
                  type="checkbox"
                  id="edit_is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#2F6FED] rounded focus:ring-[#2F6FED]"
                />
                <label htmlFor="edit_is_active" className="text-slate-700 font-bold cursor-pointer">
                  {isFa ? 'همکار فعال است (در لیست انتخابگر لیدها نمایش داده شود)' : 'Active (Available in dropdown)'}
                </label>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {submitting ? (isFa ? 'در حال ذخیره...' : 'Updating...') : isFa ? 'ذخیره تغییرات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LINKED LEADS REPORT DRAWER */}
      {showLeadsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#071B3D]">
                  {isFa ? `پرونده‌های منتسب به: ${activePartnerName}` : `Referred Leads: ${activePartnerName}`}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isFa
                    ? 'گزارش ردیابی متقاضیان جذب‌شده از طریق این همکار (صرفاً گزارش‌گیری، بدون محاسبه مبلغ کمیسیون).'
                    : 'List of leads referred by this partner (reporting only).'}
                </p>
              </div>
              <button
                onClick={() => setShowLeadsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {activePartnerLeads.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  {isFa ? 'هنوز هیچ پرونده‌ای به این همکار منتسب نشده است.' : 'No cases referred yet.'}
                </div>
              ) : (
                activePartnerLeads.map((lead) => {
                  const badge = getStatusBadge(lead.status);
                  return (
                    <div
                      key={lead.id}
                      className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-4 hover:bg-slate-100/70 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-[#071B3D] text-sm">{lead.full_name}</div>
                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                          {lead.phone && <span>📞 {lead.phone}</span>}
                          {lead.email && <span className="font-mono">✉️ {lead.email}</span>}
                          {lead.site_goal && <span>🎯 {lead.site_goal}</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {new Date(lead.created_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US')}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>

                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="px-3 py-1.5 rounded-xl bg-[#071B3D] hover:bg-blue-900 text-white text-xs font-bold transition-all"
                        >
                          {isFa ? 'مشاهده پرونده' : 'View Case'}
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowLeadsModal(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
              >
                {isFa ? 'بستن' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {showDeleteConfirmModal && partnerToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-scaleUp">
            <h3 className="text-base font-extrabold text-[#071B3D]">
              {isFa ? 'تأیید حذف همکار معرف' : 'Confirm Partner Deletion'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isFa
                ? `آیا از حذف همکار معرف «${partnerToDelete.full_name}» اطمینان دارید؟ در صورتی که پرونده‌ای به ایشان متصل باشد، حذف مسدود شده و پیشنهاد می‌گردد وضعیت ایشان به غیرفعال تغییر یابد.`
                : `Are you sure you want to delete "${partnerToDelete.full_name}"?`}
            </p>

            <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-2">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                {isFa ? 'انصراف' : 'Cancel'}
              </button>
              <button
                onClick={executeDeletePartner}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? (isFa ? 'در حال حذف...' : 'Deleting...') : isFa ? 'بله، حذف شود' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
