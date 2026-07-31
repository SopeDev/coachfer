import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { ensureWeeklyLiveSession } from '@/lib/weekly-session-job'

export async function POST() {
  const { error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  try {
    const result = await ensureWeeklyLiveSession(new Date())
    return NextResponse.json({
      created: result.created,
      reason: result.reason || null,
      session: {
        id: result.session.id,
        title: result.session.title,
        slug: result.session.slug,
        startsAt: result.session.startsAt,
        zoomMeetingId: result.session.zoomMeetingId,
        status: result.session.status
      }
    })
  } catch (err) {
    console.error('[admin/run-weekly-cron]', err)
    return NextResponse.json(
      { error: err.message || 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
