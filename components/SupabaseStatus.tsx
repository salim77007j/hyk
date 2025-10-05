'use client'

import { useEffect, useState } from 'react'
import { testConnection } from '@/lib/supabase'
import { CheckCircle, XCircle, Loader, Database, AlertCircle } from 'lucide-react'

interface ConnectionStatus {
  connected: boolean
  loading: boolean
  error: string | null
  message: string | null
}

export default function SupabaseStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    loading: true,
    error: null,
    message: null
  })

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await testConnection()
      
      if (error) {
        setStatus({
          connected: false,
          loading: false,
          error: error.message || 'فشل في الاتصال بقاعدة البيانات',
          message: null
        })
      } else {
        setStatus({
          connected: true,
          loading: false,
          error: null,
          message: data?.message || 'تم الاتصال بقاعدة البيانات بنجاح'
        })
      }
    } catch (err) {
      setStatus({
        connected: false,
        loading: false,
        error: 'حدث خطأ غير متوقع',
        message: null
      })
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  if (status.loading) {
    return (
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center space-x-3 space-x-reverse">
        <Loader className="h-5 w-5 text-blue-400 animate-spin" />
        <span className="text-blue-300">جاري فحص الاتصال بقاعدة البيانات...</span>
      </div>
    )
  }

  if (status.error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <div className="flex items-center space-x-3 space-x-reverse mb-3">
          <XCircle className="h-5 w-5 text-red-400" />
          <span className="text-red-300 font-medium">فشل الاتصال بـ Supabase</span>
        </div>
        <p className="text-red-200 text-sm mb-3">{status.error}</p>
        <div className="bg-red-500/5 border border-red-500/10 rounded p-3 mb-3">
          <div className="flex items-start space-x-2 space-x-reverse">
            <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-300">
              <p className="mb-2">تأكد من:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>إنشاء ملف <code className="bg-gray-800 px-1 rounded">.env.local</code> في جذر المشروع</li>
                <li>إضافة رابط Supabase في <code className="bg-gray-800 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code></li>
                <li>إضافة مفتاح Supabase في <code className="bg-gray-800 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                <li>تنفيذ ملف <code className="bg-gray-800 px-1 rounded">supabase/schema.sql</code> في قاعدة البيانات</li>
              </ul>
            </div>
          </div>
        </div>
        <button 
          onClick={checkConnection}
          className="btn-primary text-sm"
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }

  return (
    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
      <div className="flex items-center space-x-3 space-x-reverse">
        <CheckCircle className="h-5 w-5 text-green-400" />
        <div>
          <span className="text-green-300 font-medium">تم الاتصال بـ Supabase بنجاح</span>
          {status.message && (
            <p className="text-green-200 text-sm mt-1">{status.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// مكون للتحقق من حالة قاعدة البيانات
export function DatabaseHealthCheck() {
  const [health, setHealth] = useState({
    moviesCount: 0,
    seriesCount: 0,
    episodesCount: 0,
    linksCount: 0,
    loading: true
  })

  useEffect(() => {
    const checkHealth = async () => {
      try {
        // يمكن إضافة المزيد من الفحوصات هنا
        setHealth(prev => ({ ...prev, loading: false }))
      } catch (error) {
        console.error('Health check error:', error)
        setHealth(prev => ({ ...prev, loading: false }))
      }
    }

    checkHealth()
  }, [])

  if (health.loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center space-x-2 space-x-reverse mb-3">
          <Database className="h-5 w-5 text-blue-400" />
          <span className="text-white font-medium">حالة قاعدة البيانات</span>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <div className="flex items-center space-x-2 space-x-reverse mb-3">
        <Database className="h-5 w-5 text-blue-400" />
        <span className="text-white font-medium">إحصائيات قاعدة البيانات</span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-gray-300">
          <span className="text-gray-400">الأفلام:</span> {health.moviesCount}
        </div>
        <div className="text-gray-300">
          <span className="text-gray-400">المسلسلات:</span> {health.seriesCount}
        </div>
        <div className="text-gray-300">
          <span className="text-gray-400">الحلقات:</span> {health.episodesCount}
        </div>
        <div className="text-gray-300">
          <span className="text-gray-400">روابط المشاهدة:</span> {health.linksCount}
        </div>
      </div>
    </div>
  )
}