'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import '../login/auth.scss'

export default function ResetPasswordClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    })

    setLoading(false)

    if (!response.ok) {
      setError('El enlace no es válido o ya expiró.')
      return
    }

    router.push('/auth/login')
  }

  if (!token) {
    return (
      <main className="auth">
        <div className="auth__card">
          <h1 className="auth__title">Enlace inválido</h1>
          <p className="auth__footer">
            <Link href="/auth/forgot-password">Solicitar un nuevo enlace</Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Nueva contraseña</h1>
        <form className="auth__form" onSubmit={onSubmit}>
          <label className="auth__label">
            Contraseña (mín. 8 caracteres)
            <input
              className="auth__input"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <p className="auth__error">{error}</p> : null}
          <button className="auth__submit" type="submit" disabled={loading}>
            {loading ? 'Guardando…' : 'Guardar contraseña'}
          </button>
        </form>
      </div>
    </main>
  )
}
