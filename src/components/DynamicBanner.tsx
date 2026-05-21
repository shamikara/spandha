'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Locale } from './LanguageSwitcher'

interface BannerContent {
  imageUrl: string
  link: string
  text: string
}

export default function DynamicBanner({ key }: { key: string }) {
  const [banner, setBanner] = useState<BannerContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [locale, setLocale] = useState<Locale>('EN')

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && (savedLocale === 'EN' || savedLocale === 'SI')) {
      setLocale(savedLocale)
    }
  }, [])

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`/api/content-blocks?key=${key}&locale=${locale}`)
        if (res.ok) {
          const data = await res.json()
          setBanner(data.content)
        }
      } catch (error) {
        console.error('Error fetching banner:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanner()
  }, [key, locale])

  useEffect(() => {
    const handleLocaleChange = (e: CustomEvent) => {
      setLocale(e.detail)
    }
    window.addEventListener('localeChange', handleLocaleChange as EventListener)
    return () => window.removeEventListener('localeChange', handleLocaleChange as EventListener)
  }, [])

  if (loading || !banner) return null

  return (
    <Link href={banner.link} className="block w-full">
      <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg">
        <Image
          src={banner.imageUrl}
          alt={banner.text}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <p className="text-white text-2xl font-semibold text-center px-4">{banner.text}</p>
        </div>
      </div>
    </Link>
  )
}
