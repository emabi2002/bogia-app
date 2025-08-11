import Dexie, { type EntityTable } from 'dexie'

// Local database types (mirrors Supabase with additional sync fields)
export interface LocalProfile {
  id: string
  full_name?: string
  phone?: string
  role: 'admin' | 'enumerator'
  created_at: string
  sync_status: 'pending' | 'synced' | 'error'
  last_modified: number
}

export interface LocalHousehold {
  id: string
  created_at: string
  updated_at: string
  province?: string
  district?: string
  llg?: string
  ward?: string
  hamlet?: string
  gps_lat?: number
  gps_lng?: number
  gps_accuracy?: number
  tenure?: string
  head_name?: string
  head_phone?: string
  water_source?: string
  sanitation?: string
  handwashing_soap?: boolean
  energy_lighting?: string
  energy_cooking?: string
  mobile_coverage?: string
  internet_access?: string
  services_health_mins?: number
  services_school_mins?: number
  services_police_mins?: number
  services_market_mins?: number
  road_condition?: string
  consent?: boolean
  enumerator_id?: string
  sync_source?: string
  synced_at?: string
  sync_status: 'pending' | 'synced' | 'error'
  last_modified: number
}

export interface LocalIndividual {
  id: string
  household_id: string
  created_at: string
  updated_at: string
  name_or_initials?: string
  sex?: string
  dob?: string
  age_years?: number
  relationship?: string
  marital_status?: string
  in_school?: boolean
  grade_current?: string
  highest_level?: string
  livelihood?: string
  disability_seeing?: string
  disability_hearing?: string
  disability_walking?: string
  disability_remembering?: string
  disability_selfcare?: string
  disability_communication?: string
  youth_15_35?: boolean
  skills?: string[]
  availability?: string
  training_need?: string
  sync_status: 'pending' | 'synced' | 'error'
  last_modified: number
}

export interface LocalPhoto {
  id: string
  household_id: string
  url: string
  caption?: string
  created_at: string
  sync_status: 'pending' | 'synced' | 'error'
  last_modified: number
  blob_data?: Blob // Store local blob before upload
}

export interface SyncQueue {
  id: string
  table_name: string
  record_id: string
  operation: 'insert' | 'update' | 'delete'
  data: any
  created_at: number
  attempts: number
  error_message?: string
}

// Define the database
export interface BogiaDB {
  profiles: EntityTable<LocalProfile, 'id'>
  households: EntityTable<LocalHousehold, 'id'>
  individuals: EntityTable<LocalIndividual, 'id'>
  photos: EntityTable<LocalPhoto, 'id'>
  sync_queue: EntityTable<SyncQueue, 'id'>
}

export const db = new Dexie('BogiaBaselineDB') as Dexie & BogiaDB

// Define schemas
db.version(1).stores({
  profiles: 'id, role, sync_status, last_modified',
  households: 'id, enumerator_id, ward, llg, sync_status, last_modified, created_at',
  individuals: 'id, household_id, sync_status, last_modified, youth_15_35',
  photos: 'id, household_id, sync_status, last_modified',
  sync_queue: 'id, table_name, record_id, operation, created_at, attempts'
})

// Helper functions
export const generateId = () => {
  return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

export const getCurrentTimestamp = () => {
  return new Date().toISOString()
}

export const getCurrentTimestampMs = () => {
  return Date.now()
}

// Initialize database
export const initializeDB = async () => {
  try {
    await db.open()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}
