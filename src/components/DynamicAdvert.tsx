'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

    fetchAdvert()
  }, [key, locale])

  useEffect(() => {
    const handleLocaleChange = (e: CustomEvent) => {
      setLocale(e.detail)
    }
    window.addEventListener('localeChange', handleLocaleChange as EventListener)
    return () => window.removeEventListener('localeChange', handleLocaleChange as EventListener)
  }, [])

  if (loading || !advert) return null

  return (
    <Link href={advert.link} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full">
        <Image
          src={advert.image}
          alt={advert.title}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">{advert.title}</h3>
        </div>
      </div>
    </Link>
  )
}
