import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { DEFAULT_TIMEZONE } from '@/lib/timezone'
import { hasActiveUnlimitedAccess } from '@/lib/credits'

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
        hasUnlimitedAccess: true,
        unlimitedAccessUntil: true,
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
          // Soonest-expiring first — the one that's actually consumed next.
          orderBy: { expiresAt: 'asc' },
          select: {
            creditsRemaining: true,
            startsAt: true,
            purchase: {
              select: {
                packageName: true,
                package: { select: { name: true } }
              }
            }
          }
        }
      }
    })
  ])

  return NextResponse.json({
    total,
    page,
    pageSize,
    users: users.map((user) => {
      const [primaryGrant, ...restGrants] = user.creditGrants

      return {
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
        availableCredits: user.creditGrants.reduce((s, g) => s + g.creditsRemaining, 0),
        unlimitedAccess: hasActiveUnlimitedAccess(user),
        activePackage: primaryGrant
          ? {
              name:
                primaryGrant.purchase?.packageName ||
                primaryGrant.purchase?.package?.name ||
                'Ajuste manual',
              acquiredAt: primaryGrant.startsAt,
              extraCount: restGrants.length
            }
          : null
      }
    })
  })
}

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  // Intentionally not `.email()` — admins create accounts with a phone
  // number as the login username; the member later changes it to a real
  // email themselves from Mi cuenta (that flow already validates format).
  username: z.string().trim().min(6).max(190),
  password: z.string().min(8).max(128),
  role: z.enum(['USER', 'ADMIN', 'FACILITATOR']).optional()
})

export async function POST(request) {
  const { error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const body = await request.json()
  const parsed = createUserSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT', details: parsed.error.flatten() }, { status: 400 })
  }

  const username = parsed.data.username.toLowerCase()
  const existing = await prisma.user.findUnique({ where: { email: username } })
  if (existing) {
    return NextResponse.json({ error: 'USERNAME_IN_USE' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: username,
      passwordHash,
      role: parsed.data.role || 'USER',
      timezone: DEFAULT_TIMEZONE
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  })

  return NextResponse.json({ user }, { status: 201 })
}
