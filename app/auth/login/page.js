import { Suspense } from 'react'
import LoginPage from './LoginClient'

export const metadata = {
  title: 'Iniciar sesión'
}

export default function Page() {
  return (
    <Suspense fallback={<main className="auth"><div className="auth__card">Cargando…</div></main>}>
      <LoginPage />
    </Suspense>
  )
}
