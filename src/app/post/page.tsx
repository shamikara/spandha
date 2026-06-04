'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { Save, Send, X, RefreshCw } from 'lucide-react'

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
  isVerified?: boolean
  isPremium?: boolean
  isAdmin?: boolean
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

const zodiacSignsSi: Record<string, string> = {
  'Aries': 'මේෂ',
  'Taurus': 'වෘෂභ',
  'Gemini': 'මිථුන',
  'Cancer': 'කටක',
  'Leo': 'සිංහ',
  'Virgo': 'කන්‍යා',
  'Libra': 'තුලා',
  'Scorpio': 'වෘශ්චික',
  'Sagittarius': 'ධනු',
  'Capricorn': 'මකර',
  'Aquarius': 'කුම්භ',
  'Pisces': 'මීන',
}

const lagnaSignsSi: Record<string, string> = {
  'Mesha': 'මේෂ',
  'Vrishabha': 'වෘෂභ',
  'Mithuna': 'මිථුන',
  'Kataka': 'කටක',
  'Simha': 'සිංහ',
  'Kanya': 'කන්‍යා',
  'Thula': 'තුලා',
  'Vrischika': 'වෘශ්චික',
  'Dhanu': 'ධනු',
  'Makara': 'මකර',
  'Kumbha': 'කුම්භ',
  'Meena': 'මීන',
}

const nakshatrasSi: Record<string, string> = {
  'Ashwini': 'අස්විද',
  'Bharani': 'බෙරණ',
  'Krittika': 'කැති',
  'Rohini': 'රෙහෙන',
  'Mrigashira': 'මුවසිරස',
  'Ardra': 'අද',
  'Punarvasu': 'පුනාවස',
  'Pushya': 'පුෂ',
  'Ashlesha': 'අස්ලිස',
  'Magha': 'මා',
  'Purva Phalguni': 'පුවපල්',
  'Uttara Phalguni': 'උත්‍රපල්',
  'Hasta': 'හත',
  'Chitra': 'සිත',
  'Swati': 'සා',
  'Vishakha': 'විසා',
  'Anuradha': 'අනුර',
  'Jyeshtha': 'දෙට',
  'Mula': 'මුල',
  'Purva Ashadha': 'පුවසල',
  'Uttara Ashadha': 'උත්‍රසල',
  'Shravana': 'සුවණ',
  'Dhanishta': 'දෙනට',
  'Shatabhisha': 'සියාවස',
  'Purva Bhadrapada': 'පුවපුටුප',
  'Uttara Bhadrapada': 'උත්‍රපුටුප',
  'Revati': 'රේවතී',
}

const postingForSi: Record<string, string> = {
  'Parents': 'දෙමාපියන්',
  'Guardian': 'භාරකරු',
  'Self': 'තමා',
  'Relative': 'ඥාතියා',
  'Family': 'පවුලේ අය',
}

const maritalStatusSi: Record<string, string> = {
  'Never married': 'කිසිදිනක විවාහ නොවූ',
  'Divorced': 'දික්කසාද වූ',
  'Widowed': 'වැන්දඹු',
  'Separated': 'වෙන් වූ',
}

const dietSi: Record<string, string> = {
  'Vegetarian': 'නිර්මාංශ',
  'Non-vegetarian': 'නිර්මාංශ නොවන',
  'Eggetarian': 'බිත්තර සහිත නිර්මාංශ',
  'No preference': 'විශේෂ මනාපයක් නොමැත',
}

const habitSi: Record<string, string> = {
  'Never': 'කිසිවිටෙක නැත',
  'Occasionally': 'වරින් වර',
  'Socially': 'සමාජයීය වශයෙන්',
  'Regularly': 'නිතිපතා',
  'Prefer not to say': 'ප්‍රකාශ කිරීමට අකමැති',
}

const horoscopeSi: Record<string, string> = {
  'Available': 'තිබේ',
  'Can be shared on request': 'ඉල්ලීම මත බෙදා ගත හැක',
  'Not required': 'අවශ්‍ය නොවේ',
}

const kujaSi: Record<string, string> = {
  'Not present': 'නොමැත',
  'Present': 'තිබේ',
  'Unknown': 'නොදනී',
}

