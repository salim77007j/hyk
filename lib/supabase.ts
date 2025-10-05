import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Movie {
  id: string
  title: string
  title_en?: string
  description: string
  poster_url: string
  backdrop_url?: string
  release_year: number
  duration: number
  genre: string[]
  rating: number
  type: 'movie' | 'series'
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Episode {
  id: string
  movie_id: string
  season_number: number
  episode_number: number
  title: string
  description?: string
  duration: number
  thumbnail_url?: string
  created_at: string
}

export interface StreamingLink {
  id: string
  movie_id: string
  episode_id?: string
  server_name: string
  quality: string
  url: string
  embed_code?: string
  is_active: boolean
  created_at: string
}

export interface Admin {
  id: string
  email: string
  password_hash: string
  name: string
  role: 'admin' | 'moderator'
  created_at: string
}

export interface MovieView {
  id: string
  movie_id: string
  episode_id?: string
  ip_address?: string
  user_agent?: string
  viewed_at: string
}

// Database Response Type
export interface DatabaseResponse<T> {
  data: T | null
  error: any
}

// Public Functions (للعرض العام)
export const getMovies = async (type?: 'movie' | 'series', limit?: number): Promise<DatabaseResponse<Movie[]>> => {
  try {
    let query = supabase
      .from('movies')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('type', type)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching movies:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error in getMovies:', error)
    return { data: null, error: 'Failed to fetch movies' }
  }
}

export const getMovieById = async (id: string): Promise<DatabaseResponse<Movie>> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (error) {
      console.error('Error fetching movie by ID:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error in getMovieById:', error)
    return { data: null, error: 'Failed to fetch movie details' }
  }
}

export const getEpisodes = async (movieId: string): Promise<DatabaseResponse<Episode[]>> => {
  try {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('movie_id', movieId)
      .order('season_number', { ascending: true })
      .order('episode_number', { ascending: true })

    if (error) {
      console.error('Error fetching episodes:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error in getEpisodes:', error)
    return { data: null, error: 'Failed to fetch episodes' }
  }
}

export const getStreamingLinks = async (movieId: string, episodeId?: string): Promise<DatabaseResponse<StreamingLink[]>> => {
  try {
    let query = supabase
      .from('streaming_links')
      .select('*')
      .eq('movie_id', movieId)
      .eq('is_active', true)
      .order('quality', { ascending: false })

    if (episodeId) {
      query = query.eq('episode_id', episodeId)
    } else {
      query = query.is('episode_id', null)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching streaming links:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error in getStreamingLinks:', error)
    return { data: null, error: 'Failed to fetch streaming links' }
  }
}

export const searchMovies = async (query: string): Promise<DatabaseResponse<Movie[]>> => {
  try {
    if (!query || query.trim().length < 2) {
      return { data: [], error: null }
    }

    const searchTerm = query.trim()
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,title_en.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('status', 'active')
      .order('rating', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error searching movies:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error in searchMovies:', error)
    return { data: null, error: 'Failed to search movies' }
  }
}

export const getTopRatedMovies = async (limit: number = 10): Promise<DatabaseResponse<Movie[]>> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('status', 'active')
      .order('rating', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching top rated movies:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error in getTopRatedMovies:', error)
    return { data: null, error: 'Failed to fetch top rated movies' }
  }
}

export const getMoviesByGenre = async (genre: string, limit: number = 10): Promise<DatabaseResponse<Movie[]>> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .contains('genre', [genre])
      .eq('status', 'active')
      .order('rating', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching movies by genre:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error in getMoviesByGenre:', error)
    return { data: null, error: 'Failed to fetch movies by genre' }
  }
}

// Analytics Functions
export const addMovieView = async (movieId: string, episodeId?: string): Promise<DatabaseResponse<any>> => {
  try {
    const viewData: Partial<MovieView> = {
      movie_id: movieId,
      episode_id: episodeId || undefined,
    }

    const { data, error } = await supabase
      .from('movie_views')
      .insert([viewData])

    if (error) {
      console.error('Error adding movie view:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error in addMovieView:', error)
    return { data: null, error: 'Failed to record view' }
  }
}

// Admin Functions (تحتاج مصادقة)
export const createMovie = async (movieData: Omit<Movie, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResponse<Movie>> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .insert([movieData])
      .select()
      .single()

    if (error) {
      console.error('Error creating movie:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error in createMovie:', error)
    return { data: null, error: 'Failed to create movie' }
  }
}

export const updateMovie = async (id: string, updates: Partial<Movie>): Promise<DatabaseResponse<Movie>> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating movie:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error in updateMovie:', error)
    return { data: null, error: 'Failed to update movie' }
  }
}

export const deleteMovie = async (id: string): Promise<DatabaseResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting movie:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error in deleteMovie:', error)
    return { data: null, error: 'Failed to delete movie' }
  }
}

export const createStreamingLink = async (linkData: Omit<StreamingLink, 'id' | 'created_at'>): Promise<DatabaseResponse<StreamingLink>> => {
  try {
    const { data, error } = await supabase
      .from('streaming_links')
      .insert([linkData])
      .select()
      .single()

    if (error) {
      console.error('Error creating streaming link:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error in createStreamingLink:', error)
    return { data: null, error: 'Failed to create streaming link' }
  }
}

export const createEpisode = async (episodeData: Omit<Episode, 'id' | 'created_at'>): Promise<DatabaseResponse<Episode>> => {
  try {
    const { data, error } = await supabase
      .from('episodes')
      .insert([episodeData])
      .select()
      .single()

    if (error) {
      console.error('Error creating episode:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error in createEpisode:', error)
    return { data: null, error: 'Failed to create episode' }
  }
}

// Authentication Functions
export const signInAdmin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error signing in admin:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error in signInAdmin:', error)
    return { data: null, error: 'Failed to sign in' }
  }
}

export const signOutAdmin = async () => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out admin:', error)
      return { error }
    }

    return { error: null }
  } catch (error) {
    console.error('Unexpected error in signOutAdmin:', error)
    return { error: 'Failed to sign out' }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Error getting current user:', error)
      return { data: null, error }
    }

    return { data: user, error: null }
  } catch (error) {
    console.error('Unexpected error in getCurrentUser:', error)
    return { data: null, error: 'Failed to get current user' }
  }
}

// Connection Test Function
export const testConnection = async (): Promise<DatabaseResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('count(*)')
      .limit(1)

    if (error) {
      console.error('Connection test failed:', error)
      return { data: null, error }
    }

    return { data: { connected: true, message: 'Successfully connected to Supabase' }, error: null }
  } catch (error) {
    console.error('Connection test error:', error)
    return { data: null, error: 'Failed to connect to Supabase' }
  }
}