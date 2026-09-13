'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  FileCheck2,
  Lock,
  Building2,
  FileText,
  User,
  Sparkles,
  Download,
  Upload,
  Calendar,
  KeyRound,
  MessageSquare,
} from '@/components/Icons';

interface ExchangePageProps {
  params: { lang: Language };
}

interface ExchangeAccount {
  id: string;
  kind: 'IR_SHEBA' | 'IR_CARD' | 'RO_IBAN';
  value: string;
  holder_name: string;
  is_active: boolean;
  verified_at: string | null;
}

interface OrderBookItem {
  id: string;
  direction: 'RO_TO_IR' | 'IR_TO_RO';
  eur_currency: 'EUR' | 'RON';
  eur_amount: number;
  rate: number;
  irr_amount: number;
  allow_partial: boolean;
  min_chunk: number | null;
  status: string;
  expires_at: string;
  created_at: string;
  remaining_eur: number;
}

interface MyRequestItem {
  id: string;
  direction: 'RO_TO_IR' | 'IR_TO_RO';
  eur_currency: 'EUR' | 'RON';
  eur_amount: number;
  rate: number;
  irr_amount: number;
  allow_partial: boolean;
  min_chunk: number | null;
  status: string;
  expires_at: string;
  price_version: number;
  renewed_count: number;
  created_at: string;
  destination_account?: {
    id: string;
    kind: string;
    value: string;
    holder_name: string;
  };
  matches?: Array<{ id: string; amount_eur: number; status: string }>;
}

interface MatchItem {
  id: string;
  request_id: string;
  amount_eur: number;
  rate_snapshot: number;
  amount_irr: number;
  fee_eur: number;
  status: string;
  userRoles: string[];
  reserved_until: string;
  eur_due_at: string | null;
  proof_due_at: string | null;
  confirm_due_at: string | null;
  destination_account?: {
    id: string;
    kind: string;
    value: string;
    holder_name: string;
  } | null;
  nextStep: {
    actorRole: string;
    isMyTurn: boolean;
    actionLabelFa: string;
    actionLabelEn: string;
    deadline: string | null;
  };
  proofs?: Array<{
    id: string;
    side: 'payer' | 'receiver';
    proof_type: string;
    instrument: string;
    submitted_at: string;
    bank_reference?: string;
  }>;
}

