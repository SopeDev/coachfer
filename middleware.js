import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { getAdminSiteUrl, getMainSiteUrl, isAdminHost } from './lib/hosts'

const PUBLIC_FILE = /\.(.*)$/

const isStaticOrApi = (path) =>
  path.startsWith('/_next') ||
  path.startsWith('/api') ||
  path.startsWith('/fonts') ||
  path === '/favicon.ico' ||
  path === '/icon.svg' ||
  PUBLIC_FILE.test(path)

export async function middleware(req) {
  const path = req.nextUrl.pathname
  const host = req.headers.get('host') || ''
  const onAdminHost = isAdminHost(host)

  if (isStaticOrApi(path)) {
    return NextResponse.next()
  }

  // Auth pages are always public (login/register must work)
  if (path.startsWith('/auth')) {
    return NextResponse.next()
  }

  // Admin subdomain: keep users on the admin surface
  if (onAdminHost) {
    if (
      path === '/coaching' ||
      path === '/mastermind' ||
      path === '/entrenamiento-consciencia' ||
      path === '/agendar'
    ) {
      return NextResponse.redirect(new URL(path, getMainSiteUrl()))
    }

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (token?.error === 'AccountDisabled') {
      const login = new URL('/auth/login', req.url)
      login.searchParams.set('error', 'AccountDisabled')
      return NextResponse.redirect(login)
    }

    if (!token) {
      const login = new URL('/auth/login', req.url)
      login.searchParams.set('callbackUrl', '/')
      return NextResponse.redirect(login)
    }

    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', getMainSiteUrl()))
    }

    if (path === '/' || path === '') {
      return NextResponse.rewrite(new URL('/admin', req.url))
    }

    if (!path.startsWith('/admin')) {
      return NextResponse.rewrite(new URL(`/admin${path}`, req.url))
    }

    return NextResponse.next()
  }

  // Main site in production → send /admin* to subdomain
  if (path.startsWith('/admin') && process.env.NODE_ENV === 'production') {
    const adminBase = getAdminSiteUrl()
    const targetPath = path === '/admin' ? '/' : path.replace(/^\/admin/, '') || '/'
    return NextResponse.redirect(new URL(targetPath, adminBase))
  }

  // Marketing / public pages — never touch NextAuth JWT decoding
  if (!path.startsWith('/dashboard') && !path.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (token?.error === 'AccountDisabled') {
    const login = new URL('/auth/login', req.url)
    login.searchParams.set('error', 'AccountDisabled')
    return NextResponse.redirect(login)
  }

  if (path.startsWith('/dashboard')) {
    if (!token || token.error) {
      const login = new URL('/auth/login', req.url)
      login.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(login)
    }
    return NextResponse.next()
  }

  // Local /admin (dev) role gate
  if (path.startsWith('/admin')) {
    if (!token) {
      const login = new URL('/auth/login', req.url)
      login.searchParams.set('callbackUrl', '/admin')
      return NextResponse.redirect(login)
    }
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

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
    '/agendar',
    '/auth/:path*'
  ]
}
