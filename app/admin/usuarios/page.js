'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminUsersPage() {
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ page: String(page), pageSize: '20' })
    if (q.trim()) params.set('q', q.trim())
    if (role) params.set('role', role)

    try {
      const res = await fetch(`/api/admin/users?${params}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      setData(json)
    } catch {
      setError('No se pudo cargar la lista de usuarios.')
    } finally {
      setLoading(false)
    }
  }, [page, q, role])

  useEffect(() => {
    load()
  }, [load])

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Usuarios</h1>
          <p className="admin-page__subtitle">
            Busca miembros, revisa créditos y gestiona accesos.
          </p>
        </div>
      </div>

      <form
        className="admin-toolbar"
        onSubmit={(e) => {
          e.preventDefault()
          setPage(1)
          load()
        }}
      >
        <input
          className="admin-input"
          placeholder="Buscar por nombre o email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: '1 1 220px' }}
        />
        <select
          className="admin-select"
          value={role}
          onChange={(e) => {
            setRole(e.target.value)
            setPage(1)
          }}
        >
          <option value="">Todos los roles</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="FACILITATOR">FACILITATOR</option>
        </select>
        <button className="admin-btn" type="submit">
          Buscar
        </button>
      </form>

      {error ? <p className="admin-error">{error}</p> : null}
      {loading ? <p className="admin-muted">Cargando…</p> : null}

      {data && !loading ? (
        <>
          <p className="admin-muted">{data.total} resultado(s)</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Créditos</th>
                  <th>Compras</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name || '—'}</strong>
                      <div className="admin-muted">{user.email}</div>
                    </td>
                    <td>
                      <span className="admin-badge">{user.role}</span>
                    </td>
                    <td>{user.availableCredits}</td>
                    <td>{user.purchasesCount}</td>
                    <td>
                      {user.disabledAt ? (
                        <span className="admin-badge admin-badge--danger">Deshabilitado</span>
                      ) : (
                        <span className="admin-badge admin-badge--ok">Activo</span>
                      )}
                    </td>
                    <td>
                      <Link href={`/admin/usuarios/${user.id}`}>Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 ? (
            <div className="admin-pagination">
              {page > 1 ? (
                <button
                  className="admin-btn admin-btn--ghost"
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </button>
              ) : (
                <span className="admin-pagination__spacer" aria-hidden="true" />
              )}
              <span className="admin-muted">
                Página {page} de {totalPages}
              </span>
              {page < totalPages ? (
                <button
                  className="admin-btn admin-btn--ghost"
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Siguiente
                </button>
              ) : (
                <span className="admin-pagination__spacer" aria-hidden="true" />
              )}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
