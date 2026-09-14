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
  ShieldCheck,
  CreditCard,
  Building2,
  FileText,
  Plus,
  Check,
  X,
  Info,
} from '@/components/Icons';

interface AdminOnboardingPageProps {
  params: { lang: Language };
}

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

interface AdminUserContext {
  adminUserId: string;
  email: string;
  roleKey: string;
  permissions: string[];
}

interface LeadCompact {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  status?: string;
  verified_at?: string | null;
}

interface ExchangeProfileRecord {
  id: string;
  lead_id: string;
  exchange_status: 'not_requested' | 'pending' | 'approved' | 'rejected' | 'suspended';
  approved_by: string | null;
  approved_at: string | null;
  suspended_reason: string | null;
  completed_trades: number;
  failed_trades: number;
  free_cancellations_30d: number;
  created_at: string;
  updated_at: string;
  lead?: LeadCompact | null;
  approver?: { id: string; full_name: string | null } | null;
}

interface ExchangeAccountRecord {
  id: string;
  lead_id: string;
  kind: 'IR_SHEBA' | 'IR_CARD' | 'RO_IBAN';
  value: string;
  holder_name: string;
  related_party_id: string | null;
  authorized_recipient_id: string | null;
  verified_at: string | null;
  verified_by_admin_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  lead?: LeadCompact | null;
  related_party?: {
    id: string;
    full_name: string;
    relationship: string;
    party_type: string;
    status: string;
  } | null;
  authorized_recipient?: {
    id: string;
    recipient_lead_id: string;
    relationship: string;
    status: string;
  } | null;
  verified_by?: {
    id: string;
    full_name: string | null;
  } | null;
}

interface ExchangeRelatedPartyRecord {
  id: string;
  lead_id: string;
  party_type: 'person' | 'company';
  full_name: string;
  relationship: string;
  national_id: string;
  id_document_id: string | null;
  country: string;
  status: 'pending' | 'approved' | 'rejected';
  verified_by_admin_id: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  lead?: LeadCompact | null;
  id_document?: {
    id: string;
    document_type: string;
    file_path: string;
  } | null;
  verified_by?: {
    id: string;
    full_name: string | null;
  } | null;
}

interface ExchangeAuthorizedRecipientRecord {
  id: string;
  lead_id: string;
  recipient_lead_id: string;
  relationship: string;
  status: 'pending' | 'approved' | 'revoked';
  verified_by_admin_id: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  lead?: LeadCompact | null;
  recipient?: LeadCompact | null;
  verified_by?: {
    id: string;
    full_name: string | null;
  } | null;
}

interface LeadDocumentCompact {
  id: string;
  file_name: string;
  document_type: string;
  label: string | null;
  mime_type: string | null;
  created_at: string;
}

