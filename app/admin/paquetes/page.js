'use client'

import { useEffect, useState } from 'react'

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([])
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await fetch('/api/admin/packages')
    const data = await res.json()
    if (!res.ok) {
      setError('No se pudieron cargar los paquetes.')
      return
    }
    setPackages(data.packages)
  }

  useEffect(() => {
    load()
  }, [])

  const toggleActive = async (pkg) => {
    setSavingId(pkg.id)
    setMessage('')
    const res = await fetch('/api/admin/packages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: pkg.id, active: !pkg.active })
    })
    setSavingId('')
    if (!res.ok) {
      setMessage('No se pudo actualizar el paquete.')
      return
    }
    setMessage('Paquete actualizado.')
    await load()
  }

  const savePrice = async (pkg, price) => {
    setSavingId(pkg.id)
    setMessage('')
    const res = await fetch('/api/admin/packages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: pkg.id, price: Number(price) })
    })
    setSavingId('')
    if (!res.ok) {
      setMessage('No se pudo guardar el precio.')
      return
    }
    setMessage('Precio guardado.')
    await load()
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Paquetes</h1>
          <p className="admin-page__subtitle">
            Coaching y Entrenamiento. Los IDs de Stripe se conectarán en la fase de pagos.
          </p>
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-muted">{message}</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Créditos / sesiones</th>
              <th>Precio</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td>
                  <strong>{pkg.name}</strong>
                  <div className="admin-muted">{pkg.slug}</div>
                </td>
                <td>
                  <span className="admin-badge">{pkg.productType}</span>
                </td>
                <td>{pkg.creditQuantity}</td>
                <td>
                  <form
                    style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}
                    onSubmit={(e) => {
                      e.preventDefault()
                      const price = new FormData(e.currentTarget).get('price')
                      savePrice(pkg, price)
                    }}
                  >
                    <input
                      className="admin-input"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={pkg.price}
                      style={{ width: '100px' }}
                    />
                    <span className="admin-muted">{pkg.currency?.toUpperCase()}</span>
                    <button
                      className="admin-btn admin-btn--ghost"
                      type="submit"
                      disabled={savingId === pkg.id}
                    >
                      OK
                    </button>
                  </form>
                </td>
                <td>
                  {pkg.active ? (
                    <span className="admin-badge admin-badge--ok">Activo</span>
                  ) : (
                    <span className="admin-badge admin-badge--warn">Inactivo</span>
                  )}
                </td>
                <td>
                  <button
                    className="admin-btn admin-btn--ghost"
                    type="button"
                    disabled={savingId === pkg.id}
                    onClick={() => toggleActive(pkg)}
                  >
                    {pkg.active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
