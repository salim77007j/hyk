import { getMovies } from '@/lib/supabase'
import MovieGrid from '@/components/MovieGrid'
import { Film } from 'lucide-react'

export const metadata = {
  title: 'الأفلام - سينما أونلاين',
  description: 'شاهد أحدث وأفضل الأفلام العربية والعالمية مجاناً',
}

export default async function MoviesPage() {
  const { data: movies, error } = await getMovies('movie')

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
            <Film className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">الأفلام</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من أحدث وأفضل الأفلام العربية والعالمية بجودة عالية
          </p>
        </div>

        {/* Movies Grid */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">حدث خطأ في تحميل الأفلام</p>
            <p className="text-gray-400 mt-2">يرجى المحاولة لاحقاً</p>
          </div>
        ) : movies && movies.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                جميع الأفلام ({movies.length})
              </h2>
              
              {/* Filter/Sort options can be added here */}
              <div className="text-gray-400 text-sm">
                مرتبة حسب الأحدث
              </div>
            </div>
            
            <MovieGrid movies={movies} />
          </div>
        ) : (
          <div className="text-center py-12">
            <Film className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">لا توجد أفلام متاحة حالياً</p>
            <p className="text-gray-500 mt-2">تابعنا للحصول على أحدث الإضافات</p>
          </div>
        )}
      </div>
    </div>
  )
}