export default function ExchangePortalPage({ params }: ExchangePageProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'order_book' | 'matches' | 'my_requests' | 'accounts'>('order_book');
  const [loading, setLoading] = useState(true);
  const [exchangeStatus, setExchangeStatus] = useState<string>('not_requested');
  const [dailyVolume, setDailyVolume] = useState<{ currentDailyEur: number; maxDailyLimit: number; remainingEur: number }>({
    currentDailyEur: 0,
    maxDailyLimit: 9000,
    remainingEur: 9000,
  });

  // Data lists
  const [accounts, setAccounts] = useState<ExchangeAccount[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBookItem[]>([]);
  const [myRequests, setMyRequests] = useState<MyRequestItem[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);

  // Modals
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState<OrderBookItem | null>(null);
  const [reserveAmountEur, setReserveAmountEur] = useState<string>('');
  const [reserveAccountId, setReserveAccountId] = useState<string>('');
  const [reserving, setReserving] = useState(false);
  const [reservedMatchDetails, setReservedMatchDetails] = useState<any | null>(null);

  // New Request Form State
  const [newDirection, setNewDirection] = useState<'RO_TO_IR' | 'IR_TO_RO'>('RO_TO_IR');
  const [newCurrency, setNewCurrency] = useState<'EUR' | 'RON'>('EUR');
  const [newAmountEur, setNewAmountEur] = useState<string>('');
  const [newRate, setNewRate] = useState<string>('');
  const [newAllowPartial, setNewAllowPartial] = useState(false);
  const [newMinChunk, setNewMinChunk] = useState<string>('');
  const [newAccountId, setNewAccountId] = useState<string>('');
  const [creatingRequest, setCreatingRequest] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // New Account Form State
  const [newAccKind, setNewAccKind] = useState<'IR_SHEBA' | 'IR_CARD' | 'RO_IBAN'>('IR_SHEBA');
  const [newAccValue, setNewAccValue] = useState<string>('');
  const [newAccHolder, setNewAccHolder] = useState<string>('');
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Match Proof Upload State
  const [uploadingMatchId, setUploadingMatchId] = useState<string | null>(null);
  const [uploadProofSide, setUploadProofSide] = useState<'payer' | 'receiver'>('payer');
  const [uploadInstrument, setUploadInstrument] = useState<'satna' | 'card_to_card' | 'paya'>('satna');
  const [uploadBankRef, setUploadBankRef] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofError, setProofError] = useState<string | null>(null);

  // Status Check & Initial Load
  const loadPortalData = async () => {
    try {
      // 1. Check status
      const statusRes = await fetch('/api/portal/exchange/status');
      if (statusRes.status === 401) {
        router.push(`/${currentLang}/portal/login`);
        return;
      }
      const statusData = await statusRes.json().catch(() => null);

      if (!statusData?.profile || statusData.profile.exchange_status !== 'approved') {
        router.replace(`/${currentLang}/portal/exchange/request-access`);
        return;
      }

      setExchangeStatus(statusData.profile.exchange_status);
      setAccounts(statusData.accounts || []);
      if (statusData.dailyVolume) {
        setDailyVolume(statusData.dailyVolume);
      }

      // 2. Fetch order book
      const bookRes = await fetch('/api/portal/exchange/requests');
      const bookData = await bookRes.json().catch(() => null);
      if (bookData?.success) {
        setOrderBook(bookData.requests || []);
      }

      // 3. Fetch customer requests
      const myReqRes = await fetch('/api/portal/exchange/my-requests');
      const myReqData = await myReqRes.json().catch(() => null);
      if (myReqData?.success) {
        setMyRequests(myReqData.requests || []);
      }

      // 4. Fetch customer matches
      const matchRes = await fetch('/api/portal/exchange/matches');
      const matchData = await matchRes.json().catch(() => null);
      if (matchData?.success) {
        setMatches(matchData.matches || []);
      }
    } catch (err) {
      console.error('Error loading exchange portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  // 1. Submit New Request
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const eur = Number(newAmountEur);
    const rate = Number(newRate);

    if (isNaN(eur) || eur <= 0) {
      setFormError(isFa ? 'مبلغ ارز باید عددی مثبت باشد.' : 'Amount must be a positive number.');
      return;
    }

    if (isNaN(rate) || rate <= 0) {
      setFormError(isFa ? 'نرخ تبدیل باید عددی مثبت باشد.' : 'Rate must be a positive number.');
      return;
    }

    if (!newAccountId) {
      setFormError(isFa ? 'انتخاب حساب مقصد الزامی است.' : 'Destination account is required.');
      return;
    }

    if (eur > dailyVolume.remainingEur) {
      setFormError(
        isFa
          ? `مبلغ درخواستی (${eur.toLocaleString()} یورو) از سقف مجاز روزانه بخارست (${dailyVolume.remainingEur.toLocaleString()} یورو باقی‌مانده) بیشتر است.`
          : 'Requested amount exceeds remaining Bucharest daily limit.'
      );
      return;
    }

    setCreatingRequest(true);
    try {
      const res = await fetch('/api/portal/exchange/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction: newDirection,
          eur_currency: newCurrency,
          eur_amount: eur,
          rate,
          allow_partial: newAllowPartial,
          min_chunk: newAllowPartial ? Number(newMinChunk) : null,
          destination_account_id: newAccountId,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(data?.error || (isFa ? 'خطا در ثبت درخواست.' : 'Failed to create request.'));
        return;
      }

      setFormSuccess(
        isFa
          ? 'درخواست تبادل ارز با موفقیت ثبت شد و به مدت ۲۴ ساعت در دفتر سفارش‌ها فعال است.'
          : 'Exchange request submitted successfully.'
      );
      setNewAmountEur('');
      setNewRate('');
      setNewMinChunk('');
      setShowNewRequestModal(false);
      loadPortalData();
      setActiveTab('my_requests');
    } catch (err) {
      setFormError(isFa ? 'خطای غیرمنتظره در ارسال درخواست.' : 'An error occurred.');
    } finally {
      setCreatingRequest(false);
    }
  };

  // 2. Reserve / Accept Request
  const handleReserveMatch = async () => {
    if (!showReserveModal || !reserveAccountId) return;
    setReserving(true);
    try {
      const amount = Number(reserveAmountEur || showReserveModal.remaining_eur);

      const res = await fetch('/api/portal/exchange/matches/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: showReserveModal.id,
          amount_eur: amount,
          destination_account_id: reserveAccountId,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        alert(data?.error || (isFa ? 'خطا در رزرو معامله.' : 'Failed to reserve match.'));
        return;
      }

      setReservedMatchDetails(data.match);
      loadPortalData();
    } catch (err) {
      alert(isFa ? 'خطا در برقراری ارتباط با سرور.' : 'Network error.');
    } finally {
      setReserving(false);
    }
  };

  // 3. Cancel Free Reservation
  const handleCancelFree = async (matchId: string) => {
    if (!confirm(isFa ? 'آیا از انصراف بدون جریمه اطمینان دارید؟' : 'Are you sure you want to cancel?')) return;
    try {
      const res = await fetch(`/api/portal/exchange/matches/${matchId}/cancel-free`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        alert(isFa ? 'رزرو بدون جریمه لغو شد.' : 'Match reservation cancelled free of charge.');
        setShowReserveModal(null);
        setReservedMatchDetails(null);
        loadPortalData();
      } else {
        alert(data?.error || 'Error');
      }
    } catch (err) {
      alert('Error');
    }
  };

  // 4. Rate Adjust & Cancel My Request
  const handleRateAdjust = async (requestId: string) => {
    const currentRateStr = prompt(isFa ? 'نرخ پیشنهادی جدید (تومان به ازای هر یورو):' : 'Enter new rate:');
    if (!currentRateStr) return;
    const rate = Number(currentRateStr);
    if (isNaN(rate) || rate <= 0) {
      alert(isFa ? 'نرخ وارد شده نامعتبر است.' : 'Invalid rate.');
      return;
    }

    try {
      const res = await fetch(`/api/portal/exchange/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rate_adjust', new_rate: rate }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        alert(isFa ? 'نرخ با موفقیت اصلاح شد.' : 'Rate adjusted.');
        loadPortalData();
      } else {
        alert(data?.error || 'Failed');
      }
    } catch (err) {
      alert('Error');
    }
  };

  const handleRenewRequest = async (requestId: string) => {
    try {
      const res = await fetch(`/api/portal/exchange/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'renew' }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        alert(isFa ? 'درخواست ۲۴ ساعت تمدید شد.' : 'Request renewed for 24 hours.');
        loadPortalData();
      } else {
        alert(data?.error || 'Failed');
      }
    } catch (err) {
      alert('Error');
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!confirm(isFa ? 'آیا از لغو این درخواست اطمینان دارید؟' : 'Confirm cancellation?')) return;
    try {
      const res = await fetch(`/api/portal/exchange/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        alert(isFa ? 'درخواست با موفقیت لغو شد.' : 'Request cancelled.');
        loadPortalData();
      } else {
        alert(data?.error || 'Failed');
      }
    } catch (err) {
      alert('Error');
    }
  };

  // 5. Add New Account
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    setSavingAccount(true);

    try {
      const res = await fetch('/api/portal/exchange/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: newAccKind,
          value: newAccValue,
          holder_name: newAccHolder,
        }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setAccountError(data?.error || (isFa ? 'خطا در ثبت حساب.' : 'Failed to add account.'));
        return;
      }

      setNewAccValue('');
      setNewAccHolder('');
      loadPortalData();
      alert(isFa ? 'حساب جدید با موفقیت ثبت شد.' : 'Account added successfully.');
    } catch (err) {
      setAccountError(isFa ? 'خطای غیرمنتظره در ثبت حساب.' : 'Unexpected error.');
    } finally {
      setSavingAccount(false);
    }
  };

  // 6. Upload Match Proof (via lead_documents and storage)
  const handleUploadMatchProof = async (matchId: string) => {
    if (!uploadFile) {
      setProofError(isFa ? 'لطفاً ابتدا فایل سند را انتخاب نمایید.' : 'Please select a proof file.');
      return;
    }

    setUploadingProof(true);
    setProofError(null);

    try {
      // 1. Direct browser client upload to private Storage bucket lead-documents
      if (!supabase) throw new Error('Supabase unconfigured');

      const cleanFileName = uploadFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `exchange-proofs/${matchId}/${Date.now()}-${cleanFileName}`;

      const { error: storageError } = await supabase.storage
        .from('lead-documents')
        .upload(storagePath, uploadFile, { cacheControl: '3600', upsert: false });

      if (storageError) {
        throw new Error(storageError.message || 'Storage upload failed');
      }

      // 2. Insert into lead_documents metadata via portal documents API or helper
      const docRes = await fetch('/api/portal/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: 'financial_guarantee',
          storage_path: storagePath,
          file_name: uploadFile.name,
          mime_type: uploadFile.type,
          size_bytes: uploadFile.size,
          label: `سند انتقال معامله تبادل ارز ${matchId.slice(0, 8)}`,
        }),
      });

      const docData = await docRes.json().catch(() => null);
      if (!docRes.ok || !docData?.document?.id) {
        throw new Error(docData?.error || 'Failed to register document');
      }

      // 3. Register in exchange_transfer_proofs
      const proofRes = await fetch(`/api/portal/exchange/matches/${matchId}/proofs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          side: uploadProofSide,
          instrument: uploadInstrument,
          proof_type: uploadProofSide === 'receiver' ? 'account_statement' : 'transfer_receipt',
          document_id: docData.document.id,
          bank_reference: uploadBankRef || null,
        }),
      });

      const proofData = await proofRes.json().catch(() => null);
      if (!proofRes.ok) {
        throw new Error(proofData?.error || 'Failed to link exchange proof');
      }

      alert(isFa ? 'سند با موفقیت بارگذاری و ثبت گردید.' : 'Proof uploaded successfully.');
      setUploadingMatchId(null);
      setUploadFile(null);
      setUploadBankRef('');
      loadPortalData();
    } catch (err: any) {
      setProofError(err.message || (isFa ? 'خطا در بارگذاری سند.' : 'Upload error.'));
    } finally {
      setUploadingProof(false);
    }
  };

  // 7. Confirm IRR Receipt
  const handleConfirmIrr = async (matchId: string) => {
    if (!confirm(isFa ? 'آیا از تایید نهایی دریافت وجه ریالی در حسابتان اطمینان دارید؟' : 'Confirm IRR receipt?')) return;
    try {
      const res = await fetch(`/api/portal/exchange/matches/${matchId}/confirm-irr`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        alert(isFa ? 'دریافت ریال با موفقیت تایید شد.' : 'IRR receipt confirmed.');
        loadPortalData();
      } else {
        alert(data?.error || 'Failed to confirm IRR');
      }
    } catch (err) {
      alert('Error');
    }
  };

  // 8. Reveal Destination Account (Audit Event)
  const handleRevealAccount = async (matchId: string) => {
    try {
      const res = await fetch(`/api/portal/exchange/matches/${matchId}/reveal-account`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data.destination_account) {
        alert(
          isFa
            ? `اطلاعات حساب مقصد:\nنوع: ${data.destination_account.kind}\nشماره: ${data.destination_account.value}\nصاحب حساب: ${data.destination_account.holder_name}`
            : `Account Details:\n${data.destination_account.kind}: ${data.destination_account.value}\nHolder: ${data.destination_account.holder_name}`
        );
      } else {
        alert(data?.error || 'Account details unavailable.');
      }
    } catch (err) {
      alert('Error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-300">
            {isFa ? 'در حال بارگذاری سامانه تبادل ارز...' : 'Loading exchange portal...'}
          </p>
        </div>
      </div>
    );
  }

  // Filter accounts by request direction
  const eligibleAccountsForNew = accounts.filter((acc) => {
    if (newDirection === 'RO_TO_IR') return ['IR_SHEBA', 'IR_CARD'].includes(acc.kind);
    return acc.kind === 'RO_IBAN';
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 sm:p-8 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full space-y-8 pt-4 pb-16">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href={`/${currentLang}/portal/dashboard`}
              className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              {isFa ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {isFa ? 'سامانه تبادل ارز دورویا' : 'DORVIA Currency Exchange'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {isFa ? 'تایید‌شده' : 'Verified'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isFa
                  ? 'تبادل مستقیم و همتا‌به‌همتای یورو و ریال تحت نظارت صرافی‌های همکار'
                  : 'P2P Euro & IRR exchange supervised by partner institutions'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Daily Volume Badge */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl px-4 py-2 text-right">
              <div className="text-[10px] text-slate-400 font-bold">
                {isFa ? 'سقف تقویم بخارست (روزانه):' : 'Bucharest Daily Limit:'}
              </div>
              <div className="text-xs font-black text-blue-400">
                {dailyVolume.currentDailyEur.toLocaleString()} / {dailyVolume.maxDailyLimit.toLocaleString()} EUR
              </div>
            </div>

            {/* Create Request CTA */}
            <button
              type="button"
              onClick={() => {
                setFormError(null);
                setFormSuccess(null);
                setShowNewRequestModal(true);
              }}
              className="px-5 py-3 rounded-2xl bg-[#2F6FED] hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles size={16} />
              <span>{isFa ? '+ ثبت درخواست تازه' : '+ New Exchange Request'}</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 flex-wrap">
          <button
            onClick={() => setActiveTab('order_book')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'order_book'
                ? 'bg-[#2F6FED] text-white shadow-sm'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <Building2 size={16} />
            <span>{isFa ? 'دفتر سفارش‌ها' : 'Order Book'}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20">
              {orderBook.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'matches'
                ? 'bg-[#2F6FED] text-white shadow-sm'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <Clock size={16} />
            <span>{isFa ? 'معاملات من' : 'My Matches'}</span>
            {matches.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/30 text-blue-300">
                {matches.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('my_requests')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'my_requests'
                ? 'bg-[#2F6FED] text-white shadow-sm'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <FileText size={16} />
            <span>{isFa ? 'درخواست‌های من' : 'My Requests'}</span>
            {myRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300">
                {myRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'accounts'
                ? 'bg-[#2F6FED] text-white shadow-sm'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            <ShieldCheck size={16} />
            <span>{isFa ? 'حساب‌های من' : 'My Bank Accounts'}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300">
              {accounts.length}
            </span>
          </button>
        </div>

        {/* TAB 1: ORDER BOOK */}
        {activeTab === 'order_book' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white">
                {isFa ? 'درخواست‌های فعال سایر کاربران' : 'Active Orders from Other Members'}
              </h2>
              <span className="text-xs text-slate-400">
                {isFa ? 'اعتبار درخواست‌ها ۲۴ ساعته است' : 'Orders valid for 24 hours'}
              </span>
            </div>

            {orderBook.length === 0 ? (
              <div className="bg-slate-850/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Building2 size={24} />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {isFa ? 'در حال حاضر درخواستی در دفتر سفارش‌ها وجود ندارد.' : 'No open orders at this time.'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {isFa
                    ? 'شما می‌توانید با فشردن دکمه «ثبت درخواست تازه»، سفارش خرید یا فروش ارز خود را ثبت نمایید.'
                    : 'You can create your own order using the button above.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orderBook.map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-850 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 shadow-lg transition-all space-y-5 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Direction and Currency Badge */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-black ${
                            req.direction === 'RO_TO_IR'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {req.direction === 'RO_TO_IR'
                            ? isFa
                              ? 'ارسال یورو در رومانی ← دریافت ریال در ایران'
                              : 'Giving EUR (RO) → Receiving IRR (IR)'
                            : isFa
                            ? 'ارسال ریال در ایران ← دریافت یورو در رومانی'
                            : 'Giving IRR (IR) → Receiving EUR (RO)'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {req.eur_currency}
                        </span>
                      </div>

                      {/* Amounts */}
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-white">
                          {req.remaining_eur.toLocaleString()}{' '}
                          <span className="text-sm font-normal text-slate-400">{req.eur_currency}</span>
                        </div>
                        <div className="text-xs font-bold text-blue-400">
                          {isFa ? 'نرخ هر یورو:' : 'Rate:'} {req.rate.toLocaleString()} {isFa ? 'تومان' : 'Toman'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {isFa ? 'معادل کل:' : 'Total IRR:'} {(req.remaining_eur * req.rate).toLocaleString()}{' '}
                          {isFa ? 'تومان' : 'Toman'}
                        </div>
                      </div>

                      {/* Conditions */}
                      <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>{isFa ? 'تقسیم‌پذیری:' : 'Allow Partial:'}</span>
                          <span className="font-bold text-slate-300">
                            {req.allow_partial
                              ? isFa
                                ? `بله (حداقل ${req.min_chunk || 100} یورو)`
                                : `Yes (min ${req.min_chunk || 100} EUR)`
                              : isFa
                              ? 'فقط یکجا'
                              : 'Full chunk only'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{isFa ? 'زمان انقضا:' : 'Expires:'}</span>
                          <span className="font-bold text-slate-300">
                            {new Date(req.expires_at).toLocaleTimeString(isFa ? 'fa-IR' : 'en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action CTA */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowReserveModal(req);
                        setReserveAmountEur(String(req.remaining_eur));
                        setReserveAccountId('');
                        setReservedMatchDetails(null);
                      }}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      <span>{isFa ? 'پذیرش و رزرو معامله' : 'Accept & Reserve'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY MATCHES */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white">
                {isFa ? 'معاملات در جریان و تسویه‌شده' : 'Active & Settled Matches'}
              </h2>
            </div>

            {matches.length === 0 ? (
              <div className="bg-slate-850/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Clock size={24} />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {isFa ? 'شما در حال حاضر معامله‌ای ندارید.' : 'No active trades found.'}
                </h3>
              </div>
            ) : (
              <div className="space-y-5">
                {matches.map((m) => {
                  const isReserved = m.status === 'RESERVED';
                  const isReceiver = m.userRoles.includes('irr_receiver');
                  const isPayer = m.userRoles.includes('irr_payer');
                  const hasReceiverProof = (m.proofs || []).some((p) => p.side === 'receiver');
                  const hasPayerProof = (m.proofs || []).some((p) => p.side === 'payer');

                  return (
                    <div
                      key={m.id}
                      className="bg-slate-850 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-slate-400">
                              #{m.id.slice(0, 8)}
                            </span>
                            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              {m.status}
                            </span>
                          </div>
                          <div className="text-lg font-black text-white mt-1">
                            {Number(m.amount_eur).toLocaleString()} EUR ↔ {(Number(m.amount_irr) / 10).toLocaleString()} {isFa ? 'تومان' : 'Toman'}
                          </div>
                        </div>

                        {/* Actor Next Step */}
                        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 sm:max-w-md">
                          <div className="text-[10px] text-slate-400 font-bold">
                            {isFa ? 'اقدام بعدی بر عهده:' : 'Next Action Required by:'}
                          </div>
                          <div className="text-xs font-bold text-amber-300 mt-0.5">
                            {isFa ? m.nextStep.actionLabelFa : m.nextStep.actionLabelEn}
                          </div>
                          {m.nextStep.deadline && (
                            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                              <Clock size={12} />
                              <span>
                                {isFa ? 'مهلت اقدام:' : 'Deadline:'}{' '}
                                {new Date(m.nextStep.deadline).toLocaleString(isFa ? 'fa-IR' : 'en-US')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Revealed Account Section */}
                      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-slate-300">
                            {isFa ? 'اطلاعات حساب مقصد معامله:' : 'Destination Account:'}
                          </div>
                          {m.destination_account ? (
                            <div className="text-xs text-slate-400 font-mono">
                              {m.destination_account.kind}: {m.destination_account.value} ({m.destination_account.holder_name})
                            </div>
                          ) : (
                            <div className="text-xs text-slate-500 italic">
                              {isFa ? 'برای مشاهده حساب مقصد دکمه روبرو را بزنید' : 'Click to view revealed account'}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRevealAccount(m.id)}
                          className="px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all cursor-pointer self-start sm:self-auto"
                        >
                          {isFa ? 'نمایش شماره حساب' : 'View Account'}
                        </button>
                      </div>

                      {/* Actions Bar */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {/* Cancel Free Button during 30 min reservation */}
                        {isReserved && (
                          <button
                            type="button"
                            onClick={() => handleCancelFree(m.id)}
                            className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                          >
                            {isFa ? 'انصراف بدون جریمه (بازه ۳۰ دقیقه‌ای)' : 'Cancel Free (30-min window)'}
                          </button>
                        )}

                        {/* Upload Statement / Proof */}
                        {isPayer && (
                          <button
                            type="button"
                            onClick={() => {
                              setUploadingMatchId(m.id);
                              setUploadProofSide('payer');
                              setUploadInstrument('satna');
                              setProofError(null);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                          >
                            <Upload size={14} />
                            <span>{isFa ? 'بارگذاری فیش واریز ریالی (واریزکننده)' : 'Upload Payment Receipt'}</span>
                          </button>
                        )}

                        {isReceiver && (
                          <button
                            type="button"
                            onClick={() => {
                              setUploadingMatchId(m.id);
                              setUploadProofSide('receiver');
                              setUploadInstrument('satna');
                              setProofError(null);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                          >
                            <FileText size={14} />
                            <span>{isFa ? 'بارگذاری پرینت حساب بانکی (گیرنده ریال)' : 'Upload Receiver Statement'}</span>
                          </button>
                        )}

                        {/* Confirm IRR Received button */}
                        {isReceiver && (
                          <button
                            type="button"
                            onClick={() => handleConfirmIrr(m.id)}
                            disabled={!hasReceiverProof || m.status === 'IRR_CONFIRMED' || m.status === 'SETTLED'}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                          >
                            <CheckCircle size={14} />
                            <span>{isFa ? 'دریافت را تایید می‌کنم' : 'Confirm IRR Received'}</span>
                          </button>
                        )}
                      </div>

                      {/* Notice if Receiver Proof is pending */}
                      {isReceiver && !hasReceiverProof && (
                        <div className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                          {isFa
                            ? '⚠️ جهت فعال شدن دکمه «دریافت را تایید می‌کنم»، ابتدا بارگذاری پرینت حساب بانکی نشان‌دهنده نشست واریز الزامی است.'
                            : 'Receiver account statement upload is mandatory before receipt confirmation can be unlocked.'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY REQUESTS */}
        {activeTab === 'my_requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white">
                {isFa ? 'درخواست‌های ثبت‌شده توسط شما' : 'My Exchange Requests'}
              </h2>
            </div>

            {myRequests.length === 0 ? (
              <div className="bg-slate-850/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <FileText size={24} />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {isFa ? 'شما هنوز درخواستی ثبت نکرده‌اید.' : 'You have not submitted any orders yet.'}
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myRequests.map((req) => {
                  const hasActiveMatches = (req.matches || []).some(
                    (m) => !['CANCELLED_FREE', 'REFUNDED', 'EXPIRED'].includes(m.status)
                  );

                  return (
                    <div
                      key={req.id}
                      className="bg-slate-850 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-5 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-black ${
                              req.direction === 'RO_TO_IR'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {req.direction === 'RO_TO_IR' ? 'RO → IR' : 'IR → RO'}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {req.status} (v{req.price_version})
                          </span>
                        </div>

                        <div className="text-xl font-black text-white">
                          {Number(req.eur_amount).toLocaleString()} {req.eur_currency}
                        </div>
                        <div className="text-xs font-bold text-blue-400">
                          {isFa ? 'نرخ:' : 'Rate:'} {Number(req.rate).toLocaleString()} {isFa ? 'تومان' : 'Toman'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {isFa ? 'معادل ریالی:' : 'Total IRR:'} {(Number(req.irr_amount) / 10).toLocaleString()} {isFa ? 'تومان' : 'Toman'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {isFa ? 'انقضا:' : 'Expires:'} {new Date(req.expires_at).toLocaleString(isFa ? 'fa-IR' : 'en-US')}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleRateAdjust(req.id)}
                          disabled={hasActiveMatches || req.status === 'cancelled'}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white transition-all cursor-pointer"
                        >
                          {isFa ? 'اصلاح نرخ' : 'Adjust Rate'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRenewRequest(req.id)}
                          disabled={req.status === 'cancelled'}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white transition-all cursor-pointer"
                        >
                          {isFa ? 'تمدید ۲۴ ساعته' : 'Renew 24h'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancelRequest(req.id)}
                          disabled={hasActiveMatches || req.status === 'cancelled'}
                          className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 disabled:opacity-40 text-xs font-bold text-rose-300 transition-all cursor-pointer"
                        >
                          {isFa ? 'لغو درخواست' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY ACCOUNTS */}
        {activeTab === 'accounts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Account List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-base font-extrabold text-white">
                {isFa ? 'حساب‌های بانکی ثبت‌شده شما' : 'Registered Bank Accounts'}
              </h2>

              {accounts.length === 0 ? (
                <div className="bg-slate-850/60 border border-slate-800 rounded-3xl p-8 text-center text-xs text-slate-400">
                  {isFa ? 'هنوز حساب بانکی ثبت نکرده‌اید.' : 'No bank accounts registered yet.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="bg-slate-850 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400">
                            {acc.kind}
                          </span>
                          <span className="text-xs font-bold text-white">{acc.holder_name}</span>
                        </div>
                        <div className="text-xs font-mono text-slate-300">{acc.value}</div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Account Form (5 cols) */}
            <div className="lg:col-span-5 bg-slate-850 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg space-y-5">
              <h3 className="text-sm font-extrabold text-white">
                {isFa ? 'افزودن حساب بانکی جدید' : 'Add New Bank Account'}
              </h3>

              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isFa ? 'نوع حساب' : 'Account Type'}
                  </label>
                  <select
                    value={newAccKind}
                    onChange={(e: any) => setNewAccKind(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="IR_SHEBA">{isFa ? 'شماره شبا ایران (IR...)' : 'Iran SHEBA'}</option>
                    <option value="IR_CARD">{isFa ? 'شماره کارت ایران (۱۶ رقمی)' : 'Iran Card (16 digits)'}</option>
                    <option value="RO_IBAN">{isFa ? 'شماره شبا رومانی (RO IBAN)' : 'Romania IBAN'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {newAccKind === 'IR_SHEBA'
                      ? isFa
                        ? 'شماره شبا (با IR و ۲۴ رقم)'
                        : 'SHEBA (IR + 24 digits)'
                      : newAccKind === 'IR_CARD'
                      ? isFa
                        ? 'شماره کارت (۱۶ رقم)'
                        : 'Card Number (16 digits)'
                      : isFa
                      ? 'شماره IBAN رومانی (با RO و ۲۲ رقم)'
                      : 'Romania IBAN (RO + 22 chars)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccValue}
                    onChange={(e) => setNewAccValue(e.target.value)}
                    placeholder={
                      newAccKind === 'IR_SHEBA'
                        ? 'IR000000000000000000000000'
                        : newAccKind === 'IR_CARD'
                        ? '6037990000000000'
                        : 'RO00AAAA0000000000000000'
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isFa ? 'نام صاحب حساب' : 'Account Holder Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccHolder}
                    onChange={(e) => setNewAccHolder(e.target.value)}
                    placeholder={isFa ? 'نام و نام‌خانوادگی دقیق صاحب حساب' : 'Full legal name'}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                {accountError && (
                  <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-800 p-3 rounded-xl">
                    {accountError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingAccount}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  {savingAccount ? '...' : isFa ? 'ثبت و تایید حساب' : 'Save Account'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CREATE NEW REQUEST */}
        {showNewRequestModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-850 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <h3 className="text-base font-black text-white">
                  {isFa ? 'ثبت درخواست تبادل ارز تازه' : 'Create New Exchange Request'}
                </h3>
                <button
                  onClick={() => setShowNewRequestModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-4">
                {/* Direction */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isFa ? 'جهت تبادل' : 'Exchange Direction'}
                  </label>
                  <select
                    value={newDirection}
                    onChange={(e: any) => {
                      setNewDirection(e.target.value);
                      setNewAccountId('');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="RO_TO_IR">
                      {isFa
                        ? 'ارسال یورو در رومانی ← دریافت ریال در ایران'
                        : 'Give EUR (RO) → Receive IRR (IR)'}
                    </option>
                    <option value="IR_TO_RO">
                      {isFa
                        ? 'ارسال ریال در ایران ← دریافت یورو در رومانی'
                        : 'Give IRR (IR) → Receive EUR (RO)'}
                    </option>
                  </select>
                </div>

                {/* Currency & Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isFa ? 'ارز' : 'Currency'}
                    </label>
                    <select
                      value={newCurrency}
                      onChange={(e: any) => setNewCurrency(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="EUR">EUR (یورو)</option>
                      <option value="RON">RON (لئو رومانی)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isFa ? 'مبلغ ارز' : 'Amount'}
                    </label>
                    <input
                      type="number"
                      required
                      min="10"
                      max={dailyVolume.remainingEur}
                      value={newAmountEur}
                      onChange={(e) => setNewAmountEur(e.target.value)}
                      placeholder="مثلاً 1000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isFa ? 'نرخ پیشنهادی هر یورو (تومان)' : 'Rate per EUR (Toman)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    placeholder="مثلاً 68500"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                  {newAmountEur && newRate && (
                    <div className="text-[11px] text-blue-400 mt-1">
                      {isFa ? 'معادل تقریبی کل:' : 'Total Equivalent:'}{' '}
                      {(Number(newAmountEur) * Number(newRate)).toLocaleString()} {isFa ? 'تومان' : 'Toman'}
                    </div>
                  )}
                </div>

                {/* Partial Toggle */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-slate-300">
                    {isFa ? 'امکان تقسیم معامله' : 'Allow Partial Fulfillments'}
                  </span>
                  <input
                    type="checkbox"
                    checked={newAllowPartial}
                    onChange={(e) => setNewAllowPartial(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>

                {newAllowPartial && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isFa ? 'حداقل مبلغ هر قطعه (یورو)' : 'Minimum Chunk (EUR)'}
                    </label>
                    <input
                      type="number"
                      value={newMinChunk}
                      onChange={(e) => setNewMinChunk(e.target.value)}
                      placeholder="مثلاً 200"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                    />
                  </div>
                )}

                {/* Destination Account Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isFa ? 'حساب مقصد جهت دریافت وجه' : 'Destination Account'}
                  </label>
                  {eligibleAccountsForNew.length === 0 ? (
                    <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                      {isFa
                        ? 'شما برای این جهت تبادل حساب فعالی ثبت نکرده‌اید. لطفاً در تب «حساب‌های من» حساب ثبت کنید.'
                        : 'No matching account found. Please register an account in "My Accounts" first.'}
                    </div>
                  ) : (
                    <select
                      value={newAccountId}
                      required
                      onChange={(e) => setNewAccountId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="">{isFa ? '-- انتخاب حساب بانکی --' : '-- Select Account --'}</option>
                      {eligibleAccountsForNew.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.kind} - {acc.value} ({acc.holder_name})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Limit Notice */}
                <div className="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl">
                  {isFa
                    ? `اعتبار این درخواست ۲۴ ساعت خواهد بود. سقف مجاز روزانه بخارست: ${dailyVolume.maxDailyLimit.toLocaleString()} یورو (باقی‌مانده امروز: ${dailyVolume.remainingEur.toLocaleString()} یورو).`
                    : `Order expires in 24 hours. Bucharest daily limit applies.`}
                </div>

                {/* Terms placeholder */}
                {/* TODO: [User Copy Review] - Legal terms of order submission, escrow guarantee and liability disclosure */}

                {formError && (
                  <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-800 p-3 rounded-xl">
                    {formError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewRequestModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                  >
                    {isFa ? 'انصراف' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={creatingRequest || eligibleAccountsForNew.length === 0}
                    className="px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-blue-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-md cursor-pointer"
                  >
                    {creatingRequest ? '...' : isFa ? 'ثبت در دفتر سفارش‌ها' : 'Publish Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: RESERVE / ACCEPT ORDER */}
        {showReserveModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-850 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <h3 className="text-base font-black text-white">
                  {isFa ? 'رزرو ۳۰ دقیقه‌ای معامله' : 'Reserve 30-Minute Match'}
                </h3>
                <button
                  onClick={() => setShowReserveModal(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {!reservedMatchDetails ? (
                <div className="space-y-4">
                  <div className="bg-slate-900/60 p-4 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isFa ? 'جهت معامله:' : 'Direction:'}</span>
                      <span className="font-bold text-white">
                        {showReserveModal.direction === 'RO_TO_IR'
                          ? isFa
                            ? 'شما ریال می‌پردازید / یورو دریافت می‌کنید'
                            : 'You pay IRR / receive EUR'
                          : isFa
                          ? 'شما یورو می‌پردازید / ریال دریافت می‌کنید'
                          : 'You pay EUR / receive IRR'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isFa ? 'ظرفیت موجود:' : 'Capacity:'}</span>
                      <span className="font-bold text-blue-400">
                        {showReserveModal.remaining_eur.toLocaleString()} {showReserveModal.eur_currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isFa ? 'نرخ معامله:' : 'Rate:'}</span>
                      <span className="font-bold text-white">
                        {showReserveModal.rate.toLocaleString()} {isFa ? 'تومان' : 'Toman'}
                      </span>
                    </div>
                  </div>

                  {showReserveModal.allow_partial && (
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {isFa ? 'مبلغ مورد نظر جهت پذیرش (یورو)' : 'Amount to fulfill (EUR)'}
                      </label>
                      <input
                        type="number"
                        min={showReserveModal.min_chunk || 100}
                        max={showReserveModal.remaining_eur}
                        value={reserveAmountEur}
                        onChange={(e) => setReserveAmountEur(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                      />
                    </div>
                  )}

                  {/* Destination Account Selection for Acceptor */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isFa ? 'حساب مقصد شما جهت تحویل وجه' : 'Your Destination Account'}
                    </label>
                    <select
                      value={reserveAccountId}
                      onChange={(e) => setReserveAccountId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="">{isFa ? '-- انتخاب حساب --' : '-- Select Account --'}</option>
                      {accounts
                        .filter((acc) =>
                          showReserveModal.direction === 'RO_TO_IR'
                            ? acc.kind === 'RO_IBAN'
                            : ['IR_SHEBA', 'IR_CARD'].includes(acc.kind)
                        )
                        .map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.kind} - {acc.value} ({acc.holder_name})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                    {isFa
                      ? 'پس از فشردن رزرو، معامله به مدت ۳۰ دقیقه اختصاصی شده و شماره حساب جهت واریز به شما نمایش داده می‌شود. طی این ۳۰ دقیقه می‌توانید بدون جریمه انصراف دهید.'
                      : 'After reserving, you will have a 30-minute exclusivity window with free cancellation.'}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowReserveModal(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                    >
                      {isFa ? 'انصراف' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={handleReserveMatch}
                      disabled={reserving || !reserveAccountId}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-md cursor-pointer"
                    >
                      {reserving ? '...' : isFa ? 'رزرو ۳۰ دقیقه‌ای' : 'Reserve Match'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Post-Reservation Window with 30-min Counter & Cancel-Free */
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl space-y-2 text-xs">
                    <div className="font-extrabold text-emerald-400">
                      {isFa ? 'معامله با موفقیت رزرو شد!' : 'Match reserved successfully!'}
                    </div>
                    <div className="text-slate-300">
                      {isFa
                        ? 'شناسه معامله:'
                        : 'Match ID:'}{' '}
                      <span className="font-mono text-white">{reservedMatchDetails.id}</span>
                    </div>
                    <div className="text-slate-300">
                      {isFa ? 'مهلت انصراف بدون جریمه:' : 'Free cancellation expires:'}{' '}
                      <span className="font-bold text-amber-300">
                        {new Date(reservedMatchDetails.reserved_until).toLocaleTimeString(isFa ? 'fa-IR' : 'en-US')}
                      </span>
                    </div>
                  </div>

                  {/* Cancel Free Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <button
                      type="button"
                      onClick={() => handleCancelFree(reservedMatchDetails.id)}
                      className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      {isFa ? 'انصراف بدون جریمه' : 'Cancel Free'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowReserveModal(null);
                        setReservedMatchDetails(null);
                        setActiveTab('matches');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                    >
                      {isFa ? 'رفتن به معاملات من' : 'Go to My Matches'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD PROOF */}
        {uploadingMatchId && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-850 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="text-sm font-black text-white">
                  {uploadProofSide === 'receiver'
                    ? isFa
                      ? 'بارگذاری پرینت حساب گیرنده ریال'
                      : 'Upload Receiver Bank Statement'
                    : isFa
                    ? 'بارگذاری فیش انتقال ریالی'
                    : 'Upload Payment Transfer Receipt'}
                </h3>
                <button
                  onClick={() => setUploadingMatchId(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Transfer Instrument Selection (Decision 1: card_to_card, satna, paya) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isFa ? 'ابزار انتقال بانکی در ایران' : 'Banking Instrument'}
                  </label>
                  <select
                    value={uploadInstrument}
                    onChange={(e: any) => setUploadInstrument(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="satna">{isFa ? 'ساتنا (انتقال آنی / مبالغ بالا)' : 'SATNA'}</option>
                    <option value="paya">{isFa ? 'پایا (چرخه‌های تسویه شتابی)' : 'PAYA'}</option>
                    <option value="card_to_card">{isFa ? 'کارت‌به‌کارت' : 'Card-to-Card'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isFa ? 'شماره پیگیری / مرجع بانکی' : 'Bank Reference'}
                  </label>
                  <input
                    type="text"
                    value={uploadBankRef}
                    onChange={(e) => setUploadBankRef(e.target.value)}
                    placeholder={isFa ? 'اختیاری' : 'Optional'}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isFa ? 'فایل پرینت حساب / فیش (PDF یا تصویر)' : 'Proof File (PDF or Image)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                {proofError && (
                  <div className="text-xs text-rose-300 bg-rose-950/40 border border-rose-800 p-2.5 rounded-xl">
                    {proofError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setUploadingMatchId(null)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                  >
                    {isFa ? 'انصراف' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUploadMatchProof(uploadingMatchId)}
                    disabled={uploadingProof || !uploadFile}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-md cursor-pointer"
                  >
                    {uploadingProof ? '...' : isFa ? 'ارسال سند' : 'Upload Proof'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Security / Compliance Placeholder */}
        <div className="pt-8 border-t border-slate-800/80 text-center">
          {/* TODO: [User Copy Review] - Legal disclaimers, dispute resolution rules, and banking calendar policies */}
          <p className="italic text-[11px] text-slate-500">
            [TODO: بیانیه انطباق قوانین مبارزه با پولشویی، نگهداری اسناد و فراداده‌ها به مدت ۲۴ ماه، و حل اختلاف — نگارش توسط صاحب پروژه]
          </p>
        </div>
      </div>
    </div>
  );
}
