import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET(request) {
  const { error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const role = searchParams.get('role')
  const page = Math.max(1, Number(searchParams.get('page') || 1))
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') || 20)))
  const skip = (page - 1) * pageSize

  const where = {
    AND: [
      q
        ? {
            OR: [
              { email: { contains: q, mode: 'insensitive' } },
              { name: { contains: q, mode: 'insensitive' } }
            ]
          }
        : {},
      role && ['USER', 'ADMIN', 'FACILITATOR'].includes(role) ? { role } : {}
    ]
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        timezone: true,
        disabledAt: true,
        createdAt: true,
        _count: {
          select: {
            purchases: true,
            creditGrants: true,
            bookings: true
          }
        },
        creditGrants: {
          where: {
            status: 'ACTIVE',
            creditsRemaining: { gt: 0 },
            expiresAt: { gt: new Date() }
          },
          select: { creditsRemaining: true }
        }
      }
    })
  ])

  return NextResponse.json({
    total,
    page,
    pageSize,
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      timezone: user.timezone,
      disabledAt: user.disabledAt,
      createdAt: user.createdAt,
      purchasesCount: user._count.purchases,
      grantsCount: user._count.creditGrants,
      bookingsCount: user._count.bookings,
      availableCredits: user.creditGrants.reduce((s, g) => s + g.creditsRemaining, 0)
    }))
  })
}
