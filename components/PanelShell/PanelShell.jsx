'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import './PanelShell.scss'

/**
 * Shared shell for the member dashboard and the admin panel.
 * Desktop: fixed-width sidebar. Mobile: top bar (name / logo / hamburger)
 * with a full-screen menu, same layout as the public navbar.
 */
export default function PanelShell({
  nav,
  subtitle,
  topbarLabel,
  logoHref,
  sidebarWidth = '220px',
  mainMaxWidth = '920px',
  children
}) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <div
      className="panel-shell"
      style={{
        '--panel-sidebar-width': sidebarWidth,
        '--panel-main-max': mainMaxWidth
      }}
    >
      <header className="panel-topbar">
        <div className="panel-topbar__left">
          <div className="panel-topbar__name">AstroHacking®</div>
          <div className="panel-topbar__title">{topbarLabel || subtitle}</div>
        </div>

        <Link href={logoHref} className="panel-topbar__logo">
          <img src="/icon-white.svg" alt="AstroHacking" />
        </Link>

        <button
          type="button"
          className={`panel-topbar__hamburger${menuOpen ? ' panel-topbar__hamburger--open' : ''}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="panel-sidebar"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="panel-topbar__hamburger-line" />
          <span className="panel-topbar__hamburger-line" />
          <span className="panel-topbar__hamburger-line" />
        </button>
      </header>

      <aside
        id="panel-sidebar"
        className={`panel-sidebar${menuOpen ? ' panel-sidebar--open' : ''}`}
      >
        <div className="panel-sidebar__header">
          <div className="panel-sidebar__brand">AstroHacking®</div>
          <p className="panel-sidebar__sub">{subtitle}</p>
        </div>

        <nav className="panel-sidebar__nav">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`panel-sidebar__link${active ? ' panel-sidebar__link--active' : ''}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="panel-sidebar__footer">
          <button
            type="button"
            className="panel-sidebar__logout"
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="panel-main">{children}</div>
    </div>
  )
}
