'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function SchedulesPage() {
  const supabase = createClient()
  const params = useParams()
  const id = params.id as string
  const [schedules, setSchedules] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    date: '',
    memo: '',
  })

  const fetchSchedules = async () => {
    const { data } = await supabase
      .from('schedules')
      .select('*')
      .eq('company_id', id)
      .order('date', { ascending: true })
    if (data) setSchedules(data)
  }

  useEffect(() => {
    fetchSchedules()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.title) return alert('タイトルを入力してください')
    setLoading(true)

    const { error } = await supabase
      .from('schedules')
      .insert([{ ...form, company_id: id }])

    if (error) {
      alert('エラーが発生しました')
      console.error(error)
    } else {
      setForm({ title: '', date: '', memo: '' })
      setShowForm(false)
      fetchSchedules()
    }
    setLoading(false)
  }

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('削除しますか？')) return
    await supabase.from('schedules').delete().eq('id', scheduleId)
    fetchSchedules()
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px' }}>
      <Link href={`/companies/${id}`}>← 企業詳細に戻る</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <h1>スケジュール</h1>
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding: '8px 16px', background: '#4285f4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          ＋ 追加
        </button>
      </div>

      {showForm && (
        <div style={{ marginTop: '24px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label>タイトル *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="例：一次面接、ES締切"
              style={{ display: 'block', width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label>日時</label>
            <input name="date" type="datetime-local" value={form.date} onChange={handleChange}
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
        {schedules.length === 0 && <p>まだ登録されていません</p>}
        {schedules.map((schedule) => (
          <div key={schedule.id} style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{schedule.title}</strong>
              {schedule.date && (
                <span style={{ color: '#666', fontSize: '14px' }}>
                  {new Date(schedule.date).toLocaleString('ja-JP')}
                </span>
              )}
            </div>
            {schedule.memo && <p style={{ margin: '8px 0 0', color: '#666' }}>{schedule.memo}</p>}
            <button onClick={() => handleDelete(schedule.id)}
              style={{ marginTop: '12px', padding: '6px 12px', background: '#ea4335', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}