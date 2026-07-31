'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import './auth.scss'

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const urlError = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(
    urlError === 'AccountDisabled'
      ? 'Tu cuenta está deshabilitada. Contacta soporte.'
      : urlError
        ? 'No se pudo iniciar sesión. Intenta de nuevo.'
        : ''
  )
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl
    })

    setLoading(false)

    if (result?.error) {
      setError('Email o contraseña incorrectos.')
      return
    }

    // Prefer admin panel when no explicit callback and user is admin
    let destination = callbackUrl
    if (!searchParams.get('callbackUrl')) {
      try {
        const sessionRes = await fetch('/api/auth/session')
        const session = await sessionRes.json()
        if (session?.user?.role === 'ADMIN') {
          destination = '/admin'
        } else {
          destination = '/dashboard'
        }
      } catch {
        destination = '/dashboard'
      }
    }

    router.push(destination)
    router.refresh()
  }

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Iniciar sesión</h1>
        <p className="auth__subtitle">Accede a tu espacio AstroHacking®</p>

        <form className="auth__form" onSubmit={onSubmit}>
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
            Contraseña
            <input
              className="auth__input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error ? <p className="auth__error">{error}</p> : null}

          <button className="auth__submit" type="submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="auth__footer">
          <Link href="/auth/forgot-password">¿Olvidaste tu contraseña?</Link>
        </p>
        <p className="auth__footer">
          ¿No tienes cuenta?{' '}
          <Link
            href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  )
}
