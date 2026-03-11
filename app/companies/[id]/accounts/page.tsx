'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const inputClass = "w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 mt-1"
const labelClass = "text-sm font-medium text-slate-600"

export default function AccountsPage() {
  const supabase = createClient()
  const params = useParams()
  const id = params.id as string
  const [accounts, setAccounts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ url: '', login_id: '', password: '', memo: '' })

  const fetchAccounts = async () => {
    const { data } = await supabase.from('company_accounts').select('*').eq('company_id', id)
    if (data) setAccounts(data)
  }

  useEffect(() => { fetchAccounts() }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await supabase.from('company_accounts').insert([{ ...form, company_id: id }])
    if (error) { alert('エラーが発生しました'); console.error(error) }
    else { setForm({ url: '', login_id: '', password: '', memo: '' }); setShowForm(false); fetchAccounts() }
    setLoading(false)
  }

  const handleDelete = async (accountId: string) => {
    if (!confirm('削除しますか？')) return
    await supabase.from('company_accounts').delete().eq('id', accountId)
    fetchAccounts()
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link href={`/companies/${id}`} className="text-sm text-slate-500 hover:text-slate-700">← 企業詳細に戻る</Link>

      <div className="flex justify-between items-center mt-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">マイページ情報</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-700 transition-colors">
          ＋ 追加
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 flex flex-col gap-4 mb-6">
          <div><label className={labelClass}>URL</label><input name="url" value={form.url} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>ログインID</label><input name="login_id" value={form.login_id} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>パスワード</label><input name="password" type="password" value={form.password} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>メモ</label><textarea name="memo" value={form.memo} onChange={handleChange} rows={3} className={inputClass} /></div>
          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-2 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50">
            {loading ? '保存中...' : '保存する'}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {accounts.length === 0 && <p className="text-slate-400 text-center py-12">まだ登録されていません</p>}
        {accounts.map((account) => (
          <div key={account.id} className="bg-white rounded-lg border border-slate-100 shadow-sm divide-y divide-slate-100">
            {account.url && (
              <div className="px-5 py-3 flex gap-4">
                <span className="text-sm text-slate-400 w-24 shrink-0">URL</span>
                <a href={account.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">{account.url}</a>
              </div>
            )}
            {account.login_id && (
              <div className="px-5 py-3 flex gap-4">
                <span className="text-sm text-slate-400 w-24 shrink-0">ログインID</span>
                <span className="text-sm text-slate-700">{account.login_id}</span>
              </div>
            )}
            {account.memo && (
              <div className="px-5 py-3 flex gap-4">
                <span className="text-sm text-slate-400 w-24 shrink-0">メモ</span>
                <span className="text-sm text-slate-700">{account.memo}</span>
              </div>
            )}
            <div className="px-5 py-3">
              <button onClick={() => handleDelete(account.id)}
                className="px-3 py-1 bg-red-50 text-red-500 text-sm rounded-md hover:bg-red-100 transition-colors">
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}