'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SessionWhen from '../../../components/SessionWhen/SessionWhen'

export default function ReservasPage() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/me/bookings')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error')
        setBookings(data.bookings || [])
      })
      .catch(() => setError('No se pudieron cargar tus reservas.'))
  }, [])

  return (
    <div className="member-page">
      <div className="member-page__header">
        <h1 className="member-page__title">Mis reservas</h1>
        <p className="member-page__subtitle">Historial de sesiones que has reservado.</p>
      </div>

      {error ? <p className="member-error">{error}</p> : null}

      <div className="member-table-wrap">
        <table className="member-table">
          <thead>
            <tr>
              <th>Sesión</th>
              <th>Cuándo</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.liveSession.title}</td>
                <td>
                  <SessionWhen
                    startsAt={booking.liveSession.startsAt}
                    sessionTimezone={booking.liveSession.timezone}
                    viewerTimezone={booking.viewerTimezone}
                  />
                </td>
                <td>
                  <span
                    className={`member-badge${
                      booking.status === 'RESERVED'
                        ? ' member-badge--ok'
                        : booking.status === 'CANCELLED'
                          ? ' member-badge--warn'
                          : ''
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td>
                  <Link href={`/dashboard/sesiones/${booking.liveSession.id}`}>
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {!bookings.length ? (
              <tr>
                <td colSpan={4} className="member-muted">
                  Sin reservas todavía.{' '}
                  <Link href="/dashboard/sesiones">Ver sesiones</Link>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
