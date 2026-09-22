// Spanish display labels for database enums. Never render raw enum values in the UI.

export const ROLE_LABELS = {
  USER: 'Usuario',
  ADMIN: 'Administrador',
  FACILITATOR: 'Facilitador'
}

export const PRODUCT_TYPE_LABELS = {
  COACHING: 'Coaching',
  MASTERMIND: 'Mastermind'
}

export const PURCHASE_STATUS_LABELS = {
  PENDING: 'Pendiente',
  PAID: 'Pagada',
  FAILED: 'Fallida',
  REFUNDED: 'Reembolsada'
}

export const CREDIT_GRANT_STATUS_LABELS = {
  ACTIVE: 'Activo',
  EXHAUSTED: 'Agotado',
  EXPIRED: 'Expirado',
  REVOKED: 'Revocado'
}

/**
 * Nothing flips grants to EXPIRED in the database yet, so derive it here:
 * an ACTIVE grant past its expiresAt is shown as expired.
 */
export const getGrantDisplayStatus = (grant, now = new Date()) =>
  grant.status === 'ACTIVE' && new Date(grant.expiresAt) <= now
    ? 'EXPIRED'
    : grant.status

export const CREDIT_TRANSACTION_TYPE_LABELS = {
  PURCHASE: 'Compra',
  RESERVATION: 'Reserva',
  RELEASE: 'Liberación',
  CONSUMPTION: 'Consumo',
  REFUND: 'Reembolso',
  EXPIRATION: 'Expiración',
  ADMIN_ADJUSTMENT: 'Ajuste manual'
}

export const LIVE_SESSION_STATUS_LABELS = {
  SCHEDULED: 'Programada',
  LIVE: 'En curso',
  COMPLETED: 'Finalizada',
  CANCELLED: 'Cancelada'
}

export const BOOKING_STATUS_LABELS = {
  RESERVED: 'Reservada',
  CANCELLED: 'Cancelada',
  ATTENDED: 'Asistió',
  NO_SHOW: 'No asistió',
  REFUNDED: 'Reembolsada',
  EXCUSED: 'Ausencia justificada'
}

/** Look up a label, falling back to the raw value if an enum gains a new member. */
export const labelFor = (labels, value) => labels[value] ?? value ?? '—'
