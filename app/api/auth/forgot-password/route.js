import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/mail'

const schema = z.object({
  email: z.string().trim().email()
})

const RESET_TTL_MS = 60 * 60 * 1000

export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase()
    const user = await prisma.user.findUnique({ where: { email } })

    // Always return OK to avoid email enumeration
    if (!user || user.disabledAt) {
      return NextResponse.json({ ok: true })
    }

    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TTL_MS)
      }
    })

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/auth/reset-password?token=${rawToken}`

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[forgot-password]', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
