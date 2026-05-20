'use client'

import { useState, useEffect } from 'react'
import { Search, Shield, ShieldAlert, Star, ShieldCheck, User as UserIcon } from 'lucide-react'
import type { User, Profile } from '@/types'

type AdminUser = User & { profile?: Profile | null; isPremium?: boolean }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filter !== 'all') params.append('filter', filter)

      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      if (res.ok) setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [search, filter])

  const toggleStatus = async (userId: string, field: 'isVerified' | 'isPremium' | 'isAdmin', currentValue: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentValue })
      })
      if (res.ok) fetchUsers()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
          <p className="text-slate-400 mt-1">View, verify, and moderate all platform users.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
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
          <option value="all" className="bg-zinc-900">All Users</option>
          <option value="verified" className="bg-zinc-900">Verified</option>
          <option value="unverified" className="bg-zinc-900">Unverified</option>
          <option value="premium" className="bg-zinc-900">Premium</option>
          <option value="admin" className="bg-zinc-900">Admins</option>
        </select>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 overflow-hidden">
                           {user.profile?.avatar ? (
                             <img src={user.profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                           ) : (
                             <UserIcon className="w-5 h-5 text-indigo-400" />
                           )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-200">
                            {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Profile Incomplete'}
                          </div>
                          {user.isAdmin && (
                             <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase">Admin</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        {user.phone && <span>{user.phone}</span>}
                        {user.email && <span>{user.email}</span>}
                        {!user.phone && !user.email && <span className="italic opacity-50">Unknown</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md w-max border border-emerald-500/20">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md w-max border border-amber-500/20">
                            <ShieldAlert className="w-3.5 h-3.5" /> Unverified
                          </span>
                        )}
                        {user.isPremium && (
                           <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md w-max border border-rose-500/20">
                             <Star className="w-3.5 h-3.5" /> Premium
                           </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(user.id, 'isVerified', user.isVerified)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5"
                        >
                          {user.isVerified ? 'Revoke Verification' : 'Verify'}
                        </button>
                        <button
                          onClick={() => toggleStatus(user.id, 'isPremium', !!user.isPremium)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5"
                        >
                          {user.isPremium ? 'Remove Premium' : 'Grant Premium'}
                        </button>
                      </div>
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
