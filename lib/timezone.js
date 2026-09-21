/**
 * Shared timezone constants + formatting (safe for client + server).
 *
 * Live class truth: LiveSession.startsAt/endsAt (UTC) + LiveSession.timezone.
 * User.timezone: display preference for personal dates + “en tu hora” hints.
 */

export const DEFAULT_TIMEZONE =
  process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE ||
  process.env.DEFAULT_TIMEZONE ||
  'America/Mexico_City'

export const TIMEZONE_OPTIONS = [
  { value: 'America/Mexico_City', label: 'Ciudad de México (CDMX)' },
  { value: 'America/Cancun', label: 'Cancún (Quintana Roo)' },
  { value: 'America/Merida', label: 'Mérida' },
  { value: 'America/Monterrey', label: 'Monterrey' },
  { value: 'America/Tijuana', label: 'Tijuana' },
  { value: 'America/Chihuahua', label: 'Chihuahua' },
  { value: 'America/Bogota', label: 'Bogotá' },
  { value: 'America/Lima', label: 'Lima' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires' },
  { value: 'America/Santiago', label: 'Santiago' },
  { value: 'Europe/Madrid', label: 'Madrid' }
]

export const getTimezoneLabel = (timeZone) => {
  const found = TIMEZONE_OPTIONS.find((tz) => tz.value === timeZone)
  return found?.label || timeZone || DEFAULT_TIMEZONE
}

export const getTimezoneUtcOffset = (timeZone, date = new Date()) => {
  try {
    const offset = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset'
    })
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value

    if (!offset || offset === 'GMT') return 'UTC+0'

    const match = offset.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/)
    if (!match) return offset.replace('GMT', 'UTC')

    const [, sign, hours, minutes] = match
    const displaySign = sign === '-' ? '−' : '+'
    return `UTC${displaySign}${Number(hours)}${minutes ? `:${minutes}` : ''}`
  } catch {
    return timeZone
  }
}

export const formatSessionTitle = (
  title,
  startsAt,
  timeZone = DEFAULT_TIMEZONE
) => {
  const match = title?.match(/^(.*?)\s+[—-]\s+\d{4}-\d{2}-\d{2}\s*$/)
  if (!match || !startsAt) return title

  try {
    const date = new Intl.DateTimeFormat('es-MX', {
      timeZone: timeZone || DEFAULT_TIMEZONE,
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(startsAt))

    return `${match[1]} — ${date}`
  } catch {
    return title
  }
}

export const formatDateTime = (
  value,
  {
    timeZone = DEFAULT_TIMEZONE,
    locale = 'es-MX',
    dateStyle = 'medium',
    timeStyle = 'short'
  } = {}
) => {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString(locale, {
      timeZone: timeZone || DEFAULT_TIMEZONE,
      dateStyle,
      timeStyle
    })
  } catch {
    return new Date(value).toISOString()
  }
}

export const formatSessionWhen = (value, sessionTimeZone = DEFAULT_TIMEZONE) =>
  formatDateTime(value, {
    timeZone: sessionTimeZone || DEFAULT_TIMEZONE,
    dateStyle: 'full',
    timeStyle: 'short'
  })
