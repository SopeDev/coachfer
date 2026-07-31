'use client'

import { useState } from 'react'
import Link from 'next/link'
import '../login/auth.scss'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    setLoading(false)
    setDone(true)
  }

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Recuperar contraseña</h1>
        <p className="auth__subtitle">
          Te enviaremos un enlace si el email existe en nuestro sistema.
        </p>

        {done ? (
          <p className="auth__success">
            Si hay una cuenta con ese email, recibirás instrucciones en breve.
          </p>
        ) : (
          <form className="auth__form" onSubmit={onSubmit}>
            <label className="auth__label">
              Email
              <input
                className="auth__input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button className="auth__submit" type="submit" disabled={loading}>
              {loading ? 'Enviando…' : 'Enviar enlace'}
            </button>
          </form>
        )}

        <p className="auth__footer">
          <Link href="/auth/login">Volver a iniciar sesión</Link>
        </p>
      </div>
    </main>
  )
}
