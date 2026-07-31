import { Suspense } from 'react'
import EmpezarClient from './EmpezarClient'

export const metadata = {
  title: 'Continuar',
  robots: { index: false, follow: false }
}

export default function EmpezarPage() {
  return (
    <Suspense
      fallback={
        <main className="auth">
          <div className="auth__card">Cargando…</div>
        </main>
      }
    >
      <EmpezarClient />
    </Suspense>
  )
}
