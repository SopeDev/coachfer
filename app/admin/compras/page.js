'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { PRODUCT_TYPE_LABELS, PURCHASE_STATUS_LABELS, labelFor } from '../../../lib/labels'

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

export default function AdminPurchasesPage() {
  const [status, setStatus] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    const res = await fetch(`/api/admin/purchases?${params}`)
    const json = await res.json()
    if (!res.ok) {
      setError('No se pudieron cargar las compras.')
      return
    }
    setData(json)
  }, [status])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Compras</h1>
          <p className="admin-page__subtitle">
            Historial de checkout. Se llenará cuando conectemos Stripe.
          </p>
        </div>
      </div>

      <div className="admin-toolbar">
        <select
          className="admin-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="PAID">Pagada</option>
          <option value="FAILED">Fallida</option>
          <option value="REFUNDED">Reembolsada</option>
        </select>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Paquete</th>
              <th>Estado</th>
              <th>Monto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {(data?.purchases || []).map((purchase) => (
              <tr key={purchase.id}>
                <td>
                  <Link href={`/admin/usuarios/${purchase.user.id}`}>
                    {purchase.user.name || purchase.user.email}
                  </Link>
                  <div className="admin-muted">{purchase.user.email}</div>
                </td>
                <td>
                  {purchase.packageName || purchase.package?.name}
                  <div className="admin-muted">{labelFor(PRODUCT_TYPE_LABELS, purchase.productType || purchase.package?.productType)}</div>
                </td>
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
            {!data?.purchases?.length ? (
              <tr>
                <td colSpan={5} className="admin-muted">
                  Aún no hay compras registradas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
