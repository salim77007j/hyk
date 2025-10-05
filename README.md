# 🎬 سينما أونلاين - Cinema Online

## نظرة عامة | Overview

موقع لمشاهدة الأفلام والمسلسلات مجاناً مع لوحة تحكم شاملة لإدارة المحتوى.

A free movie and series streaming platform with a comprehensive admin panel for content management.

## 🌟 الميزات | Features

### 🎯 للمستخدمين | For Users
- **مشاهدة مجانية** للأفلام والمسلسلات
- **بحث ذكي** بالعنوان العربي والإنجليزي  
- **تصنيفات متنوعة** (دراما، أكشن، كوميديا، إلخ)
- **واجهة سريعة الاستجابة** تعمل على جميع الأجهزة
- **جودات متعددة** (720p, 1080p, 4K)

### 🛠️ للمشرفين | For Admins
- **لوحة تحكم شاملة** لإدارة المحتوى
- **إضافة وتعديل الأفلام** بسهولة
- **إدارة روابط المشاهدة** المتعددة
- **إحصائيات المشاهدة** والمحتوى
- **نظام تقييمات** للأفلام

## 🚀 التقنيات المستخدمة | Tech Stack

- **Frontend:** Next.js 13, React 18, TypeScript
- **Styling:** Tailwind CSS, Custom Animations
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Deployment:** Vercel
- **Icons:** Lucide React

## 📋 المتطلبات | Requirements

- Node.js 18+ 
- npm 8+
- حساب Supabase مجاني
- حساب Vercel مجاني (للنشر)

## ⚡ البدء السريع | Quick Start

### 1. التثبيت المحلي | Local Installation

```bash
# استنساخ المشروع
git clone <your-repo-url>
cd cinema-streaming-platform

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local
# املأ بيانات Supabase في .env.local

# تشغيل الخادم المحلي
npm run dev
```

### 2. إعداد قاعدة البيانات | Database Setup

```bash
# تشغيل سكريبت الإعداد التلقائي
chmod +x setup.sh
./setup.sh

# أو ينفذ يدوياً في Supabase SQL Editor
# انسخ محتوى supabase/schema.sql
```

### 3. النشر على Vercel | Deploy to Vercel

```bash
# تحضير المشروع للنشر
npm run prepare-deploy

# اتبع التعليمات في VERCEL_DEPLOYMENT.md
```

## 🔧 إعدادات البيئة | Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## 📁 هيكل المشروع | Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # لوحة التحكم
│   ├── movie/             # صفحات الأفلام
│   ├── series/            # صفحات المسلسلات
│   └── watch/             # صفحات المشاهدة
├── components/            # مكونات React
│   ├── admin/             # مكونات لوحة التحكم
│   └── ui/                # مكونات واجهة المستخدم
├── lib/                   # مكتبات ووظائف مساعدة
│   └── supabase.ts        # إعدادات قاعدة البيانات
├── supabase/              # ملفات قاعدة البيانات
│   └── schema.sql         # هيكل قاعدة البيانات
└── public/                # الملفات الثابتة
```

## 🎮 كيفية الاستخدام | How to Use

### للمشرفين | For Admins

1. **الدخول للوحة التحكم:**
   ```
   http://localhost:3000/admin
   ```

2. **بيانات الدخول الافتراضية:**
   - البريد: `admin@cinema.com`
   - كلمة المرور: `admin123456`

3. **إضافة فيلم جديد:**
   - انقر "إضافة محتوى جديد"
   - املأ بيانات الفيلم
   - أضف روابط المشاهدة
   - انقر "حفظ"

### للمستخدمين | For Users

1. **تصفح الأفلام:** الصفحة الرئيسية تعرض أحدث الأفلام
2. **البحث:** استخدم شريط البحث للعثور على فيلم معين
3. **المشاهدة:** انقر على الفيلم واختر جودة المشاهدة

## 📊 قاعدة البيانات | Database Schema

### الجداول الرئيسية | Main Tables

- **movies** - بيانات الأفلام والمسلسلات
- **streaming_links** - روابط المشاهدة
- **episodes** - حلقات المسلسلات
- **comments** - تعليقات المستخدمين
- **favorites** - المفضلة

## 🎨 التخصيص | Customization

### الألوان | Colors
```css
/* في app/globals.css */
--primary-red: #e50914;
--primary-gold: #f5c518;
--dark-bg: #141414;
```

### الخطوط | Fonts
```javascript
// في app/layout.tsx
import { Inter } from 'next/font/google'
```

## 🔒 الأمان | Security

- **حماية لوحة التحكم** بكلمة مرور
- **Row Level Security** في Supabase
- **متغيرات بيئة آمنة** للمفاتيح الحساسة
- **حماية من XSS** في النماذج

## 📈 الأداء | Performance

- **تحسين الصور** مع Next.js Image
- **تحميل تدريجي** للمحتوى
- **ضغط الملفات** في الإنتاج
- **CDN** عبر Vercel

## 🐛 استكشاف الأخطاء | Troubleshooting

### مشاكل شائعة | Common Issues

#### البناء فشل | Build Failed
```bash
# تحقق من الأخطاء
npm run type-check
npm run build
```

#### قاعدة البيانات لا تعمل | Database Not Working
```bash
# اختبار الاتصال
node test-supabase.js
```

#### الصور لا تظهر | Images Not Loading
- تحقق من `next.config.js`
- تأكد من صحة روابط الصور

## 📚 الوثائق الإضافية | Additional Documentation

- <filepath>VERCEL_DEPLOYMENT.md</filepath> - دليل النشر الكامل
- <filepath>SUPABASE_SETUP.md</filepath> - إعداد قاعدة البيانات  
- <filepath>MOVIE_GUIDE.md</filepath> - دليل إضافة الأفلام

## 🤝 المساهمة | Contributing

1. Fork المشروع
2. أنشئ فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. التزم بالتغييرات (`git commit -m 'Add some AmazingFeature'`)
4. ادفع للفرع (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

## 📄 الرخصة | License

هذا المشروع مفتوح المصدر تحت رخصة MIT.

This project is open source under the MIT License.

## 🆘 الدعم | Support

إذا واجهت أي مشاكل أو لديك أسئلة:

1. راجع ملفات الوثائق أعلاه
2. تحقق من Issues في GitHub
3. تأكد من تشغيل `npm run dev` بنجاح محلياً

## 🎯 خارطة الطريق | Roadmap

### الإصدار القادم | Next Version
- [ ] نظام تعليقات وتقييمات
- [ ] نظام المفضلة
- [ ] إحصائيات متقدمة
- [ ] دعم ترجمات متعددة
- [ ] تطبيق موبايل

### الميزات المستقبلية | Future Features
- [ ] خدمة البث المباشر
- [ ] نظام اشتراكات
- [ ] تطبيق Desktop
- [ ] ذكاء اصطناعي للتوصيات

---

**تم تطويره بواسطة MiniMax Agent** 🤖

**Developed by MiniMax Agent** 🤖