import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/session'
import { adminAdjustCredits, getUserCreditSummary } from '@/lib/credits'

const schema = z.object({
  amount: z.number().int().refine((n) => n !== 0, 'Amount cannot be zero'),
  reason: z.string().trim().min(3).max(500),
  expiresAt: z.string().datetime().optional()
})

export async function POST(request, { params }) {
  const { session, error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT', details: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const result = await adminAdjustCredits({
      userId: params.id,
      amount: parsed.data.amount,
      reason: parsed.data.reason,
      adminUserId: session.user.id,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined
    })

    const summary = await getUserCreditSummary(params.id)

    return NextResponse.json({
      ok: true,
      result,
      availableCredits: summary.availableCredits,
      grants: summary.grants
    })
  } catch (err) {
    const message = err?.message || 'SERVER_ERROR'
    const status =
      message === 'USER_NOT_FOUND'
        ? 404
        : message === 'INSUFFICIENT_CREDITS' ||
            message === 'INVALID_AMOUNT' ||
            message === 'REASON_REQUIRED'
          ? 400
          : 500

    return NextResponse.json({ error: message }, { status })
  }
}
