'use client'

/**
 * Official session time (session timezone) + optional local hint.
 */
export default function SessionWhen({
  startsAt,
  sessionTimezone,
  viewerTimezone,
  className = ''
}) {
  if (!startsAt) return null

  const sessionTz = sessionTimezone || 'America/Mexico_City'
  const official = new Date(startsAt).toLocaleString('es-MX', {
    timeZone: sessionTz,
    dateStyle: 'full',
    timeStyle: 'short'
  })

  const showLocal =
    viewerTimezone &&
    viewerTimezone !== sessionTz &&
    (() => {
      try {
        return new Date(startsAt).toLocaleString('es-MX', {
          timeZone: viewerTimezone,
          dateStyle: 'full',
          timeStyle: 'short'
        })
      } catch {
        return null
      }
    })()

  return (
    <div className={`session-when ${className}`.trim()}>
      <p className="session-when__official">
        {official}
        <span className="session-when__tz"> · hora oficial</span>
      </p>
      {showLocal ? (
        <p className="session-when__local">En tu zona: {showLocal}</p>
      ) : null}
    </div>
  )
}
