export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">
          الصفحة غير موجودة
        </h2>
        <p className="text-gray-400 mb-8">
          عذراً، لا يمكن العثور على الصفحة التي تبحث عنها
        </p>
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          العودة للرئيسية
        </a>
      </div>
    </div>
  )
}
