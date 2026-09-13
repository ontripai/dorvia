/**
 * P2P Currency Exchange Schema Types (dre-p124)
 * Repository: github.com/ontripai/dorvia
 *
 * Models database tables, enums, status transitions, and audit payloads
 * for the peer-to-peer EUR/RON <-> IRR currency exchange module.
 */

// ============================================================================
// Enums & Domain Status Types
// ============================================================================

export type ExchangeProfileStatus =
  | 'not_requested'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type RelatedPartyType = 'person' | 'company';

export type RelatedPartyRelationship =
  | 'father'
  | 'mother'
  | 'spouse'
  | 'child'
  | 'sibling'
  | 'own_company';

export type RelatedPartyStatus = 'pending' | 'approved' | 'rejected';

export type AuthorizedRecipientStatus = 'pending' | 'approved' | 'revoked';

export type PartnerCountry = 'RO' | 'IR';

export type PartnerRole = 'settlement_only' | 'supervisor';

export type PartnerAccessLevel = 'summary' | 'full_file' | 'custom';

export type PartnerUserRole = 'admin' | 'operator' | 'auditor';

export type AccountKind = 'IR_SHEBA' | 'IR_CARD' | 'RO_IBAN';

export type ExchangeDirection = 'RO_TO_IR' | 'IR_TO_RO';

export type ExchangeEurCurrency = 'EUR' | 'RON';

export type RequestStatus =
  | 'open'
  | 'partially_matched'
  | 'fully_matched'
  | 'expired'
  | 'cancelled'
  | 'completed';

export type MatchStatus =
  | 'RESERVED'
  | 'ACCEPTED'
  | 'CANCELLED_FREE'
  | 'EUR_RECEIVED'
  | 'IRR_PROOF_SUBMITTED'
  | 'IRR_CONFIRMED'
  | 'SETTLED'
  | 'DISPUTED'
  | 'REFUNDED'
  | 'EXPIRED';

export type CustodyHandler = 'dorvia_office' | 'partner_exchange';

export type TransferProofSide = 'payer' | 'receiver';

export type TransferProofType = 'account_statement' | 'transfer_receipt' | 'other';

export type TransferInstrument = 'card_to_card' | 'paya' | 'satna' | 'other';

export type VerificationResult = 'confirmed' | 'inconclusive' | 'rejected';

export type DisputeStatus =
  | 'open'
  | 'under_review'
  | 'resolved_payout'
  | 'resolved_refund'
  | 'closed';

export type BankingCountry = 'IR' | 'RO';

export type ExchangeRole = 'eur_payer' | 'eur_receiver' | 'irr_payer' | 'irr_receiver';

// ============================================================================
// Entity Interfaces (Mirroring Database Schema)
// ============================================================================

/**
 * 1. exchange_profiles
 * Thin qualification layer over existing public.leads
 */
export interface ExchangeProfile {
  id: string;
  lead_id: string;
  exchange_status: ExchangeProfileStatus;
  approved_by: string | null;
  approved_at: string | null;
  suspended_reason: string | null;
  completed_trades: number;
  failed_trades: number;
  free_cancellations_30d: number;
  created_at: string;
  updated_at: string;
}

/**
 * 2. exchange_related_parties
 * Iranian-side first-degree relatives and customer-owned companies
 */
