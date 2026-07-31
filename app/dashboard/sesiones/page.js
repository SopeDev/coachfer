'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SessionWhen from '../../../components/SessionWhen/SessionWhen'

export default function SesionesPage() {
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sessions')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error')
        setSessions(data.sessions || [])
      })
      .catch(() => setError('No se pudieron cargar las sesiones.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="member-page">
      <div className="member-page__header">
        <h1 className="member-page__title">Sesiones en vivo</h1>
        <p className="member-page__subtitle">
          Reserva tu lugar. Cada reserva usa 1 crédito. Horario oficial CDMX.
        </p>
      </div>

      {loading ? <p className="member-muted">Cargando…</p> : null}
      {error ? <p className="member-error">{error}</p> : null}

      <div className="member-list">
        {sessions.map((session) => (
          <article key={session.id} className="member-card">
            <div className="member-card__top">
              <h2 className="member-card__title">{session.title}</h2>
              <span
                className={`member-capacity-chip ${
                  session.spotsRemaining === 0
                    ? 'member-capacity-chip--full'
                    : ''
                }`}
              >
                {session.spotsRemaining}/{session.capacity} libres
              </span>
            </div>
            <div className="member-card__meta">
              <SessionWhen
                startsAt={session.startsAt}
                sessionTimezone={session.timezone}
                viewerTimezone={session.viewerTimezone}
              />
              {session.viewerBooking?.status === 'RESERVED' ? (
                <p style={{ marginTop: '0.35rem' }}>
                  <span className="member-badge member-badge--ok">Reservada</span>
                </p>
              ) : null}
            </div>
            <div className="member-actions">
              <Link className="member-btn" href={`/dashboard/sesiones/${session.id}`}>
                Ver y reservar
              </Link>
            </div>
          </article>
        ))}

        {!loading && !sessions.length ? (
          <p className="member-muted">No hay sesiones próximas publicadas.</p>
        ) : null}
      </div>
    </div>
  )
}
