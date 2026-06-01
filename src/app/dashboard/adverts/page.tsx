'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Advert {
  id: string
  title: string
  content: string
  isActive: boolean
  expiresAt: string | null
  createdAt: string
}

export default function DashboardAdvertsPage() {
  const [adverts, setAdverts] = useState<Advert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadAdverts = async () => {
    try {
      const response = await fetch('/api/adverts?limit=50')
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to load adverts')
      setAdverts(data.adverts || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load adverts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdverts()
  }, [])

  const updateAdvert = async (advert: Advert, isActive: boolean) => {
    setError('')
    setSuccess('')
    const response = await fetch(`/api/adverts/${advert.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    })
    const data = await response.json()
    if (response.ok) {
      setSuccess(data.message)
      loadAdverts()
    } else {
      setError(data.error || 'Failed to update advert')
    }
  }

  const deleteAdvert = async (advert: Advert) => {
    if (!confirm('Delete this advert?')) return
    setError('')
    setSuccess('')
    const response = await fetch(`/api/adverts/${advert.id}`, { method: 'DELETE' })
    const data = await response.json()
    if (response.ok) {
      setSuccess(data.message)
      loadAdverts()
    } else {
      setError(data.error || 'Failed to delete advert')
    }
  }

  if (loading) return <div className="wedding-card p-8 text-center">Loading adverts...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Adverts</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Pause, activate, or delete your posted adverts.</p>
        </div>
        <Link href="/post" className="wedding-button">Post new advert</Link>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</div>}
      {success && <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300">{success}</div>}

      <div className="grid gap-4">
        {adverts.length === 0 ? (
          <div className="wedding-card p-8 text-center">
            <p className="mb-4 text-gray-500 dark:text-gray-400">You have not posted any adverts yet.</p>
            <Link href="/post" className="wedding-button">Create your first advert</Link>
          </div>
        ) : adverts.map(advert => {
          const expired = advert.expiresAt ? new Date(advert.expiresAt) < new Date() : false
          return (
            <div key={advert.id} className="wedding-card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{advert.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{advert.content}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>Posted {new Date(advert.createdAt).toLocaleDateString()}</span>
                    {advert.expiresAt && <span>Expires {new Date(advert.expiresAt).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    advert.isActive && !expired
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {expired ? 'Expired' : advert.isActive ? 'Active' : 'Paused'}
                  </span>
                  {!expired && (
                    <button onClick={() => updateAdvert(advert, !advert.isActive)} className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                      {advert.isActive ? 'Pause' : 'Activate'}
                    </button>
                  )}
                  <button onClick={() => deleteAdvert(advert)} className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
