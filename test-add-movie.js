#!/usr/bin/env node

// Test script to add a sample movie to the database
// Run with: node test-add-movie.js

const { createMovie, createStreamingLink, testConnection } = require('./lib/supabase');

async function addSampleMovie() {
  console.log('🎬 Testing movie addition...\n');

  // Test connection first
  console.log('1. Testing database connection...');
  const { error: connectionError } = await testConnection();
  if (connectionError) {
    console.error('❌ Database connection failed:', connectionError);
    return;
  }
  console.log('✅ Database connection successful\n');

  // Sample movie data
  const movieData = {
    title: 'الأسود يليق بك',
    title_en: 'Black Panther',
    description: 'تشالا، وريث المملكة الأفريقية المعزولة واكاندا، يجب أن يتولى العرش ويقود شعبه إلى مستقبل جديد بينما يواجه تحديات داخلية وخارجية.',
    poster_url: 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/b6ZJZHUdMEFECvGiDpjjlfUWela.jpg',
    release_year: 2018,
    duration: 134,
    genre: ['أكشن', 'مغامرة', 'خيال علمي'],
    rating: 8.5,
    type: 'movie',
    status: 'active'
  };

  // Add movie
  console.log('2. Adding sample movie...');
  const { data: movie, error: movieError } = await createMovie(movieData);
  
  if (movieError) {
    console.error('❌ Failed to add movie:', movieError);
    return;
  }

  console.log('✅ Movie added successfully!');
  console.log('📋 Movie details:');
  console.log(`   ID: ${movie.id}`);
  console.log(`   Title: ${movie.title}`);
  console.log(`   Title (EN): ${movie.title_en}`);
  console.log(`   Year: ${movie.release_year}`);
  console.log(`   Rating: ${movie.rating}\n`);

  // Add streaming links
  console.log('3. Adding streaming links...');
  
  const streamingLinks = [
    {
      movie_id: movie.id,
      server_name: 'دودستريم',
      quality: '1080p',
      url: 'https://example.com/movie1-1080p',
      embed_code: null,
      is_active: true
    },
    {
      movie_id: movie.id,
      server_name: 'فيدبوم',
      quality: '720p',
      url: 'https://example.com/movie1-720p',
      embed_code: null,
      is_active: true
    }
  ];

  for (let i = 0; i < streamingLinks.length; i++) {
    const { error: linkError } = await createStreamingLink(streamingLinks[i]);
    
    if (linkError) {
      console.error(`❌ Failed to add streaming link ${i + 1}:`, linkError);
    } else {
      console.log(`✅ Streaming link ${i + 1} added successfully (${streamingLinks[i].server_name} - ${streamingLinks[i].quality})`);
    }
  }

  console.log('\n🎉 Sample movie setup completed!');
  console.log('💡 You can now:');
  console.log('   1. Go to http://localhost:3000 to see the movie on the homepage');
  console.log('   2. Go to http://localhost:3000/admin/dashboard to manage movies');
  console.log('   3. Click on the movie to test the viewing experience');
}

// Run the test
addSampleMovie().catch(console.error);