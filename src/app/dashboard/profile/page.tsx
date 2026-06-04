'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Edit } from 'lucide-react'

interface ProfileData {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: string
  location: string
  job?: string | null
  education?: string | null
  description?: string | null
  avatar?: string | null
  isActive: boolean
  user?: {
    phone: string | null
    email?: string | null
    isVerified: boolean
    isNicVerified: boolean
  }
}

interface Advert {
  id: string
  title: string
  content: string
  isPublished: boolean
  isActive: boolean
  expiresAt: string | null
  createdAt: string
}

export default function DashboardProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [adverts, setAdverts] = useState<Advert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/profile'),
      fetch('/api/adverts?limit=3')
    ])
      .then(async ([profileRes, advertsRes]) => {
        const profileData = await profileRes.json()
        const advertsData = await advertsRes.json()
        
        if (!profileRes.ok) throw new Error(profileData.error || 'Profile not found')
        
        setProfile(profileData.profile)
        setAdverts(advertsData.adverts || [])
      })
      .catch(error => setError(error.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="wedding-card p-8 text-center">Loading profile...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Review your public profile and edit the details shown to other members.</p>
        </div>
        <Link href="/profile" className="wedding-button flex items-center gap-2">
          {profile ? (
            <>
              <Edit className="w-4 h-4" />
              Edit profile
            </>
          ) : (
            'Create profile'
          )}
        </Link>
      </div>

      {error ? (
        <div className="wedding-card p-8 text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-300">{error}</p>
          <Link href="/profile" className="wedding-button">Create profile</Link>
        </div>
      ) : profile && (
        <div className="wedding-card p-6">
          <div className="mb-6 flex items-center gap-4">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="h-16 w-16 rounded-full object-cover border-2 border-wedding-gold"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-wedding-gold text-xl font-bold text-wedding-maroon">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{profile.firstName} {profile.lastName}</h2>
              <p className="text-gray-600 dark:text-gray-400">{profile.age} years, {profile.location}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Detail label="Status" value={profile.isActive ? 'Active' : 'Hidden'} />
            <Detail label="Gender" value={profile.gender} />
            <Detail label="Job" value={profile.job || 'Not added'} />
            <Detail label="Education" value={profile.education || 'Not added'} />
            <Detail label="Phone" value={profile.user?.phone || 'Not added'} />
            <Detail label="Verification" value={profile.user?.isNicVerified ? 'Verified' : 'Pending'} />
          </div>

          <div className="mt-6">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">About</h3>
            <p className="text-gray-600 dark:text-gray-300">{profile.description || 'No description added yet.'}</p>
          </div>
        </div>
      )}

      {adverts.length > 0 && (
        <div className="wedding-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Adverts</h2>
            <Link href="/dashboard/adverts" className="text-sm text-wedding-maroon hover:underline dark:text-wedding-gold">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {adverts.map(advert => (
              <div key={advert.id} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{advert.title}</h3>
                      {!advert.isPublished && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{advert.content}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      Posted {new Date(advert.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      advert.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {advert.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adverts.length === 0 && !loading && (
        <div className="wedding-card p-8 text-center">
          <p className="mb-4 text-gray-500 dark:text-gray-400">You haven&apos;t created any adverts yet.</p>
          <Link href="/post" className="wedding-button">Create your first advert</Link>
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}
