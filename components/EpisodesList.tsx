'use client'

import { useState } from 'react'
import { Play, Clock } from 'lucide-react'
import type { Episode } from '@/lib/supabase'

interface EpisodesListProps {
  episodes: Episode[]
  movieId: string
}

export default function EpisodesList({ episodes, movieId }: EpisodesListProps) {
  const [selectedSeason, setSelectedSeason] = useState<number>(1)
  
  // Group episodes by season
  const episodesBySeason = episodes.reduce((acc, episode) => {
    if (!acc[episode.season_number]) {
      acc[episode.season_number] = []
    }
    acc[episode.season_number].push(episode)
    return acc
  }, {} as Record<number, Episode[]>)

  const seasons = Object.keys(episodesBySeason).map(Number).sort((a, b) => a - b)
  const currentSeasonEpisodes = episodesBySeason[selectedSeason] || []

  if (episodes.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">حلقات المسلسل</h2>
      
      {/* Season Selector */}
      {seasons.length > 1 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {seasons.map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSeason === season
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                الموسم {season}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentSeasonEpisodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} movieId={movieId} />
        ))}
      </div>
    </div>
  )
}

function EpisodeCard({ episode, movieId }: { episode: Episode; movieId: string }) {
  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors group">
      <div className="relative">
        {/* Thumbnail */}
        <div className="aspect-video bg-gray-600 flex items-center justify-center">
          {episode.thumbnail_url ? (
            <img
              src={episode.thumbnail_url}
              alt={episode.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <Play className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm">الحلقة {episode.episode_number}</span>
            </div>
          )}
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
          <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold mb-2 line-clamp-2">
          الحلقة {episode.episode_number}: {episode.title}
        </h3>
        
        {episode.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {episode.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {episode.duration && (
            <div className="flex items-center text-gray-400 text-sm space-x-1 space-x-reverse">
              <Clock className="h-4 w-4" />
              <span>{episode.duration} دقيقة</span>
            </div>
          )}
          
          <a
            href={`/watch/${movieId}?episode=${episode.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            مشاهدة
          </a>
        </div>
      </div>
    </div>
  )
}
