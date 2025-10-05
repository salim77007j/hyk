#!/bin/bash

# 🎬 سينما أونلاين - سكريبت الإعداد السريع
# Quick Setup Script for Cinema Online

echo "🎬 مرحباً بك في سينما أونلاين! 🎬"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت. يرجى تثبيت Node.js 18+ أولاً."
    echo "   قم بزيارة: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js مثبت - الإصدار: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm غير مثبت."
    exit 1
fi

echo "✅ npm مثبت - الإصدار: $(npm --version)"
echo ""

# Install dependencies
echo "📦 تثبيت التبعيات..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ تم تثبيت التبعيات بنجاح"
else
    echo "❌ فشل في تثبيت التبعيات"
    exit 1
fi

echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  ملف .env.local غير موجود"
    echo ""
    echo "📋 إعداد متغيرات البيئة:"
    echo "   1. أنشئ مشروع جديد في Supabase: https://app.supabase.com"
    echo "   2. انسخ .env.example إلى .env.local"
    echo "   3. أضف URL ومفتاح Supabase"
    echo "   4. قم بتنفيذ ملف supabase/schema.sql في SQL Editor"
    echo ""
    
    read -p "هل تريد نسخ ملف .env.example إلى .env.local؟ (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env.local
        echo "✅ تم إنشاء ملف .env.local"
        echo "   يرجى تحديث القيم بمفاتيح Supabase الخاصة بك"
    fi
else
    echo "✅ ملف .env.local موجود"
fi

echo ""

# Check TypeScript configuration
if [ ! -f "tsconfig.json" ]; then
    echo "⚠️  ملف tsconfig.json غير موجود - سيتم إنشاؤه تلقائياً"
fi

echo ""
echo "🚀 الإعداد مكتمل!"
echo ""
echo "الخطوات التالية:"
echo "==============="
echo "1. 🗃️  إعداد Supabase:"
echo "   - اذهب إلى https://app.supabase.com"
echo "   - أنشئ مشروع جديد"
echo "   - انسخ URL ومفتاح API إلى .env.local"
echo "   - قم بتنفيذ supabase/schema.sql في SQL Editor"
echo ""
echo "2. 🎬 تشغيل الموقع:"
echo "   npm run dev"
echo ""
echo "3. 🌐 افتح المتصفح على:"
echo "   http://localhost:3000"
echo ""
echo "4. 👨‍💼 لوحة التحكم:"
echo "   http://localhost:3000/admin"
echo "   البريد: admin@cinema.com"
echo "   كلمة المرور: admin123"
echo ""
echo "📚 للمساعدة:"
echo "   - راجع README.md"
echo "   - راجع SUPABASE_SETUP.md"
echo ""

# Ask if user wants to start dev server
read -p "هل تريد تشغيل خادم التطوير الآن؟ (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 بدء تشغيل خادم التطوير..."
    npm run dev
fi

echo ""
echo "🎉 شكراً لاستخدام سينما أونلاين!"
echo "💡 نصيحة: لا تنس تغيير كلمة مرور المدير الافتراضية!"