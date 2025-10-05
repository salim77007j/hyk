'use client'

import { useState } from 'react'
import { Play, Star, Calendar, Clock, Share2, Bookmark } from 'lucide-react'
import StreamingPlayer from './StreamingPlayer'
import type { Movie, Episode, StreamingLink } from '@/lib/supabase'

interface MovieDetailsProps {
  movie: Movie
  episodes?: Episode[] | null
  streamingLinks?: StreamingLink[] | null
}

export default function MovieDetails({ movie, episodes, streamingLinks }: MovieDetailsProps) {
  const [showPlayer, setShowPlayer] = useState(false)
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)

  const handleWatch = (episode?: Episode) => {
    setSelectedEpisode(episode || null)
    setShowPlayer(true)
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={movie.backdrop_url || movie.poster_url || 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=No+Image'}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <img
              src={movie.poster_url || 'https://via.placeholder.com/400x600/1f2937/ffffff?text=No+Image'}
              alt={movie.title}
              className="w-full max-w-sm mx-auto lg:mx-0 rounded-lg shadow-2xl"
            />
          </div>

          {/* Details */}
          <div className="lg:col-span-2 text-center lg:text-right">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {movie.title}
            </h1>
            
            {movie.title_en && (
              <h2 className="text-2xl text-gray-300 mb-6">{movie.title_en}</h2>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mb-6 text-gray-300">
              <div className="flex items-center space-x-1 space-x-reverse">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{movie.rating?.toFixed(1) || '0.0'}</span>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <Calendar className="h-5 w-5" />
                <span>{movie.release_year}</span>
              </div>
              {movie.duration && (
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Clock className="h-5 w-5" />
                  <span>{movie.duration} دقيقة</span>
                </div>
              )}
              <div className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                {movie.type === 'movie' ? 'فيلم' : 'مسلسل'}
              </div>
            </div>

            {/* Genres */}
            {movie.genre && movie.genre.length > 0 && (
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                {movie.genre.map((genre, index) => (
                  <span 
                    key={index}
                    className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {movie.description && (
              <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-3xl">
                {movie.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button
                onClick={() => handleWatch()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse"
              >
                <Play className="h-6 w-6" />
                <span>مشاهدة الآن</span>
              </button>
              
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse">
                <Bookmark className="h-5 w-5" />
                <span>إضافة للمفضلة</span>
              </button>
              
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse">
                <Share2 className="h-5 w-5" />
                <span>مشاركة</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Streaming Player Modal */}
      {showPlayer && (
        <StreamingPlayer
          movie={movie}
          episode={selectedEpisode}
          streamingLinks={streamingLinks}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  )
}
