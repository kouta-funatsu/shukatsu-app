'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function NewCompanyPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    status: '検討中',
    industry: '',
    job_type: '',
    company_size: '',
    website_url: '',
    memo: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.name) return alert('企業名を入力してください')
    setLoading(true)

    const { error } = await supabase.from('companies').insert([form])

    if (error) {
      alert('エラーが発生しました')
      console.error(error)
    } else {
      router.push('/companies')
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px' }}>
      <h1>企業を追加</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
        <div>
          <label>企業名 *</label>
          <input name="name" value={form.name} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div>
          <label>選考ステータス</label>
          <select name="status" value={form.status} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option>検討中</option>
            <option>ES提出</option>
            <option>選考中</option>
            <option>内定</option>
            <option>見送り</option>
          </select>
        </div>

        <div>
          <label>業界</label>
          <input name="industry" value={form.industry} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div>
          <label>職種</label>
          <input name="job_type" value={form.job_type} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div>
          <label>企業規模</label>
          <input name="company_size" value={form.company_size} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div>
          <label>企業WebサイトURL</label>
          <input name="website_url" value={form.website_url} onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div>
          <label>メモ</label>
          <textarea name="memo" value={form.memo} onChange={handleChange} rows={4}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{ padding: '12px', background: '#4285f4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
          {loading ? '保存中...' : '保存する'}
        </button>
      </div>
    </div>
  )
}