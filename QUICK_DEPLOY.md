# 🎯 دليل النشر السريع - Quick Deployment Guide

## 🚀 خطوات النشر في 5 دقائق

### 1️⃣ تحضير المشروع
```bash
# تشغيل فحص الجاهزية
node deployment-checklist.js

# تحضير النشر
npm run prepare-deploy
```

### 2️⃣ رفع إلى GitHub
```bash
# إضافة جميع الملفات
git add .

# التزام بالتغييرات
git commit -m "Cinema platform ready for deployment"

# رفع إلى GitHub (استبدل YOUR_USERNAME و YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 3️⃣ النشر على Vercel

1. **اذهب إلى** [vercel.com](https://vercel.com)
2. **سجل دخول** بحساب GitHub
3. **انقر** "New Project"
4. **اختر** مشروعك من GitHub
5. **انقر** "Deploy"

### 4️⃣ إعداد متغيرات البيئة

في لوحة تحكم Vercel:
```
Settings → Environment Variables

NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
```

### 5️⃣ إعادة النشر
بعد إضافة المتغيرات:
```
Deployments → Redeploy
```

---

## 🔧 المساعدة السريعة

### ❓ أين أجد مفاتيح Supabase؟
1. اذهب إلى [app.supabase.com](https://app.supabase.com)
2. Settings → API
3. انسخ Project URL و API Keys

### ❓ كيف أختبر الموقع؟
```
https://your-project.vercel.app
https://your-project.vercel.app/admin
```

### ❓ مشكلة في البناء؟
```bash
npm run build  # اختبار محلي
npm run type-check  # فحص TypeScript
```

---

## 📋 قائمة التحقق السريعة

- [ ] المشروع يعمل محلياً (`npm run dev`)
- [ ] قاعدة البيانات Supabase جاهزة
- [ ] Git repository مُهيأ
- [ ] GitHub repository منشئ
- [ ] متغيرات البيئة جاهزة
- [ ] Vercel account جاهز

---

## 🎉 مبروك!

موقعك سيكون متاحاً خلال دقائق على:
```
https://your-project-name.vercel.app
```

**بيانات لوحة التحكم:**
- البريد: admin@cinema.com  
- كلمة المرور: admin123456

---

📖 **للتفاصيل الكاملة:** راجع ملف `VERCEL_DEPLOYMENT.md`