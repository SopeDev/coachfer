'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import ConfirmModal from '../../../../components/ConfirmModal/ConfirmModal'
import {
  CREDIT_GRANT_STATUS_LABELS,
  CREDIT_TRANSACTION_TYPE_LABELS,
  PURCHASE_STATUS_LABELS,
  ROLE_LABELS,
  getGrantDisplayStatus,
  labelFor
} from '../../../../lib/labels'
import {
  DEFAULT_TIMEZONE,
  TIMEZONE_OPTIONS,
  getTimezoneLabel,
  getTimezoneUtcOffset
} from '../../../../lib/timezone'

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

const getDefaultCreditExpiration = () => {
  const date = new Date()
  date.setDate(date.getDate() + 90)
  date.setHours(23, 59, 0, 0)

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

const creditErrors = {
  INVALID_AMOUNT: 'La cantidad debe ser un número entero distinto de cero.',
  INVALID_EXPIRATION: 'La expiración debe ser una fecha y hora futuras.',
  INSUFFICIENT_CREDITS: 'El usuario no tiene suficientes créditos disponibles.',
  REASON_REQUIRED: 'Indica el motivo del ajuste.'
}

const packageErrors = {
  PACKAGE_NOT_FOUND: 'Selecciona un paquete válido.',
  INVALID_CREDITS_USED: 'Los créditos usados no pueden ser más que los del paquete.',
  INVALID_INPUT: 'Revisa los datos del paquete.'
}

/** datetime-local default: right now, in the browser's local time */
const getDefaultAssignedAt = () => {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

/** ISO string → datetime-local input value, in the browser's local time. */
const toDatetimeLocalValue = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [creditAmount, setCreditAmount] = useState('4')
  const [creditExpiresAt, setCreditExpiresAt] = useState(getDefaultCreditExpiration)
  const [creditReason, setCreditReason] = useState('')
  const [message, setMessage] = useState('')

  const [packages, setPackages] = useState([])
  const [assignPackageId, setAssignPackageId] = useState('')
  const [assignCreditsUsed, setAssignCreditsUsed] = useState('0')
  const [assignAssignedAt, setAssignAssignedAt] = useState(getDefaultAssignedAt)
  const [assigningPackage, setAssigningPackage] = useState(false)
  const [packageMessage, setPackageMessage] = useState('')
  const [deletingGrantId, setDeletingGrantId] = useState('')
  const [removingGrant, setRemovingGrant] = useState(false)

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

  useEffect(() => {
    // Credits are only meaningful for Mastermind packages — Coaching
    // packages aren't credit-based, so leave them out of this dropdown.
    fetch('/api/admin/packages?type=MASTERMIND')
      .then((res) => res.json())
      .then((data) => {
        setPackages(data.packages || [])
        if (data.packages?.length) setAssignPackageId((id) => id || data.packages[0].id)
      })
      .catch(() => {})
  }, [])

  const profileErrors = {
    USERNAME_IN_USE: 'Ese usuario (email o teléfono) ya está en uso.',
    INVALID_INPUT: 'Revisa los datos del perfil.'
  }

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
      setMessage(profileErrors[data.error] || 'Error al guardar')
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
        reason: creditReason,
        expiresAt:
          Number(creditAmount) > 0
            ? new Date(creditExpiresAt).toISOString()
            : undefined
      })
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setMessage(creditErrors[data.error] || 'Error al ajustar créditos')
      return
    }
    setCreditReason('')
    setMessage('Créditos actualizados.')
    await load()
  }

  const assignPackage = async (event) => {
    event.preventDefault()
    setAssigningPackage(true)
    setPackageMessage('')

    const res = await fetch(`/api/admin/users/${id}/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageId: assignPackageId,
        creditsUsed: Number(assignCreditsUsed) || 0,
        assignedAt: new Date(assignAssignedAt).toISOString()
      })
    })
    const data = await res.json()
    setAssigningPackage(false)

    if (!res.ok) {
      setPackageMessage(packageErrors[data.error] || 'No se pudo asignar el paquete.')
      return
    }

    setAssignCreditsUsed('0')
    setAssignAssignedAt(getDefaultAssignedAt())
    setPackageMessage('Paquete asignado.')
    await load()
  }

  const grantErrors = {
    GRANT_IN_USE:
      'No se puede eliminar: ya se usó en una reserva. Cancela esa reserva primero (así se libera el crédito correctamente).',
    GRANT_NOT_FOUND: 'Ese registro ya no existe.'
  }

  const removeGrant = async () => {
    if (!deletingGrantId) return
    setRemovingGrant(true)
    setPackageMessage('')
    const res = await fetch(`/api/admin/users/${id}/packages/${deletingGrantId}`, {
      method: 'DELETE'
    })
    const data = await res.json().catch(() => ({}))
    setRemovingGrant(false)
    setDeletingGrantId('')

    if (!res.ok) {
      setPackageMessage(grantErrors[data.error] || 'No se pudo eliminar.')
      return
    }

    setPackageMessage('Paquete eliminado.')
    await load()
  }

  const deleteUser = async () => {
    setDeleting(true)
    setMessage('')
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    setDeleting(false)

    if (!res.ok) {
      setConfirmingDelete(false)
      const errors = {
        CANNOT_DELETE_SELF: 'No puedes eliminar tu propia cuenta.',
        NOT_FOUND: 'Usuario no encontrado.',
        FORBIDDEN: 'Sin permiso.',
        UNAUTHORIZED: 'Sesión expirada.'
      }
      setMessage(errors[data.error] || 'Error al eliminar')
      return
    }

    setConfirmingDelete(false)
    router.push('/admin/usuarios')
    router.refresh()
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

  const scholarshipActive =
    user.hasUnlimitedAccess &&
    (!user.unlimitedAccessUntil || new Date(user.unlimitedAccessUntil) > new Date())

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
          <span className="admin-badge">{labelFor(ROLE_LABELS, user.role)}</span>{' '}
          {user.disabledAt ? (
            <span className="admin-badge admin-badge--danger">Deshabilitado</span>
          ) : (
            <span className="admin-badge admin-badge--ok">Activo</span>
          )}{' '}
          {scholarshipActive ? (
            <span className="admin-badge admin-badge--ok">Beca — ilimitado</span>
          ) : null}
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
                username: form.get('username'),
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
              Usuario (email o teléfono)
              <input
                className="admin-input"
                name="username"
                defaultValue={user.email || ''}
                required
                minLength={6}
              />
              <span className="admin-muted">
                Es lo que la persona usa para iniciar sesión.
              </span>
            </label>
            <label>
              Rol
              <select className="admin-select" name="role" defaultValue={user.role}>
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
                <option value="FACILITATOR">Facilitador</option>
              </select>
            </label>
            <label>
              Zona horaria
              <select
                className="admin-select"
                name="timezone"
                defaultValue={user.timezone || DEFAULT_TIMEZONE}
              >
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} ({getTimezoneUtcOffset(tz.value)})
                  </option>
                ))}
                {user.timezone &&
                !TIMEZONE_OPTIONS.some((tz) => tz.value === user.timezone) ? (
                  <option value={user.timezone}>
                    {getTimezoneLabel(user.timezone)} ({getTimezoneUtcOffset(user.timezone)})
                  </option>
                ) : null}
              </select>
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

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {user.disabledAt ? (
              <button
                className="admin-btn admin-btn--ghost"
                type="button"
                disabled={saving || deleting}
                onClick={() => saveUser({ disabled: false })}
              >
                Rehabilitar cuenta
              </button>
            ) : (
              <button
                className="admin-btn admin-btn--danger"
                type="button"
                disabled={saving || deleting}
                onClick={() => saveUser({ disabled: true })}
              >
                Deshabilitar cuenta
              </button>
            )}
            <button
              className="admin-btn admin-btn--danger"
              type="button"
              disabled={saving || deleting}
              onClick={() => setConfirmingDelete(true)}
            >
              {deleting ? 'Eliminando…' : 'Eliminar usuario'}
            </button>
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
            {Number(creditAmount) > 0 ? (
              <label>
                Fecha y hora de expiración
                <input
                  className="admin-input"
                  type="datetime-local"
                  value={creditExpiresAt}
                  onChange={(e) => setCreditExpiresAt(e.target.value)}
                  required
                />
                <span className="admin-muted">
                  Se interpreta según la zona horaria de tu navegador.
                </span>
              </label>
            ) : null}
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(user.creditGrants || []).map((grant) => (
                  <tr key={grant.id}>
                    <td>
                      {grant.purchase?.packageName ||
                        grant.purchase?.package?.name ||
                        'Ajuste manual'}
                    </td>
                    <td>
                      {grant.creditsRemaining}/{grant.creditsGranted}
                    </td>
                    <td>{formatDate(grant.expiresAt)}</td>
                    <td>
                      <span className="admin-badge">{labelFor(CREDIT_GRANT_STATUS_LABELS, getGrantDisplayStatus(grant))}</span>
                    </td>
                    <td>
                      <button
                        className="admin-btn admin-btn--ghost"
                        type="button"
                        onClick={() => setDeletingGrantId(grant.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {!user.creditGrants?.length ? (
                  <tr>
                    <td colSpan={5} className="admin-muted">
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
        <h2 className="admin-card__title">Beca (acceso ilimitado)</h2>
        <p className="admin-muted" style={{ marginBottom: '1rem' }}>
          Bypasa el sistema de créditos por completo: la persona puede
          reservar cualquier sesión sin que se descuente nada. Úsalo para
          estudiantes becados.
        </p>
        <form
          className="admin-form"
          onSubmit={(e) => {
            e.preventDefault()
            const form = new FormData(e.currentTarget)
            const until = form.get('unlimitedAccessUntil')
            saveUser({
              hasUnlimitedAccess: form.get('hasUnlimitedAccess') === 'on',
              unlimitedAccessUntil: until ? new Date(until).toISOString() : null,
              unlimitedAccessReason: form.get('unlimitedAccessReason') || null
            })
          }}
        >
          <label style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name="hasUnlimitedAccess"
              defaultChecked={user.hasUnlimitedAccess}
            />
            Acceso ilimitado activo
          </label>
          <label>
            Vigente hasta (opcional)
            <input
              className="admin-input"
              type="datetime-local"
              name="unlimitedAccessUntil"
              defaultValue={toDatetimeLocalValue(user.unlimitedAccessUntil)}
            />
            <span className="admin-muted">
              Déjalo vacío para que no expire nunca.
            </span>
          </label>
          <label>
            Motivo / convenio (opcional)
            <input
              className="admin-input"
              name="unlimitedAccessReason"
              defaultValue={user.unlimitedAccessReason || ''}
              placeholder="Ej. Beca completa, convenio Universidad X"
            />
          </label>
          <button className="admin-btn" type="submit" disabled={saving}>
            Guardar beca
          </button>
        </form>
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">Asignar paquete</h2>
        <p className="admin-muted" style={{ marginBottom: '1rem' }}>
          A diferencia del ajuste manual de arriba, esto crea una compra real
          ligada a un paquete: los créditos otorgados salen del paquete
          elegido, y puedes indicar cuántos ya se usaron y desde qué fecha
          corre la vigencia.
        </p>
        {packageMessage ? <p className="admin-muted">{packageMessage}</p> : null}
        <form className="admin-form" onSubmit={assignPackage}>
          <label>
            Paquete
            <select
              className="admin-select"
              value={assignPackageId}
              onChange={(e) => setAssignPackageId(e.target.value)}
              required
            >
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} ({pkg.creditQuantity} créditos
                  {pkg.validityDays ? `, ${pkg.validityDays} días` : ''})
                </option>
              ))}
            </select>
          </label>
          <label>
            Créditos ya usados
            <input
              className="admin-input"
              type="number"
              min="0"
              step="1"
              value={assignCreditsUsed}
              onChange={(e) => setAssignCreditsUsed(e.target.value)}
            />
            <span className="admin-muted">
              Los créditos pendientes se calculan como (total del paquete − usados).
            </span>
          </label>
          <label>
            Fecha de asignación
            <input
              className="admin-input"
              type="datetime-local"
              value={assignAssignedAt}
              onChange={(e) => setAssignAssignedAt(e.target.value)}
              required
            />
            <span className="admin-muted">
              La vigencia del paquete corre desde esta fecha. Se interpreta
              según la zona horaria de tu navegador.
            </span>
          </label>
          <button className="admin-btn" type="submit" disabled={assigningPackage || !packages.length}>
            {assigningPackage ? 'Asignando…' : 'Asignar paquete'}
          </button>
        </form>
      </section>

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
                  <td>{labelFor(CREDIT_TRANSACTION_TYPE_LABELS, tx.type)}</td>
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
                    <span className="admin-badge">{labelFor(PURCHASE_STATUS_LABELS, purchase.status)}</span>
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

      <ConfirmModal
        open={confirmingDelete}
        title="Eliminar usuario"
        confirmLabel={deleting ? 'Eliminando…' : 'Eliminar permanentemente'}
        tone="danger"
        busy={deleting}
        onConfirm={deleteUser}
        onClose={() => setConfirmingDelete(false)}
      >
        <p>
          Se eliminará permanentemente a <strong>{user.email}</strong> junto con sus
          compras, créditos, reservas y datos de autenticación.
        </p>
        <p>Esta acción no se puede deshacer.</p>
      </ConfirmModal>

      <ConfirmModal
        open={Boolean(deletingGrantId)}
        title="Eliminar paquete asignado"
        confirmLabel={removingGrant ? 'Eliminando…' : 'Eliminar'}
        tone="danger"
        busy={removingGrant}
        onConfirm={removeGrant}
        onClose={() => setDeletingGrantId('')}
      >
        <p>
          Se eliminará este paquete/ajuste y su compra asociada (si la tiene),
          junto con su historial de movimientos.
        </p>
        <p>
          Solo se puede eliminar si nadie ha reservado una sesión con estos
          créditos todavía. Esta acción no se puede deshacer.
        </p>
      </ConfirmModal>
    </div>
  )
}
