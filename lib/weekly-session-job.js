import prisma from './prisma'
import { createRegisteredMeeting } from './zoom'
import {
  getWeeklyClassWindow,
  readWeeklySessionConfig
} from './weekly-session'

/**
 * Idempotently create the upcoming weekly live session + Zoom meeting.
 * Finds the next configured weekday/time (e.g. Thursday 19:00 CDMX).
 * If that session already exists, returns it without creating a duplicate.
 */
export const ensureWeeklyLiveSession = async (now = new Date()) => {
  const config = readWeeklySessionConfig()
  const { startsAt, endsAt, dateLabel } = getWeeklyClassWindow(now, config)

  const slug = `entrenamiento-${dateLabel}`
  const title = config.titleTemplate.replace('{date}', dateLabel)

  const existing = await prisma.liveSession.findUnique({ where: { slug } })
  if (existing) {
    return { created: false, session: existing, reason: 'ALREADY_EXISTS' }
  }

  // Also skip if another session already covers the same start window
  const sameStart = await prisma.liveSession.findFirst({
    where: {
      startsAt,
      status: { in: ['DRAFT', 'SCHEDULED', 'LIVE'] }
    }
  })
  if (sameStart) {
    return { created: false, session: sameStart, reason: 'SAME_START_EXISTS' }
  }

  const zoom = await createRegisteredMeeting({
    topic: title,
    startTime: startsAt,
    durationMinutes: config.durationMinutes,
    timezone: config.timeZone,
    agenda: config.description
  })

  const session = await prisma.liveSession.create({
    data: {
      title,
      slug,
      description: config.description,
      startsAt,
      endsAt,
      timezone: config.timeZone,
      capacity: config.capacity,
      status: 'SCHEDULED',
      zoomMeetingId: zoom.meetingId,
      zoomJoinUrl: zoom.startUrl || zoom.joinUrl,
      cancelDeadlineHours: config.cancelDeadlineHours,
      notes: 'Creada automáticamente (sesión semanal)'
    }
  })

  return { created: true, session, zoom }
}
