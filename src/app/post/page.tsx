'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'

interface Advert {
  id: string
  title: string
  content: string
  builderData?: AdvertBuilderData
  isActive: boolean
  expiresAt: string
  createdAt: string
}

interface UserProfile {
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
}

interface AdvertBuilderData {
  postingFor: string
  candidateType: string
  age: string
  location: string
  job: string
  education: string
  height: string
  religion: string
  caste: string
  motherTongue: string
  familyBackground: string
  maritalStatus: string
  diet: string
  smokingHabit: string
  drinkingHabit: string
  hobbies: string
  interests: string
  personality: string
  zodiacSign: string
  lagna: string
  nakshatra: string
  horoscopeAvailable: string
  kujaDosha: string
  lookingForAge: string
  lookingForEducation: string
  lookingForJob: string
  lookingForLocation: string
  qualities: string
  notes: string
}

const emptyBuilderData: AdvertBuilderData = {
  postingFor: '',
  candidateType: '',
  age: '',
  location: '',
  job: '',
  education: '',
  height: '',
  religion: '',
  caste: '',
  motherTongue: '',
  familyBackground: '',
  maritalStatus: '',
  diet: '',
  smokingHabit: '',
  drinkingHabit: '',
  hobbies: '',
  interests: '',
  personality: '',
  zodiacSign: '',
  lagna: '',
  nakshatra: '',
  horoscopeAvailable: '',
  kujaDosha: '',
  lookingForAge: '',
  lookingForEducation: '',
  lookingForJob: '',
  lookingForLocation: '',
  qualities: '',
  notes: '',
}

const zodiacSigns = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
]

const lagnaSigns = [
  'Mesha',
  'Vrishabha',
  'Mithuna',
  'Kataka',
  'Simha',
  'Kanya',
  'Thula',
  'Vrischika',
  'Dhanu',
  'Makara',
  'Kumbha',
  'Meena',
]

const nakshatras = [
  'Ashwini',
  'Bharani',
  'Krittika',
  'Rohini',
  'Mrigashira',
  'Ardra',
  'Punarvasu',
  'Pushya',
  'Ashlesha',
  'Magha',
  'Purva Phalguni',
  'Uttara Phalguni',
  'Hasta',
  'Chitra',
  'Swati',
  'Vishakha',
  'Anuradha',
  'Jyeshtha',
  'Mula',
  'Purva Ashadha',
  'Uttara Ashadha',
  'Shravana',
  'Dhanishta',
  'Shatabhisha',
  'Purva Bhadrapada',
  'Uttara Bhadrapada',
  'Revati',
]

function cleanText(value?: string) {
  return value?.trim().replace(/\s+/g, ' ') || ''
}

function joinParts(parts: string[]) {
  return parts.map(cleanText).filter(Boolean).join(', ')
}

function sentence(value: string) {
  const text = cleanText(value).replace(/[.!?]*$/, '')
  return text ? `${text}.` : ''
}

function candidateLabel(type: string) {
  if (type === 'bride') return 'bride'
  if (type === 'groom') return 'groom'
  return 'candidate'
}

function proposalIntro(postingFor: string) {
  if (postingFor === 'Parents' || postingFor === 'Family') return `${postingFor} invite proposals`
  if (postingFor === 'Guardian' || postingFor === 'Relative') return `${postingFor} invites proposals`
  return 'Marriage proposals are invited'
}

