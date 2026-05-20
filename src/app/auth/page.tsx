'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, CheckCircle, ShieldCheck } from 'lucide-react'

type Step = 'phone' | 'otp' | 'personal' | 'verification'

export default function AuthPage() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const { t, language, changeLanguage } = useTranslation()

  const inputClasses = "w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
  const labelClasses = "block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider"

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep('otp')
      } else {
        setError(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        // Proceed to personal details step (simulating a new user onboarding)
        setStep('personal')
      } else {
        setError(data.error || 'Invalid OTP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('verification')
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate upload delay and verification
    setTimeout(() => {
      router.push('/proposals')
    }, 1500)
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
                <div>
                  <label className={labelClasses}>
                    {t('auth.phone')}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('auth.phonePlaceholder')}
                    className={inputClasses}
                    required
                    pattern="^\+94\d{9}$"
                    title="Please enter a valid Sri Lankan phone number (+94 XX XXX XXXX)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !phone}
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
                    onClick={() => setStep('phone')}
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
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-white/5 rounded-xl border border-dashed border-white/20 group-hover:border-indigo-400/50 transition-colors" />
                    <div className="relative p-6 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5 text-slate-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">{t('auth.uploadFront')}</span>
                    </div>
                  </div>

                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-white/5 rounded-xl border border-dashed border-white/20 group-hover:border-indigo-400/50 transition-colors" />
                    <div className="relative p-6 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5 text-slate-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">{t('auth.uploadBack')}</span>
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
