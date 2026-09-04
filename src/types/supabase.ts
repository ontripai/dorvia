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
          invited_by: string | null;
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role_id?: string | null;
          full_name?: string | null;
          permission_overrides?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role_id?: string | null;
          full_name?: string | null;
          permission_overrides?: Json;
          is_active?: boolean;
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
      lead_documents: {
        Row: {
          id: string;
          lead_id: string;
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
          }
        ];
      };
      lead_messages: {
        Row: {
          id: string;
          lead_id: string;
          sender_role: 'lead' | 'admin' | 'system';
          sender_admin_id: string | null;
          message_text: string;
          is_internal: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          sender_role: 'lead' | 'admin' | 'system';
          sender_admin_id?: string | null;
          message_text: string;
          is_internal?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          sender_role?: 'lead' | 'admin' | 'system';
          sender_admin_id?: string | null;
          message_text?: string;
          is_internal?: boolean;
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
