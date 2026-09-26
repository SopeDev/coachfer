'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SessionWhen from '../../../components/SessionWhen/SessionWhen'
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal'
import Toast from '../../../components/Toast/Toast'
import {
  DEFAULT_TIMEZONE,
  formatSessionTitle,
  getTimezoneUtcOffset
} from '../../../lib/timezone'

const bookingErrors = {
  INSUFFICIENT_CREDITS: 'No tienes créditos disponibles para esta fecha.',
  SESSION_FULL: 'Ya no hay lugares disponibles.',
  ALREADY_RESERVED: 'Ya tienes esta sesión reservada.',
  CANCEL_DEADLINE_PASSED: 'Ya pasó el plazo permitido para cancelar.',
  ZOOM_REGISTRATION_FAILED:
    'No pudimos registrarte en Zoom. Tu crédito no fue cobrado; intenta de nuevo.',
  ZOOM_NOT_CONFIGURED: 'Las reservas aún no están abiertas para esta sesión.',
  SESSION_NOT_BOOKABLE: 'Esta sesión no está abierta a reservas.'
}

const getNextZoomResetLabel = (timeZone) => {
  const resetAt = new Date()
  resetAt.setUTCDate(resetAt.getUTCDate() + 1)
  resetAt.setUTCHours(0, 0, 0, 0)
  const viewerTimezone = timeZone || DEFAULT_TIMEZONE

  try {
    const date = new Intl.DateTimeFormat('es-MX', {
      timeZone: viewerTimezone,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(resetAt)
    const time = new Intl.DateTimeFormat('es-MX', {
      timeZone: viewerTimezone,
      hour: 'numeric',
      minute: '2-digit'
    }).format(resetAt)

    return `${date} a las ${time} (${viewerTimezone}, ${getTimezoneUtcOffset(
      viewerTimezone,
      resetAt
    )})`
  } catch {
    return 'cuando Zoom restablezca el límite diario'
  }
}

const getBookingErrorMessage = (error, timeZone) => {
  if (error === 'ZOOM_REGISTRANT_DAILY_LIMIT') {
    return `Zoom alcanzó el límite diario de registros para tu correo. Tu crédito fue restaurado. Intenta de nuevo el ${getNextZoomResetLabel(
      timeZone
    )}.`
  }
  return bookingErrors[error] || null
}

const getRelativeTime = (startsAt, now) => {
  const difference = new Date(startsAt).getTime() - now
  const days = Math.ceil(difference / (24 * 60 * 60 * 1000))

  if (difference <= 0) return 'En curso'
  if (days === 1) return 'Mañana'
  if (days < 7) return `En ${days} días`

  const weeks = Math.floor(days / 7)
  return weeks === 1 ? 'En 1 semana' : `En ${weeks} semanas`
}

const getAvailability = (session) => {
  if (session.viewerBooking?.status === 'RESERVED') {
    return { label: 'Reservada', tone: 'ok' }
  }
  if (session.status === 'LIVE') return { label: 'En curso', tone: 'live' }
  if (session.spotsRemaining === 0) return { label: 'Completa', tone: 'danger' }
  if (session.spotsRemaining <= 5) {
    return {
      label: `Último${session.spotsRemaining === 1 ? '' : 's'} ${session.spotsRemaining}`,
      tone: 'warn'
    }
  }
  return { label: `${session.spotsRemaining} lugares`, tone: 'upcoming' }
}

const getAvailabilityCopy = (session) => {
  if (session.viewerBooking?.status === 'RESERVED') {
    return 'Tu lugar está confirmado.'
  }
  if (session.spotsRemaining === 0) return 'No quedan lugares disponibles.'
  return `${session.spotsRemaining} de ${session.capacity} lugares disponibles.`
}

function SessionCard({ session, now, unlimitedAccess, onUpdate, onToast }) {
  const [confirming, setConfirming] = useState(false)
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [busy, setBusy] = useState(false)
  const availability = getAvailability(session)
  const reserved = session.viewerBooking?.status === 'RESERVED'
  const full = session.spotsRemaining === 0

  const reserve = async () => {
    setBusy(true)
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liveSessionId: session.id })
    })
    const data = await res.json()
    setBusy(false)

    if (!res.ok) {
      setConfirming(false)
      onToast(
        getBookingErrorMessage(data.error, session.viewerTimezone) ||
          'No se pudo reservar.',
        'error'
      )
      return
    }

    setConfirming(false)
    onToast('Reserva confirmada. Tu lugar y enlace de Zoom están listos.')
    onUpdate(data.session)
  }

  const cancel = async () => {
    if (!session.viewerBooking?.id) return
    setBusy(true)
    const res = await fetch(`/api/bookings/${session.viewerBooking.id}/cancel`, {
      method: 'POST'
    })
    const data = await res.json()
    setBusy(false)

    if (!res.ok) {
      setConfirmingCancel(false)
      onToast(
        getBookingErrorMessage(data.error, session.viewerTimezone) ||
          'No se pudo cancelar.',
        'error'
      )
      return
    }

    setConfirmingCancel(false)
    onToast(
      unlimitedAccess ? 'Reserva cancelada.' : 'Reserva cancelada. Recuperaste 1 crédito.'
    )
    onUpdate({
      ...session,
      spotsTaken: Math.max(0, session.spotsTaken - 1),
      spotsRemaining: Math.min(session.capacity, session.spotsRemaining + 1),
      canBook: true,
      bookError: null,
      viewerBooking: { ...session.viewerBooking, ...data.booking, canCancel: false }
    })
  }

  return (
    <article className="member-reservation-card member-reservation-card--featured member-session-card">
      <div className="member-reservation-card__content">
        <div className="member-reservation-card__heading">
          <div>
            <p className="member-reservation-card__eyebrow">
              {session.status === 'LIVE' ? 'Sesión en vivo' : 'Próxima sesión'}
            </p>
            <h2 className="member-reservation-card__title">
              {formatSessionTitle(session.title, session.startsAt, session.timezone)}
            </h2>
          </div>
        </div>

        <p className="member-reservation-card__countdown">
          {getRelativeTime(session.startsAt, now)}:
        </p>

        <SessionWhen
          startsAt={session.startsAt}
          sessionTimezone={session.timezone}
          viewerTimezone={session.viewerTimezone}
        />

        <p
          className={`member-session-card__availability${
            full && !reserved ? ' member-session-card__availability--full' : ''
          }`}
        >
          {getAvailabilityCopy(session)}
        </p>

      </div>

      <span
        className={`member-reservation-status member-reservation-status--${availability.tone}`}
      >
        {availability.label}
      </span>

      <div className="member-reservation-card__actions">
        {reserved ? (
          <>
            {session.viewerBooking.zoomJoinUrl ? (
              <a
                className="member-btn"
                href={session.viewerBooking.zoomJoinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Unirme a Zoom
              </a>
            ) : null}
            {session.viewerBooking.canCancel ? (
              <button
                className="member-btn member-btn--danger"
                type="button"
                disabled={busy}
                onClick={() => setConfirmingCancel(true)}
              >
                Cancelar reserva
              </button>
            ) : null}
          </>
        ) : !full && session.canBook ? (
          <button className="member-btn" type="button" onClick={() => setConfirming(true)}>
            Reservar lugar
          </button>
        ) : null}
      </div>

      <ConfirmModal
        open={confirming && !reserved}
        title="Confirmar reserva"
        confirmLabel={
          busy ? 'Reservando…' : unlimitedAccess ? 'Confirmar reserva' : 'Confirmar (1 crédito)'
        }
        busy={busy}
        onConfirm={reserve}
        onClose={() => setConfirming(false)}
      >
        {unlimitedAccess ? (
          <p>
            Tu beca te da <strong>acceso ilimitado</strong>: no se descuenta
            ningún crédito por esta reserva.
          </p>
        ) : (
          <>
            <p>
              Se utilizará <strong>1 crédito</strong> para reservar tu lugar.
            </p>
            <p>
              Puedes cancelar hasta {session.cancelDeadlineHours} horas antes para
              recuperar el crédito.
            </p>
          </>
        )}
      </ConfirmModal>

      <ConfirmModal
        open={confirmingCancel && reserved}
        title="Cancelar reserva"
        confirmLabel={busy ? 'Cancelando…' : 'Sí, cancelar'}
        tone="danger"
        busy={busy}
        onConfirm={cancel}
        onClose={() => setConfirmingCancel(false)}
      >
        <p>
          {unlimitedAccess
            ? 'Tu lugar quedará disponible para otra persona.'
            : 'Recuperarás 1 crédito y tu lugar quedará disponible para otra persona.'}
        </p>
      </ConfirmModal>
    </article>
  )
}

