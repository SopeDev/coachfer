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
      if (
        expiresAt !== undefined &&
        (!(expiresAt instanceof Date) || Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date())
      ) {
        throw new Error('INVALID_EXPIRATION')
      }

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

/**
 * True if the user currently has active scholarship / unlimited access
 * (bypasses the credit system for booking). `unlimitedAccessUntil` of null
 * means no expiration was set.
 */
export const hasActiveUnlimitedAccess = (user, now = new Date()) =>
  Boolean(
    user?.hasUnlimitedAccess &&
      (!user.unlimitedAccessUntil || new Date(user.unlimitedAccessUntil) > now)
  )

export const getUserCreditSummary = async (userId) => {
  const [grants, user] = await Promise.all([
    prisma.creditGrant.findMany({
      where: { userId },
      orderBy: { expiresAt: 'asc' },
      include: {
        purchase: {
          select: {
            packageName: true,
            package: { select: { name: true } }
          }
        }
      }
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        hasUnlimitedAccess: true,
        unlimitedAccessUntil: true,
        unlimitedAccessReason: true
      }
    })
  ])

  const now = new Date()
  const active = grants.filter(
    (g) => g.status === 'ACTIVE' && g.creditsRemaining > 0 && g.expiresAt > now
  )

  return {
    grants,
    availableCredits: active.reduce((sum, g) => sum + g.creditsRemaining, 0),
    activeGrantCount: active.length,
    unlimitedAccess: hasActiveUnlimitedAccess(user, now),
    unlimitedAccessUntil: user?.unlimitedAccessUntil ?? null,
    unlimitedAccessReason: user?.unlimitedAccessReason ?? null
  }
}

/**
 * Assign a real ProductPackage to a user (admin backfill/manual entry —
 * e.g. migrating a user from before Stripe, or a WhatsApp/bank-transfer sale).
 * Creates a paid Purchase + its CreditGrant together, with creditsGranted
 * fixed to the package's own creditQuantity. `creditsUsed` lets the admin
 * record credits already consumed elsewhere (no matching bookings exist).
 */
export const adminAssignPackage = async ({
  userId,
  packageId,
  creditsUsed = 0,
  assignedAt,
  expiresAt,
  adminUserId
}) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('USER_NOT_FOUND')

    const pkg = await tx.productPackage.findUnique({ where: { id: packageId } })
    if (!pkg) throw new Error('PACKAGE_NOT_FOUND')

    const creditsGranted = pkg.creditQuantity
    if (
      !Number.isInteger(creditsUsed) ||
      creditsUsed < 0 ||
      creditsUsed > creditsGranted
    ) {
      throw new Error('INVALID_CREDITS_USED')
    }

    const grantStartsAt =
      assignedAt instanceof Date && !Number.isNaN(assignedAt.getTime())
        ? assignedAt
        : new Date()

    let grantExpires
    if (expiresAt instanceof Date && !Number.isNaN(expiresAt.getTime())) {
      grantExpires = expiresAt
    } else if (pkg.validityDays) {
      grantExpires = new Date(
        grantStartsAt.getTime() + pkg.validityDays * 24 * 60 * 60 * 1000
      )
    } else {
      grantExpires = new Date(
        grantStartsAt.getTime() + DEFAULT_GRANT_DAYS * 24 * 60 * 60 * 1000
      )
    }

    const creditsRemaining = creditsGranted - creditsUsed

    const purchase = await tx.purchase.create({
      data: {
        userId,
        packageId,
        status: 'PAID',
        purchasedAt: grantStartsAt,
        amountPaid: pkg.price,
        currency: pkg.currency,
        creditsGranted,
        validityDays: pkg.validityDays,
        packageName: pkg.name,
        productType: pkg.productType
      }
    })

    const grant = await tx.creditGrant.create({
      data: {
        userId,
        purchaseId: purchase.id,
        creditsGranted,
        creditsRemaining,
        startsAt: grantStartsAt,
        expiresAt: grantExpires,
        status: creditsRemaining > 0 ? 'ACTIVE' : 'EXHAUSTED'
      }
    })

    await tx.creditTransaction.create({
      data: {
        userId,
        creditGrantId: grant.id,
        amount: creditsGranted,
        type: 'PURCHASE',
        reason: `Paquete asignado manualmente: ${pkg.name}`,
        createdBy: adminUserId
      }
    })

    if (creditsUsed > 0) {
      await tx.creditTransaction.create({
        data: {
          userId,
          creditGrantId: grant.id,
          amount: -creditsUsed,
          type: 'CONSUMPTION',
          reason: 'Créditos ya utilizados previamente (registro manual)',
          createdBy: adminUserId
        }
      })
    }

    return { purchase, grant }
  })
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

/**
 * Undo a credit grant an admin created by mistake (a manual adjustment or a
 * package assignment) — deletes its CreditTransaction audit rows and, if it
 * came from a package assignment, its linked Purchase too. Refuses if a real
 * booking already consumed from it: cancel that booking first (through the
 * normal flow, which releases the credit properly) before deleting the grant.
 */
export const adminDeleteGrant = async ({ grantId, userId }) => {
  return prisma.$transaction(async (tx) => {
    const grant = await tx.creditGrant.findUnique({ where: { id: grantId } })
    if (!grant || (userId && grant.userId !== userId)) {
      throw new Error('GRANT_NOT_FOUND')
    }

    const bookingCount = await tx.booking.count({ where: { creditGrantId: grantId } })
    if (bookingCount > 0) {
      throw new Error('GRANT_IN_USE')
    }

    await tx.creditTransaction.deleteMany({ where: { creditGrantId: grantId } })
    await tx.creditGrant.delete({ where: { id: grantId } })

    if (grant.purchaseId) {
      await tx.purchase.delete({ where: { id: grant.purchaseId } })
    }

    return { deletedGrantId: grantId, deletedPurchaseId: grant.purchaseId || null }
  })
}
