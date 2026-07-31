import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Public package catalog for marketing pages.
 * Query: ?type=MASTERMIND|COACHING (optional)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const where = {
      active: true,
      ...(type === 'MASTERMIND' || type === 'COACHING'
        ? { productType: type }
        : {})
    }

    const packages = await prisma.productPackage.findMany({
      where,
      orderBy: [{ productType: 'asc' }, { displayOrder: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        productType: true,
        creditQuantity: true,
        validityDays: true,
        price: true,
        currency: true,
        tagline: true,
        description: true,
        features: true,
        featured: true,
        displayOrder: true
        // stripePriceId intentionally omitted from public response
      }
    })

    return NextResponse.json({
      packages: packages.map((pkg) => ({
        ...pkg,
        price: pkg.price.toString()
      }))
    })
  } catch (error) {
    console.error('[packages]', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
