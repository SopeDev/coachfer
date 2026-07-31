import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/session'
import { canCancelBooking, getCancelDeadlineHours } from '@/lib/booking-policy'
import { DEFAULT_TIMEZONE } from '@/lib/timezone'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { session, error } = await requireUser()
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { timezone: true }
  })
  const viewerTimezone = user?.timezone || DEFAULT_TIMEZONE

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    orderBy: { bookedAt: 'desc' },
    include: {
      liveSession: {
        select: {
          id: true,
          title: true,
          slug: true,
          startsAt: true,
          endsAt: true,
          timezone: true,
          status: true,
          capacity: true,
          cancelDeadlineHours: true,
          materialsUrl: true
        }
      }
    }
  })

  return NextResponse.json({
    viewerTimezone,
    bookings: bookings.map((b) => ({
      id: b.id,
      status: b.status,
      bookedAt: b.bookedAt,
      cancelledAt: b.cancelledAt,
      zoomJoinUrl: b.status === 'RESERVED' ? b.zoomJoinUrl : null,
      canCancel: canCancelBooking(b, b.liveSession).ok,
      cancelDeadlineHours: getCancelDeadlineHours(b.liveSession),
      liveSession: b.liveSession,
      viewerTimezone
    }))
  })
}
