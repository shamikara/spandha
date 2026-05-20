'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Power, Settings, Globe, Search, Save, ToggleLeft, ToggleRight } from 'lucide-react'
import ContentBlockForm from '@/components/admin/ContentBlockForm'
import LanguageSwitcher, { Locale } from '@/components/LanguageSwitcher'

const tabs = [
  { id: 'content', label: 'Content Blocks', icon: Edit },
  { id: 'settings', label: 'Site Settings', icon: Settings },
  { id: 'seo', label: 'SEO & Meta', icon: Globe },
]

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState('content')

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Site Management</h1>
        <p className="text-slate-400 mt-1">Manage content, configure site settings, and optimize SEO — no code required.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'content' && <ContentBlocksTab />}
      {activeTab === 'settings' && <SiteSettingsTab />}
      {activeTab === 'seo' && <SeoMetaTab />}
    </div>
  )
}

/* ─────────────── Tab 1: Content Blocks ─────────────── */
function ContentBlocksTab() {
  const [blocks, setBlocks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBlock, setEditingBlock] = useState<any>(null)
  const [currentLocale, setCurrentLocale] = useState<Locale>('EN')

  useEffect(() => {
    const handleLocaleChange = (e: CustomEvent) => {
      setCurrentLocale(e.detail)
    }
    window.addEventListener('localeChange', handleLocaleChange as EventListener)
    return () => window.removeEventListener('localeChange', handleLocaleChange as EventListener)
  }, [])

  useEffect(() => {
    fetchBlocks()
  }, [currentLocale])

  const fetchBlocks = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/content-blocks?locale=${currentLocale}&includeInactive=true`)
      const data = await res.json()
      setBlocks(data.blocks || [])
    } catch (error) {
      console.error('Error fetching blocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: any) => {
    try {
      const res = await fetch('/api/content-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setShowForm(false)
        fetchBlocks()
      }
    } catch (error) {
      console.error('Error creating block:', error)
    }
  }

  const handleUpdate = async (id: string, data: any) => {
    try {
      const res = await fetch(`/api/content-blocks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setShowForm(false)
        setEditingBlock(null)
        fetchBlocks()
      }
    } catch (error) {
      console.error('Error updating block:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content block?')) return
    try {
      const res = await fetch(`/api/content-blocks/${id}`, { method: 'DELETE' })
      if (res.ok) fetchBlocks()
    } catch (error) {
      console.error('Error deleting block:', error)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/content-blocks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      if (res.ok) fetchBlocks()
    } catch (error) {
      console.error('Error toggling block:', error)
    }
  }

  const handleFormSubmit = (data: any) => {
    if (editingBlock) {
      handleUpdate(editingBlock.id, data)
    } else {
      handleCreate(data)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <LanguageSwitcher />
        <button
          onClick={() => { setEditingBlock(null); setShowForm(true) }}
          className="flex items-center gap-2 bg-indigo-600/90 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-500/50"
        >
          <Plus className="w-4 h-4" />
          Add Block
        </button>
      </div>

      {showForm && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">
            {editingBlock ? 'Edit Block' : 'Create New Block'}
          </h2>
          <ContentBlockForm
            onSubmit={handleFormSubmit}
            onCancel={() => { setShowForm(false); setEditingBlock(null) }}
            initialData={editingBlock}
          />
        </div>
      )}

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300">
              <tr>
                <th className="px-6 py-4 font-medium">Key</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Locale</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                      <span>Loading content blocks...</span>
                    </div>
                  </td>
                </tr>
              ) : blocks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                    No content blocks found for this locale.
                  </td>
                </tr>
              ) : (
                blocks.map((block) => (
                  <tr key={block.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">{block.key}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {block.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {block.locale}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(block.id, block.isActive)}
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-colors ${
                          block.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        {block.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingBlock(block); setShowForm(true) }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(block.id)}
                          className="p-2 hover:bg-rose-500/10 rounded-lg transition-colors text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
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

/* ─────────────── Tab 2: Site Settings ─────────────── */
function SiteSettingsTab() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    showPremiumBadge: true,
    enableNotifications: true,
    requirePhoneVerification: true,
    showOnlineStatus: false,
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const settingsList = [
    {
      key: 'maintenanceMode' as const,
      label: 'Maintenance Mode',
      description: 'When enabled, the site will display a maintenance page to all visitors except admins.',
      danger: true,
    },
    {
      key: 'allowRegistrations' as const,
      label: 'Allow New Registrations',
      description: 'Toggle whether new users can create accounts on the platform.',
    },
    {
      key: 'showPremiumBadge' as const,
      label: 'Show Premium Badge',
      description: 'Display a premium crown badge on verified premium user profiles.',
    },
    {
      key: 'enableNotifications' as const,
      label: 'Email & SMS Notifications',
      description: 'Enable or disable all outgoing notifications (OTP, interest alerts, etc.).',
    },
    {
      key: 'requirePhoneVerification' as const,
      label: 'Require Phone Verification',
      description: 'Require users to verify their phone number before publishing a proposal.',
    },
    {
      key: 'showOnlineStatus' as const,
      label: 'Show Online Status',
      description: 'Display a green dot when users are currently online on the platform.',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
        {settingsList.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between px-6 py-5 hover:bg-white/[0.02] transition-colors">
            <div className="flex-1 mr-8">
              <h3 className={`text-sm font-medium ${setting.danger ? 'text-rose-300' : 'text-slate-200'}`}>
                {setting.label}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-lg">{setting.description}</p>
            </div>
            <button
              onClick={() => toggleSetting(setting.key)}
              className="flex-shrink-0"
            >
              {settings[setting.key] ? (
                <ToggleRight className={`w-10 h-10 ${setting.danger ? 'text-rose-400' : 'text-indigo-400'}`} />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-600" />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-indigo-600/90 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)] border border-indigo-500/50">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  )
}

/* ─────────────── Tab 3: SEO & Meta ─────────────── */
function SeoMetaTab() {
  const [seo, setSeo] = useState({
    siteTitle: 'Spandha — Premium Matrimonial Platform',
    metaDescription: 'Find your perfect life partner with Spandha. Sri Lanka\'s most trusted premium matrimonial platform.',
    ogImageUrl: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    twitterHandle: '',
  })

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-500"

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-white mb-1">Search Engine Optimization</h2>
          <p className="text-xs text-slate-500">Configure how your platform appears in search engine results.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Site Title</label>
            <input
              type="text"
              value={seo.siteTitle}
              onChange={(e) => setSeo(prev => ({ ...prev, siteTitle: e.target.value }))}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">OG Image URL</label>
            <input
              type="text"
              value={seo.ogImageUrl}
              onChange={(e) => setSeo(prev => ({ ...prev, ogImageUrl: e.target.value }))}
              placeholder="https://spandha.lk/og-image.png"
              className={inputClasses}
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Meta Description</label>
            <textarea
              value={seo.metaDescription}
              onChange={(e) => setSeo(prev => ({ ...prev, metaDescription: e.target.value }))}
              rows={3}
              className={`${inputClasses} resize-none`}
            />
            <p className="text-xs text-slate-600 mt-1">{seo.metaDescription.length}/160 characters recommended</p>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-white mb-1">Analytics & Tracking</h2>
          <p className="text-xs text-slate-500">Connect your analytics services to track visitor behavior.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Google Analytics ID</label>
            <input
              type="text"
              value={seo.googleAnalyticsId}
              onChange={(e) => setSeo(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
              placeholder="G-XXXXXXXXXX"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Facebook Pixel ID</label>
            <input
              type="text"
              value={seo.facebookPixelId}
              onChange={(e) => setSeo(prev => ({ ...prev, facebookPixelId: e.target.value }))}
              placeholder="XXXXXXXXXXXXXXXX"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Twitter Handle</label>
            <input
              type="text"
              value={seo.twitterHandle}
              onChange={(e) => setSeo(prev => ({ ...prev, twitterHandle: e.target.value }))}
              placeholder="@spandha"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-indigo-600/90 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)] border border-indigo-500/50">
          <Save className="w-4 h-4" />
          Save SEO Settings
        </button>
      </div>
    </div>
  )
}
