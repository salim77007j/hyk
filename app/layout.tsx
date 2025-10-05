import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'سينما أونلاين - أفلام ومسلسلات مجانية',
  description: 'موقع لمشاهدة الأفلام والمسلسلات العربية والأجنبية مجاناً بجودة عالية',
  keywords: 'أفلام, مسلسلات, مشاهدة مجانية, سينما عربية, أفلام أجنبية',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} gradient-bg text-white min-h-screen`}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(26, 26, 26, 0.95)',
              color: '#fff',
              fontFamily: 'Cairo, sans-serif',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
            },
            success: {
              style: {
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              },
            },
            error: {
              style: {
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
