import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

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

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (!company) redirect('/companies')

  return (
    <div style={{ padding: '40px', maxWidth: '600px' }}>
      <Link href="/companies">← 企業一覧に戻る</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <h1>{company.name}</h1>
        <span style={{ background: '#e8f0fe', padding: '4px 12px', borderRadius: '4px' }}>
          {company.status}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
        {company.industry && <div><strong>業界：</strong>{company.industry}</div>}
        {company.job_type && <div><strong>職種：</strong>{company.job_type}</div>}
        {company.company_size && <div><strong>企業規模：</strong>{company.company_size}</div>}
        {company.website_url && (
          <div>
            <strong>WebサイトURL：</strong>
            <a href={company.website_url} target="_blank" rel="noopener noreferrer">
              {company.website_url}
            </a>
          </div>
        )}
        {company.memo && <div><strong>メモ：</strong>{company.memo}</div>}
      </div>

      <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
        <Link href={`/companies/${id}/edit`}>
          <button style={{ padding: '8px 16px', background: '#4285f4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            編集
          </button>
        </Link>
      </div>
    </div>
  )
}