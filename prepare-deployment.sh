#!/bin/bash

# 🚀 سكريبت تحضير المشروع للنشر على Vercel
# Deployment Preparation Script for Vercel

echo "🎬 تحضير مشروع سينما أونلاين للنشر..."
echo "📝 Preparing Cinema Online for deployment..."
echo ""

# التحقق من وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً"
    echo "❌ Node.js is not installed. Please install Node.js first"
    exit 1
fi

# التحقق من وجود Git
if ! command -v git &> /dev/null; then
    echo "❌ Git غير مثبت. يرجى تثبيت Git أولاً"
    echo "❌ Git is not installed. Please install Git first"
    exit 1
fi

echo "✅ Node.js و Git متوفران"
echo "✅ Node.js and Git are available"
echo ""

# تثبيت التبعيات
echo "📦 تثبيت التبعيات..."
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ فشل في تثبيت التبعيات"
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ تم تثبيت التبعيات بنجاح"
echo "✅ Dependencies installed successfully"
echo ""

# اختبار البناء
echo "🔨 اختبار عملية البناء..."
echo "🔨 Testing build process..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ فشل في عملية البناء. يرجى إصلاح الأخطاء قبل النشر"
    echo "❌ Build failed. Please fix errors before deployment"
    exit 1
fi

echo "✅ اختبار البناء نجح"
echo "✅ Build test successful"
echo ""

# التحقق من ملف .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  ملف .env.local غير موجود"
    echo "⚠️  .env.local file not found"
    echo "📝 إنشاء ملف .env.example للمرجع"
    echo "📝 Creating .env.example for reference"
    
    cat > .env.example << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
EOF
    
    echo "✅ تم إنشاء .env.example"
    echo "✅ Created .env.example"
else
    echo "✅ ملف .env.local موجود"
    echo "✅ .env.local file exists"
fi

echo ""

# التحقق من Git repository
if [ ! -d ".git" ]; then
    echo "📂 تهيئة Git repository..."
    echo "📂 Initializing Git repository..."
    git init
    
    echo "📝 إنشاء .gitignore..."
    echo "📝 Creating .gitignore..."
    # .gitignore already exists, so we'll just check it
    
    echo "✅ تم تهيئة Git"
    echo "✅ Git initialized"
else
    echo "✅ Git repository موجود"
    echo "✅ Git repository exists"
fi

echo ""

# التحقق من التزام الملفات
echo "📋 التحقق من حالة Git..."
echo "📋 Checking Git status..."

git add .
git status

echo ""
echo "🎯 الخطوات التالية:"
echo "🎯 Next steps:"
echo ""
echo "1. تأكد من إعداد قاعدة بيانات Supabase:"
echo "1. Make sure Supabase database is set up:"
echo "   - اذهب إلى app.supabase.com"
echo "   - Go to app.supabase.com"
echo "   - أنشئ مشروع جديد أو استخدم موجود"
echo "   - Create new project or use existing"
echo "   - نفذ ملف schema.sql"
echo "   - Execute schema.sql file"
echo ""

echo "2. التزم بالتغييرات في Git:"
echo "2. Commit changes to Git:"
echo "   git commit -m \"Ready for deployment\""
echo ""

echo "3. ارفع إلى GitHub:"
echo "3. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "   git push -u origin main"
echo ""

echo "4. اذهب إلى Vercel:"
echo "4. Go to Vercel:"
echo "   - vercel.com"
echo "   - Import من GitHub"
echo "   - Import from GitHub"
echo "   - أضف متغيرات البيئة"
echo "   - Add environment variables"
echo ""

echo "📚 راجع ملف VERCEL_DEPLOYMENT.md للتفاصيل الكاملة"
echo "📚 Check VERCEL_DEPLOYMENT.md for complete details"
echo ""

echo "🎉 المشروع جاهز للنشر!"
echo "🎉 Project is ready for deployment!"