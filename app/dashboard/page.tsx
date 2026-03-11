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
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: companies } = await supabase.from('companies').select('*').order('created_at', { ascending: false })
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

  const statusColors: Record<string, string> = {
    検討中: '#64748b',
    ES提出: '#3b82f6',
    選考中: '#f59e0b',
    内定: '#10b981',
    見送り: '#ef4444',
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>ダッシュボード</h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>{user.email}</p>
      </div>

      {/* 選考状況 */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#475569', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>選考状況</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          {Object.entries(statusCount).map(([status, count]) => (
            <div key={status} style={{ background: 'white', padding: '20px 16px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: `3px solid ${statusColors[status]}` }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: statusColors[status] }}>{count}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{status}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 直近スケジュール */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#475569', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>直近のスケジュール</h2>
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {schedules?.length === 0
            ? <p style={{ padding: '24px', color: '#94a3b8', textAlign: 'center' }}>予定はありません</p>
            : schedules?.map((schedule, i) => (
              <Link key={schedule.id} href={`/companies/${schedule.company_id}/schedules`}>
                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < (schedules.length - 1) ? '1px solid #f1f5f9' : 'none' }}>
                  <div>
                    <span style={{ fontWeight: '500' }}>{schedule.title}</span>
                    <span style={{ marginLeft: '8px', fontSize: '13px', color: '#94a3b8' }}>{schedule.companies?.name}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{new Date(schedule.date).toLocaleString('ja-JP')}</span>
                </div>
              </Link>
            ))
          }
        </div>
      </section>

      {/* クイックリンク */}
      <section>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#475569', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>クイックリンク</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/companies">
            <button style={{ padding: '10px 24px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>企業一覧</button>
          </Link>
          <Link href="/companies/new">
            <button style={{ padding: '10px 24px', background: 'white', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>＋ 企業を追加</button>
          </Link>
        </div>
      </section>
    </div>
  )
}