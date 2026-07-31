export const WHATSAPP_NUMBER = '529982230431'

const UNIT_PRICE = 33

export const mastermindPackages = [
  {
    id: 'activacion',
    slug: 'sesion-individual',
    name: 'Activación',
    creditQuantity: 1,
    validityDays: 45,
    price: 33,
    currency: 'usd',
    tagline: 'Enciende el laboratorio con una sesión.',
    description:
      'Ideal para conocer el formato y vivir una primera experiencia de entrenamiento.',
    validityLabel: 'Vigencia de 45 días',
    idealFor: 'Quien quiere probar el laboratorio semanal',
    features: [
      '1 crédito = 1 sesión en vivo',
      'Vigencia de 45 días',
      'Acceso al Entrenamiento de la Consciencia',
      'Enlace personal de Zoom al reservar'
    ],
    featured: false
  },
  {
    id: 'integracion',
    slug: 'paquete-4-sesiones',
    name: 'Integración',
    creditQuantity: 4,
    validityDays: 60,
    price: 111,
    currency: 'usd',
    tagline: 'Diseñado para aproximadamente un mes de práctica.',
    description: 'Tienes hasta dos meses para utilizar tus créditos.',
    validityLabel: 'Vigencia de 2 meses',
    idealFor: 'Quien busca un ritmo sostenido de práctica',
    features: [
      '4 créditos = 4 sesiones en vivo',
      'Vigencia de 2 meses',
      'Tú eliges a qué sesiones asistir',
      'Enlace personal de Zoom al reservar'
    ],
    featured: true
  },
  {
    id: 'transformacion',
    slug: 'paquete-12-sesiones',
    name: 'Transformación',
    creditQuantity: 12,
    validityDays: 180,
    price: 278,
    currency: 'usd',
    tagline: 'Profundidad y constancia a lo largo de medio año.',
    description: 'Tienes hasta seis meses para utilizar tus créditos.',
    validityLabel: 'Vigencia de 6 meses',
    idealFor: 'Quien quiere entrenar con continuidad',
    features: [
      '12 créditos = 12 sesiones en vivo',
      'Vigencia de 6 meses',
      'Tú eliges a qué sesiones asistir',
      'Enlace personal de Zoom al reservar'
    ],
    featured: false
  },
  {
    id: 'expansion',
    slug: 'paquete-24-sesiones',
    name: 'Expansión',
    creditQuantity: 24,
    validityDays: 270,
    price: 444,
    currency: 'usd',
    tagline: 'El compromiso más profundo con tu evolución.',
    description: 'Tienes hasta nueve meses para utilizar tus créditos.',
    validityLabel: 'Vigencia de 9 meses',
    idealFor: 'Quien busca máxima profundidad y flexibilidad',
    features: [
      '24 créditos = 24 sesiones en vivo',
      'Vigencia de 9 meses',
      'Tú eliges a qué sesiones asistir',
      'Enlace personal de Zoom al reservar'
    ],
    featured: false
  }
]

export const formatPackagePrice = (pkg) => {
  if (pkg?.price == null) return null
  return `$${pkg.price} USD`
}

export const getPerSessionPrice = (pkg) => {
  if (!pkg?.price || !pkg?.creditQuantity) return null
  return Math.round(pkg.price / pkg.creditQuantity)
}

export const getPackageSavings = (pkg) => {
  if (!pkg?.price || !pkg?.creditQuantity || pkg.creditQuantity <= 1) return null
  const full = UNIT_PRICE * pkg.creditQuantity
  const saved = full - pkg.price
  return saved > 0 ? saved : null
}

export const whatsappPackageUrl = (packageName) => {
  const text = encodeURIComponent(
    `Hola, me interesa el Entrenamiento de la Consciencia — ${packageName}.`
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

export const whatsappMastermindUrl = () => {
  const text = encodeURIComponent(
    'Hola, me interesa el Entrenamiento de la Consciencia by AstroHacking®.'
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}
