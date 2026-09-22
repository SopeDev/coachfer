'use client'

import PanelShell from '../../components/PanelShell/PanelShell'
import './member.scss'

const NAV = [
  { href: '/dashboard', label: 'Inicio', exact: true },
  { href: '/dashboard/sesiones', label: 'Sesiones' },
  { href: '/dashboard/reservas', label: 'Mis reservas' },
  { href: '/dashboard/creditos', label: 'Créditos' },
  { href: '/dashboard/cuenta', label: 'Mi cuenta' }
]

export default function MemberShell({ children }) {
  return (
    <PanelShell
      nav={NAV}
      subtitle="Tu espacio"
      logoHref="/dashboard"
      sidebarWidth="220px"
      mainMaxWidth="920px"
    >
      {children}
    </PanelShell>
  )
}
