import 'dotenv/config'
import { PrismaClient, ProductType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const mastermindPackages = [
  {
    name: 'Activación',
    slug: 'sesion-individual',
    productType: ProductType.MASTERMIND,
    creditQuantity: 1,
    validityDays: 45,
    price: 33,
    currency: 'usd',
    displayOrder: 1,
    tagline: 'Enciende el laboratorio con una sesión.',
    description:
      'Ideal para conocer el formato y vivir una primera experiencia de entrenamiento.',
    featured: false,
    features: {
      validityLabel: 'Vigencia de 45 días',
      practiceHint: 'Una sesión para experimentar el método.'
    }
  },
  {
    name: 'Integración',
    slug: 'paquete-4-sesiones',
    productType: ProductType.MASTERMIND,
    creditQuantity: 4,
    validityDays: 60,
    price: 111,
    currency: 'usd',
    displayOrder: 2,
    tagline: 'Diseñado para aproximadamente un mes de práctica.',
    description: 'Tienes hasta dos meses para utilizar tus créditos.',
    featured: true,
    features: {
      validityLabel: 'Vigencia de 2 meses',
      practiceHint: 'Ritmo sostenido para integrar hábitos conscientes.'
    }
  },
  {
    name: 'Transformación',
    slug: 'paquete-12-sesiones',
    productType: ProductType.MASTERMIND,
    creditQuantity: 12,
    validityDays: 180,
    price: 278,
    currency: 'usd',
    displayOrder: 3,
    tagline: 'Profundidad y constancia a lo largo de medio año.',
    description: 'Tienes hasta seis meses para utilizar tus créditos.',
    featured: false,
    features: {
      validityLabel: 'Vigencia de 6 meses',
      practiceHint: 'Para quienes quieren entrenar con continuidad.'
    }
  },
  {
    name: 'Expansión',
    slug: 'paquete-24-sesiones',
    productType: ProductType.MASTERMIND,
    creditQuantity: 24,
    validityDays: 270,
    price: 444,
    currency: 'usd',
    displayOrder: 4,
    tagline: 'El compromiso más profundo con tu evolución.',
    description: 'Tienes hasta nueve meses para utilizar tus créditos.',
    featured: false,
    features: {
      validityLabel: 'Vigencia de 9 meses',
      practiceHint: 'Máxima flexibilidad y acompañamiento sostenido.'
    }
  }
]

const coachingPackages = [
  {
    name: 'Descubrimiento',
    slug: 'sesion-unica',
    productType: ProductType.COACHING,
    creditQuantity: 1,
    validityDays: null,
    price: 111,
    currency: 'usd',
    displayOrder: 0,
    tagline: 'Conoce tu programa',
    description:
      'Una sesión individual para conocer tu programa y experimentar el método.',
    featured: false,
    features: [
      'Interpretación inicial de tu carta natal',
      'Identificación de tu herida raíz principal',
      'Mapa básico de tus contratos kármicos'
    ]
  },
  {
    name: 'Iniciación',
    slug: 'iniciacion',
    productType: ProductType.COACHING,
    creditQuantity: 3,
    validityDays: null,
    price: 278,
    currency: 'usd',
    displayOrder: 1,
    tagline: 'Adéntrate al poder de la reprogramación cuántica',
    description: '3 sesiones (4.5 horas total)',
    featured: false,
    features: [
      'Interpretación cuántica completa de la carta natal',
      'Identificación de heridas raíz y contratos kármicos',
      'Reprogramación del principal aspecto kármico',
      'Reprogramación del eje de propósito superior',
      'Rutina personalizada de respiración, afirmaciones y mantras',
      'Mini-protocolo de reprogramación para uso personal'
    ]
  },
  {
    name: 'Transformación Profunda',
    slug: 'transformacion-profunda',
    productType: ProductType.COACHING,
    creditQuantity: 7,
    validityDays: null,
    price: 444,
    currency: 'usd',
    displayOrder: 2,
    tagline: 'Transformación profunda y duradera',
    description: '7 sesiones (10.5 horas total)',
    featured: true,
    features: [
      'Todo lo del Nivel I',
      'Profundización de la interpretación cuántica',
      '2 sesiones adicionales de reprogramación de aspectos kármicos',
      '2 sesiones de activación de dones, misión y propósito',
      'Reprogramación de heridas de la infancia',
      'Meditación personalizada de activación del Destino Superior',
      'Integración práctica de los nuevos códigos de conciencia'
    ]
  },
  {
    name: 'Maestría 360',
    slug: 'maestria-360',
    productType: ProductType.COACHING,
    creditQuantity: 13,
    validityDays: null,
    price: 667,
    currency: 'usd',
    displayOrder: 3,
    tagline: 'Transformación total',
    description: '13 sesiones (19.5 horas total)',
    featured: false,
    features: [
      'Todo lo del Nivel II',
      'Reprogramación completa de las 12 casas astrológicas',
      'Reprogramación de planetas regentes y aspectos clave',
      'Meditaciones específicas para cada área de vida',
      'Trabajo profundo de activación del ADN espiritual',
      'Entrenamiento en técnicas de Reprogramación Cuántica',
      'Acompañamiento en el uso consciente de los Dones Potenciales',
      'Integración final del nuevo diseño de vida'
    ]
  }
]

async function seedPackages(packages) {
  for (const pkg of packages) {
    await prisma.productPackage.upsert({
      where: { slug: pkg.slug },
      update: {
        name: pkg.name,
        productType: pkg.productType,
        creditQuantity: pkg.creditQuantity,
        validityDays: pkg.validityDays,
        price: pkg.price,
        currency: pkg.currency,
        displayOrder: pkg.displayOrder,
        tagline: pkg.tagline,
        description: pkg.description,
        featured: pkg.featured,
        features: pkg.features,
        active: true
      },
      create: pkg
    })
  }
}

async function seedAdmin() {
  const email = (process.env.ADMIN_SEED_EMAIL || 'admin@ferquintero.com').toLowerCase()
  const password = process.env.ADMIN_SEED_PASSWORD || 'admin'
  const legacyEmail = 'admin@astrohacking.local'

  const passwordHash = await bcrypt.hash(password, 12)

  // Migrate previous default admin email if present
  const legacy = await prisma.user.findUnique({ where: { email: legacyEmail } })
  if (legacy && legacy.email !== email) {
    const taken = await prisma.user.findUnique({ where: { email } })
    if (!taken) {
      await prisma.user.update({
        where: { id: legacy.id },
        data: {
          email,
          role: 'ADMIN',
          passwordHash,
          disabledAt: null,
          name: legacy.name || 'Fernando Quintero'
        }
      })
      console.log(`Admin migrated: ${legacyEmail} → ${email}`)
      return
    }
  }

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      passwordHash,
      disabledAt: null
    },
    create: {
      email,
      name: 'Fernando Quintero',
      role: 'ADMIN',
      passwordHash,
      emailVerified: new Date()
    }
  })

  console.log(`Admin ready: ${admin.email}`)
}

