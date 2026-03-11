'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function AccountsPage() {
  const supabase = createClient()
  const params = useParams()
  const id = params.id as string
  const [accounts, setAccounts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    url: '',
    login_id: '',
    password: '',
    memo: '',
  })

  const fetchAccounts = async () => {
    const { data } = await supabase
      .from('company_accounts')
      .select('*')
      .eq('company_id', id)
    if (data) setAccounts(data)
  }

  useEffect(() => {
    fetchAccounts()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('company_accounts')
      .insert([{ ...form, company_id: id }])

    if (error) {
      alert('エラーが発生しました')
      console.error(error)
    } else {
      setForm({ url: '', login_id: '', password: '', memo: '' })
      setShowForm(false)
      fetchAccounts()
    }
    setLoading(false)
  }

  const handleDelete = async (accountId: string) => {
    if (!confirm('削除しますか？')) return
    await supabase.from('company_accounts').delete().eq('id', accountId)
    fetchAccounts()
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px' }}>
      <Link href={`/companies/${id}`}>← 企業詳細に戻る</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <h1>マイページ情報</h1>
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding: '8px 16px', background: '#4285f4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          ＋ 追加
        </button>
      </div>

      {showForm && (
        <div style={{ marginTop: '24px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label>URL</label>
            <input name="url" value={form.url} onChange={handleChange}
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label>ログインID</label>
            <input name="login_id" value={form.login_id} onChange={handleChange}
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label>パスワード</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label>メモ</label>
            <textarea name="memo" value={form.memo} onChange={handleChange} rows={3}
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <button onClick={handleSubmit} disabled={loading}
            style={{ padding: '10px', background: '#4285f4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            {loading ? '保存中...' : '保存する'}
          </button>
        </div>
      )}

      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {accounts.length === 0 && <p>まだ登録されていません</p>}
        {accounts.map((account) => (
          <div key={account.id} style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
            {account.url && <div><strong>URL：</strong><a href={account.url} target="_blank" rel="noopener noreferrer">{account.url}</a></div>}
            {account.login_id && <div style={{ marginTop: '8px' }}><strong>ログインID：</strong>{account.login_id}</div>}
            {account.memo && <div style={{ marginTop: '8px' }}><strong>メモ：</strong>{account.memo}</div>}
            <button onClick={() => handleDelete(account.id)}
              style={{ marginTop: '12px', padding: '6px 12px', background: '#ea4335', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}