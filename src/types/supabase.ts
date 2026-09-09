export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          source: string;
          channel_ref: string | null;
          full_name: string;
          phone: string | null;
          email: string | null;
          site_goal: string | null;
          unified_category: string | null;
          message: string | null;
          status: 'new' | 'contacted' | 'qualified' | 'closed' | 'archived';
          consent_terms: boolean;
          marketing_consent: boolean;
          raw_meta: Json | null;
          user_id: string | null;
          verified_at: string | null;
          verified_by: string | null;
          invited_at: string | null;
          family_group_id: string | null;
          relation_to_primary: 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'other' | null;
          is_family_primary: boolean;
          date_of_birth: string | null;
          anniversary_date: string | null;
          referred_by_partner_id: string | null;
          last_birthday_greeted_year: number | null;
          last_anniversary_greeted_year: number | null;
          national_id_or_passport: string | null;
          address_line: string | null;
          address_city: string | null;
          address_postal_code: string | null;
          iran_address: string | null;
          other_residency_address: string | null;
          romania_address: string | null;
          employment_status: string | null;
          education_level: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source?: string;
          channel_ref?: string | null;
          full_name: string;
          phone?: string | null;
          email?: string | null;
          site_goal?: string | null;
          unified_category?: string | null;
          message?: string | null;
          status?: 'new' | 'contacted' | 'qualified' | 'closed' | 'archived';
          consent_terms?: boolean;
          marketing_consent?: boolean;
          raw_meta?: Json | null;
          user_id?: string | null;
          verified_at?: string | null;
          verified_by?: string | null;
          invited_at?: string | null;
          invited_by?: string | null;
          family_group_id?: string | null;
          relation_to_primary?: 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'other' | null;
          is_family_primary?: boolean;
          date_of_birth?: string | null;
          anniversary_date?: string | null;
          referred_by_partner_id?: string | null;
          last_birthday_greeted_year?: number | null;
          last_anniversary_greeted_year?: number | null;
          national_id_or_passport?: string | null;
          address_line?: string | null;
          address_city?: string | null;
          address_postal_code?: string | null;
          iran_address?: string | null;
          other_residency_address?: string | null;
          romania_address?: string | null;
          employment_status?: string | null;
          education_level?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source?: string;
          channel_ref?: string | null;
          full_name?: string;
          phone?: string | null;
          email?: string | null;
          site_goal?: string | null;
          unified_category?: string | null;
          message?: string | null;
          status?: 'new' | 'contacted' | 'qualified' | 'closed' | 'archived';
          consent_terms?: boolean;
          marketing_consent?: boolean;
          raw_meta?: Json | null;
          user_id?: string | null;
          verified_at?: string | null;
          verified_by?: string | null;
          invited_at?: string | null;
          invited_by?: string | null;
          family_group_id?: string | null;
          relation_to_primary?: 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'other' | null;
          is_family_primary?: boolean;
          date_of_birth?: string | null;
          anniversary_date?: string | null;
          referred_by_partner_id?: string | null;
          last_birthday_greeted_year?: number | null;
          last_anniversary_greeted_year?: number | null;
          national_id_or_passport?: string | null;
          address_line?: string | null;
          address_city?: string | null;
          address_postal_code?: string | null;
          iran_address?: string | null;
          other_residency_address?: string | null;
          romania_address?: string | null;
          employment_status?: string | null;
          education_level?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'leads_verified_by_fkey';
            columns: ['verified_by'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'leads_invited_by_fkey';
            columns: ['invited_by'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'leads_referred_by_partner_id_fkey';
            columns: ['referred_by_partner_id'];
            isOneToOne: false;
            referencedRelation: 'referral_partners';
            referencedColumns: ['id'];
          }
        ];
      };
      roles: {
        Row: {
          id: string;
          key: string;
          label_fa: string;
          label_en: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          label_fa: string;
          label_en: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          label_fa?: string;
          label_en?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          id: string;
          key: string;
          label_fa: string;
          label_en: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          key: string;
          label_fa: string;
          label_en: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          key?: string;
          label_fa?: string;
          label_en?: string;
          description?: string | null;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          role_id: string;
          permission_id: string;
        };
        Insert: {
          role_id: string;
          permission_id: string;
        };
        Update: {
          role_id?: string;
          permission_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_permissions_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'role_permissions_permission_id_fkey';
            columns: ['permission_id'];
            isOneToOne: false;
            referencedRelation: 'permissions';
            referencedColumns: ['id'];
          }
        ];
      };
      admin_users: {
        Row: {
          id: string;
          role_id: string | null;
          full_name: string | null;
          permission_overrides: Json;
          is_active: boolean;
          telegram_chat_id: string | null;
          date_of_birth: string | null;
          last_birthday_greeted_year: number | null;
          notify_email: boolean;
          notify_telegram: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role_id?: string | null;
          full_name?: string | null;
          permission_overrides?: Json;
          is_active?: boolean;
          telegram_chat_id?: string | null;
          date_of_birth?: string | null;
          last_birthday_greeted_year?: number | null;
          notify_email?: boolean;
          notify_telegram?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role_id?: string | null;
          full_name?: string | null;
          permission_overrides?: Json;
          is_active?: boolean;
          telegram_chat_id?: string | null;
          date_of_birth?: string | null;
          last_birthday_greeted_year?: number | null;
          notify_email?: boolean;
          notify_telegram?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_users_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          }
        ];
      };
      document_types: {
        Row: {
          key: string;
          label_fa: string;
          allowed_roles: string[];
        };
        Insert: {
          key: string;
          label_fa: string;
          allowed_roles: string[];
        };
        Update: {
          key?: string;
          label_fa?: string;
          allowed_roles?: string[];
        };
        Relationships: [];
      };
      lead_assignments: {
        Row: {
          id: string;
          lead_id: string;
          staff_id: string;
          assigned_role: string;
          assigned_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          staff_id: string;
          assigned_role: string;
          assigned_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          staff_id?: string;
          assigned_role?: string;
          assigned_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lead_assignments_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lead_assignments_staff_id_fkey';
            columns: ['staff_id'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          }
        ];
      };
      lead_documents: {
        Row: {
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
        };
        Insert: {
          id?: string;
          lead_id: string;
          document_type: string;
          language?: string | null;
          translation_of_document_id?: string | null;
          translation_office?: string | null;
          is_certified_translation?: boolean;
          uploaded_by_role: 'lead' | 'admin';
          uploaded_by_admin_id?: string | null;
          storage_path: string;
          file_name: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          label?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          document_type?: string;
          language?: string | null;
          translation_of_document_id?: string | null;
          translation_office?: string | null;
          is_certified_translation?: boolean;
          uploaded_by_role?: 'lead' | 'admin';
          uploaded_by_admin_id?: string | null;
          storage_path?: string;
          file_name?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          label?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lead_documents_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lead_documents_uploaded_by_admin_id_fkey';
            columns: ['uploaded_by_admin_id'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lead_documents_document_type_fkey';
            columns: ['document_type'];
            isOneToOne: false;
            referencedRelation: 'document_types';
            referencedColumns: ['key'];
          },
          {
            foreignKeyName: 'lead_documents_translation_of_document_id_fkey';
            columns: ['translation_of_document_id'];
            isOneToOne: false;
            referencedRelation: 'lead_documents';
            referencedColumns: ['id'];
          }
        ];
      };
      lead_messages: {
        Row: {
          id: string;
          lead_id: string;
          sender_role: string;
          sender_ref: string | null;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          sender_role?: string;
          sender_ref?: string | null;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          sender_role?: string;
          sender_ref?: string | null;
          text?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lead_messages_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          }
        ];
      };
      page_comments: {
        Row: {
          id: string;
          page_path: string;
          name: string;
          comment_text: string;
          rating: number | null;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          ip_hash: string | null;
        };
        Insert: {
          id?: string;
          page_path: string;
          name?: string;
          comment_text: string;
          rating?: number | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          ip_hash?: string | null;
        };
        Update: {
          id?: string;
          page_path?: string;
          name?: string;
          comment_text?: string;
          rating?: number | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          ip_hash?: string | null;
        };
        Relationships: [];
      };
      case_stages: {
        Row: {
          id: string;
          lead_id: string;
          stage_key: string;
          label_fa: string;
          status: 'pending' | 'in_progress' | 'done' | 'blocked';
          due_date: string;
          responsible_role: 'agent' | 'consultant' | 'lawyer' | 'notary' | 'finance' | 'marketing' | 'manager' | 'owner';
          responsible_staff_id: string | null;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          stage_key: string;
          label_fa: string;
          status?: 'pending' | 'in_progress' | 'done' | 'blocked';
          due_date: string;
          responsible_role?: 'agent' | 'consultant' | 'lawyer' | 'notary' | 'finance' | 'marketing' | 'manager' | 'owner';
          responsible_staff_id?: string | null;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          stage_key?: string;
          label_fa?: string;
          status?: 'pending' | 'in_progress' | 'done' | 'blocked';
          due_date?: string;
          responsible_role?: 'agent' | 'consultant' | 'lawyer' | 'notary' | 'finance' | 'marketing' | 'manager' | 'owner';
          responsible_staff_id?: string | null;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'case_stages_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'case_stages_responsible_staff_id_fkey';
            columns: ['responsible_staff_id'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          }
        ];
      };
      case_invoices: {
        Row: {
          id: string;
          lead_id: string;
          currency: string;
          total_amount: number;
          status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'cancelled';
          created_by: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          currency?: string;
          total_amount: number;
          status?: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'cancelled';
          created_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          currency?: string;
          total_amount?: number;
          status?: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'cancelled';
          created_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'case_invoices_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'case_invoices_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          }
        ];
      };
      invoice_installments: {
        Row: {
          id: string;
          invoice_id: string;
          installment_no: number;
          amount: number;
          due_date: string;
          paid_amount: number;
          paid_at: string | null;
          status: 'pending' | 'paid' | 'partial' | 'overdue';
          payment_method: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          installment_no: number;
          amount: number;
          due_date: string;
          paid_amount?: number;
          paid_at?: string | null;
          status?: 'pending' | 'paid' | 'partial' | 'overdue';
          payment_method?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          installment_no?: number;
          amount?: number;
          due_date?: string;
          paid_amount?: number;
          paid_at?: string | null;
          status?: 'pending' | 'paid' | 'partial' | 'overdue';
          payment_method?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'invoice_installments_invoice_id_fkey';
            columns: ['invoice_id'];
            isOneToOne: false;
            referencedRelation: 'case_invoices';
            referencedColumns: ['id'];
          }
        ];
      };
      case_expenses: {
        Row: {
          id: string;
          lead_id: string;
          case_stage_id: string | null;
          expense_type: 'notary_fee' | 'translation_fee' | 'lawyer_fee' | 'government_fee' | 'referral_commission' | 'other';
          amount: number;
          currency: string;
          paid_to: string | null;
          incurred_at: string;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          case_stage_id?: string | null;
          expense_type: 'notary_fee' | 'translation_fee' | 'lawyer_fee' | 'government_fee' | 'referral_commission' | 'other';
          amount: number;
          currency?: string;
          paid_to?: string | null;
          incurred_at?: string;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          case_stage_id?: string | null;
          expense_type?: 'notary_fee' | 'translation_fee' | 'lawyer_fee' | 'government_fee' | 'referral_commission' | 'other';
          amount?: number;
          currency?: string;
          paid_to?: string | null;
          incurred_at?: string;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'case_expenses_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'case_expenses_case_stage_id_fkey';
            columns: ['case_stage_id'];
            isOneToOne: false;
            referencedRelation: 'case_stages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'case_expenses_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          }
        ];
      };
      referral_partners: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          email: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
