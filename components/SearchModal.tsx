'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Film, Tv, Star, Clock, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import { searchMovies } from '@/lib/supabase'
import type { Movie } from '@/lib/supabase'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

// Sample trending searches for demo
const trendingSearches = [
  'أفلام أكشن',
  'مسلسلات تركية', 
  'أفلام رومانسية',
  'مسلسلات كوريية',
  'أنمي',
  'أفلام كوميدي'
]

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      // Load recent searches from localStorage
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const { data } = await searchMovies(query)
        setResults(data || [])
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 glass-effect rounded-2xl shadow-2xl border border-white/10 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-6 border-b border-white/10">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن الأفلام والمسلسلات..."
              className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all"
            />
            {isLoading && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent"></div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {query.length < 2 ? (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold flex items-center space-x-2 space-x-reverse">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span>عمليات بحث سابقة</span>
                    </h3>
                    <button 
                      onClick={clearRecentSearches}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      مسح الكل
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm transition-all border border-white/10 hover:border-red-500/30"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 space-x-reverse">
                  <TrendingUp className="h-4 w-4 text-red-400" />
                  <span>البحث الشائع</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="bg-gradient-to-r from-red-500/10 to-purple-500/10 hover:from-red-500/20 hover:to-purple-500/20 text-gray-300 hover:text-white p-3 rounded-lg text-sm transition-all border border-white/10 hover:border-red-500/30 text-right"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Search Results */
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 space-x-reverse">
                    <Search className="h-4 w-4 text-green-400" />
                    <span>نتائج البحث ({results.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {results.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        onClick={onClose}
                        className="block group"
                      >
                        <div className="flex items-center space-x-4 space-x-reverse p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 hover:border-red-500/30">
                          <div className="flex-shrink-0">
                            <img
                              src={movie.poster_url || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=60&h=90&fit=crop&crop=center'}
                              alt={movie.title}
                              className="w-12 h-18 object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium group-hover:text-red-400 transition-colors line-clamp-1">
                              {movie.title}
                            </h4>
                            <div className="flex items-center space-x-4 space-x-reverse mt-1 text-sm text-gray-400">
                              <div className="flex items-center space-x-1 space-x-reverse">
                                {movie.type === 'movie' ? (
                                  <Film className="h-3 w-3 text-blue-400" />
                                ) : (
                                  <Tv className="h-3 w-3 text-purple-400" />
                                )}
                                <span>{movie.type === 'movie' ? 'فيلم' : 'مسلسل'}</span>
                              </div>
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span>{movie.rating?.toFixed(1) || '8.0'}</span>
                              </div>
                              <span>{movie.release_year}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-bold flex items-center space-x-1 space-x-reverse">
                              <Zap className="h-3 w-3" />
                              <span>HD</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-400 mb-2">لا توجد نتائج لـ "{query}"</p>
                  <p className="text-gray-500 text-sm">جرب البحث بكلمات مختلفة</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}