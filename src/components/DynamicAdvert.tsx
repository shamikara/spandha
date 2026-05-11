'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Locale } from './LanguageSwitcher'

interface AdvertContent {
  title: string
  image: string
  link: string
}

export default function DynamicAdvert({ key }: { key: string }) {
  const [advert, setAdvert] = useState<AdvertContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [locale, setLocale] = useState<Locale>('EN')

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && (savedLocale === 'EN' || savedLocale === 'SI')) {
      setLocale(savedLocale)
    }
  }, [])

  useEffect(() => {
    fetchAdvert()
  }, [key, locale])

  useEffect(() => {
    const handleLocaleChange = (e: CustomEvent) => {
      setLocale(e.detail)
    }
    window.addEventListener('localeChange', handleLocaleChange as EventListener)
    return () => window.removeEventListener('localeChange', handleLocaleChange as EventListener)
  }, [])

  const fetchAdvert = async () => {
    try {
      const res = await fetch(`/api/content-blocks?key=${key}&locale=${locale}`)
      if (res.ok) {
        const data = await res.json()
        setAdvert(data.content)
      }
    } catch (error) {
      console.error('Error fetching advert:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !advert) return null

  return (
    <Link href={advert.link} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img
          src={advert.image}
          alt={advert.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">{advert.title}</h3>
        </div>
      </div>
    </Link>
  )
}
