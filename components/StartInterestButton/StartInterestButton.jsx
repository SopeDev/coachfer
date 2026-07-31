'use client'

import { useSession } from 'next-auth/react'
import Button from '../Button/Button'
import {
  buildAuthRegisterHref,
  buildEmpezarPath
} from '../../lib/purchase-intent'

export default function StartInterestButton({
  product,
  packageSlug,
  children,
  type = 'secondary',
  className = '',
  onClick
}) {
  const { data: session, status } = useSession()

  const href =
    status === 'authenticated' && session?.user
      ? buildEmpezarPath({ product, packageSlug })
      : buildAuthRegisterHref({ product, packageSlug })

  const label =
    status === 'authenticated'
      ? children || 'Continuar por WhatsApp'
      : children || 'Crear cuenta y continuar'

  return (
    <Button
      type={type}
      href={href}
      className={className}
      onClick={onClick}
    >
      {status === 'loading' ? 'Cargando…' : label}
    </Button>
  )
}

/** Navbar CTA: Entrar when logged out, Mi cuenta when logged in */
export function AuthNavButton({ className = '', onClick }) {
  const { data: session, status } = useSession()

  // While session resolves, show the logged-out label (most visitors).
  // Avoids a "…" flash; authenticated users swap to "Mi cuenta" once ready.
  if (status === 'authenticated' && session?.user) {
    const dest = session.user.role === 'ADMIN' ? '/admin' : '/dashboard'
    return (
      <Button type="secondary" href={dest} className={className} onClick={onClick}>
        Mi cuenta
      </Button>
    )
  }

  return (
    <Button
      type="secondary"
      href="/auth/login"
      className={className}
      onClick={onClick}
    >
      Iniciar Sesión / Registro
    </Button>
  )
}
