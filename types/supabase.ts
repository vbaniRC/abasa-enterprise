export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          coach_id: string
          created_at: string
          date: string
          id: string
          member_id: number
          schedule_id: string
          status: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          date?: string
          id?: string
          member_id: number
          schedule_id: string
          status: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          date?: string
          id?: string
          member_id?: number
          schedule_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          },
        ]
      }
      club: {
        Row: {
          adresa_sjedista: string | null
          banka: string | null
          category: string | null
          city: string | null
          club_type: string | null
          country: string | null
          created_at: string | null
          iban: string | null
          id: string
          logo_url: string | null
          mbs: string | null
          membership_type: string | null
          name: string
          oib: string | null
          pecat_url: string | null
          potpis_predsjednika_url: string | null
          potpis_tajnika_url: string | null
          rental_type: string | null
          sluzbeni_email: string | null
          sluzbeni_telefon: string | null
        }
        Insert: {
          adresa_sjedista?: string | null
          banka?: string | null
          category?: string | null
          city?: string | null
          club_type?: string | null
          country?: string | null
          created_at?: string | null
          iban?: string | null
          id?: string
          logo_url?: string | null
          mbs?: string | null
          membership_type?: string | null
          name: string
          oib?: string | null
          pecat_url?: string | null
          potpis_predsjednika_url?: string | null
          potpis_tajnika_url?: string | null
          rental_type?: string | null
          sluzbeni_email?: string | null
          sluzbeni_telefon?: string | null
        }
        Update: {
          adresa_sjedista?: string | null
          banka?: string | null
          category?: string | null
          city?: string | null
          club_type?: string | null
          country?: string | null
          created_at?: string | null
          iban?: string | null
          id?: string
          logo_url?: string | null
          mbs?: string | null
          membership_type?: string | null
          name?: string
          oib?: string | null
          pecat_url?: string | null
          potpis_predsjednika_url?: string | null
          potpis_tajnika_url?: string | null
          rental_type?: string | null
          sluzbeni_email?: string | null
          sluzbeni_telefon?: string | null
        }
        Relationships: []
      }
      coaches: {
        Row: {
          active: boolean
          cijena_po_satu: number | null
          club_id: string
          created_at: string | null
          email: string
          first_name: string
          iban: string | null
          id: string
          last_name: string
          oib: string | null
          phone: string | null
        }
        Insert: {
          active?: boolean
          cijena_po_satu?: number | null
          club_id: string
          created_at?: string | null
          email: string
          first_name: string
          iban?: string | null
          id?: string
          last_name: string
          oib?: string | null
          phone?: string | null
        }
        Update: {
          active?: boolean
          cijena_po_satu?: number | null
          club_id?: string
          created_at?: string | null
          email?: string
          first_name?: string
          iban?: string | null
          id?: string
          last_name?: string
          oib?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coaches_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club"
            referencedColumns: ["id"]
          },
        ]
      }
      coaches_locations: {
        Row: {
          coach_id: string
          created_at: string | null
          location_id: string
        }
        Insert: {
          coach_id: string
          created_at?: string | null
          location_id: string
        }
        Update: {
          coach_id?: string
          created_at?: string | null
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaches_locations_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaches_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          category: string | null
          club_id: string | null
          created_at: string | null
          description: string | null
          discipline: string | null
          documents_url: string | null
          end_date: string | null
          id: number
          location: string | null
          name: string
          organizer: string | null
          start_date: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          category?: string | null
          club_id?: string | null
          created_at?: string | null
          description?: string | null
          discipline?: string | null
          documents_url?: string | null
          end_date?: string | null
          id?: never
          location?: string | null
          name: string
          organizer?: string | null
          start_date?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          category?: string | null
          club_id?: string | null
          created_at?: string | null
          description?: string | null
          discipline?: string | null
          documents_url?: string | null
          end_date?: string | null
          id?: never
          location?: string | null
          name?: string
          organizer?: string | null
          start_date?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitions_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verification_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      groups: {
        Row: {
          age_group: string | null
          club_id: string
          created_at: string | null
          description: string | null
          id: string
          level: string | null
          max_age: number | null
          min_age: number | null
          name: string
          program_id: string
        }
        Insert: {
          age_group?: string | null
          club_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          level?: string | null
          max_age?: number | null
          min_age?: number | null
          name: string
          program_id: string
        }
        Update: {
          age_group?: string | null
          club_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          level?: string | null
          max_age?: number | null
          min_age?: number | null
          name?: string
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      groups_locations: {
        Row: {
          created_at: string | null
          group_id: string
          location_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          location_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_locations_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          city: string | null
          club_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          club_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          city?: string | null
          club_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          active: boolean
          club_id: string
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string
          id: number
          last_name: string
          phone: string | null
        }
        Insert: {
          active?: boolean
          club_id: string
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name: string
          id?: never
          last_name: string
          phone?: string | null
        }
        Update: {
          active?: boolean
          club_id?: string
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string
          id?: never
          last_name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club"
            referencedColumns: ["id"]
          },
        ]
      }
      members_groups: {
        Row: {
          created_at: string | null
          group_id: string
          member_id: number
        }
        Insert: {
          created_at?: string | null
          group_id: string
          member_id: number
        }
        Update: {
          created_at?: string | null
          group_id?: string
          member_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "members_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_groups_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members_parents: {
        Row: {
          created_at: string | null
          member_id: number
          parent_id: number
          relation: string | null
        }
        Insert: {
          created_at?: string | null
          member_id: number
          parent_id: number
          relation?: string | null
        }
        Update: {
          created_at?: string | null
          member_id?: number
          parent_id?: number
          relation?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_parents_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_parents_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          coach_id: string | null
          created_at: string
          group_id: string | null
          id: string
          member_id: number | null
          message: string
          sender_id: string | null
          title: string
        }
        Insert: {
          coach_id?: string | null
          created_at?: string
          group_id?: string | null
          id?: string
          member_id?: number | null
          message: string
          sender_id?: string | null
          title: string
        }
        Update: {
          coach_id?: string | null
          created_at?: string
          group_id?: string | null
          id?: string
          member_id?: number | null
          message?: string
          sender_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string
          id: number
          last_name: string
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: never
          last_name: string
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: never
          last_name?: string
          phone?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          member_id: number
          month: number
          note: string | null
          status: string
          year: number
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          member_id: number
          month: number
          note?: string | null
          status?: string
          year: number
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          member_id?: number
          month?: number
          note?: string | null
          status?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          club_id: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_owner: boolean | null
          role: string
        }
        Insert: {
          club_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_owner?: boolean | null
          role?: string
        }
        Update: {
          club_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_owner?: boolean | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          club_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          club_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          club_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "club"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule: {
        Row: {
          coach_id: string
          created_at: string | null
          end_time: string
          group_id: string
          id: string
          location_id: string
          start_time: string
          weekday: number
        }
        Insert: {
          coach_id: string
          created_at?: string | null
          end_time: string
          group_id: string
          id?: string
          location_id: string
          start_time: string
          weekday: number
        }
        Update: {
          coach_id?: string
          created_at?: string | null
          end_time?: string
          group_id?: string
          id?: string
          location_id?: string
          start_time?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedule_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_acceptance: {
        Row: {
          coach_id: string
          created_at: string | null
          id: string
          reason: string | null
          responded_at: string | null
          schedule_id: string
          status: string
        }
        Insert: {
          coach_id: string
          created_at?: string | null
          id?: string
          reason?: string | null
          responded_at?: string | null
          schedule_id: string
          status?: string
        }
        Update: {
          coach_id?: string
          created_at?: string | null
          id?: string
          reason?: string | null
          responded_at?: string | null
          schedule_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_acceptance_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_acceptance_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedule"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_club: { Args: { club_name: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
