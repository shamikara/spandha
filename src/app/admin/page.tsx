'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Users, CreditCard, Activity, TrendingUp, User as UserIcon } from 'lucide-react'

interface RecentUser {
  id: string
  phone: string | null
  email: string | null
  createdAt: string
  profile: {
    firstName: string
    lastName: string
    avatar: string | null
  } | null
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ totalUsers: 0, premiumUsers: 0, totalProposals: 0 })
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/users?limit=6'),
        ])

        const statsData = await statsRes.json()
        const usersData = await usersRes.json()

        if (statsRes.ok) setStats(statsData.stats)
        if (usersRes.ok) setRecentUsers(usersData.users || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Welcome back. Here&apos;s what&apos;s happening on Spandha today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers.toString()} change="Registered users" icon={Users} color="indigo" />
        <StatCard title="Premium Users" value={stats.premiumUsers.toString()} change="Active subscriptions" icon={CreditCard} color="emerald" />
        <StatCard title="Total Proposals" value={stats.totalProposals.toString()} change="User profiles" icon={Activity} color="rose" />
        <StatCard title="Monthly Revenue" value="$0.00" change="Payment gateway pending" icon={TrendingUp} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Revenue Overview</h2>
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
             <TrendingUp className="w-8 h-8 mb-2 opacity-20" />
             <p className="text-sm">Revenue charts will appear here</p>
             <p className="text-xs opacity-60">Requires Stripe / Payment Integration</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Recent Registrations</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-slate-500 py-8">Loading...</div>
            ) : recentUsers.length === 0 ? (
              <div className="text-center text-slate-500 py-8">No recent registrations</div>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors cursor-default">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center overflow-hidden">
                    {user.profile?.avatar ? (
                      <Image src={user.profile.avatar} alt="avatar" width={40} height={40} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Profile Incomplete'}
                    </p>
                    <p className="text-xs text-slate-400">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
  const colors: Record<string, string> = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  }

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full -mr-16 -mt-16 ${colors[color].split(' ')[1]}`} />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className={`p-2 rounded-lg border ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2 relative z-10">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
      </div>
      <p className="mt-2 text-xs font-medium text-emerald-400 relative z-10">{change}</p>
    </div>
  )
}
