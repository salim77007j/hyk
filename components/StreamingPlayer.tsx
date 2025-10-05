'use client'

import { useState } from 'react'
import { X, Monitor, Smartphone, Tv as TvIcon } from 'lucide-react'
import type { Movie, Episode, StreamingLink } from '@/lib/supabase'

interface StreamingPlayerProps {
  movie: Movie
  episode?: Episode | null
  streamingLinks?: StreamingLink[] | null
  onClose: () => void
}

export default function StreamingPlayer({ movie, episode, streamingLinks, onClose }: StreamingPlayerProps) {
  const [selectedServer, setSelectedServer] = useState<StreamingLink | null>(
    streamingLinks && streamingLinks.length > 0 ? streamingLinks[0] : null
  )
  const [selectedQuality, setSelectedQuality] = useState<string>('720p')

  // Filter links for current episode (or movie)
  const availableLinks = streamingLinks?.filter(link => 
    episode ? link.episode_id === episode.id : !link.episode_id
  ) || []

  // Group by server
  const serverGroups = availableLinks.reduce((groups, link) => {
    if (!groups[link.server_name]) {
      groups[link.server_name] = []
    }
    groups[link.server_name].push(link)
    return groups
  }, {} as Record<string, StreamingLink[]>)

  const getServerIcon = (serverName: string) => {
    switch (serverName.toLowerCase()) {
      case 'doodstream':
        return <Monitor className="h-4 w-4" />
      case 'uqload':
        return <Smartphone className="h-4 w-4" />
      default:
        return <TvIcon className="h-4 w-4" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl font-semibold">
              {movie.title}
            </h2>
            {episode && (
              <p className="text-gray-300 text-sm">
                الموسم {episode.season_number} - الحلقة {episode.episode_number}: {episode.title}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Player */}
      <div className="flex h-full">
        {/* Video Player */}
        <div className="flex-1 flex items-center justify-center">
          {selectedServer ? (
            <div className="w-full h-full flex items-center justify-center">
              {selectedServer.embed_code ? (
                <div 
                  className="w-full h-full max-w-6xl max-h-[80vh]" 
                  dangerouslySetInnerHTML={{ __html: selectedServer.embed_code }}
                />
              ) : (
                <iframe
                  src={selectedServer.url}
                  className="w-full h-full max-w-6xl max-h-[80vh]"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              )}
            </div>
          ) : (
            <div className="text-center text-white">
              <TvIcon className="h-16 w-16 mx-auto mb-4 text-gray-500" />
              <p className="text-xl">لا توجد روابط متاحة للمشاهدة</p>
              <p className="text-gray-400 mt-2">يرجى المحاولة لاحقاً</p>
            </div>
          )}
        </div>

        {/* Sidebar - Servers and Quality */}
        {availableLinks.length > 0 && (
          <div className="w-80 bg-gray-900 p-4 overflow-y-auto">
            <h3 className="text-white font-semibold mb-4">خوادم البث</h3>
            
            <div className="space-y-4">
              {Object.entries(serverGroups).map(([serverName, links]) => (
                <div key={serverName}>
                  <h4 className="text-gray-300 font-medium mb-2 flex items-center space-x-2 space-x-reverse">
                    {getServerIcon(serverName)}
                    <span>{serverName}</span>
                  </h4>
                  
                  <div className="space-y-2">
                    {links.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => setSelectedServer(link)}
                        className={`w-full text-right p-3 rounded-lg transition-colors ${
                          selectedServer?.id === link.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{link.quality}</span>
                          <span className="text-xs">{serverName}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h4 className="text-white font-medium mb-2">تعليمات المشاهدة</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• اختر الخادم المناسب</li>
                <li>• في حالة عدم العمل جرب خادم آخر</li>
                <li>• انتظر قليلاً لتحميل الفيديو</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
