import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { DEFAULT_TIMEZONE, wallClockLocalInputToUtc } from '@/lib/timezone-server'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const sessions = await prisma.liveSession.findMany({
    orderBy: { startsAt: 'desc' },
    take: 50,
    include: {
      _count: {
        select: {
          bookings: { where: { status: 'RESERVED' } }
        }
      }
    }
  })

  return NextResponse.json({
    defaultTimezone: DEFAULT_TIMEZONE,
    sessions: sessions.map((s) => ({
      ...s,
      reservedCount: s._count.bookings,
      spotsRemaining: Math.max(0, s.capacity - s._count.bookings)
    }))
  })
}

const createSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(5000).optional(),
  /** Wall-clock datetime-local string interpreted in DEFAULT_TIMEZONE */
  startsAtLocal: z.string().min(10),
  endsAtLocal: z.string().min(10),
  capacity: z.number().int().positive().max(500).optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED']).optional(),
  zoomMeetingId: z.string().trim().min(1).max(64).optional().nullable(),
  zoomJoinUrl: z.string().url().nullable().optional(),
  cancelDeadlineHours: z.number().int().positive().optional()
})

export async function POST(request) {
  const { error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const body = await request.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT', details: parsed.error.flatten() }, { status: 400 })
  }

  let startsAt
  let endsAt
  try {
    startsAt = wallClockLocalInputToUtc(parsed.data.startsAtLocal, DEFAULT_TIMEZONE)
    endsAt = wallClockLocalInputToUtc(parsed.data.endsAtLocal, DEFAULT_TIMEZONE)
  } catch {
    return NextResponse.json({ error: 'INVALID_DATETIME' }, { status: 400 })
  }

  if (endsAt <= startsAt) {
    return NextResponse.json({ error: 'INVALID_RANGE' }, { status: 400 })
  }

  const status = parsed.data.status || 'DRAFT'
  if (
    (status === 'SCHEDULED' || status === 'LIVE') &&
    !parsed.data.zoomMeetingId
  ) {
    return NextResponse.json(
      { error: 'ZOOM_MEETING_ID_REQUIRED' },
      { status: 400 }
    )
  }

  try {
    const session = await prisma.liveSession.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        startsAt,
        endsAt,
        capacity: parsed.data.capacity || 50,
        status,
        zoomMeetingId: parsed.data.zoomMeetingId || null,
        zoomJoinUrl: parsed.data.zoomJoinUrl || null,
        cancelDeadlineHours: parsed.data.cancelDeadlineHours ?? 2,
        timezone: DEFAULT_TIMEZONE
      }
    })

    return NextResponse.json({ session }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'SLUG_IN_USE' }, { status: 409 })
  }
}

const patchSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(3).max(160).optional(),
  description: z.string().max(5000).nullable().optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED']).optional(),
  capacity: z.number().int().positive().max(500).optional(),
  zoomMeetingId: z.string().trim().min(1).max(64).nullable().optional(),
  zoomJoinUrl: z.string().url().nullable().optional(),
  cancelDeadlineHours: z.number().int().positive().optional()
})

export async function PATCH(request) {
  const { error } = await requireAdmin()
  if (error) {
    return NextResponse.json({ error }, { status: error === 'UNAUTHORIZED' ? 401 : 403 })
  }

  const body = await request.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  const existing = await prisma.liveSession.findUnique({
    where: { id: parsed.data.id }
  })
  if (!existing) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  const nextStatus = parsed.data.status ?? existing.status
  const nextMeetingId =
    parsed.data.zoomMeetingId !== undefined
      ? parsed.data.zoomMeetingId
      : existing.zoomMeetingId

  if (
    (nextStatus === 'SCHEDULED' || nextStatus === 'LIVE') &&
    !nextMeetingId
  ) {
    return NextResponse.json(
      { error: 'ZOOM_MEETING_ID_REQUIRED' },
      { status: 400 }
    )
  }

  const { id, ...data } = parsed.data
  const session = await prisma.liveSession.update({
    where: { id },
    data
  })

  return NextResponse.json({ session })
}
