'use client'

import PanelShell from '../../components/PanelShell/PanelShell'
import './admin.scss'

const NAV = [
  { href: '/admin', label: 'Resumen', exact: true },
  { href: '/admin/usuarios', label: 'Usuarios' },
  { href: '/admin/paquetes', label: 'Paquetes' },
  { href: '/admin/compras', label: 'Compras' },
  { href: '/admin/sesiones', label: 'Sesiones' }
]

export default function AdminShell({ children }) {
  return (
    <PanelShell
      nav={NAV}
      subtitle="Panel de administración"
      topbarLabel="Administración"
      logoHref="/admin"
      sidebarWidth="240px"
      mainMaxWidth="1100px"
    >
      {children}
    </PanelShell>
  )
}
