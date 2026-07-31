import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { getUserCreditSummary } from '@/lib/credits'

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  role: z.enum(['USER', 'ADMIN', 'FACILITATOR']).optional(),
  timezone: z.string().trim().min(1).max(80).optional(),
  adminNotes: z.string().max(5000).nullable().optional(),
  disabled: z.boolean().optional()
})

export async function GET(_request, { params }) {
  const { error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      timezone: true,
      disabledAt: true,
      adminNotes: true,
      createdAt: true,
      updatedAt: true,
      stripeCustomerId: true,
      purchases: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          package: {
            select: { name: true, slug: true, productType: true }
          }
        }
      },
      creditTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: {
          creditGrant: {
            select: { id: true, expiresAt: true, status: true }
          }
        }
      },
      bookings: {
        orderBy: { bookedAt: 'desc' },
        take: 20,
        include: {
          liveSession: {
            select: { id: true, title: true, startsAt: true, status: true }
          }
        }
      }
    }
  })

  if (!user) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  const credits = await getUserCreditSummary(user.id)

  return NextResponse.json({
    user: {
      ...user,
      purchases: user.purchases.map((p) => ({
        ...p,
        amountPaid: p.amountPaid?.toString() ?? null
      })),
      availableCredits: credits.availableCredits,
      creditGrants: credits.grants
    }
  })
}

export async function PATCH(request, { params }) {
  const { session, error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const body = await request.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { id: params.id } })
  if (!existing) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  // Prevent demoting yourself
  if (
    existing.id === session.user.id &&
    parsed.data.role &&
    parsed.data.role !== 'ADMIN'
  ) {
    return NextResponse.json({ error: 'CANNOT_DEMOTE_SELF' }, { status: 400 })
  }

  if (existing.id === session.user.id && parsed.data.disabled === true) {
    return NextResponse.json({ error: 'CANNOT_DISABLE_SELF' }, { status: 400 })
  }

  const data = {}
  if (parsed.data.name !== undefined) data.name = parsed.data.name
  if (parsed.data.role !== undefined) data.role = parsed.data.role
  if (parsed.data.timezone !== undefined) data.timezone = parsed.data.timezone
  if (parsed.data.adminNotes !== undefined) data.adminNotes = parsed.data.adminNotes
  if (parsed.data.disabled === true) data.disabledAt = new Date()
  if (parsed.data.disabled === false) data.disabledAt = null

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      timezone: true,
      disabledAt: true,
      adminNotes: true,
      updatedAt: true
    }
  })

  return NextResponse.json({ user })
}
