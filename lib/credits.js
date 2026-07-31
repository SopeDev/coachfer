import prisma from './prisma'

const DEFAULT_GRANT_DAYS = 90

/**
 * Admin credit adjustment with audit trail.
 * Positive amount → add credits (new grant or top-up existing ACTIVE grant).
 * Negative amount → consume from earliest-expiring ACTIVE grants (FIFO).
 */
export const adminAdjustCredits = async ({
  userId,
  amount,
  reason,
  adminUserId,
  expiresAt
}) => {
  if (!Number.isInteger(amount) || amount === 0) {
    throw new Error('INVALID_AMOUNT')
  }

  if (!reason?.trim()) {
    throw new Error('REASON_REQUIRED')
  }

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('USER_NOT_FOUND')

    if (amount > 0) {
      const grantExpires =
        expiresAt instanceof Date
          ? expiresAt
          : new Date(Date.now() + DEFAULT_GRANT_DAYS * 24 * 60 * 60 * 1000)

      const grant = await tx.creditGrant.create({
        data: {
          userId,
          creditsGranted: amount,
          creditsRemaining: amount,
          expiresAt: grantExpires,
          status: 'ACTIVE'
        }
      })

      await tx.creditTransaction.create({
        data: {
          userId,
          creditGrantId: grant.id,
          amount,
          type: 'ADMIN_ADJUSTMENT',
          reason: reason.trim(),
          createdBy: adminUserId
        }
      })

      return { grant, direction: 'credit' }
    }

    let remaining = Math.abs(amount)
    const grants = await tx.creditGrant.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        creditsRemaining: { gt: 0 },
        expiresAt: { gt: new Date() }
      },
      orderBy: { expiresAt: 'asc' }
    })

    const totalAvailable = grants.reduce((sum, g) => sum + g.creditsRemaining, 0)
    if (totalAvailable < remaining) {
      throw new Error('INSUFFICIENT_CREDITS')
    }

    const touched = []

    for (const grant of grants) {
      if (remaining <= 0) break
      const take = Math.min(grant.creditsRemaining, remaining)
      const nextRemaining = grant.creditsRemaining - take
      const nextStatus = nextRemaining === 0 ? 'EXHAUSTED' : 'ACTIVE'

      const updated = await tx.creditGrant.update({
        where: { id: grant.id },
        data: {
          creditsRemaining: nextRemaining,
          status: nextStatus
        }
      })

      await tx.creditTransaction.create({
        data: {
          userId,
          creditGrantId: grant.id,
          amount: -take,
          type: 'ADMIN_ADJUSTMENT',
          reason: reason.trim(),
          createdBy: adminUserId
        }
      })

      touched.push(updated)
      remaining -= take
    }

    return { grants: touched, direction: 'debit' }
  })
}

export const getUserCreditSummary = async (userId) => {
  const grants = await prisma.creditGrant.findMany({
    where: { userId },
    orderBy: { expiresAt: 'asc' }
  })

  const now = new Date()
  const active = grants.filter(
    (g) => g.status === 'ACTIVE' && g.creditsRemaining > 0 && g.expiresAt > now
  )

  return {
    grants,
    availableCredits: active.reduce((sum, g) => sum + g.creditsRemaining, 0),
    activeGrantCount: active.length
  }
}

/**
 * Consume 1 credit (FIFO) inside an existing Prisma transaction.
 * Grant must still be valid at sessionStartsAt.
 * Caller should write the RESERVATION CreditTransaction after creating the Booking.
 */
export const consumeCreditForBooking = async (tx, { userId, sessionStartsAt }) => {
  const grant = await tx.creditGrant.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      creditsRemaining: { gt: 0 },
      expiresAt: { gt: sessionStartsAt }
    },
    orderBy: { expiresAt: 'asc' }
  })

  if (!grant) {
    throw new Error('INSUFFICIENT_CREDITS')
  }

  const nextRemaining = grant.creditsRemaining - 1
  const updated = await tx.creditGrant.update({
    where: { id: grant.id },
    data: {
      creditsRemaining: nextRemaining,
      status: nextRemaining === 0 ? 'EXHAUSTED' : 'ACTIVE'
    }
  })

  return updated
}

/**
 * Release 1 credit back to the grant used by a booking.
 */
export const releaseCreditForBooking = async (
  tx,
  { userId, creditGrantId, bookingId, reason }
) => {
  const grant = await tx.creditGrant.findUnique({ where: { id: creditGrantId } })
  if (!grant) throw new Error('GRANT_NOT_FOUND')

  const nextRemaining = grant.creditsRemaining + 1
  const updated = await tx.creditGrant.update({
    where: { id: grant.id },
    data: {
      creditsRemaining: nextRemaining,
      status:
        grant.status === 'REVOKED' || grant.status === 'EXPIRED'
          ? grant.status
          : grant.expiresAt > new Date()
            ? 'ACTIVE'
            : 'EXPIRED'
    }
  })

  await tx.creditTransaction.create({
    data: {
      userId,
      creditGrantId: grant.id,
      bookingId: bookingId || null,
      amount: 1,
      type: 'RELEASE',
      reason: reason || 'Cancelación de reserva',
      createdBy: userId
    }
  })

  return updated
}
