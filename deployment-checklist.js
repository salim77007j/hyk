#!/usr/bin/env node

// Pre-deployment checklist and validation script
// تشغيل: node deployment-checklist.js

const fs = require('fs');
const path = require('path');

console.log('🚀 فحص جاهزية المشروع للنشر على Vercel');
console.log('🚀 Vercel Deployment Readiness Check');
console.log('=====================================\n');

let allChecksPass = true;

function checkStatus(description, condition, fix = '') {
  const status = condition ? '✅' : '❌';
  console.log(`${status} ${description}`);
  if (!condition && fix) {
    console.log(`   💡 الحل: ${fix}`);
    console.log(`   💡 Fix: ${fix}`);
  }
  if (!condition) allChecksPass = false;
  return condition;
}

// 1. التحقق من الملفات الأساسية
console.log('📁 فحص الملفات الأساسية | Checking Essential Files');
console.log('---------------------------------------------------');

checkStatus(
  'package.json موجود | package.json exists',
  fs.existsSync('package.json')
);

checkStatus(
  'next.config.js موجود | next.config.js exists',
  fs.existsSync('next.config.js')
);

checkStatus(
  'tsconfig.json موجود | tsconfig.json exists',
  fs.existsSync('tsconfig.json')
);

checkStatus(
  '.gitignore موجود | .gitignore exists',
  fs.existsSync('.gitignore')
);

// 2. التحقق من الملفات البيئية
console.log('\n🔧 فحص الإعدادات | Checking Configuration');
console.log('------------------------------------------');

const hasEnvExample = fs.existsSync('.env.example');
checkStatus(
  '.env.example موجود | .env.example exists',
  hasEnvExample,
  'أنشئ ملف .env.example مع المتغيرات المطلوبة'
);

const hasEnvLocal = fs.existsSync('.env.local');
checkStatus(
  '.env.local موجود (للتطوير) | .env.local exists (for development)',
  hasEnvLocal,
  'أنشئ ملف .env.local مع بيانات Supabase'
);

// 3. التحقق من محتوى package.json
console.log('\n📦 فحص package.json | Checking package.json');
console.log('----------------------------------------------');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  checkStatus(
    'build script موجود | build script exists',
    packageJson.scripts && packageJson.scripts.build
  );
  
  checkStatus(
    'start script موجود | start script exists',
    packageJson.scripts && packageJson.scripts.start
  );
  
  checkStatus(
    'Next.js dependency موجود | Next.js dependency exists',
    packageJson.dependencies && packageJson.dependencies.next
  );
  
  checkStatus(
    'Supabase dependency موجود | Supabase dependency exists',
    packageJson.dependencies && packageJson.dependencies['@supabase/supabase-js']
  );
} catch (error) {
  checkStatus('package.json صالح | package.json is valid', false);
}

// 4. التحقق من هيكل المشروع
console.log('\n🏗️ فحص هيكل المشروع | Checking Project Structure');
console.log('----------------------------------------------------');

checkStatus(
  'مجلد app موجود | app directory exists',
  fs.existsSync('app') && fs.statSync('app').isDirectory()
);

checkStatus(
  'مجلد components موجود | components directory exists',
  fs.existsSync('components') && fs.statSync('components').isDirectory()
);

checkStatus(
  'مجلد lib موجود | lib directory exists',
  fs.existsSync('lib') && fs.statSync('lib').isDirectory()
);

checkStatus(
  'ملف lib/supabase.ts موجود | lib/supabase.ts exists',
  fs.existsSync('lib/supabase.ts')
);

// 5. التحقق من الصفحات الأساسية
console.log('\n📄 فحص الصفحات الأساسية | Checking Essential Pages');
console.log('------------------------------------------------------');

checkStatus(
  'app/page.tsx موجود | app/page.tsx exists',
  fs.existsSync('app/page.tsx')
);

checkStatus(
  'app/layout.tsx موجود | app/layout.tsx exists',
  fs.existsSync('app/layout.tsx')
);

checkStatus(
  'app/admin/page.tsx موجود | app/admin/page.tsx exists',
  fs.existsSync('app/admin/page.tsx')
);

// 6. فحص Supabase schema
console.log('\n🗄️ فحص قاعدة البيانات | Checking Database');
console.log('-------------------------------------------');

checkStatus(
  'supabase/schema.sql موجود | supabase/schema.sql exists',
  fs.existsSync('supabase/schema.sql')
);

// 7. فحص ملفات الوثائق
console.log('\n📚 فحص الوثائق | Checking Documentation');
console.log('------------------------------------------');

checkStatus(
  'README.md موجود | README.md exists',
  fs.existsSync('README.md')
);

checkStatus(
  'VERCEL_DEPLOYMENT.md موجود | VERCEL_DEPLOYMENT.md exists',
  fs.existsSync('VERCEL_DEPLOYMENT.md')
);

// 8. فحص Git
console.log('\n📝 فحص Git | Checking Git');
console.log('---------------------------');

checkStatus(
  'Git repository مهيأ | Git repository initialized',
  fs.existsSync('.git')
);

// خلاصة النتائج
console.log('\n' + '='.repeat(50));
console.log('📊 خلاصة النتائج | Summary');
console.log('='.repeat(50));

if (allChecksPass) {
  console.log('🎉 جميع الفحوصات نجحت! المشروع جاهز للنشر');
  console.log('🎉 All checks passed! Project is ready for deployment');
  console.log('\n🚀 الخطوات التالية | Next Steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "Ready for deployment"');
  console.log('3. git push origin main');
  console.log('4. اذهب إلى vercel.com وانشر المشروع | Go to vercel.com and deploy');
  console.log('\n📖 راجع VERCEL_DEPLOYMENT.md للتفاصيل الكاملة');
  console.log('📖 Check VERCEL_DEPLOYMENT.md for complete details');
} else {
  console.log('⚠️ بعض الفحوصات فشلت. يرجى إصلاح المشاكل قبل النشر');
  console.log('⚠️ Some checks failed. Please fix issues before deployment');
}

console.log('\n' + '='.repeat(50));

// Return exit code
process.exit(allChecksPass ? 0 : 1);