import { supabase } from './supabase'
import { db, type LocalHousehold, type LocalIndividual, type LocalPhoto, type SyncQueue, generateId, getCurrentTimestamp, getCurrentTimestampMs } from './database'

export class SyncService {
  private isOnline = navigator.onLine
  private syncInProgress = false

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true
      this.syncPendingData()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  // Add record to sync queue
  async addToSyncQueue(tableName: string, recordId: string, operation: 'insert' | 'update' | 'delete', data: any) {
    const queueItem: SyncQueue = {
      id: generateId(),
      table_name: tableName,
      record_id: recordId,
      operation,
      data,
      created_at: getCurrentTimestampMs(),
      attempts: 0
    }

    await db.sync_queue.add(queueItem)
  }

  // Save household offline-first
  async saveHousehold(householdData: Partial<LocalHousehold>, individuals: Partial<LocalIndividual>[] = [], photos: Partial<LocalPhoto>[] = []) {
    try {
      const householdId = householdData.id || generateId()
      const timestamp = getCurrentTimestamp()

      const household: LocalHousehold = {
        ...householdData,
        id: householdId,
        created_at: householdData.created_at || timestamp,
        updated_at: timestamp,
        sync_status: 'pending',
        last_modified: getCurrentTimestampMs()
      }

      // Save household to local DB
      await db.households.put(household)

      // Save individuals
      for (const individual of individuals) {
        const individualRecord: LocalIndividual = {
          ...individual,
          id: individual.id || generateId(),
          household_id: householdId,
          created_at: individual.created_at || timestamp,
          updated_at: timestamp,
          sync_status: 'pending',
          last_modified: getCurrentTimestampMs()
        }
        await db.individuals.put(individualRecord)
        await this.addToSyncQueue('individuals', individualRecord.id, 'insert', individualRecord)
      }

      // Save photos
      for (const photo of photos) {
        const photoRecord: LocalPhoto = {
          ...photo,
          id: photo.id || generateId(),
          household_id: householdId,
          url: photo.url || '',
          created_at: photo.created_at || timestamp,
          sync_status: 'pending',
          last_modified: getCurrentTimestampMs()
        }
        await db.photos.put(photoRecord)
        await this.addToSyncQueue('photos', photoRecord.id, 'insert', photoRecord)
      }

      // Add household to sync queue
      await this.addToSyncQueue('households', householdId, 'insert', household)

      // Try to sync immediately if online
      if (this.isOnline) {
        this.syncPendingData()
      }

      return householdId
    } catch (error) {
      console.error('Error saving household:', error)
      throw error
    }
  }

  // Get pending sync count
  async getPendingSyncCount(): Promise<number> {
    return await db.sync_queue.count()
  }

  // Get synced count
  async getSyncedCount(): Promise<number> {
    return await db.households.where('sync_status').equals('synced').count()
  }

  // Get households for today
  async getHouseholdsToday(): Promise<number> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = today.getTime()

    return await db.households.where('last_modified').above(todayTimestamp).count()
  }

  // Sync pending data to Supabase
  async syncPendingData() {
    if (this.syncInProgress || !this.isOnline) {
      return
    }

    this.syncInProgress = true

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('No authenticated user, skipping sync')
        return
      }

      // Get all pending sync items
      const syncItems = await db.sync_queue.orderBy('created_at').toArray()

      for (const item of syncItems) {
        try {
          await this.processSyncItem(item)
          // Remove from sync queue on success
          await db.sync_queue.delete(item.id)
        } catch (error) {
          console.error(`Error syncing ${item.table_name}:${item.record_id}:`, error)
          // Increment attempts
          await db.sync_queue.update(item.id, {
            attempts: item.attempts + 1,
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      // Update last sync time
      localStorage.setItem('lastSyncTime', getCurrentTimestamp())

    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      this.syncInProgress = false
    }
  }

  private async processSyncItem(item: SyncQueue) {
    const { table_name, record_id, operation, data } = item

    switch (table_name) {
      case 'households':
        if (operation === 'insert') {
          const { sync_status, last_modified, ...householdData } = data
          const { error } = await supabase
            .from('households')
            .upsert({
              ...householdData,
              synced_at: getCurrentTimestamp()
            })

          if (error) throw error

          // Update local record
          await db.households.update(record_id, {
            sync_status: 'synced',
            synced_at: getCurrentTimestamp()
          })
        }
        break

      case 'individuals':
        if (operation === 'insert') {
          const { sync_status, last_modified, ...individualData } = data
          const { error } = await supabase
            .from('individuals')
            .upsert(individualData)

          if (error) throw error

          await db.individuals.update(record_id, { sync_status: 'synced' })
        }
        break

      case 'photos':
        if (operation === 'insert') {
          // Handle photo upload to Supabase Storage first
          if (data.blob_data) {
            const fileName = `${data.household_id}/${record_id}.jpg`
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('household-photos')
              .upload(fileName, data.blob_data, {
                contentType: 'image/jpeg'
              })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
              .from('household-photos')
              .getPublicUrl(fileName)

            // Update photo record with public URL
            const { sync_status, last_modified, blob_data, ...photoData } = data
            const { error } = await supabase
              .from('photos')
              .upsert({
                ...photoData,
                url: publicUrl
              })

            if (error) throw error

            await db.photos.update(record_id, {
              sync_status: 'synced',
              url: publicUrl
            })
          }
        }
        break
    }
  }

  // Get last sync time
  getLastSyncTime(): string | null {
    return localStorage.getItem('lastSyncTime')
  }

  // Manual sync trigger
  async forcSync() {
    return this.syncPendingData()
  }

  // Check connection status
  isConnected(): boolean {
    return this.isOnline
  }
}

export const syncService = new SyncService()
