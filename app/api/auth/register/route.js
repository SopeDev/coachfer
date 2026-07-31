import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/mail'
import { DEFAULT_TIMEZONE } from '@/lib/timezone'

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128)
})

export async function POST(request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase()
    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
      return NextResponse.json({ error: 'EMAIL_IN_USE' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
        role: 'USER',
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

    sendWelcomeEmail({ to: user.email, name: user.name }).catch((err) => {
      console.error('[register] welcome email failed', err)
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('[register]', error)
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 })
  }
}
