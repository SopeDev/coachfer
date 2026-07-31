'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import SessionWhen from '../../../../components/SessionWhen/SessionWhen'

const errorCopy = {
  INSUFFICIENT_CREDITS: 'No tienes créditos disponibles para esta fecha.',
  SESSION_FULL: 'Ya no hay lugares disponibles.',
  ALREADY_RESERVED: 'Ya tienes esta sesión reservada.',
  CANCEL_DEADLINE_PASSED: 'Ya pasó el plazo de cancelación (2 horas antes).',
  ZOOM_REGISTRATION_FAILED:
    'No pudimos registrarte en Zoom. Tu crédito no fue cobrado; intenta de nuevo.',
  ZOOM_NOT_CONFIGURED:
    'Las reservas aún no están abiertas para esta sesión. Intenta más tarde.',
  SESSION_NOT_BOOKABLE: 'Esta sesión no está abierta a reservas.'
}

export default function SesionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch(`/api/sessions/${params.id}`)
    const data = await res.json()
    if (!res.ok) {
      setError('No se pudo cargar la sesión.')
      return
    }
    setSession(data.session)
  }, [params.id])

  useEffect(() => {
    load()
  }, [load])

  const reserve = async () => {
    setBusy(true)
    setMessage('')
    setError('')
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liveSessionId: params.id })
    })
    const data = await res.json()
    setBusy(false)
    setConfirming(false)

    if (!res.ok) {
      setError(errorCopy[data.error] || data.error || 'No se pudo reservar.')
      return
    }

    setMessage('¡Reserva confirmada! Revisa tu correo y el enlace de Zoom abajo.')
    setSession(data.session)
    router.refresh()
  }

  const cancel = async () => {
    if (!session?.viewerBooking?.id) return
    setBusy(true)
    setError('')
    const res = await fetch(`/api/bookings/${session.viewerBooking.id}/cancel`, {
      method: 'POST'
    })
    const data = await res.json()
    setBusy(false)

    if (!res.ok) {
      setError(errorCopy[data.error] || data.error || 'No se pudo cancelar.')
      return
    }

    setMessage('Reserva cancelada. Tu crédito fue restaurado.')
    await load()
  }

  if (!session && !error) {
    return <p className="member-muted">Cargando…</p>
  }

  if (error && !session) {
    return (
      <div className="member-page">
        <p className="member-error">{error}</p>
        <Link href="/dashboard/sesiones">← Volver</Link>
      </div>
    )
  }

  const reserved = session.viewerBooking?.status === 'RESERVED'

  return (
    <div className="member-page">
      <p className="member-muted">
        <Link href="/dashboard/sesiones">← Sesiones</Link>
      </p>
      <div className="member-page__header">
        <h1 className="member-page__title">{session.title}</h1>
        <div className="member-page__subtitle">
          <SessionWhen
            startsAt={session.startsAt}
            sessionTimezone={session.timezone}
            viewerTimezone={session.viewerTimezone}
          />
        </div>
        <div
          className={`member-capacity ${
            session.spotsRemaining === 0 ? 'member-capacity--full' : ''
          }`}
          aria-label={`${session.spotsRemaining} de ${session.capacity} lugares disponibles`}
        >
          <div className="member-capacity__text">
            <span className="member-capacity__number">
              {session.spotsRemaining}
            </span>
            <span className="member-capacity__sep">/</span>
            <span className="member-capacity__total">{session.capacity}</span>
            <span className="member-capacity__label">lugares libres</span>
          </div>
          <div className="member-capacity__track" aria-hidden="true">
            <div
              className="member-capacity__fill"
              style={{
                width: `${Math.min(
                  100,
                  (session.spotsTaken / Math.max(session.capacity, 1)) * 100
                )}%`
              }}
            />
          </div>
        </div>
      </div>

      {session.description ? (
        <section className="member-card">
          <p className="member-card__meta">{session.description}</p>
        </section>
      ) : null}

      {message ? <p className="member-muted">{message}</p> : null}
      {error ? <p className="member-error">{error}</p> : null}

      {reserved ? (
        <section className="member-card">
          <h2 className="member-card__title">Tu acceso a Zoom</h2>
          <p className="member-card__meta">
            Este enlace es personal (registrado a tu email). No lo compartas: está
            vinculado a tu lugar.
          </p>
          {session.viewerBooking.zoomJoinUrl ? (
            <div className="member-actions">
              <a
                className="member-btn"
                href={session.viewerBooking.zoomJoinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Unirme a Zoom
              </a>
            </div>
          ) : (
            <p className="member-muted">Preparando tu enlace… recarga en un momento.</p>
          )}

          {session.viewerBooking.canCancel ? (
            <div className="member-actions">
              <button
                className="member-btn member-btn--danger"
                type="button"
                disabled={busy}
                onClick={cancel}
              >
                Cancelar reserva (recupera 1 crédito)
              </button>
            </div>
          ) : (
            <p className="member-muted" style={{ marginTop: '1rem' }}>
              Ya no puedes cancelar (menos de {session.cancelDeadlineHours} horas
              antes del inicio). El crédito permanece usado.
            </p>
          )}
        </section>
      ) : (
        <section className="member-card">
          <div className="member-warning">
            Al confirmar se usará <strong>1 crédito</strong>. El crédito se consume
            al reservar, asistas o no a la sesión. Puedes cancelar hasta{' '}
            {session.cancelDeadlineHours} horas antes para recuperar el crédito y
            liberar tu lugar.
          </div>

          {!confirming ? (
            <button
              className="member-btn"
              type="button"
              disabled={busy || !session.canBook}
              onClick={() => setConfirming(true)}
            >
              {session.canBook ? 'Reservar lugar' : 'No disponible'}
            </button>
          ) : (
            <div className="member-actions">
              <button
                className="member-btn"
                type="button"
                disabled={busy}
                onClick={reserve}
              >
                {busy ? 'Reservando…' : 'Confirmar reserva (1 crédito)'}
              </button>
              <button
                className="member-btn member-btn--ghost"
                type="button"
                disabled={busy}
                onClick={() => setConfirming(false)}
              >
                Volver
              </button>
            </div>
          )}

          {!session.canBook && session.bookError ? (
            <p className="member-muted" style={{ marginTop: '0.75rem' }}>
              {errorCopy[session.bookError] || session.bookError}
            </p>
          ) : null}
        </section>
      )}
    </div>
  )
}