type TabKey = 'profiles' | 'accounts' | 'related_parties' | 'authorized_recipients';

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export default function AdminExchangeOnboardingPage({ params }: AdminOnboardingPageProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>('profiles');
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Admin user context (permissions extracted strictly from onboarding API response)
  const [adminUser, setAdminUser] = useState<AdminUserContext | null>(null);

  // Global list of all profiles (for recipient status lookup & dropdown selection)
  const [allProfiles, setAllProfiles] = useState<ExchangeProfileRecord[]>([]);

  // Section 1: Profiles
  const [profiles, setProfiles] = useState<ExchangeProfileRecord[]>([]);
  const [profilesTotal, setProfilesTotal] = useState<number>(0);
  const [profilesStatusFilter, setProfilesStatusFilter] = useState<string>('pending');
  const [pendingProfilesCount, setPendingProfilesCount] = useState<number>(0);

  // Section 2: Accounts
  const [accounts, setAccounts] = useState<ExchangeAccountRecord[]>([]);
  const [accountsTotal, setAccountsTotal] = useState<number>(0);
  const [accountsStatusFilter, setAccountsStatusFilter] = useState<string>('unverified');
  const [unverifiedAccountsCount, setUnverifiedAccountsCount] = useState<number>(0);

  // Section 3: Related Parties
  const [relatedParties, setRelatedParties] = useState<ExchangeRelatedPartyRecord[]>([]);
  const [partiesTotal, setPartiesTotal] = useState<number>(0);
  const [relatedPartiesStatusFilter, setRelatedPartiesStatusFilter] = useState<string>('pending');
  const [pendingRelatedPartiesCount, setPendingRelatedPartiesCount] = useState<number>(0);

  // Section 4: Authorized Recipients
  const [authorizedRecipients, setAuthorizedRecipients] = useState<ExchangeAuthorizedRecipientRecord[]>([]);
  const [recipientsTotal, setRecipientsTotal] = useState<number>(0);
  const [authorizedRecipientsStatusFilter, setAuthorizedRecipientsStatusFilter] = useState<string>('pending');
  const [pendingRecipientsCount, setPendingRecipientsCount] = useState<number>(0);

  // Customer Documents (for Add Related Party document selector)
  const [customerDocuments, setCustomerDocuments] = useState<LeadDocumentCompact[]>([]);
  const [loadingCustomerDocuments, setLoadingCustomerDocuments] = useState<boolean>(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // ---------------------------------------------------------------------------
  // Action Modals State
  // ---------------------------------------------------------------------------

  // Profile Action Modal
  const [profileModal, setProfileModal] = useState<{
    isOpen: boolean;
    profile: ExchangeProfileRecord | null;
    targetStatus: 'approved' | 'rejected' | 'suspended';
    suspendedReason: string;
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    profile: null,
    targetStatus: 'approved',
    suspendedReason: '',
    isSubmitting: false,
    error: null,
  });

  // Account Verify Modal
  const [accountModal, setAccountModal] = useState<{
    isOpen: boolean;
    account: ExchangeAccountRecord | null;
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    account: null,
    isSubmitting: false,
    error: null,
  });

  // Related Party Action Modal
  const [partyModal, setPartyModal] = useState<{
    isOpen: boolean;
    party: ExchangeRelatedPartyRecord | null;
    targetStatus: 'approved' | 'rejected';
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    party: null,
    targetStatus: 'approved',
    isSubmitting: false,
    error: null,
  });

  // Authorized Recipient Action Modal
  const [recipientModal, setRecipientModal] = useState<{
    isOpen: boolean;
    recipient: ExchangeAuthorizedRecipientRecord | null;
    targetStatus: 'approved' | 'revoked';
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    recipient: null,
    targetStatus: 'approved',
    isSubmitting: false,
    error: null,
  });

  // Add Related Party Form Modal
  const [addPartyModal, setAddPartyModal] = useState<{
    isOpen: boolean;
    leadId: string;
    partyType: 'person' | 'company';
    fullName: string;
    relationship: string;
    nationalId: string;
    idDocumentId: string;
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    leadId: '',
    partyType: 'person',
    fullName: '',
    relationship: 'father',
    nationalId: '',
    idDocumentId: '',
    isSubmitting: false,
    error: null,
  });

  // Add Authorized Recipient Form Modal
  const [addRecipientModal, setAddRecipientModal] = useState<{
    isOpen: boolean;
    leadId: string;
    recipientLeadId: string;
    relationship: string;
    isSubmitting: boolean;
    error: string | null;
  }>({
    isOpen: false,
    leadId: '',
    recipientLeadId: '',
    relationship: '',
    isSubmitting: false,
    error: null,
  });

  // ---------------------------------------------------------------------------
  // Data Fetching & Sync
  // ---------------------------------------------------------------------------

  // Map of profile status by lead_id for instant recipient status lookup
  const profileStatusByLeadId = useMemo(() => {
    const map = new Map<string, ExchangeProfileRecord>();
    for (const p of allProfiles) {
      map.set(p.lead_id, p);
    }
    return map;
  }, [allProfiles]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setErrorStatus(null);
    setErrorMessage(null);

    try {
      // 1. Fetch all profiles for dropdown options and recipient lookup (limit 100)
      const allProfilesRes = await fetch('/api/admin/exchange/onboarding/profiles?status=all&limit=100');
      if (allProfilesRes.status === 403) {
        setErrorStatus(403);
        setLoading(false);
        return;
      }
      if (!allProfilesRes.ok) {
        throw new Error(isFa ? 'خطا در بارگذاری فهرست پرونده‌ها' : 'Failed to fetch exchange profiles');
      }
      const allProfilesData = await allProfilesRes.json();
      setAllProfiles(allProfilesData.profiles || []);
      if (allProfilesData.admin) {
        setAdminUser(allProfilesData.admin);
      }

      // 2. Fetch Section 1: Profiles with current filter
      const profilesRes = await fetch(`/api/admin/exchange/onboarding/profiles?status=${profilesStatusFilter}&limit=100`);
      if (profilesRes.ok) {
        const pData = await profilesRes.json();
        setProfiles(pData.profiles || []);
        setProfilesTotal(pData.pagination?.total ?? (pData.profiles?.length || 0));
      }

      // Also get pending profiles count
      if (profilesStatusFilter === 'pending') {
        const countRes = await profilesRes.clone().json();
        setPendingProfilesCount(countRes.pagination?.total ?? (countRes.profiles?.length || 0));
      } else {
        const pendingRes = await fetch('/api/admin/exchange/onboarding/profiles?status=pending&limit=1');
        if (pendingRes.ok) {
          const pendingData = await pendingRes.json();
          setPendingProfilesCount(pendingData.pagination?.total ?? 0);
        }
      }

      // 3. Fetch Section 2: Accounts with current filter
      const accountsRes = await fetch(`/api/admin/exchange/onboarding/accounts?status=${accountsStatusFilter}&limit=100`);
      if (accountsRes.ok) {
        const aData = await accountsRes.json();
        setAccounts(aData.accounts || []);
        setAccountsTotal(aData.pagination?.total ?? (aData.accounts?.length || 0));
      }

      // Accounts unverified count
      if (accountsStatusFilter === 'unverified') {
        const countRes = await accountsRes.clone().json();
        setUnverifiedAccountsCount(countRes.pagination?.total ?? (countRes.accounts?.length || 0));
      } else {
        const unverifiedRes = await fetch('/api/admin/exchange/onboarding/accounts?status=unverified&limit=1');
        if (unverifiedRes.ok) {
          const unverifiedData = await unverifiedRes.json();
          setUnverifiedAccountsCount(unverifiedData.pagination?.total ?? 0);
        }
      }

      // 4. Fetch Section 3: Related Parties with current filter
      const partiesRes = await fetch(`/api/admin/exchange/onboarding/related-parties?status=${relatedPartiesStatusFilter}&limit=100`);
      if (partiesRes.ok) {
        const ptData = await partiesRes.json();
        setRelatedParties(ptData.relatedParties || []);
        setPartiesTotal(ptData.pagination?.total ?? (ptData.relatedParties?.length || 0));
      }

      // Related parties pending count
      if (relatedPartiesStatusFilter === 'pending') {
        const countRes = await partiesRes.clone().json();
        setPendingRelatedPartiesCount(countRes.pagination?.total ?? (countRes.relatedParties?.length || 0));
      } else {
        const pendingPtRes = await fetch('/api/admin/exchange/onboarding/related-parties?status=pending&limit=1');
        if (pendingPtRes.ok) {
          const pendingPtData = await pendingPtRes.json();
          setPendingRelatedPartiesCount(pendingPtData.pagination?.total ?? 0);
        }
      }

      // 5. Fetch Section 4: Authorized Recipients with current filter
      const recRes = await fetch(`/api/admin/exchange/onboarding/authorized-recipients?status=${authorizedRecipientsStatusFilter}&limit=100`);
      if (recRes.ok) {
        const rData = await recRes.json();
        setAuthorizedRecipients(rData.authorizedRecipients || []);
        setRecipientsTotal(rData.pagination?.total ?? (rData.authorizedRecipients?.length || 0));
      }

      // Recipients pending count
      if (authorizedRecipientsStatusFilter === 'pending') {
        const countRes = await recRes.clone().json();
        setPendingRecipientsCount(countRes.pagination?.total ?? (countRes.authorizedRecipients?.length || 0));
      } else {
        const pendingRRes = await fetch('/api/admin/exchange/onboarding/authorized-recipients?status=pending&limit=1');
        if (pendingRRes.ok) {
          const pendingRData = await pendingRRes.json();
          setPendingRecipientsCount(pendingRData.pagination?.total ?? 0);
        }
      }
    } catch (err: any) {
      console.error('Error fetching onboarding data:', err);
      setErrorMessage(err.message || (isFa ? 'خطا در برقراری ارتباط با سرور' : 'Error loading data'));
    } finally {
      setLoading(false);
    }
  }, [isFa, profilesStatusFilter, accountsStatusFilter, relatedPartiesStatusFilter, authorizedRecipientsStatusFilter]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Handle logout
  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push(`/${currentLang}/admin/login`);
  };

  // Toast auto-hide
  useEffect(() => {
    if (successToast) {
      const t = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [successToast]);

  // ---------------------------------------------------------------------------
  // Status Badge Formatting Helpers
  // ---------------------------------------------------------------------------

  const getProfileBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          label: isFa ? 'تاییدشده' : 'Approved',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
        };
      case 'pending':
        return {
          label: isFa ? 'در انتظار بررسی' : 'Pending Review',
          classes: 'bg-amber-50 text-amber-700 border-amber-300 font-bold animate-pulse',
        };
      case 'suspended':
        return {
          label: isFa ? 'معلق‌شده' : 'Suspended',
          classes: 'bg-rose-50 text-rose-700 border-rose-300 font-bold',
        };
      case 'rejected':
        return {
          label: isFa ? 'ردشده' : 'Rejected',
          classes: 'bg-slate-100 text-slate-700 border-slate-300',
        };
      default:
        return {
          label: isFa ? 'درخواست‌نشده' : 'Not Requested',
          classes: 'bg-slate-100 text-slate-500 border-slate-200',
        };
    }
  };

  const getGeneralStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          label: isFa ? 'تاییدشده' : 'Approved',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
        };
      case 'pending':
        return {
          label: isFa ? 'در انتظار تایید' : 'Pending',
          classes: 'bg-amber-50 text-amber-700 border-amber-300 font-bold',
        };
      case 'rejected':
        return {
          label: isFa ? 'ردشده' : 'Rejected',
          classes: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'revoked':
        return {
          label: isFa ? 'ابطال‌شده' : 'Revoked',
          classes: 'bg-slate-100 text-slate-600 border-slate-300',
        };
      default:
        return {
          label: status,
          classes: 'bg-slate-100 text-slate-600 border-slate-200',
        };
    }
  };

  const formatRelationship = (rel: string) => {
    const map: Record<string, string> = {
      father: isFa ? 'پدر' : 'Father',
      mother: isFa ? 'مادر' : 'Mother',
      spouse: isFa ? 'همسر' : 'Spouse',
      child: isFa ? 'فرزند' : 'Child',
      sibling: isFa ? 'خواهر / برادر' : 'Sibling',
      own_company: isFa ? 'شرکت شخصی مشتری' : 'Customer-Owned Company',
    };
    return map[rel] || rel;
  };

  // ---------------------------------------------------------------------------
  // Action Handlers (All refetch from server upon completion)
  // ---------------------------------------------------------------------------

  // 1. Profile Status Update
  const handleConfirmProfileStatus = async () => {
    if (!profileModal.profile) return;
    if (profileModal.targetStatus === 'suspended' && !profileModal.suspendedReason.trim()) {
      setProfileModal((prev) => ({
        ...prev,
        error: isFa ? 'لطفاً دلیل تعلیق پرونده را حتماً وارد نمایید.' : 'Suspension reason is strictly required.',
      }));
      return;
    }

    setProfileModal((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const res = await fetch(`/api/admin/exchange/onboarding/profiles/${profileModal.profile.lead_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exchange_status: profileModal.targetStatus,
          suspended_reason: profileModal.targetStatus === 'suspended' ? profileModal.suspendedReason.trim() : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isFa ? 'تغییر وضعیت پرونده با خطا مواجه شد.' : 'Failed to update profile'));
      }

      setProfileModal({
        isOpen: false,
        profile: null,
        targetStatus: 'approved',
        suspendedReason: '',
        isSubmitting: false,
        error: null,
      });

      setSuccessToast(isFa ? 'وضعیت پرونده با موفقیت به‌روزرسانی شد.' : 'Profile updated successfully.');
      await fetchAllData();
    } catch (err: any) {
      setProfileModal((prev) => ({ ...prev, isSubmitting: false, error: err.message }));
    }
  };

  // 2. Verify Bank Account
  const handleConfirmVerifyAccount = async () => {
    if (!accountModal.account) return;

    setAccountModal((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const res = await fetch(`/api/admin/exchange/onboarding/accounts/${accountModal.account.id}/verify`, {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isFa ? 'تایید حساب بانکی با خطا مواجه شد.' : 'Failed to verify account'));
      }

      setAccountModal({
        isOpen: false,
        account: null,
        isSubmitting: false,
        error: null,
      });

      setSuccessToast(isFa ? 'حساب بانکی مقصد با موفقیت تایید و احراز شد.' : 'Bank account verified successfully.');
      await fetchAllData();
    } catch (err: any) {
      setAccountModal((prev) => ({ ...prev, isSubmitting: false, error: err.message }));
    }
  };

  // 3. Related Party Status Update
  const handleConfirmPartyStatus = async () => {
    if (!partyModal.party) return;

    setPartyModal((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const res = await fetch(`/api/admin/exchange/onboarding/related-parties/${partyModal.party.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: partyModal.targetStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isFa ? 'تغییر وضعیت بستگان با خطا مواجه شد.' : 'Failed to update related party'));
      }

      setPartyModal({
        isOpen: false,
        party: null,
        targetStatus: 'approved',
        isSubmitting: false,
        error: null,
      });

      setSuccessToast(isFa ? 'وضعیت بستگان/شرکت با موفقیت ثبت شد.' : 'Related party status updated successfully.');
      await fetchAllData();
    } catch (err: any) {
      setPartyModal((prev) => ({ ...prev, isSubmitting: false, error: err.message }));
    }
  };

  // 4. Authorized Recipient Status Update
  const handleConfirmRecipientStatus = async () => {
    if (!recipientModal.recipient) return;

    setRecipientModal((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const res = await fetch(`/api/admin/exchange/onboarding/authorized-recipients/${recipientModal.recipient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: recipientModal.targetStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isFa ? 'تغییر وضعیت گیرنده مجاز با خطا مواجه شد.' : 'Failed to update authorized recipient'));
      }

      setRecipientModal({
        isOpen: false,
        recipient: null,
        targetStatus: 'approved',
        isSubmitting: false,
        error: null,
      });

      setSuccessToast(isFa ? 'وضعیت گیرنده مجاز با موفقیت ثبت شد.' : 'Authorized recipient status updated.');
      await fetchAllData();
    } catch (err: any) {
      setRecipientModal((prev) => ({ ...prev, isSubmitting: false, error: err.message }));
    }
  };

  // Fetch documents for the selected customer in Add Related Party form
  const handleLeadSelectForParty = async (selectedLeadId: string) => {
    setAddPartyModal((prev) => ({ ...prev, leadId: selectedLeadId, idDocumentId: '', error: null }));
    if (!selectedLeadId) {
      setCustomerDocuments([]);
      return;
    }
    setLoadingCustomerDocuments(true);
    try {
      const res = await fetch(`/api/admin/exchange/onboarding/leads/${selectedLeadId}/documents`);
      if (res.ok) {
        const data = await res.json();
        setCustomerDocuments(data.documents || []);
      } else {
        setCustomerDocuments([]);
      }
    } catch (err) {
      console.error('Error fetching customer documents:', err);
      setCustomerDocuments([]);
    } finally {
      setLoadingCustomerDocuments(false);
    }
  };

  // 5. Submit New Related Party
  const handleCreateRelatedParty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addPartyModal.leadId) {
      setAddPartyModal((prev) => ({ ...prev, error: isFa ? 'لطفاً مشتری را انتخاب کنید.' : 'Customer is required.' }));
      return;
    }
    if (!addPartyModal.fullName.trim()) {
      setAddPartyModal((prev) => ({ ...prev, error: isFa ? 'نام و نام خانوادگی الزامی است.' : 'Full name is required.' }));
      return;
    }
    if (!addPartyModal.nationalId.trim()) {
      setAddPartyModal((prev) => ({ ...prev, error: isFa ? 'کد ملی / شناسه ملی الزامی است.' : 'National ID is required.' }));
      return;
    }
    if (addPartyModal.partyType === 'company' && !addPartyModal.idDocumentId) {
      setAddPartyModal((prev) => ({
        ...prev,
        error: isFa
          ? 'برای ثبت شرکت متعلق به مشتری، انتخاب مدرک ثبتی یا هویتی الزامی است.'
          : 'Document selection is mandatory for customer-owned company.',
      }));
      return;
    }

    setAddPartyModal((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const res = await fetch('/api/admin/exchange/onboarding/related-parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: addPartyModal.leadId,
          party_type: addPartyModal.partyType,
          full_name: addPartyModal.fullName.trim(),
          relationship: addPartyModal.partyType === 'company' ? 'own_company' : addPartyModal.relationship,
          national_id: addPartyModal.nationalId.trim(),
          id_document_id: addPartyModal.idDocumentId ? addPartyModal.idDocumentId.trim() : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isFa ? 'ثبت اطلاعات با خطا مواجه شد.' : 'Failed to register related party'));
      }

      setAddPartyModal({
        isOpen: false,
        leadId: '',
        partyType: 'person',
        fullName: '',
        relationship: 'father',
        nationalId: '',
        idDocumentId: '',
        isSubmitting: false,
        error: null,
      });
      setCustomerDocuments([]);

      setSuccessToast(isFa ? 'بستگان / شرکت مشتری با وضعیت در انتظار تایید ثبت شد.' : 'Related party registered in pending status.');
      await fetchAllData();
    } catch (err: any) {
      setAddPartyModal((prev) => ({ ...prev, isSubmitting: false, error: err.message }));
    }
  };

  // 6. Submit New Authorized Recipient
  const handleCreateAuthorizedRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addRecipientModal.leadId) {
      setAddRecipientModal((prev) => ({ ...prev, error: isFa ? 'لطفاً مشتری را انتخاب کنید.' : 'Customer lead is required.' }));
      return;
    }
    if (!addRecipientModal.recipientLeadId) {
      setAddRecipientModal((prev) => ({ ...prev, error: isFa ? 'لطفاً گیرنده مجاز در رومانی را انتخاب کنید.' : 'Recipient lead is required.' }));
      return;
    }
    if (addRecipientModal.leadId === addRecipientModal.recipientLeadId) {
      setAddRecipientModal((prev) => ({
        ...prev,
        error: isFa ? 'گیرنده مجاز نمی‌تواند خود مشتری باشد.' : 'Customer and recipient cannot be the same person.',
      }));
      return;
    }
    if (!addRecipientModal.relationship.trim()) {
      setAddRecipientModal((prev) => ({
        ...prev,
        error: isFa ? 'نسبت یا ارتباط را وارد نمایید.' : 'Relationship is required.',
      }));
      return;
    }

    setAddRecipientModal((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const res = await fetch('/api/admin/exchange/onboarding/authorized-recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: addRecipientModal.leadId,
          recipient_lead_id: addRecipientModal.recipientLeadId,
          relationship: addRecipientModal.relationship.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isFa ? 'ثبت گیرنده مجاز با خطا مواجه شد.' : 'Failed to register recipient'));
      }

      setAddRecipientModal({
        isOpen: false,
        leadId: '',
        recipientLeadId: '',
        relationship: '',
        isSubmitting: false,
        error: null,
      });

      setSuccessToast(isFa ? 'گیرنده مجاز با وضعیت در انتظار تایید ثبت شد.' : 'Authorized recipient registered in pending status.');
      await fetchAllData();
    } catch (err: any) {
      setAddRecipientModal((prev) => ({ ...prev, isSubmitting: false, error: err.message }));
    }
  };

  // ---------------------------------------------------------------------------
  // Filtered Lists for UI
  // ---------------------------------------------------------------------------

  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) return profiles;
    const q = searchQuery.toLowerCase().trim();
    return profiles.filter((p) => {
      const name = p.lead?.full_name?.toLowerCase() || '';
      const email = p.lead?.email?.toLowerCase() || '';
      const phone = p.lead?.phone?.toLowerCase() || '';
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [profiles, searchQuery]);

  const filteredAccounts = useMemo(() => {
    if (!searchQuery.trim()) return accounts;
    const q = searchQuery.toLowerCase().trim();
    return accounts.filter((a) => {
      const name = a.lead?.full_name?.toLowerCase() || '';
      const holder = a.holder_name?.toLowerCase() || '';
      const val = a.value?.toLowerCase() || '';
      const relName = a.related_party?.full_name?.toLowerCase() || '';
      return name.includes(q) || holder.includes(q) || val.includes(q) || relName.includes(q);
    });
  }, [accounts, searchQuery]);

  const filteredParties = useMemo(() => {
    if (!searchQuery.trim()) return relatedParties;
    const q = searchQuery.toLowerCase().trim();
    return relatedParties.filter((pt) => {
      const custName = pt.lead?.full_name?.toLowerCase() || '';
      const partyName = pt.full_name?.toLowerCase() || '';
      const nid = pt.national_id?.toLowerCase() || '';
      return custName.includes(q) || partyName.includes(q) || nid.includes(q);
    });
  }, [relatedParties, searchQuery]);

  const filteredRecipients = useMemo(() => {
    if (!searchQuery.trim()) return authorizedRecipients;
    const q = searchQuery.toLowerCase().trim();
    return authorizedRecipients.filter((r) => {
      const custName = r.lead?.full_name?.toLowerCase() || '';
      const recName = r.recipient?.full_name?.toLowerCase() || '';
      const phone = r.recipient?.phone?.toLowerCase() || '';
      return custName.includes(q) || recName.includes(q) || phone.includes(q);
    });
  }, [authorizedRecipients, searchQuery]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f7f9fc] py-8 sm:py-10" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">

        {/* Top Header Bar */}
        <div className="bg-[#071B3D] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#0b2b55]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse">
                <Landmark size={13} />
                <span>{isFa ? 'پذیرش و احراز هویت مشتریان تبادل ارز' : 'Exchange Customer Onboarding'}</span>
              </span>
              {adminUser?.email && (
                <span className="text-xs text-slate-300">({adminUser.email})</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isFa ? 'پیشخوان پذیرش و تایید مدارک تبادل' : 'Customer Onboarding Console'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isFa
                ? 'بررسی و تایید دسترسی به میز تبادل، احراز حساب‌های بانکی مقصد، ثبت بستگان درجه‌یک در ایران و گیرنده‌های مجاز رومانی.'
                : 'Review exchange profile access, verify destination bank accounts, manage first-degree relatives, and authorize Romanian cash recipients.'}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/exchange"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-bold border border-emerald-400/30 transition-all shadow-xs"
            >
              <Landmark size={15} />
              <span>{isFa ? 'کنسول معاملات' : 'Operations Desk'}</span>
            </Link>

            <Link
              href="/admin/leads"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <Users size={15} />
              <span>{isFa ? 'پرونده‌های متقاضیان' : 'Leads'}</span>
            </Link>

            <Link
              href="/admin/settings"
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <Settings size={15} />
              <span>{isFa ? 'تنظیمات' : 'Settings'}</span>
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

        {/* Toast Alert */}
        {successToast && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 shadow-sm flex items-center space-x-3 rtl:space-x-reverse animate-slideDown">
            <CheckCircle size={20} className="text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">{successToast}</span>
          </div>
        )}

        {/* 403 Forbidden State */}
        {errorStatus === 403 ? (
          <div className="bg-white border border-rose-200 rounded-3xl p-10 text-center shadow-sm space-y-4 max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800">
              {isFa ? 'عدم دسترسی به پذیرش تبادل ارز' : 'Access Restricted'}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isFa
                ? 'شما مجوز کافی برای دسترسی به این بخش را ندارید. این ماژول تنها در اختیار کاربران دارای مجوز exchange.onboarding قرار دارد.'
                : 'You do not have permission to access customer onboarding. Contact your administrator if you require exchange.onboarding permission.'}
            </p>
            <div className="pt-2">
              <Link
                href="/admin/leads"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-2.5 rounded-xl bg-[#2F6FED] text-white text-xs font-bold hover:bg-[#2558c4] transition-all shadow-sm"
              >
                <span>{isFa ? 'بازگشت به متقاضیان' : 'Back to Leads'}</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Top Actionable Counter Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Counter 1: Pending Profiles */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('profiles');
                  setProfilesStatusFilter('pending');
                }}
                className={`text-start rounded-2xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between ${
                  activeTab === 'profiles' && profilesStatusFilter === 'pending'
                    ? 'bg-blue-500/10 border-blue-400 ring-2 ring-blue-400/30'
                    : 'bg-white border-[#dfe6ef] hover:border-blue-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-blue-700 text-xs font-bold">
                    <Users size={14} />
                    <span>{isFa ? 'پرونده‌های تبادل' : 'Exchange Profiles'}</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-800">
                    {isFa ? 'منتظر تایید اولیه' : 'Pending Approval'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isFa ? 'درخواست دسترسی مشتریان' : 'Customer access requests'}
                  </div>
                </div>
                <div className="ms-3 shrink-0 flex flex-col items-center justify-center min-w-[56px] h-[56px] rounded-2xl bg-blue-600 text-white shadow-sm">
                  <span className="text-xl font-black">{pendingProfilesCount}</span>
                  <span className="text-[9px] font-semibold uppercase">{isFa ? 'مورد' : 'CASES'}</span>
                </div>
              </button>

              {/* Counter 2: Unverified Accounts */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('accounts');
                  setAccountsStatusFilter('unverified');
                }}
                className={`text-start rounded-2xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between ${
                  activeTab === 'accounts' && accountsStatusFilter === 'unverified'
                    ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-white border-[#dfe6ef] hover:border-amber-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-amber-700 text-xs font-bold">
                    <CreditCard size={14} />
                    <span>{isFa ? 'حساب‌های بانکی' : 'Bank Accounts'}</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-800">
                    {isFa ? 'نیازمند احراز هویت' : 'Pending Verification'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isFa ? 'شماره شبا و آی‌بان مقصد' : 'Target IBAN / Sheba'}
                  </div>
                </div>
                <div className="ms-3 shrink-0 flex flex-col items-center justify-center min-w-[56px] h-[56px] rounded-2xl bg-amber-500 text-white shadow-sm">
                  <span className="text-xl font-black">{unverifiedAccountsCount}</span>
                  <span className="text-[9px] font-semibold uppercase">{isFa ? 'مورد' : 'CASES'}</span>
                </div>
              </button>

              {/* Counter 3: Related Parties */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('related_parties');
                  setRelatedPartiesStatusFilter('pending');
                }}
                className={`text-start rounded-2xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between ${
                  activeTab === 'related_parties' && relatedPartiesStatusFilter === 'pending'
                    ? 'bg-purple-500/10 border-purple-400 ring-2 ring-purple-400/30'
                    : 'bg-white border-[#dfe6ef] hover:border-purple-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-purple-700 text-xs font-bold">
                    <Building2 size={14} />
                    <span>{isFa ? 'بستگان و شرکت‌ها' : 'Related Parties'}</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-800">
                    {isFa ? 'در انتظار بررسی مدارک' : 'Pending Verification'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isFa ? 'واریز ریال به بستگان/شرکت' : 'Iranian third-parties'}
                  </div>
                </div>
                <div className="ms-3 shrink-0 flex flex-col items-center justify-center min-w-[56px] h-[56px] rounded-2xl bg-purple-600 text-white shadow-sm">
                  <span className="text-xl font-black">{pendingRelatedPartiesCount}</span>
                  <span className="text-[9px] font-semibold uppercase">{isFa ? 'مورد' : 'CASES'}</span>
                </div>
              </button>

              {/* Counter 4: Authorized Recipients */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('authorized_recipients');
                  setAuthorizedRecipientsStatusFilter('pending');
                }}
                className={`text-start rounded-2xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between ${
                  activeTab === 'authorized_recipients' && authorizedRecipientsStatusFilter === 'pending'
                    ? 'bg-emerald-500/10 border-emerald-400 ring-2 ring-emerald-400/30'
                    : 'bg-white border-[#dfe6ef] hover:border-emerald-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-emerald-700 text-xs font-bold">
                    <ShieldCheck size={14} />
                    <span>{isFa ? 'گیرنده‌های رومانی' : 'Authorized Recipients'}</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-800">
                    {isFa ? 'در انتظار تایید صلاحیت' : 'Pending Authorization'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isFa ? 'تحویل یورو در رومانی' : 'EUR Cash/IBAN Pickup'}
                  </div>
                </div>
                <div className="ms-3 shrink-0 flex flex-col items-center justify-center min-w-[56px] h-[56px] rounded-2xl bg-emerald-600 text-white shadow-sm">
                  <span className="text-xl font-black">{pendingRecipientsCount}</span>
                  <span className="text-[9px] font-semibold uppercase">{isFa ? 'مورد' : 'CASES'}</span>
                </div>
              </button>
            </div>

            {/* Main Tabs Navigation */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dfe6ef] shadow-sm space-y-6">
              
              {/* Tab Selector & Header Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#dfe6ef]">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profiles')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
                      activeTab === 'profiles'
                        ? 'bg-[#071B3D] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Users size={15} />
                    <span>{isFa ? '۱. پرونده‌های تبادل' : '1. Profiles'}</span>
                    {pendingProfilesCount > 0 && (
                      <span className="ms-1.5 px-2 py-0.5 rounded-full text-[10px] bg-blue-500 text-white">
                        {pendingProfilesCount}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('accounts')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
                      activeTab === 'accounts'
                        ? 'bg-[#071B3D] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <CreditCard size={15} />
                    <span>{isFa ? '۲. حساب‌های بانکی' : '2. Bank Accounts'}</span>
                    {unverifiedAccountsCount > 0 && (
                      <span className="ms-1.5 px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white">
                        {unverifiedAccountsCount}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('related_parties')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
                      activeTab === 'related_parties'
                        ? 'bg-[#071B3D] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Building2 size={15} />
                    <span>{isFa ? '۳. بستگان و شرکت‌ها' : '3. Related Parties'}</span>
                    {pendingRelatedPartiesCount > 0 && (
                      <span className="ms-1.5 px-2 py-0.5 rounded-full text-[10px] bg-purple-500 text-white">
                        {pendingRelatedPartiesCount}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('authorized_recipients')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 rtl:space-x-reverse ${
                      activeTab === 'authorized_recipients'
                        ? 'bg-[#071B3D] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ShieldCheck size={15} />
                    <span>{isFa ? '۴. گیرنده‌های مجاز رومانی' : '4. Authorized Recipients'}</span>
                    {pendingRecipientsCount > 0 && (
                      <span className="ms-1.5 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white">
                        {pendingRecipientsCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Search input & Action creation buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[220px]">
                    <Search
                      size={15}
                      className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isFa ? 'جستجو بر اساس نام، ایمیل، شماره...' : 'Search customer...'}
                      className="w-full ps-9 pe-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {activeTab === 'related_parties' && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerDocuments([]);
                        setAddPartyModal((prev) => ({
                          ...prev,
                          isOpen: true,
                          leadId: '',
                          fullName: '',
                          nationalId: '',
                          idDocumentId: '',
                          error: null,
                        }));
                      }}
                      className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all shadow-sm cursor-pointer"
                    >
                      <Plus size={15} />
                      <span>{isFa ? 'ثبت بستگان / شرکت جدید' : 'Add Related Party'}</span>
                    </button>
                  )}

                  {activeTab === 'authorized_recipients' && (
                    <button
                      type="button"
                      onClick={() => setAddRecipientModal((prev) => ({ ...prev, isOpen: true, error: null }))}
                      className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm cursor-pointer"
                    >
                      <Plus size={15} />
                      <span>{isFa ? 'ثبت گیرنده مجاز جدید' : 'Add Authorized Recipient'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* TAB 1: Exchange Profiles */}
              {/* ----------------------------------------------------------------- */}
              {activeTab === 'profiles' && (
                <div className="space-y-4">
                  {/* Status Filters Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-slate-500 font-semibold">{isFa ? 'فیلتر وضعیت:' : 'Status:'}</span>
                      {(['pending', 'approved', 'suspended', 'rejected', 'all'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setProfilesStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            profilesStatusFilter === st
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st === 'pending' && (isFa ? 'در انتظار بررسی' : 'Pending')}
                          {st === 'approved' && (isFa ? 'تاییدشده' : 'Approved')}
                          {st === 'suspended' && (isFa ? 'معلق‌شده' : 'Suspended')}
                          {st === 'rejected' && (isFa ? 'ردشده' : 'Rejected')}
                          {st === 'all' && (isFa ? 'همه' : 'All')}
                        </button>
                      ))}
                    </div>
                    <span className="text-slate-500 font-medium">
                      {isFa
                        ? `نمایش ${filteredProfiles.length} از ${profilesTotal}`
                        : `Showing ${filteredProfiles.length} of ${profilesTotal}`}
                    </span>
                  </div>

                  {profilesTotal > profiles.length && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-2.5 rtl:space-x-reverse text-xs text-amber-800">
                      <AlertCircle size={16} className="shrink-0 text-amber-600" />
                      <span>
                        {isFa
                          ? `توجه: ${profilesTotal - profiles.length} پرونده دیگر در سرور وجود دارد که به دلیل سقف نمایش ۱۰۰ موردی نمایش داده نشده‌اند. لطفاً از فیلترهای وضعیت یا جستجو برای محدود کردن نتایج استفاده نمایید.`
                          : `Notice: ${profilesTotal - profiles.length} additional profiles exist on the server but are not displayed due to the 100-item view limit. Please use filters or search.`}
                      </span>
                    </div>
                  )}

                  {/* Profiles Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-start border-collapse text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5 text-start">{isFa ? 'مشتری متقاضی' : 'Customer'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'وضعیت دسترسی تبادل' : 'Exchange Status'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'بررسی‌کننده / تاریخ تایید' : 'Approver / Date'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'آمار معاملات' : 'Trade Stats'}</th>
                          <th className="p-3.5 text-center">{isFa ? 'اقدامات کارمند' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredProfiles.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">
                              {loading ? (isFa ? 'در حال دریافت اطلاعات...' : 'Loading...') : (isFa ? 'هیچ پرونده‌ای با این فیلتر یافت نشد.' : 'No profiles found.')}
                            </td>
                          </tr>
                        ) : (
                          filteredProfiles.map((p) => {
                            const badge = getProfileBadge(p.exchange_status);
                            return (
                              <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="p-3.5 space-y-1">
                                  <div className="font-extrabold text-slate-900 text-sm">
                                    {p.lead?.full_name || (isFa ? 'بدون نام' : 'Unnamed')}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-mono">
                                    {p.lead?.phone || p.lead?.email || p.lead_id}
                                  </div>
                                </td>
                                <td className="p-3.5 space-y-1">
                                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] border ${badge.classes}`}>
                                    {badge.label}
                                  </span>
                                  {p.suspended_reason && (
                                    <div className="text-[11px] text-rose-700 bg-rose-50/80 p-1.5 rounded-lg border border-rose-100 max-w-xs">
                                      <span className="font-bold">{isFa ? 'علت تعلیق: ' : 'Reason: '}</span>
                                      {p.suspended_reason}
                                    </div>
                                  )}
                                </td>
                                <td className="p-3.5 space-y-0.5">
                                  <div className="font-semibold text-slate-800">
                                    {p.approver?.full_name || (p.approved_by ? (isFa ? 'کارشناس پذیرش' : 'Staff') : '-')}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    {p.approved_at ? new Date(p.approved_at).toLocaleDateString(isFa ? 'fa-IR' : 'en-US') : '-'}
                                  </div>
                                </td>
                                <td className="p-3.5 space-y-0.5 font-mono text-[11px]">
                                  <div className="text-emerald-700 font-bold">
                                    {isFa ? `موفق: ${p.completed_trades}` : `Completed: ${p.completed_trades}`}
                                  </div>
                                  <div className="text-rose-600">
                                    {isFa ? `ناموفق: ${p.failed_trades}` : `Failed: ${p.failed_trades}`}
                                  </div>
                                </td>
                                <td className="p-3.5 text-center">
                                  <div className="inline-flex flex-wrap items-center justify-center gap-1.5">
                                    {p.exchange_status !== 'approved' && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setProfileModal({
                                            isOpen: true,
                                            profile: p,
                                            targetStatus: 'approved',
                                            suspendedReason: '',
                                            isSubmitting: false,
                                            error: null,
                                          })
                                        }
                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-2xs cursor-pointer"
                                      >
                                        {isFa ? 'تایید پرونده' : 'Approve'}
                                      </button>
                                    )}

                                    {p.exchange_status !== 'suspended' && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setProfileModal({
                                            isOpen: true,
                                            profile: p,
                                            targetStatus: 'suspended',
                                            suspendedReason: '',
                                            isSubmitting: false,
                                            error: null,
                                          })
                                        }
                                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 font-bold text-xs transition-all cursor-pointer"
                                      >
                                        {isFa ? 'تعلیق' : 'Suspend'}
                                      </button>
                                    )}

                                    {p.exchange_status !== 'rejected' && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setProfileModal({
                                            isOpen: true,
                                            profile: p,
                                            targetStatus: 'rejected',
                                            suspendedReason: '',
                                            isSubmitting: false,
                                            error: null,
                                          })
                                        }
                                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs transition-all cursor-pointer"
                                      >
                                        {isFa ? 'رد پرونده' : 'Reject'}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* TAB 2: Destination Bank Accounts */}
              {/* ----------------------------------------------------------------- */}
              {activeTab === 'accounts' && (
                <div className="space-y-4">
                  {/* Status Filters */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-slate-500 font-semibold">{isFa ? 'فیلتر حساب‌ها:' : 'Filter:'}</span>
                      {(['unverified', 'verified', 'all'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setAccountsStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            accountsStatusFilter === st
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st === 'unverified' && (isFa ? 'در انتظار تایید (بررسی‌نشده)' : 'Unverified')}
                          {st === 'verified' && (isFa ? 'تایید و احراز شده' : 'Verified')}
                          {st === 'all' && (isFa ? 'همه' : 'All')}
                        </button>
                      ))}
                    </div>
                    <span className="text-slate-500 font-medium">
                      {isFa
                        ? `نمایش ${filteredAccounts.length} از ${accountsTotal}`
                        : `Showing ${filteredAccounts.length} of ${accountsTotal}`}
                    </span>
                  </div>

                  {accountsTotal > accounts.length && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-2.5 rtl:space-x-reverse text-xs text-amber-800">
                      <AlertCircle size={16} className="shrink-0 text-amber-600" />
                      <span>
                        {isFa
                          ? `توجه: ${accountsTotal - accounts.length} حساب بانکی دیگر در سرور وجود دارد که به دلیل سقف نمایش ۱۰۰ موردی نمایش داده نشده‌اند. لطفاً از فیلترهای وضعیت یا جستجو برای محدود کردن نتایج استفاده نمایید.`
                          : `Notice: ${accountsTotal - accounts.length} additional accounts exist on the server but are not displayed due to the 100-item view limit. Please use filters or search.`}
                      </span>
                    </div>
                  )}

                  {/* Accounts Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-start border-collapse text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5 text-start">{isFa ? 'مشتری حساب' : 'Customer'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'نوع و مشخصات حساب / شبا / کارت' : 'Account Details'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'بستگان / گیرنده منتسب' : 'Associated Party'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'وضعیت احراز' : 'Verification'}</th>
                          <th className="p-3.5 text-center">{isFa ? 'اقدام' : 'Action'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredAccounts.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">
                              {loading ? (isFa ? 'در حال دریافت اطلاعات...' : 'Loading...') : (isFa ? 'هیچ حسابی با این وضعیت یافت نشد.' : 'No accounts found.')}
                            </td>
                          </tr>
                        ) : (
                          filteredAccounts.map((acc) => (
                            <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="p-3.5 space-y-1">
                                <div className="font-extrabold text-slate-900 text-sm">
                                  {acc.lead?.full_name || (isFa ? 'بدون نام' : 'Unnamed')}
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono">
                                  {acc.lead?.phone || acc.lead_id}
                                </div>
                              </td>
                              <td className="p-3.5 space-y-1">
                                <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-bold text-slate-900">
                                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                                    {acc.kind}
                                  </span>
                                  <span className="text-slate-800">{acc.holder_name}</span>
                                </div>
                                <div className="font-mono text-xs text-blue-700 select-all font-semibold" dir="ltr">
                                  {acc.value}
                                </div>
                              </td>
                              <td className="p-3.5 space-y-1">
                                {acc.related_party ? (
                                  <div className="space-y-0.5">
                                    <div className="font-bold text-purple-800">
                                      {acc.related_party.full_name}
                                    </div>
                                    <div className="text-[11px] text-purple-600">
                                      {formatRelationship(acc.related_party.relationship)} ({acc.related_party.status})
                                    </div>
                                  </div>
                                ) : acc.authorized_recipient ? (
                                  <div className="text-emerald-800 font-bold">
                                    {isFa ? 'گیرنده مجاز رومانی' : 'Authorized Recipient'}
                                  </div>
                                ) : (
                                  <span className="text-slate-400">{isFa ? 'شخص مشتری' : 'Customer Self'}</span>
                                )}
                              </td>
                              <td className="p-3.5 space-y-1">
                                {acc.verified_at ? (
                                  <div className="space-y-0.5">
                                    <span className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                      <Check size={11} />
                                      <span>{isFa ? 'تاییدشده' : 'Verified'}</span>
                                    </span>
                                    <div className="text-[11px] text-slate-400">
                                      {acc.verified_by?.full_name || (isFa ? 'کارشناس' : 'Staff')}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="inline-block px-2.5 py-1 rounded-full text-[11px] bg-amber-50 text-amber-700 border border-amber-300 font-bold animate-pulse">
                                    {isFa ? 'نیازمند احراز هویت' : 'Pending Verification'}
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 text-center">
                                {!acc.verified_at ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAccountModal({
                                        isOpen: true,
                                        account: acc,
                                        isSubmitting: false,
                                        error: null,
                                      })
                                    }
                                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all shadow-2xs cursor-pointer flex items-center space-x-1 rtl:space-x-reverse mx-auto"
                                  >
                                    <Check size={13} />
                                    <span>{isFa ? 'تایید و احراز حساب' : 'Verify Account'}</span>
                                  </button>
                                ) : (
                                  <span className="text-slate-400 font-mono text-xs">-</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* TAB 3: Related Parties & Companies */}
              {/* ----------------------------------------------------------------- */}
              {activeTab === 'related_parties' && (
                <div className="space-y-4">
                  {/* Status Filters */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-slate-500 font-semibold">{isFa ? 'فیلتر وضعیت:' : 'Filter:'}</span>
                      {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setRelatedPartiesStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            relatedPartiesStatusFilter === st
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st === 'pending' && (isFa ? 'در انتظار بررسی' : 'Pending')}
                          {st === 'approved' && (isFa ? 'تاییدشده' : 'Approved')}
                          {st === 'rejected' && (isFa ? 'ردشده' : 'Rejected')}
                          {st === 'all' && (isFa ? 'همه' : 'All')}
                        </button>
                      ))}
                    </div>
                    <span className="text-slate-500 font-medium">
                      {isFa
                        ? `نمایش ${filteredParties.length} از ${partiesTotal}`
                        : `Showing ${filteredParties.length} of ${partiesTotal}`}
                    </span>
                  </div>

                  {partiesTotal > relatedParties.length && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-2.5 rtl:space-x-reverse text-xs text-amber-800">
                      <AlertCircle size={16} className="shrink-0 text-amber-600" />
                      <span>
                        {isFa
                          ? `توجه: ${partiesTotal - relatedParties.length} ردیف بستگان دیگر در سرور وجود دارد که به دلیل سقف نمایش ۱۰۰ موردی نمایش داده نشده‌اند. لطفاً از فیلترهای وضعیت یا جستجو برای محدود کردن نتایج استفاده نمایید.`
                          : `Notice: ${partiesTotal - relatedParties.length} additional related parties exist on the server but are not displayed due to the 100-item view limit. Please use filters or search.`}
                      </span>
                    </div>
                  )}

                  {/* Related Parties Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-start border-collapse text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5 text-start">{isFa ? 'مشتری صاحب درخواست' : 'Customer Lead'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'شخص / شرکت' : 'Party & Type'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'نسبت / کدملی' : 'Relationship / ID'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'مدرک ثبتی / هویتی' : 'Attached Document'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'وضعیت' : 'Status'}</th>
                          <th className="p-3.5 text-center">{isFa ? 'اقدامات کارمند' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredParties.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">
                              {loading ? (isFa ? 'در حال دریافت اطلاعات...' : 'Loading...') : (isFa ? 'هیچ موردی با این وضعیت یافت نشد.' : 'No related parties found.')}
                            </td>
                          </tr>
                        ) : (
                          filteredParties.map((pt) => {
                            const badge = getGeneralStatusBadge(pt.status);
                            const isCompanyMissingDoc = pt.party_type === 'company' && !pt.id_document_id;
                            return (
                              <tr key={pt.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="p-3.5 space-y-1">
                                  <div className="font-extrabold text-slate-900 text-sm">
                                    {pt.lead?.full_name || (isFa ? 'بدون نام' : 'Unnamed')}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-mono">
                                    {pt.lead?.phone || pt.lead?.email}
                                  </div>
                                </td>
                                <td className="p-3.5 space-y-1">
                                  <div className="font-bold text-slate-900 text-sm">{pt.full_name}</div>
                                  <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold">
                                    {pt.party_type === 'company' ? (isFa ? 'شرکت حقوقی' : 'Company') : (isFa ? 'شخص حقیقی' : 'Individual')}
                                  </span>
                                </td>
                                <td className="p-3.5 space-y-1">
                                  <div className="font-semibold text-slate-800">{formatRelationship(pt.relationship)}</div>
                                  <div className="font-mono text-[11px] text-slate-500">{pt.national_id}</div>
                                </td>
                                <td className="p-3.5 space-y-1">
                                  {pt.id_document ? (
                                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-emerald-700 font-semibold">
                                      <FileText size={14} />
                                      <span className="font-mono text-[11px]">{pt.id_document.document_type || (isFa ? 'مدرک بارگذاری‌شده' : 'Uploaded Doc')}</span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">
                                      {pt.party_type === 'company' ? (
                                        <span className="text-rose-600 font-bold flex items-center space-x-1 rtl:space-x-reverse">
                                          <AlertCircle size={13} />
                                          <span>{isFa ? 'فاقد مدرک ثبتی' : 'Missing Document'}</span>
                                        </span>
                                      ) : (
                                        (isFa ? 'بدون فایل' : 'None')
                                      )}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3.5 space-y-1">
                                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] border ${badge.classes}`}>
                                    {badge.label}
                                  </span>
                                  {pt.verified_by && (
                                    <div className="text-[10px] text-slate-400">
                                      {pt.verified_by.full_name}
                                    </div>
                                  )}
                                </td>
                                <td className="p-3.5 text-center">
                                  <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2">
                                    {pt.status !== 'approved' && (
                                      <div className="flex flex-col items-center gap-1">
                                        <button
                                          type="button"
                                          disabled={isCompanyMissingDoc}
                                          onClick={() =>
                                            setPartyModal({
                                              isOpen: true,
                                              party: pt,
                                              targetStatus: 'approved',
                                              isSubmitting: false,
                                              error: null,
                                            })
                                          }
                                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                                            isCompanyMissingDoc
                                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                                              : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                                          }`}
                                        >
                                          {isFa ? 'تایید' : 'Approve'}
                                        </button>
                                        {isCompanyMissingDoc && (
                                          <span className="text-[10px] text-rose-600 max-w-[150px] leading-tight text-center font-medium">
                                            {isFa ? 'تایید شرکت نیازمند بارگذاری مدرک ثبتی است.' : 'Company doc required.'}
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {pt.status !== 'rejected' && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setPartyModal({
                                            isOpen: true,
                                            party: pt,
                                            targetStatus: 'rejected',
                                            isSubmitting: false,
                                            error: null,
                                          })
                                        }
                                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs transition-all cursor-pointer"
                                      >
                                        {isFa ? 'رد' : 'Reject'}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* TAB 4: Authorized Recipients in Romania */}
              {/* ----------------------------------------------------------------- */}
              {activeTab === 'authorized_recipients' && (
                <div className="space-y-4">
                  {/* Status Filters */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-slate-500 font-semibold">{isFa ? 'فیلتر گیرنده‌ها:' : 'Filter:'}</span>
                      {(['pending', 'approved', 'revoked', 'all'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setAuthorizedRecipientsStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                            authorizedRecipientsStatusFilter === st
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st === 'pending' && (isFa ? 'در انتظار بررسی' : 'Pending')}
                          {st === 'approved' && (isFa ? 'تاییدشده' : 'Approved')}
                          {st === 'revoked' && (isFa ? 'ابطال‌شده' : 'Revoked')}
                          {st === 'all' && (isFa ? 'همه' : 'All')}
                        </button>
                      ))}
                    </div>
                    <span className="text-slate-500 font-medium">
                      {isFa
                        ? `نمایش ${filteredRecipients.length} از ${recipientsTotal}`
                        : `Showing ${filteredRecipients.length} of ${recipientsTotal}`}
                    </span>
                  </div>

                  {recipientsTotal > authorizedRecipients.length && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-2.5 rtl:space-x-reverse text-xs text-amber-800">
                      <AlertCircle size={16} className="shrink-0 text-amber-600" />
                      <span>
                        {isFa
                          ? `توجه: ${recipientsTotal - authorizedRecipients.length} گیرنده مجاز دیگر در سرور وجود دارد که به دلیل سقف نمایش ۱۰۰ موردی نمایش داده نشده‌اند. لطفاً از فیلترهای وضعیت یا جستجو برای محدود کردن نتایج استفاده نمایید.`
                          : `Notice: ${recipientsTotal - authorizedRecipients.length} additional authorized recipients exist on the server but are not displayed due to the 100-item view limit. Please use filters or search.`}
                      </span>
                    </div>
                  )}

                  {/* Authorized Recipients Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-start border-collapse text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5 text-start">{isFa ? 'مشتری واگذارکننده' : 'Customer Lead'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'گیرنده مجاز در رومانی' : 'Recipient Lead (RO)'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'وضعیت پرونده گیرنده' : 'Recipient Profile Status'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'نسبت / ارتباط' : 'Relationship'}</th>
                          <th className="p-3.5 text-start">{isFa ? 'وضعیت گیرندگی' : 'Status'}</th>
                          <th className="p-3.5 text-center">{isFa ? 'اقدامات کارمند' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredRecipients.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">
                              {loading ? (isFa ? 'در حال دریافت اطلاعات...' : 'Loading...') : (isFa ? 'هیچ گیرنده مجازی یافت نشد.' : 'No recipients found.')}
                            </td>
                          </tr>
                        ) : (
                          filteredRecipients.map((rec) => {
                            const badge = getGeneralStatusBadge(rec.status);
                            // Look up recipient lead's exchange profile status
                            const recipientProfile = profileStatusByLeadId.get(rec.recipient_lead_id);
                            const isRecipientProfileApproved = recipientProfile?.exchange_status === 'approved';
                            const recipientName = rec.recipient?.full_name || (isFa ? 'گیرنده' : 'Recipient');

                            return (
                              <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="p-3.5 space-y-1">
                                  <div className="font-extrabold text-slate-900 text-sm">
                                    {rec.lead?.full_name || (isFa ? 'بدون نام' : 'Unnamed')}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-mono">
                                    {rec.lead?.phone || rec.lead?.email}
                                  </div>
                                </td>
                                <td className="p-3.5 space-y-1">
                                  <div className="font-extrabold text-slate-900 text-sm">
                                    {recipientName}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-mono">
                                    {rec.recipient?.phone || rec.recipient?.email || rec.recipient_lead_id}
                                  </div>
                                </td>
                                <td className="p-3.5 space-y-1">
                                  {isRecipientProfileApproved ? (
                                    <span className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-full text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                      <Check size={11} />
                                      <span>{isFa ? 'پرونده تبادل تاییدشده' : 'Profile Approved'}</span>
                                    </span>
                                  ) : (
                                    <div className="space-y-0.5">
                                      <span className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-full text-[11px] bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                                        <AlertCircle size={11} />
                                        <span>
                                          {recipientProfile
                                            ? (isFa ? `پرونده: ${recipientProfile.exchange_status}` : `Profile: ${recipientProfile.exchange_status}`)
                                            : (isFa ? 'فاقد پرونده تبادل' : 'No Profile')}
                                        </span>
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="p-3.5 space-y-1">
                                  <span className="font-bold text-slate-800">{rec.relationship}</span>
                                </td>
                                <td className="p-3.5 space-y-1">
                                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] border ${badge.classes}`}>
                                    {badge.label}
                                  </span>
                                  {rec.verified_by && (
                                    <div className="text-[10px] text-slate-400">
                                      {rec.verified_by.full_name}
                                    </div>
                                  )}
                                </td>
                                <td className="p-3.5 text-center">
                                  <div className="inline-flex flex-col items-center justify-center gap-1.5">
                                    {rec.status !== 'approved' && (
                                      <div className="flex flex-col items-center gap-1">
                                        <button
                                          type="button"
                                          disabled={!isRecipientProfileApproved}
                                          onClick={() =>
                                            setRecipientModal({
                                              isOpen: true,
                                              recipient: rec,
                                              targetStatus: 'approved',
                                              isSubmitting: false,
                                              error: null,
                                            })
                                          }
                                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                                            !isRecipientProfileApproved
                                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                                              : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                                          }`}
                                        >
                                          {isFa ? 'تایید' : 'Approve'}
                                        </button>

                                        {!isRecipientProfileApproved && (
                                          <div className="text-[10px] text-rose-700 max-w-[200px] leading-tight text-center font-medium bg-rose-50/90 border border-rose-200 p-1.5 rounded-lg">
                                            {isFa
                                              ? `ابتدا باید پرونده‌ی تبادل ${recipientName} تایید شود.`
                                              : `Exchange profile of ${recipientName} must be approved first.`}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {rec.status !== 'revoked' && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setRecipientModal({
                                            isOpen: true,
                                            recipient: rec,
                                            targetStatus: 'revoked',
                                            isSubmitting: false,
                                            error: null,
                                          })
                                        }
                                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs transition-all cursor-pointer"
                                      >
                                        {isFa ? 'ابطال مجوز' : 'Revoke'}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* ACTION CONFIRMATION MODALS (NO browser confirm/alert) */}
        {/* --------------------------------------------------------------------- */}

        {/* Modal 1: Profile Status Update Modal */}
        {profileModal.isOpen && profileModal.profile && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-scaleUp border border-slate-200">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {profileModal.targetStatus === 'approved' && (isFa ? 'تایید دسترسی پرونده تبادل' : 'Approve Profile')}
                    {profileModal.targetStatus === 'suspended' && (isFa ? 'تعلیق موقت پرونده تبادل' : 'Suspend Profile')}
                    {profileModal.targetStatus === 'rejected' && (isFa ? 'رد درخواست پرونده تبادل' : 'Reject Profile')}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {profileModal.profile.lead?.full_name} ({profileModal.profile.lead?.phone || profileModal.profile.lead?.email})
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                {profileModal.targetStatus === 'approved' && (
                  <span>
                    {isFa
                      ? 'با تایید این پرونده، متقاضی به بخش تبادل ارز دسترسی یافته و قادر به ثبت درخواست و پذیرش معاملات همتا-به-همتا خواهد بود.'
                      : 'Approving this profile grants the customer access to create and accept currency exchange orders.'}
                  </span>
                )}
                {profileModal.targetStatus === 'suspended' && (
                  <span>
                    {isFa
                      ? 'تعلیق پرونده دسترسی مشتری به بخش تبادل را متوقف می‌کند. وارد کردن دلیل تعلیق برای سوابق سیستمی اجباری است.'
                      : 'Suspending this profile revokes the customer access to currency exchange. Reason is strictly mandatory.'}
                  </span>
                )}
                {profileModal.targetStatus === 'rejected' && (
                  <span>
                    {isFa
                      ? 'درخواست دسترسی این متقاضی به بخش تبادل ارز رد خواهد شد.'
                      : 'Customer access request will be rejected.'}
                  </span>
                )}
              </div>

              {/* Mandatory Reason Input on Suspension */}
              {profileModal.targetStatus === 'suspended' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>{isFa ? 'دلیل تعلیق (اجباری):' : 'Suspension Reason (Required):'}</span>
                    <span className="text-[10px] text-rose-600 font-semibold">{isFa ? 'الزامی' : 'Mandatory'}</span>
                  </label>
                  <textarea
                    rows={3}
                    value={profileModal.suspendedReason}
                    onChange={(e) => setProfileModal((prev) => ({ ...prev, suspendedReason: e.target.value, error: null }))}
                    placeholder={isFa ? 'مثال: نقص مدارک هویتی، تراکنش‌های مشکوک یا درخواست کاربر...' : 'Reason for suspension...'}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              )}

              {profileModal.error && (
                <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center space-x-2 rtl:space-x-reverse">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{profileModal.error}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-2">
                <button
                  type="button"
                  disabled={profileModal.isSubmitting}
                  onClick={() => setProfileModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>

                <button
                  type="button"
                  disabled={profileModal.isSubmitting}
                  onClick={handleConfirmProfileStatus}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer ${
                    profileModal.targetStatus === 'approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : profileModal.targetStatus === 'suspended'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  } ${profileModal.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {profileModal.isSubmitting
                    ? (isFa ? 'در حال ثبت...' : 'Submitting...')
                    : (isFa ? 'تایید و اعمال' : 'Confirm Action')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Verify Bank Account Modal */}
        {accountModal.isOpen && accountModal.account && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-scaleUp border border-slate-200">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {isFa ? 'تایید و احراز حساب بانکی مقصد' : 'Verify Bank Account'}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {accountModal.account.holder_name} ({accountModal.account.kind})
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{isFa ? 'مشتری متقاضی:' : 'Customer:'}</span>
                  <span className="font-bold text-slate-800">{accountModal.account.lead?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isFa ? 'نوع حساب:' : 'Kind:'}</span>
                  <span className="font-bold text-slate-800">{accountModal.account.kind}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isFa ? 'صاحب حساب:' : 'Holder:'}</span>
                  <span className="font-bold text-slate-800">{accountModal.account.holder_name}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-500">{isFa ? 'شماره حساب / شبا:' : 'Number:'}</span>
                  <span className="font-mono text-blue-700 font-bold" dir="ltr">{accountModal.account.value}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {isFa
                  ? 'با تایید این حساب، کارمند تضمین می‌کند که هویت صاحب حساب با مشتری یا بستگان درجه‌یک وی تطبیق داده شده است.'
                  : 'By verifying this account, staff confirms that the account holder matches the customer or approved related party.'}
              </p>

              {accountModal.error && (
                <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center space-x-2 rtl:space-x-reverse">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{accountModal.error}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-2">
                <button
                  type="button"
                  disabled={accountModal.isSubmitting}
                  onClick={() => setAccountModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>

                <button
                  type="button"
                  disabled={accountModal.isSubmitting}
                  onClick={handleConfirmVerifyAccount}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {accountModal.isSubmitting
                    ? (isFa ? 'در حال ثبت...' : 'Submitting...')
                    : (isFa ? 'تایید و احراز قطعی' : 'Confirm Verification')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Related Party Status Modal */}
        {partyModal.isOpen && partyModal.party && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-scaleUp border border-slate-200">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {partyModal.targetStatus === 'approved' ? (isFa ? 'تایید بستگان / شرکت' : 'Approve Party') : (isFa ? 'رد بستگان / شرکت' : 'Reject Party')}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {partyModal.party.full_name} ({formatRelationship(partyModal.party.relationship)})
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{isFa ? 'مشتری:' : 'Customer:'}</span>
                  <span className="font-bold text-slate-800">{partyModal.party.lead?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isFa ? 'کد / شناسه ملی:' : 'National ID:'}</span>
                  <span className="font-mono text-slate-800 font-bold">{partyModal.party.national_id}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {partyModal.targetStatus === 'approved'
                  ? (isFa
                      ? 'با تایید این ردیف، مشتری مجاز خواهد بود حساب‌های بانکی متعلق به این شخص یا شرکت را برای واریز ریالی ثبت نماید.'
                      : 'Customer will be allowed to use this relative or company account for IRR payouts.')
                  : (isFa
                      ? 'این درخواست ثبت بستگان / شرکت رد خواهد شد.'
                      : 'This related party will be marked as rejected.')}
              </p>

              {partyModal.error && (
                <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center space-x-2 rtl:space-x-reverse">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{partyModal.error}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-2">
                <button
                  type="button"
                  disabled={partyModal.isSubmitting}
                  onClick={() => setPartyModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>

                <button
                  type="button"
                  disabled={partyModal.isSubmitting}
                  onClick={handleConfirmPartyStatus}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer ${
                    partyModal.targetStatus === 'approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  } disabled:opacity-50`}
                >
                  {partyModal.isSubmitting
                    ? (isFa ? 'در حال ثبت...' : 'Submitting...')
                    : (isFa ? 'تایید قطعی' : 'Confirm')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 4: Authorized Recipient Status Modal */}
        {recipientModal.isOpen && recipientModal.recipient && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-scaleUp border border-slate-200">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {recipientModal.targetStatus === 'approved' ? (isFa ? 'تایید گیرنده مجاز در رومانی' : 'Approve Recipient') : (isFa ? 'ابطال مجوز گیرنده' : 'Revoke Recipient')}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {recipientModal.recipient.recipient?.full_name} ({recipientModal.recipient.relationship})
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{isFa ? 'مشتری درخواست‌دهنده:' : 'Customer:'}</span>
                  <span className="font-bold text-slate-800">{recipientModal.recipient.lead?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isFa ? 'گیرنده تحویل نقدی/بانکی:' : 'Recipient:'}</span>
                  <span className="font-bold text-slate-800">{recipientModal.recipient.recipient?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isFa ? 'نسبت / ارتباط:' : 'Relationship:'}</span>
                  <span className="font-semibold text-slate-800">{recipientModal.recipient.relationship}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {recipientModal.targetStatus === 'approved'
                  ? (isFa
                      ? 'با تایید این مجوز، این شخص مجاز خواهد بود یورو را به عنوان گیرنده قانونی مشتری در رومانی به صورت نقدی در پیشخوان یا به حساب بانکی تحویل بگیرد.'
                      : 'This recipient will be authorized to pick up EUR cash or receive EUR payouts in Romania on behalf of the customer.')
                  : (isFa
                      ? 'مجوز تحویل یورو به این گیرنده باطل خواهد شد و سیستم اجازه‌ی تحویل وجه به وی را نخواهد داد.'
                      : 'Authorization for this recipient will be revoked.')}
              </p>

              {recipientModal.error && (
                <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center space-x-2 rtl:space-x-reverse">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{recipientModal.error}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-2">
                <button
                  type="button"
                  disabled={recipientModal.isSubmitting}
                  onClick={() => setRecipientModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>

                <button
                  type="button"
                  disabled={recipientModal.isSubmitting}
                  onClick={handleConfirmRecipientStatus}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer ${
                    recipientModal.targetStatus === 'approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  } disabled:opacity-50`}
                >
                  {recipientModal.isSubmitting
                    ? (isFa ? 'در حال ثبت...' : 'Submitting...')
                    : (isFa ? 'تایید قطعی' : 'Confirm')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* REGISTRATION FORM MODALS */}
        {/* --------------------------------------------------------------------- */}

        {/* Modal 5: Add Related Party / Company */}
        {addPartyModal.isOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleCreateRelatedParty} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-scaleUp border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Building2 size={22} className="text-purple-600" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isFa ? 'ثبت بستگان درجه‌یک یا شرکت متعلق به مشتری' : 'Add Relative or Company'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAddPartyModal((prev) => ({ ...prev, isOpen: false }))}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 1. Customer Select (From profiles list strictly, NOT free text ID) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  {isFa ? 'انتخاب مشتری تبادل:' : 'Exchange Customer:'}
                </label>
                <select
                  required
                  value={addPartyModal.leadId}
                  onChange={(e) => handleLeadSelectForParty(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="">{isFa ? '-- انتخاب از بین مشتریان تبادل --' : '-- Select Customer --'}</option>
                  {allProfiles.map((p) => (
                    <option key={p.id} value={p.lead_id}>
                      {p.lead?.full_name || p.lead_id} ({p.lead?.phone || p.lead?.email || p.exchange_status})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Party Type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  {isFa ? 'نوع ماهیت:' : 'Party Type:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddPartyModal((prev) => ({ ...prev, partyType: 'person', relationship: 'father' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      addPartyModal.partyType === 'person'
                        ? 'bg-purple-50 border-purple-400 text-purple-800 ring-2 ring-purple-400/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {isFa ? 'شخص حقیقی (بستگان درجه‌یک)' : 'Individual Relative'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddPartyModal((prev) => ({ ...prev, partyType: 'company', relationship: 'own_company' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      addPartyModal.partyType === 'company'
                        ? 'bg-purple-50 border-purple-400 text-purple-800 ring-2 ring-purple-400/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {isFa ? 'شرکت حقوقی متعلق به مشتری' : 'Customer-Owned Company'}
                  </button>
                </div>
              </div>

              {/* 3. Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  {addPartyModal.partyType === 'company' ? (isFa ? 'نام رسمی شرکت:' : 'Company Name:') : (isFa ? 'نام و نام خانوادگی:' : 'Full Name:')}
                </label>
                <input
                  type="text"
                  required
                  value={addPartyModal.fullName}
                  onChange={(e) => setAddPartyModal((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder={addPartyModal.partyType === 'company' ? (isFa ? 'مثال: شرکت بازرگانی پارس کاسپین' : 'Pars Caspian LLC') : (isFa ? 'مثال: علی رضایی' : 'Ali Rezai')}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* 4. Relationship */}
              {addPartyModal.partyType === 'person' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    {isFa ? 'نسبت درجه‌یک با مشتری:' : 'Relationship:'}
                  </label>
                  <select
                    value={addPartyModal.relationship}
                    onChange={(e) => setAddPartyModal((prev) => ({ ...prev, relationship: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="father">{isFa ? 'پدر' : 'Father'}</option>
                    <option value="mother">{isFa ? 'مادر' : 'Mother'}</option>
                    <option value="spouse">{isFa ? 'همسر' : 'Spouse'}</option>
                    <option value="child">{isFa ? 'فرزند' : 'Child'}</option>
                    <option value="sibling">{isFa ? 'خواهر یا برادر' : 'Sibling'}</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    {isFa ? 'نسبت حقوقی:' : 'Legal Relationship:'}
                  </label>
                  <div className="p-2.5 bg-slate-100 rounded-xl text-xs font-bold text-purple-900 border border-slate-200">
                    {isFa ? 'شرکت اختصاصی تحت مالکیت مشتری (own_company)' : 'Own Company'}
                  </div>
                </div>
              )}

              {/* 5. National ID */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  {addPartyModal.partyType === 'company' ? (isFa ? 'شناسه ملی شرکت:' : 'Company National ID:') : (isFa ? 'کد ملی:' : 'National ID:')}
                </label>
                <input
                  type="text"
                  required
                  value={addPartyModal.nationalId}
                  onChange={(e) => setAddPartyModal((prev) => ({ ...prev, nationalId: e.target.value }))}
                  placeholder={addPartyModal.partyType === 'company' ? '1010101010' : '0012345678'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* 6. Document Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>
                    {isFa ? 'مدرک هویتی / ثبتی:' : 'ID / Registration Document:'}
                    {addPartyModal.partyType === 'company' && <span className="text-rose-500 mr-1">*</span>}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {addPartyModal.partyType === 'company'
                      ? (isFa ? 'الزامی برای شرکت' : 'Required for company')
                      : (isFa ? 'اختیاری برای اشخاص حقیقی' : 'Optional for individuals')}
                  </span>
                </label>

                {!addPartyModal.leadId ? (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-400 italic">
                    {isFa ? 'ابتدا مشتری را در بالا انتخاب کنید.' : 'Select a customer above first.'}
                  </div>
                ) : loadingCustomerDocuments ? (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                    {isFa ? 'در حال بارگذاری مدارک مشتری...' : 'Loading customer documents...'}
                  </div>
                ) : customerDocuments.length === 0 ? (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center space-x-2 rtl:space-x-reverse">
                    <Info size={15} className="shrink-0 text-amber-600" />
                    <span>{isFa ? 'برای این مشتری مدرکی ثبت نشده است.' : 'No documents found for this customer.'}</span>
                  </div>
                ) : (
                  <select
                    value={addPartyModal.idDocumentId}
                    onChange={(e) => setAddPartyModal((prev) => ({ ...prev, idDocumentId: e.target.value, error: null }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="">
                      {addPartyModal.partyType === 'company'
                        ? (isFa ? '-- انتخاب مدرک ثبتی شرکت (الزامی) --' : '-- Select Company Document (Required) --')
                        : (isFa ? '-- بدون انتخاب مدرک (اختیاری) --' : '-- None (Optional) --')}
                    </option>
                    {customerDocuments.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.file_name} ({doc.label || doc.document_type || 'مدرک'})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {addPartyModal.error && (
                <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center space-x-2 rtl:space-x-reverse">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{addPartyModal.error}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-2">
                <button
                  type="button"
                  disabled={addPartyModal.isSubmitting}
                  onClick={() => setAddPartyModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={addPartyModal.isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {addPartyModal.isSubmitting ? (isFa ? 'در حال ثبت...' : 'Submitting...') : (isFa ? 'ثبت ردیف بستگان' : 'Submit Party')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal 6: Add Authorized Recipient */}
        {addRecipientModal.isOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleCreateAuthorizedRecipient} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-scaleUp border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <ShieldCheck size={22} className="text-emerald-600" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isFa ? 'ثبت گیرنده مجاز در رومانی (تحویل وجه نقدی یا بانکی)' : 'Add Authorized Recipient'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAddRecipientModal((prev) => ({ ...prev, isOpen: false }))}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 1. Customer Lead Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  {isFa ? '۱. مشتری واگذارکننده (صاحب درخواست تبادل):' : '1. Customer Lead:'}
                </label>
                <select
                  required
                  value={addRecipientModal.leadId}
                  onChange={(e) => setAddRecipientModal((prev) => ({ ...prev, leadId: e.target.value, error: null }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">{isFa ? '-- انتخاب مشتری --' : '-- Select Customer --'}</option>
                  {allProfiles.map((p) => (
                    <option key={`cust-${p.id}`} value={p.lead_id}>
                      {p.lead?.full_name || p.lead_id} ({p.lead?.phone || p.lead?.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Recipient Lead Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  {isFa ? '۲. گیرنده مجاز در رومانی (باید مشتری ثبت‌شده تبادل باشد):' : '2. Authorized Recipient Lead:'}
                </label>
                <select
                  required
                  value={addRecipientModal.recipientLeadId}
                  onChange={(e) => setAddRecipientModal((prev) => ({ ...prev, recipientLeadId: e.target.value, error: null }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">{isFa ? '-- انتخاب گیرنده در رومانی --' : '-- Select Recipient --'}</option>
                  {allProfiles.map((p) => {
                    const isSame = p.lead_id === addRecipientModal.leadId;
                    const isApproved = p.exchange_status === 'approved';
                    return (
                      <option key={`rec-${p.id}`} value={p.lead_id} disabled={isSame}>
                        {p.lead?.full_name || p.lead_id} - {isApproved ? (isFa ? 'پرونده تاییدشده' : 'Approved') : (isFa ? `وضعیت: ${p.exchange_status}` : p.exchange_status)}
                        {isSame ? (isFa ? ' (همان مشتری)' : ' (Self)') : ''}
                      </option>
                    );
                  })}
                </select>
                {addRecipientModal.recipientLeadId && (
                  <div className="text-[11px] pt-1">
                    {profileStatusByLeadId.get(addRecipientModal.recipientLeadId)?.exchange_status === 'approved' ? (
                      <span className="text-emerald-700 font-bold flex items-center space-x-1 rtl:space-x-reverse">
                        <Check size={12} />
                        <span>{isFa ? 'پرونده این متقاضی تاییدشده است و می‌تواند تایید صلاحیت شود.' : 'Profile is approved.'}</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold flex items-center space-x-1 rtl:space-x-reverse">
                        <Info size={12} />
                        <span>{isFa ? 'توجه: پرونده این شخص هنوز approved نیست و تایید نهایی گیرندگی وی منوط به تایید پرونده تبادل او خواهد بود.' : 'Notice: Profile not approved yet.'}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Relationship */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  {isFa ? '۳. نسبت یا ارتباط گیرنده با مشتری:' : '3. Relationship:'}
                </label>
                <input
                  type="text"
                  required
                  value={addRecipientModal.relationship}
                  onChange={(e) => setAddRecipientModal((prev) => ({ ...prev, relationship: e.target.value }))}
                  placeholder={isFa ? 'مثال: دوست، شریک تجاری، برادر، نماینده قانونی در بخارست...' : 'e.g. Business partner, friend, representative...'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {addRecipientModal.error && (
                <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center space-x-2 rtl:space-x-reverse">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{addRecipientModal.error}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-2">
                <button
                  type="button"
                  disabled={addRecipientModal.isSubmitting}
                  onClick={() => setAddRecipientModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={addRecipientModal.isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {addRecipientModal.isSubmitting ? (isFa ? 'در حال ثبت...' : 'Submitting...') : (isFa ? 'ثبت ردیف گیرنده مجاز' : 'Submit Recipient')}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
