import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import MemberShell from './MemberShell'
import './member.scss'

export const metadata = {
  title: 'Mi espacio',
  robots: { index: false, follow: false }
}

export default async function DashboardLayout({ children }) {
  const session = await getSession()

  if (!session?.user?.id || session.error) {
    redirect('/auth/login?callbackUrl=/dashboard')
  }

  return <MemberShell>{children}</MemberShell>
}
