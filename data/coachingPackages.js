export const WHATSAPP_NUMBER = '529982230431'

export const coachingPackages = [
  {
    name: 'Descubrimiento',
    slug: 'sesion-unica',
    product: 'COACHING'
  },
  {
    slug: 'iniciacion',
    name: 'Iniciación',
    product: 'COACHING'
  },
  {
    slug: 'transformacion-profunda',
    name: 'Transformación Profunda',
    product: 'COACHING'
  },
  {
    slug: 'maestria-360',
    name: 'Maestría 360',
    product: 'COACHING'
  }
]

export const getCoachingPackage = (slug) =>
  coachingPackages.find((pkg) => pkg.slug === slug) || null
