/**
 * Build weekly live session schedule times in a named timezone (no extra deps).
 */

export const getZonedParts = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    weekday: 'short'
  }).formatToParts(date)

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: weekdayMap[map.weekday]
  }
}

/**
 * Convert a wall-clock local datetime in `timeZone` to a UTC Date.
 */
export const zonedLocalToUtc = (
  { year, month, day, hour = 0, minute = 0, second = 0 },
  timeZone
) => {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second)
  let ts = utcGuess

  for (let i = 0; i < 3; i += 1) {
    const asTz = getZonedParts(new Date(ts), timeZone)
    const desiredAsUtc = Date.UTC(year, month - 1, day, hour, minute, second)
    const actualAsUtc = Date.UTC(
      asTz.year,
      asTz.month - 1,
      asTz.day,
      asTz.hour,
      asTz.minute,
      asTz.second
    )
    ts += desiredAsUtc - actualAsUtc
  }

  return new Date(ts)
}

export const addDaysToParts = (parts, days) => {
  const base = new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
  base.setUTCDate(base.getUTCDate() + days)
  return {
    year: base.getUTCFullYear(),
    month: base.getUTCMonth() + 1,
    day: base.getUTCDate()
  }
}

/**
 * Monday 00:00 of the week containing `now` in `timeZone`.
 */
export const getWeekMondayLocal = (now, timeZone) => {
  const parts = getZonedParts(now, timeZone)
  const daysFromMonday = (parts.weekday + 6) % 7 // Mon=0 ... Sun=6
  return addDaysToParts(parts, -daysFromMonday)
}

/**
 * Class start/end for the upcoming weekly slot (or this week's if still ahead).
 * weekday: 0=Sun ... 6=Sat (JS style). Default Wed=3.
 *
 * If this week's class already started (or is in the past), returns next week's.
 * Monday cron and the admin "create now" button both use this so we always
 * target the next Thursday (etc.) at the configured local time — never "today".
 */
export const getWeeklyClassWindow = (
  now = new Date(),
  {
    timeZone = 'America/Mexico_City',
    weekday = 3,
    hour = 19,
    minute = 0,
    durationMinutes = 120
  } = {}
) => {
  const monday = getWeekMondayLocal(now, timeZone)
  const daysFromMonday = (weekday + 6) % 7
  let classDay = addDaysToParts(monday, daysFromMonday)

  let startsAt = zonedLocalToUtc(
    {
      year: classDay.year,
      month: classDay.month,
      day: classDay.day,
      hour,
      minute,
      second: 0
    },
    timeZone
  )

  // Past or already started → roll forward one week
  if (startsAt.getTime() <= now.getTime()) {
    classDay = addDaysToParts(classDay, 7)
    startsAt = zonedLocalToUtc(
      {
        year: classDay.year,
        month: classDay.month,
        day: classDay.day,
        hour,
        minute,
        second: 0
      },
      timeZone
    )
  }

  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60 * 1000)

  const yyyy = String(classDay.year)
  const mm = String(classDay.month).padStart(2, '0')
  const dd = String(classDay.day).padStart(2, '0')
  const dateLabel = `${yyyy}-${mm}-${dd}`

  const weekMonday = getWeekMondayLocal(startsAt, timeZone)

  return { startsAt, endsAt, dateLabel, monday: weekMonday, classDay }
}

export const readWeeklySessionConfig = () => {
  const timeZone = process.env.DEFAULT_TIMEZONE || 'America/Mexico_City'
  const weekday = Number(process.env.WEEKLY_SESSION_WEEKDAY ?? 3)
  const hour = Number(process.env.WEEKLY_SESSION_HOUR ?? 19)
  const minute = Number(process.env.WEEKLY_SESSION_MINUTE ?? 0)
  const durationMinutes = Number(process.env.WEEKLY_SESSION_DURATION_MINUTES ?? 120)
  const capacity = Number(process.env.WEEKLY_SESSION_CAPACITY ?? 50)
  const titleTemplate =
    process.env.WEEKLY_SESSION_TITLE ||
    'Entrenamiento de la Consciencia — {date}'
  const description =
    process.env.WEEKLY_SESSION_DESCRIPTION ||
    'Sesión semanal en vivo del laboratorio de consciencia.'
  const cancelDeadlineHours = Number(
    process.env.BOOKING_CANCEL_DEADLINE_HOURS ?? 2
  )

  return {
    timeZone,
    weekday,
    hour,
    minute,
    durationMinutes,
    capacity,
    titleTemplate,
    description,
    cancelDeadlineHours
  }
}
