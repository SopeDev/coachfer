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
