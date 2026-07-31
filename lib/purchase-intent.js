import { WHATSAPP_NUMBER, mastermindPackages } from '../data/mastermindPackages'
import { coachingPackages } from '../data/coachingPackages'

export const getPackageLabel = ({ product, packageSlug }) => {
  if (product === 'MASTERMIND') {
    const pkg = mastermindPackages.find((p) => p.slug === packageSlug || p.id === packageSlug)
    return pkg?.name || 'Entrenamiento de la Consciencia'
  }
  if (product === 'COACHING') {
    const pkg = coachingPackages.find((p) => p.slug === packageSlug)
    return pkg?.name || 'Coaching Privado'
  }
  return 'AstroHacking®'
}

export const buildEmpezarPath = ({ product, packageSlug }) => {
  const params = new URLSearchParams()
  if (product) params.set('product', product)
  if (packageSlug) params.set('package', packageSlug)
  const qs = params.toString()
  return qs ? `/empezar?${qs}` : '/empezar'
}

export const buildAuthRegisterHref = ({ product, packageSlug }) => {
  const callbackUrl = buildEmpezarPath({ product, packageSlug })
  return `/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
}

export const buildAuthLoginHref = ({ product, packageSlug }) => {
  const callbackUrl = buildEmpezarPath({ product, packageSlug })
  return `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
}

export const buildInterestWhatsAppUrl = ({
  product,
  packageSlug,
  name,
  email
}) => {
  const label = getPackageLabel({ product, packageSlug })
  const productLine =
    product === 'COACHING'
      ? 'Coaching Privado'
      : product === 'MASTERMIND'
        ? 'Entrenamiento de la Consciencia (Mastermind)'
        : 'AstroHacking®'

  const lines = [
    `Hola Fernando, ya creé mi cuenta en AstroHacking®.`,
    `Me interesa: ${productLine} — ${label}.`,
    name ? `Nombre: ${name}` : null,
    email ? `Email: ${email}` : null,
    `¿Me orientas con el siguiente paso y la forma de pago?`
  ].filter(Boolean)

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}