const demoMembers = [
  {
    email: 'ana.demo@astrohacking.local',
    name: 'Ana Morales',
    packageSlug: 'paquete-4-sesiones',
    demoPrice: 180,
    creditsUsed: 1
  },
  {
    email: 'luis.demo@astrohacking.local',
    name: 'Luis Hernández',
    packageSlug: 'paquete-12-sesiones',
    demoPrice: 420,
    creditsUsed: 3
  },
  {
    email: 'maria.demo@astrohacking.local',
    name: 'María Solís',
    packageSlug: 'sesion-individual',
    demoPrice: 55,
    creditsUsed: 0
  }
]

async function seedDemoMembers() {
  const passwordHash = await bcrypt.hash('DemoUser!123', 12)

  for (const demo of demoMembers) {
    const pkg = await prisma.productPackage.findUnique({
      where: { slug: demo.packageSlug }
    })

    if (!pkg) {
      console.warn(`Package not found: ${demo.packageSlug}`)
      continue
    }

    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: {
        name: demo.name,
        passwordHash,
        role: 'USER',
        disabledAt: null,
        emailVerified: new Date()
      },
      create: {
        email: demo.email,
        name: demo.name,
        passwordHash,
        role: 'USER',
        emailVerified: new Date(),
        timezone: 'America/Mexico_City'
      }
    })

    const checkoutId = `demo_cs_${demo.packageSlug}_${user.id.slice(-8)}`
    const purchasedAt = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    const validityDays = pkg.validityDays || 60
    const expiresAt = new Date(purchasedAt.getTime() + validityDays * 24 * 60 * 60 * 1000)
    const remaining = Math.max(0, pkg.creditQuantity - demo.creditsUsed)

    const purchase = await prisma.purchase.upsert({
      where: { stripeCheckoutSessionId: checkoutId },
      update: {
        status: 'PAID',
        amountPaid: demo.demoPrice,
        currency: pkg.currency || 'usd',
        purchasedAt,
        creditsGranted: pkg.creditQuantity,
        validityDays,
        packageName: pkg.name,
        productType: 'MASTERMIND'
      },
      create: {
        userId: user.id,
        packageId: pkg.id,
        stripeCheckoutSessionId: checkoutId,
        stripePaymentIntentId: `demo_pi_${user.id.slice(-8)}`,
        amountPaid: demo.demoPrice,
        currency: pkg.currency || 'usd',
        status: 'PAID',
        purchasedAt,
        creditsGranted: pkg.creditQuantity,
        validityDays,
        packageName: pkg.name,
        productType: 'MASTERMIND'
      }
    })

    let grant = await prisma.creditGrant.findUnique({
      where: { purchaseId: purchase.id }
    })

    if (!grant) {
      grant = await prisma.creditGrant.create({
        data: {
          userId: user.id,
          purchaseId: purchase.id,
          creditsGranted: pkg.creditQuantity,
          creditsRemaining: remaining,
          startsAt: purchasedAt,
          expiresAt,
          status: remaining === 0 ? 'EXHAUSTED' : 'ACTIVE'
        }
      })

      await prisma.creditTransaction.create({
        data: {
          userId: user.id,
          creditGrantId: grant.id,
          amount: pkg.creditQuantity,
          type: 'PURCHASE',
          reason: `Demo purchase: ${pkg.name}`,
          createdBy: user.id,
          createdAt: purchasedAt
        }
      })

      if (demo.creditsUsed > 0) {
        await prisma.creditTransaction.create({
          data: {
            userId: user.id,
            creditGrantId: grant.id,
            amount: -demo.creditsUsed,
            type: 'CONSUMPTION',
            reason: 'Demo: créditos usados en sesiones previas',
            createdBy: user.id,
            createdAt: new Date(purchasedAt.getTime() + 3 * 24 * 60 * 60 * 1000)
          }
        })
      }
    } else {
      grant = await prisma.creditGrant.update({
        where: { id: grant.id },
        data: {
          creditsGranted: pkg.creditQuantity,
          creditsRemaining: remaining,
          expiresAt,
          status: remaining === 0 ? 'EXHAUSTED' : 'ACTIVE'
        }
      })
    }

    console.log(
      `Demo member: ${user.email} → ${pkg.name} (${remaining}/${pkg.creditQuantity} créditos)`
    )
  }
}

async function main() {
  await seedPackages(mastermindPackages)
  await seedPackages(coachingPackages)
  await seedAdmin()
  await seedDemoMembers()
  console.log('Seed complete.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
