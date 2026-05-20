'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Users, TrendingUp, CreditCard, Crown, User as UserIcon } from 'lucide-react'

interface PremiumUser {
  id: string
  phone: string | null
  email: string | null
  isPremium: boolean
  createdAt: string
  profile: {
    firstName: string
    lastName: string
    avatar: string | null
  } | null
}

export default function AdminRevenuePage() {
  const [stats, setStats] = useState({ totalUsers: 0, premiumUsers: 0, conversionRate: '0%' })
  const [premiumUsers, setPremiumUsers] = useState<PremiumUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch('/api/admin/revenue'),
          fetch('/api/admin/users?filter=premium'),
        ])

        const statsData = await statsRes.json()
        const usersData = await usersRes.json()

        if (statsRes.ok) setStats(statsData.stats)
        if (usersRes.ok) setPremiumUsers(usersData.users || [])
      } catch (error) {
        console.error('Error fetching revenue data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const removePremium = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPremium: false }),
      })
      if (res.ok) {
        setPremiumUsers(prev => prev.filter(u => u.id !== userId))
        setStats(prev => ({
          ...prev,
          premiumUsers: prev.premiumUsers - 1,
          conversionRate: prev.totalUsers > 0 
            ? `${(((prev.premiumUsers - 1) / prev.totalUsers) * 100).toFixed(1)}%` 
            : '0%',
        }))
      }
    } catch (error) {
      console.error('Error removing premium:', error)
    }
  }

  const statCards = [
    { title: 'Total Revenue', value: '$0.00', subtitle: 'Payment gateway pending', icon: DollarSign, color: 'emerald' },
    { title: 'Premium Users', value: stats.premiumUsers.toString(), subtitle: `of ${stats.totalUsers} total`, icon: Crown, color: 'rose' },
    { title: 'Conversion Rate', value: stats.conversionRate, subtitle: 'Free → Premium', icon: TrendingUp, color: 'indigo' },
    { title: 'Avg Revenue/User', value: '$0.00', subtitle: 'Payment gateway pending', icon: CreditCard, color: 'blue' },
  ]

  const colors: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Revenue & Subscriptions</h1>
        <p className="text-slate-400 mt-1">Track platform revenue, manage premium subscriptions, and configure pricing.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full -mr-16 -mt-16 ${colors[card.color].split(' ')[1]}`} />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-medium text-slate-400">{card.title}</h3>
              <div className={`p-2 rounded-lg border ${colors[card.color]}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="relative z-10">
              <span className="text-3xl font-bold text-white tracking-tight">{card.value}</span>
              <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Subscribers Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-white">Premium Subscribers</h2>
            <p className="text-xs text-slate-500 mt-0.5">{premiumUsers.length} active premium members</p>
          </div>
          <Crown className="w-5 h-5 text-rose-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300">
              <tr>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Member Since</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                      <span>Loading subscribers...</span>
                    </div>
                  </td>
                </tr>
              ) : premiumUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                    No premium subscribers yet.
                  </td>
                </tr>
              ) : (
                premiumUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 overflow-hidden">
                          {user.profile?.avatar ? (
                            <img src={user.profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-rose-400" />
                          )}
                        </div>
                        <div className="font-medium text-slate-200">
                          {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Profile Incomplete'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        {user.phone && <span>{user.phone}</span>}
                        {user.email && <span>{user.email}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => removePremium(user.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                      >
                        Remove Premium
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Configuration Placeholder */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white mb-1">Pricing Configuration</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
              Payment gateway integration is required to enable real-time revenue tracking and automated subscription management. 
              Connect <strong className="text-slate-200">Stripe</strong> or <strong className="text-slate-200">PayHere</strong> to unlock:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Automated premium subscription billing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Real-time revenue dashboards and charts
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Configurable pricing tiers (Basic, Gold, Platinum)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Invoice generation and payment history
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
