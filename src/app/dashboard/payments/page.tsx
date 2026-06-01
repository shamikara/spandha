'use client'

import { useEffect, useState } from 'react'

interface DashboardData {
  payments: {
    isPremium: boolean
    history: unknown[]
  }
}

export default function DashboardPaymentsPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(response => response.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="wedding-card p-8 text-center">Loading payments...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Track premium status, receipts, and renewals.</p>
      </div>

      <div className="wedding-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Premium status</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {data?.payments.isPremium ? 'Your premium membership is active.' : 'You are currently on the free plan.'}
        </p>
        {!data?.payments.isPremium && (
          <button className="mt-5 wedding-button" type="button">
            Upgrade to premium
          </button>
        )}
      </div>

      <div className="wedding-card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment history</h2>
        <div className="mt-4 rounded-md border border-dashed border-gray-300 p-6 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
          No payment records yet. Receipts will appear here after payment integration is connected.
        </div>
      </div>
    </div>
  )
}
