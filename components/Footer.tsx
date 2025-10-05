import Link from 'next/link'
import { Film, Heart, Mail, Facebook, Twitter, Instagram, Youtube, Star, Shield, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer-gradient relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container-responsive py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="relative">
                  <Film className="h-10 w-10 text-red-500" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white text-glow">سينما أونلاين</span>
                  <span className="text-sm text-red-400 font-medium">مشاهدة مجانية</span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                وجهتك الأولى لمشاهدة أحدث الأفلام والمسلسلات العربية والعالمية بأعلى جودة ومجاناً بالكامل. 
                استمتع بتجربة مشاهدة استثنائية مع مكتبة ضخمة من المحتوى المتنوع.
              </p>

              {/* Features */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-sm">مشاهدة آمنة ومجانية</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">جودة عالية HD & 4K</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">محتوى عربي وعالمي</span>
                </div>
              </div>

              {/* Made with love */}
              <div className="flex items-center space-x-2 space-x-reverse text-gray-400">
                <span>صنع بـ</span>
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                <span>في العالم العربي</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-6 text-lg">روابط سريعة</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="footer-link group flex items-center space-x-2 space-x-reverse">
                    <span>الرئيسية</span>
                    <svg className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="/movies" className="footer-link group flex items-center space-x-2 space-x-reverse">
                    <span>الأفلام</span>
                    <svg className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="/series" className="footer-link group flex items-center space-x-2 space-x-reverse">
                    <span>المسلسلات</span>
                    <svg className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="footer-link group flex items-center space-x-2 space-x-reverse">
                    <span>لوحة التحكم</span>
                    <svg className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-white font-bold mb-6 text-lg">التصنيفات</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="footer-link">أفلام أكشن</a>
                </li>
                <li>
                  <a href="#" className="footer-link">أفلام رومانسية</a>
                </li>
                <li>
                  <a href="#" className="footer-link">أفلام كوميدي</a>
                </li>
                <li>
                  <a href="#" className="footer-link">مسلسلات درامية</a>
                </li>
                <li>
                  <a href="#" className="footer-link">مسلسلات تركية</a>
                </li>
                <li>
                  <a href="#" className="footer-link">أنمي</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-gray-800">
          <div className="container-responsive py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Social Media */}
              <div className="flex items-center space-x-6 space-x-reverse">
                <span className="text-gray-400 font-medium">تابعنا على:</span>
                <div className="flex space-x-4 space-x-reverse">
                  <a href="#" className="social-icon group">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="social-icon group">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="social-icon group">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="social-icon group">
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Newsletter */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-gray-400 font-medium">النشرة الإخبارية:</span>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="بريدك الإلكتروني" 
                    className="form-input rounded-l-none rounded-r-lg px-4 py-2 w-48 text-sm"
                  />
                  <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-l-lg rounded-r-none transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 bg-black/30">
          <div className="container-responsive py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
              <div className="flex items-center space-x-4 space-x-reverse">
                <span>© 2024 سينما أونلاين. جميع الحقوق محفوظة.</span>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="hover:text-white transition-colors">اتصل بنا</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-link {
          @apply text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium;
        }
        
        .social-icon {
          @apply bg-white/10 hover:bg-red-500/20 p-3 rounded-full transition-all duration-300 text-gray-400 hover:text-white hover:scale-110;
        }
      `}</style>
    </footer>
  )
}