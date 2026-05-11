'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { useTheme } from '@/hooks/useTheme'

export default function AuthPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const router = useRouter()
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(t('auth.otpSent'))
        if (process.env.NODE_ENV === 'development' && data.otp) {
          setSuccess(`${t('auth.otpSent')} Development OTP: ${data.otp}`)
        }
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
        setSuccess(t('auth.loginSuccess'))
        setTimeout(() => {
          router.push('/proposals')
        }, 1000)
      } else {
        setError(data.error || 'Invalid OTP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-wedding-cream dark:bg-wedding-dark">
      <div className="max-w-md w-full">
        <div className="wedding-card p-8">
          {/* Logo/Branding */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-2">
              Spandha
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 'phone' ? t('auth.login') : t('auth.verifyOtp')}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-sm">
              {success}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.phone')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('auth.phonePlaceholder')}
                  className="wedding-input w-full"
                  required
                  pattern="^\+94\d{9}$"
                  title="Please enter a valid Sri Lankan phone number (+94 XX XXX XXXX)"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !phone}
                className="wedding-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('common.loading') : t('auth.sendOtp')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.otp')}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder={t('auth.otpPlaceholder')}
                  className="wedding-input w-full text-center text-2xl tracking-widest"
                  required
                  maxLength={6}
                  pattern="\d{6}"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('common.back')}
                </button>
                
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex-1 wedding-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('common.loading') : t('auth.verifyOtp')}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              {step === 'phone' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-wedding-maroon dark:text-wedding-gold hover:underline"
                  >
                    {t('auth.register')}
                  </button>
                </>
              ) : (
                <>
                  Didn&apos;t receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="text-wedding-maroon dark:text-wedding-gold hover:underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
