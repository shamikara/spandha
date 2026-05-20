import { redirect } from 'next/navigation'
import { verifyTokenServer } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Admin Dashboard | Spandha',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const user = verifyTokenServer()

  if (!user || !user.isAdmin) {
    redirect('/')
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-slate-100 overflow-hidden font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