function candidateLabel(type: string, lang: string) {
  if (lang === 'si') {
    if (type === 'bride') return 'මනාලිය'
    if (type === 'groom') return 'මනාලයා'
    return 'අයදුම්කරු'
  }
  if (type === 'bride') return 'bride'
  if (type === 'groom') return 'groom'
  return 'candidate'
}

function proposalIntro(postingFor: string, lang: string) {
  if (lang === 'si') {
    const relationship = postingForSi[postingFor] || 'පාර්ශවයන්'
    if (postingFor === 'Parents' || postingFor === 'Family' || postingFor === 'Guardian' || postingFor === 'Relative') {
      return `${relationship} විසින් විවාහ යෝජනා කැඳවනු ලැබේ`
    }
    return 'විවාහ යෝජනා කැඳවනු ලැබේ'
  }
  if (postingFor === 'Parents' || postingFor === 'Family') return `${postingFor} invite proposals`
  if (postingFor === 'Guardian' || postingFor === 'Relative') return `${postingFor} invites proposals`
  return 'Marriage proposals are invited'
}

function generateAdvert(data: AdvertBuilderData, lang: string = 'en') {
  if (lang === 'si') {
    const candidate = candidateLabel(data.candidateType, 'si')
    const titleParts = [
      data.location ? `${data.location} ප්‍රදේශයෙන්` : '',
      data.age ? `${data.age} හැවිරිදි` : '',
      candidate,
      'සඳහා විවාහ යෝජනාවක්',
    ].filter(Boolean)

    const title = titleParts.join(' ').slice(0, 100)

    const introParts = [
      proposalIntro(data.postingFor, 'si'),
      data.age ? `${data.age} හැවිරිදි` : '',
      data.religion ? `${data.religion} භක්තික` : '',
      data.caste ? `${data.caste} කුලයට අයත්` : '',
      candidate,
      data.location ? `${data.location} ප්‍රදේශයේ පදිංචි වේ` : '',
    ].filter(Boolean)
    const intro = introParts.join(', ') + '.'

    const educationCareer = joinParts([
      data.education ? `අධ්‍යාපනය: ${data.education}` : '',
      data.job ? `රැකියාව: ${data.job}` : '',
    ])

    const personalDetails = joinParts([
      data.height ? `උස ${data.height}` : '',
      data.maritalStatus ? `විවාහක තත්ත්වය: ${maritalStatusSi[data.maritalStatus] || data.maritalStatus}` : '',
      data.motherTongue ? `මව් භාෂාව: ${data.motherTongue}` : '',
    ])

    const lifestyleDetails = joinParts([
      data.diet ? `ආහාර: ${dietSi[data.diet] || data.diet}` : '',
      data.smokingHabit ? `දුම්පානය: ${habitSi[data.smokingHabit] || data.smokingHabit}` : '',
      data.drinkingHabit ? `මත්පැන්: ${habitSi[data.drinkingHabit] || data.drinkingHabit}` : '',
    ])

    const characterDetails = joinParts([
      data.personality ? data.personality : '',
      data.hobbies ? `විනෝදාංශ: ${data.hobbies}` : '',
      data.interests ? `උනන්දුව දක්වන දේ: ${data.interests}` : '',
    ])

    const horoscopeDetails = joinParts([
      data.zodiacSign ? `ලග්නය: ${zodiacSignsSi[data.zodiacSign] || data.zodiacSign}` : '',
      data.lagna ? `ලග්නය (ලග්න): ${lagnaSignsSi[data.lagna] || data.lagna}` : '',
      data.nakshatra ? `නැකත: ${nakshatrasSi[data.nakshatra] || data.nakshatra}` : '',
      data.horoscopeAvailable ? `කේන්දරය: ${horoscopeSi[data.horoscopeAvailable] || data.horoscopeAvailable}` : '',
      data.kujaDosha ? `කුජ දෝෂය: ${kujaSi[data.kujaDosha] || data.kujaDosha}` : '',
    ])

    const partnerDetails = joinParts([
      data.lookingForAge ? `වයස ${data.lookingForAge}` : '',
      data.lookingForEducation ? `අධ්‍යාපනය ${data.lookingForEducation}` : '',
      data.lookingForJob ? `රැකියාව ${data.lookingForJob}` : '',
      data.lookingForLocation ? `ප්‍රදේශය ${data.lookingForLocation}` : '',
    ])

    const content = [
      sentence(intro),
      educationCareer ? sentence(`${candidate}ගේ ${educationCareer} වේ`) : '',
      personalDetails ? sentence(personalDetails) : '',
      data.familyBackground ? sentence(`පවුල් පසුබිම: ${data.familyBackground}`) : '',
      lifestyleDetails ? sentence(`ජීවන රටාව: ${lifestyleDetails}`) : '',
      characterDetails ? sentence(`පෞද්ගලික තොරතුරු: ${characterDetails}`) : '',
      horoscopeDetails ? sentence(`කේන්දර තොරතුරු: ${horoscopeDetails}`) : '',
      partnerDetails ? sentence(`බලාපොරොත්තු වන සහකරු/සහකාරියගේ විස්තර: ${partnerDetails}`) : 'කාරුණික, උගත්, පවුලට හිතැති සහකරුවෙකු/සහකාරියක බලාපොරොත්තු වේ.',
      data.qualities ? sentence(`අපේක්ෂිත ගුණාංග: ${data.qualities}`) : '',
      data.notes ? sentence(data.notes) : '',
      'උනන්දුවක් දක්වන පාර්ශවයන්ට Spandha හරහා සම්බන්ධ විය හැක.',
    ]
      .filter(Boolean)
      .join(' ')
      .slice(0, 1000)

    return { title, content }
  }

  const candidate = candidateLabel(data.candidateType, 'en')
  const titleParts = [
    data.age ? `${data.age}-year-old` : '',
    candidate,
    data.location ? `from ${data.location}` : '',
  ].filter(Boolean)

  const title = `Marriage proposal for ${titleParts.join(' ') || 'suitable candidate'}`.slice(0, 100)

  const intro = [
    proposalIntro(data.postingFor, 'en'),
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
  const { t, language } = useTranslation()

  const checkProfileAndFetchAdverts = useCallback(async () => {
    try {
      const profileResponse = await fetch('/api/profile')

      if (profileResponse.status === 401) {
        router.push('/auth')
        return
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setUserProfile({
          ...profileData.profile,
          isVerified: profileData.profile.user?.isVerified || false,
          isPremium: profileData.profile.user?.isPremium || false,
          isAdmin: profileData.profile.user?.isAdmin || false,
        })
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

    // Check verification status
    if (!userProfile?.isVerified) {
      setError('You must be verified to post adverts. Please upload your NIC documents in your profile.')
      return
    }

    // Check posting limits
    const activeAdverts = adverts.filter(a => a.isActive && new Date(a.expiresAt) > new Date())
    const maxActiveAdverts = userProfile?.isPremium ? 5 : 1

    if (activeAdverts.length >= maxActiveAdverts) {
      setError(`You have reached your maximum of ${maxActiveAdverts} active adverts. Please wait for an advert to expire or upgrade to Premium for up to 5 active adverts.`)
      return
    }

    // For free users, check 30-day posting limit
    if (!userProfile?.isPremium) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const recentAdverts = adverts.filter(a => new Date(a.createdAt) > thirtyDaysAgo)
      if (recentAdverts.length >= 1) {
        const lastAdvertDate = new Date(recentAdverts[0].createdAt)
        const nextAvailableDate = new Date(lastAdvertDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        setError(`Free users can post 1 advert per 30 days. Next post available on ${nextAvailableDate.toLocaleDateString()}. Upgrade to Premium for more posting flexibility.`)
        return
      }
    }

    const initialData = createBuilderDataFromProfile(userProfile)
    const generatedAdvert = generateAdvert(initialData, language)

    setBuilderData(initialData)
    setFormData(generatedAdvert)
    setShowForm(true)
  }

  const handleBuilderChange = (field: keyof AdvertBuilderData, value: string) => {
    const nextData = { ...builderData, [field]: value }
    setBuilderData(nextData)
    setFormData(generateAdvert(nextData, language))
  }

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const regenerateAdvert = () => {
    setFormData(generateAdvert(builderData, language))
  }

  const resetForm = () => {
    setShowForm(false)
    setBuilderData(emptyBuilderData)
    setFormData({ title: '', content: '' })
  }

  const handleSubmit = async (e: React.FormEvent, isPublished: boolean = true) => {
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
           isPublished,
         }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(isPublished ? t('advert.posted') : 'Draft saved successfully')
        resetForm()
        checkProfileAndFetchAdverts()
      } else {
        setError(data.error || 'Failed to save advert')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (advertId: string) => {
    // Regular users cannot delete adverts - they can only request deletion
    if (!userProfile?.isAdmin) {
      setError('Please contact admin to request advert deletion.')
      return
    }

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
          <form className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px] mb-10">
            <div className="wedding-card p-6 lg:p-8">
              <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
                {language === 'si' ? 'විස්තර අපට පවසන්න' : 'Tell us the details'}
              </h2>

              <BuilderSection title={language === 'si' ? 'මූලික විස්තර' : 'Basic details'}>
                <SelectField label={language === 'si' ? 'පළ කරන්නේ කවුද?' : 'Who is posting?'} value={builderData.postingFor} onChange={value => handleBuilderChange('postingFor', value)}>
                  <option value="">{language === 'si' ? 'තෝරන්න' : 'Select'}</option>
                  <option value="Parents">{language === 'si' ? 'මව්පියන්' : 'Parents'}</option>
                  <option value="Guardian">{language === 'si' ? 'භාරකරු' : 'Guardian'}</option>
                  <option value="Self">{language === 'si' ? 'තමා' : 'Self'}</option>
                  <option value="Relative">{language === 'si' ? 'ඥාතියා' : 'Relative'}</option>
                  <option value="Family">{language === 'si' ? 'පවුලේ අය' : 'Family'}</option>
                </SelectField>

                <SelectField label={language === 'si' ? 'කා සඳහාද?' : 'For who?'} value={builderData.candidateType} onChange={value => handleBuilderChange('candidateType', value)}>
                  <option value="">{language === 'si' ? 'තෝරන්න' : 'Select'}</option>
                  <option value="bride">{language === 'si' ? 'මනාලිය' : 'Bride'}</option>
                  <option value="groom">{language === 'si' ? 'මනාලයා' : 'Groom'}</option>
                </SelectField>

                <TextField label={language === 'si' ? 'වයස' : 'Age'} value={builderData.age} onChange={value => handleBuilderChange('age', value)} placeholder="28" type="number" />
                <TextField label={language === 'si' ? 'පදිංචි ප්‍රදේශය' : 'Location'} value={builderData.location} onChange={value => handleBuilderChange('location', value)} placeholder={language === 'si' ? 'කොළඹ' : 'Colombo'} />
              </BuilderSection>

              <BuilderSection title={language === 'si' ? 'අධ්‍යාපනය සහ පවුල් පසුබිම' : 'Education and background'}>
                <TextField label={language === 'si' ? 'රැකියාව / වෘත්තිය' : 'Job / profession'} value={builderData.job} onChange={value => handleBuilderChange('job', value)} placeholder={language === 'si' ? 'මෘදුකාංග ඉංජිනේරු' : 'Software Engineer'} />
                <TextField label={language === 'si' ? 'අධ්‍යාපනය' : 'Education'} value={builderData.education} onChange={value => handleBuilderChange('education', value)} placeholder={language === 'si' ? 'පළමු උපාධිය, පශ්චාත් උපාධිය, උසස් පෙළ නිමකළ' : 'BSc, MBA, A/L completed'} />
                <TextField label={language === 'si' ? 'උස' : 'Height'} value={builderData.height} onChange={value => handleBuilderChange('height', value)} placeholder={language === 'si' ? 'අඩි 5 අඟල් 6' : '5 feet 6 inches'} />
                <SelectField label={language === 'si' ? 'විවාහක තත්ත්වය' : 'Marital status'} value={builderData.maritalStatus} onChange={value => handleBuilderChange('maritalStatus', value)}>
                  <option value="">{language === 'si' ? 'තෝරන්න' : 'Select'}</option>
                  <option value="Never married">{language === 'si' ? 'කිසිදිනක විවාහ නොවූ' : 'Never married'}</option>
                  <option value="Divorced">{language === 'si' ? 'දික්කසාද වූ' : 'Divorced'}</option>
                  <option value="Widowed">{language === 'si' ? 'වැන්දඹු' : 'Widowed'}</option>
                  <option value="Separated">{language === 'si' ? 'වෙන් වූ' : 'Separated'}</option>
                </SelectField>
                <TextField label={language === 'si' ? 'ආගම' : 'Religion'} value={builderData.religion} onChange={value => handleBuilderChange('religion', value)} placeholder={language === 'si' ? 'බෞද්ධ' : 'Buddhist'} />
                <TextField label={language === 'si' ? 'කුලය' : 'Caste'} value={builderData.caste} onChange={value => handleBuilderChange('caste', value)} placeholder={language === 'si' ? 'අත්‍යවශ්‍ය නොවේ' : 'Optional'} />
                <TextField label={language === 'si' ? 'මව් භාෂාව' : 'Mother tongue'} value={builderData.motherTongue} onChange={value => handleBuilderChange('motherTongue', value)} placeholder={language === 'si' ? 'සිංහල' : 'Sinhala'} />
                <TextareaField label={language === 'si' ? 'පවුල් පසුබිම' : 'Family background'} value={builderData.familyBackground} onChange={value => handleBuilderChange('familyBackground', value)} placeholder={language === 'si' ? 'කොළඹ ප්‍රදේශයේ වැදගත්, කුළුපග පවුලක්...' : 'Respectable, close-knit family from Colombo...'} />
              </BuilderSection>

              <BuilderSection title={language === 'si' ? 'ජීවන රටාව සහ පෞරුෂය' : 'Lifestyle and personality'}>
                <SelectField label={language === 'si' ? 'ආහාර රටාව' : 'Diet'} value={builderData.diet} onChange={value => handleBuilderChange('diet', value)}>
                  <option value="">{language === 'si' ? 'තෝරන්න' : 'Select'}</option>
                  <option value="Vegetarian">{language === 'si' ? 'නිර්මාංශ' : 'Vegetarian'}</option>
                  <option value="Non-vegetarian">{language === 'si' ? 'නිර්මාංශ නොවන' : 'Non-vegetarian'}</option>
                  <option value="Eggetarian">{language === 'si' ? 'බිත්තර සහිත නිර්මාංශ' : 'Eggetarian'}</option>
                  <option value="No preference">{language === 'si' ? 'විශේෂ මනාපයක් නැත' : 'No preference'}</option>
                </SelectField>

                <SelectField label={language === 'si' ? 'දුම්පානය' : 'Smoking habit'} value={builderData.smokingHabit} onChange={value => handleBuilderChange('smokingHabit', value)}>
                  <option value="">{language === 'si' ? 'තෝරන්න' : 'Select'}</option>
                  <option value="Never">{language === 'si' ? 'කිසිවිටෙක නැත' : 'Never'}</option>
                  <option value="Occasionally">{language === 'si' ? 'වරින් වර' : 'Occasionally'}</option>
                  <option value="Regularly">{language === 'si' ? 'නිතිපතා' : 'Regularly'}</option>
                  <option value="Prefer not to say">{language === 'si' ? 'ප්‍රකාශ කිරීමට අකමැති' : 'Prefer not to say'}</option>
                </SelectField>

                <SelectField label={language === 'si' ? 'මත්පැන් භාවිතය' : 'Drinking habit'} value={builderData.drinkingHabit} onChange={value => handleBuilderChange('drinkingHabit', value)}>
                  <option value="">{language === 'si' ? 'තෝරන්න' : 'Select'}</option>
                  <option value="Never">{language === 'si' ? 'කිසිවිටෙක නැත' : 'Never'}</option>
                  <option value="Occasionally">{language === 'si' ? 'වරින් වර' : 'Occasionally'}</option>
                  <option value="Socially">{language === 'si' ? 'සමාජයීය වශයෙන්' : 'Socially'}</option>
                  <option value="Regularly">{language === 'si' ? 'නිතිපතා' : 'Regularly'}</option>
                  <option value="Prefer not to say">{language === 'si' ? 'ප්‍රකාශ කිරීමට අකමැති' : 'Prefer not to say'}</option>
                </SelectField>

                <TextField label={language === 'si' ? 'විනෝදාංශ' : 'Hobbies'} value={builderData.hobbies} onChange={value => handleBuilderChange('hobbies', value)} placeholder={language === 'si' ? 'පොත් කියවීම, සංගීතය, සංචාරය' : 'Reading, music, travel'} />
                <TextField label={language === 'si' ? 'උනන්දුව දක්වන දේ' : 'Interests'} value={builderData.interests} onChange={value => handleBuilderChange('interests', value)} placeholder={language === 'si' ? 'ඉවුම් පිහුම්, ක්‍රීඩා, ස්වේච්ඡා වැඩ' : 'Cooking, sports, volunteering'} />
                <TextareaField label={language === 'si' ? 'පෞරුෂය / ගතිගුණ' : 'Personality / character'} value={builderData.personality} onChange={value => handleBuilderChange('personality', value)} placeholder={language === 'si' ? 'කාරුණික, සන්සුන්, පවුලට හිතැති, ස්වාධීන...' : 'Kind, calm, family-oriented, independent...'} />
              </BuilderSection>

              <BuilderSection title={language === 'si' ? 'කේන්දර විස්තර' : 'Horoscope details'}>
                <SelectField label={language === 'si' ? 'ලග්නය (ලෝක සම්මත)' : 'Astro / zodiac sign'} value={builderData.zodiacSign} onChange={value => handleBuilderChange('zodiacSign', value)}>
                  <option value="">{language === 'si' ? 'තෝරන්න' : 'Select'}</option>
                  {zodiacSigns.map(sign => <option key={sign} value={sign}>{language === 'si' ? (zodiacSignsSi[sign] || sign) : sign}</option>)}
                </SelectField>

                <SelectField label={language === 'si' ? 'ලග්නය (දේශීය)' : 'Lagna'} value={builderData.lagna} onChange={value => handleBuilderChange('lagna', value)}>
                  <option value="">{language === 'si' ? 'තෝරන්න' : 'Select'}</option>
                  {lagnaSigns.map(sign => <option key={sign} value={sign}>{language === 'si' ? (lagnaSignsSi[sign] || sign) : sign}</option>)}
                </SelectField>

                <SelectField label={language === 'si' ? 'නැකත' : 'Nakshatra'} value={builderData.nakshatra} onChange={value => handleBuilderChange('nakshatra', value)}>
                  <option value="">{language === 'si' ? 'තෝරන්න' : 'Select'}</option>
                  {nakshatras.map(nakshatra => <option key={nakshatra} value={nakshatra}>{language === 'si' ? (nakshatrasSi[nakshatra] || nakshatra) : nakshatra}</option>)}
                </SelectField>

                <SelectField label={language === 'si' ? 'කේන්දර සටහන' : 'Horoscope'} value={builderData.horoscopeAvailable} onChange={value => handleBuilderChange('horoscopeAvailable', value)}>
                  <option value="">{language === 'si' ? 'තෝරන්න' : 'Select'}</option>
                  <option value="Available">{language === 'si' ? 'තිබේ' : 'Available'}</option>
                  <option value="Can be shared on request">{language === 'si' ? 'ඉල්ලීම මත ලබා දිය හැක' : 'Can be shared on request'}</option>
                  <option value="Not required">{language === 'si' ? 'අවශ්‍ය නොවේ' : 'Not required'}</option>
                </SelectField>

                <SelectField label={language === 'si' ? 'කුජ දෝෂය' : 'Kuja dosha'} value={builderData.kujaDosha} onChange={value => handleBuilderChange('kujaDosha', value)}>
                  <option value="">{language === 'si' ? 'තෝරන්න' : 'Select'}</option>
                  <option value="Not present">{language === 'si' ? 'නොමැත' : 'Not present'}</option>
                  <option value="Present">{language === 'si' ? 'තිබේ' : 'Present'}</option>
                  <option value="Unknown">{language === 'si' ? 'නොදනී' : 'Unknown'}</option>
                </SelectField>
              </BuilderSection>

              <BuilderSection title={language === 'si' ? 'බලාපොරොත්තු වන සහකරු/සහකාරියගේ විස්තර' : 'Looking for'}>
                <TextField label={language === 'si' ? 'බලාපොරොත්තු වන වයස් සීමාව' : 'Preferred age range'} value={builderData.lookingForAge} onChange={value => handleBuilderChange('lookingForAge', value)} placeholder="28-35" />
                <TextField label={language === 'si' ? 'බලාපොරොත්තු වන අධ්‍යාපනය' : 'Preferred education'} value={builderData.lookingForEducation} onChange={value => handleBuilderChange('lookingForEducation', value)} placeholder={language === 'si' ? 'උපාධිධාරී හෝ වෘත්තීය මට්ටමේ සුදුසුකම් සහිත' : 'Graduate or professionally qualified'} />
                <TextField label={language === 'si' ? 'බලාපොරොත්තු වන රැකියාව' : 'Preferred job'} value={builderData.lookingForJob} onChange={value => handleBuilderChange('lookingForJob', value)} placeholder={language === 'si' ? 'ස්ථාවර රැකියාවක් සහිත' : 'Stable profession'} />
                <TextField label={language === 'si' ? 'බලාපොරොත්තු වන පදිංචි ප්‍රදේශය' : 'Preferred location'} value={builderData.lookingForLocation} onChange={value => handleBuilderChange('lookingForLocation', value)} placeholder={language === 'si' ? 'කොළඹ හෝ තදාසන්න ප්‍රදේශවලින්' : 'Colombo or suburbs'} />
                <TextareaField label={language === 'si' ? 'අපේක්ෂා කරන ගුණාංග' : 'Qualities expected'} value={builderData.qualities} onChange={value => handleBuilderChange('qualities', value)} placeholder={language === 'si' ? 'කාරුණික, උගත්, පවුලට හිතැති...' : 'Kind, educated, family-oriented, respectful...'} />
                <TextareaField label={language === 'si' ? 'වෙනත් සටහන්' : 'Extra notes'} value={builderData.notes} onChange={value => handleBuilderChange('notes', value)} placeholder={language === 'si' ? 'වෙනත් වැදගත් තොරතුරු...' : 'Any other important details...'} />
              </BuilderSection>
            </div>

            <div className="wedding-card p-6 lg:p-8 lg:sticky lg:top-28 self-start">
              <div className="mb-5">
                <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold">
                  {language === 'si' ? 'දැන්වීම් පෙරදසුන' : 'Advert preview'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {language === 'si' ? 'මෙය ස්වයංක්‍රීයව යාවත්කාලීන වේ. පළ කිරීමට පෙර සමාලෝචනය කර සංස්කරණය කරන්න.' : 'This updates automatically. Review and edit before posting.'}
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
                    <RefreshCw className="w-4 h-4" />
                    Regenerate Preview
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={saving}
                    className="flex-1 rounded-lg bg-amber-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-amber-700 dark:hover:bg-amber-600 flex items-center justify-center gap-2"
                  >
                    {saving ? 'Saving...' : (
                      <>
                        <Save className="w-4 h-4" />
                        Save as Draft
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={saving}
                    className="flex-1 wedding-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? 'Publishing...' : (
                      <>
                        <Send className="w-4 h-4" />
                        Publish
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
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
                <AdvertCard
                  key={advert.id}
                  advert={advert}
                  onDelete={() => handleDelete(advert.id)}
                  isAdmin={userProfile?.isAdmin}
                />
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
  isAdmin,
}: {
  advert: Advert
  onDelete: () => void
  isAdmin?: boolean
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
          title={isAdmin ? "Delete advert" : "Request deletion"}
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

      {!isAdmin && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-400">
            To delete this advert, please contact the administrator.
          </p>
        </div>
      )}
    </div>
  )
}
