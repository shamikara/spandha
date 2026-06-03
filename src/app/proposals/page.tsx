'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import { useTheme } from '@/hooks/useTheme'
import SkeletonCard from '@/components/SkeletonCard'
import type { ProposalsResponse, Profile } from '@/types'
import { motion } from 'framer-motion'

export default function ProposalsPage() {
  const [premiumAdverts, setPremiumAdverts] = useState<any[]>([])
  const [proposals, setProposals] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Real session/premium state
  const [isPremium, setIsPremium] = useState(false)

  // Active tab selection ('female' = Brides, 'male' = Grooms)
  const [activeTab, setActiveTab] = useState<'female' | 'male'>('female')

  // Temporary filter values before user clicks Search
  const [tempFilters, setTempFilters] = useState({
    location: '',
    minAge: '',
    maxAge: '',
  })

  // Applied filter values that trigger API fetches
  const [filters, setFilters] = useState({
    gender: 'female',
    location: '',
    minAge: '',
    maxAge: '',
  })
  
  const { t, language } = useTranslation()
  const { isDark } = useTheme()

  // Fetch current user session to determine premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const data = await response.json()
          if (data.isAuthenticated && data.user) {
            setIsPremium(data.user.isPremium || false)
          }
        }
      } catch (err) {
        console.error('Failed to verify premium status:', err)
      }
    }
    checkPremiumStatus()
  }, [])

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch premium adverts
      const premiumResponse = await fetch('/api/premium-adverts?limit=8')
      if (premiumResponse.ok) {
        const premiumData = await premiumResponse.json()
        setPremiumAdverts(premiumData.adverts || [])
      }

      // Fetch regular proposals with pagination
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
        setTotalPages(data.pagination.totalPages)
      } else {
        setError(data.error || 'Failed to fetch proposals')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    fetchProposals()
  }, [fetchProposals])

  // Change gender tab
  const handleTabChange = (gender: 'female' | 'male') => {
    setActiveTab(gender)
    setFilters(prev => ({
      ...prev,
      gender,
    }))
    setPage(1)
  }

  // Handle input changes inside temporary filters
  const handleTempFilterChange = (key: string, value: string) => {
    setTempFilters(prev => ({ ...prev, [key]: value }))
  }

  // Copy temporary filters to active filters to trigger a fetch
  const applyFilters = () => {
    setFilters(prev => ({
      ...prev,
      ...tempFilters,
    }))
    setPage(1)
  }

  // Reset all filters and search input fields
  const clearFilters = () => {
    const cleared = {
      location: '',
      minAge: '',
      maxAge: '',
    }
    setTempFilters(cleared)
    setFilters({
      gender: activeTab,
      ...cleared,
    })
    setPage(1)
  }

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-500"

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif font-bold tracking-tight text-slate-100"
        >
          {t('proposals.title')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-slate-400"
        >
          {language === 'si' 
            ? 'ඔබේ රුචි අරුචිකම්වලට ගැලපෙන සත්‍යාපනය කළ විවාහ යෝජනා.' 
            : 'Curated connections tailored to your preferences.'}
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bride & Groom Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => handleTabChange('female')}
            className={`flex-1 sm:flex-none px-8 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all border ${
              activeTab === 'female'
                ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white border-pink-500 shadow-[0_4px_20px_rgba(219,39,119,0.35)]'
                : 'bg-white/[0.02] hover:bg-white/[0.05] text-slate-400 border-white/5'
            }`}
          >
            {language === 'si' ? 'මනාලියන් (Brides)' : 'Brides'}
          </button>
          <button
            onClick={() => handleTabChange('male')}
            className={`flex-1 sm:flex-none px-8 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all border ${
              activeTab === 'male'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white border-indigo-500 shadow-[0_4px_20px_rgba(79,70,229,0.35)]'
                : 'bg-white/[0.02] hover:bg-white/[0.05] text-slate-400 border-white/5'
            }`}
          >
            {language === 'si' ? 'මනාලයන් (Grooms)' : 'Grooms'}
          </button>
        </div>

        {/* Filter Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 mb-12 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
        >
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
               {language === 'si' ? 'පෙරහන් මිනුම්' : 'Filter Parameters'}
             </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
                {t('profile.location')}
              </label>
              <input
                type="text"
                value={tempFilters.location}
                onChange={(e) => handleTempFilterChange('location', e.target.value)}
                placeholder={language === 'si' ? 'උදා: කොළඹ' : 'e.g., Colombo'}
                className={inputClasses}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
                Min {t('profile.age')}
              </label>
              <input
                type="number"
                value={tempFilters.minAge}
                onChange={(e) => handleTempFilterChange('minAge', e.target.value)}
                placeholder="18"
                min="18"
                max="100"
                className={inputClasses}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
                Max {t('profile.age')}
              </label>
              <input
                type="number"
                value={tempFilters.maxAge}
                onChange={(e) => handleTempFilterChange('maxAge', e.target.value)}
                placeholder="50"
                min="18"
                max="100"
                className={inputClasses}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>

            <div className="flex gap-3 items-end">
              <button
                onClick={applyFilters}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-500/50"
              >
                {language === 'si' ? 'සොයන්න (Search)' : 'Search'}
              </button>
              <button
                onClick={clearFilters}
                className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium py-2.5 px-4 rounded-xl transition-all border border-white/5 hover:border-white/10"
              >
                {t('common.clear')}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Premium Members Carousel */}
        {!loading && premiumAdverts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-serif font-bold text-slate-100 mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">Premium Adverts</span>
              <span className="text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full">Featured</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {premiumAdverts.slice(0, 8).map((advert, index) => (
                <PremiumAdvertCard key={advert.id} advert={advert} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Proposals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : proposals.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-2xl border border-dashed border-white/10"
          >
            <p className="text-slate-400 text-sm">
              {t('proposals.noProposals')}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proposals.map((proposal, index) => (
                <ProposalCard 
                  key={proposal.id} 
                  proposal={proposal} 
                  index={index} 
                  isCurrentUserPremium={isPremium} 
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function PremiumAdvertCard({ advert, index }: { advert: any; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 backdrop-blur-xl hover:border-yellow-500/40 transition-all duration-300"
    >
      <div className="relative w-16 h-16 mx-auto mb-3">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-yellow-400 flex items-center justify-center text-white font-bold text-xl">
          {advert.user.profile.avatar ? (
            <img src={advert.user.profile.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            `${advert.user.profile.firstName[0]}${advert.user.profile.lastName[0]}`
          )}
        </div>
        <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
          Premium
        </div>
      </div>
      <h3 className="text-sm font-semibold text-slate-100 text-center mb-1 line-clamp-1">
        {advert.title}
      </h3>
      <p className="text-xs text-slate-400 text-center mb-3 line-clamp-2">
        {advert.content}
      </p>
      <p className="text-[10px] text-slate-500 text-center mb-3">
        {advert.user.profile.firstName} {advert.user.profile.lastName} • {advert.user.profile.age} yrs
      </p>
      <button
        onClick={() => window.location.href = `/proposals/${advert.user.profile.firstName}-${advert.user.profile.lastName}`}
        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-yellow-900 text-xs font-semibold py-2 px-3 rounded-lg transition-all"
      >
        View Advert
      </button>
    </motion.div>
  )
}

function ProposalCard({ 
  proposal, 
  index, 
  isCurrentUserPremium 
}: { 
  proposal: Profile
  index: number 
  isCurrentUserPremium: boolean
}) {
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 flex flex-col h-full"
    >
      <div className="flex items-center space-x-5 mb-6">
        <div className="relative">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-slate-200 font-semibold tracking-wider text-lg overflow-hidden transition-all duration-500 ${!isCurrentUserPremium ? 'blur-md opacity-60 scale-95' : ''}`}>
            {proposal.avatar ? (
              <img src={proposal.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              `${proposal.firstName[0]}${proposal.lastName[0]}`
            )}
          </div>
          {!isCurrentUserPremium && (
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-[9px] uppercase font-bold tracking-widest bg-black/60 text-white/90 px-2 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-xl">
                 Premium
               </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-100 tracking-tight">
            {proposal.firstName} {proposal.lastName}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">
            {`${proposal.age} yrs • ${proposal.location}`}
          </p>
        </div>
      </div>

      {(proposal.job || proposal.education) && (
        <div className="mb-3 flex flex-wrap gap-2">
           {proposal.job && <span className="px-2.5 py-1 text-xs rounded-md bg-white/5 text-slate-300 border border-white/5">{proposal.job}</span>}
           {proposal.education && <span className="px-2.5 py-1 text-xs rounded-md bg-white/5 text-slate-300 border border-white/5">{proposal.education}</span>}
        </div>
      )}

      {(proposal.hobbies?.length > 0 || proposal.drinking || proposal.smoking) && (
        <div className="mb-4 flex flex-wrap gap-2">
           {proposal.hobbies?.slice(0, 2).map((hobby, i) => (
             <span key={i} className="px-2.5 py-1 text-xs rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{hobby}</span>
           ))}
           {proposal.drinking && <span className="px-2.5 py-1 text-xs rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">🥂 {proposal.drinking}</span>}
           {proposal.smoking && <span className="px-2.5 py-1 text-xs rounded-md bg-slate-500/20 text-slate-300 border border-slate-500/20">🚬 {proposal.smoking}</span>}
        </div>
      )}

      {proposal.description && (
        <p className="text-sm text-slate-400 mb-8 line-clamp-2 leading-relaxed flex-grow">
          {proposal.description}
        </p>
      )}

      <div className="flex gap-3 mt-auto">
        <button
          onClick={() => window.location.href = `/proposals/${proposal.id}`}
          className="flex-1 bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-medium py-2.5 px-4 rounded-xl transition-all border border-white/5 hover:border-white/10"
        >
          {t('proposals.viewProfile')}
        </button>
        
        <button
          onClick={handleSendInterest}
          disabled={interested || loading}
          className={`flex-1 text-sm font-medium py-2.5 px-4 rounded-xl transition-all ${
            interested
              ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
              : 'bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-500/50'
          } disabled:opacity-50`}
        >
          {loading ? t('common.loading') : interested ? t('proposals.interested') : t('proposals.sendInterest')}
        </button>
      </div>
    </motion.div>
  )
}
