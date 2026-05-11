'use client'

import { useState } from 'react'

interface ContentBlockFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

export default function ContentBlockForm({ onSubmit, onCancel, initialData }: ContentBlockFormProps) {
  const [key, setKey] = useState(initialData?.key || '')
  const [type, setType] = useState(initialData?.type || 'HERO')
  const [locale, setLocale] = useState(initialData?.locale || 'EN')
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)

  // Type-specific content fields
  const [heroContent, setHeroContent] = useState(initialData?.content || { title: '', subtitle: '', cta: '' })
  const [bannerContent, setBannerContent] = useState(initialData?.content || { imageUrl: '', link: '', text: '' })
  const [advertContent, setAdvertContent] = useState(initialData?.content || { title: '', image: '', link: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let content
    switch (type) {
      case 'HERO':
        content = heroContent
        break
      case 'BANNER':
        content = bannerContent
        break
      case 'ADVERT':
        content = advertContent
        break
      default:
        content = {}
    }

    onSubmit({ key, type, content, isActive, locale })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Key (unique identifier)
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="e.g., hero, banner_1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="HERO">HERO</option>
            <option value="BANNER">BANNER</option>
            <option value="ADVERT">ADVERT</option>
            <option value="SECTION">SECTION</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Locale
          </label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="EN">English</option>
            <option value="SI">Sinhala</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="w-4 h-4 text-wedding-maroon border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Active
        </label>
      </div>

      {/* Type-specific fields */}
      {type === 'HERO' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hero Content</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={heroContent.title}
              onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
            <textarea
              value={heroContent.subtitle}
              onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CTA Button Text</label>
            <input
              type="text"
              value={heroContent.cta}
              onChange={(e) => setHeroContent({ ...heroContent, cta: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>
      )}

      {type === 'BANNER' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Banner Content</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
            <input
              type="text"
              value={bannerContent.imageUrl}
              onChange={(e) => setBannerContent({ ...bannerContent, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Link</label>
            <input
              type="text"
              value={bannerContent.link}
              onChange={(e) => setBannerContent({ ...bannerContent, link: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Text</label>
            <input
              type="text"
              value={bannerContent.text}
              onChange={(e) => setBannerContent({ ...bannerContent, text: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>
      )}

      {type === 'ADVERT' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advert Content</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={advertContent.title}
              onChange={(e) => setAdvertContent({ ...advertContent, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
            <input
              type="text"
              value={advertContent.image}
              onChange={(e) => setAdvertContent({ ...advertContent, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Link</label>
            <input
              type="text"
              value={advertContent.link}
              onChange={(e) => setAdvertContent({ ...advertContent, link: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-wedding-maroon hover:bg-wedding-maroon/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {initialData ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
