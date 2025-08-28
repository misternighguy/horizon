import './globals.css'
import { Inter } from 'next/font/google'
import { LevelProvider } from '@/contexts/LevelContext'
import NewsletterCardPopOut from '@/components/NewsletterCardPopOut'
import ToastContainer from '@/components/Toast'
import DatabaseInitializer from '@/components/DatabaseInitializer'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Horizon Radar',
  description: 'Clarity for crypto research',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <LevelProvider>
          <DatabaseInitializer />
          <main className="flex-1">{children}</main>
          <NewsletterCardPopOut />
          <ToastContainer />
        </LevelProvider>
      </body>
    </html>
  )
}
