export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          role: Database['public']['Enums']['user_role']
          status: Database['public']['Enums']['user_status']
          avatar_url: string | null
          company: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          role?: Database['public']['Enums']['user_role']
          status?: Database['public']['Enums']['user_status']
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          role?: Database['public']['Enums']['user_role']
          status?: Database['public']['Enums']['user_status']
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      advertiser_accounts: {
        Row: {
          id: string
          user_id: string | null
          company_name: string
          contact_email: string
          contact_phone: string | null
          billing_address: Json | null
          payment_method: Json | null
          credit_balance: number | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          company_name: string
          contact_email: string
          contact_phone?: string | null
          billing_address?: Json | null
          payment_method?: Json | null
          credit_balance?: number | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          company_name?: string
          contact_email?: string
          contact_phone?: string | null
          billing_address?: Json | null
          payment_method?: Json | null
          credit_balance?: number | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      ad_placements: {
        Row: {
          id: string
          name: string
          description: string | null
          location: string
          dimensions: Json | null
          max_file_size: number | null
          allowed_formats: string[] | null
          base_price: number
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          location: string
          dimensions?: Json | null
          max_file_size?: number | null
          allowed_formats?: string[] | null
          base_price: number
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          location?: string
          dimensions?: Json | null
          max_file_size?: number | null
          allowed_formats?: string[] | null
          base_price?: number
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      ad_campaigns: {
        Row: {
          id: string
          advertiser_id: string | null
          name: string
          description: string | null
          budget: number
          daily_budget: number | null
          start_date: string
          end_date: string
          targeting_options: Json | null
          status: Database['public']['Enums']['campaign_status'] | null
          total_spent: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          advertiser_id?: string | null
          name: string
          description?: string | null
          budget: number
          daily_budget?: number | null
          start_date: string
          end_date: string
          targeting_options?: Json | null
          status?: Database['public']['Enums']['campaign_status'] | null
          total_spent?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          advertiser_id?: string | null
          name?: string
          description?: string | null
          budget?: number
          daily_budget?: number | null
          start_date?: string
          end_date?: string
          targeting_options?: Json | null
          status?: Database['public']['Enums']['campaign_status'] | null
          total_spent?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      advertisements: {
        Row: {
          id: string
          campaign_id: string | null
          placement_id: string | null
          title: string
          description: string | null
          image_url: string | null
          video_url: string | null
          click_url: string
          alt_text: string | null
          ad_type: Database['public']['Enums']['ad_type']
          content: Json | null
          status: Database['public']['Enums']['ad_status'] | null
          priority: number | null
          weight: number | null
          impressions_count: number | null
          clicks_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          placement_id?: string | null
          title: string
          description?: string | null
          image_url?: string | null
          video_url?: string | null
          click_url: string
          alt_text?: string | null
          ad_type: Database['public']['Enums']['ad_type']
          content?: Json | null
          status?: Database['public']['Enums']['ad_status'] | null
          priority?: number | null
          weight?: number | null
          impressions_count?: number | null
          clicks_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          campaign_id?: string | null
          placement_id?: string | null
          title?: string
          description?: string | null
          image_url?: string | null
          video_url?: string | null
          click_url?: string
          alt_text?: string | null
          ad_type?: Database['public']['Enums']['ad_type']
          content?: Json | null
          status?: Database['public']['Enums']['ad_status'] | null
          priority?: number | null
          weight?: number | null
          impressions_count?: number | null
          clicks_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      ad_impressions: {
        Row: {
          id: string
          ad_id: string | null
          user_id: string | null
          session_id: string | null
          ip_address: string | null
          user_agent: string | null
          page_url: string | null
          referrer: string | null
          device_type: string | null
          browser: string | null
          location: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          ad_id?: string | null
          user_id?: string | null
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          page_url?: string | null
          referrer?: string | null
          device_type?: string | null
          browser?: string | null
          location?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          ad_id?: string | null
          user_id?: string | null
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          page_url?: string | null
          referrer?: string | null
          device_type?: string | null
          browser?: string | null
          location?: Json | null
          created_at?: string | null
        }
      }
      ad_clicks: {
        Row: {
          id: string
          ad_id: string | null
          impression_id: string | null
          user_id: string | null
          session_id: string | null
          ip_address: string | null
          user_agent: string | null
          page_url: string | null
          referrer: string | null
          device_type: string | null
          browser: string | null
          location: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          ad_id?: string | null
          impression_id?: string | null
          user_id?: string | null
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          page_url?: string | null
          referrer?: string | null
          device_type?: string | null
          browser?: string | null
          location?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          ad_id?: string | null
          impression_id?: string | null
          user_id?: string | null
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          page_url?: string | null
          referrer?: string | null
          device_type?: string | null
          browser?: string | null
          location?: Json | null
          created_at?: string | null
        }
      }
      ad_payments: {
        Row: {
          id: string
          advertiser_id: string | null
          campaign_id: string | null
          amount: number
          currency: string | null
          payment_method: string | null
          transaction_id: string | null
          status: Database['public']['Enums']['payment_status'] | null
          payment_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          advertiser_id?: string | null
          campaign_id?: string | null
          amount: number
          currency?: string | null
          payment_method?: string | null
          transaction_id?: string | null
          status?: Database['public']['Enums']['payment_status'] | null
          payment_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          advertiser_id?: string | null
          campaign_id?: string | null
          amount?: number
          currency?: string | null
          payment_method?: string | null
          transaction_id?: string | null
          status?: Database['public']['Enums']['payment_status'] | null
          payment_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          type: Database['public']['Enums']['location_type']
          parent_id: string | null
          slug: string
          description: string | null
          is_active: boolean | null
          property_count: number | null
          latitude: number | null
          longitude: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: Database['public']['Enums']['location_type']
          parent_id?: string | null
          slug: string
          description?: string | null
          is_active?: boolean | null
          property_count?: number | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: Database['public']['Enums']['location_type']
          parent_id?: string | null
          slug?: string
          description?: string | null
          is_active?: boolean | null
          property_count?: number | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          is_active: boolean | null
          property_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          is_active?: boolean | null
          property_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          is_active?: boolean | null
          property_count?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          price: number
          price_unit: Database['public']['Enums']['listing_price_unit']
          property_type: Database['public']['Enums']['listing_property_type']
          purpose: Database['public']['Enums']['listing_purpose']
          bedrooms: number | null
          bathrooms: number | null
          building_size: number | null
          land_size: number | null
          province_id: string | null
          city_id: string | null
          district_id: string | null
          address: string | null
          postal_code: string | null
          features: string[] | null
          status: Database['public']['Enums']['listing_status']
          views: number
          inquiries: number
          is_promoted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          price: number
          price_unit: Database['public']['Enums']['listing_price_unit']
          property_type: Database['public']['Enums']['listing_property_type']
          purpose: Database['public']['Enums']['listing_purpose']
          bedrooms?: number | null
          bathrooms?: number | null
          building_size?: number | null
          land_size?: number | null
          province_id?: string | null
          city_id?: string | null
          district_id?: string | null
          address?: string | null
          postal_code?: string | null
          features?: string[] | null
          status?: Database['public']['Enums']['listing_status']
          views?: number
          inquiries?: number
          is_promoted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          price?: number
          price_unit?: Database['public']['Enums']['listing_price_unit']
          property_type?: Database['public']['Enums']['listing_property_type']
          purpose?: Database['public']['Enums']['listing_purpose']
          bedrooms?: number | null
          bathrooms?: number | null
          building_size?: number | null
          land_size?: number | null
          province_id?: string | null
          city_id?: string | null
          district_id?: string | null
          address?: string | null
          postal_code?: string | null
          features?: string[] | null
          status?: Database['public']['Enums']['listing_status']
          views?: number
          inquiries?: number
          is_promoted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      property_media: {
        Row: {
          id: string
          listing_id: string
          media_url: string
          media_type: string
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          media_url: string
          media_type?: string
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          media_url?: string
          media_type?: string
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      premium_listings: {
        Row: {
          id: string
          property_id: string
          user_id: string
          plan_id: string
          status: Database['public']['Enums']['premium_status']
          start_date: string
          end_date: string
          payment_id: string | null
          analytics_views: number
          analytics_inquiries: number
          analytics_favorites: number
          analytics_conversion_rate: number
          analytics_daily_views: Json | null
          analytics_top_sources: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          plan_id: string
          status?: Database['public']['Enums']['premium_status']
          start_date: string
          end_date: string
          payment_id?: string | null
          analytics_views?: number
          analytics_inquiries?: number
          analytics_favorites?: number
          analytics_conversion_rate?: number
          analytics_daily_views?: Json | null
          analytics_top_sources?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          plan_id?: string
          status?: Database['public']['Enums']['premium_status']
          start_date?: string
          end_date?: string
          payment_id?: string | null
          analytics_views?: number
          analytics_inquiries?: number
          analytics_favorites?: number
          analytics_conversion_rate?: number
          analytics_daily_views?: Json | null
          analytics_top_sources?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      system_settings: {
        Row: {
          id: string
          settings_data: Json
          updated_at: string
        }
        Insert: {
          id?: string
          settings_data: Json
          updated_at?: string
        }
        Update: {
          id?: string
          settings_data?: Json
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          user_name: string | null
          action: string
          resource: string
          resource_id: string | null
          details: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_name?: string | null
          action: string
          resource: string
          resource_id?: string | null
          details?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          user_name?: string | null
          action?: string
          resource?: string
          resource_id?: string | null
          details?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      campaign_status: 'active' | 'cancelled' | 'completed' | 'draft' | 'paused'
      payment_status: 'failed' | 'paid' | 'pending' | 'refunded'
      user_role: 'admin' | 'agent' | 'superadmin' | 'user'
      user_status: 'active' | 'inactive' | 'suspended'
      ad_status: 'active' | 'draft' | 'expired' | 'paused' | 'pending' | 'rejected'
      ad_type: 'banner' | 'footer' | 'in_content' | 'popup' | 'sidebar' | 'video'
      listing_price_unit: 'juta' | 'miliar'
      listing_property_type: 'apartemen' | 'gedung_komersial' | 'kondominium' | 'lainnya' | 'ruang_industri' | 'ruko' | 'rumah' | 'tanah'
      listing_purpose: 'jual' | 'sewa'
      listing_status: 'active' | 'draft' | 'inactive' | 'pending' | 'rejected' | 'rented' | 'sold'
      premium_status: 'active' | 'cancelled' | 'expired' | 'pending'
      location_type: 'kecamatan' | 'kelurahan' | 'kota' | 'provinsi'
    }
  }
}