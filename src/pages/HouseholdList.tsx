import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { db, type LocalHousehold } from '../lib/database'

const HouseholdList: React.FC = () => {
  const [households, setHouseholds] = useState<LocalHousehold[]>([])
  const [filteredHouseholds, setFilteredHouseholds] = useState<LocalHousehold[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [wardFilter, setWardFilter] = useState('')
  const [syncStatusFilter, setSyncStatusFilter] = useState<'all' | 'pending' | 'synced'>('all')

  useEffect(() => {
    loadHouseholds()
  }, [])

  useEffect(() => {
    filterHouseholds()
  }, [households, searchTerm, wardFilter, syncStatusFilter])

  const loadHouseholds = async () => {
    try {
      const data = await db.households.orderBy('created_at').reverse().toArray()
      setHouseholds(data)
    } catch (error) {
      console.error('Error loading households:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterHouseholds = () => {
    let filtered = households

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(household =>
        household.head_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        household.ward?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        household.hamlet?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Ward filter
    if (wardFilter) {
      filtered = filtered.filter(household => household.ward === wardFilter)
    }

    // Sync status filter
    if (syncStatusFilter !== 'all') {
      filtered = filtered.filter(household => household.sync_status === syncStatusFilter)
    }

    setFilteredHouseholds(filtered)
  }

  const exportToCsv = async () => {
    try {
      // Get all individuals for the households
      const householdIds = filteredHouseholds.map(h => h.id)
      const individuals = await db.individuals.where('household_id').anyOf(householdIds).toArray()

      // Create CSV data
      const csvData = filteredHouseholds.map(household => {
        const householdIndividuals = individuals.filter(i => i.household_id === household.id)
        return {
          id: household.id,
          created_at: household.created_at,
          province: household.province,
          district: household.district,
          llg: household.llg,
          ward: household.ward,
          hamlet: household.hamlet,
          head_name: household.head_name,
          head_phone: household.head_phone,
          gps_lat: household.gps_lat,
          gps_lng: household.gps_lng,
          individuals_count: householdIndividuals.length,
          sync_status: household.sync_status
        }
      })

      // Convert to CSV
      const headers = Object.keys(csvData[0] || {}).join(',')
      const rows = csvData.map(row => Object.values(row).join(','))
      const csvContent = [headers, ...rows].join('\n')

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `households_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const getUniqueWards = () => {
    return [...new Set(households.map(h => h.ward).filter(Boolean))]
  }

  const StatusBadge: React.FC<{ status: 'pending' | 'synced' | 'error' }> = ({ status }) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
      synced: 'bg-green-100 text-green-800 border-green-200',
      error: 'bg-red-100 text-red-800 border-red-200'
    }

    const icons = {
      pending: <Clock className="h-3 w-3" />,
      synced: <CheckCircle className="h-3 w-3" />,
      error: <AlertCircle className="h-3 w-3" />
    }

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs border rounded-full ${styles[status]}`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </span>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Households</h1>
        <button
          onClick={exportToCsv}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search households..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Ward filter */}
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Wards</option>
            {getUniqueWards().map(ward => (
              <option key={ward} value={ward}>{ward}</option>
            ))}
          </select>

          {/* Sync status filter */}
          <select
            value={syncStatusFilter}
            onChange={(e) => setSyncStatusFilter(e.target.value as 'all' | 'pending' | 'synced')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Sync</option>
            <option value="synced">Synced</option>
          </select>

          {/* Stats */}
          <div className="text-sm text-gray-500 flex items-center">
            Showing {filteredHouseholds.length} of {households.length}
          </div>
        </div>
      </div>

      {/* Households list */}
      <div className="space-y-4">
        {filteredHouseholds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No households found</p>
            <Link
              to="/households/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add First Household
            </Link>
          </div>
        ) : (
          filteredHouseholds.map(household => (
            <div key={household.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {household.head_name || 'Unnamed Household'}
                    </h3>
                    <StatusBadge status={household.sync_status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {[household.ward, household.hamlet, household.llg].filter(Boolean).join(', ')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {new Date(household.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HouseholdList
