'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import SessionWhen from '../../../components/SessionWhen/SessionWhen'
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal'
import Toast from '../../../components/Toast/Toast'
import { formatSessionTitle } from '../../../lib/timezone'

const HISTORY_PAGE_SIZE = 10

const historyFilters = [
  { value: 'ALL', label: 'Todas' },
  { value: 'ATTENDED', label: 'Asistidas' },
  { value: 'COMPLETED', label: 'Finalizadas' },
  { value: 'CANCELLED', label: 'Canceladas' },
  { value: 'NO_SHOW', label: 'Ausencias' }
]

const isUpcomingBooking = (booking, now) =>
  booking.status === 'RESERVED' &&
  booking.liveSession.status !== 'CANCELLED' &&
  booking.liveSession.status !== 'COMPLETED' &&
  new Date(booking.liveSession.endsAt).getTime() > now

const getHistoryCategory = (booking) => {
  if (booking.status === 'ATTENDED') return 'ATTENDED'
  if (booking.status === 'NO_SHOW' || booking.status === 'EXCUSED') return 'NO_SHOW'
  if (
    booking.status === 'CANCELLED' ||
    booking.status === 'REFUNDED' ||
    booking.liveSession.status === 'CANCELLED'
  ) {
    return 'CANCELLED'
  }
  return 'COMPLETED'
}

const isToday = (value, timeZone) => {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone || 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    return formatter.format(new Date(value)) === formatter.format(new Date())
  } catch {
    return false
  }
}

const getDisplayStatus = (booking, now) => {
  const { liveSession } = booking
  const startsAt = new Date(liveSession.startsAt).getTime()
  const endsAt = new Date(liveSession.endsAt).getTime()

  if (booking.status === 'CANCELLED') return { label: 'Cancelada', tone: 'warn' }
  if (booking.status === 'REFUNDED') return { label: 'Reembolsada', tone: 'warn' }
  if (booking.status === 'ATTENDED') return { label: 'Asististe', tone: 'ok' }
  if (booking.status === 'NO_SHOW') return { label: 'No asististe', tone: 'danger' }
  if (booking.status === 'EXCUSED') return { label: 'Ausencia justificada', tone: 'muted' }
  if (liveSession.status === 'CANCELLED') {
    return { label: 'Sesión cancelada', tone: 'danger' }
  }
  if (liveSession.status === 'LIVE' || (startsAt <= now && endsAt > now)) {
    return { label: 'En curso', tone: 'live' }
  }
  if (startsAt > now) {
    return isToday(liveSession.startsAt, booking.viewerTimezone)
      ? { label: 'Hoy', tone: 'today' }
      : { label: 'Próxima', tone: 'upcoming' }
  }
  return { label: 'Finalizada', tone: 'muted' }
}

const getCountdown = (startsAt, now) => {
  const difference = new Date(startsAt).getTime() - now
  const days = Math.ceil(difference / (24 * 60 * 60 * 1000))

  if (days <= 0) return 'En curso'
  if (days === 1) return 'Mañana'
  if (days < 7) return `En ${days} días`

  const weeks = Math.floor(days / 7)
  return weeks === 1 ? 'En 1 semana' : `En ${weeks} semanas`
}

function StatusBadge({ booking, now }) {
  const status = getDisplayStatus(booking, now)
  return (
    <span className={`member-reservation-status member-reservation-status--${status.tone}`}>
      {status.label}
    </span>
  )
}

