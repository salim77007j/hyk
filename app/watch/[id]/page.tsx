import { notFound } from 'next/navigation'
import { getMovieById, getStreamingLinks } from '@/lib/supabase'
import StreamingPlayer from '@/components/StreamingPlayer'

interface WatchPageProps {
  params: {
    id: string
  }
  searchParams: {
    episode?: string
  }
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { data: movie, error } = await getMovieById(params.id)
  
  if (error || !movie) {
    notFound()
  }

  const { data: streamingLinks } = await getStreamingLinks(movie.id, searchParams.episode)

  return (
    <div className="min-h-screen bg-black">
      <StreamingPlayer
        movie={movie}
        episode={searchParams.episode ? { id: searchParams.episode } as any : null}
        streamingLinks={streamingLinks}
        onClose={() => window.history.back()}
      />
    </div>
  )
}

export async function generateMetadata({ params }: WatchPageProps) {
  const { data: movie } = await getMovieById(params.id)
  
  if (!movie) {
    return {
      title: 'لم يتم العثور على المحتوى',
    }
  }

  return {
    title: `مشاهدة ${movie.title} - سينما أونلاين`,
    description: `مشاهدة ${movie.title} مجاناً بجودة عالية`,
  }
}
