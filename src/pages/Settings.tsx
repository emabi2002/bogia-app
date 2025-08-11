import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { syncService } from '../lib/sync'
import {
  User,
  Phone,
  Mail,
  Shield,
  Download,
  RefreshCw,
  LogOut,
  Database,
  Trash2
} from 'lucide-react'
import { db } from '../lib/database'

const Settings: React.FC = () => {
  const { user, profile, updateProfile, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || ''
  })

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile(formData)
      alert('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleForceSync = async () => {
    setSyncing(true)
    try {
      await syncService.forcSync()
      alert('Sync completed successfully')
    } catch (error) {
      console.error('Sync error:', error)
      alert('Sync failed. Please check your connection.')
    } finally {
      setSyncing(false)
    }
  }

  const handleExportData = async () => {
    try {
      // Get all data
      const households = await db.households.toArray()
      const individuals = await db.individuals.toArray()
      const photos = await db.photos.toArray()

      const exportData = {
        households,
        individuals,
        photos,
        exported_at: new Date().toISOString(),
        app_version: '1.0.0'
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bogia_survey_backup_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data')
    }
  }

  const handleClearLocalData = async () => {
    if (!confirm('Are you sure you want to clear all local data? This action cannot be undone. Make sure all data is synced first.')) {
      return
    }

    try {
      await db.households.clear()
      await db.individuals.clear()
      await db.photos.clear()
      await db.sync_queue.clear()
      alert('Local data cleared successfully')
    } catch (error) {
      console.error('Error clearing data:', error)
      alert('Failed to clear local data')
    }
  }

  const getStorageInfo = async () => {
    try {
      const householdCount = await db.households.count()
      const individualCount = await db.individuals.count()
      const photoCount = await db.photos.count()
      const pendingCount = await db.sync_queue.count()

      return {
        households: householdCount,
        individuals: individualCount,
        photos: photoCount,
        pending: pendingCount
      }
    } catch (error) {
      return {
        households: 0,
        individuals: 0,
        photos: 0,
        pending: 0
      }
    }
  }

  const [storageInfo, setStorageInfo] = useState({
    households: 0,
    individuals: 0,
    photos: 0,
    pending: 0
  })

  React.useEffect(() => {
    getStorageInfo().then(setStorageInfo)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile and app preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Profile Information
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="h-4 w-4 mr-2" />
              {user?.email}
            </div>
          </div>

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Shield className="h-4 w-4 mr-2" />
            Role: {profile?.role || 'Enumerator'}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Data Management */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Data Management
        </h2>

        {/* Storage Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{storageInfo.households}</p>
            <p className="text-xs text-gray-500">Households</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{storageInfo.individuals}</p>
            <p className="text-xs text-gray-500">Individuals</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{storageInfo.photos}</p>
            <p className="text-xs text-gray-500">Photos</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{storageInfo.pending}</p>
            <p className="text-xs text-gray-500">Pending Sync</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleForceSync}
            disabled={syncing}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Force Sync Now'}
          </button>

          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export All Data
          </button>

          <button
            onClick={handleClearLocalData}
            className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Local Data
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          App Information
        </h2>

        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Last Sync:</strong> {syncService.getLastSyncTime() || 'Never'}</p>
          <p><strong>Connection:</strong> {syncService.isConnected() ? 'Online' : 'Offline'}</p>
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Settings
