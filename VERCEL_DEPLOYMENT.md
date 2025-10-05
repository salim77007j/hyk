# 🚀 دليل نشر الموقع على Vercel

## المتطلبات المسبقة

✅ موقع يعمل محلياً بنجاح  
✅ حساب GitHub  
✅ حساب Vercel (مجاني)  
✅ قاعدة بيانات Supabase جاهزة  

---

## 📋 الخطوة 1: تحضير المشروع للنشر

### 1.1 إنشاء حساب GitHub (إن لم يكن لديك)
- اذهب إلى [github.com](https://github.com)
- أنشئ حساب جديد أو سجل دخول

### 1.2 رفع المشروع إلى GitHub

```bash
# تهيئة Git (إذا لم تكن قد فعلت ذلك)
git init

# إضافة جميع الملفات
git add .

# أول commit
git commit -m "Initial commit - Cinema streaming platform"

# إنشاء repository على GitHub ثم ربطه
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# رفع الملفات
git push -u origin main
```

⚠️ **هام:** تأكد من أن ملف `.env.local` مُضاف إلى `.gitignore` (لا يُرفع للـ GitHub)

---

## 🌐 الخطوة 2: إنشاء حساب Vercel

### 2.1 التسجيل
- اذهب إلى [vercel.com](https://vercel.com)
- انقر "Sign Up"
- اختر "Continue with GitHub"
- وافق على الصلاحيات

### 2.2 ربط الحساب
- ستحتاج للموافقة على وصول Vercel لـ GitHub
- اختر "Install" للـ repositories التي تريد نشرها

---

## 🚀 الخطوة 3: نشر المشروع

### 3.1 استيراد المشروع
1. في لوحة تحكم Vercel، انقر **"New Project"**
2. اختر **"Import Git Repository"**
3. ابحث عن مشروعك وانقر **"Import"**

### 3.2 إعدادات النشر
- **Project Name:** `cinema-streaming-platform` (أو أي اسم تريده)
- **Framework:** Next.js (سيتم اكتشافه تلقائياً)
- **Root Directory:** `./` (افتراضي)
- **Build Command:** `npm run build` (افتراضي)
- **Install Command:** `npm install` (افتراضي)

### 3.3 انتظار البناء
- انقر **"Deploy"**
- انتظر اكتمال عملية البناء (2-5 دقائق)

---

## ⚙️ الخطوة 4: إعداد المتغيرات البيئية

### 4.1 إضافة متغيرات Supabase
1. في لوحة تحكم المشروع على Vercel
2. اذهب إلى **"Settings"** → **"Environment Variables"**
3. أضف المتغيرات التالية:

| المتغير | القيمة | البيئة |
|---------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` | Production |

### 4.2 كيفية الحصول على المفاتيح من Supabase
1. اذهب إلى [app.supabase.com](https://app.supabase.com)
2. افتح مشروعك
3. اذهب إلى **"Settings"** → **"API"**
4. انسخ:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 4.3 إعادة النشر
بعد إضافة المتغيرات:
1. اذهب إلى **"Deployments"**
2. انقر على آخر deployment
3. انقر **"Redeploy"**

---

## 🔧 الخطوة 5: إعدادات إضافية (اختيارية)

### 5.1 دومين مخصص
- في **"Settings"** → **"Domains"**
- أضف دومينك المخصص
- اتبع التعليمات لتوجيه DNS

### 5.2 إعدادات الأمان
```javascript
// next.config.js - إضافة إعدادات الأمان
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org', 'via.placeholder.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

---

## ✅ الخطوة 6: اختبار الموقع المنشور

### 6.1 التحقق من الوظائف
- [ ] الصفحة الرئيسية تعمل
- [ ] قاعدة البيانات متصلة
- [ ] لوحة التحكم تعمل
- [ ] إضافة الأفلام تعمل
- [ ] البحث يعمل
- [ ] الصور تظهر

### 6.2 اختبار لوحة التحكم
```
https://your-site.vercel.app/admin
```
- سجل دخول بـ: `admin@cinema.com` / `admin123456`
- أضف فيلم تجريبي
- تأكد من ظهوره في الموقع

---

## 🚨 حل المشاكل الشائعة

### المشكلة: "Build Failed"
**الحلول:**
```bash
# تأكد من عدم وجود أخطاء محلياً
npm run build

# تأكد من صحة package.json
npm install

# تحقق من ملفات TypeScript
npm run type-check
```

### المشكلة: "Environment Variables Not Working"
**الحلول:**
1. تأكد من إضافة المتغيرات في Vercel
2. تأكد من البدء بـ `NEXT_PUBLIC_` للمتغيرات العامة
3. أعد النشر بعد إضافة المتغيرات

### المشكلة: "Database Connection Error"
**الحلول:**
1. تحقق من صحة روابط Supabase
2. تأكد من تفعيل RLS policies
3. تحقق من وجود الجداول في قاعدة البيانات

### المشكلة: "Images Not Loading"
**الحلول:**
1. أضف domains الصور إلى `next.config.js`
2. استخدم HTTPS وليس HTTP للصور
3. تأكد من أن روابط الصور صحيحة

---

## 📊 مراقبة الأداء

### Analytics (اختياري)
```javascript
// يمكنك إضافة Google Analytics
// في _app.js أو layout.tsx
```

### مراقبة الأخطاء
- Vercel يوفر logs مفصلة
- اذهب إلى **"Functions"** لرؤية أخطاء API

---

## 🔄 التحديثات المستقبلية

### لنشر تحديثات جديدة:
```bash
# في مجلد المشروع
git add .
git commit -m "تحديث: وصف التحديث"
git push origin main
```

سيتم نشر التحديث تلقائياً في غضون دقائق!

---

## 📞 المساعدة والدعم

### روابط مفيدة:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Docs](https://supabase.com/docs)

### إذا واجهت مشاكل:
1. تحقق من logs في Vercel
2. تأكد من عمل الموقع محلياً أولاً
3. راجع إعدادات المتغيرات البيئية
4. تحقق من اتصال قاعدة البيانات

---

## 🎉 تهانينا!

موقعك الآن منشور ومتاح للعالم! 🌍

**رابط موقعك:** `https://your-project-name.vercel.app`

**الخطوات التالية:**
1. شارك الرابط مع الأصدقاء
2. أضف المزيد من الأفلام
3. خصص التصميم حسب ذوقك
4. أضف ميزات جديدة