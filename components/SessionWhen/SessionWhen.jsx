'use client'

import { getTimezoneUtcOffset } from '../../lib/timezone'

/**
 * Session date/time in the viewer's preferred timezone.
 */
export default function SessionWhen({
  startsAt,
  sessionTimezone,
  viewerTimezone,
  className = ''
}) {
  if (!startsAt) return null

  const sessionTz = sessionTimezone || 'America/Mexico_City'
  let displayTimezone = viewerTimezone || sessionTz
  let displayTime
  try {
    displayTime = new Date(startsAt).toLocaleString('es-MX', {
      timeZone: displayTimezone,
      dateStyle: 'full',
      timeStyle: 'short'
    })
  } catch {
    displayTimezone = sessionTz
    displayTime = new Date(startsAt).toLocaleString('es-MX', {
      timeZone: sessionTz,
      dateStyle: 'full',
      timeStyle: 'short'
    })
  }

  return (
    <div className={`session-when ${className}`.trim()}>
      <p className="session-when__local">
        {displayTime}
        <span className="session-when__tz">
          {' '}
          · {displayTimezone} ({getTimezoneUtcOffset(displayTimezone)})
        </span>
      </p>
    </div>
  )
}
