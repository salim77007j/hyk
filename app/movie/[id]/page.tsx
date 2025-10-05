import { notFound } from 'next/navigation'
import { getMovieById, getEpisodes, getStreamingLinks } from '@/lib/supabase'
import MovieDetails from '@/components/MovieDetails'
import EpisodesList from '@/components/EpisodesList'
import StreamingPlayer from '@/components/StreamingPlayer'

interface MoviePageProps {
  params: {
    id: string
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { data: movie, error } = await getMovieById(params.id)
  
  if (error || !movie) {
    notFound()
  }

  const { data: episodes } = movie.type === 'series' ? await getEpisodes(movie.id) : { data: null }
  const { data: streamingLinks } = await getStreamingLinks(movie.id)

  return (
    <div className="min-h-screen">
      <MovieDetails 
        movie={movie} 
        episodes={episodes} 
        streamingLinks={streamingLinks}
      />
      
      {movie.type === 'series' && episodes && episodes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <EpisodesList episodes={episodes} movieId={movie.id} />
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: MoviePageProps) {
  const { data: movie } = await getMovieById(params.id)
  
  if (!movie) {
    return {
      title: 'لم يتم العثور على المحتوى',
    }
  }

  return {
    title: `${movie.title} - سينما أونلاين`,
    description: movie.description || `شاهد ${movie.title} مجاناً بجودة عالية`,
  }
}
