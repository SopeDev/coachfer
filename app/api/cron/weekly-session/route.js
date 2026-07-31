import { NextResponse } from 'next/server'
import { ensureWeeklyLiveSession } from '@/lib/weekly-session-job'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const authorize = (request) => {
  const secret = process.env.CRON_SECRET
  if (!secret) return false

  const auth = request.headers.get('authorization') || ''
  if (auth === `Bearer ${secret}`) return true

  // Vercel Cron sends this header on Pro plans; still require secret match via query optional
  const cronHeader = request.headers.get('x-vercel-cron')
  const url = new URL(request.url)
  const key = url.searchParams.get('secret')
  if (cronHeader && key === secret) return true
  if (key === secret) return true

  return false
}

export async function GET(request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const result = await ensureWeeklyLiveSession(new Date())
    return NextResponse.json({
      ok: true,
      created: result.created,
      reason: result.reason || null,
      session: {
        id: result.session.id,
        title: result.session.title,
        slug: result.session.slug,
        startsAt: result.session.startsAt,
        endsAt: result.session.endsAt,
        zoomMeetingId: result.session.zoomMeetingId,
        status: result.session.status
      }
    })
  } catch (error) {
    console.error('[cron/weekly-session]', error)
    return NextResponse.json(
      { error: error.message || 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}

// Allow manual/admin-style POST with same auth
export async function POST(request) {
  return GET(request)
}
