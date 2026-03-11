import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Badge from '@/components/Badge'
import PageHeader from '@/components/PageHeader'

export default async function CompaniesPage() {
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

  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader
        title="企業一覧"
        action={
          <Link href="/companies/new">
            <button className="bg-slate-800 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-700 transition-colors">
              ＋ 企業を追加
            </button>
          </Link>
        }
      />

      {companies?.length === 0
        ? <p className="text-slate-400 text-center py-16">まだ企業が登録されていません</p>
        : <div className="flex flex-col gap-2">
            {companies?.map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`}>
                <div className="bg-white px-5 py-4 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <span className="font-medium text-slate-800">{company.name}</span>
                    {company.industry && <span className="ml-3 text-sm text-slate-400">{company.industry}</span>}
                  </div>
                  <Badge status={company.status} />
                </div>
              </Link>
            ))}
          </div>
      }
    </div>
  )
}