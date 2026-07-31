'use client'

import { useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  buildAuthRegisterHref,
  buildInterestWhatsAppUrl,
  getPackageLabel
} from '../../lib/purchase-intent'
import { trackWhatsAppClick } from '../../lib/analytics'
import '../auth/login/auth.scss'

export default function EmpezarClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const product = searchParams.get('product') || ''
  const packageSlug = searchParams.get('package') || ''

  const label = useMemo(
    () => getPackageLabel({ product, packageSlug }),
    [product, packageSlug]
  )

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(buildAuthRegisterHref({ product, packageSlug }))
    }
  }, [status, router, product, packageSlug])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <main className="auth">
        <div className="auth__card">
          <p className="auth__subtitle">Cargando…</p>
        </div>
      </main>
    )
  }

  const waUrl = buildInterestWhatsAppUrl({
    product,
    packageSlug,
    name: session.user.name,
    email: session.user.email
  })

  const productTitle =
    product === 'COACHING'
      ? 'Coaching Privado'
      : product === 'MASTERMIND'
        ? 'Entrenamiento de la Consciencia'
        : 'AstroHacking®'

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Cuenta lista</h1>
        <p className="auth__subtitle">
          Hola {session.user.name || session.user.email}. El siguiente paso es
          hablar con Fernando por WhatsApp para coordinar el pago de forma
          personal.
        </p>

        <div className="auth__summary">
          <strong>{productTitle}</strong>
          <div className="auth__summary-meta">{label}</div>
          <div className="auth__summary-email">{session.user.email}</div>
        </div>

        <a
          className="auth__submit"
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackWhatsAppClick(
              `empezar_${product || 'general'}_${packageSlug || 'none'}`
            )
          }
          style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
        >
          Continuar por WhatsApp
        </a>

        <p className="auth__footer">
          <Link href="/dashboard">Ir a mi espacio</Link>
          {' · '}
          <Link href={product === 'COACHING' ? '/coaching' : '/mastermind'}>
            Volver
          </Link>
        </p>
      </div>
    </main>
  )
}
