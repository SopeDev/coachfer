import { zonedLocalToUtc } from './weekly-session'
import { DEFAULT_TIMEZONE } from './timezone'

export { DEFAULT_TIMEZONE }

/**
 * Convert a datetime-local style wall clock (YYYY-MM-DDTHH:mm) in `timeZone`
 * to a UTC Date. Avoids treating browser-local as the session timezone.
 * Server-only helper (used by admin session create).
 */
export const wallClockLocalInputToUtc = (
  localInput,
  timeZone = DEFAULT_TIMEZONE
) => {
  if (!localInput || typeof localInput !== 'string') {
    throw new Error('INVALID_LOCAL_INPUT')
  }

  const [datePart, timePart = '00:00'] = localInput.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute = 0, second = 0] = timePart.split(':').map(Number)

  return zonedLocalToUtc(
    { year, month, day, hour, minute, second },
    timeZone
  )
}
