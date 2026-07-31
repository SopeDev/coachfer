'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import '../login/auth.scss'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/empezar'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loginHref = `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      setLoading(false)
      if (data.error === 'EMAIL_IN_USE') {
        setError('Este email ya está registrado.')
      } else {
        setError('No se pudo crear la cuenta. Revisa los datos.')
      }
      return
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    setLoading(false)

    if (result?.error) {
      router.push(loginHref)
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Crear cuenta</h1>
        <p className="auth__subtitle">
          Este es el primer paso de tu proceso. Al crear tu cuenta, abres el
          espacio donde comienza tu transformación y tu camino hacia tu
          propósito.
        </p>

        <form className="auth__form" onSubmit={onSubmit}>
          <label className="auth__label">
            Nombre
            <input
              className="auth__input"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="auth__label">
            Email
            <input
              className="auth__input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="auth__label">
            Contraseña (mín. 8 caracteres)
            <input
              className="auth__input"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error ? <p className="auth__error">{error}</p> : null}

          <button className="auth__submit" type="submit" disabled={loading}>
            {loading ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth__footer">
          ¿Ya tienes cuenta? <Link href={loginHref}>Inicia sesión</Link>
        </p>
      </div>
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="auth">
          <div className="auth__card">Cargando…</div>
        </main>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
