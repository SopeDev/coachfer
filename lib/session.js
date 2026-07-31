import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export const getSession = () => getServerSession(authOptions)

export const requireUser = async () => {
  const session = await getSession()
  if (!session?.user?.id || session.error) {
    return { session: null, error: 'UNAUTHORIZED' }
  }
  return { session, error: null }
}

export const requireAdmin = async () => {
  const { session, error } = await requireUser()
  if (error) return { session: null, error }
  if (session.user.role !== 'ADMIN') {
    return { session, error: 'FORBIDDEN' }
  }
  return { session, error: null }
}
