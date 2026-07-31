import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { requireUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

const schema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(8).max(128)
})

export async function POST(request) {
  const { session, error } = await requireUser()
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, passwordHash: true }
  })

  if (!user) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  if (!user.passwordHash) {
    return NextResponse.json({ error: 'NO_PASSWORD_ACCOUNT' }, { status: 400 })
  }

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash
  )
  if (!valid) {
    return NextResponse.json(
      { error: 'INVALID_CURRENT_PASSWORD' },
      { status: 400 }
    )
  }

  if (parsed.data.currentPassword === parsed.data.newPassword) {
    return NextResponse.json({ error: 'PASSWORD_UNCHANGED' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12)
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash }
  })

  return NextResponse.json({ ok: true })
}
