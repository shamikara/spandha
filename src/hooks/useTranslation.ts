'use client'

import { useState, useEffect } from 'react'
import { Language, getTranslation, defaultLanguage } from '@/lib/translations'

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('spandha-language') as Language
    if (savedLanguage && ['en', 'si'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('spandha-language', newLanguage)
  }

  const t = (key: string): string => {
    return getTranslation(language, key)
  }

  return {
    language,
    changeLanguage,
    t,
  }
}
