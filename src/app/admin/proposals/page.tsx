'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, EyeOff, MapPin, Briefcase, GraduationCap, User as UserIcon } from 'lucide-react'

interface ProposalProfile {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: string
  location: string
  job: string | null
  education: string | null
  avatar: string | null
  isActive: boolean
  createdAt: string
  user: {
    id: string
    phone: string | null
    email: string | null
    isVerified: boolean
    isPremium: boolean
    createdAt: string
  }
}

export default function AdminProposalsPage() {
  const [profiles, setProfiles] = useState<ProposalProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filter !== 'all') params.append('filter', filter)

      const res = await fetch(`/api/admin/proposals?${params}`)
      const data = await res.json()
      if (res.ok) setProfiles(data.profiles || [])
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => fetchProfiles(), 300)
    return () => clearTimeout(debounce)
  }, [search, filter])

  const toggleActive = async (profileId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/proposals/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      if (res.ok) fetchProfiles()
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  const activeCount = profiles.filter(p => p.isActive).length
  const inactiveCount = profiles.filter(p => !p.isActive).length

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Proposal Management</h1>
        <p className="text-slate-400 mt-1">Review, approve, and moderate all user proposals on the platform.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{profiles.length}</p>
            <p className="text-xs text-slate-400">Total Proposals</p>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{activeCount}</p>
            <p className="text-xs text-slate-400">Active</p>
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{inactiveCount}</p>
            <p className="text-xs text-slate-400">Inactive</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="py-2.5 px-4 bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="all" className="bg-zinc-900">All Proposals</option>
          <option value="active" className="bg-zinc-900">Active Only</option>
          <option value="inactive" className="bg-zinc-900">Inactive Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300">
              <tr>
                <th className="px-6 py-4 font-medium">Profile</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Career</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                      <span>Loading proposals...</span>
                    </div>
                  </td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    No proposals found matching your criteria.
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20 overflow-hidden flex-shrink-0">
                          {profile.avatar ? (
                            <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-medium text-indigo-300">
                              {profile.firstName[0]}{profile.lastName[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-200">
                            {profile.firstName} {profile.lastName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {profile.user?.phone || profile.user?.email || 'No contact'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-300">{profile.age} yrs • {profile.gender}</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="w-3 h-3" /> {profile.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {profile.job && (
                          <span className="flex items-center gap-1 text-xs text-slate-300">
                            <Briefcase className="w-3 h-3 text-slate-500" /> {profile.job}
                          </span>
                        )}
                        {profile.education && (
                          <span className="flex items-center gap-1 text-xs text-slate-300">
                            <GraduationCap className="w-3 h-3 text-slate-500" /> {profile.education}
                          </span>
                        )}
                        {!profile.job && !profile.education && (
                          <span className="text-xs italic text-slate-600">Not provided</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {profile.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                          <Eye className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                          <EyeOff className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleActive(profile.id, profile.isActive)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                          profile.isActive
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {profile.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
