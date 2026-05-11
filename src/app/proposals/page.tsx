'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useTheme } from '@/hooks/useTheme'
import SkeletonCard from '@/components/SkeletonCard'
import type { ProposalsResponse, Profile } from '@/types'

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    gender: '',
    location: '',
    minAge: '',
    maxAge: '',
  })
  
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const fetchProposals = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      })

      const response = await fetch(`/api/proposals?${params}`)
      const data: ProposalsResponse = await response.json()

      if (response.ok) {
        setProposals(data.proposals)
      } else {
        setError(data.error || 'Failed to fetch proposals')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProposals()
  }, [page, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      gender: '',
      location: '',
      minAge: '',
      maxAge: '',
    })
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-wedding-cream dark:bg-wedding-dark">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold">
            {t('proposals.title')}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="wedding-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('common.filter')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('profile.gender')}
              </label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="wedding-input w-full"
              >
                <option value="">{t('common.select')}</option>
                <option value="male">{t('profile.male')}</option>
                <option value="female">{t('profile.female')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('profile.location')}
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="e.g., Colombo"
                className="wedding-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min {t('profile.age')}
              </label>
              <input
                type="number"
                value={filters.minAge}
                onChange={(e) => handleFilterChange('minAge', e.target.value)}
                placeholder="18"
                min="18"
                max="100"
                className="wedding-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max {t('profile.age')}
              </label>
              <input
                type="number"
                value={filters.maxAge}
                onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                placeholder="50"
                min="18"
                max="100"
                className="wedding-input w-full"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="wedding-button w-full"
              >
                {t('common.clear')}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Proposals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t('proposals.noProposals')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProposalCard({ proposal }: { proposal: Profile }) {
  const { t } = useTranslation()
  const [interested, setInterested] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSendInterest = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: proposal.id }),
      })

      if (response.ok) {
        setInterested(true)
      }
    } catch (error) {
      console.error('Error sending interest:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="wedding-card p-6 hover:scale-105 transition-transform duration-300">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-wedding-gold rounded-full flex items-center justify-center text-wedding-maroon font-bold">
          {proposal.firstName[0]}{proposal.lastName[0]}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {proposal.firstName} {proposal.lastName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {`${proposal.age} years • ${proposal.location}`}
          </p>
        </div>
      </div>

      {proposal.job && proposal.education && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {`${proposal.job} • ${proposal.education}`}
        </p>
      )}

      {proposal.description && (
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {proposal.description}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => window.location.href = `/proposals/${proposal.id}`}
          className="flex-1 bg-wedding-maroon hover:bg-wedding-maroon/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('proposals.viewProfile')}
        </button>
        
        <button
          onClick={handleSendInterest}
          disabled={interested || loading}
          className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors ${
            interested
              ? 'bg-green-500 text-white'
              : 'bg-wedding-gold hover:bg-wedding-gold/90 text-wedding-maroon'
          } disabled:opacity-50`}
        >
          {loading ? t('common.loading') : interested ? t('proposals.interested') : t('proposals.sendInterest')}
        </button>
      </div>
    </div>
  )
}
