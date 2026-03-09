'use client'

import { createClient } from '@/utils/supabase'

export default function LoginPage() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '24px',
    }}>
      <h1>就活管理アプリ</h1>
      <p>企業情報の整理・比較、スケジュール管理ができます</p>
      <button onClick={handleLogin} style={{
        padding: '12px 24px',
        fontSize: '16px',
        borderRadius: '8px',
        border: 'none',
        background: '#4285f4',
        color: 'white',
        cursor: 'pointer',
      }}>
        Googleでログイン
      </button>
    </div>
  )
}