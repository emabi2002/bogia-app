import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          role: 'admin' | 'enumerator'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'enumerator'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'enumerator'
          created_at?: string
        }
      }
      households: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          province: string | null
          district: string | null
          llg: string | null
          ward: string | null
          hamlet: string | null
          gps_lat: number | null
          gps_lng: number | null
          gps_accuracy: number | null
          tenure: string | null
          head_name: string | null
          head_phone: string | null
          water_source: string | null
          sanitation: string | null
          handwashing_soap: boolean | null
          energy_lighting: string | null
          energy_cooking: string | null
          mobile_coverage: string | null
          internet_access: string | null
          services_health_mins: number | null
          services_school_mins: number | null
          services_police_mins: number | null
          services_market_mins: number | null
          road_condition: string | null
          consent: boolean | null
          enumerator_id: string | null
          sync_source: string | null
          synced_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          province?: string | null
          district?: string | null
          llg?: string | null
          ward?: string | null
          hamlet?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          gps_accuracy?: number | null
          tenure?: string | null
          head_name?: string | null
          head_phone?: string | null
          water_source?: string | null
          sanitation?: string | null
          handwashing_soap?: boolean | null
          energy_lighting?: string | null
          energy_cooking?: string | null
          mobile_coverage?: string | null
          internet_access?: string | null
          services_health_mins?: number | null
          services_school_mins?: number | null
          services_police_mins?: number | null
          services_market_mins?: number | null
          road_condition?: string | null
          consent?: boolean | null
          enumerator_id?: string | null
          sync_source?: string | null
          synced_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          province?: string | null
          district?: string | null
          llg?: string | null
          ward?: string | null
          hamlet?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          gps_accuracy?: number | null
          tenure?: string | null
          head_name?: string | null
          head_phone?: string | null
          water_source?: string | null
          sanitation?: string | null
          handwashing_soap?: boolean | null
          energy_lighting?: string | null
          energy_cooking?: string | null
          mobile_coverage?: string | null
          internet_access?: string | null
          services_health_mins?: number | null
          services_school_mins?: number | null
          services_police_mins?: number | null
          services_market_mins?: number | null
          road_condition?: string | null
          consent?: boolean | null
          enumerator_id?: string | null
          sync_source?: string | null
          synced_at?: string | null
        }
      }
      individuals: {
        Row: {
          id: string
          household_id: string
          created_at: string
          updated_at: string
          name_or_initials: string | null
          sex: string | null
          dob: string | null
          age_years: number | null
          relationship: string | null
          marital_status: string | null
          in_school: boolean | null
          grade_current: string | null
          highest_level: string | null
          livelihood: string | null
          disability_seeing: string | null
          disability_hearing: string | null
          disability_walking: string | null
          disability_remembering: string | null
          disability_selfcare: string | null
          disability_communication: string | null
          youth_15_35: boolean | null
          skills: string[] | null
          availability: string | null
          training_need: string | null
        }
        Insert: {
          id?: string
          household_id: string
          created_at?: string
          updated_at?: string
          name_or_initials?: string | null
          sex?: string | null
          dob?: string | null
          age_years?: number | null
          relationship?: string | null
          marital_status?: string | null
          in_school?: boolean | null
          grade_current?: string | null
          highest_level?: string | null
          livelihood?: string | null
          disability_seeing?: string | null
          disability_hearing?: string | null
          disability_walking?: string | null
          disability_remembering?: string | null
          disability_selfcare?: string | null
          disability_communication?: string | null
          youth_15_35?: boolean | null
          skills?: string[] | null
          availability?: string | null
          training_need?: string | null
        }
        Update: {
          id?: string
          household_id?: string
          created_at?: string
          updated_at?: string
          name_or_initials?: string | null
          sex?: string | null
          dob?: string | null
          age_years?: number | null
          relationship?: string | null
          marital_status?: string | null
          in_school?: boolean | null
          grade_current?: string | null
          highest_level?: string | null
          livelihood?: string | null
          disability_seeing?: string | null
          disability_hearing?: string | null
          disability_walking?: string | null
          disability_remembering?: string | null
          disability_selfcare?: string | null
          disability_communication?: string | null
          youth_15_35?: boolean | null
          skills?: string[] | null
          availability?: string | null
          training_need?: string | null
        }
      }
      photos: {
        Row: {
          id: string
          household_id: string
          url: string
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          url: string
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          url?: string
          caption?: string | null
          created_at?: string
        }
      }
    }
  }
}
