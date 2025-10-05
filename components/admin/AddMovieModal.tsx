'use client'

import { useState } from 'react'
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { createMovie, createStreamingLink } from '@/lib/supabase'

interface AddMovieModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddMovieModal({ onClose, onSuccess }: AddMovieModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    description: '',
    poster_url: '',
    backdrop_url: '',
    release_year: new Date().getFullYear(),
    duration: 0,
    genre: [] as string[],
    rating: 0,
    type: 'movie' as 'movie' | 'series',
    status: 'active' as 'active' | 'inactive'
  })
  
  const [streamingLinks, setStreamingLinks] = useState([
    { server_name: 'doodstream', quality: '720p', url: '', embed_code: '' }
  ])
  
  const [isLoading, setIsLoading] = useState(false)
  const [newGenre, setNewGenre] = useState('')

  const availableGenres = [
    'دراما', 'كوميديا', 'أكشن', 'رومانسي', 'إثارة', 'رعب', 'مغامرة',
    'خيال علمي', 'جريمة', 'حرب', 'تاريخي', 'عائلي', 'وثائقي'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.description) {
        toast.error('يرجى ملء جميع الحقول المطلوبة')
        return
      }

      // Add movie to database
      const { data: movie, error: movieError } = await createMovie({
        title: formData.title,
        title_en: formData.title_en || null,
        description: formData.description,
        poster_url: formData.poster_url || null,
        backdrop_url: formData.backdrop_url || null,
        release_year: formData.release_year,
        duration: formData.duration,
        genre: formData.genre,
        rating: formData.rating,
        type: formData.type,
        status: formData.status
      })

      if (movieError) {
        console.error('Error adding movie:', movieError)
        toast.error('حدث خطأ في إضافة الفيلم')
        return
      }

      if (!movie || !movie.id) {
        toast.error('حدث خطأ: لم يتم إرجاع معرف الفيلم')
        return
      }

      // Add streaming links
      for (const link of streamingLinks) {
        if (link.url) {
          const { error: linkError } = await createStreamingLink({
            movie_id: movie.id,
            server_name: link.server_name,
            quality: link.quality,
            url: link.url,
            embed_code: link.embed_code || null,
            is_active: true
          })

          if (linkError) {
            console.error('Error adding streaming link:', linkError)
            // Continue with other links even if one fails
          }
        }
      }
      
      toast.success('تم إضافة المحتوى بنجاح')
      onSuccess()
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error('حدث خطأ في إضافة المحتوى')
    } finally {
      setIsLoading(false)
    }
  }

  const addGenre = () => {
    if (newGenre.trim() && !formData.genre.includes(newGenre.trim())) {
      setFormData(prev => ({
        ...prev,
        genre: [...prev.genre, newGenre.trim()]
      }))
      setNewGenre('')
    }
  }

  const removeGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.filter(g => g !== genre)
    }))
  }

  const addStreamingLink = () => {
    setStreamingLinks(prev => [
      ...prev,
      { server_name: 'doodstream', quality: '720p', url: '', embed_code: '' }
    ])
  }

  const removeStreamingLink = (index: number) => {
    setStreamingLinks(prev => prev.filter((_, i) => i !== index))
  }

  const updateStreamingLink = (index: number, field: string, value: string) => {
    setStreamingLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ))
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">إضافة محتوى جديد</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">المعلومات الأساسية</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    العنوان (عربي) *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    العنوان (إنجليزي)
                  </label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      النوع *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'movie' | 'series' }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="movie">فيلم</option>
                      <option value="series">مسلسل</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      الحالة
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Technical Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">المعلومات التقنية</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    رابط الملصق
                  </label>
                  <input
                    type="url"
                    value={formData.poster_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, poster_url: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="https://example.com/poster.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    رابط الخلفية
                  </label>
                  <input
                    type="url"
                    value={formData.backdrop_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, backdrop_url: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="https://example.com/backdrop.jpg"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      سنة الإنتاج
                    </label>
                    <input
                      type="number"
                      value={formData.release_year}
                      onChange={(e) => setFormData(prev => ({ ...prev, release_year: parseInt(e.target.value) }))}
                      min="1900"
                      max={new Date().getFullYear() + 5}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      المدة (دقيقة)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      min="0"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      التقييم
                    </label>
                    <input
                      type="number"
                      value={formData.rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                      min="0"
                      max="10"
                      step="0.1"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الأنواع
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.genre.map((genre, index) => (
                      <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1 space-x-reverse">
                        <span>{genre}</span>
                        <button
                          type="button"
                          onClick={() => removeGenre(genre)}
                          className="text-white hover:text-gray-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <select
                      value={newGenre}
                      onChange={(e) => setNewGenre(e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">اختر نوعاً</option>
                      {availableGenres.filter(g => !formData.genre.includes(g)).map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addGenre}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Streaming Links */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">روابط البث</h3>
                <button
                  type="button"
                  onClick={addStreamingLink}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة رابط</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {streamingLinks.map((link, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-medium">رابط {index + 1}</h4>
                      {streamingLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStreamingLink(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          الخادم
                        </label>
                        <select
                          value={link.server_name}
                          onChange={(e) => updateStreamingLink(index, 'server_name', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                          <option value="doodstream">DoodStream</option>
                          <option value="uqload">UQLoad</option>
                          <option value="streamtape">StreamTape</option>
                          <option value="mixdrop">MixDrop</option>
                          <option value="fembed">Fembed</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          الجودة
                        </label>
                        <select
                          value={link.quality}
                          onChange={(e) => updateStreamingLink(index, 'quality', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                          <option value="360p">360p</option>
                          <option value="480p">480p</option>
                          <option value="720p">720p</option>
                          <option value="1080p">1080p</option>
                          <option value="4K">4K</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          رابط الفيديو
                        </label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateStreamingLink(index, 'url', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                          placeholder="https://dood.to/e/example"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          كود التضمين (iframe)
                        </label>
                        <input
                          type="text"
                          value={link.embed_code}
                          onChange={(e) => updateStreamingLink(index, 'embed_code', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                          placeholder="<iframe src=..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 space-x-reverse"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>حفظ المحتوى</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
