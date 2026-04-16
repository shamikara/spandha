'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { useTheme } from '@/hooks/useTheme'

interface Profile {
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
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  
  const router = useRouter()
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    location: '',
    job: '',
    education: '',
    height: '',
    religion: '',
    caste: '',
    motherTongue: '',
    description: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      
      if (response.status === 401) {
        router.push('/auth')
        return
      }

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setFormData({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          age: data.profile.age?.toString() || '',
          gender: data.profile.gender || '',
          location: data.profile.location || '',
          job: data.profile.job || '',
          education: data.profile.education || '',
          height: data.profile.height || '',
          religion: data.profile.religion || '',
          caste: data.profile.caste || '',
          motherTongue: data.profile.motherTongue || '',
          description: data.profile.description || '',
        })
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to fetch profile')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const method = profile ? 'PUT' : 'POST'
      const response = await fetch('/api/profile', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setProfile(data.profile)
        setIsEditing(false)
        if (!profile) {
          // New profile created
          setSuccess('Profile created successfully!')
        }
      } else {
        setError(data.error || 'Failed to save profile')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
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
              {profile ? t('nav.profile') : 'Create Profile'}
            </h1>
            {profile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="wedding-button"
              >
                {t('profile.edit')}
              </button>
            )}
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

        <div className="wedding-card p-8">
          {!profile && !isEditing ? (
            // Create profile form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-2">
                  Create Your Profile
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Fill in your details to start browsing proposals
                </p>
              </div>
              <ProfileForm formData={formData} onChange={handleChange} saving={saving} />
            </form>
          ) : profile && !isEditing ? (
            // View profile
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-wedding-gold rounded-full flex items-center justify-center text-wedding-maroon font-bold text-2xl mx-auto mb-4">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.age} years old, {profile.location}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Basic Information</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p><strong>Age:</strong> {profile.age}</p>
                    <p><strong>Gender:</strong> {profile.gender}</p>
                    <p><strong>Location:</strong> {profile.location}</p>
                    {profile.height && <p><strong>Height:</strong> {profile.height}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Professional Details</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    {profile.job && <p><strong>Job:</strong> {profile.job}</p>}
                    {profile.education && <p><strong>Education:</strong> {profile.education}</p>}
                    {profile.motherTongue && <p><strong>Mother Tongue:</strong> {profile.motherTongue}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cultural Background</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    {profile.religion && <p><strong>Religion:</strong> {profile.religion}</p>}
                    {profile.caste && <p><strong>Caste:</strong> {profile.caste}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About Me</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {profile.description || 'No description provided'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Edit profile form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-2">
                  {t('profile.edit')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Update your profile information
                </p>
              </div>
              <ProfileForm formData={formData} onChange={handleChange} saving={saving} />
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    // Reset form to original data
                    if (profile) {
                      setFormData({
                        firstName: profile.firstName || '',
                        lastName: profile.lastName || '',
                        age: profile.age?.toString() || '',
                        gender: profile.gender || '',
                        location: profile.location || '',
                        job: profile.job || '',
                        education: profile.education || '',
                        height: profile.height || '',
                        religion: profile.religion || '',
                        caste: profile.caste || '',
                        motherTongue: profile.motherTongue || '',
                        description: profile.description || '',
                      })
                    }
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
                  {saving ? t('common.loading') : t('profile.save')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileForm({ 
  formData, 
  onChange, 
  saving 
}: { 
  formData: any
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  saving: boolean 
}) {
  const { t } = useTranslation()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.firstName')} *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            required
            className="wedding-input w-full"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.lastName')} *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            required
            className="wedding-input w-full"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.age')} *
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={onChange}
            required
            min="18"
            max="100"
            className="wedding-input w-full"
            placeholder="25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.gender')} *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={onChange}
            required
            className="wedding-input w-full"
          >
            <option value="">Select gender</option>
            <option value="male">{t('profile.male')}</option>
            <option value="female">{t('profile.female')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.location')} *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={onChange}
            required
            className="wedding-input w-full"
            placeholder="Colombo"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.job')}
          </label>
          <input
            type="text"
            name="job"
            value={formData.job}
            onChange={onChange}
            className="wedding-input w-full"
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.education')}
          </label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={onChange}
            className="wedding-input w-full"
            placeholder="BSc Computer Science"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.height')}
          </label>
          <input
            type="text"
            name="height"
            value={formData.height}
            onChange={onChange}
            className="wedding-input w-full"
            placeholder="5 feet 8 inches"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.religion')}
          </label>
          <input
            type="text"
            name="religion"
            value={formData.religion}
            onChange={onChange}
            className="wedding-input w-full"
            placeholder="Buddhism"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('profile.caste')}
          </label>
          <input
            type="text"
            name="caste"
            value={formData.caste}
            onChange={onChange}
            className="wedding-input w-full"
            placeholder="Sinhala"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('profile.motherTongue')}
        </label>
        <input
          type="text"
          name="motherTongue"
          value={formData.motherTongue}
          onChange={onChange}
          className="wedding-input w-full"
          placeholder="Sinhala"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('profile.description')}
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={4}
          maxLength={500}
          className="wedding-input w-full resize-none"
          placeholder="Tell us about yourself, your interests, and what you're looking for in a partner..."
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {formData.description.length}/500 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="wedding-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? t('common.loading') : (formData.firstName ? t('profile.save') : 'Create Profile')}
      </button>
    </>
  )
}
