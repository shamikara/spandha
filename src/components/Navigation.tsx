'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { useTheme } from '@/hooks/useTheme'
import { Languages, Sun, Moon, Menu } from 'lucide-react'
import type { Profile } from '@/types'

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  
  const pathname = usePathname()
  const { t, language, changeLanguage } = useTranslation()
  const { theme, toggleTheme, isDark } = useTheme()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/profile')
      setIsAuthenticated(response.ok)
      
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.profile)
      }
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsAuthenticated(false)
      setUserProfile(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navItems = [
    { href: '/', label: t('nav.home'), active: pathname === '/' },
    { href: '/proposals', label: t('nav.proposals'), active: pathname === '/proposals' || pathname.startsWith('/proposals/') },
    { href: '/post', label: t('nav.post'), active: pathname === '/post' },
    { href: '/about', label: t('nav.about'), active: pathname === '/about' },
    { href: '/contact', label: t('nav.contact'), active: pathname === '/contact' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-wedding-maroon/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.webp"
              alt="Spandha Logo"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  item.active
                    ? 'text-wedding-maroon dark:text-wedding-gold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-wedding-maroon dark:hover:text-wedding-gold'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={() => changeLanguage(language === 'en' ? 'si' : 'en')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-wedding-maroon dark:hover:text-wedding-gold transition-colors flex items-center"
              title="Change language"
            >
              <Languages className="w-5 h-5" />
              <span className="text-xs ml-1">{language === 'en' ? 'EN' : 'SI'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-wedding-maroon dark:hover:text-wedding-gold transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth/Profile */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-wedding-maroon dark:hover:text-wedding-gold transition-colors"
                >
                  <div className="w-8 h-8 bg-wedding-gold rounded-full flex items-center justify-center text-wedding-maroon font-bold text-xs">
                    {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                  </div>
                  <span className="hidden lg:block">
                    {userProfile?.firstName} {userProfile?.lastName}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-wedding-maroon dark:hover:text-wedding-gold transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="wedding-button text-sm"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Language Toggle */}
            <button
              onClick={() => changeLanguage(language === 'en' ? 'si' : 'en')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-wedding-maroon dark:hover:text-wedding-gold"
            >
              <span className="text-xs font-bold">{language === 'en' ? 'EN' : 'SI'}</span>
            </button>

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-wedding-maroon dark:hover:text-wedding-gold"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-wedding-maroon dark:hover:text-wedding-gold"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    item.active
                      ? 'text-wedding-maroon dark:text-wedding-gold bg-wedding-maroon/10 dark:bg-wedding-gold/10'
                      : 'text-gray-700 dark:text-gray-300 hover:text-wedding-maroon dark:hover:text-wedding-gold hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-wedding-maroon dark:hover:text-wedding-gold hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-wedding-gold rounded-full flex items-center justify-center text-wedding-maroon font-bold text-xs">
                      {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                    </div>
                    <span>{userProfile?.firstName} {userProfile?.lastName}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-wedding-maroon dark:hover:text-wedding-gold hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="block wedding-button text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
