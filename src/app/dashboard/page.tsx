'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, CheckCircle, Heart, Megaphone, ShieldCheck, User } from 'lucide-react'

interface DashboardData {
  user: {
    phone: string | null
    email: string | null
    isVerified: boolean
    isNicVerified: boolean
    isPremium: boolean
    profile: {
      firstName: string
      lastName: string
      location: string
      isActive: boolean
    } | null
  }
  stats: {
    profileCompletion: number
    sentInterests: number
    receivedInterests: number
    pendingReceivedInterests: number
    adverts: number
    activeAdverts: number
    unreadNotifications: number
  }
  notifications: Array<{
    id: string
    title: string
    message: string
    isRead: boolean
    createdAt: string
    link: string | null
  }>
  payments: {
    isPremium: boolean
    history: unknown[]
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/dashboard')
      .then(async response => {
        if (!response.ok) throw new Error((await response.json()).error || 'Failed to load dashboard')
        return response.json()
      })
      .then(setData)
      .catch(error => setError(error.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="wedding-card p-8 text-center text-gray-600 dark:text-gray-300">Loading dashboard...</div>
  }

  if (error || !data) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300">{error || 'Dashboard unavailable'}</div>
  }

  const name = data.user.profile ? `${data.user.profile.firstName} ${data.user.profile.lastName}` : 'Welcome'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg bg-wedding-maroon p-6 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-gray-900">
        <div>
          <p className="text-sm text-white/70">Your Spandha panel</p>
          <h1 className="mt-1 text-3xl font-bold">{name}</h1>
          <p className="mt-2 text-sm text-white/80">{data.user.email || data.user.phone}</p>
        </div>
        <Link href="/dashboard/profile" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-wedding-maroon transition-colors hover:bg-wedding-cream">
          Manage profile
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={User} label="Profile completion" value={`${data.stats.profileCompletion}%`} />
        <StatCard icon={Heart} label="Pending received" value={data.stats.pendingReceivedInterests.toString()} />
        <StatCard icon={Megaphone} label="Active adverts" value={`${data.stats.activeAdverts}/${data.stats.adverts}`} />
        <StatCard icon={Bell} label="Unread alerts" value={data.stats.unreadNotifications.toString()} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="wedding-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Account status</h2>
          <div className="space-y-3">
            <StatusRow icon={CheckCircle} label="Login (OTP)" value={data.user.isVerified ? 'Signed in' : 'Not signed in'} ok={data.user.isVerified} />
            <StatusRow icon={ShieldCheck} label="Identity (NIC)" value={data.user.isNicVerified ? 'Verified by admin' : 'Pending admin review'} ok={data.user.isNicVerified} />
            <StatusRow icon={CheckCircle} label="Profile visibility" value={data.user.profile?.isActive ? 'Active' : 'Not active'} ok={Boolean(data.user.profile?.isActive)} />
            <StatusRow icon={CheckCircle} label="Premium" value={data.user.isPremium ? 'Active' : 'Free plan'} ok={data.user.isPremium} />
          </div>
        </div>

        <div className="wedding-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent notifications</h2>
            <Link href="/dashboard/notifications" className="text-sm font-medium text-wedding-maroon hover:underline dark:text-wedding-gold">View all</Link>
          </div>
          <div className="space-y-3">
            {data.notifications.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet.</p>
            ) : data.notifications.map(notification => (
              <Link key={notification.id} href={notification.link || '/dashboard/notifications'} className="block rounded-md border border-gray-100 p-3 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <p className="font-medium text-gray-900 dark:text-white">{notification.title}</p>
                <p className="mt-1 line-clamp-2 text-gray-600 dark:text-gray-400">{notification.message}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="wedding-card p-5">
      <Icon className="mb-4 h-5 w-5 text-wedding-maroon dark:text-wedding-gold" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}

function StatusRow({ icon: Icon, label, value, ok }: { icon: any; label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-gray-50 p-3 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${ok ? 'text-green-600' : 'text-yellow-600'}`} />
        <span className="font-medium text-gray-900 dark:text-white">{label}</span>
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-300">{value}</span>
    </div>
  )
}
