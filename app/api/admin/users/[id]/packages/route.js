import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/session'
import { adminAssignPackage } from '@/lib/credits'

const assignSchema = z.object({
  packageId: z.string().min(1),
  creditsUsed: z.number().int().min(0).optional(),
  assignedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional()
})

const ERROR_STATUS = {
  USER_NOT_FOUND: 404,
  PACKAGE_NOT_FOUND: 404,
  INVALID_CREDITS_USED: 400
}

export async function POST(request, { params }) {
  const { session, error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const body = await request.json()
  const parsed = assignSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT', details: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const { purchase, grant } = await adminAssignPackage({
      userId: params.id,
      packageId: parsed.data.packageId,
      creditsUsed: parsed.data.creditsUsed ?? 0,
      assignedAt: parsed.data.assignedAt ? new Date(parsed.data.assignedAt) : undefined,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
      adminUserId: session.user.id
    })

    return NextResponse.json(
      {
        purchase: { ...purchase, amountPaid: purchase.amountPaid?.toString() ?? null },
        grant
      },
      { status: 201 }
    )
  } catch (err) {
    const status = ERROR_STATUS[err.message] || 500
    return NextResponse.json(
      { error: status === 500 ? 'SERVER_ERROR' : err.message },
      { status }
    )
  }
}
