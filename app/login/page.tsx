import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-10 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">就活管理アプリ</h1>
        <p className="text-sm text-slate-500 mb-8">ログインして就活を管理しよう</p>
        <a href="/api/auth/login">
          <button className="w-full py-3 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors">
            Googleでログイン
          </button>
        </a>
      </div>
    </div>
  )
}