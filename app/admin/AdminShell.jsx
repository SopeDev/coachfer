'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import './admin.scss'

const NAV = [
  { href: '/admin', label: 'Resumen', exact: true },
  { href: '/admin/usuarios', label: 'Usuarios' },
  { href: '/admin/paquetes', label: 'Paquetes' },
  { href: '/admin/compras', label: 'Compras' },
  { href: '/admin/sesiones', label: 'Sesiones' }
]

export default function AdminShell({ children }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-sidebar__brand">AstroHacking®</div>
          <p className="admin-sidebar__sub">Panel de administración</p>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar__link${active ? ' admin-sidebar__link--active' : ''}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <span>{session?.user?.email}</span>
          <a href={process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://ferquintero.com'}>
            Ir al sitio
          </a>
          <button type="button" onClick={() => signOut({ callbackUrl: '/auth/login' })}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="admin-main">{children}</div>
    </div>
  )
}
