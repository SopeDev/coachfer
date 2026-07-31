/**
 * Host helpers for main site vs admin subdomain.
 * Local: use /admin on localhost.
 * Prod: admin.ferquintero.com → admin app surface.
 */

export const getMainSiteUrl = () =>
  process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://ferquintero.com'

export const getAdminHosts = () => {
  const raw =
    process.env.ADMIN_HOSTS ||
    process.env.NEXT_PUBLIC_ADMIN_HOST ||
    'admin.ferquintero.com'
  return raw
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean)
}

export const isAdminHost = (host) => {
  if (!host) return false
  const normalized = host.split(':')[0].toLowerCase()
  return getAdminHosts().some((adminHost) => {
    const base = adminHost.split(':')[0].toLowerCase()
    return normalized === base
  })
}

export const getAdminSiteUrl = () => {
  const host = getAdminHosts()[0] || 'admin.ferquintero.com'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}
