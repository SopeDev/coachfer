import prisma from './prisma'
import {
  canCancelBooking,
  getCancelDeadlineHours,
  isSessionBookable
} from './booking-policy'
import {
  consumeCreditForBooking,
  releaseCreditForBooking
} from './credits'
import { addMeetingRegistrant, removeMeetingRegistrant } from './zoom'
import {
  sendBookingCancellationEmail,
  sendBookingConfirmationEmail
} from './mail'

const splitName = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return { firstName: 'Participante', lastName: 'AstroHacking' }
  if (parts.length === 1) return { firstName: parts[0], lastName: 'AstroHacking' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

export const reserveLiveSession = async ({ userId, liveSessionId }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.disabledAt) throw new Error('USER_NOT_FOUND')

  const booking = await prisma.$transaction(async (tx) => {
    const session = await tx.liveSession.findUnique({
      where: { id: liveSessionId }
    })

    const reservedCount = await tx.booking.count({
      where: { liveSessionId, status: 'RESERVED' }
    })

    const bookable = isSessionBookable(session, reservedCount)
    if (!bookable.ok) throw new Error(bookable.error)

    const existing = await tx.booking.findUnique({
      where: {
        userId_liveSessionId: { userId, liveSessionId }
      }
    })

    if (existing?.status === 'RESERVED') {
      throw new Error('ALREADY_RESERVED')
    }

    // Consume credit first to get grant id
    const grant = await consumeCreditForBooking(tx, {
      userId,
      sessionStartsAt: session.startsAt
    })

    let created
    if (existing) {
      created = await tx.booking.update({
        where: { id: existing.id },
        data: {
          status: 'RESERVED',
          creditGrantId: grant.id,
          bookedAt: new Date(),
          cancelledAt: null,
          zoomRegistrantId: null,
          zoomJoinUrl: null,
          zoomRegistrantEmail: user.email
        },
        include: { liveSession: true }
      })
    } else {
      created = await tx.booking.create({
        data: {
          userId,
          liveSessionId,
          creditGrantId: grant.id,
          status: 'RESERVED',
          zoomRegistrantEmail: user.email
        },
        include: { liveSession: true }
      })
    }

    await tx.creditTransaction.create({
      data: {
        userId,
        creditGrantId: grant.id,
        bookingId: created.id,
        amount: -1,
        type: 'RESERVATION',
        reason: `Reserva: ${session.title}`,
        createdBy: userId
      }
    })

    return created
  })

  // Zoom registration after DB commit; compensate on failure
  try {
    const { firstName, lastName } = splitName(user.name)
    const registrant = await addMeetingRegistrant({
      meetingId: booking.liveSession.zoomMeetingId,
      email: user.email,
      firstName,
      lastName
    })

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        zoomRegistrantId: registrant.registrantId,
        zoomJoinUrl: registrant.joinUrl,
        zoomRegistrantEmail: registrant.email
      },
      include: { liveSession: true }
    })

    sendBookingConfirmationEmail({
      to: user.email,
      name: user.name,
      sessionTitle: updated.liveSession.title,
      startsAt: updated.liveSession.startsAt,
      timezone: updated.liveSession.timezone,
      zoomJoinUrl: updated.zoomJoinUrl,
      cancelDeadlineHours: getCancelDeadlineHours(updated.liveSession)
    }).catch((err) => console.error('[booking] confirm email failed', err))

    return updated
  } catch (err) {
    console.error('[booking] zoom register failed — rolling back', err)
    await prisma.$transaction(async (tx) => {
      const current = await tx.booking.findUnique({ where: { id: booking.id } })
      if (!current || current.status !== 'RESERVED') return

      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          notes: 'Auto-cancel: Zoom registration failed'
        }
      })

      await releaseCreditForBooking(tx, {
        userId,
        creditGrantId: current.creditGrantId,
        bookingId: current.id,
        reason: 'Rollback: fallo al registrar en Zoom'
      })
    })

    throw new Error('ZOOM_REGISTRATION_FAILED')
  }
}

export const cancelLiveSessionBooking = async ({ userId, bookingId }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('USER_NOT_FOUND')

  const existing = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { liveSession: true }
  })

  if (!existing || existing.userId !== userId) {
    throw new Error('BOOKING_NOT_FOUND')
  }

  const cancelCheck = canCancelBooking(existing, existing.liveSession)
  if (!cancelCheck.ok) throw new Error(cancelCheck.error)

  const cancelled = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { liveSession: true }
    })

    if (!booking || booking.userId !== userId || booking.status !== 'RESERVED') {
      throw new Error('BOOKING_NOT_ACTIVE')
    }

    const updated = await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
      },
      include: { liveSession: true }
    })

    await releaseCreditForBooking(tx, {
      userId,
      creditGrantId: booking.creditGrantId,
      bookingId: booking.id,
      reason: `Cancelación: ${booking.liveSession.title}`
    })

    return updated
  })

  removeMeetingRegistrant({
    meetingId: cancelled.liveSession.zoomMeetingId,
    registrantId: existing.zoomRegistrantId
  }).catch((err) => console.error('[booking] zoom unregister failed', err))

  sendBookingCancellationEmail({
    to: user.email,
    name: user.name,
    sessionTitle: cancelled.liveSession.title,
    startsAt: cancelled.liveSession.startsAt,
    timezone: cancelled.liveSession.timezone
  }).catch((err) => console.error('[booking] cancel email failed', err))

  return cancelled
}
