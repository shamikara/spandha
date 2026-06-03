'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface PremiumAdvert {
  id: string
  title: string
  content: string
  user: {
    profile: {
      firstName: string
      lastName: string
      avatar?: string
      age: number
      location: string
    }
  }
}

export default function PremiumAdverts() {
  const [adverts, setAdverts] = useState<PremiumAdvert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPremiumAdverts = async () => {
      try {
        const response = await fetch('/api/premium-adverts?limit=8')
        if (response.ok) {
          const data = await response.json()
          setAdverts(data.adverts || [])
        } else {
          const data = await response.json()
          setError(data.error || 'Failed to fetch adverts')
        }
      } catch (error) {
        console.error('Error fetching premium adverts:', error)
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPremiumAdverts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-wedding-cream dark:bg-wedding-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              Premium Adverts
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="wedding-card p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-wedding-cream dark:bg-wedding-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              Premium Adverts
            </h2>
          </div>
          <div className="wedding-card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (adverts.length === 0) {
    return (
      <section className="py-16 bg-wedding-cream dark:bg-wedding-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              Premium Adverts
            </h2>
          </div>
          <div className="wedding-card p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No premium adverts available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-wedding-cream dark:bg-wedding-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
            Premium Adverts
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Featured adverts from premium verified members
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adverts.map((advert) => (
            <Link
              key={advert.id}
              href={`/proposals/${advert.user.profile.firstName}-${advert.user.profile.lastName}`}
              className="wedding-card p-6 text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="relative w-20 h-20 mx-auto mb-4">
                {advert.user.profile.avatar ? (
                  <Image
                    src={advert.user.profile.avatar}
                    alt={`${advert.user.profile.firstName} ${advert.user.profile.lastName}`}
                    fill
                    className="rounded-full object-cover border-4 border-wedding-gold"
                  />
                ) : (
                  <div className="w-full h-full bg-wedding-gold rounded-full flex items-center justify-center text-wedding-maroon font-bold text-2xl border-4 border-wedding-gold">
                    {advert.user.profile.firstName[0]}{advert.user.profile.lastName[0]}
                  </div>
                )}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  Premium
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {advert.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {advert.content}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {advert.user.profile.firstName} {advert.user.profile.lastName} • {advert.user.profile.age} yrs, {advert.user.profile.location}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
