import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  Home,
  Plus,
  List,
  Settings,
  Wifi,
  WifiOff,
  RefreshCw,
  Clock
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { syncService } from '../lib/sync'

const Layout: React.FC = () => {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingSyncCount, setPendingSyncCount] = useState(0)
  const [syncedCount, setSyncedCount] = useState(0)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [isManualSyncing, setIsManualSyncing] = useState(false)

  // Update online status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  // Update sync counts
  useEffect(() => {
    const updateCounts = async () => {
      const pending = await syncService.getPendingSyncCount()
      const synced = await syncService.getSyncedCount()
      const lastSync = syncService.getLastSyncTime()

      setPendingSyncCount(pending)
      setSyncedCount(synced)
      setLastSyncTime(lastSync)
    }

    updateCounts()

    // Update counts every 30 seconds
    const interval = setInterval(updateCounts, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleManualSync = async () => {
    if (isManualSyncing || !isOnline) return

    setIsManualSyncing(true)
    try {
      await syncService.forcSync()
      // Refresh counts after sync
      const pending = await syncService.getPendingSyncCount()
      const synced = await syncService.getSyncedCount()
      const lastSync = syncService.getLastSyncTime()

      setPendingSyncCount(pending)
      setSyncedCount(synced)
      setLastSyncTime(lastSync)
    } catch (error) {
      console.error('Manual sync failed:', error)
    } finally {
      setIsManualSyncing(false)
    }
  }

  const formatLastSyncTime = (timestamp: string | null) => {
    if (!timestamp) return 'Never'

    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'New Survey', href: '/households/new', icon: Plus },
    { name: 'Households', href: '/households', icon: List },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Bogia Survey
              </h1>
            </div>

            {/* Status indicators */}
            <div className="flex items-center space-x-4">
              {/* Online/Offline status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-600">
                    <WifiOff className="h-4 w-4" />
                    <span className="text-sm">Offline</span>
                  </div>
                )}
              </div>

              {/* Sync status */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleManualSync}
                  disabled={!isOnline || isManualSyncing}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isManualSyncing ? 'animate-spin' : ''}`} />
                  <span>
                    {pendingSyncCount > 0 ? (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                        {pendingSyncCount} pending
                      </span>
                    ) : (
                      'Synced'
                    )}
                  </span>
                </button>
              </div>

              {/* Last sync time */}
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatLastSyncTime(lastSyncTime)}</span>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">
                  {profile?.full_name || 'User'}
                </span>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile navigation (bottom) */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
          <div className="grid grid-cols-4 gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center justify-center px-3 py-2 text-xs font-medium ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-6 w-6 mb-1" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Desktop sidebar */}
        <nav className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-white md:border-r md:border-gray-200 md:pt-16">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="px-3 py-4">
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href

                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="mr-3 h-6 w-6" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Sync stats */}
            <div className="px-3 py-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-2">
                <div className="flex justify-between">
                  <span>Synced:</span>
                  <span className="font-medium">{syncedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className="font-medium text-orange-600">{pendingSyncCount}</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 md:pl-64 pb-16 md:pb-0">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
