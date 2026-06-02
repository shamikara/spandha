'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { useTheme } from '@/hooks/useTheme'
import { Camera, ShieldCheck, Upload, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ToastProvider'

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
  avatar?: string | null
  nicFront?: string | null
  nicBack?: string | null
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [nicFrontFile, setNicFrontFile] = useState<File | null>(null)
  const [nicBackFile, setNicBackFile] = useState<File | null>(null)

  const router = useRouter()
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const toast = useToast()

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
    avatar: '',
    nicFront: '',
    nicBack: '',
  })

  const validateFileSize = (file: File): boolean => {
    const maxSize = 500 * 1024 // 500KB
    return file.size <= maxSize
  }

  const uploadToSupabase = async (file: File, folder: string): Promise<string> => {
    const fileName = `${folder}-${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from(folder)
      .upload(fileName, file)

    if (error) {
      throw new Error(`Failed to upload ${folder} image`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from(folder)
      .getPublicUrl(fileName)

    return publicUrl
  }

  const fetchProfile = useCallback(async () => {
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
          avatar: data.profile.avatar || '',
          nicFront: data.profile.nicFront || '',
          nicBack: data.profile.nicBack || '',
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
  }, [router])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

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
      // Handle file uploads
      let avatarUrl = formData.avatar
      let nicFrontUrl = formData.nicFront
      let nicBackUrl = formData.nicBack

      if (avatarFile) {
        if (!validateFileSize(avatarFile)) {
          setError('Avatar image must be less than 500KB')
          toast.danger('Avatar image must be less than 500KB', 'Error')
          setSaving(false)
          return
        }
        avatarUrl = await uploadToSupabase(avatarFile, 'avatars')
      }

      if (nicFrontFile) {
        if (!validateFileSize(nicFrontFile)) {
          setError('NIC front image must be less than 500KB')
          toast.danger('NIC front image must be less than 500KB', 'Error')
          setSaving(false)
          return
        }
        nicFrontUrl = await uploadToSupabase(nicFrontFile, 'nic-documents')
      }

      if (nicBackFile) {
        if (!validateFileSize(nicBackFile)) {
          setError('NIC back image must be less than 500KB')
          toast.danger('NIC back image must be less than 500KB', 'Error')
          setSaving(false)
          return
        }
        nicBackUrl = await uploadToSupabase(nicBackFile, 'nic-documents')
      }

      const method = profile ? 'PUT' : 'POST'
      const response = await fetch('/api/profile', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          avatar: avatarUrl,
          nicFront: nicFrontUrl,
          nicBack: nicBackUrl,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setProfile(data.profile)
        setIsEditing(false)
        setAvatarFile(null)
        setNicFrontFile(null)
        setNicBackFile(null)
        toast.success('Profile updated successfully', 'Success')
        if (!profile) {
          // New profile created
          setSuccess('Profile created successfully!')
        }
      } else {
        setError(data.error || 'Failed to save profile')
        toast.danger(data.error || 'Failed to save profile', 'Error')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error. Please try again.'
      setError(message)
      toast.danger(message, 'Error')
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
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-wedding-gold"
                  />
                ) : (
                  <div className="w-24 h-24 bg-wedding-gold rounded-full flex items-center justify-center text-wedding-maroon font-bold text-3xl mx-auto mb-4">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                )}
                <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.age} years old, {profile.location}
                </p>
              </div>

              {/* Verification Card */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Verification Status</h3>
                </div>
                {profile.nicFront && profile.nicBack ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">NIC documents uploaded. Awaiting admin verification.</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">NIC Front</p>
                        <img src={profile.nicFront} alt="NIC Front" className="w-full h-32 object-cover rounded" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">NIC Back</p>
                        <img src={profile.nicBack} alt="NIC Back" className="w-full h-32 object-cover rounded" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="mb-2">Upload your NIC documents to unlock all features:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Send interests to other profiles</li>
                      <li>Post adverts</li>
                      <li>View full profile details</li>
                    </ul>
                  </div>
                )}
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

              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  {formData.avatar || avatarFile ? (
                    <img
                      src={avatarFile ? URL.createObjectURL(avatarFile) : formData.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-wedding-gold"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-wedding-gold rounded-full flex items-center justify-center text-wedding-maroon font-bold text-3xl border-4 border-wedding-gold">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 cursor-pointer shadow-lg">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (!validateFileSize(file)) {
                            setError('Avatar must be less than 500KB')
                            toast.danger('Avatar must be less than 500KB', 'Error')
                            return
                          }
                          setAvatarFile(file)
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Max 500KB</p>
              </div>

              {/* NIC Upload Section */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">NIC Verification</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NIC Front</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            if (!validateFileSize(file)) {
                              setError('NIC front must be less than 500KB')
                              toast.danger('NIC front must be less than 500KB', 'Error')
                              return
                            }
                            setNicFrontFile(file)
                          }
                        }}
                        className="hidden"
                        id="nicFront"
                      />
                      <label
                        htmlFor="nicFront"
                        className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                      >
                        {nicFrontFile ? (
                          <>
                            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{nicFrontFile.name}</span>
                          </>
                        ) : formData.nicFront ? (
                          <>
                            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Uploaded</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Upload</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NIC Back</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            if (!validateFileSize(file)) {
                              setError('NIC back must be less than 500KB')
                              toast.danger('NIC back must be less than 500KB', 'Error')
                              return
                            }
                            setNicBackFile(file)
                          }
                        }}
                        className="hidden"
                        id="nicBack"
                      />
                      <label
                        htmlFor="nicBack"
                        className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                      >
                        {nicBackFile ? (
                          <>
                            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{nicBackFile.name}</span>
                          </>
                        ) : formData.nicBack ? (
                          <>
                            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Uploaded</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Upload</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Max 500KB per image</p>
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
                        avatar: profile.avatar || '',
                        nicFront: profile.nicFront || '',
                        nicBack: profile.nicBack || '',
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
