import { Suspense } from 'react'
import ResetPasswordClient from './ResetPasswordClient'

export const metadata = {
  title: 'Nueva contraseña'
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="auth">
          <div className="auth__card">Cargando…</div>
        </main>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  )
}
