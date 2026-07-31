import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/session'
import { cancelLiveSessionBooking } from '@/lib/bookings'

export async function POST(_request, { params }) {
  const { session, error } = await requireUser()
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  try {
    const booking = await cancelLiveSessionBooking({
      userId: session.user.id,
      bookingId: params.id
    })

    return NextResponse.json({
      booking: {
        id: booking.id,
        status: booking.status,
        cancelledAt: booking.cancelledAt
      }
    })
  } catch (err) {
    const message = err?.message || 'SERVER_ERROR'
    const status =
      message === 'CANCEL_DEADLINE_PASSED' ||
      message === 'BOOKING_NOT_ACTIVE'
        ? 400
        : message === 'BOOKING_NOT_FOUND'
          ? 404
          : 500

    return NextResponse.json({ error: message }, { status })
  }
}
