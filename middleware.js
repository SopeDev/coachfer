import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { getAdminSiteUrl, getMainSiteUrl, isAdminHost } from './lib/hosts'

const PUBLIC_FILE = /\.(.*)$/

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    const host = req.headers.get('host') || ''
    const onAdminHost = isAdminHost(host)

    // Admin subdomain: keep users on the admin surface
    if (onAdminHost) {
      if (
        path.startsWith('/_next') ||
        path.startsWith('/api') ||
        path.startsWith('/auth') ||
        path.startsWith('/fonts') ||
        path === '/favicon.ico' ||
        path === '/icon.svg' ||
        PUBLIC_FILE.test(path)
      ) {
        // fall through
      } else if (path === '/' || path === '') {
        return NextResponse.rewrite(new URL('/admin', req.url))
      } else if (!path.startsWith('/admin')) {
        // /usuarios → /admin/usuarios
        return NextResponse.rewrite(new URL(`/admin${path}`, req.url))
      }

      // Marketing paths should not be browsed on admin host
      if (
        path === '/coaching' ||
        path === '/mastermind' ||
        path === '/entrenamiento-consciencia' ||
        path === '/agendar'
      ) {
        return NextResponse.redirect(new URL(path, getMainSiteUrl()))
      }
    } else if (path.startsWith('/admin') && process.env.NODE_ENV === 'production') {
      // Main site in production → send admins to subdomain
      const adminBase = getAdminSiteUrl()
      const targetPath = path === '/admin' ? '/' : path.replace(/^\/admin/, '') || '/'
      return NextResponse.redirect(new URL(targetPath, adminBase))
    }

    if (token?.error === 'AccountDisabled') {
      const login = new URL('/auth/login', req.url)
      login.searchParams.set('error', 'AccountDisabled')
      return NextResponse.redirect(login)
    }

    const isAdminPath =
      path.startsWith('/admin') ||
      (onAdminHost &&
        !path.startsWith('/api') &&
        !path.startsWith('/auth') &&
        !path.startsWith('/_next'))

    if (isAdminPath && token?.role !== 'ADMIN') {
      if (!token) {
        const login = new URL('/auth/login', req.url)
        login.searchParams.set('callbackUrl', onAdminHost ? '/' : '/admin')
        return NextResponse.redirect(login)
      }
      return NextResponse.redirect(new URL('/dashboard', getMainSiteUrl()))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        const host = req.headers.get('host') || ''
        const onAdminHost = isAdminHost(host)

        if (path.startsWith('/dashboard')) {
          return !!token && !token.error
        }

        if (path.startsWith('/admin') || onAdminHost) {
          // Let the middleware function handle redirects for missing/invalid role
          return true
        }

        return true
      }
    }
  }
)

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/dashboard/:path*',
    '/usuarios/:path*',
    '/paquetes/:path*',
    '/compras/:path*',
    '/sesiones/:path*',
    '/coaching',
    '/mastermind',
    '/entrenamiento-consciencia',
    '/agendar'
  ]
}
