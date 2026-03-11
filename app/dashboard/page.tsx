import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: schedules } = await supabase
    .from('schedules')
    .select('*, companies(name)')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(5)

  const statusCount = {
    検討中: companies?.filter(c => c.status === '検討中').length ?? 0,
    ES提出: companies?.filter(c => c.status === 'ES提出').length ?? 0,
    選考中: companies?.filter(c => c.status === '選考中').length ?? 0,
    内定: companies?.filter(c => c.status === '内定').length ?? 0,
    見送り: companies?.filter(c => c.status === '見送り').length ?? 0,
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      <h1>ダッシュボード</h1>
      <p style={{ color: '#666' }}>ようこそ、{user.email} さん</p>

      {/* 選考状況サマリー */}
      <h2 style={{ marginTop: '32px' }}>選考状況</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '16px' }}>
        {Object.entries(statusCount).map(([status, count]) => (
          <div key={status} style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{count}</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{status}</div>
          </div>
        ))}
      </div>

      {/* 直近のスケジュール */}
      <h2 style={{ marginTop: '32px' }}>直近のスケジュール</h2>
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {schedules?.length === 0 && <p style={{ color: '#666' }}>予定はありません</p>}
        {schedules?.map((schedule) => (
          <Link key={schedule.id} href={`/companies/${schedule.company_id}/schedules`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ padding: '12px 16px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{schedule.title}</strong>
                <span style={{ marginLeft: '8px', color: '#666', fontSize: '14px' }}>{schedule.companies?.name}</span>
              </div>
              <span style={{ color: '#666', fontSize: '14px' }}>
                {new Date(schedule.date).toLocaleString('ja-JP')}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* クイックリンク */}
      <h2 style={{ marginTop: '32px' }}>クイックリンク</h2>
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <Link href="/companies">
          <button style={{ padding: '10px 20px', background: '#4285f4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            企業一覧
          </button>
        </Link>
        <Link href="/companies/new">
          <button style={{ padding: '10px 20px', background: '#34a853', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            企業を追加
          </button>
        </Link>
      </div>
    </div>
  )
}