'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'

type Schedule = {
  id: string
  title: string
  date: string
  memo: string
  company_id: string
  google_event_id?: string
  companies: { name: string }
}

export default function SchedulePage() {
  const supabase = createClient()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [tab, setTab] = useState<'calendar' | 'list'>('calendar')
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('schedules')
        .select('*, companies(name)')
        .order('date', { ascending: true })
      if (data) setSchedules(data)
    }
    fetch()
  }, [])

  // カレンダー用の計算
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const schedulesOnDay = (day: number) => {
    return schedules.filter(s => {
      if (!s.date) return false
      const d = new Date(s.date)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  return (
    <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>スケジュール</h1>

      {/* タブ */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['calendar', 'list'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', border: 'none',
            background: tab === t ? '#1e293b' : 'white',
            color: tab === t ? 'white' : '#64748b',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}>
            {t === 'calendar' ? '📅 カレンダー' : '📋 リスト'}
          </button>
        ))}
      </div>

      {/* カレンダービュー */}
      {tab === 'calendar' && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '24px' }}>
          {/* ヘッダー */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={prevMonth} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', background: 'white', fontSize: '14px' }}>←</button>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1e293b' }}>{year}年{month + 1}月</span>
            <button onClick={nextMonth} style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', background: 'white', fontSize: '14px' }}>→</button>
          </div>

          {/* 曜日 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px' }}>
            {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
              <div key={d} style={{ fontSize: '12px', fontWeight: '600', color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#94a3b8', padding: '4px' }}>{d}</div>
            ))}
          </div>

          {/* 日付グリッド */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const daySchedules = schedulesOnDay(day)
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
              const dayOfWeek = (firstDay + i) % 7
              return (
                <div key={day} style={{
                  minHeight: '64px', padding: '4px', borderRadius: '6px',
                  background: isToday ? '#f0f9ff' : '#fafafa',
                  border: isToday ? '1px solid #38bdf8' : '1px solid #f1f5f9',
                }}>
                  <div style={{
                    fontSize: '12px', fontWeight: isToday ? 'bold' : 'normal',
                    color: isToday ? '#0284c7' : dayOfWeek === 0 ? '#ef4444' : dayOfWeek === 6 ? '#3b82f6' : '#475569',
                    marginBottom: '2px',
                  }}>{day}</div>
                  {daySchedules.map(s => (
                    <Link key={s.id} href={`/companies/${s.company_id}/schedules`}>
                      <div style={{
                        fontSize: '10px', background: '#1e293b', color: 'white',
                        borderRadius: '3px', padding: '1px 4px', marginBottom: '2px',
                        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                        cursor: 'pointer',
                      }}>
                        {s.title}
                      </div>
                    </Link>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* リストビュー */}
      {tab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {schedules.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', padding: '48px' }}>スケジュールがありません</p>}
          {schedules.map(s => (
            <Link key={s.id} href={`/companies/${s.company_id}/schedules`}>
              <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: '500', color: '#1e293b' }}>{s.title}</span>
                  <span style={{ marginLeft: '8px', fontSize: '13px', color: '#94a3b8' }}>{s.companies?.name}</span>
                  {s.memo && <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{s.memo}</p>}
                </div>
                {s.date && <span style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap', marginLeft: '16px' }}>{new Date(s.date).toLocaleString('ja-JP')}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}