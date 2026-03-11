import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { title, date, memo, scheduleId } = await request.json()
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('google_access_token')?.value

  if (!accessToken) {
    return NextResponse.json({ success: false, error: 'No access token' })
  }

  const startTime = new Date(date).toISOString()
  const endTime = new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString()

  const event = {
    summary: title,
    description: memo || '',
    start: { dateTime: startTime, timeZone: 'Asia/Tokyo' },
    end: { dateTime: endTime, timeZone: 'Asia/Tokyo' },
  }

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json({ success: false, error: data })
  }

  // google_event_idをSupabaseに保存
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
  await supabase.from('schedules').update({ google_event_id: data.id }).eq('id', scheduleId)

  return NextResponse.json({ success: true, eventId: data.id })
}