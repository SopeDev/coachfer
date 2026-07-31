'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminHomePage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error')
        setStats(data.stats)
      })
      .catch(() => setError('No se pudieron cargar las métricas.'))
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Resumen</h1>
          <p className="admin-page__subtitle">
            Vista general de usuarios, créditos y actividad.
          </p>
        </div>
        <Link className="admin-btn" href="/admin/usuarios">
          Ver usuarios
        </Link>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      {!stats && !error ? <p className="admin-muted">Cargando…</p> : null}

      {stats ? (
        <div className="admin-stats">
          <div className="admin-stat">
            <p className="admin-stat__label">Usuarios</p>
            <p className="admin-stat__value">{stats.usersTotal}</p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat__label">Nuevos (7 días)</p>
            <p className="admin-stat__value">{stats.usersNewWeek}</p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat__label">Créditos disponibles</p>
            <p className="admin-stat__value">{stats.creditsAvailable}</p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat__label">Paquetes de créditos activos</p>
            <p className="admin-stat__value">{stats.creditGrantsActive}</p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat__label">Compras pagadas</p>
            <p className="admin-stat__value">{stats.purchasesPaid}</p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat__label">Sesiones próximas</p>
            <p className="admin-stat__value">{stats.sessionsUpcoming}</p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat__label">Paquetes activos</p>
            <p className="admin-stat__value">{stats.packagesActive}</p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat__label">Cuentas deshabilitadas</p>
            <p className="admin-stat__value">{stats.usersDisabled}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
