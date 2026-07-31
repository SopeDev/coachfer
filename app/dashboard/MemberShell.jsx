'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import './member.scss'

const NAV = [
  { href: '/dashboard', label: 'Inicio', exact: true },
  { href: '/dashboard/sesiones', label: 'Sesiones' },
  { href: '/dashboard/reservas', label: 'Mis reservas' },
  { href: '/dashboard/creditos', label: 'Créditos' },
  { href: '/dashboard/cuenta', label: 'Mi cuenta' }
]

export default function MemberShell({ children }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="member-shell">
      <aside className="member-sidebar">
        <div>
          <div className="member-sidebar__brand">AstroHacking®</div>
          <p className="member-sidebar__sub">Tu espacio</p>
        </div>

        <nav className="member-sidebar__nav">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`member-sidebar__link${active ? ' member-sidebar__link--active' : ''}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="member-sidebar__footer">
          <span>{session?.user?.email}</span>
          <a href="/">Ir al sitio</a>
          <button type="button" onClick={() => signOut({ callbackUrl: '/auth/login' })}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="member-main">{children}</div>
    </div>
  )
}
