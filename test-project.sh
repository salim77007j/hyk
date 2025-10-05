#!/bin/bash

# 🧪 اختبار سريع للمشروع
# Quick Project Test Script

echo "🧪 اختبار سينما أونلاين"
echo "========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test functions
test_passed() {
    echo -e "${GREEN}✅ $1${NC}"
}

test_failed() {
    echo -e "${RED}❌ $1${NC}"
}

test_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

test_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. Check Node.js
echo "1. فحص Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    test_passed "Node.js مثبت - $NODE_VERSION"
else
    test_failed "Node.js غير مثبت"
    exit 1
fi

# 2. Check npm
echo ""
echo "2. فحص npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    test_passed "npm مثبت - $NPM_VERSION"
else
    test_failed "npm غير مثبت"
    exit 1
fi

# 3. Check dependencies
echo ""
echo "3. فحص التبعيات..."
if [ -d "node_modules" ]; then
    test_passed "التبعيات مثبتة"
else
    test_warning "التبعيات غير مثبتة - تشغيل npm install"
    npm install
fi

# 4. Check environment file
echo ""
echo "4. فحص متغيرات البيئة..."
if [ -f ".env.local" ]; then
    test_passed "ملف .env.local موجود"
    
    # Check if it has the required variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        test_passed "متغيرات Supabase موجودة"
    else
        test_warning "بعض متغيرات Supabase مفقودة"
    fi
else
    test_warning "ملف .env.local غير موجود"
    test_info "انسخ .env.example إلى .env.local وأضف مفاتيح Supabase"
fi

# 5. Check TypeScript config
echo ""
echo "5. فحص تكوين TypeScript..."
if [ -f "tsconfig.json" ]; then
    test_passed "tsconfig.json موجود"
else
    test_warning "tsconfig.json غير موجود - سيتم إنشاؤه تلقائياً"
fi

# 6. Check main files
echo ""
echo "6. فحص الملفات الأساسية..."

required_files=(
    "package.json"
    "next.config.js"
    "tailwind.config.js"
    "app/layout.tsx"
    "app/page.tsx"
    "lib/supabase.ts"
    "supabase/schema.sql"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        test_passed "$file"
    else
        test_failed "$file مفقود"
    fi
done

# 7. Test Supabase connection (if available)
echo ""
echo "7. اختبار الاتصال بـ Supabase..."
if [ -f ".env.local" ] && [ -f "test-supabase.js" ]; then
    if command -v node &> /dev/null; then
        test_info "تشغيل اختبار Supabase..."
        node test-supabase.js
    else
        test_warning "لا يمكن تشغيل اختبار Supabase - Node.js غير متاح"
    fi
else
    test_warning "اختبار Supabase غير متاح - تحقق من .env.local"
fi

# 8. Try building the project
echo ""
echo "8. اختبار البناء..."
if npm run build &> /dev/null; then
    test_passed "البناء نجح"
else
    test_warning "البناء فشل - تحقق من الأخطاء"
fi

echo ""
echo "🏁 انتهى الاختبار"
echo "=================="
echo ""

# Final recommendations
echo "📋 التوصيات:"
echo "-------------"

if [ ! -f ".env.local" ]; then
    echo "1. أنشئ ملف .env.local وأضف مفاتيح Supabase"
fi

echo "2. تأكد من تنفيذ supabase/schema.sql في قاعدة بيانات Supabase"
echo "3. شغل الموقع: npm run dev"
echo "4. افتح المتصفح على: http://localhost:3000"
echo "5. اذهب إلى لوحة التحكم: http://localhost:3000/admin"

echo ""
echo "📚 للمساعدة:"
echo "   - README.md"
echo "   - SUPABASE_SETUP.md"
echo ""
echo "🎬 استمتع بسينما أونلاين!"