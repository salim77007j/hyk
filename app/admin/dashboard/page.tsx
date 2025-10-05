'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Film, Tv, Users, Plus, Settings, Search, Eye } from 'lucide-react'
import AddMovieModal from '@/components/admin/AddMovieModal'
import MoviesTable from '@/components/admin/MoviesTable'
import { getMovies } from '@/lib/supabase'
import type { Movie } from '@/lib/supabase'

export default function AdminDashboard() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadMovies()
  }, [])

  const loadMovies = async () => {
    setIsLoading(true)
    try {
      const { data } = await getMovies()
      setMovies(data || [])
    } catch (error) {
      console.error('Error loading movies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const stats = {
    totalMovies: movies.filter(m => m.type === 'movie').length,
    totalSeries: movies.filter(m => m.type === 'series').length,
    totalViews: 12543, // This would come from analytics
    activeContent: movies.filter(m => m.status === 'active').length
  }

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (movie.title_en && movie.title_en.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
              <p className="text-gray-400 mt-1">إدارة الأفلام والمسلسلات</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 space-x-reverse"
            >
              <Plus className="h-5 w-5" />
              <span>إضافة محتوى جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 space-x-reverse">
            {[
              { id: 'overview', label: 'لمحة عامة', icon: BarChart3 },
              { id: 'movies', label: 'الأفلام', icon: Film },
              { id: 'series', label: 'المسلسلات', icon: Tv },
              { id: 'settings', label: 'الإعدادات', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 space-x-reverse py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">إجمالي الأفلام</p>
                    <p className="text-3xl font-bold text-white">{stats.totalMovies}</p>
                  </div>
                  <Film className="h-12 w-12 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">إجمالي المسلسلات</p>
                    <p className="text-3xl font-bold text-white">{stats.totalSeries}</p>
                  </div>
                  <Tv className="h-12 w-12 text-green-500" />
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">إجمالي المشاهدات</p>
                    <p className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                  </div>
                  <Eye className="h-12 w-12 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">المحتوى النشط</p>
                    <p className="text-3xl font-bold text-white">{stats.activeContent}</p>
                  </div>
                  <BarChart3 className="h-12 w-12 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">أحدث الأفلام المضافة</h3>
              <div className="space-y-4">
                {movies.slice(0, 5).map((movie) => (
                  <div key={movie.id} className="flex items-center space-x-4 space-x-reverse">
                    <img
                      src={movie.poster_url || 'https://via.placeholder.com/60x90/1f2937/ffffff?text=No+Image'}
                      alt={movie.title}
                      className="w-12 h-18 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{movie.title}</h4>
                      <p className="text-gray-400 text-sm">
                        {movie.type === 'movie' ? 'فيلم' : 'مسلسل'} - {movie.release_year}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      movie.status === 'active' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {movie.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'movies' || activeTab === 'series') && (
          <div>
            {/* Search Bar */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`ابحث في ${activeTab === 'movies' ? 'الأفلام' : 'المسلسلات'}...`}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Movies/Series Table */}
            <MoviesTable 
              movies={filteredMovies.filter(m => 
                activeTab === 'movies' ? m.type === 'movie' : m.type === 'series'
              )}
              onRefresh={loadMovies}
              isLoading={isLoading}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">إعدادات الموقع</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  اسم الموقع
                </label>
                <input
                  type="text"
                  defaultValue="سينما أونلاين"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  وصف الموقع
                </label>
                <textarea
                  defaultValue="موقع لمشاهدة الأفلام والمسلسلات مجاناً"
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                حفظ التغييرات
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      {showAddModal && (
        <AddMovieModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            loadMovies()
          }}
        />
      )}
    </div>
  )
}
