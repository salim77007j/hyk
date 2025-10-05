@echo off
chcp 65001 >nul
cls

echo 🎬 مرحباً بك في سينما أونلاين! 🎬
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت. يرجى تثبيت Node.js 18+ أولاً.
    echo    قم بزيارة: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js مثبت - الإصدار: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm غير مثبت.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm مثبت - الإصدار: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 تثبيت التبعيات...
call npm install

if %errorlevel% neq 0 (
    echo ❌ فشل في تثبيت التبعيات
    pause
    exit /b 1
)

echo ✅ تم تثبيت التبعيات بنجاح
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚠️  ملف .env.local غير موجود
    echo.
    echo 📋 إعداد متغيرات البيئة:
    echo    1. أنشئ مشروع جديد في Supabase: https://app.supabase.com
    echo    2. انسخ .env.example إلى .env.local
    echo    3. أضف URL ومفتاح Supabase
    echo    4. قم بتنفيذ ملف supabase/schema.sql في SQL Editor
    echo.
    
    set /p COPY_ENV="هل تريد نسخ ملف .env.example إلى .env.local؟ (y/n): "
    if /i "%COPY_ENV%"=="y" (
        copy .env.example .env.local >nul
        echo ✅ تم إنشاء ملف .env.local
        echo    يرجى تحديث القيم بمفاتيح Supabase الخاصة بك
    )
) else (
    echo ✅ ملف .env.local موجود
)

echo.

REM Check TypeScript configuration
if not exist "tsconfig.json" (
    echo ⚠️  ملف tsconfig.json غير موجود - سيتم إنشاؤه تلقائياً
)

echo.
echo 🚀 الإعداد مكتمل!
echo.
echo الخطوات التالية:
echo ===============
echo 1. 🗃️  إعداد Supabase:
echo    - اذهب إلى https://app.supabase.com
echo    - أنشئ مشروع جديد
echo    - انسخ URL ومفتاح API إلى .env.local
echo    - قم بتنفيذ supabase/schema.sql في SQL Editor
echo.
echo 2. 🎬 تشغيل الموقع:
echo    npm run dev
echo.
echo 3. 🌐 افتح المتصفح على:
echo    http://localhost:3000
echo.
echo 4. 👨‍💼 لوحة التحكم:
echo    http://localhost:3000/admin
echo    البريد: admin@cinema.com
echo    كلمة المرور: admin123
echo.
echo 📚 للمساعدة:
echo    - راجع README.md
echo    - راجع SUPABASE_SETUP.md
echo.

REM Ask if user wants to start dev server
set /p START_DEV="هل تريد تشغيل خادم التطوير الآن؟ (y/n): "
if /i "%START_DEV%"=="y" (
    echo 🚀 بدء تشغيل خادم التطوير...
    call npm run dev
)

echo.
echo 🎉 شكراً لاستخدام سينما أونلاين!
echo 💡 نصيحة: لا تنس تغيير كلمة مرور المدير الافتراضية!
pause