import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Badge from '@/components/Badge'

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
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: company } = await supabase.from('companies').select('*').eq('id', id).single()
  if (!company) redirect('/companies')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/companies" className="text-sm text-slate-500 hover:text-slate-700">← 企業一覧に戻る</Link>

      <div className="flex justify-between items-center mt-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">{company.name}</h1>
        <Badge status={company.status} />
      </div>

      <div className="bg-white rounded-lg border border-slate-100 shadow-sm divide-y divide-slate-100">
        {[
          { label: '業界', value: company.industry },
          { label: '職種', value: company.job_type },
          { label: '企業規模', value: company.company_size },
          { label: 'WebサイトURL', value: company.website_url, isLink: true },
          { label: '仕事内容', value: company.job },
          { label: 'キャリアパス', value: company.career },
          { label: '社風', value: company.culture },
          { label: '給与', value: company.salary },
          { label: '働き方', value: company.workstyle },
          { label: 'メモ', value: company.memo },
        ].filter(item => item.value).map(item => (
          <div key={item.label} className="px-5 py-4 flex gap-4">
            <span className="text-sm text-slate-400 w-28 shrink-0">{item.label}</span>
            {item.isLink
              ? <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">{item.value}</a>
              : <span className="text-sm text-slate-700">{item.value}</span>
            }
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Link href={`/companies/${id}/edit`}>
          <button className="px-4 py-2 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-700 transition-colors">編集</button>
        </Link>
        <Link href={`/companies/${id}/accounts`}>
          <button className="px-4 py-2 bg-white text-slate-700 text-sm rounded-md border border-slate-200 hover:bg-slate-50 transition-colors">マイページ情報</button>
        </Link>
        <Link href={`/companies/${id}/schedules`}>
          <button className="px-4 py-2 bg-white text-slate-700 text-sm rounded-md border border-slate-200 hover:bg-slate-50 transition-colors">スケジュール</button>
        </Link>
      </div>
    </div>
  )
}