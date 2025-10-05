-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Movies and Series table
CREATE TABLE IF NOT EXISTS movies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description TEXT,
    poster_url TEXT,
    backdrop_url TEXT,
    release_year INTEGER,
    duration INTEGER, -- in minutes
    genre TEXT[] DEFAULT '{}', -- array of genres
    rating DECIMAL(3,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 10),
    type VARCHAR(10) CHECK (type IN ('movie', 'series')) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Episodes table (for series)
CREATE TABLE IF NOT EXISTS episodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL CHECK (season_number > 0),
    episode_number INTEGER NOT NULL CHECK (episode_number > 0),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER, -- in minutes
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(movie_id, season_number, episode_number)
);

-- Streaming links table
CREATE TABLE IF NOT EXISTS streaming_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    server_name VARCHAR(50) NOT NULL, -- doodstream, uqload, etc.
    quality VARCHAR(10) NOT NULL, -- 720p, 1080p, etc.
    url TEXT NOT NULL,
    embed_code TEXT, -- for iframe embedding
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure either movie_id or episode_id is set, but not both for episodes
    CONSTRAINT streaming_link_target CHECK (
        (movie_id IS NOT NULL AND episode_id IS NULL) OR 
        (movie_id IS NOT NULL AND episode_id IS NOT NULL)
    )
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'moderator')) DEFAULT 'moderator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Views table for analytics
CREATE TABLE IF NOT EXISTS movie_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table (for future use)
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- For future user authentication
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

-- Comments table (for future use)
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    user_name VARCHAR(100),
    comment TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_movies_type ON movies(type);
CREATE INDEX IF NOT EXISTS idx_movies_status ON movies(status);
CREATE INDEX IF NOT EXISTS idx_movies_rating ON movies(rating DESC);
CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies USING GIN(genre);
CREATE INDEX IF NOT EXISTS idx_movies_release_year ON movies(release_year DESC);
CREATE INDEX IF NOT EXISTS idx_movies_created_at ON movies(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_episodes_movie_id ON episodes(movie_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season_episode ON episodes(movie_id, season_number, episode_number);

CREATE INDEX IF NOT EXISTS idx_streaming_links_movie_id ON streaming_links(movie_id);
CREATE INDEX IF NOT EXISTS idx_streaming_links_episode_id ON streaming_links(episode_id);
CREATE INDEX IF NOT EXISTS idx_streaming_links_active ON streaming_links(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_movie_views_movie_id ON movie_views(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_views_viewed_at ON movie_views(viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user_movie ON favorites(user_id, movie_id);

CREATE INDEX IF NOT EXISTS idx_comments_movie_approved ON comments(movie_id, is_approved) WHERE is_approved = true;

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_movies_search ON movies USING GIN(
    to_tsvector('arabic', coalesce(title, '') || ' ' || coalesce(title_en, '') || ' ' || coalesce(description, ''))
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_movies_updated_at ON movies;
CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update movie rating based on comments
CREATE OR REPLACE FUNCTION update_movie_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE movies 
    SET rating = (
        SELECT COALESCE(ROUND(AVG(rating::numeric), 1), 0)
        FROM comments 
        WHERE movie_id = COALESCE(NEW.movie_id, OLD.movie_id) 
        AND is_approved = true 
        AND rating IS NOT NULL
    )
    WHERE id = COALESCE(NEW.movie_id, OLD.movie_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger to update rating when comments change
DROP TRIGGER IF EXISTS update_rating_on_comment ON comments;
CREATE TRIGGER update_rating_on_comment 
    AFTER INSERT OR UPDATE OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_movie_rating();

-- Enable Row Level Security
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaming_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Public read access for active movies" ON movies
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public read access for episodes" ON episodes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM movies 
            WHERE movies.id = episodes.movie_id 
            AND movies.status = 'active'
        )
    );

CREATE POLICY "Public read access for active streaming links" ON streaming_links
    FOR SELECT USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM movies 
            WHERE movies.id = streaming_links.movie_id 
            AND movies.status = 'active'
        )
    );

CREATE POLICY "Public insert access for views" ON movie_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for approved comments" ON comments
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Public insert access for comments" ON comments
    FOR INSERT WITH CHECK (true);

-- Admin policies (requires authentication)
CREATE POLICY "Admin full access to movies" ON movies
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to episodes" ON episodes
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to streaming links" ON streaming_links
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin read access to admins" ON admins
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin read access to views" ON movie_views
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to comments" ON comments
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert some sample data for testing (optional)
INSERT INTO movies (title, title_en, description, poster_url, backdrop_url, release_year, duration, genre, rating, type, status) VALUES
('فيلم الأكشن', 'Action Movie', 'فيلم أكشن مثير مليء بالمغامرات والإثارة', 'https://images.unsplash.com/photo-1489599849323-2e0c27b45f4b?w=300&h=450&fit=crop', 'https://images.unsplash.com/photo-1489599849323-2e0c27b45f4b?w=1920&h=1080&fit=crop', 2024, 120, '{أكشن,مغامرة}', 8.5, 'movie', 'active'),
('مسلسل الدراما', 'Drama Series', 'مسلسل درامي يحكي قصة عائلة عبر الأجيال', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop', 2024, 45, '{دراما,عائلي}', 9.2, 'series', 'active'),
('فيلم الخيال العلمي', 'Sci-Fi Movie', 'رحلة مثيرة عبر الفضاء والزمن', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=1080&fit=crop', 2024, 135, '{خيال علمي,مغامرة}', 8.8, 'movie', 'active')
ON CONFLICT DO NOTHING;

-- Create a default admin user (password: admin123 - change this!)
-- You should hash the password properly in production
INSERT INTO admins (email, password_hash, name, role) VALUES
('admin@cinema.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'المدير العام', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'تم إنشاء قاعدة البيانات بنجاح! 🎬';
    RAISE NOTICE 'بيانات المدير الافتراضي:';
    RAISE NOTICE 'البريد الإلكتروني: admin@cinema.com';
    RAISE NOTICE 'كلمة المرور: admin123';
    RAISE NOTICE '⚠️  يرجى تغيير كلمة المرور فوراً!';
END $$;
