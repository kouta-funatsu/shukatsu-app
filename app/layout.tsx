import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '就活管理アプリ',
  description: '就活における企業情報の整理・比較・スケジュール管理',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav style={{
          padding: '12px 40px',
          background: '#4285f4',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
        }}>
          <a href="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
            就活管理アプリ
          </a>
          <a href="/companies" style={{ color: 'white', textDecoration: 'none' }}>企業一覧</a>
          <a href="/companies/new" style={{ color: 'white', textDecoration: 'none' }}>企業を追加</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