function ReservationCard({
  booking,
  now,
  featured = false,
  upcoming = false,
  cancelling = false,
  onCancel
}) {
  return (
    <article
      className={`member-reservation-card${
        featured ? ' member-reservation-card--featured' : ''
      }`}
    >
      <div className="member-reservation-card__content">
        <div className="member-reservation-card__heading">
          <div>
            {featured ? (
              <p className="member-reservation-card__eyebrow">Tu próxima sesión</p>
            ) : null}
            <h3 className="member-reservation-card__title">
              {formatSessionTitle(
                booking.liveSession.title,
                booking.liveSession.startsAt,
                booking.liveSession.timezone
              )}
            </h3>
          </div>
        </div>

        {featured ? (
          <p className="member-reservation-card__countdown">
            {getCountdown(booking.liveSession.startsAt, now)}:
          </p>
        ) : null}

        <SessionWhen
          startsAt={booking.liveSession.startsAt}
          sessionTimezone={booking.liveSession.timezone}
          viewerTimezone={booking.viewerTimezone}
        />
      </div>

      <StatusBadge booking={booking} now={now} />

      {upcoming ? (
        <div className="member-reservation-card__actions">
          {booking.zoomJoinUrl ? (
          <a
            className="member-btn"
            href={booking.zoomJoinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Unirme a Zoom
          </a>
          ) : null}
          {booking.canCancel ? (
            <button
              className="member-btn member-btn--danger"
              type="button"
              disabled={cancelling}
              onClick={() => onCancel(booking)}
            >
              {cancelling ? 'Cancelando…' : 'Cancelar reserva'}
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

export default function ReservasPage() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [historyFilter, setHistoryFilter] = useState('ALL')
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(HISTORY_PAGE_SIZE)
  const [now] = useState(() => Date.now())
  const [cancellingId, setCancellingId] = useState(null)
  const [pendingCancellation, setPendingCancellation] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetch('/api/me/bookings')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error')
        setBookings(data.bookings || [])
      })
      .catch(() => setError('No se pudieron cargar tus reservas.'))
      .finally(() => setLoading(false))
  }, [])

  const { upcoming, history } = useMemo(() => {
    const next = []
    const previous = []

    bookings.forEach((booking) => {
      if (isUpcomingBooking(booking, now)) next.push(booking)
      else previous.push(booking)
    })

    next.sort(
      (a, b) =>
        new Date(a.liveSession.startsAt).getTime() -
        new Date(b.liveSession.startsAt).getTime()
    )
    previous.sort(
      (a, b) =>
        new Date(b.liveSession.startsAt).getTime() -
        new Date(a.liveSession.startsAt).getTime()
    )

    return { upcoming: next, history: previous }
  }, [bookings, now])

  const filteredHistory = history.filter(
    (booking) =>
      historyFilter === 'ALL' || getHistoryCategory(booking) === historyFilter
  )
  const visibleHistory = filteredHistory.slice(0, visibleHistoryCount)
  const nextBooking = upcoming[0]
  const laterBookings = upcoming.slice(1)

  const selectHistoryFilter = (filter) => {
    setHistoryFilter(filter)
    setVisibleHistoryCount(HISTORY_PAGE_SIZE)
  }

  const cancelBooking = async () => {
    const booking = pendingCancellation
    if (!booking) return
    setCancellingId(booking.id)
    const res = await fetch(`/api/bookings/${booking.id}/cancel`, { method: 'POST' })
    const data = await res.json()
    setCancellingId(null)

    if (!res.ok) {
      setPendingCancellation(null)
      setToast({
        message:
          data.error === 'CANCEL_DEADLINE_PASSED'
            ? 'Ya pasó el plazo permitido para cancelar.'
            : 'No se pudo cancelar la reserva.',
        type: 'error',
        id: Date.now()
      })
      return
    }

    setBookings((current) =>
      current.map((item) =>
        item.id === booking.id
          ? {
              ...item,
              ...data.booking,
              zoomJoinUrl: null,
              canCancel: false
            }
          : item
      )
    )
    setPendingCancellation(null)
    setToast({
      message: 'Reserva cancelada. Recuperaste 1 crédito.',
      type: 'success',
      id: Date.now()
    })
  }

  return (
    <div className="member-page">
      <Toast
        key={toast?.id}
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
      <div className="member-page__header">
        <h1 className="member-page__title">Mis reservas</h1>
        <p className="member-page__subtitle">
          Consulta tus próximas sesiones y revisa tu historial.
        </p>
      </div>

      {loading ? <p className="member-muted">Cargando tus reservas…</p> : null}
      {error ? <p className="member-error">{error}</p> : null}

      {!loading && !error && !bookings.length ? (
        <section className="member-reservations-empty">
          <h2>Aún no tienes reservas</h2>
          <p>Explora las próximas sesiones y reserva tu lugar.</p>
          <Link className="member-btn" href="/dashboard/sesiones">
            Ver sesiones disponibles
          </Link>
        </section>
      ) : null}

      {!loading && nextBooking ? (
        <section className="member-reservations-section" aria-labelledby="next-booking-title">
          <h2 id="next-booking-title" className="member-reservations-section__title">
            Próxima sesión
          </h2>
          <ReservationCard
            booking={nextBooking}
            now={now}
            featured
            upcoming
            cancelling={cancellingId === nextBooking.id}
            onCancel={setPendingCancellation}
          />
        </section>
      ) : null}

      {!loading && !nextBooking && bookings.length ? (
        <section className="member-reservations-empty member-reservations-empty--compact">
          <h2>No tienes próximas reservas</h2>
          <p>Cuando reserves una nueva sesión aparecerá destacada aquí.</p>
          <Link className="member-btn member-btn--ghost" href="/dashboard/sesiones">
            Explorar sesiones
          </Link>
        </section>
      ) : null}

      {laterBookings.length ? (
        <section className="member-reservations-section" aria-labelledby="upcoming-title">
          <div className="member-reservations-section__heading">
            <h2 id="upcoming-title" className="member-reservations-section__title">
              Más adelante
            </h2>
            <span className="member-reservations-section__count">
              {laterBookings.length}
            </span>
          </div>
          <div className="member-reservations-list">
            {laterBookings.map((booking) => (
              <ReservationCard
                key={booking.id}
                booking={booking}
                now={now}
                upcoming
                cancelling={cancellingId === booking.id}
                onCancel={setPendingCancellation}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!loading && history.length ? (
        <section className="member-reservations-section" aria-labelledby="history-title">
          <div className="member-reservations-section__heading">
            <div>
              <h2 id="history-title" className="member-reservations-section__title">
                Historial
              </h2>
              <p className="member-reservations-section__description">
                Sesiones pasadas, canceladas y reembolsadas.
              </p>
            </div>
            <span className="member-reservations-section__count">{history.length}</span>
          </div>

          <div className="member-reservations-filters" aria-label="Filtrar historial">
            {historyFilters.map((filter) => (
              <button
                key={filter.value}
                className={`member-reservations-filter${
                  historyFilter === filter.value ? ' member-reservations-filter--active' : ''
                }`}
                type="button"
                aria-pressed={historyFilter === filter.value}
                onClick={() => selectHistoryFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {visibleHistory.length ? (
            <div className="member-reservations-list member-reservations-list--history">
              {visibleHistory.map((booking) => (
                <ReservationCard key={booking.id} booking={booking} now={now} />
              ))}
            </div>
          ) : (
            <p className="member-reservations-no-results">
              No hay reservas con este estado.
            </p>
          )}

          {visibleHistoryCount < filteredHistory.length ? (
            <button
              className="member-btn member-btn--ghost member-reservations-load-more"
              type="button"
              onClick={() =>
                setVisibleHistoryCount((count) => count + HISTORY_PAGE_SIZE)
              }
            >
              Cargar más
            </button>
          ) : null}
        </section>
      ) : null}

      <ConfirmModal
        open={Boolean(pendingCancellation)}
        title="Cancelar reserva"
        confirmLabel={cancellingId ? 'Cancelando…' : 'Sí, cancelar'}
        tone="danger"
        busy={Boolean(cancellingId)}
        onConfirm={cancelBooking}
        onClose={() => setPendingCancellation(null)}
      >
        <p>Recuperarás 1 crédito y tu lugar quedará disponible para otra persona.</p>
      </ConfirmModal>
    </div>
  )
}
