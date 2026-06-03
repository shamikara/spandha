'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Search, Shield, ShieldAlert, Star, ShieldCheck, User as UserIcon } from 'lucide-react'
import type { User, Profile } from '@/types'

type AdminUser = User & { profile?: Profile | null; isPremium?: boolean }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'verification' | 'adverts'>('profile')
  const [userAdverts, setUserAdverts] = useState<any[]>([])
  const [loadingAdverts, setLoadingAdverts] = useState(false)

  const fetchUsers = useCallback(async () => {
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
  }, [filter, search])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [fetchUsers])

  const toggleStatus = async (userId: string, field: 'isNicVerified' | 'isPremium' | 'isAdmin', currentValue: boolean) => {
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

  const openReviewModal = async (user: AdminUser) => {
    setSelectedUser(user)
    setIsModalOpen(true)
    setActiveTab('profile')
    setUserAdverts([])

    // Fetch user's adverts
    setLoadingAdverts(true)
    try {
      const res = await fetch(`/api/adverts?userId=${user.id}`)
      const data = await res.json()
      if (res.ok) setUserAdverts(data.adverts || [])
    } catch (error) {
      console.error('Error fetching adverts:', error)
    } finally {
      setLoadingAdverts(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
    setUserAdverts([])
  }

  const deleteAdvert = async (advertId: string) => {
    if (!confirm('Are you sure you want to delete this advert?')) return

    try {
      const res = await fetch(`/api/adverts/${advertId}`, {
        method: 'DELETE',
      })
      if (res.ok && selectedUser) {
        // Refresh adverts list
        const advertsRes = await fetch(`/api/adverts?userId=${selectedUser.id}`)
        const advertsData = await advertsRes.json()
        if (advertsRes.ok) setUserAdverts(advertsData.adverts || [])
      }
    } catch (error) {
      console.error('Error deleting advert:', error)
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
                             <Image src={user.profile.avatar} alt="avatar" width={40} height={40} className="w-full h-full object-cover" />
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
                          onClick={() => openReviewModal(user)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                        >
                          Review Profile
                        </button>
                        <button
                          onClick={() => toggleStatus(user.id, 'isNicVerified', user.isNicVerified)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5"
                        >
                          {user.isNicVerified ? 'Revoke' : 'Verify'}
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

      {/* Review Profile Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="h-full w-full overflow-y-auto">
            <div className="min-h-full p-4 sm:p-8">
              <div className="mx-auto max-w-6xl bg-zinc-900 rounded-2xl shadow-2xl border border-white/10">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 overflow-hidden">
                      {selectedUser.profile?.avatar ? (
                        <Image src={selectedUser.profile.avatar} alt="avatar" width={48} height={48} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-6 h-6 text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {selectedUser.profile ? `${selectedUser.profile.firstName} ${selectedUser.profile.lastName}` : 'Profile Incomplete'}
                      </h2>
                      <p className="text-sm text-slate-400">{selectedUser.phone || selectedUser.email || 'No contact info'}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'profile'
                        ? 'text-indigo-400 border-b-2 border-indigo-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('verification')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'verification'
                        ? 'text-indigo-400 border-b-2 border-indigo-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Verification
                  </button>
                  <button
                    onClick={() => setActiveTab('adverts')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'adverts'
                        ? 'text-indigo-400 border-b-2 border-indigo-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Adverts ({userAdverts.length})
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'profile' && selectedUser.profile && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Age</p>
                          <p className="text-white font-medium">{selectedUser.profile.age} years</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Gender</p>
                          <p className="text-white font-medium capitalize">{selectedUser.profile.gender}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Location</p>
                          <p className="text-white font-medium">{selectedUser.profile.location}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Job</p>
                          <p className="text-white font-medium">{selectedUser.profile.job || 'Not added'}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Education</p>
                          <p className="text-white font-medium">{selectedUser.profile.education || 'Not added'}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Status</p>
                          <p className="text-white font-medium">{selectedUser.profile.isActive ? 'Active' : 'Hidden'}</p>
                        </div>
                      </div>
                      {selectedUser.profile.description && (
                        <div className="bg-white/5 rounded-lg p-4">
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">About</p>
                          <p className="text-white">{selectedUser.profile.description}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'verification' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-slate-400 mb-2">NIC Front</p>
                          {selectedUser.profile?.nicFront ? (
                            <img
                              src={selectedUser.profile.nicFront}
                              alt="NIC Front"
                              className="w-full rounded-lg border border-white/10"
                            />
                          ) : (
                            <div className="bg-white/5 rounded-lg p-8 text-center text-slate-400">
                              No NIC front uploaded
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-2">NIC Back</p>
                          {selectedUser.profile?.nicBack ? (
                            <img
                              src={selectedUser.profile.nicBack}
                              alt="NIC Back"
                              className="w-full rounded-lg border border-white/10"
                            />
                          ) : (
                            <div className="bg-white/5 rounded-lg p-8 text-center text-slate-400">
                              No NIC back uploaded
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => toggleStatus(selectedUser.id, 'isNicVerified', selectedUser.isNicVerified)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                        >
                          {selectedUser.isNicVerified ? 'Revoke Verification' : 'Verify User'}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to reject this user?')) {
                              toggleStatus(selectedUser.id, 'isNicVerified', selectedUser.isNicVerified)
                            }
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'adverts' && (
                    <div className="space-y-4">
                      {loadingAdverts ? (
                        <div className="text-center text-slate-400 py-8">Loading adverts...</div>
                      ) : userAdverts.length === 0 ? (
                        <div className="text-center text-slate-400 py-8">No adverts found</div>
                      ) : (
                        userAdverts.map((advert) => (
                          <div key={advert.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-white">{advert.title}</h3>
                              <button
                                onClick={() => deleteAdvert(advert.id)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                            <p className="text-sm text-slate-400 line-clamp-2">{advert.content}</p>
                            <div className="mt-2 flex gap-2 text-xs text-slate-500">
                              <span>Posted: {new Date(advert.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span className={advert.isActive ? 'text-emerald-400' : 'text-slate-400'}>
                                {advert.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="flex justify-between items-center p-6 border-t border-white/10">
                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleStatus(selectedUser.id, 'isPremium', !!selectedUser.isPremium)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedUser.isPremium
                          ? 'bg-rose-600/20 text-rose-400 hover:bg-rose-600/30'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      {selectedUser.isPremium ? 'Remove Premium' : 'Grant Premium'}
                    </button>
                    <button
                      onClick={() => toggleStatus(selectedUser.id, 'isAdmin', selectedUser.isAdmin)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedUser.isAdmin
                          ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {selectedUser.isAdmin ? 'Remove Admin' : 'Grant Admin'}
                    </button>
                  </div>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors border border-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
