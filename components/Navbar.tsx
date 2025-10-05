'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Film, Tv, Home, Settings, Star, Flame } from 'lucide-react'
import SearchModal from './SearchModal'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <nav className="navbar fixed top-0 w-full z-50 transition-all duration-300">
        <div className="container-responsive">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 space-x-reverse group">
              <div className="relative">
                <Film className="h-10 w-10 text-red-500 transition-transform group-hover:scale-110" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white text-glow">سينما أونلاين</span>
                <span className="text-xs text-red-400 font-medium">مشاهدة مجانية</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <Link href="/" className="nav-link group flex items-center space-x-2 space-x-reverse">
                <Home className="h-5 w-5 transition-colors group-hover:text-red-500" />
                <span>الرئيسية</span>
              </Link>
              <Link href="/movies" className="nav-link group flex items-center space-x-2 space-x-reverse">
                <Film className="h-5 w-5 transition-colors group-hover:text-red-500" />
                <span>أفلام</span>
              </Link>
              <Link href="/series" className="nav-link group flex items-center space-x-2 space-x-reverse">
                <Tv className="h-5 w-5 transition-colors group-hover:text-red-500" />
                <span>مسلسلات</span>
              </Link>
              <div className="flex items-center space-x-2 space-x-reverse text-yellow-400">
                <Flame className="h-4 w-4" />
                <span className="text-sm font-medium">الأكثر مشاهدة</span>
              </div>
            </div>

            {/* Search and Menu */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-3 rounded-full bg-white/10 hover:bg-red-500/20 transition-all duration-300 hover:scale-110"
                aria-label="بحث"
              >
                <Search className="h-5 w-5 text-white" />
              </button>

              {/* Admin Link */}
              <Link 
                href="/admin" 
                className="hidden md:flex items-center space-x-2 space-x-reverse p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-all duration-300"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">إدارة</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-red-500/20 transition-all duration-300"
                aria-label="القائمة"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-4 space-y-2 bg-black/50 backdrop-blur-lg rounded-b-lg mt-2">
              <Link href="/" className="mobile-nav-link flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-red-500/20 transition-all duration-300">
                <Home className="h-5 w-5 text-red-400" />
                <span>الرئيسية</span>
              </Link>
              <Link href="/movies" className="mobile-nav-link flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-red-500/20 transition-all duration-300">
                <Film className="h-5 w-5 text-red-400" />
                <span>أفلام</span>
              </Link>
              <Link href="/series" className="mobile-nav-link flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-red-500/20 transition-all duration-300">
                <Tv className="h-5 w-5 text-red-400" />
                <span>مسلسلات</span>
              </Link>
              <Link href="/admin" className="mobile-nav-link flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-red-500/20 transition-all duration-300">
                <Settings className="h-5 w-5 text-red-400" />
                <span>لوحة التحكم</span>
              </Link>
              <div className="flex items-center space-x-3 space-x-reverse p-3 text-yellow-400">
                <Star className="h-5 w-5" />
                <span>المفضلة</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <style jsx>{`
        .nav-link {
          @apply text-white/80 hover:text-white font-medium transition-all duration-300 relative;
        }
        
        .nav-link:hover::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #e50914, #f5c518);
          border-radius: 1px;
        }
        
        .mobile-nav-link {
          @apply text-white/90 font-medium;
        }
      `}</style>
    </>
  )
}