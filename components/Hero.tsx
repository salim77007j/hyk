'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, Star, Calendar, Clock, Plus, Info, TrendingUp, Zap } from 'lucide-react'

// Sample featured movie data (replace with real data from your database)
const featuredMovies = [
  {
    id: '1',
    title: 'أسطورة المحارب',
    description: 'ملحمة سينمائية عن محارب شجاع يخوض رحلة استثنائية لإنقاذ مملكته من الظلام. فيلم مليء بالمشاعر والإثارة والمغامرات الخيالية.',
    backdrop_url: 'https://images.unsplash.com/photo-1489599849323-2e0c27b45f4b?w=1920&h=1080&fit=crop&crop=center',
    poster_url: 'https://images.unsplash.com/photo-1489599849323-2e0c27b45f4b?w=300&h=450&fit=crop&crop=center',
    rating: 8.5,
    release_year: 2024,
    duration: 150,
    genre: ['أكشن', 'مغامرة', 'فانتازيا'],
    quality: '4K UHD',
    trending: true
  },
  {
    id: '2',
    title: 'عائلة الأسرار',
    description: 'دراما عائلية مؤثرة تكشف أسرار عائلة عبر ثلاثة أجيال. قصة عن الحب والخيانة والوفاء في قالب درامي متميز.',
    backdrop_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop&crop=center',
    poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop&crop=center',
    rating: 9.2,
    release_year: 2024,
    duration: 45,
    genre: ['دراما', 'عائلي', 'رومانسي'],
    quality: 'HD',
    trending: false
  },
  {
    id: '3',
    title: 'رحلة في الفضاء',
    description: 'فيلم خيال علمي مبهر يأخذك في رحلة مثيرة عبر المجرة. مؤثرات بصرية خيالية وقصة محبوكة بإتقان.',
    backdrop_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=1080&fit=crop&crop=center',
    poster_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop&crop=center',
    rating: 8.8,
    release_year: 2024,
    duration: 135,
    genre: ['خيال علمي', 'مغامرة', 'إثارة'],
    quality: '4K HDR',
    trending: true
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
      setImageLoaded(false)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const currentMovie = featuredMovies[currentSlide]

  return (
    <div 
      className="relative min-h-screen flex items-center justify-start overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentMovie.backdrop_url}
          alt={currentMovie.title}
          className={`w-full h-full object-cover transition-all duration-1000 transform ${
            imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Multiple overlay gradients for cinematic effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        <div className="absolute inset-0 hero-gradient opacity-40" />
      </div>

      {/* Animated particles background */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-10 left-10 w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-32 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-48 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-responsive py-20">
        <div className="max-w-3xl">
          {/* Trending Badge */}
          {currentMovie.trending && (
            <div className="flex items-center space-x-2 space-x-reverse mb-4 fade-in-up">
              <TrendingUp className="h-5 w-5 text-red-500" />
              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium border border-red-500/30">
                الأكثر مشاهدة
              </span>
            </div>
          )}

          {/* Title with Glow Effect */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white leading-tight fade-in-up">
            <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
              {currentMovie.title}
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl fade-in-up">
            {currentMovie.description}
          </p>

          {/* Movie Info Row */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-300 fade-in-up">
            {/* Rating */}
            <div className="flex items-center space-x-1 space-x-reverse bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-bold text-white">{currentMovie.rating}</span>
            </div>
            
            {/* Year */}
            <div className="flex items-center space-x-1 space-x-reverse bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span className="font-medium">{currentMovie.release_year}</span>
            </div>
            
            {/* Duration */}
            <div className="flex items-center space-x-1 space-x-reverse bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm">
              <Clock className="h-4 w-4 text-green-400" />
              <span className="font-medium">{currentMovie.duration} دقيقة</span>
            </div>

            {/* Quality Badge */}
            <div className="bg-red-500/20 text-red-300 px-3 py-2 rounded-lg font-bold text-sm border border-red-500/30">
              <Zap className="h-4 w-4 inline ml-1" />
              {currentMovie.quality}
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-8 fade-in-up">
            {currentMovie.genre.map((g, index) => (
              <span 
                key={index}
                className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 fade-in-up">
            <Link
              href={`/watch/${currentMovie.id}`}
              className="btn-primary group"
            >
              <Play className="h-6 w-6 transition-transform group-hover:scale-110" />
              <span>مشاهدة الآن</span>
            </Link>
            
            <Link
              href={`/movie/${currentMovie.id}`}
              className="btn-secondary group"
            >
              <Info className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>مزيد من التفاصيل</span>
            </Link>

            <button className="btn-secondary group">
              <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>إضافة للمفضلة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3 space-x-reverse bg-black/30 backdrop-blur-sm p-3 rounded-full">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index)
                setImageLoaded(false)
              }}
              className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 h-3 bg-red-500' 
                  : 'w-3 h-3 bg-white/30 hover:bg-white/50'
              }`}
            >
              {index === currentSlide && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Navigation Arrows */}
      <button
        onClick={() => {
          setCurrentSlide((prev) => prev === 0 ? featuredMovies.length - 1 : prev - 1)
          setImageLoaded(false)
        }}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 glass-effect p-4 rounded-full hover:bg-red-500/20 transition-all duration-300 group"
      >
        <svg className="h-6 w-6 text-white group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => {
          setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
          setImageLoaded(false)
        }}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 glass-effect p-4 rounded-full hover:bg-red-500/20 transition-all duration-300 group"
      >
        <svg className="h-6 w-6 text-white group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 right-8 z-20 animate-bounce">
        <svg className="h-6 w-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  )
}