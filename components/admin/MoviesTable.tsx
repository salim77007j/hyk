'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { Movie } from '@/lib/supabase'

interface MoviesTableProps {
  movies: Movie[]
  onRefresh: () => void
  isLoading: boolean
}

export default function MoviesTable({ movies, onRefresh, isLoading }: MoviesTableProps) {
  const [selectedMovies, setSelectedMovies] = useState<string[]>([])

  const handleStatusToggle = async (movieId: string, currentStatus: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      toast.success(`تم ${newStatus === 'active' ? 'تفعيل' : 'إلغاء تفعيل'} المحتوى`)
      onRefresh()
    } catch (error) {
      toast.error('حدث خطأ في تغيير الحالة')
    }
  }

  const handleDelete = async (movieId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المحتوى؟')) return
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast.success('تم حذف المحتوى بنجاح')
      onRefresh()
    } catch (error) {
      toast.error('حدث خطأ في حذف المحتوى')
    }
  }

  const toggleSelectMovie = (movieId: string) => {
    setSelectedMovies(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    )
  }

  const selectAllMovies = () => {
    setSelectedMovies(selectedMovies.length === movies.length ? [] : movies.map(m => m.id))
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="loading-dots mx-auto mb-4">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="text-gray-400">جاري تحميل المحتوى...</p>
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">لا يوجد محتوى متاح</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Bulk Actions */}
      {selectedMovies.length > 0 && (
        <div className="bg-blue-600 px-6 py-3 flex items-center justify-between">
          <span className="text-white">
            تم تحديد {selectedMovies.length} عنصر
          </span>
          <div className="flex items-center space-x-2 space-x-reverse">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">
              حذف المحدد
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm">
              تغيير الحالة
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-right p-4">
                <input
                  type="checkbox"
                  checked={selectedMovies.length === movies.length && movies.length > 0}
                  onChange={selectAllMovies}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-right p-4 text-gray-300 font-semibold">الملصق</th>
              <th className="text-right p-4 text-gray-300 font-semibold">العنوان</th>
              <th className="text-right p-4 text-gray-300 font-semibold">النوع</th>
              <th className="text-right p-4 text-gray-300 font-semibold">السنة</th>
              <th className="text-right p-4 text-gray-300 font-semibold">التقييم</th>
              <th className="text-right p-4 text-gray-300 font-semibold">الحالة</th>
              <th className="text-right p-4 text-gray-300 font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => (
              <tr key={movie.id} className={`border-t border-gray-700 hover:bg-gray-700 transition-colors ${
                index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'
              }`}>
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedMovies.includes(movie.id)}
                    onChange={() => toggleSelectMovie(movie.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">
                  <img
                    src={movie.poster_url || 'https://via.placeholder.com/60x90/1f2937/ffffff?text=No+Image'}
                    alt={movie.title}
                    className="w-12 h-18 object-cover rounded"
                  />
                </td>
                <td className="p-4">
                  <div>
                    <h3 className="text-white font-medium">{movie.title}</h3>
                    {movie.title_en && (
                      <p className="text-gray-400 text-sm">{movie.title_en}</p>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    movie.type === 'movie' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-green-600 text-white'
                  }`}>
                    {movie.type === 'movie' ? 'فيلم' : 'مسلسل'}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{movie.release_year}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-1 space-x-reverse text-gray-300">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{movie.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleStatusToggle(movie.id, movie.status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      movie.status === 'active'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {movie.status === 'active' ? 'نشط' : 'غير نشط'}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <a
                      href={`/movie/${movie.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      title="عرض في الموقع"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                    <button
                      className="text-gray-400 hover:text-white transition-colors"
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (placeholder) */}
      <div className="bg-gray-700 px-6 py-4 flex items-center justify-between">
        <span className="text-gray-300 text-sm">
          عرض {movies.length} عنصر
        </span>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm">
            السابق
          </button>
          <span className="text-gray-300 text-sm">1</span>
          <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm">
            التالي
          </button>
        </div>
      </div>
    </div>
  )
}
