'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, CreditCard, Heart, LayoutDashboard, Megaphone, Settings, User } from 'lucide-react'

const items = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/interests', label: 'My Interests', icon: Heart },
  { href: '/dashboard/adverts', label: 'My Adverts', icon: Megaphone },
  { href: '/dashboard/payments', label: 'Payments', icon: CreditCard },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-wedding-cream/80 dark:bg-wedding-dark/95">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="rounded-lg border border-wedding-maroon/10 bg-white/80 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-gray-900/80">
            {items.map(item => {
              const Icon = item.icon
              const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors last:mb-0 ${
                    active
                      ? 'bg-wedding-maroon text-white dark:bg-wedding-gold dark:text-wedding-dark'
                      : 'text-gray-700 hover:bg-wedding-maroon/10 hover:text-wedding-maroon dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-wedding-gold'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <section>{children}</section>
      </div>
    </div>
  )
}
