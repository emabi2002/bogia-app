import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Home,
  Plus,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { syncService } from '../lib/sync'

interface DashboardStats {
  householdsToday: number
  householdsTotal: number
  pendingSync: number
  synced: number
  individualsCount: number
}

const Dashboard: React.FC = () => {
  const { profile } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    householdsToday: 0,
    householdsTotal: 0,
    pendingSync: 0,
    synced: 0,
    individualsCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [today, pending, synced] = await Promise.all([
          syncService.getHouseholdsToday(),
          syncService.getPendingSyncCount(),
          syncService.getSyncedCount()
        ])

        // For total households and individuals, we'd need to query the local DB
        // This is a simplified version
        setStats({
          householdsToday: today,
          householdsTotal: pending + synced,
          pendingSync: pending,
          synced: synced,
          individualsCount: 0 // Would need to implement this query
        })
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()

    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const StatCard: React.FC<{
    title: string
    value: number | string
    icon: React.ReactNode
    color: 'blue' | 'green' | 'orange' | 'purple'
    subtitle?: string
  }> = ({ title, value, icon, color, subtitle }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200'
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center">
          <div className={`p-2 rounded-md ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.full_name || 'Enumerator'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your survey data today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Households Today"
          value={stats.householdsToday}
          icon={<Calendar className="h-6 w-6" />}
          color="blue"
          subtitle="Surveys completed today"
        />

        <StatCard
          title="Total Households"
          value={stats.householdsTotal}
          icon={<Home className="h-6 w-6" />}
          color="purple"
          subtitle="All time"
        />

        <StatCard
          title="Pending Sync"
          value={stats.pendingSync}
          icon={<Clock className="h-6 w-6" />}
          color="orange"
          subtitle="Waiting for internet"
        />

        <StatCard
          title="Synced"
          value={stats.synced}
          icon={<CheckCircle className="h-6 w-6" />}
          color="green"
          subtitle="Backed up to cloud"
        />
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/households/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md mr-3">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-gray-900">New Survey</p>
              <p className="text-sm text-gray-500">Start collecting data</p>
            </div>
          </Link>

          <Link
            to="/households"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-50 text-green-600 rounded-md mr-3">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Households</p>
              <p className="text-sm text-gray-500">Browse existing data</p>
            </div>
          </Link>

          <Link
            to="/settings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-purple-50 text-purple-600 rounded-md mr-3">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Settings</p>
              <p className="text-sm text-gray-500">Profile & preferences</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Sync status */}
      {stats.pendingSync > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                Data waiting to sync
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                You have {stats.pendingSync} records that will be synced when you're back online.
                Your data is safe and stored locally.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips for offline use */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Tips for offline use:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• All survey data is automatically saved locally</li>
          <li>• GPS coordinates can be captured without internet</li>
          <li>• Photos are stored on your device until sync</li>
          <li>• Data will sync automatically when connection returns</li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
