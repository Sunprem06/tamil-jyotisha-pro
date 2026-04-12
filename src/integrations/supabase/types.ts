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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      birth_charts: {
        Row: {
          chart_data: Json
          chart_type: string
          created_at: string
          family_member_id: string | null
          id: string
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chart_data: Json
          chart_type?: string
          created_at?: string
          family_member_id?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chart_data?: Json
          chart_type?: string
          created_at?: string
          family_member_id?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "birth_charts_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_unlocks: {
        Row: {
          admin_override: boolean
          consent_given: boolean
          created_at: string
          credits_spent: number
          id: string
          requester_id: string
          revoked: boolean
          revoked_by: string | null
          target_id: string
        }
        Insert: {
          admin_override?: boolean
          consent_given?: boolean
          created_at?: string
          credits_spent?: number
          id?: string
          requester_id: string
          revoked?: boolean
          revoked_by?: string | null
          target_id: string
        }
        Update: {
          admin_override?: boolean
          consent_given?: boolean
          created_at?: string
          credits_spent?: number
          id?: string
          requester_id?: string
          revoked?: boolean
          revoked_by?: string | null
          target_id?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      credits: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      deities: {
        Row: {
          color_association: string | null
          consort_tamil: string | null
          created_at: string | null
          day_of_week: string | null
          deity_type: string
          flower_offering: string | null
          fruit_offering: string | null
          iconography_description: string | null
          id: number
          main_mantra: string | null
          name_english: string
          name_sanskrit: string | null
          name_tamil: string
          number_association: number | null
          search_keywords: string[] | null
          significance: string | null
          star_nakshatra: string | null
          tradition: string
          vahana_english: string | null
          vahana_tamil: string | null
          weapon_tamil: string | null
        }
        Insert: {
          color_association?: string | null
          consort_tamil?: string | null
          created_at?: string | null
          day_of_week?: string | null
          deity_type: string
          flower_offering?: string | null
          fruit_offering?: string | null
          iconography_description?: string | null
          id?: number
          main_mantra?: string | null
          name_english: string
          name_sanskrit?: string | null
          name_tamil: string
          number_association?: number | null
          search_keywords?: string[] | null
          significance?: string | null
          star_nakshatra?: string | null
          tradition: string
          vahana_english?: string | null
          vahana_tamil?: string | null
          weapon_tamil?: string | null
        }
        Update: {
          color_association?: string | null
          consort_tamil?: string | null
          created_at?: string | null
          day_of_week?: string | null
          deity_type?: string
          flower_offering?: string | null
          fruit_offering?: string | null
          iconography_description?: string | null
          id?: number
          main_mantra?: string | null
          name_english?: string
          name_sanskrit?: string | null
          name_tamil?: string
          number_association?: number | null
          search_keywords?: string[] | null
          significance?: string | null
          star_nakshatra?: string | null
          tradition?: string
          vahana_english?: string | null
          vahana_tamil?: string | null
          weapon_tamil?: string | null
        }
        Relationships: []
      }
      family_members: {
        Row: {
          created_at: string
          date_of_birth: string
          id: string
          latitude: number
          longitude: number
          name: string
          place: string
          relationship: string | null
          time_of_birth: string
          timezone: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          id?: string
          latitude: number
          longitude: number
          name: string
          place: string
          relationship?: string | null
          time_of_birth: string
          timezone?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          place?: string
          relationship?: string | null
          time_of_birth?: string
          timezone?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fraud_logs: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          signal_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          signal_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          signal_type?: string
          user_id?: string
        }
        Relationships: []
      }
      matrimony_profiles: {
        Row: {
          about_me: string | null
          annual_income: string | null
          body_type: string | null
          caste: string | null
          city: string | null
          company_name: string | null
          complexion: string | null
          country: string
          created_at: string
          date_of_birth: string
          education: string | null
          education_detail: string | null
          family_status: string | null
          family_type: string | null
          father_occupation: string | null
          gender: string
          gothram: string | null
          height_cm: number | null
          horoscope_id: string | null
          id: string
          is_premium: boolean
          is_verified: boolean
          marital_status: string
          mother_occupation: string | null
          mother_tongue: string
          occupation: string | null
          occupation_detail: string | null
          photos: string[] | null
          profile_status: string
          religion: string
          siblings_count: number | null
          state: string | null
          sub_caste: string | null
          updated_at: string
          user_id: string
          visibility: string
          weight_kg: number | null
        }
        Insert: {
          about_me?: string | null
          annual_income?: string | null
          body_type?: string | null
          caste?: string | null
          city?: string | null
          company_name?: string | null
          complexion?: string | null
          country?: string
          created_at?: string
          date_of_birth: string
          education?: string | null
          education_detail?: string | null
          family_status?: string | null
          family_type?: string | null
          father_occupation?: string | null
          gender: string
          gothram?: string | null
          height_cm?: number | null
          horoscope_id?: string | null
          id?: string
          is_premium?: boolean
          is_verified?: boolean
          marital_status?: string
          mother_occupation?: string | null
          mother_tongue?: string
          occupation?: string | null
          occupation_detail?: string | null
          photos?: string[] | null
          profile_status?: string
          religion?: string
          siblings_count?: number | null
          state?: string | null
          sub_caste?: string | null
          updated_at?: string
          user_id: string
          visibility?: string
          weight_kg?: number | null
        }
        Update: {
          about_me?: string | null
          annual_income?: string | null
          body_type?: string | null
          caste?: string | null
          city?: string | null
          company_name?: string | null
          complexion?: string | null
          country?: string
          created_at?: string
          date_of_birth?: string
          education?: string | null
          education_detail?: string | null
          family_status?: string | null
          family_type?: string | null
          father_occupation?: string | null
          gender?: string
          gothram?: string | null
          height_cm?: number | null
          horoscope_id?: string | null
          id?: string
          is_premium?: boolean
          is_verified?: boolean
          marital_status?: string
          mother_occupation?: string | null
          mother_tongue?: string
          occupation?: string | null
          occupation_detail?: string | null
          photos?: string[] | null
          profile_status?: string
          religion?: string
          siblings_count?: number | null
          state?: string | null
          sub_caste?: string | null
          updated_at?: string
          user_id?: string
          visibility?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      partner_preferences: {
        Row: {
          age_max: number | null
          age_min: number | null
          annual_income_min: string | null
          caste: string[] | null
          city: string[] | null
          country: string[] | null
          created_at: string
          dosha_check_required: boolean | null
          education: string[] | null
          height_max: number | null
          height_min: number | null
          id: string
          marital_status: string[] | null
          mother_tongue: string[] | null
          occupation: string[] | null
          star_compatibility_required: boolean | null
          state: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          annual_income_min?: string | null
          caste?: string[] | null
          city?: string[] | null
          country?: string[] | null
          created_at?: string
          dosha_check_required?: boolean | null
          education?: string[] | null
          height_max?: number | null
          height_min?: number | null
          id?: string
          marital_status?: string[] | null
          mother_tongue?: string[] | null
          occupation?: string[] | null
          star_compatibility_required?: boolean | null
          state?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          annual_income_min?: string | null
          caste?: string[] | null
          city?: string[] | null
          country?: string[] | null
          created_at?: string
          dosha_check_required?: boolean | null
          education?: string[] | null
          height_max?: number | null
          height_min?: number | null
          id?: string
          marital_status?: string[] | null
          mother_tongue?: string[] | null
          occupation?: string[] | null
          star_compatibility_required?: boolean | null
          state?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          preferred_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          reason: string
          reported_user_id: string
          reporter_id: string
          resolution_notes: string | null
          resolved_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reported_user_id: string
          reporter_id: string
          resolution_notes?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_id?: string
          resolution_notes?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      spiritual_updates: {
        Row: {
          action: string
          benefit: string
          category: Database["public"]["Enums"]["spiritual_category"]
          created_at: string
          id: string
          is_active: boolean
          language: string
          message: string
          title: string
          update_type: Database["public"]["Enums"]["spiritual_update_type"]
          updated_at: string
        }
        Insert: {
          action: string
          benefit: string
          category?: Database["public"]["Enums"]["spiritual_category"]
          created_at?: string
          id?: string
          is_active?: boolean
          language?: string
          message: string
          title: string
          update_type?: Database["public"]["Enums"]["spiritual_update_type"]
          updated_at?: string
        }
        Update: {
          action?: string
          benefit?: string
          category?: Database["public"]["Enums"]["spiritual_category"]
          created_at?: string
          id?: string
          is_active?: boolean
          language?: string
          message?: string
          title?: string
          update_type?: Database["public"]["Enums"]["spiritual_update_type"]
          updated_at?: string
        }
        Relationships: []
      }
      sthala_varalaru: {
        Row: {
          created_at: string | null
          historical_facts: string | null
          id: number
          inscriptions: string | null
          miracles_recorded: string | null
          puranic_reference: string | null
          story_english: string | null
          story_tamil: string
          temple_id: number | null
          temple_name_tamil: string
        }
        Insert: {
          created_at?: string | null
          historical_facts?: string | null
          id?: number
          inscriptions?: string | null
          miracles_recorded?: string | null
          puranic_reference?: string | null
          story_english?: string | null
          story_tamil: string
          temple_id?: number | null
          temple_name_tamil: string
        }
        Update: {
          created_at?: string | null
          historical_facts?: string | null
          id?: number
          inscriptions?: string | null
          miracles_recorded?: string | null
          puranic_reference?: string | null
          story_english?: string | null
          story_tamil?: string
          temple_id?: number | null
          temple_name_tamil?: string
        }
        Relationships: [
          {
            foreignKeyName: "sthala_varalaru_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          canceled_at: string | null
          created_at: string
          currency: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          interval: string
          plan_name: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          canceled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          interval?: string
          plan_name: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          canceled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          interval?: string
          plan_name?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_configurations: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      temple_visits: {
        Row: {
          created_at: string | null
          id: string
          rating: number | null
          temple_id: number | null
          temple_name_tamil: string
          user_id: string
          visit_notes: string | null
          visited_date: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating?: number | null
          temple_id?: number | null
          temple_name_tamil: string
          user_id: string
          visit_notes?: string | null
          visited_date?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number | null
          temple_id?: number | null
          temple_name_tamil?: string
          user_id?: string
          visit_notes?: string | null
          visited_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "temple_visits_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      temple_wishlist: {
        Row: {
          added_at: string | null
          id: string
          temple_id: number | null
          temple_name_tamil: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          temple_id?: number | null
          temple_name_tamil: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          id?: string
          temple_id?: number | null
          temple_name_tamil?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "temple_wishlist_temple_id_fkey"
            columns: ["temple_id"]
            isOneToOne: false
            referencedRelation: "temples"
            referencedColumns: ["id"]
          },
        ]
      }
      temples: {
        Row: {
          address: string | null
          arupadai_number: number | null
          ashtavinayak_number: number | null
          auspicious_day: string | null
          auspicious_star: string | null
          blessing_for: string | null
          built_by: string | null
          country: string | null
          created_at: string | null
          deity_id: number | null
          deity_name_english: string
          deity_name_tamil: string
          district: string
          divya_desam_number: number | null
          dynasty: string | null
          entry_fee: string | null
          festival_month: string | null
          google_maps_url: string | null
          heritage_period: string | null
          historical_period: string | null
          id: number
          image_url: string | null
          is_arupadai_veedu: boolean | null
          is_ashtavinayak: boolean | null
          is_char_dham: boolean | null
          is_divya_desam: boolean | null
          is_heritage: boolean | null
          is_jyotirlinga: boolean | null
          is_navagraha: boolean | null
          is_nayanar_related: boolean | null
          is_pancha_bhuta_stala: boolean | null
          is_shakti_peetha: boolean | null
          is_shakti_peetham: boolean | null
          is_thevaram_paadal: boolean | null
          is_unesco: boolean | null
          is_world_temple: boolean | null
          jyotirlinga_number: number | null
          latitude: number | null
          location: string
          longitude: number | null
          major_festival: string | null
          name_english: string
          name_tamil: string
          navagraha_order: number | null
          navagraha_planet: string | null
          phone: string | null
          problem_solved: string | null
          shakti_peetha_number: number | null
          significance: string | null
          special_puja: string | null
          state: string
          temple_type: string
          timings: string | null
        }
        Insert: {
          address?: string | null
          arupadai_number?: number | null
          ashtavinayak_number?: number | null
          auspicious_day?: string | null
          auspicious_star?: string | null
          blessing_for?: string | null
          built_by?: string | null
          country?: string | null
          created_at?: string | null
          deity_id?: number | null
          deity_name_english: string
          deity_name_tamil: string
          district: string
          divya_desam_number?: number | null
          dynasty?: string | null
          entry_fee?: string | null
          festival_month?: string | null
          google_maps_url?: string | null
          heritage_period?: string | null
          historical_period?: string | null
          id?: number
          image_url?: string | null
          is_arupadai_veedu?: boolean | null
          is_ashtavinayak?: boolean | null
          is_char_dham?: boolean | null
          is_divya_desam?: boolean | null
          is_heritage?: boolean | null
          is_jyotirlinga?: boolean | null
          is_navagraha?: boolean | null
          is_nayanar_related?: boolean | null
          is_pancha_bhuta_stala?: boolean | null
          is_shakti_peetha?: boolean | null
          is_shakti_peetham?: boolean | null
          is_thevaram_paadal?: boolean | null
          is_unesco?: boolean | null
          is_world_temple?: boolean | null
          jyotirlinga_number?: number | null
          latitude?: number | null
          location: string
          longitude?: number | null
          major_festival?: string | null
          name_english: string
          name_tamil: string
          navagraha_order?: number | null
          navagraha_planet?: string | null
          phone?: string | null
          problem_solved?: string | null
          shakti_peetha_number?: number | null
          significance?: string | null
          special_puja?: string | null
          state?: string
          temple_type: string
          timings?: string | null
        }
        Update: {
          address?: string | null
          arupadai_number?: number | null
          ashtavinayak_number?: number | null
          auspicious_day?: string | null
          auspicious_star?: string | null
          blessing_for?: string | null
          built_by?: string | null
          country?: string | null
          created_at?: string | null
          deity_id?: number | null
          deity_name_english?: string
          deity_name_tamil?: string
          district?: string
          divya_desam_number?: number | null
          dynasty?: string | null
          entry_fee?: string | null
          festival_month?: string | null
          google_maps_url?: string | null
          heritage_period?: string | null
          historical_period?: string | null
          id?: number
          image_url?: string | null
          is_arupadai_veedu?: boolean | null
          is_ashtavinayak?: boolean | null
          is_char_dham?: boolean | null
          is_divya_desam?: boolean | null
          is_heritage?: boolean | null
          is_jyotirlinga?: boolean | null
          is_navagraha?: boolean | null
          is_nayanar_related?: boolean | null
          is_pancha_bhuta_stala?: boolean | null
          is_shakti_peetha?: boolean | null
          is_shakti_peetham?: boolean | null
          is_thevaram_paadal?: boolean | null
          is_unesco?: boolean | null
          is_world_temple?: boolean | null
          jyotirlinga_number?: number | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          major_festival?: string | null
          name_english?: string
          name_tamil?: string
          navagraha_order?: number | null
          navagraha_planet?: string | null
          phone?: string | null
          problem_solved?: string | null
          shakti_peetha_number?: number | null
          significance?: string | null
          special_puja?: string | null
          state?: string
          temple_type?: string
          timings?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "temples_deity_id_fkey"
            columns: ["deity_id"]
            isOneToOne: false
            referencedRelation: "deities"
            referencedColumns: ["id"]
          },
        ]
      }
      trust_scores: {
        Row: {
          activity_quality: number
          behavior_score: number
          created_at: string
          id: string
          last_calculated_at: string
          payment_history_score: number
          profile_completeness: number
          report_count: number
          score: number
          updated_at: string
          user_id: string
          verification_level: number
        }
        Insert: {
          activity_quality?: number
          behavior_score?: number
          created_at?: string
          id?: string
          last_calculated_at?: string
          payment_history_score?: number
          profile_completeness?: number
          report_count?: number
          score?: number
          updated_at?: string
          user_id: string
          verification_level?: number
        }
        Update: {
          activity_quality?: number
          behavior_score?: number
          created_at?: string
          id?: string
          last_calculated_at?: string
          payment_history_score?: number
          profile_completeness?: number
          report_count?: number
          score?: number
          updated_at?: string
          user_id?: string
          verification_level?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "super_admin"
        | "support_agent"
        | "analyst"
        | "astrologer"
      spiritual_category:
        | "general"
        | "money"
        | "family"
        | "health"
        | "spiritual"
      spiritual_update_type:
        | "guidance"
        | "do_this"
        | "avoid_this"
        | "weekly_palan"
        | "monthly_palan"
        | "yearly_palan"
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
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "user",
        "super_admin",
        "support_agent",
        "analyst",
        "astrologer",
      ],
      spiritual_category: ["general", "money", "family", "health", "spiritual"],
      spiritual_update_type: [
        "guidance",
        "do_this",
        "avoid_this",
        "weekly_palan",
        "monthly_palan",
        "yearly_palan",
      ],
    },
  },
} as const
