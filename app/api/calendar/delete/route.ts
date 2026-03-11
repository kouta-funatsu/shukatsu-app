import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { eventId } = await request.json()
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('google_access_token')?.value

  if (!accessToken || !eventId) {
    return NextResponse.json({ success: false })
  }

  await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  return NextResponse.json({ success: true })
}