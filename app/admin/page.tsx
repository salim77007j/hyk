import { redirect } from 'next/navigation'
import AdminLogin from '@/components/admin/AdminLogin'
import SupabaseStatus from '@/components/SupabaseStatus'

export const metadata = {
  title: 'لوحة التحكم - سينما أونلاين',
  description: 'لوحة تحكم الموقع لإدارة الأفلام والمسلسلات',
}

export default function AdminPage() {
  // In a real app, you would check authentication here
  // For now, we'll show the login form
  
  return (
    <div className="min-h-screen py-20 px-4 gradient-bg">
      <div className="container-responsive max-w-2xl mx-auto space-y-8">
        {/* Supabase Connection Status */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">حالة قاعدة البيانات</h2>
          <SupabaseStatus />
        </div>

        {/* Admin Login */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">تسجيل دخول المدير</h2>
          <AdminLogin />
        </div>

        {/* Quick Setup Guide */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2 space-x-reverse">
            <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>دليل الإعداد السريع</span>
          </h3>
          <div className="space-y-3 text-blue-200">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
              <div>
                <p className="font-medium">إنشاء مشروع Supabase</p>
                <p className="text-sm text-blue-300">اذهب إلى <code className="bg-blue-900/30 px-1 rounded">app.supabase.com</code> وأنشئ مشروع جديد</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
              <div>
                <p className="font-medium">إعداد متغيرات البيئة</p>
                <p className="text-sm text-blue-300">أنشئ ملف <code className="bg-blue-900/30 px-1 rounded">.env.local</code> وأضف مفاتيح Supabase</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
              <div>
                <p className="font-medium">تنفيذ schema.sql</p>
                <p className="text-sm text-blue-300">انسخ محتوى <code className="bg-blue-900/30 px-1 rounded">supabase/schema.sql</code> إلى SQL Editor في Supabase</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-900/20 rounded-lg">
            <p className="text-blue-200 text-sm">
              📄 راجع ملف <code className="bg-blue-900/30 px-1 rounded">SUPABASE_SETUP.md</code> للدليل الكامل
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
