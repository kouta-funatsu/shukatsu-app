'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const inputClass = "w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 mt-1"
const labelClass = "text-sm font-medium text-slate-600"

export default function NewCompanyPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', status: '検討中', industry: '', job_type: '',
    company_size: '', website_url: '', memo: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.name) return alert('企業名を入力してください')
    setLoading(true)
    const { error } = await supabase.from('companies').insert([form])
    if (error) { alert('エラーが発生しました'); console.error(error) }
    else router.push('/companies')
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link href="/companies" className="text-sm text-slate-500 hover:text-slate-700">← 企業一覧に戻る</Link>
      <h1 className="text-2xl font-bold text-slate-800 mt-4 mb-8">企業を追加</h1>

      <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
        <div>
          <label className={labelClass}>企業名 *</label>
          <input name="name" value={form.name} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>選考ステータス</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            {['検討中','ES提出','選考中','内定','見送り'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>業界</label>
          <input name="industry" value={form.industry} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>職種</label>
          <input name="job_type" value={form.job_type} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>企業規模</label>
          <input name="company_size" value={form.company_size} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>企業WebサイトURL</label>
          <input name="website_url" value={form.website_url} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>メモ</label>
          <textarea name="memo" value={form.memo} onChange={handleChange} rows={4} className={inputClass} />
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-2 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50">
          {loading ? '保存中...' : '保存する'}
        </button>
      </div>
    </div>
  )
}