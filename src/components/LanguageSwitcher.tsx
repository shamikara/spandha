'use client'

import { useState, useEffect } from 'react'

export type Locale = 'EN' | 'SI'

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>('EN')

  useEffect(() => {
    // Load locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && (savedLocale === 'EN' || savedLocale === 'SI')) {
      setLocale(savedLocale)
    }
  }, [])

  const toggleLanguage = () => {
    const newLocale: Locale = locale === 'EN' ? 'SI' : 'EN'
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('localeChange', { detail: newLocale }))
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {locale === 'EN' ? 'English' : 'සිංහල'}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {locale}
      </span>
    </button>
  )
}
