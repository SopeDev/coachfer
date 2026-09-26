'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const createErrors = {
  USERNAME_IN_USE: 'Ese teléfono/usuario ya está en uso.',
  INVALID_INPUT: 'Revisa los datos: nombre, usuario y contraseña son obligatorios.'
}

const generatePassword = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(9))
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, '').slice(0, 10)
}

export default function AdminNewUserPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, password, role })
    })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(createErrors[data.error] || 'No se pudo crear el usuario.')
      return
    }

    router.push(`/admin/usuarios/${data.user.id}`)
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <p className="admin-muted">
            <Link href="/admin/usuarios">← Usuarios</Link>
          </p>
          <h1 className="admin-page__title">Nuevo usuario</h1>
          <p className="admin-page__subtitle">
            Úsalo para dar de alta a alguien que no se registró solo (por ejemplo,
            por WhatsApp). Puedes usar su número de teléfono como usuario; la
            persona podrá cambiarlo por su email real desde Mi cuenta una vez que
            inicie sesión.
          </p>
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <section className="admin-card" style={{ maxWidth: '520px' }}>
        <form className="admin-form" onSubmit={onSubmit}>
          <label>
            Nombre
            <input
              className="admin-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </label>

          <label>
            Usuario (teléfono o email)
            <input
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej. 5219981234567 o correo@ejemplo.com"
              required
              minLength={6}
            />
            <span className="admin-muted">
              No necesita ser un email válido todavía. Se guarda como el
              usuario de acceso.
            </span>
          </label>

          <label>
            Contraseña
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                style={{ flex: 1 }}
              />
              <button
                className="admin-btn admin-btn--ghost"
                type="button"
                onClick={() => setPassword(generatePassword())}
              >
                Generar
              </button>
            </div>
            <span className="admin-muted">
              Compártela con la persona (por WhatsApp, por ejemplo) para que
              pueda iniciar sesión.
            </span>
          </label>

          <label>
            Rol
            <select
              className="admin-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">Usuario</option>
              <option value="ADMIN">Administrador</option>
              <option value="FACILITATOR">Facilitador</option>
            </select>
          </label>

          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? 'Creando…' : 'Crear usuario'}
          </button>
        </form>
      </section>
    </div>
  )
}
