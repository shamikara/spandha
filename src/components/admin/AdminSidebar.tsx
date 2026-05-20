'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, LayoutTemplate, Settings, CreditCard, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users & Profiles', href: '/admin/users', icon: Users },
  { name: 'Proposals', href: '/admin/proposals', icon: LayoutTemplate },
  { name: 'Revenue', href: '/admin/revenue', icon: CreditCard },
  { name: 'Site CMS', href: '/admin/content', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-full bg-[#0d0d0d] border-r border-white/5 flex flex-col flex-shrink-0">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-semibold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            Spandha
          </span>
          <span className="text-xs uppercase tracking-widest text-indigo-500 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-white bg-white/5' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill" 
                  className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full" 
                />
              )}
              <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : ''}`} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => {
            document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
            window.location.href = '/'
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Exit Admin</span>
        </button>
      </div>
    </div>
  )
}
