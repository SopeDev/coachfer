import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/session'
import { DEFAULT_TIMEZONE } from '@/lib/timezone'

export const dynamic = 'force-dynamic'

const isValidTimeZone = (tz) => {
  try {
    Intl.DateTimeFormat('en-US', { timeZone: tz }).format(new Date())
    return true
  } catch {
    return false
  }
}

const profileSchema = z.object({
  email: z.string().trim().email().max(190).optional(),
  timezone: z
    .string()
    .trim()
    .min(3)
    .max(64)
    .refine(isValidTimeZone, 'INVALID_TIMEZONE')
    .optional(),
  currentPassword: z.string().min(1).max(128).optional()
})

const serializeAccount = (user) => ({
  id: user.id,
  name: user.name || '',
  email: user.email,
  timezone: user.timezone || DEFAULT_TIMEZONE,
  hasPassword: Boolean(user.passwordHash),
  createdAt: user.createdAt
})

export async function GET() {
  const { session, error } = await requireUser()
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      timezone: true,
      passwordHash: true,
      createdAt: true
    }
  })

  if (!user) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  return NextResponse.json({ account: serializeAccount(user) })
}

export async function PATCH(request) {
  const { session, error } = await requireUser()
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  const body = await request.json()
  const parsed = profileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      timezone: true,
      passwordHash: true,
      createdAt: true
    }
  })

  if (!user) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  const data = {}
  const { email, timezone, currentPassword } = parsed.data

  if (timezone !== undefined) {
    data.timezone = timezone
  }

  if (email !== undefined) {
    const nextEmail = email.toLowerCase()
    if (nextEmail !== user.email) {
      if (!user.passwordHash) {
        return NextResponse.json(
          { error: 'PASSWORD_REQUIRED_FOR_EMAIL' },
          { status: 400 }
        )
      }
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'CURRENT_PASSWORD_REQUIRED' },
          { status: 400 }
        )
      }
      const valid = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!valid) {
        return NextResponse.json(
          { error: 'INVALID_CURRENT_PASSWORD' },
          { status: 400 }
        )
      }

      const taken = await prisma.user.findUnique({
        where: { email: nextEmail },
        select: { id: true }
      })
      if (taken && taken.id !== user.id) {
        return NextResponse.json({ error: 'EMAIL_IN_USE' }, { status: 409 })
      }

      data.email = nextEmail
      data.emailVerified = null
    }
  }

  if (!Object.keys(data).length) {
    return NextResponse.json({ account: serializeAccount(user) })
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      timezone: true,
      passwordHash: true,
      createdAt: true
    }
  })

  return NextResponse.json({ account: serializeAccount(updated) })
}
