'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'
import Badge from '@/components/Badge'

export default function CompaniesPage() {
  const supabase = createClient()
  const [companies, setCompanies] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('すべて')
  const [sortBy, setSortBy] = useState('新しい順')
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('companies').select('*')
      if (data) setCompanies(data)
    }
    fetch()
  }, [])

  useEffect(() => {
    let result = [...companies]

    // 検索
    if (search) {
      result = result.filter(c =>
        c.name?.includes(search) ||
        c.industry?.includes(search) ||
        c.job_type?.includes(search) ||
        c.memo?.includes(search)
      )
    }

    // ステータスフィルター
    if (statusFilter !== 'すべて') {
      result = result.filter(c => c.status === statusFilter)
    }

    // 並び替え
    if (sortBy === '新しい順') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    if (sortBy === '古い順') result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    if (sortBy === '志望度高い順') result.sort((a, b) => (b.priority ?? 3) - (a.priority ?? 3))
    if (sortBy === '志望度低い順') result.sort((a, b) => (a.priority ?? 3) - (b.priority ?? 3))

    setFiltered(result)
  }, [companies, search, statusFilter, sortBy])

  // 業界グループ
  const grouped = filtered.reduce((acc: Record<string, any[]>, c) => {
    const key = c.industry || 'その他'
    if (!acc[key]) acc[key] = []
    acc[key].push(c)
    return acc
  }, {})

  const toggleCompare = (id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const compareCompanies = companies.filter(c => compareIds.includes(c.id))

  const inputClass = "px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">企業一覧</h1>
        <Link href="/companies/new">
          <button className="px-4 py-2 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-700 transition-colors">
            ＋ 企業を追加
          </button>
        </Link>
      </div>

      {/* フィルター・検索バー */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="企業名・業界・キーワードで検索"
          className={`${inputClass} flex-1 min-w-48`}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={inputClass}>
          {['すべて', '検討中', 'ES提出', '選考中', '内定', '見送り'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={inputClass}>
          {['新しい順', '古い順', '志望度高い順', '志望度低い順'].map(s => <option key={s}>{s}</option>)}
        </select>
        <button
          onClick={() => setShowCompare(!showCompare)}
          className={`px-4 py-2 text-sm rounded-md border transition-colors ${showCompare ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
        >
          比較モード {compareIds.length > 0 && `(${compareIds.length})`}
        </button>
      </div>

      {/* 比較ビュー */}
      {showCompare && compareIds.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5 mb-6 overflow-x-auto">
          <h2 className="text-sm font-semibold text-slate-600 mb-4">企業比較</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 pr-4 text-slate-400 font-medium w-24">項目</th>
                {compareCompanies.map(c => (
                  <th key={c.id} className="text-left py-2 px-4 text-slate-700 font-semibold">{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'ステータス', key: 'status' },
                { label: '業界', key: 'industry' },
                { label: '職種', key: 'job_type' },
                { label: '企業規模', key: 'company_size' },
                { label: '志望度', key: 'priority' },
                { label: '仕事内容', key: 'job' },
                { label: 'キャリア', key: 'career' },
                { label: '社風', key: 'culture' },
                { label: '給与', key: 'salary' },
                { label: '働き方', key: 'workstyle' },
              ].map(row => (
                <tr key={row.key} className="border-b border-slate-50">
                  <td className="py-2 pr-4 text-slate-400">{row.label}</td>
                  {compareCompanies.map(c => (
                    <td key={c.id} className="py-2 px-4 text-slate-700">{c[row.key] ?? '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 比較モードの説明 */}
      {showCompare && (
        <p className="text-xs text-slate-400 mb-4">企業カードのチェックボックスで最大3社まで選択できます</p>
      )}

      {/* 企業リスト（業界グループ別） */}
      {filtered.length === 0
        ? <p className="text-slate-400 text-center py-16">該当する企業がありません</p>
        : Object.entries(grouped).map(([industry, list]) => (
          <div key={industry} className="mb-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">{industry}</h2>
            <div className="flex flex-col gap-2">
              {list.map(company => (
                <div key={company.id} className="bg-white rounded-lg border border-slate-100 shadow-sm flex items-center">
                  {showCompare && (
                    <div className="pl-4">
                      <input
                        type="checkbox"
                        checked={compareIds.includes(company.id)}
                        onChange={() => toggleCompare(company.id)}
                        className="w-4 h-4 accent-slate-800"
                      />
                    </div>
                  )}
                  <Link href={`/companies/${company.id}`} className="flex-1 px-5 py-4 flex justify-between items-center">
                    <div>
                      <span className="font-medium text-slate-800">{company.name}</span>
                      {company.job_type && <span className="ml-3 text-sm text-slate-400">{company.job_type}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      {company.priority && (
                        <span className="text-xs text-slate-400">志望度 {'★'.repeat(company.priority)}{'☆'.repeat(5 - company.priority)}</span>
                      )}
                      <Badge status={company.status} />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  )
}