export default function SesionesPage() {
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [now] = useState(() => Date.now())
  const [toast, setToast] = useState(null)
  const [unlimitedAccess, setUnlimitedAccess] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
  }

  useEffect(() => {
    fetch('/api/sessions')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error')
        setSessions(data.sessions || [])
        setUnlimitedAccess(Boolean(data.viewerUnlimitedAccess))
      })
      .catch(() => setError('No se pudieron cargar las sesiones.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="member-page">
      <Toast
        key={toast?.id}
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
      <div className="member-page__header">
        <h1 className="member-page__title">Explorar sesiones</h1>
        <p className="member-page__subtitle">
          {unlimitedAccess
            ? 'Encuentra tu próxima sesión y reserva tu lugar. Tu beca te da acceso ilimitado.'
            : 'Encuentra tu próxima sesión y reserva tu lugar. Cada reserva usa 1 crédito.'}
        </p>
      </div>

      {loading ? <p className="member-muted">Cargando próximas sesiones…</p> : null}
      {error ? <p className="member-error">{error}</p> : null}

      {!loading && !error && sessions.length ? (
        <section className="member-reservations-section" aria-labelledby="available-title">
          <div className="member-reservations-section__heading">
            <div>
              <h2 id="available-title" className="member-reservations-section__title">
                Próximamente
              </h2>
              <p className="member-reservations-section__description">
                Horarios oficiales de cada sesión y equivalencia en tu zona horaria.
              </p>
            </div>
            {sessions.length > 1 ? (
              <span className="member-reservations-section__count">{sessions.length}</span>
            ) : null}
          </div>

          <div className="member-reservations-list">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                now={now}
                unlimitedAccess={unlimitedAccess}
                onUpdate={(updated) =>
                  setSessions((current) =>
                    current.map((item) => (item.id === updated.id ? updated : item))
                  )
                }
                onToast={showToast}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!loading && !error && !sessions.length ? (
        <section className="member-reservations-empty">
          <h2>No hay sesiones próximas</h2>
          <p>Publicaremos aquí la siguiente fecha cuando esté disponible.</p>
          <Link className="member-btn member-btn--ghost" href="/dashboard/reservas">
            Revisar mis reservas
          </Link>
        </section>
      ) : null}
    </div>
  )
}
