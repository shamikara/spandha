'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Power } from 'lucide-react'
import ContentBlockForm from '@/components/admin/ContentBlockForm'
import LanguageSwitcher, { Locale } from '@/components/LanguageSwitcher'

export default function AdminContentPage() {
  const [blocks, setBlocks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBlock, setEditingBlock] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentLocale, setCurrentLocale] = useState<Locale>('EN')

  useEffect(() => {
    checkAdminAndFetch()
  }, [])

  useEffect(() => {
    // Listen for locale changes
    const handleLocaleChange = (e: CustomEvent) => {
      setCurrentLocale(e.detail)
      fetchBlocks()
    }
    window.addEventListener('localeChange', handleLocaleChange as EventListener)
    return () => window.removeEventListener('localeChange', handleLocaleChange as EventListener)
  }, [])

  const checkAdminAndFetch = async () => {
    try {
      const profileRes = await fetch('/api/profile')
      if (!profileRes.ok) {
        window.location.href = '/auth'
        return
      }

      const profileData = await profileRes.json()
      if (!profileData.profile?.isAdmin) {
        window.location.href = '/'
        return
      }

      setIsAdmin(true)
      fetchBlocks()
    } catch (error) {
      console.error('Error checking admin:', error)
      window.location.href = '/auth'
    }
  }

  const fetchBlocks = async () => {
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
    if (!confirm('Are you sure you want to delete this block?')) return

    try {
      const res = await fetch(`/api/content-blocks/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchBlocks()
      }
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

      if (res.ok) {
        fetchBlocks()
      }
    } catch (error) {
      console.error('Error toggling block:', error)
    }
  }

  const handleEdit = (block: any) => {
    setEditingBlock(block)
    setShowForm(true)
  }

  const handleFormSubmit = (data: any) => {
    if (editingBlock) {
      handleUpdate(editingBlock.id, data)
    } else {
      handleCreate(data)
    }
  }

  if (!isAdmin) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Blocks</h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => {
                setEditingBlock(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 bg-wedding-maroon hover:bg-wedding-maroon/90 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Block
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {editingBlock ? 'Edit Block' : 'Create New Block'}
            </h2>
            <ContentBlockForm
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingBlock(null)
              }}
              initialData={editingBlock}
            />
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Locale
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {blocks.map((block) => (
                <tr key={block.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {block.key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-wedding-maroon/10 text-wedding-maroon dark:bg-wedding-gold/10 dark:text-wedding-gold">
                      {block.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {block.locale}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleToggleActive(block.id, block.isActive)}
                      className={`flex items-center gap-1 px-2 py-1 rounded ${
                        block.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      {block.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(block)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(block.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
