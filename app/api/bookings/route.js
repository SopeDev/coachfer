import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/session'
import { reserveLiveSession } from '@/lib/bookings'
import { serializeSessionForMember } from '@/lib/booking-policy'
import prisma from '@/lib/prisma'
import { DEFAULT_TIMEZONE } from '@/lib/timezone'

const schema = z.object({
  liveSessionId: z.string().min(1)
})

export async function POST(request) {
  const { session, error } = await requireUser()
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  try {
    const booking = await reserveLiveSession({
      userId: session.user.id,
      liveSessionId: parsed.data.liveSessionId
    })

    const [reservedCount, user] = await Promise.all([
      prisma.booking.count({
        where: { liveSessionId: booking.liveSessionId, status: 'RESERVED' }
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { timezone: true }
      })
    ])

    const viewerTimezone = user?.timezone || DEFAULT_TIMEZONE

    return NextResponse.json({
      booking: {
        id: booking.id,
        status: booking.status,
        bookedAt: booking.bookedAt,
        zoomJoinUrl: booking.zoomJoinUrl
      },
      session: serializeSessionForMember(booking.liveSession, {
        reservedCount,
        viewerBooking: booking,
        viewerTimezone
      })
    })
  } catch (err) {
    const message = err?.message || 'SERVER_ERROR'
    const status =
      message === 'ALREADY_RESERVED' ||
      message === 'SESSION_FULL' ||
      message === 'INSUFFICIENT_CREDITS' ||
      message === 'SESSION_NOT_BOOKABLE' ||
      message === 'SESSION_STARTED' ||
      message === 'BOOKING_CLOSED' ||
      message === 'ZOOM_NOT_CONFIGURED'
        ? 400
        : message === 'ZOOM_REGISTRATION_FAILED'
          ? 502
          : message === 'SESSION_NOT_FOUND' || message === 'USER_NOT_FOUND'
            ? 404
            : 500

    return NextResponse.json({ error: message }, { status })
  }
}
