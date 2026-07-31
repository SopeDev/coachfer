const DEFAULT_CANCEL_HOURS = 2

export const getCancelDeadlineHours = (session) => {
  if (session?.cancelDeadlineHours != null) {
    return session.cancelDeadlineHours
  }
  const fromEnv = Number(process.env.BOOKING_CANCEL_DEADLINE_HOURS)
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv
  return DEFAULT_CANCEL_HOURS
}

export const getCancelDeadlineAt = (session) => {
  const hours = getCancelDeadlineHours(session)
  return new Date(new Date(session.startsAt).getTime() - hours * 60 * 60 * 1000)
}

export const countReserved = (bookingsOrCount) => {
  if (typeof bookingsOrCount === 'number') return bookingsOrCount
  if (!Array.isArray(bookingsOrCount)) return 0
  return bookingsOrCount.filter((b) => b.status === 'RESERVED').length
}

export const getSpotsRemaining = (session, reservedCount) => {
  const taken = reservedCount ?? 0
  return Math.max(0, (session.capacity || 0) - taken)
}

export const isSessionBookable = (session, reservedCount, now = new Date()) => {
  if (!session) return { ok: false, error: 'SESSION_NOT_FOUND' }
  if (!['SCHEDULED', 'LIVE'].includes(session.status)) {
    return { ok: false, error: 'SESSION_NOT_BOOKABLE' }
  }
  if (!session.zoomMeetingId) {
    return { ok: false, error: 'ZOOM_NOT_CONFIGURED' }
  }
  if (new Date(session.startsAt) <= now) {
    return { ok: false, error: 'SESSION_STARTED' }
  }
  if (session.bookingClosesAt && new Date(session.bookingClosesAt) <= now) {
    return { ok: false, error: 'BOOKING_CLOSED' }
  }
  if (getSpotsRemaining(session, reservedCount) <= 0) {
    return { ok: false, error: 'SESSION_FULL' }
  }
  return { ok: true }
}

export const canCancelBooking = (booking, session, now = new Date()) => {
  if (!booking || booking.status !== 'RESERVED') {
    return { ok: false, error: 'BOOKING_NOT_ACTIVE' }
  }
  if (now >= getCancelDeadlineAt(session)) {
    return { ok: false, error: 'CANCEL_DEADLINE_PASSED' }
  }
  return { ok: true }
}

export const serializeSessionForMember = (
  session,
  { reservedCount, viewerBooking, viewerTimezone } = {}
) => {
  const spotsTaken = reservedCount ?? 0
  const spotsRemaining = getSpotsRemaining(session, spotsTaken)
  const bookable = isSessionBookable(session, spotsTaken)

  return {
    id: session.id,
    title: session.title,
    slug: session.slug,
    description: session.description,
    startsAt: session.startsAt,
    endsAt: session.endsAt,
    timezone: session.timezone,
    viewerTimezone: viewerTimezone || null,
    capacity: session.capacity,
    status: session.status,
    materialsUrl: session.materialsUrl,
    recordingUrl: session.recordingUrl,
    recordingAvailableAt: session.recordingAvailableAt,
    cancelDeadlineHours: getCancelDeadlineHours(session),
    cancelDeadlineAt: getCancelDeadlineAt(session),
    spotsTaken,
    spotsRemaining,
    canBook: bookable.ok,
    bookError: bookable.ok ? null : bookable.error,
    viewerBooking: viewerBooking
      ? {
          id: viewerBooking.id,
          status: viewerBooking.status,
          bookedAt: viewerBooking.bookedAt,
          cancelledAt: viewerBooking.cancelledAt,
          zoomJoinUrl:
            viewerBooking.status === 'RESERVED' ? viewerBooking.zoomJoinUrl : null,
          canCancel: canCancelBooking(viewerBooking, session).ok
        }
      : null
  }
}
