'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { useTheme } from '@/hooks/useTheme'

interface Advert {
  id: string
  title: string
  content: string
  isActive: boolean
  expiresAt: string
  createdAt: string
}

export default function PostAdvertPage() {
  const [adverts, setAdverts] = useState<Advert[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  
  const router = useRouter()
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })

  useEffect(() => {
    checkProfileAndFetchAdverts()
  }, [])

  const checkProfileAndFetchAdverts = async () => {
    try {
      // Check if user has profile
      const profileResponse = await fetch('/api/profile')
      
      if (profileResponse.status === 401) {
        router.push('/auth')
        return
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setUserProfile(profileData.profile)
      } else {
        setError('Please create a profile first before posting adverts')
        setLoading(false)
        return
      }

      // Fetch user's adverts
      const advertsResponse = await fetch('/api/adverts')
      
      if (advertsResponse.ok) {
        const advertsData = await advertsResponse.json()
        setAdverts(advertsData.adverts || [])
      }
    } catch (error) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/adverts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setFormData({ title: '', content: '' })
        setShowForm(false)
        checkProfileAndFetchAdverts() // Refresh adverts list
      } else {
        setError(data.error || 'Failed to post advert')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (advertId: string) => {
    if (!confirm('Are you sure you want to delete this advert?')) {
      return
    }

    try {
      const response = await fetch(`/api/adverts/${advertId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuccess('Advert deleted successfully')
        checkProfileAndFetchAdverts() // Refresh adverts list
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete advert')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-wedding-cream dark:bg-wedding-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-maroon"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wedding-cream dark:bg-wedding-dark">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold">
              {t('advert.title')}
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="wedding-button"
            >
              {showForm ? t('common.cancel') : 'Post New Advert'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300">
            {success}
          </div>
        )}

        {/* Profile Info */}
        {userProfile && (
          <div className="wedding-card p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Posting as: {userProfile.firstName} {userProfile.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your advert will be visible to all users and will expire in 30 days.
            </p>
          </div>
        )}

        {/* New Advert Form */}
        {showForm && (
          <div className="wedding-card p-8 mb-8">
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
              Create New Advert
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('advert.advertTitle')} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="wedding-input w-full"
                  placeholder={t('advert.titlePlaceholder')}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('advert.content')} *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={6}
                  maxLength={1000}
                  className="wedding-input w-full resize-none"
                  placeholder={t('advert.contentPlaceholder')}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formData.content.length}/1000 characters
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Advert Guidelines
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                  <li>Be clear and specific about what you're looking for</li>
                  <li>Include relevant details about age, location, preferences</li>
                  <li>Be respectful and professional in your language</li>
                  <li>Avoid sharing personal contact information</li>
                  <li>Adverts will be automatically removed after 30 days</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ title: '', content: '' })
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 wedding-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? t('common.loading') : t('advert.postAdvert')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Adverts */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
            Your Adverts
          </h2>
          
          {adverts.length === 0 ? (
            <div className="wedding-card p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't posted any adverts yet.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="wedding-button"
              >
                Post Your First Advert
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {adverts.map((advert) => (
                <AdvertCard 
                  key={advert.id} 
                  advert={advert} 
                  onDelete={() => handleDelete(advert.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AdvertCard({ 
  advert, 
  onDelete 
}: { 
  advert: Advert
  onDelete: () => void 
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const expiryDate = new Date(advert.expiresAt)
  const isExpired = expiryDate < new Date()
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="wedding-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {advert.title}
          </h3>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              advert.isActive && !isExpired
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
            }`}>
              {isExpired ? 'Expired' : advert.isActive ? 'Active' : 'Inactive'}
            </span>
            <span>Posted: {new Date(advert.createdAt).toLocaleDateString()}</span>
            {!isExpired && (
              <span>Expires in {daysUntilExpiry} days</span>
            )}
          </div>
        </div>
        
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          title="Delete advert"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="text-gray-700 dark:text-gray-300">
        <p className={`${isExpanded ? '' : 'line-clamp-3'}`}>
          {advert.content}
        </p>
        {advert.content.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-wedding-maroon dark:text-wedding-gold hover:underline text-sm mt-2"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {isExpired && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            This advert has expired. You can post a new advert to continue your search.
          </p>
        </div>
      )}
    </div>
  )
}
