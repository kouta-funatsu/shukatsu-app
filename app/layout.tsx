import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import LogoutButton from '@/components/LogoutButton'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: '就活管理アプリ',
  description: '就活における企業情報の整理・比較・スケジュール管理',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav style={{
          padding: '0 24px',
          background: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          height: '56px',
          gap: '32px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <a href="/dashboard" style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', whiteSpace: 'nowrap' }}>
            就活管理
          </a>
          <a href="/companies" style={{ color: '#94a3b8', fontSize: '14px' }}>企業一覧</a>
          <a href="/companies/new" style={{ color: '#94a3b8', fontSize: '14px' }}>企業を追加</a>
          <LogoutButton />
        </nav>
        <main style={{ minHeight: 'calc(100vh - 56px)' }}>
          {children}
        </main>
      </body>
    </html>
  )
}