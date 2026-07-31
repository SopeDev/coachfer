const ZOOM_TOKEN_URL = 'https://zoom.us/oauth/token'
const ZOOM_API_BASE = 'https://api.zoom.us/v2'

let cachedToken = null
let cachedExpiry = 0

const getZoomConfig = () => {
  const accountId = process.env.ZOOM_ACCOUNT_ID
  const clientId = process.env.ZOOM_CLIENT_ID
  const clientSecret = process.env.ZOOM_CLIENT_SECRET

  if (!accountId || !clientId || !clientSecret) {
    return null
  }

  return { accountId, clientId, clientSecret }
}

export const isZoomConfigured = () => !!getZoomConfig()

const getAccessToken = async () => {
  const config = getZoomConfig()
  if (!config) {
    throw new Error('ZOOM_NOT_CONFIGURED')
  }

  if (cachedToken && Date.now() < cachedExpiry - 60_000) {
    return cachedToken
  }

  const basic = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString(
    'base64'
  )
  const url = `${ZOOM_TOKEN_URL}?grant_type=account_credentials&account_id=${encodeURIComponent(config.accountId)}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`
    }
  })

  if (!response.ok) {
    const text = await response.text()
    console.error('[zoom] token error', response.status, text)
    throw new Error('ZOOM_AUTH_FAILED')
  }

  const data = await response.json()
  cachedToken = data.access_token
  cachedExpiry = Date.now() + (data.expires_in || 3600) * 1000
  return cachedToken
}

const zoomFetch = async (path, options = {}) => {
  const token = await getAccessToken()
  const response = await fetch(`${ZOOM_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })

  const text = await response.text()
  let body = null
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = { raw: text }
  }

  if (!response.ok) {
    const err = new Error(body?.message || body?.code || 'ZOOM_API_ERROR')
    err.status = response.status
    err.body = body
    throw err
  }

  return body
}

/**
 * Register a member on a Zoom meeting (registration must be enabled).
 * Returns { registrantId, joinUrl, email }
 */
export const addMeetingRegistrant = async ({
  meetingId,
  email,
  firstName,
  lastName
}) => {
  if (!meetingId) throw new Error('ZOOM_MEETING_ID_REQUIRED')
  if (!email) throw new Error('EMAIL_REQUIRED')

  // Dev fallback when Zoom creds are missing — still lets booking UX work
  if (!isZoomConfigured()) {
    console.warn('[zoom] Not configured — using placeholder registrant join URL')
    return {
      registrantId: `dev_${Date.now()}`,
      joinUrl: `https://zoom.us/w/dev-placeholder?email=${encodeURIComponent(email)}`,
      email
    }
  }

  const data = await zoomFetch(`/meetings/${meetingId}/registrants`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      first_name: firstName || 'Participante',
      last_name: lastName || 'AstroHacking',
      auto_approve: true
    })
  })

  return {
    registrantId: String(data.registrant_id || data.id || ''),
    joinUrl: data.join_url,
    email
  }
}

export const removeMeetingRegistrant = async ({ meetingId, registrantId }) => {
  if (!meetingId || !registrantId) return { skipped: true }

  if (!isZoomConfigured()) {
    console.warn('[zoom] Not configured — skip registrant removal')
    return { skipped: true }
  }

  await zoomFetch(
    `/meetings/${meetingId}/registrants/${encodeURIComponent(registrantId)}`,
    { method: 'DELETE' }
  )

  return { ok: true }
}

/**
 * Create a one-time Zoom meeting with registration required.
 * hostUserId: Zoom user id or email (env ZOOM_HOST_USER_ID / ZOOM_HOST_EMAIL).
 */
export const createRegisteredMeeting = async ({
  topic,
  startTime,
  durationMinutes = 120,
  timezone = 'America/Mexico_City',
  agenda
}) => {
  const host =
    process.env.ZOOM_HOST_USER_ID ||
    process.env.ZOOM_HOST_EMAIL ||
    'me'

  if (!isZoomConfigured()) {
    const fakeId = `dev${Date.now()}`
    console.warn('[zoom] Not configured — using placeholder meeting', fakeId)
    return {
      meetingId: fakeId,
      joinUrl: `https://zoom.us/j/${fakeId}`,
      startUrl: null,
      topic
    }
  }

  const data = await zoomFetch(`/users/${encodeURIComponent(host)}/meetings`, {
    method: 'POST',
    body: JSON.stringify({
      topic,
      type: 2, // scheduled
      start_time: startTime.toISOString().replace(/\.\d{3}Z$/, 'Z'),
      duration: durationMinutes,
      timezone,
      agenda: agenda || undefined,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
        approval_type: 0, // automatically approve
        registration_type: 1, // register once for this meeting
        meeting_authentication: false
      }
    })
  })

  return {
    meetingId: String(data.id),
    joinUrl: data.join_url || null,
    startUrl: data.start_url || null,
    topic: data.topic || topic
  }
}
