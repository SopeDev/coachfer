import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

const providers = [
  CredentialsProvider({
    id: 'credentials',
    name: 'Email',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase()
      const password = credentials?.password

      if (!email || !password) {
        throw new Error('EMAIL_PASSWORD_REQUIRED')
      }

      const user = await prisma.user.findUnique({ where: { email } })

      if (!user || !user.passwordHash) {
        throw new Error('INVALID_CREDENTIALS')
      }

      if (user.disabledAt) {
        throw new Error('ACCOUNT_DISABLED')
      }

      const valid = await bcrypt.compare(password, user.passwordHash)
      if (!valid) {
        throw new Error('INVALID_CREDENTIALS')
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role
      }
    }
  })
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true
    })
  )
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  cookies: process.env.NEXTAUTH_COOKIE_DOMAIN
    ? {
        sessionToken: {
          name:
            process.env.NODE_ENV === 'production'
              ? '__Secure-next-auth.session-token'
              : 'next-auth.session-token',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            domain: process.env.NEXTAUTH_COOKIE_DOMAIN
          }
        }
      }
    : undefined,
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email.toLowerCase() }
      })

      if (dbUser?.disabledAt) return false
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role || 'USER'
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            role: true,
            name: true,
            email: true,
            disabledAt: true
          }
        })

        if (!dbUser || dbUser.disabledAt) {
          return { ...token, error: 'AccountDisabled' }
        }

        token.role = dbUser.role
        token.email = dbUser.email
        if (dbUser.name) token.name = dbUser.name
        delete token.error
      }

      if (trigger === 'update' && session) {
        if (session.name !== undefined) token.name = session.name
        if (session.email !== undefined) token.email = session.email
      }

      return token
    },
    async session({ session, token }) {
      if (token.error) {
        session.error = token.error
      }

      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role || 'USER'
        if (token.email) session.user.email = token.email
        if (token.name) session.user.name = token.name
      }

      return session
    }
  },
  events: {
    async createUser({ user }) {
      if (!user.email) return

      const { DEFAULT_TIMEZONE } = await import('./timezone')
      await prisma.user.update({
        where: { id: user.id },
        data: {
          email: user.email.toLowerCase(),
          timezone: DEFAULT_TIMEZONE
        }
      })
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}

export const getServerAuthSession = async () => {
  const { getServerSession } = await import('next-auth')
  return getServerSession(authOptions)
}
