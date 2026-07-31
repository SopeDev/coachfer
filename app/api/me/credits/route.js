import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/session'
import { getUserCreditSummary } from '@/lib/credits'
import prisma from '@/lib/prisma'
import { DEFAULT_TIMEZONE } from '@/lib/timezone'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { session, error } = await requireUser()
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  const [summary, user] = await Promise.all([
    getUserCreditSummary(session.user.id),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { timezone: true }
    })
  ])

  const viewerTimezone = user?.timezone || DEFAULT_TIMEZONE

  return NextResponse.json({
    viewerTimezone,
    availableCredits: summary.availableCredits,
    activeGrantCount: summary.activeGrantCount,
    grants: summary.grants.map((g) => ({
      id: g.id,
      creditsGranted: g.creditsGranted,
      creditsRemaining: g.creditsRemaining,
      startsAt: g.startsAt,
      createdAt: g.createdAt,
      expiresAt: g.expiresAt,
      status: g.status
    }))
  })
}