export interface ExchangeRelatedParty {
  id: string;
  lead_id: string;
  party_type: RelatedPartyType;
  full_name: string;
  relationship: RelatedPartyRelationship;
  national_id: string;
  id_document_id: string | null;
  country: 'IR';
  status: RelatedPartyStatus;
  verified_by_admin_id: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 3. exchange_authorized_recipients
 * Romanian-side authorized cash/IBAN recipients (must have approved exchange profile)
 */
export interface ExchangeAuthorizedRecipient {
  id: string;
  lead_id: string;
  recipient_lead_id: string;
  relationship: string;
  status: AuthorizedRecipientStatus;
  verified_by_admin_id: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 4. exchange_partners
 * Licensed partner exchange entities in Romania (RO) and trusted verification partners in Iran (IR)
 */
export interface ExchangePartner {
  id: string;
  name: string;
  country: PartnerCountry;
  license_number: string | null;
  role: PartnerRole;
  access_level: PartnerAccessLevel;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 5. exchange_partner_users
 * Authorized staff operators affiliated with an exchange partner
 */
export interface ExchangePartnerUser {
  id: string;
  partner_id: string;
  user_id: string;
  role_in_partner: PartnerUserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 6. exchange_accounts
 * Destination bank accounts (Iranian SHEBA/card or Romanian IBAN)
 */
export interface ExchangeAccount {
  id: string;
  lead_id: string;
  kind: AccountKind;
  value: string;
  holder_name: string;
  related_party_id: string | null;
  authorized_recipient_id: string | null;
  verified_at: string | null;
  verified_by_admin_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 7. exchange_requests
 * P2P exchange listings/orders
 */
export interface ExchangeRequest {
  id: string;
  requester_lead_id: string;
  direction: ExchangeDirection;
  eur_currency: ExchangeEurCurrency;
  eur_amount: number;
  rate: number;
  irr_amount: number;
  allow_partial: boolean;
  min_chunk: number | null;
  acting_party_id: string | null;
  destination_account_id: string;
  status: RequestStatus;
  expires_at: string;
  renewed_count: number;
  price_version: number;
  created_at: string;
  updated_at: string;
}

/**
 * 8. exchange_request_prices
 * Audit history of price and rate adjustments on requests
 */
export interface ExchangeRequestPrice {
  id: string;
  request_id: string;
  version: number;
  rate: number;
  irr_amount: number;
  changed_at: string;
  changed_by: string | null;
}

/**
 * 9. exchange_matches
 * Matched trades executing between requester and acceptor
 */
export interface ExchangeMatch {
  id: string;
  request_id: string;
  acceptor_lead_id: string;
  amount_eur: number;
  rate_snapshot: number;
  amount_irr: number;
  fee_eur: number;
  status: MatchStatus;
  eur_payer_lead_id: string;
  eur_receiver_lead_id: string;
  irr_payer_lead_id: string;
  irr_receiver_lead_id: string;
  destination_account_id: string;
  reserved_until: string;
  eur_due_at: string | null;
  proof_due_at: string | null;
  confirm_due_at: string | null;
  destination_account_revealed_at: string | null;
  partner_id: string | null;
  partner_confirmed_at: string | null;
  partner_confirmed_by_user_id: string | null;
  partner_note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 10. exchange_office_receipts
 * Counter entry of EUR/RON by eur_payer (partner exchange custody)
 */
export interface ExchangeOfficeReceipt {
  id: string;
  match_id: string;
  amount: number;
  currency: ExchangeEurCurrency;
  handled_by: CustodyHandler;
  partner_id: string | null;
  partner_reference: string;
  receipt_no: string;
  staff_admin_id: string | null;
  occurred_at: string;
  note: string | null;
  created_at: string;
}

/**
 * 11. exchange_office_payouts
 * Counter release of EUR/RON to eur_receiver or authorized recipient
 */
export interface ExchangeOfficePayout {
  id: string;
  match_id: string;
  amount: number;
  currency: ExchangeEurCurrency;
  handled_by: CustodyHandler;
  partner_id: string | null;
  partner_reference: string;
  paid_to_lead_id: string;
  receipt_no: string;
  staff_admin_id: string | null;
  occurred_at: string;
  note: string | null;
  created_at: string;
}

/**
 * 12. exchange_transfer_proofs
 * Iranian bank transfer statements from BOTH payer and receiver
 */
export interface ExchangeTransferProof {
  id: string;
  match_id: string;
  side: TransferProofSide;
  uploaded_by_lead_id: string;
  proof_type: TransferProofType;
  instrument: TransferInstrument;
  document_id: string;
  account_id: string;
  bank_reference: string | null;
  statement_period_from: string | null;
  statement_period_to: string | null;
  submitted_at: string;
  verified_by_admin_id: string | null;
  verified_at: string | null;
  verification_channel: string | null;
  verification_result: VerificationResult | null;
  verification_note: string | null;
  created_at: string;
}

/**
 * 13. exchange_disputes
 * Dispute proceedings and resolutions
 */
export interface ExchangeDispute {
  id: string;
  match_id: string;
  opened_by_lead_id: string;
  reason: string;
  status: DisputeStatus;
  evidence_document_ids: string[];
  resolution: string | null;
  resolved_by_admin_id: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 14. exchange_events
 * Immutable, append-only audit trail of every state transition
 */
export interface ExchangeEvent {
  id: string;
  match_id: string | null;
  request_id: string | null;
  actor: string;
  actor_user_id: string | null;
  from_status: string | null;
  to_status: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

/**
 * 15. exchange_banking_calendar
 * Weekly schedule configuration per jurisdiction (IR / RO)
 */
export interface ExchangeBankingCalendar {
  id: string;
  country: BankingCountry;
  weekly_closed: number[]; // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  updated_by_admin_id: string | null;
  updated_at: string;
  created_at: string;
}

/**
 * 16. exchange_nonbanking_days
 * Manual bank holiday calendar
 */
export interface ExchangeNonbankingDay {
  id: string;
  date: string;
  country: BankingCountry;
  reason: string;
  created_by_admin_id: string | null;
  created_at: string;
}

// ============================================================================
// RPC & State Machine Helpers
// ============================================================================

export interface ReserveRequestMatchRpcParams {
  p_request_id: string;
  p_acceptor_lead_id: string;
  p_amount_eur: number;
  p_destination_account_id: string;
  p_reserved_minutes?: number;
}
