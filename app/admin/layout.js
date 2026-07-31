import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import AdminShell from './AdminShell'
import './admin.scss'

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false }
}

export default async function AdminLayout({ children }) {
  const session = await getSession()

  if (!session?.user?.id || session.error) {
    redirect('/auth/login?callbackUrl=/admin')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return <AdminShell>{children}</AdminShell>
}
