import Link from 'next/link'
import { Star, Calendar, Clock, Play, Plus, Eye, Heart, Zap, Flame } from 'lucide-react'
import { Movie } from '@/lib/supabase'
import { useState } from 'react'

interface MovieGridProps {
  movies: Movie[]
  title?: string
  showViewAll?: boolean
}

export default function MovieGrid({ movies, title = "الأفلام والمسلسلات", showViewAll = false }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="h-10 w-10 text-gray-600" />
          </div>
          <p className="text-gray-400 text-lg mb-2">لا توجد أفلام متاحة حالياً</p>
          <p className="text-gray-500 text-sm">تحقق من وجود محتوى جديد قريباً</p>
        </div>
      </div>
    )
  }

  return (
    <section className="py-8">
      {/* Section Header */}
      <div className="container-responsive mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
            {title.includes("الأكثر") && <Flame className="h-6 w-6 text-red-500" />}
          </div>
          {showViewAll && (
            <Link href="/movies" className="text-red-400 hover:text-red-300 font-medium transition-colors flex items-center space-x-2 space-x-reverse">
              <span>عرض الكل</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="container-responsive">
        <div className="movies-grid">
          {movies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div 
      className="movie-card card-hover fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/movie/${movie.id}`}>
        <div className="relative group">
          {/* Poster Image */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl">
            <img
              src={movie.poster_url || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop&crop=center'}
              alt={movie.title}
              className={`movie-poster transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                <Play className="h-8 w-8 text-gray-600" />
              </div>
            )}

            {/* Quality Badge */}
            <div className="quality-badge">
              <Zap className="h-3 w-3" />
              HD
            </div>

            {/* Rating Badge */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm font-bold flex items-center space-x-1 space-x-reverse">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span>{movie.rating?.toFixed(1) || '8.0'}</span>
            </div>

            {/* Type Badge */}
            <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
              movie.type === 'movie' 
                ? 'bg-blue-500/90 text-white' 
                : 'bg-purple-500/90 text-white'
            }`}>
              {movie.type === 'movie' ? 'فيلم' : 'مسلسل'}
            </div>

            {/* Hover Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`transform transition-all duration-300 ${
                  isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                }`}>
                  <div className="bg-red-500/90 backdrop-blur-sm p-4 rounded-full shadow-lg">
                    <Play className="h-8 w-8 text-white fill-current" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`absolute bottom-4 right-4 flex space-x-2 space-x-reverse transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-red-500/80 transition-all duration-200">
                  <Plus className="h-4 w-4 text-white" />
                </button>
                <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-red-500/80 transition-all duration-200">
                  <Heart className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="p-4 bg-gradient-to-b from-gray-900 to-black rounded-b-xl">
            <h3 className="text-white font-bold text-base mb-2 line-clamp-2 group-hover:text-red-400 transition-colors leading-tight">
              {movie.title}
            </h3>
            
            {/* Movie Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Calendar className="h-3 w-3 text-blue-400" />
                  <span className="font-medium">{movie.release_year || '2024'}</span>
                </div>
                {movie.duration && (
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Clock className="h-3 w-3 text-green-400" />
                    <span className="font-medium">{movie.duration} د</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Eye className="h-3 w-3 text-purple-400" />
                  <span className="font-medium">12K</span>
                </div>
              </div>
              
              {/* Genres */}
              {movie.genre && movie.genre.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {movie.genre.slice(0, 2).map((genre, idx) => (
                    <span 
                      key={idx}
                      className="bg-white/10 text-gray-300 px-2 py-1 rounded-full text-xs font-medium border border-white/20"
                    >
                      {genre}
                    </span>
                  ))}
                  {movie.genre.length > 2 && (
                    <span className="text-gray-500 text-xs font-medium px-1">+{movie.genre.length - 2}</span>
                  )}
                </div>
              )}
            </div>

            {/* Progress Bar (if applicable) */}
            <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
              <div className="bg-red-500 h-1 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}