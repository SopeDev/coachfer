import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/session'
import { serializeSessionForMember } from '@/lib/booking-policy'
import { DEFAULT_TIMEZONE } from '@/lib/timezone'

export const dynamic = 'force-dynamic'

export async function GET(_request, { params }) {
  const { session, error } = await requireUser()
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { timezone: true }
  })
  const viewerTimezone = user?.timezone || DEFAULT_TIMEZONE

  const live = await prisma.liveSession.findUnique({
    where: { id: params.id },
    include: {
      bookings: {
        where: {
          OR: [{ status: 'RESERVED' }, { userId: session.user.id }]
        },
        select: {
          id: true,
          userId: true,
          status: true,
          bookedAt: true,
          cancelledAt: true,
          zoomJoinUrl: true
        }
      }
    }
  })

  if (!live) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  const reservedCount = live.bookings.filter((b) => b.status === 'RESERVED').length
  const viewerBooking =
    live.bookings.find((b) => b.userId === session.user.id) || null

  // Keep zoomMeetingId for bookability checks; serializeSessionForMember
  // never exposes host URLs / meeting IDs to the client payload.
  const { bookings, ...sessionRow } = live

  return NextResponse.json({
    viewerTimezone,
    session: serializeSessionForMember(sessionRow, {
      reservedCount,
      viewerBooking,
      viewerTimezone
    })
  })
}
