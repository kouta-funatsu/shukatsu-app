'use client'

import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="ml-auto text-sm text-slate-400 hover:text-white transition-colors"
    >
      ログアウト
    </button>
  )
}