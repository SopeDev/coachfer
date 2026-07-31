import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET(request) {
  const { error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  const packages = await prisma.productPackage.findMany({
    where: type === 'COACHING' || type === 'MASTERMIND' ? { productType: type } : undefined,
    orderBy: [{ productType: 'asc' }, { displayOrder: 'asc' }]
  })

  return NextResponse.json({
    packages: packages.map((pkg) => ({
      ...pkg,
      price: pkg.price.toString()
    }))
  })
}

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  tagline: z.string().max(300).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  price: z.number().nonnegative().optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  creditQuantity: z.number().int().positive().optional(),
  validityDays: z.number().int().positive().nullable().optional(),
  stripeProductId: z.string().nullable().optional(),
  stripePriceId: z.string().nullable().optional()
})

export async function PATCH(request) {
  const { error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const body = await request.json()
  const id = body?.id
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'ID_REQUIRED' }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT', details: parsed.error.flatten() }, { status: 400 })
  }

  const data = { ...parsed.data }
  delete data.id

  try {
    const pkg = await prisma.productPackage.update({
      where: { id },
      data
    })

    return NextResponse.json({
      package: { ...pkg, price: pkg.price.toString() }
    })
  } catch {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }
}
