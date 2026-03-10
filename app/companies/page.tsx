import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CompaniesPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
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

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>企業一覧</h1>
        <Link href="/companies/new">
          <button style={{ padding: '8px 16px', background: '#4285f4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            ＋ 企業を追加
          </button>
        </Link>
      </div>

      {companies?.length === 0 && <p>まだ企業が登録されていません</p>}

      <div style={{ display: 'grid', gap: '16px' }}>
        {companies?.map((company) => (
          <Link key={company.id} href={`/companies/${company.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0 }}>{company.name}</h2>
                <span style={{ background: '#e8f0fe', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>
                  {company.status}
                </span>
              </div>
              {company.industry && <p style={{ margin: '8px 0 0', color: '#666' }}>{company.industry}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}