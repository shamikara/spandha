'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=50')
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to load notifications')
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const markRead = async (notificationId?: string) => {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationId ? { notificationId } : {}),
    })
    loadNotifications()
  }

  if (loading) return <div className="wedding-card p-8 text-center">Loading notifications...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">{unreadCount} unread notification{unreadCount === 1 ? '' : 's'}</p>
        </div>
        <button onClick={() => markRead()} disabled={unreadCount === 0} className="wedding-button disabled:opacity-50">
          Mark all read
        </button>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</div>}

      <div className="wedding-card divide-y divide-gray-100 overflow-hidden dark:divide-gray-800">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">No notifications yet.</div>
        ) : notifications.map(notification => (
          <div key={notification.id} className={`p-5 ${notification.isRead ? '' : 'bg-wedding-gold/10 dark:bg-wedding-gold/5'}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-wedding-maroon dark:text-wedding-gold">{notification.type.replace(/_/g, ' ')}</p>
                <h2 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{notification.title}</h2>
                <p className="mt-1 text-gray-600 dark:text-gray-300">{notification.message}</p>
                <p className="mt-2 text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                {notification.link && (
                  <Link href={notification.link} className="rounded-md bg-wedding-maroon px-3 py-2 text-sm font-medium text-white hover:bg-wedding-maroon/90 dark:bg-wedding-gold dark:text-wedding-dark">
                    Open
                  </Link>
                )}
                {!notification.isRead && (
                  <button onClick={() => markRead(notification.id)} className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                    Mark read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
