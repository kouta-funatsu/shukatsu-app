'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const inputClass = "w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300 mt-1"
const labelClass = "text-sm font-medium text-slate-600"

export default function SchedulesPage() {
  const supabase = createClient()
  const params = useParams()
  const id = params.id as string
  const [schedules, setSchedules] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', memo: '' })
  const [calendarStatus, setCalendarStatus] = useState<Record<string, string>>({})

  const fetchSchedules = async () => {
    const { data } = await supabase.from('schedules').select('*').eq('company_id', id).order('date', { ascending: true })
    if (data) setSchedules(data)
  }

  useEffect(() => { fetchSchedules() }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.title) return alert('タイトルを入力してください')
    setLoading(true)

    // Supabaseに保存
    const { data: newSchedule, error } = await supabase
      .from('schedules')
      .insert([{ ...form, company_id: id }])
      .select()
      .single()

    if (error) { alert('エラーが発生しました'); console.error(error); setLoading(false); return }

    // Googleカレンダーに追加
    if (form.date) {
      try {
        const res = await fetch('/api/calendar/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            date: form.date,
            memo: form.memo,
            scheduleId: newSchedule.id,
          }),
        })
        const result = await res.json()
        if (result.success) {
          setCalendarStatus(prev => ({ ...prev, [newSchedule.id]: '✅ カレンダーに追加済み' }))
        } else {
          setCalendarStatus(prev => ({ ...prev, [newSchedule.id]: '⚠️ カレンダー追加失敗' }))
        }
      } catch {
        setCalendarStatus(prev => ({ ...prev, [newSchedule.id]: '⚠️ カレンダー追加失敗' }))
      }
    }

    setForm({ title: '', date: '', memo: '' })
    setShowForm(false)
    fetchSchedules()
    setLoading(false)
  }

  const handleDelete = async (scheduleId: string, googleEventId?: string) => {
    if (!confirm('削除しますか？')) return

    // Googleカレンダーからも削除
    if (googleEventId) {
      await fetch('/api/calendar/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: googleEventId }),
      })
    }

    await supabase.from('schedules').delete().eq('id', scheduleId)
    fetchSchedules()
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link href={`/companies/${id}`} className="text-sm text-slate-500 hover:text-slate-700">← 企業詳細に戻る</Link>

      <div className="flex justify-between items-center mt-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">スケジュール</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-700 transition-colors">
          ＋ 追加
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 flex flex-col gap-4 mb-6">
          <div><label className={labelClass}>タイトル *</label><input name="title" value={form.title} onChange={handleChange} placeholder="例：一次面接、ES締切" className={inputClass} /></div>
          <div><label className={labelClass}>日時</label><input name="date" type="datetime-local" value={form.date} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>メモ</label><textarea name="memo" value={form.memo} onChange={handleChange} rows={3} className={inputClass} /></div>
          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-2 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50">
            {loading ? '保存中...' : '保存してGoogleカレンダーに追加'}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {schedules.length === 0 && <p className="text-slate-400 text-center py-12">まだ登録されていません</p>}
        {schedules.map((schedule) => (
          <div key={schedule.id} className="bg-white rounded-lg border border-slate-100 shadow-sm px-5 py-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-800">{schedule.title}</span>
              {schedule.date && <span className="text-sm text-slate-400">{new Date(schedule.date).toLocaleString('ja-JP')}</span>}
            </div>
            {schedule.memo && <p className="text-sm text-slate-500 mt-2">{schedule.memo}</p>}
            {schedule.google_event_id && <p className="text-xs text-emerald-500 mt-1">✅ Googleカレンダー連携済み</p>}
            {calendarStatus[schedule.id] && <p className="text-xs text-slate-400 mt-1">{calendarStatus[schedule.id]}</p>}
            <button onClick={() => handleDelete(schedule.id, schedule.google_event_id)}
              className="mt-3 px-3 py-1 bg-red-50 text-red-500 text-sm rounded-md hover:bg-red-100 transition-colors">
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}