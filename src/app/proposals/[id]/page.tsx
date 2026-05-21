'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { useTheme } from '@/hooks/useTheme'
import SkeletonCard from '@/components/SkeletonCard'

interface Proposal {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: string
  location: string
  job?: string
  education?: string
  height?: string
  religion?: string
  caste?: string
  motherTongue?: string
  description?: string
  avatar?: string
  isActive: boolean
  createdAt: string
}

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [interested, setInterested] = useState(false)
  const [sendingInterest, setSendingInterest] = useState(false)
  
  const router = useRouter()
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/profile')
      setIsAuthenticated(response.ok)
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  const fetchProposal = useCallback(async () => {
    try {
      const response = await fetch(`/api/proposals/${params.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setProposal(data.proposal)
      } else {
        setError('Proposal not found')
      }
    } catch (error) {
      setError('Failed to fetch proposal')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    checkAuth()
    fetchProposal()
  }, [fetchProposal])

  const handleSendInterest = async () => {
    if (!isAuthenticated) {
      router.push('/auth')
      return
    }

    setSendingInterest(true)
    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: params.id }),
      })

      if (response.ok) {
        setInterested(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to send interest')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setSendingInterest(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-wedding-cream dark:bg-wedding-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SkeletonCard />
        </div>
      </div>
    )
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-wedding-cream dark:bg-wedding-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
            {error || 'Proposal not found'}
          </h1>
          <button
            onClick={() => router.push('/proposals')}
            className="wedding-button"
          >
            {t('common.back')} to Proposals
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wedding-cream dark:bg-wedding-dark">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/proposals')}
              className="flex items-center text-wedding-maroon dark:text-wedding-gold hover:underline"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('common.back')} to Proposals
            </button>
            
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                proposal.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
              }`}>
                {proposal.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="wedding-card p-8">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-wedding-gold rounded-full flex items-center justify-center text-wedding-maroon font-bold text-3xl mx-auto mb-4">
              {proposal.firstName[0]}{proposal.lastName[0]}
            </div>
            <h1 className="text-3xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-2">
              {proposal.firstName} {proposal.lastName}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {proposal.age} years old, {proposal.location}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSendInterest}
                disabled={interested || sendingInterest}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  interested
                    ? 'bg-green-500 text-white'
                    : 'wedding-button disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {sendingInterest ? t('common.loading') : 
                 interested ? t('proposals.interested') : t('proposals.sendInterest')}
              </button>
              
              {!isAuthenticated && (
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Login required to send interest
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Age</span>
                  <span className="font-medium text-gray-900 dark:text-white">{proposal.age} years</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Gender</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{proposal.gender}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Location</span>
                  <span className="font-medium text-gray-900 dark:text-white">{proposal.location}</span>
                </div>
                {proposal.height && (
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Height</span>
                    <span className="font-medium text-gray-900 dark:text-white">{proposal.height}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Professional Details
              </h2>
              <div className="space-y-3">
                {proposal.job && (
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Job</span>
                    <span className="font-medium text-gray-900 dark:text-white">{proposal.job}</span>
                  </div>
                )}
                {proposal.education && (
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Education</span>
                    <span className="font-medium text-gray-900 dark:text-white">{proposal.education}</span>
                  </div>
                )}
                {proposal.motherTongue && (
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Mother Tongue</span>
                    <span className="font-medium text-gray-900 dark:text-white">{proposal.motherTongue}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cultural Background */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Cultural Background
              </h2>
              <div className="space-y-3">
                {proposal.religion && (
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Religion</span>
                    <span className="font-medium text-gray-900 dark:text-white">{proposal.religion}</span>
                  </div>
                )}
                {proposal.caste && (
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Caste</span>
                    <span className="font-medium text-gray-900 dark:text-white">{proposal.caste}</span>
                  </div>
                )}
              </div>
            </div>

            {/* About Me */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                About Me
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {proposal.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Profile created on {new Date(proposal.createdAt).toLocaleDateString()}</p>
              <p className="mt-2">
                This profile is verified and authentic. Spandha ensures all profiles are genuine.
              </p>
            </div>
          </div>
        </div>

        {/* Similar Profiles */}
        <div className="mt-12">
          <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
            Similar Profiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mock similar profiles - in production, fetch from API */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="wedding-card p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-wedding-gold rounded-full flex items-center justify-center text-wedding-maroon font-bold text-sm">
                    P{i}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Person {i}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {25 + i * 2} years, Colombo
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/proposals/${i}`)}
                  className="w-full text-center wedding-button py-2"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
