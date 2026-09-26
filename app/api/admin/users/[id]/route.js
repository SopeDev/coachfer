import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { getUserCreditSummary } from '@/lib/credits'

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  // Not `.email()` — admins may set this to a phone number too.
  username: z.string().trim().min(6).max(190).optional(),
  role: z.enum(['USER', 'ADMIN', 'FACILITATOR']).optional(),
  timezone: z.string().trim().min(1).max(80).optional(),
  adminNotes: z.string().max(5000).nullable().optional(),
  disabled: z.boolean().optional(),
  hasUnlimitedAccess: z.boolean().optional(),
  unlimitedAccessUntil: z.string().datetime().nullable().optional(),
  unlimitedAccessReason: z.string().max(500).nullable().optional()
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
      hasUnlimitedAccess: true,
      unlimitedAccessUntil: true,
      unlimitedAccessReason: true,
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

  if (parsed.data.username !== undefined) {
    const username = parsed.data.username.toLowerCase()
    if (username !== existing.email) {
      const taken = await prisma.user.findUnique({ where: { email: username } })
      if (taken) {
        return NextResponse.json({ error: 'USERNAME_IN_USE' }, { status: 409 })
      }
    }
  }

  const data = {}
  if (parsed.data.name !== undefined) data.name = parsed.data.name
  if (parsed.data.username !== undefined) data.email = parsed.data.username.toLowerCase()
  if (parsed.data.role !== undefined) data.role = parsed.data.role
  if (parsed.data.timezone !== undefined) data.timezone = parsed.data.timezone
  if (parsed.data.adminNotes !== undefined) data.adminNotes = parsed.data.adminNotes
  if (parsed.data.disabled === true) data.disabledAt = new Date()
  if (parsed.data.disabled === false) data.disabledAt = null
  if (parsed.data.hasUnlimitedAccess !== undefined) {
    data.hasUnlimitedAccess = parsed.data.hasUnlimitedAccess
  }
  if (parsed.data.unlimitedAccessUntil !== undefined) {
    data.unlimitedAccessUntil = parsed.data.unlimitedAccessUntil
      ? new Date(parsed.data.unlimitedAccessUntil)
      : null
  }
  if (parsed.data.unlimitedAccessReason !== undefined) {
    data.unlimitedAccessReason = parsed.data.unlimitedAccessReason
  }

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
      hasUnlimitedAccess: true,
      unlimitedAccessUntil: true,
      unlimitedAccessReason: true,
      updatedAt: true
    }
  })

  return NextResponse.json({ user })
}

/**
 * Permanently delete a user and all related records:
 * credit transactions, bookings, session access, credit grants (packages),
 * purchases, auth sessions/accounts, and password reset tokens.
 * Shared ProductPackage / LiveSession rows are kept.
 */
export async function DELETE(_request, { params }) {
  const { session, error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const userId = params.id
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true }
  })

  if (!existing) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  if (existing.id === session.user.id) {
    return NextResponse.json({ error: 'CANNOT_DELETE_SELF' }, { status: 400 })
  }

  await prisma.$transaction(async (tx) => {
    // Order matters: sibling FKs use Restrict (booking ↔ tx, grant ↔ booking, purchase ↔ grant)
    await tx.creditTransaction.deleteMany({ where: { userId } })
    await tx.booking.deleteMany({ where: { userId } })
    await tx.sessionAccess.deleteMany({ where: { userId } })
    await tx.creditGrant.deleteMany({ where: { userId } })
    await tx.purchase.deleteMany({ where: { userId } })
    await tx.session.deleteMany({ where: { userId } })
    await tx.account.deleteMany({ where: { userId } })
    await tx.passwordResetToken.deleteMany({ where: { userId } })
    await tx.user.delete({ where: { id: userId } })
  })

  return NextResponse.json({ ok: true, deletedUserId: userId })
}
