'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Toast from '../../../components/Toast/Toast'
import {
  DEFAULT_TIMEZONE,
  TIMEZONE_OPTIONS,
  getTimezoneLabel
} from '../../../lib/timezone'

const profileErrors = {
  INVALID_INPUT: 'Revisa los datos e intenta de nuevo.',
  EMAIL_IN_USE: 'Ese email ya está en uso.',
  CURRENT_PASSWORD_REQUIRED:
    'Confirma tu contraseña actual para cambiar el email.',
  INVALID_CURRENT_PASSWORD: 'La contraseña actual no es correcta.',
  PASSWORD_REQUIRED_FOR_EMAIL:
    'No puedes cambiar el email en esta cuenta. Contacta soporte.'
}

const passwordErrors = {
  INVALID_INPUT: 'La nueva contraseña debe tener al menos 8 caracteres.',
  INVALID_CURRENT_PASSWORD: 'La contraseña actual no es correcta.',
  NO_PASSWORD_ACCOUNT:
    'Esta cuenta no usa contraseña (ingreso con Google u otro método).',
  PASSWORD_UNCHANGED: 'La nueva contraseña debe ser distinta a la actual.'
}

export default function MiCuentaPage() {
  const { update } = useSession()
  const [account, setAccount] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [toast, setToast] = useState(null)

  const [email, setEmail] = useState('')
  const [timezone, setTimezone] = useState(DEFAULT_TIMEZONE)
  const [emailPassword, setEmailPassword] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
  }

  useEffect(() => {
    fetch('/api/me/account')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error')
        setAccount(data.account)
        setEmail(data.account.email || '')
        setTimezone(data.account.timezone || DEFAULT_TIMEZONE)
      })
      .catch(() => setLoadError('No se pudo cargar tu cuenta.'))
  }, [])

  const saveProfile = async (event) => {
    event.preventDefault()
    setSavingProfile(true)
    setProfileError('')

    const payload = { email, timezone }
    if (account && email.toLowerCase() !== account.email.toLowerCase()) {
      payload.currentPassword = emailPassword
    }

    const res = await fetch('/api/me/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    setSavingProfile(false)

    if (!res.ok) {
      setProfileError(profileErrors[data.error] || 'No se pudo guardar.')
      return
    }

    setAccount(data.account)
    setEmailPassword('')
    await update({ email: data.account.email })
    showToast('Datos actualizados.')
  }

  const savePassword = async (event) => {
    event.preventDefault()
    setPasswordError('')

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden.')
      return
    }

    setSavingPassword(true)
    const res = await fetch('/api/me/account/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    })
    const data = await res.json()
    setSavingPassword(false)

    if (!res.ok) {
      setPasswordError(passwordErrors[data.error] || 'No se pudo cambiar.')
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    showToast('Contraseña actualizada.')
  }

  if (loadError) {
    return (
      <div className="member-page">
        <p className="member-error">{loadError}</p>
      </div>
    )
  }

  if (!account) {
    return <p className="member-muted">Cargando…</p>
  }

  const emailChanged =
    email.trim().toLowerCase() !== account.email.toLowerCase()

  return (
    <div className="member-page">
      <Toast
        key={toast?.id}
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      <div className="member-page__header">
        <h1 className="member-page__title">Mi cuenta</h1>
        <p className="member-page__subtitle">
          Actualiza tu email, zona horaria y contraseña.
        </p>
      </div>

      <section className="member-card">
        <h2 className="member-card__title">Perfil</h2>
        <form className="member-form" onSubmit={saveProfile}>
          <div className="member-form__label">
            Nombre
            <p className="member-form__readonly">{account.name || '—'}</p>
          </div>

          <label className="member-form__label">
            Email
            <input
              className="member-form__input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          {emailChanged && account.hasPassword ? (
            <label className="member-form__label">
              Contraseña actual (para confirmar el cambio de email)
              <input
                className="member-form__input"
                type="password"
                required
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
          ) : null}

          <label className="member-form__label">
            Zona horaria
            <select
              className="member-form__input"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
              {!TIMEZONE_OPTIONS.some((tz) => tz.value === timezone) ? (
                <option value={timezone}>{getTimezoneLabel(timezone)}</option>
              ) : null}
            </select>
            <span className="member-form__hint">
              Las sesiones en vivo siempre se muestran en la hora oficial de la
              clase (CDMX). Tu zona se usa para fechas personales (p. ej.
              vencimiento de créditos) y como referencia “en tu hora”.
            </span>
          </label>

          {profileError ? <p className="member-error">{profileError}</p> : null}

          <button
            className="member-btn"
            type="submit"
            disabled={savingProfile}
          >
            {savingProfile ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </form>
      </section>

      {account.hasPassword ? (
        <section className="member-card">
          <h2 className="member-card__title">Contraseña</h2>
          <p className="member-card__meta" style={{ marginBottom: '1rem' }}>
            Usa una contraseña de al menos 8 caracteres.
          </p>
          <form className="member-form" onSubmit={savePassword}>
            <label className="member-form__label">
              Contraseña actual
              <input
                className="member-form__input"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            <label className="member-form__label">
              Nueva contraseña
              <input
                className="member-form__input"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </label>
            <label className="member-form__label">
              Confirmar nueva contraseña
              <input
                className="member-form__input"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </label>

            {passwordError ? (
              <p className="member-error">{passwordError}</p>
            ) : null}

            <button
              className="member-btn"
              type="submit"
              disabled={savingPassword}
            >
              {savingPassword ? 'Actualizando…' : 'Cambiar contraseña'}
            </button>
          </form>
        </section>
      ) : (
        <section className="member-card">
          <h2 className="member-card__title">Contraseña</h2>
          <p className="member-card__meta">
            Entraste con un proveedor externo (p. ej. Google). La contraseña se
            gestiona ahí.
          </p>
        </section>
      )}
    </div>
  )
}
