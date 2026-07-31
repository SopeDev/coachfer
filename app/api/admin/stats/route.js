import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const now = new Date()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    usersTotal,
    usersNewWeek,
    usersDisabled,
    packagesActive,
    purchasesPaid,
    purchasesPending,
    creditGrantsActive,
    availableCreditsAgg,
    sessionsUpcoming
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count({ where: { disabledAt: { not: null } } }),
    prisma.productPackage.count({ where: { active: true } }),
    prisma.purchase.count({ where: { status: 'PAID' } }),
    prisma.purchase.count({ where: { status: 'PENDING' } }),
    prisma.creditGrant.count({
      where: {
        status: 'ACTIVE',
        creditsRemaining: { gt: 0 },
        expiresAt: { gt: now }
      }
    }),
    prisma.creditGrant.aggregate({
      where: {
        status: 'ACTIVE',
        creditsRemaining: { gt: 0 },
        expiresAt: { gt: now }
      },
      _sum: { creditsRemaining: true }
    }),
    prisma.liveSession.count({
      where: {
        status: { in: ['SCHEDULED', 'LIVE'] },
        startsAt: { gte: now }
      }
    })
  ])

  return NextResponse.json({
    stats: {
      usersTotal,
      usersNewWeek,
      usersDisabled,
      packagesActive,
      purchasesPaid,
      purchasesPending,
      creditGrantsActive,
      creditsAvailable: availableCreditsAgg._sum.creditsRemaining || 0,
      sessionsUpcoming
    }
  })
}
