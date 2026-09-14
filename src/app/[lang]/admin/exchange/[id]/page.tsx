'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Language } from '@/types';
import {
  Landmark,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Check,
  FileCheck2,
  FileText,
  User,
  CreditCard,
  Receipt,
  LogOut,
  Users,
  Settings,
} from '@/components/Icons';

interface MatchDossierPageProps {
  params: { lang: Language; id: string };
}

interface LeadRecord {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

interface PartnerRecord {
  id: string;
  name: string;
  country: string;
  role: string;
  license_number?: string | null;
  access_level?: string | null;
}

interface RequestRecord {
  id: string;
  direction: 'EUR_TO_IRR' | 'IRR_TO_EUR';
  eur_amount: number;
  rate: number;
  irr_amount: number;
  min_chunk: number;
  requester_lead_id: string;
}

interface DestinationAccount {
  id: string;
  kind: string;
  value: string;
  holder_name: string;
  verified_at: string | null;
  is_active: boolean;
}

interface MatchRecord {
  id: string;
  request_id: string;
  acceptor_lead_id: string;
  amount_eur: number;
  rate_snapshot: number;
  amount_irr: number;
  fee_eur: number;
  status: string;
  eur_payer_lead_id: string;
  eur_receiver_lead_id: string;
  irr_payer_lead_id: string;
  irr_receiver_lead_id: string;
  destination_account_id: string | null;
  reserved_until: string;
  eur_due_at: string | null;
  proof_due_at: string | null;
  confirm_due_at: string | null;
  destination_account_revealed_at: string | null;
  partner_id: string | null;
  partner_confirmed_at: string | null;
  partner_note: string | null;
  created_at: string;
  updated_at: string;
  request?: RequestRecord | null;
  eur_payer?: LeadRecord | null;
  eur_receiver?: LeadRecord | null;
  irr_payer?: LeadRecord | null;
  irr_receiver?: LeadRecord | null;
  partner?: PartnerRecord | null;
  destination_account?: DestinationAccount | null;
}

interface OfficeReceipt {
  id: string;
  amount: number;
  currency: string;
  handled_by: string;
  partner_reference: string;
  receipt_no: string;
  occurred_at: string;
  note: string | null;
  created_at: string;
  staff_admin?: { id: string; full_name: string | null } | null;
  partner?: { id: string; name: string } | null;
}

interface OfficePayout {
  id: string;
  amount: number;
  currency: string;
  handled_by: string;
  partner_reference: string;
  paid_to_lead_id: string;
  receipt_no: string;
  occurred_at: string;
  note: string | null;
  created_at: string;
  paid_to?: LeadRecord | null;
  staff_admin?: { id: string; full_name: string | null } | null;
  partner?: { id: string; name: string } | null;
}

interface TransferProof {
  id: string;
  side: string;
  proof_type: string;
  instrument: string;
  bank_reference: string | null;
  statement_period_from: string | null;
  statement_period_to: string | null;
  submitted_at: string;
  verified_at: string | null;
  verification_channel: string | null;
  verification_result: string | null;
  verification_note: string | null;
  created_at: string;
  uploader?: { id: string; full_name: string | null } | null;
  account?: { id: string; kind: string; value: string; holder_name: string } | null;
  document?: { id: string; file_name: string; mime_type: string; size_bytes: number; storage_path: string } | null;
  verified_by?: { id: string; full_name: string | null } | null;
}

interface AuthorizedRecipientItem {
  id: string;
  lead_id: string;
  recipient_lead_id: string;
  relationship: string;
  status: string;
  verified_at: string | null;
  recipient?: LeadRecord | null;
}

interface ExchangeEvent {
  id: string;
  actor: string;
  actor_user_id: string | null;
  from_status: string | null;
  to_status: string | null;
  payload: any;
  created_at: string;
}

export default function AdminMatchDossierPage({ params }: MatchDossierPageProps) {
  const currentLang = params.lang || 'fa';
  const isFa = currentLang === 'fa';
  const router = useRouter();
  const matchId = params.id;

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Current admin session profile & permissions
  const [adminUser, setAdminUser] = useState<any>(null);
  const canManageExchange = (adminUser?.permissions || []).includes('exchange.manage');

  // Dossier data
  const [match, setMatch] = useState<MatchRecord | null>(null);
  const [receipts, setReceipts] = useState<OfficeReceipt[]>([]);
  const [payouts, setPayouts] = useState<OfficePayout[]>([]);
  const [transferProofs, setTransferProofs] = useState<TransferProof[]>([]);
  const [events, setEvents] = useState<ExchangeEvent[]>([]);
  const [authorizedRecipients, setAuthorizedRecipients] = useState<AuthorizedRecipientItem[]>([]);

  // Action Form 1 State: Office EUR Receipt (When status === 'ACCEPTED')
  const [receiptCurrency, setReceiptCurrency] = useState<'EUR' | 'RON'>('EUR');
  const [receiptRonAmount, setReceiptRonAmount] = useState<string>('');
  const [receiptHandledBy, setReceiptHandledBy] = useState<'partner_exchange' | 'dorvia_office'>('partner_exchange');
  const [receiptPartnerRef, setReceiptPartnerRef] = useState<string>('');
  const [receiptNo, setReceiptNo] = useState<string>('');
  const [receiptOccurredAt, setReceiptOccurredAt] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [receiptNote, setReceiptNote] = useState<string>('');
  const [receiptSubmitting, setReceiptSubmitting] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [showReceiptConfirmModal, setShowReceiptConfirmModal] = useState(false);

  // Action Form 2 State: Office EUR Payout (When status === 'IRR_CONFIRMED')
  const [payoutCurrency, setPayoutCurrency] = useState<'EUR' | 'RON'>('EUR');
  const [payoutRonAmount, setPayoutRonAmount] = useState<string>('');
  const [payoutHandledBy, setPayoutHandledBy] = useState<'partner_exchange' | 'dorvia_office'>('partner_exchange');
  const [payoutRecipientLeadId, setPayoutRecipientLeadId] = useState<string>('');
  const [payoutPartnerRef, setPayoutPartnerRef] = useState<string>('');
  const [payoutReceiptNo, setPayoutReceiptNo] = useState<string>('');
  const [payoutOccurredAt, setPayoutOccurredAt] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [payoutNote, setPayoutNote] = useState<string>('');
  const [payoutSubmitting, setPayoutSubmitting] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [showPayoutConfirmModal, setShowPayoutConfirmModal] = useState(false);

  // Inline Transfer Proof Verification Form State
  const [activeProofId, setActiveProofId] = useState<string | null>(null);
  const [proofResult, setProofResult] = useState<'confirmed' | 'inconclusive' | 'rejected'>('confirmed');
  const [proofChannel, setProofChannel] = useState<string>('bank_statement');
  const [proofNote, setProofNote] = useState<string>('');
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [proofError, setProofError] = useState<string | null>(null);
  const [proofSuccess, setProofSuccess] = useState<string | null>(null);

  // Fetch match case dossier from /api/admin/exchange/matches/[id]
  const loadDossier = useCallback(async () => {
    if (!matchId) return;
    setLoading(true);
    setErrorStatus(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/exchange/matches/${matchId}`);

      if (res.status === 401) {
        router.replace(`/${currentLang}/admin/login?error=unauthorized`);
        return;
      }

      if (res.status === 403) {
        setErrorStatus(403);
        setErrorMessage(
          isFa
            ? 'شما مجوز دسترسی به این معامله ارزی را ندارید (خطای ۴۰۳).'
            : 'Forbidden. You do not have permission to view this exchange dossier (403).'
        );
        setLoading(false);
        return;
      }

      if (res.status === 404) {
        setErrorStatus(404);
        setErrorMessage(
          isFa
            ? 'پرونده معامله ارزی مورد نظر یافت نشد.'
            : 'Exchange match dossier not found.'
        );
        setLoading(false);
        return;
      }

      const json = await res.json();
      if (!res.ok) {
        setErrorStatus(res.status);
        setErrorMessage(json.error || (isFa ? 'خطا در بارگذاری پرونده.' : 'Failed to load case dossier.'));
        setLoading(false);
        return;
      }

      setMatch(json.match || null);
      setReceipts(json.receipts || []);
      setPayouts(json.payouts || []);
      setTransferProofs(json.transferProofs || []);
      setEvents(json.events || []);
      setAuthorizedRecipients(json.authorizedRecipients || []);
      if (json.admin) {
        setAdminUser(json.admin);
      }

      // Pre-select primary EUR receiver for payout form if not selected
      if (json.match?.eur_receiver_lead_id) {
        setPayoutRecipientLeadId(json.match.eur_receiver_lead_id);
      }
    } catch (err: any) {
      console.error('Network error loading dossier:', err);
      setErrorStatus(500);
      setErrorMessage(
        isFa
          ? 'خطا در برقراری ارتباط با سرور. لطفا مجددا تلاش کنید.'
          : 'Network error loading match dossier. Please retry.'
      );
    } finally {
      setLoading(false);
    }
  }, [matchId, currentLang, router, isFa]);

  useEffect(() => {
    loadDossier();
  }, [loadDossier]);

  // Status Badge and Step Tracker helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return {
          label: isFa ? 'پذیرفته‌شده (منتظر دریافت یورو)' : 'Accepted (Awaiting EUR)',
          badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-300 font-bold',
        };
      case 'EUR_RECEIVED':
        return {
          label: isFa ? 'یورو دریافت شد (منتظر انتقال ریال)' : 'EUR Received (Awaiting IRR)',
          badgeClass: 'bg-blue-500/10 text-blue-700 border-blue-300 font-bold',
        };
      case 'IRR_PROOF_SUBMITTED':
        return {
          label: isFa ? 'فیش ریال ارسال شد' : 'IRR Proof Submitted',
          badgeClass: 'bg-purple-500/10 text-purple-700 border-purple-300 font-bold',
        };
      case 'IRR_CONFIRMED':
        return {
          label: isFa ? 'ریال تایید شد (منتظر پرداخت یورو)' : 'IRR Confirmed (Awaiting Payout)',
          badgeClass: 'bg-emerald-500/15 text-emerald-700 border-emerald-400 font-bold animate-pulse',
        };
      case 'SETTLED':
        return {
          label: isFa ? 'تسویه‌شده و پایان‌یافته' : 'Settled & Completed',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        };
      case 'CANCELLED':
        return {
          label: isFa ? 'لغو شده' : 'Cancelled',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'EXPIRED':
        return {
          label: isFa ? 'منقضی شده' : 'Expired',
          badgeClass: 'bg-slate-100 text-slate-500 border-slate-200',
        };
      case 'DISPUTED':
        return {
          label: isFa ? 'دارای اختلاف' : 'Disputed',
          badgeClass: 'bg-red-500/15 text-red-700 border-red-300 font-bold',
        };
      case 'REFUNDED':
        return {
          label: isFa ? 'مسترد شده' : 'Refunded',
          badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
        };
      default:
        return {
          label: status,
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        };
    }
  };

  const stepsOrder = ['ACCEPTED', 'EUR_RECEIVED', 'IRR_PROOF_SUBMITTED', 'IRR_CONFIRMED', 'SETTLED'];
  const currentStepIndex = match ? stepsOrder.indexOf(match.status) : -1;

  // 3. Action Form 1 Handler: Submit Receipt
  const handleReceiptSubmit = async () => {
    if (!match) return;
    setReceiptSubmitting(true);
    setReceiptError(null);

    const expectedEurAmount = match.amount_eur + match.fee_eur;
    let finalAmount = expectedEurAmount;

    if (receiptCurrency === 'RON') {
      const parsedRon = parseFloat(receiptRonAmount);
      if (isNaN(parsedRon) || parsedRon <= 0) {
        setReceiptError(isFa ? 'لطفا مبلغ معتبر رون را وارد کنید.' : 'Please enter a valid RON amount.');
        setReceiptSubmitting(false);
        return;
      }
      if (!receiptNote.trim()) {
        setReceiptError(
          isFa
            ? 'ثبت یادداشت و نرخ تبدیل برای ارز RON طبق قوانین الزامی است.'
            : 'Note with exchange rate details is required when receiving RON.'
        );
        setReceiptSubmitting(false);
        return;
      }
      finalAmount = parsedRon;
    }

    if (!receiptPartnerRef.trim()) {
      setReceiptError(isFa ? 'شماره ارجاع صرافی همکار الزامی است.' : 'Partner reference is required.');
      setReceiptSubmitting(false);
      return;
    }

    if (!receiptNo.trim()) {
      setReceiptError(isFa ? 'شماره رسید داخلی الزامی است.' : 'Receipt number is required.');
      setReceiptSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/exchange/matches/${match.id}/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          currency: receiptCurrency,
          handled_by: receiptHandledBy,
          partner_id: match.partner_id || null,
          partner_reference: receiptPartnerRef.trim(),
          receipt_no: receiptNo.trim(),
          occurred_at: receiptOccurredAt ? new Date(receiptOccurredAt).toISOString() : new Date().toISOString(),
          note: receiptNote.trim() || null,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        // Strict Rule: Display exact server error message verbatim
        setReceiptError(json?.error || (isFa ? 'خطای سرور در ثبت رسید.' : 'Failed to record receipt.'));
        setReceiptSubmitting(false);
        return;
      }

      // Success: Close modal, reset form and re-fetch dossier from server
      setShowReceiptConfirmModal(false);
      setReceiptPartnerRef('');
      setReceiptNo('');
      setReceiptNote('');
      await loadDossier();
    } catch (err: any) {
      setReceiptError(err?.message || (isFa ? 'خطای شبکه.' : 'Network exception.'));
    } finally {
      setReceiptSubmitting(false);
    }
  };

  // 4. Action Form 2 Handler: Submit Payout
  const handlePayoutSubmit = async () => {
    if (!match) return;
    setPayoutSubmitting(true);
    setPayoutError(null);

    const expectedEurAmount = match.amount_eur;
    let finalAmount = expectedEurAmount;

    if (payoutCurrency === 'RON') {
      const parsedRon = parseFloat(payoutRonAmount);
      if (isNaN(parsedRon) || parsedRon <= 0) {
        setPayoutError(isFa ? 'لطفا مبلغ معتبر رون را وارد کنید.' : 'Please enter a valid RON amount.');
        setPayoutSubmitting(false);
        return;
      }
      if (!payoutNote.trim()) {
        setPayoutError(
          isFa
            ? 'ثبت یادداشت و جزئیات نرخ تبدیل برای ارز RON الزامی است.'
            : 'Note with exchange rate conversion details is required when paying out RON.'
        );
        setPayoutSubmitting(false);
        return;
      }
      finalAmount = parsedRon;
    }

    if (!payoutRecipientLeadId) {
      setPayoutError(isFa ? 'انتخاب گیرنده پرداخت الزامی است.' : 'Recipient must be selected.');
      setPayoutSubmitting(false);
      return;
    }

    if (!payoutPartnerRef.trim()) {
      setPayoutError(isFa ? 'شماره ارجاع صرافی همکار الزامی است.' : 'Partner reference is required.');
      setPayoutSubmitting(false);
      return;
    }

    if (!payoutReceiptNo.trim()) {
      setPayoutError(isFa ? 'شماره سند پرداخت / رسید الزامی است.' : 'Receipt / voucher number is required.');
      setPayoutSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/exchange/matches/${match.id}/payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          currency: payoutCurrency,
          handled_by: payoutHandledBy,
          partner_id: match.partner_id || null,
          partner_reference: payoutPartnerRef.trim(),
          paid_to_lead_id: payoutRecipientLeadId,
          receipt_no: payoutReceiptNo.trim(),
          occurred_at: payoutOccurredAt ? new Date(payoutOccurredAt).toISOString() : new Date().toISOString(),
          note: payoutNote.trim() || null,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        // Strict Rule: Display exact server error verbatim
        setPayoutError(json?.error || (isFa ? 'خطای سرور در ثبت پرداخت.' : 'Failed to record payout.'));
        setPayoutSubmitting(false);
        return;
      }

      // Success: Close modal, reset form and re-fetch dossier from server
      setShowPayoutConfirmModal(false);
      setPayoutPartnerRef('');
      setPayoutReceiptNo('');
      setPayoutNote('');
      await loadDossier();
    } catch (err: any) {
      setPayoutError(err?.message || (isFa ? 'خطای شبکه.' : 'Network exception.'));
    } finally {
      setPayoutSubmitting(false);
    }
  };

  // 5. Transfer Proof Verification Handler
  const handleVerifyProof = async (proofId: string) => {
    if (!match) return;
    setProofSubmitting(true);
    setProofError(null);
    setProofSuccess(null);

    if (proofChannel && proofChannel.length > 32) {
      setProofError(
        isFa
          ? 'نام کانال استعلام نباید بیشتر از ۳۲ کاراکتر باشد.'
          : 'Verification channel must not exceed 32 characters.'
      );
      setProofSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/exchange/matches/${match.id}/verify-proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proof_id: proofId,
          verification_result: proofResult,
          verification_channel: proofChannel.trim() || null,
          verification_note: proofNote.trim() || null,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setProofError(json?.error || (isFa ? 'خطا در ثبت استعلام رسید.' : 'Failed to verify transfer proof.'));
        setProofSubmitting(false);
        return;
      }

      setProofSuccess(isFa ? 'نتیجه استعلام با موفقیت ثبت شد.' : 'Verification recorded successfully.');
      setActiveProofId(null);
      setProofNote('');
      await loadDossier();
    } catch (err: any) {
      setProofError(err?.message || (isFa ? 'خطای شبکه.' : 'Network exception.'));
    } finally {
      setProofSubmitting(false);
    }
  };

  // Build eligible recipient options for payout select
  const recipientOptions = useMemo(() => {
    if (!match) return [];
    const options: Array<{ id: string; label: string }> = [];

    if (match.eur_receiver) {
      options.push({
        id: match.eur_receiver.id,
        label: `${match.eur_receiver.full_name || (isFa ? 'گیرنده اصلی یورو' : 'Primary EUR Receiver')} (${isFa ? 'متقاضی اصلی' : 'Primary Lead'})`,
      });
    }

    authorizedRecipients.forEach((ar) => {
      const repLead = ar.recipient;
      if (repLead) {
        options.push({
          id: repLead.id,
          label: `${repLead.full_name || (isFa ? 'نماینده' : 'Representative')} (${isFa ? 'نماینده مجاز تاییدشده' : 'Approved Authorized Recipient'} - ${ar.relationship})`,
        });
      }
    });

    return options;
  }, [match, authorizedRecipients, isFa]);

  const selectedRecipientName = useMemo(() => {
    const found = recipientOptions.find((o) => o.id === payoutRecipientLeadId);
    return found ? found.label : payoutRecipientLeadId;
  }, [recipientOptions, payoutRecipientLeadId]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#f7f9fc]">
        <div className="w-10 h-10 border-4 border-[#2F6FED] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs sm:text-sm text-[#526174] font-medium">
          {isFa ? 'در حال دریافت پرونده معامله ارزی...' : 'Loading exchange match dossier...'}
        </p>
      </div>
    );
  }

  if (errorStatus === 403) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] py-12 px-4" dir={isFa ? 'rtl' : 'ltr'}>
        <div className="max-w-xl mx-auto bg-white border border-rose-200 rounded-3xl p-10 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {isFa ? 'عدم دسترسی مجاز' : 'Access Denied'}
          </h2>
          <p className="text-sm text-slate-600">
            {errorMessage || (isFa ? 'شما مجوز دسترسی به این پرونده تبادل ارز را ندارید.' : 'You do not have permission to view this exchange match.')}
          </p>
          <div className="pt-2">
            <Link
              href="/admin/exchange"
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-2.5 rounded-xl bg-[#2F6FED] text-white text-xs font-bold hover:bg-[#2558c4] transition-all"
            >
              <span>{isFa ? 'بازگشت به فهرست معاملات' : 'Back to Exchange List'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] py-12 px-4" dir={isFa ? 'rtl' : 'ltr'}>
        <div className="max-w-xl mx-auto bg-white border border-[#dfe6ef] rounded-3xl p-10 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Landmark size={32} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {isFa ? 'پرونده معامله یافت نشد' : 'Match Dossier Not Found'}
          </h2>
          <p className="text-sm text-slate-500">
            {errorMessage || (isFa ? 'معامله مورد نظر در سامانه موجود نیست یا حذف شده است.' : 'The requested exchange dossier does not exist.')}
          </p>
          <div className="pt-2">
            <Link
              href="/admin/exchange"
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-2.5 rounded-xl bg-[#2F6FED] text-white text-xs font-bold hover:bg-[#2558c4] transition-all"
            >
              <span>{isFa ? 'بازگشت به فهرست معاملات' : 'Back to Exchange List'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(match.status);

  return (
    <div className="min-h-screen bg-[#f7f9fc] py-8 sm:py-10" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">

        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Link
              href="/admin/exchange"
              className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all shadow-xs"
              title={isFa ? 'بازگشت به فهرست معاملات' : 'Back to Exchange List'}
            >
              {isFa ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </Link>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isFa ? 'پرونده معامله ارز' : 'Exchange Match Dossier'}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  {match.id.slice(0, 8)}...
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                {isFa ? 'جزئیات مالی و تسویه معامله' : 'Financial Dossier & Settlement'}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className={`px-3 py-1.5 rounded-full text-xs border ${statusBadge.badgeClass}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>

        {/* 2-A: Financial Summary & Parties (Human Readable Money Flow) */}
        <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Numbers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {isFa ? 'مبلغ یورو' : 'EUR Amount'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {match.amount_eur.toLocaleString('en-US')}{' '}
                <span className="text-xs font-bold text-slate-500">EUR</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {isFa ? 'کارمزد DORVIA' : 'Platform Fee'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-700 mt-0.5">
                {match.fee_eur.toLocaleString('en-US')}{' '}
                <span className="text-xs font-bold text-amber-600">EUR</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {isFa ? 'نرخ تبدیل توافقی' : 'Agreed Rate'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">
                {match.rate_snapshot ? match.rate_snapshot.toLocaleString('en-US') : '—'}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {isFa ? 'مبلغ ریال' : 'IRR Amount'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {match.amount_irr ? match.amount_irr.toLocaleString('en-US') : '—'}{' '}
                <span className="text-xs font-bold text-slate-500">IRR</span>
              </div>
            </div>
          </div>

          {/* Money Flow: TWO Plain Human-Readable Sentences */}
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-300 p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
              {isFa ? 'گردش جریان وجوه بین طرفین معامله' : 'Direct Funds Flow Summary'}
            </h3>
            <div className="space-y-2 text-sm sm:text-base font-bold text-slate-800">
              <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/80 p-3 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-black">
                  {isFa ? 'یورو' : 'EUR'}
                </span>
                <span>
                  {isFa ? 'از ' : 'From '}
                  <span className="text-emerald-900 underline underline-offset-4">
                    {match.eur_payer?.full_name || (isFa ? 'ناشناس' : 'Unknown')}
                  </span>
                  {' → '}
                  {isFa ? 'به ' : 'To '}
                  <span className="text-emerald-900 underline underline-offset-4">
                    {match.eur_receiver?.full_name || (isFa ? 'ناشناس' : 'Unknown')}
                  </span>
                </span>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/80 p-3 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-xs font-black">
                  {isFa ? 'ریال' : 'IRR'}
                </span>
                <span>
                  {isFa ? 'از ' : 'From '}
                  <span className="text-blue-900 underline underline-offset-4">
                    {match.irr_payer?.full_name || (isFa ? 'ناشناس' : 'Unknown')}
                  </span>
                  {' → '}
                  {isFa ? 'به ' : 'To '}
                  <span className="text-blue-900 underline underline-offset-4">
                    {match.irr_receiver?.full_name || (isFa ? 'ناشناس' : 'Unknown')}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* State Timeline Tracker */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              {isFa ? 'مراحل گردش کار معامله' : 'Workflow Progression'}
            </span>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {[
                { key: 'ACCEPTED', label: isFa ? '۱. پذیرش معامله' : '1. Accepted' },
                { key: 'EUR_RECEIVED', label: isFa ? '۲. دریافت یورو' : '2. EUR Received' },
                { key: 'IRR_PROOF_SUBMITTED', label: isFa ? '۳. ارسال فیش ریال' : '3. IRR Proof' },
                { key: 'IRR_CONFIRMED', label: isFa ? '۴. تایید واریز ریال' : '4. IRR Confirmed' },
                { key: 'SETTLED', label: isFa ? '۵. پرداخت یورو و تسویه' : '5. Settled' },
              ].map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = match.status === step.key;
                return (
                  <div
                    key={step.key}
                    className={`p-2.5 rounded-xl border font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#071B3D] text-white border-[#071B3D] shadow-sm'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2-C: Action Form 1 — Record Office EUR Receipt (Only if status === 'ACCEPTED' AND user canManageExchange) */}
        {canManageExchange && match.status === 'ACCEPTED' && (
          <div className="bg-amber-500/10 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0">
                <Receipt size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black text-amber-950">
                  {isFa ? 'فرم اقدام: ثبت دریافت یورو از متقاضی' : 'Action Form: Record Counter EUR Receipt'}
                </h2>
                <p className="text-xs text-amber-800 mt-1">
                  {isFa
                    ? 'مشتری یورو را در پیشخوان دفتر یا صرافی همکار تحویل داده است. با ثبت این فرم، وضعیت به EUR_RECEIVED تغییر می‌یابد و حساب بانکی ریالی برای واریز آشکار می‌شود.'
                    : 'Customer deposited cash EUR. Recording receipt advances status to EUR_RECEIVED and unlocks the Iranian destination bank account.'}
                </p>
              </div>
            </div>

            {receiptError && (
              <div className="bg-rose-100 border border-rose-300 text-rose-800 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2 rtl:space-x-reverse">
                <AlertCircle size={16} className="shrink-0" />
                <span>{receiptError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'ارز دریافتی' : 'Currency'}
                </label>
                <select
                  value={receiptCurrency}
                  onChange={(e) => setReceiptCurrency(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                >
                  <option value="EUR">EUR (یورو)</option>
                  <option value="RON">RON (لئو رومانی - نیاز به یادداشت نرخ)</option>
                </select>
              </div>

              {/* Amount field: Read-Only for EUR (amount_eur + fee_eur), Editable for RON */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'مبلغ نهایی دریافتی' : 'Receipt Amount'}
                  {receiptCurrency === 'EUR' && (
                    <span className="text-[10px] text-slate-400 ms-1 font-normal">
                      ({isFa ? 'مبلغ معامله + کارمزد' : 'Trade amount + fee'})
                    </span>
                  )}
                </label>
                {receiptCurrency === 'EUR' ? (
                  <input
                    type="text"
                    readOnly
                    value={`${(match.amount_eur + match.fee_eur).toLocaleString('en-US')} EUR`}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-black text-slate-700 cursor-not-allowed"
                  />
                ) : (
                  <input
                    type="number"
                    step="0.01"
                    value={receiptRonAmount}
                    onChange={(e) => setReceiptRonAmount(e.target.value)}
                    placeholder={isFa ? 'مبلغ رون دریافتی...' : 'Received RON amount...'}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
                  />
                )}
              </div>

              {/* Handled By */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'محل و نحوه دریافت' : 'Handled By'}
                </label>
                <select
                  value={receiptHandledBy}
                  onChange={(e) => setReceiptHandledBy(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-amber-500"
                >
                  <option value="partner_exchange">
                    {isFa ? 'صرافی همکار (Partner Exchange)' : 'Partner Exchange'}
                  </option>
                  <option value="dorvia_office">
                    {isFa ? 'پیشخوان دفتر دورویا (DORVIA Office)' : 'DORVIA Office'}
                  </option>
                </select>
              </div>

              {/* Partner Reference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'شماره ارجاع صرافی / فیش همکار' : 'Partner Reference'}
                </label>
                <input
                  type="text"
                  value={receiptPartnerRef}
                  onChange={(e) => setReceiptPartnerRef(e.target.value)}
                  placeholder={isFa ? 'مثلا: REF-ROM-2026-99' : 'e.g. REF-ROM-2026-99'}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Internal Receipt No */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'شماره رسید داخلی' : 'Internal Receipt No'}
                </label>
                <input
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  placeholder={isFa ? 'مثلا: REC-10492' : 'e.g. REC-10492'}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Occurred At */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'زمان تحویل فیزیکی' : 'Occurred At'}
                </label>
                <input
                  type="datetime-local"
                  value={receiptOccurredAt}
                  onChange={(e) => setReceiptOccurredAt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Note (Mandatory if RON) */}
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'یادداشت اداری / جزئیات تبدیل نرخ' : 'Administrative Note'}
                  {receiptCurrency === 'RON' && (
                    <span className="text-rose-600 ms-1 font-bold">
                      ({isFa ? 'الزامی برای ارز RON' : 'Mandatory for RON'})
                    </span>
                  )}
                </label>
                <textarea
                  rows={2}
                  value={receiptNote}
                  onChange={(e) => setReceiptNote(e.target.value)}
                  placeholder={
                    receiptCurrency === 'RON'
                      ? (isFa ? 'ذکر نرخ برابری تبدیل RON به EUR الزامی است...' : 'Mandatory: specify RON to EUR rate details...')
                      : (isFa ? 'توضیحات اختیاری کارمند...' : 'Optional staff notes...')
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setReceiptError(null);
                  setShowReceiptConfirmModal(true);
                }}
                disabled={receiptSubmitting}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Check size={16} />
                <span>{isFa ? 'ثبت و تایید نهایی دریافت یورو' : 'Confirm & Record EUR Receipt'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2-C: Action Form 2 — Record Office EUR Payout (Only if status === 'IRR_CONFIRMED' AND user canManageExchange) */}
        {canManageExchange && match.status === 'IRR_CONFIRMED' && (
          <div className="bg-emerald-500/15 border-2 border-emerald-400 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shrink-0">
                <CreditCard size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black text-emerald-950">
                  {isFa ? 'فرم اقدام: آزادسازی و پرداخت یورو به متقاضی' : 'Action Form: Release Counter EUR Payout'}
                </h2>
                <p className="text-xs text-emerald-800 mt-1">
                  {isFa
                    ? 'واریز ریالی در بانک ایران محرز و تایید شده است. با ثبت این فرم، یورو به گیرنده یا نماینده مجاز او پرداخت و پرونده به وضعیت SETTLED منتقل می‌شود.'
                    : 'IRR payment confirmed. Recording payout releases EUR cash to the receiver (or approved authorized representative) and settles the match.'}
                </p>
              </div>
            </div>

            {payoutError && (
              <div className="bg-rose-100 border border-rose-300 text-rose-800 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2 rtl:space-x-reverse">
                <AlertCircle size={16} className="shrink-0" />
                <span>{payoutError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'ارز پرداختی' : 'Currency'}
                </label>
                <select
                  value={payoutCurrency}
                  onChange={(e) => setPayoutCurrency(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="EUR">EUR (یورو)</option>
                  <option value="RON">RON (لئو رومانی - نیاز به یادداشت نرخ)</option>
                </select>
              </div>

              {/* Amount: Read-Only for EUR (amount_eur), Editable for RON */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'مبلغ پرداختی' : 'Payout Amount'}
                  {payoutCurrency === 'EUR' && (
                    <span className="text-[10px] text-slate-400 ms-1 font-normal">
                      ({isFa ? 'مبلغ خالص بدون کارمزد' : 'Net amount; fee retained'})
                    </span>
                  )}
                </label>
                {payoutCurrency === 'EUR' ? (
                  <input
                    type="text"
                    readOnly
                    value={`${match.amount_eur.toLocaleString('en-US')} EUR`}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-black text-slate-700 cursor-not-allowed"
                  />
                ) : (
                  <input
                    type="number"
                    step="0.01"
                    value={payoutRonAmount}
                    onChange={(e) => setPayoutRonAmount(e.target.value)}
                    placeholder={isFa ? 'مبلغ رون پرداختی...' : 'Paid RON amount...'}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                  />
                )}
              </div>

              {/* Payout Recipient SELECT (NEVER FREE TEXT) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'گیرنده نهایی وجه' : 'Paid To Recipient'}
                  <span className="text-emerald-700 ms-1 font-bold">*</span>
                </label>
                <select
                  value={payoutRecipientLeadId}
                  onChange={(e) => setPayoutRecipientLeadId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                >
                  {recipientOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Handled By */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'محل پرداخت' : 'Handled By'}
                </label>
                <select
                  value={payoutHandledBy}
                  onChange={(e) => setPayoutHandledBy(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="partner_exchange">
                    {isFa ? 'صرافی همکار (Partner Exchange)' : 'Partner Exchange'}
                  </option>
                  <option value="dorvia_office">
                    {isFa ? 'پیشخوان دفتر دورویا (DORVIA Office)' : 'DORVIA Office'}
                  </option>
                </select>
              </div>

              {/* Partner Reference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'شماره ارجاع صرافی همکار' : 'Partner Reference'}
                </label>
                <input
                  type="text"
                  value={payoutPartnerRef}
                  onChange={(e) => setPayoutPartnerRef(e.target.value)}
                  placeholder={isFa ? 'مثلا: PAY-REF-992' : 'e.g. PAY-REF-992'}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Internal Receipt No */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'شماره سند پرداخت داخلی' : 'Internal Voucher No'}
                </label>
                <input
                  type="text"
                  value={payoutReceiptNo}
                  onChange={(e) => setPayoutReceiptNo(e.target.value)}
                  placeholder={isFa ? 'مثلا: VOUCH-8821' : 'e.g. VOUCH-8821'}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Occurred At */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'زمان پرداخت فیزیکی' : 'Occurred At'}
                </label>
                <input
                  type="datetime-local"
                  value={payoutOccurredAt}
                  onChange={(e) => setPayoutOccurredAt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Note (Mandatory if RON) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFa ? 'یادداشت اداری / جزئیات تسویه' : 'Administrative Note'}
                  {payoutCurrency === 'RON' && (
                    <span className="text-rose-600 ms-1 font-bold">
                      ({isFa ? 'الزامی برای ارز RON' : 'Mandatory for RON'})
                    </span>
                  )}
                </label>
                <textarea
                  rows={2}
                  value={payoutNote}
                  onChange={(e) => setPayoutNote(e.target.value)}
                  placeholder={
                    payoutCurrency === 'RON'
                      ? (isFa ? 'ذکر جزئیات نرخ تبدیل RON الزامی است...' : 'Mandatory: specify RON to EUR conversion rate...')
                      : (isFa ? 'توضیحات اختیاری کارمند...' : 'Optional staff notes...')
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setPayoutError(null);
                  setShowPayoutConfirmModal(true);
                }}
                disabled={payoutSubmitting}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Check size={16} />
                <span>{isFa ? 'ثبت و آزادسازی نهایی پرداخت یورو' : 'Confirm & Release EUR Payout'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2-B: Information Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Destination Account */}
          <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-slate-800 font-extrabold text-sm">
                <Landmark size={18} className="text-[#2F6FED]" />
                <span>{isFa ? 'حساب مقصد ریالی (بانک ایران)' : 'Iranian Destination Account'}</span>
              </div>
              {match.destination_account_revealed_at ? (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {isFa ? 'آشکار شده برای واریز' : 'Revealed for Deposit'}
                </span>
              ) : (
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                  {isFa ? 'محافظت‌شده / پنهان' : 'Protected / Hidden'}
                </span>
              )}
            </div>

            {match.destination_account ? (
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{isFa ? 'نام دارنده حساب:' : 'Holder Name:'}</span>
                  <span className="font-extrabold text-slate-900">{match.destination_account.holder_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{isFa ? 'نوع حساب:' : 'Account Kind:'}</span>
                  <span className="font-mono font-bold text-slate-800 uppercase">{match.destination_account.kind}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">{isFa ? 'شماره حساب / شبا / کارت:' : 'Account Value:'}</span>
                  {/* Strict rule: displayed as received from backend (masked if viewer is not exchange.manage) */}
                  <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {match.destination_account.value}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                {isFa ? 'هنوز حساب مقصدی مشخص نشده است.' : 'No destination account configured.'}
              </p>
            )}
          </div>

          {/* Section 2: Authorized Cash Recipients */}
          <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-slate-800 font-extrabold text-sm">
                <User size={18} className="text-[#2F6FED]" />
                <span>{isFa ? 'نمایندگان مجاز تحویل وجه نقد' : 'Authorized Cash Recipients'}</span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {authorizedRecipients.length} {isFa ? 'نماینده تاییدشده' : 'Approved'}
              </span>
            </div>

            {authorizedRecipients.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {isFa
                  ? 'هیچ نماینده مجازی برای گیرنده یورو ثبت نشده است (فقط خود متقاضی مجاز است).'
                  : 'No authorized recipients registered. Only primary lead can receive payout.'}
              </p>
            ) : (
              <div className="space-y-2">
                {authorizedRecipients.map((ar) => (
                  <div
                    key={ar.id}
                    className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-extrabold text-slate-800">
                        {ar.recipient?.full_name || (isFa ? 'ناشناس' : 'Unknown')}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isFa ? 'نسبت:' : 'Relation:'} <span className="font-semibold">{ar.relationship}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      {isFa ? 'تاییدشده' : 'Approved'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Office Receipts & Payouts History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Office Receipts History */}
          <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-slate-800 font-extrabold text-sm">
                <Receipt size={18} className="text-amber-600" />
                <span>{isFa ? 'رسیدهای دریافت فیزیکی پیشخوان' : 'Counter Cash Receipts'}</span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {receipts.length} {isFa ? 'رسید' : 'Records'}
              </span>
            </div>

            {receipts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {isFa ? 'هنوز رسیدی ثبت نشده است.' : 'No counter receipts recorded.'}
              </p>
            ) : (
              <div className="space-y-2.5">
                {receipts.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-black text-slate-900 text-sm">
                        {r.amount.toLocaleString('en-US')} {r.currency}
                      </span>
                      <span className="font-mono text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {r.receipt_no}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>{isFa ? 'ارجاع همکار:' : 'Ref:'} {r.partner_reference}</span>
                      <span>{new Date(r.occurred_at).toLocaleString(isFa ? 'fa-IR' : 'en-US')}</span>
                    </div>
                    {r.note && (
                      <div className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200 mt-1">
                        {r.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Office Payouts History */}
          <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-slate-800 font-extrabold text-sm">
                <CreditCard size={18} className="text-emerald-600" />
                <span>{isFa ? 'پرداخت‌های فیزیکی پیشخوان' : 'Counter Cash Payouts'}</span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {payouts.length} {isFa ? 'پرداخت' : 'Records'}
              </span>
            </div>

            {payouts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {isFa ? 'هنوز پرداختی ثبت نشده است.' : 'No counter payouts recorded.'}
              </p>
            ) : (
              <div className="space-y-2.5">
                {payouts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-black text-slate-900 text-sm">
                        {p.amount.toLocaleString('en-US')} {p.currency}
                      </span>
                      <span className="font-mono text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {p.receipt_no}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {isFa ? 'پرداخت‌شده به:' : 'Paid to:'}{' '}
                      <span className="font-extrabold text-slate-900">
                        {p.paid_to?.full_name || (isFa ? 'ناشناس' : 'Unknown')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>{isFa ? 'ارجاع همکار:' : 'Ref:'} {p.partner_reference}</span>
                      <span>{new Date(p.occurred_at).toLocaleString(isFa ? 'fa-IR' : 'en-US')}</span>
                    </div>
                    {p.note && (
                      <div className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200 mt-1">
                        {p.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2-E: Iranian Transfer Proofs with Staff Verification Form */}
        <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-slate-900 font-black text-base">
                <FileCheck2 size={20} className="text-[#2F6FED]" />
                <span>{isFa ? 'فیش‌ها و اسناد انتقال ریالی (بانک ایران)' : 'Iranian Transfer Statements & Proofs'}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isFa
                  ? 'بررسی اسناد بانکی ارسال‌شده توسط متقاضی یا صرافی همکار.'
                  : 'Review bank transaction statements and proofs uploaded by counterparties.'}
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {transferProofs.length} {isFa ? 'سند' : 'Items'}
            </span>
          </div>

          {proofError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2 rtl:space-x-reverse">
              <AlertCircle size={16} className="shrink-0" />
              <span>{proofError}</span>
            </div>
          )}

          {proofSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2 rtl:space-x-reverse">
              <CheckCircle size={16} className="shrink-0" />
              <span>{proofSuccess}</span>
            </div>
          )}

          {transferProofs.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              {isFa ? 'هنوز فیش انتقال ریالی بارگذاری نشده است.' : 'No transfer proofs submitted yet.'}
            </p>
          ) : (
            <div className="space-y-4">
              {transferProofs.map((proof) => (
                <div
                  key={proof.id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 text-[11px] font-bold uppercase">
                        {proof.proof_type} ({proof.instrument})
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {isFa ? 'ارسال‌شده در:' : 'Submitted:'}{' '}
                        {new Date(proof.submitted_at).toLocaleString(isFa ? 'fa-IR' : 'en-US')}
                      </span>
                    </div>

                    <div>
                      {proof.verification_result === 'confirmed' ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                          {isFa ? 'تاییدشده' : 'Confirmed'}
                        </span>
                      ) : proof.verification_result === 'rejected' ? (
                        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-bold">
                          {isFa ? 'ردشده' : 'Rejected'}
                        </span>
                      ) : proof.verification_result === 'inconclusive' ? (
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold">
                          {isFa ? 'نامشخص' : 'Inconclusive'}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold">
                          {isFa ? 'در انتظار بررسی' : 'Pending Verification'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400">{isFa ? 'شماره پیگیری بانک:' : 'Bank Ref:'} </span>
                      <span className="font-mono font-bold">{proof.bank_reference || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">{isFa ? 'بارگذاری توسط:' : 'Uploaded by:'} </span>
                      <span className="font-bold">{proof.uploader?.full_name || (isFa ? 'کاربر' : 'User')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">{isFa ? 'حساب مبدأ/مقصد:' : 'Account:'} </span>
                      <span className="font-mono font-bold">{proof.account?.value || '—'}</span>
                    </div>
                  </div>

                  {proof.verification_note && (
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-[11px]">
                      <span className="font-bold">{isFa ? 'یادداشت استعلام:' : 'Verification note:'} </span>
                      <span>{proof.verification_note}</span>
                      {proof.verified_by && (
                        <span className="text-slate-400 ms-2">
                          ({isFa ? 'بررسی‌کننده:' : 'By:'} {proof.verified_by.full_name})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Inline verification form trigger for exchange.manage */}
                  {canManageExchange && (
                    <div className="pt-2 border-t border-slate-200">
                      {activeProofId === proof.id ? (
                        <div className="p-4 rounded-2xl bg-white border border-[#2F6FED] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 text-xs">
                              {isFa ? 'ثبت استعلام و راستی‌آزمایی فیش' : 'Verify Transfer Proof'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveProofId(null)}
                              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                            >
                              ✕ {isFa ? 'انصراف' : 'Cancel'}
                            </button>
                          </div>

                          {/* Important safety warning banner */}
                          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-semibold">
                            ⚠️{' '}
                            {isFa
                              ? 'توجه: این اقدام صرفاً یک یادداشت داخلی و ثبت استعلام است و وضعیت معامله را تغییر نمی‌دهد.'
                              : 'Note: This action records internal staff verification only and does NOT alter match status.'}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                {isFa ? 'نتیجه استعلام' : 'Verification Result'}
                              </label>
                              <select
                                value={proofResult}
                                onChange={(e) => setProofResult(e.target.value as any)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800"
                              >
                                <option value="confirmed">{isFa ? 'تایید شد (Confirmed)' : 'Confirmed'}</option>
                                <option value="inconclusive">{isFa ? 'نامشخص (Inconclusive)' : 'Inconclusive'}</option>
                                <option value="rejected">{isFa ? 'رد شد (Rejected)' : 'Rejected'}</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                {isFa ? 'کانال استعلام (حداکثر ۳۲ حرف)' : 'Channel (max 32 chars)'}
                              </label>
                              <input
                                type="text"
                                maxLength={32}
                                value={proofChannel}
                                onChange={(e) => setProofChannel(e.target.value)}
                                placeholder={isFa ? 'مثلا: bank_statement' : 'e.g. bank_statement'}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                {isFa ? 'یادداشت و جزئیات بررسی' : 'Verification Note'}
                              </label>
                              <textarea
                                rows={2}
                                value={proofNote}
                                onChange={(e) => setProofNote(e.target.value)}
                                placeholder={isFa ? 'جزئیات تطبیق شماره پیگیری با صورت‌حساب بانک...' : 'Verification details...'}
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => handleVerifyProof(proof.id)}
                              disabled={proofSubmitting}
                              className="px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#2558c4] text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
                            >
                              {proofSubmitting
                                ? (isFa ? 'در حال ثبت...' : 'Saving...')
                                : (isFa ? 'ثبت نتیجه استعلام' : 'Save Verification')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveProofId(proof.id);
                            setProofResult((proof.verification_result as any) || 'confirmed');
                            setProofChannel(proof.verification_channel || 'bank_statement');
                            setProofNote(proof.verification_note || '');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        >
                          {isFa ? '🔍 بررسی و ثبت استعلام فیش' : '🔍 Verify Proof'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Append-Only Audit Trail (Events) */}
        <div className="bg-white border border-[#dfe6ef] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-slate-900 font-black text-base">
              <Clock size={18} className="text-[#2F6FED]" />
              <span>{isFa ? 'ردپای تغییرناپذیر رویدادها (Audit Trail)' : 'Immutable Audit Trail'}</span>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {events.length} {isFa ? 'رویداد' : 'Events'}
            </span>
          </div>

          {events.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              {isFa ? 'هیچ رویدادی ثبت نشده است.' : 'No audit events recorded.'}
            </p>
          ) : (
            <div className="space-y-2">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-black uppercase">
                        {evt.actor}
                      </span>
                      {evt.from_status && evt.to_status ? (
                        <span className="font-bold text-slate-800">
                          {evt.from_status} → {evt.to_status}
                        </span>
                      ) : (
                        <span className="font-bold text-slate-800">
                          {evt.payload?.event || (isFa ? 'اقدام اداری' : 'Admin action')}
                        </span>
                      )}
                    </div>
                    {evt.payload && (
                      <p className="text-[11px] text-slate-500 font-mono break-all">
                        {JSON.stringify(evt.payload)}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(evt.created_at).toLocaleString(isFa ? 'fa-IR' : 'en-US')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal 1: Confirmation Box Before Submitting Receipt (NO browser alert/confirm) */}
        {showReceiptConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isFa ? 'تایید نهایی ثبت دریافت فیزیکی یورو' : 'Confirm EUR Receipt Registration'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isFa ? 'لطفا مشخصات را قبل از تایید قطعی بررسی فرمایید.' : 'Please verify details before proceeding.'}
                  </p>
                </div>
              </div>

              {/* Exact confirmation sentence as requested in spec */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 leading-relaxed">
                {isFa ? (
                  <>
                    «
                    <span className="text-amber-800">
                      {receiptCurrency === 'EUR'
                        ? `${(match.amount_eur + match.fee_eur).toLocaleString('en-US')} یورو`
                        : `${receiptRonAmount} رون`}
                    </span>{' '}
                    دریافت‌شده از{' '}
                    <span className="text-slate-900 underline">
                      {match.eur_payer?.full_name || 'متقاضی پرداخت یورو'}
                    </span>{' '}
                    ثبت می‌شود، با شماره رسید{' '}
                    <span className="font-mono text-slate-900">{receiptNo || '—'}</span> و ارجاع صرافی{' '}
                    <span className="font-mono text-slate-900">{receiptPartnerRef || '—'}</span>.
                    <span className="block text-rose-600 mt-1">این عمل مالی قطعی و غیرقابل بازگشت است.»</span>
                  </>
                ) : (
                  <>
                    "{receiptCurrency === 'EUR' ? `${match.amount_eur + match.fee_eur} EUR` : `${receiptRonAmount} RON`} received from{' '}
                    {match.eur_payer?.full_name || 'EUR Payer'} will be recorded with receipt #{receiptNo} and partner ref #{receiptPartnerRef}. This action is permanent and irreversible."
                  </>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-2">
                <button
                  type="button"
                  disabled={receiptSubmitting}
                  onClick={() => setShowReceiptConfirmModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={receiptSubmitting}
                  onClick={handleReceiptSubmit}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold disabled:opacity-50 cursor-pointer shadow-sm transition-all flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Check size={16} />
                  <span>
                    {receiptSubmitting ? (isFa ? 'در حال ثبت...' : 'Submitting...') : (isFa ? 'بله، ثبت قطعی شود' : 'Yes, Confirm Receipt')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Confirmation Box Before Submitting Payout (NO browser alert/confirm) */}
        {showPayoutConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isFa ? 'تایید نهایی آزادسازی پرداخت یورو' : 'Confirm EUR Payout Release'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isFa ? 'این اقدام پرونده را به SETTLED منتقل می‌کند.' : 'This action transitions the dossier to SETTLED.'}
                  </p>
                </div>
              </div>

              {/* Exact confirmation sentence with explicit recipient name as requested in spec */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 leading-relaxed">
                {isFa ? (
                  <>
                    «
                    <span className="text-emerald-800">
                      {payoutCurrency === 'EUR'
                        ? `${match.amount_eur.toLocaleString('en-US')} یورو`
                        : `${payoutRonAmount} رون`}
                    </span>{' '}
                    به گیرنده انتخابی{' '}
                    <span className="text-slate-900 underline">
                      {selectedRecipientName}
                    </span>{' '}
                    پرداخت و ثبت می‌شود، با شماره سند{' '}
                    <span className="font-mono text-slate-900">{payoutReceiptNo || '—'}</span> و ارجاع صرافی{' '}
                    <span className="font-mono text-slate-900">{payoutPartnerRef || '—'}</span>.
                    <span className="block text-rose-600 mt-1">این عمل مالی قطعی و غیرقابل بازگشت است.»</span>
                  </>
                ) : (
                  <>
                    "{payoutCurrency === 'EUR' ? `${match.amount_eur} EUR` : `${payoutRonAmount} RON`} will be released and recorded to recipient{' '}
                    {selectedRecipientName} with voucher #{payoutReceiptNo} and partner ref #{payoutPartnerRef}. This action settles the match and is irreversible."
                  </>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-2">
                <button
                  type="button"
                  disabled={payoutSubmitting}
                  onClick={() => setShowPayoutConfirmModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={payoutSubmitting}
                  onClick={handlePayoutSubmit}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold disabled:opacity-50 cursor-pointer shadow-sm transition-all flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Check size={16} />
                  <span>
                    {payoutSubmitting ? (isFa ? 'در حال ثبت...' : 'Submitting...') : (isFa ? 'بله، آزادسازی و تسویه شود' : 'Yes, Release Payout')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
