'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CheckCircle, ShieldCheck } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'
import { supabase } from '@/lib/supabase'

type Step = 'phone' | 'otp' | 'personal' | 'verification'
type AuthMode = 'login' | 'register'

export default function AuthPage() {
  const [step, setStep] = useState<Step>('phone')
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [dob, setDob] = useState('')
  const [location, setLocation] = useState('')
  const [nicFront, setNicFront] = useState<File | null>(null)
  const [nicBack, setNicBack] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const { t, language, changeLanguage } = useTranslation()
  const toast = useToast()

  const inputClasses = "w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
  const labelClasses = "block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider"
  const loginIdentifier = identifier.trim()

  const otpSentMessage = (sentTo: Array<'sms' | 'email'>) => {
    if (sentTo.includes('sms') && sentTo.includes('email')) return t('auth.otpSentSmsAndEmail')
    if (sentTo.includes('email')) return t('auth.otpSentEmail')
    if (sentTo.includes('sms')) return t('auth.otpSentSms')
    return t('auth.otpSent')
  }

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const validateFileSize = (file: File): boolean => {
    const maxSize = 500 * 1024 // 500KB
    return file.size <= maxSize
  }

  const sendOtp = async () => {
    setLoading(true)
    setError('')
    setOtp('')

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(otpSentMessage(data.sentTo || []), t('common.success'))
        setStep('otp')
      } else {
        const message = data.error || 'Failed to send OTP'
        setError(message)
        toast.danger(message, t('common.error'))
      }
    } catch (error) {
      const message = 'Network error. Please try again.'
      setError(message)
      toast.warning(message, t('common.warning'))
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendOtp()
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(t('auth.loginSuccess'), t('common.success'))

        // Check if user has existing profile
        const sessionResponse = await fetch('/api/auth/session')
        const sessionData = await sessionResponse.json()

        if (sessionData.isAuthenticated && sessionData.user.profile) {
          // User has existing profile, redirect based on role
          if (sessionData.user.isAdmin) {
            router.push('/admin/users')
          } else {
            router.push('/dashboard')
          }
        } else {
          // New user or no profile, proceed to registration
          setAuthMode('register')
          setStep('personal')
        }
      } else {
        const message = data.error || t('auth.invalidOtp')
        setError(message)
        toast.danger(message, t('common.error'))
      }
    } catch (error) {
      const message = 'Network error. Please try again.'
      setError(message)
      toast.warning(message, t('common.warning'))
    } finally {
      setLoading(false)
    }
  }

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate age (18+)
    if (!dob) {
      setError('Date of birth is required')
      toast.danger('Date of birth is required', t('common.error'))
      return
    }

    const age = calculateAge(dob)
    if (age < 18) {
      setError('You must be at least 18 years old to use this platform')
      toast.danger('You must be at least 18 years old to use this platform', t('common.error'))
      return
    }

    setStep('verification')
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate file sizes if files are selected
      if (nicFront && !validateFileSize(nicFront)) {
        setError('NIC front image must be less than 500KB')
        toast.danger('NIC front image must be less than 500KB', t('common.error'))
        setLoading(false)
        return
      }

      if (nicBack && !validateFileSize(nicBack)) {
        setError('NIC back image must be less than 500KB')
        toast.danger('NIC back image must be less than 500KB', t('common.error'))
        setLoading(false)
        return
      }

      // Upload files to Supabase if provided
      let nicFrontUrl: string | null = null
      let nicBackUrl: string | null = null

      if (nicFront) {
        const fileName = `nic-front-${Date.now()}-${nicFront.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('nic-documents')
          .upload(fileName, nicFront)

        if (uploadError) {
          throw new Error('Failed to upload NIC front image')
        }

        const { data: { publicUrl } } = supabase.storage
          .from('nic-documents')
          .getPublicUrl(fileName)

        nicFrontUrl = publicUrl
      }

      if (nicBack) {
        const fileName = `nic-back-${Date.now()}-${nicBack.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('nic-documents')
          .upload(fileName, nicBack)

        if (uploadError) {
          throw new Error('Failed to upload NIC back image')
        }

        const { data: { publicUrl } } = supabase.storage
          .from('nic-documents')
          .getPublicUrl(fileName)

        nicBackUrl = publicUrl
      }

      // Calculate age from DOB
      const age = calculateAge(dob)

      // Create profile
      const profileResponse = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          age,
          gender,
          location,
          nicFront: nicFrontUrl,
          nicBack: nicBackUrl,
        }),
      })

      const profileData = await profileResponse.json()

      if (profileResponse.ok) {
        toast.success('Profile created successfully', t('common.success'))
        router.push('/dashboard')
      } else {
        throw new Error(profileData.error || 'Failed to create profile')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete registration'
      setError(message)
      toast.danger(message, t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleSkipVerification = async () => {
    setLoading(true)
    setError('')

    try {
      // Calculate age from DOB
      const age = calculateAge(dob)

      // Create profile without NIC
      const profileResponse = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          age,
          gender,
          location,
          nicFront: null,
          nicBack: null,
        }),
      })

      const profileData = await profileResponse.json()

      if (profileResponse.ok) {
        toast.success('Profile created successfully. You can upload NIC later.', t('common.success'))
        router.push('/dashboard')
      } else {
        throw new Error(profileData.error || 'Failed to create profile')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete registration'
      setError(message)
      toast.danger(message, t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50 flex gap-2">
        <button 
          onClick={() => changeLanguage('en')}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all border ${language === 'en' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'}`}
        >
          EN
        </button>
        <button 
          onClick={() => changeLanguage('si')}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all border ${language === 'si' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-transparent border-white/10 text-slate-400 hover:text-slate-200'}`}
        >
          සිංහල
        </button>
      </div>

      <div className="max-w-md w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-100 mb-2">
              Spandha
            </h1>
            <p className="text-slate-400 text-sm">
              {step === 'phone' && t('home.subtitle')}
              {step === 'otp' && t('auth.verifyOtp')}
              {step === 'personal' && t('auth.personalInfo')}
              {step === 'verification' && t('auth.verificationTitle')}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSendOtp}
                className="space-y-6"
              >
                {/* Login / Register Tabs */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      authMode === 'login'
                        ? 'bg-indigo-600/90 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      authMode === 'register'
                        ? 'bg-indigo-600/90 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Register
                  </button>
                </div>

                <div>
                  <label className={labelClasses}>
                    {t('auth.emailOrPhone')}
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t('auth.emailOrPhonePlaceholder')}
                    className={inputClasses}
                    required
                    title="Enter your email address or Sri Lankan phone number (+94 XX XXX XXXX)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !loginIdentifier}
                  className="w-full bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-500/50 font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50"
                >
                  {loading ? t('common.loading') : t('auth.sendOtp')}
                </button>
              </motion.form>
            )}

            {step === 'otp' && (
              <motion.form 
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp} 
                className="space-y-6"
              >
                <div className="rounded-xl bg-white/5 border border-white/5 px-4 py-3 text-sm text-slate-400">
                  {t('auth.otpSentTo')} <span className="text-slate-200">{loginIdentifier}</span>
                </div>

                <div>
                  <label className={labelClasses}>
                    {t('auth.otp')}
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder={t('auth.otpPlaceholder')}
                    className={`${inputClasses} text-center text-2xl tracking-[0.5em] font-light py-4`}
                    required
                    maxLength={6}
                    pattern="\d{6}"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOtp('')
                      setStep('phone')
                    }}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium py-3 px-4 rounded-xl transition-all border border-white/5"
                  >
                    {t('common.back')}
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="flex-[2] bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)] border border-indigo-500/50 font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? t('common.loading') : t('auth.verifyOtp')}
                  </button>
                </div>

                <div className="text-center text-sm text-slate-500">
                  {t('auth.notReceivedOtp')}{' '}
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loading}
                    className="font-medium text-indigo-300 hover:text-indigo-200 disabled:opacity-50"
                  >
                    {t('auth.resendCode')}
                  </button>
                </div>
              </motion.form>
            )}

            {step === 'personal' && (
              <motion.form
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handlePersonalSubmit}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>{t('profile.firstName')}</label>
                    <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>{t('profile.lastName')}</label>
                    <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className={inputClasses} />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>{t('profile.gender')}</label>
                  <select required value={gender} onChange={e => setGender(e.target.value)} className={inputClasses}>
                    <option value="" className="bg-zinc-900">{t('common.select')}</option>
                    <option value="male" className="bg-zinc-900">{t('profile.male')}</option>
                    <option value="female" className="bg-zinc-900">{t('profile.female')}</option>
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>{t('auth.dateOfBirth')}</label>
                  <input type="date" required value={dob} onChange={e => setDob(e.target.value)} className={`${inputClasses} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert`} />
                </div>

                <div>
                  <label className={labelClasses}>{t('profile.location')}</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder={language === 'si' ? 'උදා: කොළඹ, මහනුවර, ගාල්ල' : 'e.g., Colombo, Kandy, Galle'}
                    className={inputClasses}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-500/50 font-medium py-3 px-4 rounded-xl transition-all"
                >
                  {t('common.next')}
                </button>
              </motion.form>
            )}

            {step === 'verification' && (
              <motion.form
                key="verification"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerificationSubmit}
                className="space-y-6"
              >
                <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
                  <ShieldCheck className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-indigo-200/80 leading-relaxed">
                    {t('auth.nicDescription')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (!validateFileSize(file)) {
                            setError('File must be less than 500KB')
                            toast.danger('File must be less than 500KB', t('common.error'))
                            return
                          }
                          setNicFront(file)
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-white/5 rounded-xl border border-dashed border-white/20 group-hover:border-indigo-400/50 transition-colors" />
                    <div className="relative p-6 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5 text-slate-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        {nicFront ? nicFront.name : t('auth.uploadFront')}
                      </span>
                      <span className="text-xs text-slate-500">Max 500KB</span>
                    </div>
                  </div>

                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (!validateFileSize(file)) {
                            setError('File must be less than 500KB')
                            toast.danger('File must be less than 500KB', t('common.error'))
                            return
                          }
                          setNicBack(file)
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-white/5 rounded-xl border border-dashed border-white/20 group-hover:border-indigo-400/50 transition-colors" />
                    <div className="relative p-6 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5 text-slate-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        {nicBack ? nicBack.name : t('auth.uploadBack')}
                      </span>
                      <span className="text-xs text-slate-500">Max 500KB</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('personal')}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium py-3 px-4 rounded-xl transition-all border border-white/5"
                  >
                    {t('common.back')}
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipVerification}
                    disabled={loading}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium py-3 px-4 rounded-xl transition-all border border-white/5"
                  >
                    Skip for now
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)] border border-indigo-500/50 font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {t('common.confirm')}
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
