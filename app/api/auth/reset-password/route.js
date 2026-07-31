import { NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const schema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(128)
})

export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
    }

    const tokenHash = crypto
      .createHash('sha256')
      .update(parsed.data.token)
      .digest('hex')

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    })

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt < new Date() ||
      resetToken.user.disabledAt
    ) {
      return NextResponse.json({ error: 'INVALID_OR_EXPIRED_TOKEN' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash }
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() }
      }),
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
          id: { not: resetToken.id }
        }
      })
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[reset-password]', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