function generateAdvert(data: AdvertBuilderData) {
  const candidate = candidateLabel(data.candidateType)
  const titleParts = [
    data.age ? `${data.age}-year-old` : '',
    candidate,
    data.location ? `from ${data.location}` : '',
  ].filter(Boolean)

  const title = `Marriage proposal for ${titleParts.join(' ') || 'suitable candidate'}`.slice(0, 100)

  const intro = [
    proposalIntro(data.postingFor),
    `for a ${joinParts([data.age ? `${data.age}-year-old` : '', data.religion, data.caste, candidate])}`,
    data.location ? `from ${data.location}` : '',
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')

  const educationCareer = joinParts([
    data.education ? `educated in ${data.education}` : '',
    data.job ? `employed as ${data.job}` : '',
  ])

  const personalDetails = joinParts([
    data.height ? `height ${data.height}` : '',
    data.maritalStatus ? `marital status ${data.maritalStatus}` : '',
    data.motherTongue ? `mother tongue ${data.motherTongue}` : '',
  ])

  const lifestyleDetails = joinParts([
    data.diet ? `diet ${data.diet}` : '',
    data.smokingHabit ? `smoking ${data.smokingHabit.toLowerCase()}` : '',
    data.drinkingHabit ? `drinking ${data.drinkingHabit.toLowerCase()}` : '',
  ])

  const characterDetails = joinParts([
    data.personality ? data.personality : '',
    data.hobbies ? `hobbies include ${data.hobbies}` : '',
    data.interests ? `interested in ${data.interests}` : '',
  ])

  const horoscopeDetails = joinParts([
    data.zodiacSign ? `zodiac sign ${data.zodiacSign}` : '',
    data.lagna ? `lagna ${data.lagna}` : '',
    data.nakshatra ? `nakshatra ${data.nakshatra}` : '',
    data.horoscopeAvailable ? `horoscope ${data.horoscopeAvailable.toLowerCase()}` : '',
    data.kujaDosha ? `Kuja dosha ${data.kujaDosha.toLowerCase()}` : '',
  ])

  const partnerDetails = joinParts([
    data.lookingForAge ? `age ${data.lookingForAge}` : '',
    data.lookingForEducation ? `education ${data.lookingForEducation}` : '',
    data.lookingForJob ? `profession ${data.lookingForJob}` : '',
    data.lookingForLocation ? `from ${data.lookingForLocation}` : '',
  ])

  const content = [
    sentence(intro),
    educationCareer ? sentence(`The ${candidate} is ${educationCareer}`) : '',
    personalDetails ? sentence(personalDetails) : '',
    data.familyBackground ? sentence(`Family background: ${data.familyBackground}`) : '',
    lifestyleDetails ? sentence(`Lifestyle: ${lifestyleDetails}`) : '',
    characterDetails ? sentence(`Personal details: ${characterDetails}`) : '',
    horoscopeDetails ? sentence(`Horoscope details: ${horoscopeDetails}`) : '',
    partnerDetails ? sentence(`Seeking a suitable partner with ${partnerDetails}`) : 'Seeking a kind, educated, family-oriented life partner.',
    data.qualities ? sentence(`Preferred qualities: ${data.qualities}`) : '',
    data.notes ? sentence(data.notes) : '',
    'Interested families or members may respond through Spandha.',
  ]
    .filter(Boolean)
    .join(' ')
    .slice(0, 1000)

  return { title, content }
}

function createBuilderDataFromProfile(profile: UserProfile | null): AdvertBuilderData {
  if (!profile) return emptyBuilderData

  return {
    ...emptyBuilderData,
    candidateType: profile.gender?.toLowerCase() === 'male' ? 'groom' : profile.gender?.toLowerCase() === 'female' ? 'bride' : '',
    age: profile.age?.toString() || '',
    location: profile.location || '',
    job: profile.job || '',
    education: profile.education || '',
    height: profile.height || '',
    religion: profile.religion || '',
    caste: profile.caste || '',
    motherTongue: profile.motherTongue || '',
    notes: profile.description || '',
  }
}

export default function PostAdvertPage() {
  const [adverts, setAdverts] = useState<Advert[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [builderData, setBuilderData] = useState<AdvertBuilderData>(emptyBuilderData)
  const [formData, setFormData] = useState({ title: '', content: '' })

  const router = useRouter()
  const { t } = useTranslation()

  const checkProfileAndFetchAdverts = useCallback(async () => {
    try {
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

      const advertsResponse = await fetch('/api/adverts')

      if (advertsResponse.ok) {
        const advertsData = await advertsResponse.json()
        setAdverts(advertsData.adverts || [])
      }
    } catch {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkProfileAndFetchAdverts()
  }, [checkProfileAndFetchAdverts])

  const openAdvertForm = () => {
    if (showForm) {
      setShowForm(false)
      return
    }

    const initialData = createBuilderDataFromProfile(userProfile)
    const generatedAdvert = generateAdvert(initialData)

    setBuilderData(initialData)
    setFormData(generatedAdvert)
    setShowForm(true)
  }

  const handleBuilderChange = (field: keyof AdvertBuilderData, value: string) => {
    const nextData = { ...builderData, [field]: value }
    setBuilderData(nextData)
    setFormData(generateAdvert(nextData))
  }

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const regenerateAdvert = () => {
    setFormData(generateAdvert(builderData))
  }

  const resetForm = () => {
    setShowForm(false)
    setBuilderData(emptyBuilderData)
    setFormData({ title: '', content: '' })
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
        body: JSON.stringify({
          ...formData,
          builderData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        resetForm()
        checkProfileAndFetchAdverts()
      } else {
        setError(data.error || 'Failed to post advert')
      }
    } catch {
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
        checkProfileAndFetchAdverts()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete advert')
      }
    } catch {
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
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold">
              {t('advert.title')}
            </h1>
            <button onClick={openAdvertForm} className="wedding-button">
              {showForm ? t('common.cancel') : 'Post New Advert'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {userProfile && (
          <div className="wedding-card p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Posting as: {userProfile.firstName} {userProfile.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Fill the simple details and review the generated advert before posting. Your advert will expire in 30 days.
            </p>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px] mb-10">
            <div className="wedding-card p-6 lg:p-8">
              <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
                Tell us the details
              </h2>

              <BuilderSection title="Basic details">
                <SelectField label="Who is posting?" value={builderData.postingFor} onChange={value => handleBuilderChange('postingFor', value)}>
                  <option value="">Select</option>
                  <option value="Parents">Parents</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Self">Self</option>
                  <option value="Relative">Relative</option>
                  <option value="Family">Family</option>
                </SelectField>

                <SelectField label="For who?" value={builderData.candidateType} onChange={value => handleBuilderChange('candidateType', value)}>
                  <option value="">Select</option>
                  <option value="bride">Bride</option>
                  <option value="groom">Groom</option>
                </SelectField>

                <TextField label="Age" value={builderData.age} onChange={value => handleBuilderChange('age', value)} placeholder="28" type="number" />
                <TextField label="Location" value={builderData.location} onChange={value => handleBuilderChange('location', value)} placeholder="Colombo" />
              </BuilderSection>

              <BuilderSection title="Education and background">
                <TextField label="Job / profession" value={builderData.job} onChange={value => handleBuilderChange('job', value)} placeholder="Software Engineer" />
                <TextField label="Education" value={builderData.education} onChange={value => handleBuilderChange('education', value)} placeholder="BSc, MBA, A/L completed" />
                <TextField label="Height" value={builderData.height} onChange={value => handleBuilderChange('height', value)} placeholder="5 feet 6 inches" />
                <SelectField label="Marital status" value={builderData.maritalStatus} onChange={value => handleBuilderChange('maritalStatus', value)}>
                  <option value="">Select</option>
                  <option value="Never married">Never married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </SelectField>
                <TextField label="Religion" value={builderData.religion} onChange={value => handleBuilderChange('religion', value)} placeholder="Buddhist" />
                <TextField label="Caste" value={builderData.caste} onChange={value => handleBuilderChange('caste', value)} placeholder="Optional" />
                <TextField label="Mother tongue" value={builderData.motherTongue} onChange={value => handleBuilderChange('motherTongue', value)} placeholder="Sinhala" />
                <TextareaField label="Family background" value={builderData.familyBackground} onChange={value => handleBuilderChange('familyBackground', value)} placeholder="Respectable, close-knit family from Colombo..." />
              </BuilderSection>

              <BuilderSection title="Lifestyle and personality">
                <SelectField label="Diet" value={builderData.diet} onChange={value => handleBuilderChange('diet', value)}>
                  <option value="">Select</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-vegetarian">Non-vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="No preference">No preference</option>
                </SelectField>

                <SelectField label="Smoking habit" value={builderData.smokingHabit} onChange={value => handleBuilderChange('smokingHabit', value)}>
                  <option value="">Select</option>
                  <option value="Never">Never</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Regularly">Regularly</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </SelectField>

                <SelectField label="Drinking habit" value={builderData.drinkingHabit} onChange={value => handleBuilderChange('drinkingHabit', value)}>
                  <option value="">Select</option>
                  <option value="Never">Never</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Socially">Socially</option>
                  <option value="Regularly">Regularly</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </SelectField>

                <TextField label="Hobbies" value={builderData.hobbies} onChange={value => handleBuilderChange('hobbies', value)} placeholder="Reading, music, travel" />
                <TextField label="Interests" value={builderData.interests} onChange={value => handleBuilderChange('interests', value)} placeholder="Cooking, sports, volunteering" />
                <TextareaField label="Personality / character" value={builderData.personality} onChange={value => handleBuilderChange('personality', value)} placeholder="Kind, calm, family-oriented, independent..." />
              </BuilderSection>

              <BuilderSection title="Horoscope details">
                <SelectField label="Astro / zodiac sign" value={builderData.zodiacSign} onChange={value => handleBuilderChange('zodiacSign', value)}>
                  <option value="">Select</option>
                  {zodiacSigns.map(sign => <option key={sign} value={sign}>{sign}</option>)}
                </SelectField>

                <SelectField label="Lagna" value={builderData.lagna} onChange={value => handleBuilderChange('lagna', value)}>
                  <option value="">Select</option>
                  {lagnaSigns.map(sign => <option key={sign} value={sign}>{sign}</option>)}
                </SelectField>

                <SelectField label="Nakshatra" value={builderData.nakshatra} onChange={value => handleBuilderChange('nakshatra', value)}>
                  <option value="">Select</option>
                  {nakshatras.map(nakshatra => <option key={nakshatra} value={nakshatra}>{nakshatra}</option>)}
                </SelectField>

                <SelectField label="Horoscope" value={builderData.horoscopeAvailable} onChange={value => handleBuilderChange('horoscopeAvailable', value)}>
                  <option value="">Select</option>
                  <option value="Available">Available</option>
                  <option value="Can be shared on request">Can be shared on request</option>
                  <option value="Not required">Not required</option>
                </SelectField>

                <SelectField label="Kuja dosha" value={builderData.kujaDosha} onChange={value => handleBuilderChange('kujaDosha', value)}>
                  <option value="">Select</option>
                  <option value="Not present">Not present</option>
                  <option value="Present">Present</option>
                  <option value="Unknown">Unknown</option>
                </SelectField>
              </BuilderSection>

              <BuilderSection title="Looking for">
                <TextField label="Preferred age range" value={builderData.lookingForAge} onChange={value => handleBuilderChange('lookingForAge', value)} placeholder="28-35" />
                <TextField label="Preferred education" value={builderData.lookingForEducation} onChange={value => handleBuilderChange('lookingForEducation', value)} placeholder="Graduate or professionally qualified" />
                <TextField label="Preferred job" value={builderData.lookingForJob} onChange={value => handleBuilderChange('lookingForJob', value)} placeholder="Stable profession" />
                <TextField label="Preferred location" value={builderData.lookingForLocation} onChange={value => handleBuilderChange('lookingForLocation', value)} placeholder="Colombo or suburbs" />
                <TextareaField label="Qualities expected" value={builderData.qualities} onChange={value => handleBuilderChange('qualities', value)} placeholder="Kind, educated, family-oriented, respectful..." />
                <TextareaField label="Extra notes" value={builderData.notes} onChange={value => handleBuilderChange('notes', value)} placeholder="Any other important details..." />
              </BuilderSection>
            </div>

            <div className="wedding-card p-6 lg:p-8 lg:sticky lg:top-28 self-start">
              <div className="mb-5">
                <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold">
                  Advert preview
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  This updates automatically. Review and edit before posting.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('advert.advertTitle')} *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handlePreviewChange}
                    required
                    maxLength={100}
                    className="wedding-input w-full"
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
                    onChange={handlePreviewChange}
                    required
                    rows={14}
                    maxLength={1000}
                    className="wedding-input w-full resize-none leading-relaxed"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formData.content.length}/1000 characters
                  </p>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  Check names, horoscope facts, age, religion, and partner preferences carefully before posting.
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <button
                    type="button"
                    onClick={regenerateAdvert}
                    className="flex-1 rounded-lg bg-white px-4 py-2 font-medium text-wedding-maroon shadow-sm transition-colors hover:bg-wedding-cream dark:bg-gray-700 dark:text-wedding-gold dark:hover:bg-gray-600"
                  >
                    Regenerate Preview
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 wedding-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? t('common.loading') : t('advert.postAdvert')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        <div>
          <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
            Your Adverts
          </h2>

          {adverts.length === 0 ? (
            <div className="wedding-card p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven&apos;t posted any adverts yet.
              </p>
              <button onClick={openAdvertForm} className="wedding-button">
                Post Your First Advert
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {adverts.map(advert => (
                <AdvertCard key={advert.id} advert={advert} onDelete={() => handleDelete(advert.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BuilderSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 last:mb-0">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>
    </section>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</span>
      <input
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="wedding-input w-full"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</span>
      <select value={value} onChange={event => onChange(event.target.value)} className="wedding-input w-full">
        {children}
      </select>
    </label>
  )
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="block md:col-span-2">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</span>
      <textarea
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="wedding-input w-full resize-none"
      />
    </label>
  )
}

function AdvertCard({
  advert,
  onDelete,
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
            {!isExpired && <span>Expires in {daysUntilExpiry} days</span>}
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
        <p className={`${isExpanded ? '' : 'line-clamp-3'}`}>{advert.content}</p>
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
