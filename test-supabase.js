// اختبار الاتصال بـ Supabase
// تشغيل: node test-supabase.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log('🔍 اختبار الاتصال بـ Supabase...\n');

  // التحقق من متغيرات البيئة
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ متغيرات البيئة مفقودة:');
    if (!supabaseUrl) console.log('   - NEXT_PUBLIC_SUPABASE_URL غير موجود');
    if (!supabaseKey) console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY غير موجود');
    console.log('\n💡 تأكد من إنشاء ملف .env.local وإضافة المفاتيح الصحيحة');
    return;
  }

  console.log('✅ متغيرات البيئة موجودة');
  console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);
  console.log(`   Key: ${supabaseKey.substring(0, 20)}...\n`);

  try {
    // إنشاء عميل Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ تم إنشاء عميل Supabase');

    // اختبار الاتصال
    console.log('🔗 اختبار الاتصال بقاعدة البيانات...');
    const { data, error } = await supabase
      .from('movies')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.log('❌ خطأ في الاتصال:');
      console.log(`   ${error.message}`);
      console.log('\n🔧 التحقق من:');
      console.log('   1. صحة مفاتيح API في .env.local');
      console.log('   2. تنفيذ ملف schema.sql في Supabase');
      console.log('   3. إعدادات Row Level Security');
      return;
    }

    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!');

    // اختبار جدول الأفلام
    console.log('\n🎬 اختبار جدول الأفلام...');
    const { data: movies, error: moviesError } = await supabase
      .from('movies')
      .select('*')
      .limit(5);

    if (moviesError) {
      console.log('❌ خطأ في قراءة جدول الأفلام:');
      console.log(`   ${moviesError.message}`);
      return;
    }

    console.log(`✅ تم العثور على ${movies?.length || 0} أفلام في قاعدة البيانات`);

    if (movies && movies.length > 0) {
      console.log('\n📋 عينة من الأفلام:');
      movies.forEach((movie, index) => {
        console.log(`   ${index + 1}. ${movie.title} (${movie.type === 'movie' ? 'فيلم' : 'مسلسل'})`);
      });
    } else {
      console.log('   💡 لا توجد أفلام حالياً - يمكنك إضافة محتوى من لوحة التحكم');
    }

    // اختبار جداول أخرى
    console.log('\n🗂️ اختبار الجداول الأخرى...');
    
    const tables = [
      { name: 'episodes', label: 'الحلقات' },
      { name: 'streaming_links', label: 'روابط المشاهدة' },
      { name: 'movie_views', label: 'إحصائيات المشاهدة' }
    ];

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table.name)
          .select('count(*)')
          .limit(1);

        if (error) {
          console.log(`   ❌ ${table.label}: ${error.message}`);
        } else {
          console.log(`   ✅ ${table.label}: متاح`);
        }
      } catch (err) {
        console.log(`   ❌ ${table.label}: خطأ في الوصول`);
      }
    }

    console.log('\n🎉 اختبار الاتصال مكتمل!');
    console.log('\n🚀 يمكنك الآن تشغيل الموقع:');
    console.log('   npm run dev');
    console.log('\n🌐 ثم افتح المتصفح على:');
    console.log('   http://localhost:3000');

  } catch (error) {
    console.log('❌ خطأ غير متوقع:');
    console.log(`   ${error.message}`);
    console.log('\n🔧 تأكد من:');
    console.log('   1. تثبيت التبعيات: npm install');
    console.log('   2. صحة ملف .env.local');
    console.log('   3. إعداد Supabase بشكل صحيح');
  }
}

// تشغيل الاختبار
testSupabaseConnection().catch(console.error);