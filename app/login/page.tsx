import { createClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  const signIn = async () => {
    'use server'
    const supabase = createClient()
    const { data } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
      },
    })
    if (data.url) redirect(data.url)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-10 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">就活管理アプリ</h1>
        <p className="text-sm text-slate-500 mb-8">ログインして就活を管理しよう</p>
        <form action={signIn}>
          <button type="submit"
            className="w-full py-3 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors">
            Googleでログイン
          </button>
        </form>
      </div>
    </div>
  )
}