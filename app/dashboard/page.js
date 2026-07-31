'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SessionWhen from '../../components/SessionWhen/SessionWhen'

export default function DashboardHomePage() {
  const [credits, setCredits] = useState(null)
  const [nextBooking, setNextBooking] = useState(null)
  const [viewerTimezone, setViewerTimezone] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/me/credits').then((r) => r.json()),
      fetch('/api/me/bookings').then((r) => r.json())
    ])
      .then(([creditsData, bookingsData]) => {
        if (creditsData.error || bookingsData.error) {
          setError('No se pudo cargar tu espacio.')
          return
        }
        setCredits(creditsData)
        setViewerTimezone(
          bookingsData.viewerTimezone || creditsData.viewerTimezone
        )
        const upcoming = (bookingsData.bookings || []).find(
          (b) =>
            b.status === 'RESERVED' &&
            new Date(b.liveSession.startsAt) > new Date()
        )
        setNextBooking(upcoming || null)
      })
      .catch(() => setError('No se pudo cargar tu espacio.'))
  }, [])

  return (
    <div className="member-page">
      <div className="member-page__header">
        <h1 className="member-page__title">Mi espacio</h1>
        <p className="member-page__subtitle">
          Reserva sesiones del Entrenamiento de la Consciencia con tus créditos.
        </p>
      </div>

      {error ? <p className="member-error">{error}</p> : null}

      <div className="member-stats">
        <div className="member-stat">
          <p className="member-stat__label">Créditos disponibles</p>
          <p className="member-stat__value">
            {credits ? credits.availableCredits : '…'}
          </p>
        </div>
        <div className="member-stat">
          <p className="member-stat__label">Paquetes activos</p>
          <p className="member-stat__value">
            {credits ? credits.activeGrantCount : '…'}
          </p>
        </div>
      </div>

      <div className="member-actions">
        <Link className="member-btn" href="/dashboard/sesiones">
          Ver sesiones
        </Link>
        <Link className="member-btn member-btn--ghost" href="/dashboard/creditos">
          Detalle de créditos
        </Link>
      </div>

      <section className="member-card" style={{ marginTop: '1.5rem' }}>
        <h2 className="member-card__title">Próxima reserva</h2>
        {nextBooking ? (
          <>
            <div className="member-card__meta">
              <strong>{nextBooking.liveSession.title}</strong>
              <SessionWhen
                startsAt={nextBooking.liveSession.startsAt}
                sessionTimezone={nextBooking.liveSession.timezone}
                viewerTimezone={
                  nextBooking.viewerTimezone || viewerTimezone
                }
              />
            </div>
            <div className="member-actions">
              <Link
                className="member-btn"
                href={`/dashboard/sesiones/${nextBooking.liveSession.id}`}
              >
                Ver detalles / Zoom
              </Link>
            </div>
          </>
        ) : (
          <p className="member-muted">
            Aún no tienes una sesión reservada.{' '}
            <Link href="/dashboard/sesiones">Explora el calendario</Link>.
          </p>
        )}
      </section>
    </div>
  )
}
