import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { adminDeleteGrant } from '@/lib/credits'

const ERROR_STATUS = {
  GRANT_NOT_FOUND: 404,
  GRANT_IN_USE: 409
}

/**
 * Undo an admin-assigned package (or a raw manual credit adjustment) —
 * for fixing a mistaken assignment, not for reclaiming credits that were
 * actually used. Refused once any booking has drawn from the grant.
 */
export async function DELETE(_request, { params }) {
  const { error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  try {
    const result = await adminDeleteGrant({ grantId: params.grantId, userId: params.id })
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    const status = ERROR_STATUS[err.message] || 500
    return NextResponse.json(
      { error: status === 500 ? 'SERVER_ERROR' : err.message },
      { status }
    )
  }
}
