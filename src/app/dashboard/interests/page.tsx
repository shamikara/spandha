'use client'

import { useEffect, useState } from 'react'

interface Profile {
  firstName: string
  lastName: string
  age: number
  location: string
  job?: string | null
}

interface Interest {
  id: string
  status: string
  createdAt: string
  fromUser?: { profile: Profile | null }
  toUser?: { profile: Profile | null }
}

export default function DashboardInterestsPage() {
  const [sent, setSent] = useState<Interest[]>([])
  const [received, setReceived] = useState<Interest[]>([])
  const [tab, setTab] = useState<'received' | 'sent'>('received')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadInterests = async () => {
    try {
      const response = await fetch('/api/interests')
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to load interests')
      setSent(data.sent || [])
      setReceived(data.received || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load interests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInterests()
  }, [])

  const updateInterest = async (interestId: string, status: 'accepted' | 'rejected') => {
    setError('')
    setSuccess('')
    const response = await fetch('/api/interests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interestId, status }),
    })
    const data = await response.json()
    if (response.ok) {
      setSuccess(data.message)
      loadInterests()
    } else {
      setError(data.error || 'Failed to update interest')
    }
  }

  if (loading) return <div className="wedding-card p-8 text-center">Loading interests...</div>

  const list = tab === 'received' ? received : sent

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Interests</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Manage proposals you sent and interests you received.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</div>}
      {success && <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300">{success}</div>}

      <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
        <button onClick={() => setTab('received')} className={`rounded-md px-4 py-2 text-sm font-medium ${tab === 'received' ? 'bg-wedding-maroon text-white dark:bg-wedding-gold dark:text-wedding-dark' : 'text-gray-600 dark:text-gray-300'}`}>
          Received ({received.length})
        </button>
        <button onClick={() => setTab('sent')} className={`rounded-md px-4 py-2 text-sm font-medium ${tab === 'sent' ? 'bg-wedding-maroon text-white dark:bg-wedding-gold dark:text-wedding-dark' : 'text-gray-600 dark:text-gray-300'}`}>
          Sent ({sent.length})
        </button>
      </div>

      <div className="grid gap-4">
        {list.length === 0 ? (
          <div className="wedding-card p-8 text-center text-gray-500 dark:text-gray-400">No {tab} interests yet.</div>
        ) : list.map(interest => {
          const profile = tab === 'received' ? interest.fromUser?.profile : interest.toUser?.profile
          return (
            <div key={interest.id} className="wedding-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile ? `${profile.firstName} ${profile.lastName}` : 'Member'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {[profile?.age && `${profile.age} years`, profile?.location, profile?.job].filter(Boolean).join(' | ') || 'Profile details unavailable'}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">Sent {new Date(interest.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(interest.status)}`}>
                    {interest.status}
                  </span>
                  {tab === 'received' && interest.status === 'PENDING' && (
                    <>
                      <button onClick={() => updateInterest(interest.id, 'accepted')} className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700">Accept</button>
                      <button onClick={() => updateInterest(interest.id, 'rejected')} className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">Reject</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function statusClass(status: string) {
  if (status === 'ACCEPTED') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  if (status === 'REJECTED') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
}
