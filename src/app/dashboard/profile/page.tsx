'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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

export default function DashboardProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/profile')
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Profile not found')
        return data.profile
      })
      .then(setProfile)
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
        <Link href="/profile" className="wedding-button">{profile ? 'Edit profile' : 'Create profile'}</Link>
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
