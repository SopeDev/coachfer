import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET(request) {
  const { error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const page = Math.max(1, Number(searchParams.get('page') || 1))
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') || 20)))
  const skip = (page - 1) * pageSize

  const where =
    status && ['PENDING', 'PAID', 'FAILED', 'REFUNDED'].includes(status)
      ? { status }
      : {}

  const [total, purchases] = await Promise.all([
    prisma.purchase.count({ where }),
    prisma.purchase.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      include: {
        user: { select: { id: true, name: true, email: true } },
        package: { select: { id: true, name: true, slug: true, productType: true } }
      }
    })
  ])

  return NextResponse.json({
    total,
    page,
    pageSize,
    purchases: purchases.map((p) => ({
      ...p,
      amountPaid: p.amountPaid?.toString() ?? null
    }))
  })
}
