import Hero from '@/components/Hero'
import MovieGrid from '@/components/MovieGrid'
import SupabaseStatus from '@/components/SupabaseStatus'
import { getMovies } from '@/lib/supabase'
import Link from 'next/link'
import { TrendingUp, Film, Tv, Clock, Star, Flame, Database } from 'lucide-react'

export default async function Home() {
  const { data: movies, error } = await getMovies()
  const { data: series } = await getMovies('series')
  const { data: films } = await getMovies('movie')

  // Mock trending movies for demo
  const trendingMovies = movies?.slice(0, 6) || []
  const popularMovies = movies?.slice(6, 12) || []

  return (
    <div className="min-h-screen gradient-bg">
      {/* Database Status - Only show if there are issues */}
      {error && (
        <div className="fixed top-20 left-4 right-4 z-40 max-w-md mx-auto">
          <div className="bg-red-500/10 backdrop-blur-lg rounded-lg border border-red-500/30 p-4 shadow-lg">
            <div className="flex items-center space-x-2 space-x-reverse mb-2">
              <Database className="h-4 w-4 text-red-400" />
              <span className="text-red-300 text-sm font-medium">مشكلة في قاعدة البيانات</span>
            </div>
            <SupabaseStatus />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <Hero />
      
      {/* Stats Section */}
      <section className="py-16 bg-black/50">
        <div className="container-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 p-6 rounded-xl border border-red-500/20">
              <Film className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{films?.length || 0}</div>
              <div className="text-gray-400 text-sm">فيلم</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-6 rounded-xl border border-blue-500/20">
              <Tv className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{series?.length || 0}</div>
              <div className="text-gray-400 text-sm">مسلسل</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-6 rounded-xl border border-yellow-500/20">
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">8.5</div>
              <div className="text-gray-400 text-sm">متوسط التقييم</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-6 rounded-xl border border-green-500/20">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1.2M</div>
              <div className="text-gray-400 text-sm">مشاهدة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Show error message if database connection fails */}
      {error && (
        <section className="py-8 bg-red-500/10">
          <div className="container-responsive">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-red-300 mb-3">مشكلة في الاتصال بقاعدة البيانات</h3>
              <p className="text-red-200 mb-4">
                يبدو أن هناك مشكلة في الاتصال بـ Supabase. يرجى التحقق من إعدادات قاعدة البيانات.
              </p>
              <Link href="/admin" className="btn-primary">
                انتقل إلى لوحة التحكم
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trending Section */}
      {trendingMovies.length > 0 && (
        <section className="py-16">
          <div className="container-responsive">
            <div className="section-header">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <Flame className="h-8 w-8 text-red-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">الأكثر مشاهدة</h2>
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">HOT</div>
              </div>
              <p className="text-gray-400 mb-8">المحتوى الأكثر شعبية هذا الأسبوع</p>
            </div>
            <MovieGrid movies={trendingMovies} title="" showViewAll={true} />
          </div>
        </section>
      )}

      {/* Latest Additions */}
      {movies && movies.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-gray-900/50 to-black/50">
          <div className="container-responsive">
            <div className="section-header">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <Clock className="h-8 w-8 text-blue-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">أحدث الإضافات</h2>
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">جديد</div>
              </div>
              <p className="text-gray-400 mb-8">آخر الأفلام والمسلسلات المضافة</p>
            </div>
            <MovieGrid movies={movies.slice(0, 12)} title="" />
            
            <div className="text-center mt-12">
              <Link 
                href="/movies" 
                className="btn-primary inline-flex items-center space-x-2 space-x-reverse"
              >
                <span>استكشاف المزيد</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Movies Section */}
      {films && films.length > 0 && (
        <section className="py-16">
          <div className="container-responsive">
            <div className="section-header">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <Film className="h-8 w-8 text-purple-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">الأفلام</h2>
              </div>
              <p className="text-gray-400 mb-8">مجموعة متنوعة من أفضل الأفلام</p>
            </div>
            <MovieGrid movies={films.slice(0, 8)} title="" />
            
            <div className="text-center mt-12">
              <Link 
                href="/movies" 
                className="btn-secondary inline-flex items-center space-x-2 space-x-reverse"
              >
                <Film className="h-5 w-5" />
                <span>عرض جميع الأفلام</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Series Section */}
      {series && series.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
          <div className="container-responsive">
            <div className="section-header">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <Tv className="h-8 w-8 text-green-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">المسلسلات</h2>
              </div>
              <p className="text-gray-400 mb-8">أفضل المسلسلات والحلقات المثيرة</p>
            </div>
            <MovieGrid movies={series.slice(0, 8)} title="" />
            
            <div className="text-center mt-12">
              <Link 
                href="/series" 
                className="btn-secondary inline-flex items-center space-x-2 space-x-reverse"
              >
                <Tv className="h-5 w-5" />
                <span>عرض جميع المسلسلات</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Popular Movies */}
      {popularMovies.length > 0 && (
        <section className="py-16">
          <div className="container-responsive">
            <div className="section-header">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <Star className="h-8 w-8 text-yellow-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">الأعلى تقييماً</h2>
              </div>
              <p className="text-gray-400 mb-8">المحتوى الحاصل على أعلى التقييمات</p>
            </div>
            <MovieGrid movies={popularMovies} title="" />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600/20 via-purple-600/20 to-blue-600/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container-responsive relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            استمتع بأفضل الأفلام والمسلسلات
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            شاهد آلاف الأفلام والمسلسلات بجودة عالية ومجاناً تماماً
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/movies" className="btn-primary">
              <Film className="h-5 w-5" />
              <span>تصفح الأفلام</span>
            </Link>
            <Link href="/series" className="btn-secondary">
              <Tv className="h-5 w-5" />
              <span>تصفح المسلسلات</span>
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </section>
    </div>
  )
}