import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/session'
import { serializeSessionForMember } from '@/lib/booking-policy'
import { DEFAULT_TIMEZONE } from '@/lib/timezone'

export const dynamic = 'force-dynamic'

const getViewerTimezone = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true }
  })
  return user?.timezone || DEFAULT_TIMEZONE
}

export async function GET() {
  const { session, error } = await requireUser()
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  const viewerTimezone = await getViewerTimezone(session.user.id)
  const now = new Date()
  const sessions = await prisma.liveSession.findMany({
    where: {
      status: { in: ['SCHEDULED', 'LIVE'] },
      startsAt: { gte: now }
    },
    orderBy: { startsAt: 'asc' },
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

  return NextResponse.json({
    viewerTimezone,
    sessions: sessions.map((live) => {
      const reservedCount = live.bookings.filter((b) => b.status === 'RESERVED').length
      const viewerBooking =
        live.bookings.find((b) => b.userId === session.user.id) || null
      const { bookings, ...sessionRow } = live
      return serializeSessionForMember(sessionRow, {
        reservedCount,
        viewerBooking,
        viewerTimezone
      })
    })
  })
}
