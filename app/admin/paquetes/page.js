'use client'

import { useEffect, useMemo, useState } from 'react'

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([])
  const [prices, setPrices] = useState({})
  const [validity, setValidity] = useState({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await fetch('/api/admin/packages')
    const data = await res.json()
    if (!res.ok) {
      setError('No se pudieron cargar los paquetes.')
      return
    }
    setPackages(data.packages)
    setPrices(
      Object.fromEntries(data.packages.map((pkg) => [pkg.id, pkg.price]))
    )
    setValidity(
      Object.fromEntries(
        data.packages.map((pkg) => [pkg.id, pkg.validityDays ?? ''])
      )
    )
  }

  useEffect(() => {
    load()
  }, [])

  const dirtyIds = useMemo(
    () =>
      packages
        .filter((pkg) => {
          const price = prices[pkg.id]
          const days = validity[pkg.id]
          const priceChanged =
            price !== undefined && Number(price) !== Number(pkg.price)
          const daysChanged =
            days !== undefined && String(days) !== String(pkg.validityDays ?? '')
          return priceChanged || daysChanged
        })
        .map((pkg) => pkg.id),
    [packages, prices, validity]
  )

  const hasChanges = dirtyIds.length > 0

  const saveChanges = async () => {
    if (!hasChanges) return

    setSaving(true)
    setMessage('')

    const results = await Promise.all(
      dirtyIds.map(async (id) => {
        const pkg = packages.find((p) => p.id === id)
        const body = { id }

        const price = Number(prices[id])
        if (price !== Number(pkg.price)) {
          if (Number.isNaN(price) || price < 0) return { id, ok: false }
          body.price = price
        }

        const rawDays = String(validity[id] ?? '').trim()
        if (rawDays !== String(pkg.validityDays ?? '')) {
          if (rawDays === '') {
            body.validityDays = null
          } else {
            const days = Number(rawDays)
            if (!Number.isInteger(days) || days <= 0) return { id, ok: false }
            body.validityDays = days
          }
        }

        const res = await fetch('/api/admin/packages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        return { id, ok: res.ok }
      })
    )

    setSaving(false)

    if (results.some((r) => !r.ok)) {
      setMessage('No se pudieron guardar algunos cambios.')
      await load()
      return
    }

    setMessage(
      results.length === 1
        ? 'Paquete guardado.'
        : `${results.length} paquetes guardados.`
    )
    await load()
  }

  const renderTable = (title, rows, { creditsLabel, showValidity }) => (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2 className="admin-card__title">{title}</h2>
      <div className="admin-table-wrap">
        <table className="admin-table" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '34%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '24%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>{creditsLabel}</th>
              <th>Precio</th>
              {showValidity ? <th>Vigencia (días)</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={showValidity ? 4 : 3} className="admin-muted">
                  Sin paquetes.
                </td>
              </tr>
            ) : (
              rows.map((pkg) => (
                <tr key={pkg.id}>
                  <td>
                    <strong>{pkg.name}</strong>
                    <div className="admin-muted">{pkg.slug}</div>
                  </td>
                  <td>{pkg.creditQuantity}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <input
                        className="admin-input"
                        type="number"
                        step="0.01"
                        min="0"
                        value={prices[pkg.id] ?? pkg.price}
                        onChange={(e) =>
                          setPrices((prev) => ({
                            ...prev,
                            [pkg.id]: e.target.value
                          }))
                        }
                        style={{ width: '100px' }}
                      />
                      <span className="admin-muted">{pkg.currency?.toUpperCase()}</span>
                    </div>
                  </td>
                  {showValidity ? (
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <input
                          className="admin-input"
                          type="number"
                          step="1"
                          min="1"
                          placeholder="Sin vigencia"
                          value={validity[pkg.id] ?? pkg.validityDays ?? ''}
                          onChange={(e) =>
                            setValidity((prev) => ({
                              ...prev,
                              [pkg.id]: e.target.value
                            }))
                          }
                          style={{ width: '100px' }}
                        />
                        <span className="admin-muted">días</span>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )

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

      {renderTable(
        'Coaching',
        packages.filter((pkg) => pkg.productType === 'COACHING'),
        { creditsLabel: 'Sesiones', showValidity: false }
      )}
      {renderTable(
        'Mastermind',
        packages.filter((pkg) => pkg.productType === 'MASTERMIND'),
        { creditsLabel: 'Créditos', showValidity: true }
      )}

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="admin-btn"
          type="button"
          disabled={saving || !hasChanges}
          onClick={saveChanges}
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}
