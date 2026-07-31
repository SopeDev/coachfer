'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_TIMEZONE, formatDateTime } from '../../../lib/timezone'

export default function CreditosPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/me/credits')
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Error')
        setData(json)
      })
      .catch(() => setError('No se pudieron cargar tus créditos.'))
  }, [])

  const tz = data?.viewerTimezone || DEFAULT_TIMEZONE
  const formatWhen = (value) =>
    formatDateTime(value, { timeZone: tz, dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div className="member-page">
      <div className="member-page__header">
        <h1 className="member-page__title">Mis créditos</h1>
        <p className="member-page__subtitle">
          Cada reserva de sesión en vivo usa 1 crédito del paquete que vence
          primero. Fechas en tu zona horaria.
        </p>
      </div>

      {error ? <p className="member-error">{error}</p> : null}

      {data ? (
        <>
          <div className="member-stats">
            <div className="member-stat">
              <p className="member-stat__label">Disponibles ahora</p>
              <p className="member-stat__value">{data.availableCredits}</p>
            </div>
          </div>

          <div className="member-table-wrap" style={{ marginTop: '1.25rem' }}>
            <table className="member-table">
              <thead>
                <tr>
                  <th>Restantes</th>
                  <th>Total</th>
                  <th>Otorgado</th>
                  <th>Expira</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.grants.map((grant) => (
                  <tr key={grant.id}>
                    <td>{grant.creditsRemaining}</td>
                    <td>{grant.creditsGranted}</td>
                    <td>{formatWhen(grant.createdAt || grant.startsAt)}</td>
                    <td>{formatWhen(grant.expiresAt)}</td>
                    <td>
                      <span className="member-badge">{grant.status}</span>
                    </td>
                  </tr>
                ))}
                {!data.grants.length ? (
                  <tr>
                    <td colSpan={5} className="member-muted">
                      Aún no tienes créditos. Adquiere un paquete del Entrenamiento.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        !error && <p className="member-muted">Cargando…</p>
      )}
    </div>
  )
}
