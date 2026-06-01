'use client'

import { useEffect, useState } from 'react'

interface DashboardData {
  user: {
    phone: string | null
    email: string | null
    isVerified: boolean
  }
}

export default function DashboardSettingsPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(response => response.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="wedding-card p-8 text-center">Loading settings...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Manage account contact details and notification preferences.</p>
      </div>

      <div className="wedding-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <SettingDetail label="Phone" value={data?.user.phone || 'Not added'} />
          <SettingDetail label="Email" value={data?.user.email || 'Not added'} />
          <SettingDetail label="Verification" value={data?.user.isVerified ? 'Verified' : 'Pending'} />
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Contact changes should be re-verified with OTP. That edit flow can be added here once account recovery rules are finalized.
        </p>
      </div>

      <div className="wedding-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification preferences</h2>
        <div className="mt-4 space-y-3">
          <Preference label="Email notification details" checked />
          <Preference label="SMS notification nudges" checked />
          <Preference label="Payment and premium alerts" checked />
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Preferences are shown here as the product default. Persisted preference toggles can be backed by the next settings table.
        </p>
      </div>
    </div>
  )
}

function SettingDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}

function Preference({ label, checked }: { label: string; checked: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-md bg-gray-50 p-4 dark:bg-gray-800">
      <span className="font-medium text-gray-900 dark:text-white">{label}</span>
      <input type="checkbox" checked={checked} readOnly className="h-4 w-4 accent-wedding-maroon" />
    </label>
  )
}
