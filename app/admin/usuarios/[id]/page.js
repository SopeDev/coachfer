'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

export default function AdminUserDetailPage() {
  const params = useParams()
  const id = params.id

  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [creditAmount, setCreditAmount] = useState('4')
  const [creditReason, setCreditReason] = useState('')
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    setError('')
    const res = await fetch(`/api/admin/users/${id}`)
    const data = await res.json()
    if (!res.ok) {
      setError('No se pudo cargar el usuario.')
      return
    }
    setUser(data.user)
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const saveUser = async (patch) => {
    setSaving(true)
    setMessage('')
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setMessage(data.error || 'Error al guardar')
      return
    }
    setMessage('Guardado.')
    await load()
  }

  const adjustCredits = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    const res = await fetch(`/api/admin/users/${id}/credits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Number(creditAmount),
        reason: creditReason
      })
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setMessage(data.error || 'Error al ajustar créditos')
      return
    }
    setCreditReason('')
    setMessage('Créditos actualizados.')
    await load()
  }

  if (error) {
    return (
      <div className="admin-page">
        <p className="admin-error">{error}</p>
        <Link href="/admin/usuarios">← Volver</Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="admin-page">
        <p className="admin-muted">Cargando…</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <p className="admin-muted">
            <Link href="/admin/usuarios">← Usuarios</Link>
          </p>
          <h1 className="admin-page__title">{user.name || 'Sin nombre'}</h1>
          <p className="admin-page__subtitle">{user.email}</p>
        </div>
        <div>
          <span className="admin-badge">{user.role}</span>{' '}
          {user.disabledAt ? (
            <span className="admin-badge admin-badge--danger">Deshabilitado</span>
          ) : (
            <span className="admin-badge admin-badge--ok">Activo</span>
          )}
        </div>
      </div>

      {message ? <p className="admin-muted">{message}</p> : null}

      <div className="admin-grid-2">
        <section className="admin-card">
          <h2 className="admin-card__title">Perfil</h2>
          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              saveUser({
                name: form.get('name'),
                role: form.get('role'),
                timezone: form.get('timezone'),
                adminNotes: form.get('adminNotes')
              })
            }}
          >
            <label>
              Nombre
              <input className="admin-input" name="name" defaultValue={user.name || ''} />
            </label>
            <label>
              Rol
              <select className="admin-select" name="role" defaultValue={user.role}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="FACILITATOR">FACILITATOR</option>
              </select>
            </label>
            <label>
              Zona horaria
              <input
                className="admin-input"
                name="timezone"
                defaultValue={user.timezone || 'America/Mexico_City'}
              />
            </label>
            <label>
              Notas internas
              <textarea
                className="admin-textarea"
                name="adminNotes"
                defaultValue={user.adminNotes || ''}
              />
            </label>
            <button className="admin-btn" type="submit" disabled={saving}>
              Guardar perfil
            </button>
          </form>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            {user.disabledAt ? (
              <button
                className="admin-btn admin-btn--ghost"
                type="button"
                disabled={saving}
                onClick={() => saveUser({ disabled: false })}
              >
                Rehabilitar cuenta
              </button>
            ) : (
              <button
                className="admin-btn admin-btn--danger"
                type="button"
                disabled={saving}
                onClick={() => saveUser({ disabled: true })}
              >
                Deshabilitar cuenta
              </button>
            )}
          </div>
        </section>

        <section className="admin-card">
          <h2 className="admin-card__title">
            Créditos disponibles: {user.availableCredits}
          </h2>
          <form className="admin-form" onSubmit={adjustCredits}>
            <label>
              Cantidad (+ agregar / − quitar)
              <input
                className="admin-input"
                type="number"
                step="1"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                required
              />
            </label>
            <label>
              Motivo (auditoría)
              <input
                className="admin-input"
                value={creditReason}
                onChange={(e) => setCreditReason(e.target.value)}
                placeholder="Ej. Cortesía, corrección, compensación"
                required
                minLength={3}
              />
            </label>
            <button className="admin-btn" type="submit" disabled={saving}>
              Ajustar créditos
            </button>
          </form>

          <div className="admin-table-wrap" style={{ marginTop: '1rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Paquete</th>
                  <th>Restantes</th>
                  <th>Expira</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {(user.creditGrants || []).map((grant) => (
                  <tr key={grant.id}>
                    <td className="admin-muted">{grant.id.slice(0, 8)}…</td>
                    <td>
                      {grant.creditsRemaining}/{grant.creditsGranted}
                    </td>
                    <td>{formatDate(grant.expiresAt)}</td>
                    <td>
                      <span className="admin-badge">{grant.status}</span>
                    </td>
                  </tr>
                ))}
                {!user.creditGrants?.length ? (
                  <tr>
                    <td colSpan={4} className="admin-muted">
                      Sin paquetes de créditos aún
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="admin-card">
        <h2 className="admin-card__title">Historial de créditos</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {(user.creditTransactions || []).map((tx) => (
                <tr key={tx.id}>
                  <td>{formatDate(tx.createdAt)}</td>
                  <td>{tx.type}</td>
                  <td>{tx.amount > 0 ? `+${tx.amount}` : tx.amount}</td>
                  <td>{tx.reason || '—'}</td>
                </tr>
              ))}
              {!user.creditTransactions?.length ? (
                <tr>
                  <td colSpan={4} className="admin-muted">
                    Sin movimientos
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">Compras recientes</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Paquete</th>
                <th>Estado</th>
                <th>Monto</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {(user.purchases || []).map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.packageName || purchase.package?.name}</td>
                  <td>
                    <span className="admin-badge">{purchase.status}</span>
                  </td>
                  <td>
                    {purchase.amountPaid
                      ? `${purchase.amountPaid} ${purchase.currency?.toUpperCase()}`
                      : '—'}
                  </td>
                  <td>{formatDate(purchase.purchasedAt || purchase.createdAt)}</td>
                </tr>
              ))}
              {!user.purchases?.length ? (
                <tr>
                  <td colSpan={4} className="admin-muted">
                    Sin compras (Stripe pendiente)
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
