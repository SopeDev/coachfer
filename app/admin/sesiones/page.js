'use client'

import { useEffect, useState } from 'react'
import Toast from '../../../components/Toast/Toast'

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

/** Prefill datetime-local with next Thursday 19:00 as CDMX wall clock digits */
const toCdmxInputValue = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date)
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
  }

  const load = async () => {
    const res = await fetch('/api/admin/sessions')
    const data = await res.json()
    if (!res.ok) {
      setError('No se pudieron cargar las sesiones.')
      return
    }
    setSessions(data.sessions)
  }

  useEffect(() => {
    load()
  }, [])

  const createSession = async (event) => {
    event.preventDefault()
    setSaving(true)
    const form = new FormData(event.currentTarget)
    const startsLocal = form.get('startsAt')
    const endsLocal = form.get('endsAt')
    const title = String(form.get('title') || '')
    const status = form.get('status') || 'DRAFT'
    const zoomMeetingId = String(form.get('zoomMeetingId') || '').trim() || null
    const slug =
      String(form.get('slug') || '') ||
      title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    if ((status === 'SCHEDULED' || status === 'LIVE') && !zoomMeetingId) {
      setSaving(false)
      showToast(
        'Pega el Meeting ID de Zoom para publicar la sesión.',
        'error'
      )
      return
    }

    const res = await fetch('/api/admin/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug,
        description: form.get('description') || undefined,
        startsAtLocal: String(startsLocal),
        endsAtLocal: String(endsLocal),
        capacity: Number(form.get('capacity') || 50),
        status,
        zoomMeetingId,
        zoomJoinUrl: form.get('zoomJoinUrl') || null,
        cancelDeadlineHours: Number(form.get('cancelDeadlineHours') || 2)
      })
    })

    setSaving(false)
    const data = await res.json()
    if (!res.ok) {
      showToast(
        data.error === 'ZOOM_MEETING_ID_REQUIRED'
          ? 'Meeting ID de Zoom obligatorio para SCHEDULED.'
          : data.error || 'No se pudo crear la sesión.',
        'error'
      )
      return
    }

    event.currentTarget.reset()
    showToast('Sesión creada.')
    await load()
  }

  const runWeeklyCron = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/sessions/run-weekly-cron', {
        method: 'POST'
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || 'No se pudo ejecutar el cron.', 'error')
      } else if (data.created) {
        showToast(`Sesión creada: ${data.session.title}`)
        await load()
      } else {
        showToast(
          'Ya existe la sesión del próximo jueves.',
          'info'
        )
      }
    } catch {
      showToast('Error al ejecutar el cron.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const startDefault = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const endDefault = new Date(startDefault.getTime() + 2 * 60 * 60 * 1000)

  return (
    <div className="admin-page">
      <Toast
        key={toast?.id}
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Sesiones en vivo</h1>
          <p className="admin-page__subtitle">
            Automático: cada lunes se crea la sesión del próximo jueves 19:00
            CDMX + Zoom. También puedes crear una manualmente abajo.
          </p>
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <section className="admin-card">
        <h2 className="admin-card__title">Próxima sesión automática</h2>
        <p className="admin-muted" style={{ marginBottom: '1rem' }}>
          Busca si ya existe la sesión del próximo jueves 19:00 CDMX. Si no,
          la crea en Zoom (con registro) y la publica en el dashboard.
        </p>
        <button
          className="admin-btn"
          type="button"
          disabled={saving}
          onClick={runWeeklyCron}
        >
          {saving ? 'Creando…' : 'Crear próxima sesión (jueves)'}
        </button>
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">Nueva sesión manual</h2>
        <p className="admin-muted" style={{ marginBottom: '1rem' }}>
          Las fechas/horas se interpretan en <strong>America/Mexico_City</strong>
          (hora oficial del entrenamiento), no en la zona de tu navegador.
        </p>
        <form className="admin-form" onSubmit={createSession}>
          <label>
            Título
            <input className="admin-input" name="title" required minLength={3} />
          </label>
          <label>
            Slug (opcional)
            <input className="admin-input" name="slug" placeholder="sesion-marzo-01" />
          </label>
          <label>
            Descripción
            <textarea className="admin-textarea" name="description" />
          </label>
          <div className="admin-grid-2">
            <label>
              Inicio (hora CDMX)
              <input
                className="admin-input"
                type="datetime-local"
                name="startsAt"
                required
                defaultValue={toCdmxInputValue(startDefault)}
              />
            </label>
            <label>
              Fin (hora CDMX)
              <input
                className="admin-input"
                type="datetime-local"
                name="endsAt"
                required
                defaultValue={toCdmxInputValue(endDefault)}
              />
            </label>
          </div>
          <div className="admin-grid-2">
            <label>
              Cupo
              <input className="admin-input" type="number" name="capacity" defaultValue={50} min={1} />
            </label>
            <label>
              Estado
              <select className="admin-select" name="status" defaultValue="DRAFT">
                <option value="DRAFT">DRAFT</option>
                <option value="SCHEDULED">SCHEDULED</option>
              </select>
            </label>
          </div>
          <div className="admin-grid-2">
            <label>
              Zoom Meeting ID (obligatorio si SCHEDULED)
              <input
                className="admin-input"
                name="zoomMeetingId"
                placeholder="12345678901"
              />
            </label>
            <label>
              Cancelación hasta (horas antes)
              <input
                className="admin-input"
                type="number"
                name="cancelDeadlineHours"
                defaultValue={2}
                min={1}
              />
            </label>
          </div>
          <label>
            Zoom host URL (solo admin, opcional)
            <input
              className="admin-input"
              name="zoomJoinUrl"
              type="url"
              placeholder="https://zoom.us/s/..."
            />
          </label>
          <button className="admin-btn" type="submit" disabled={saving}>
            Crear sesión
          </button>
        </form>
      </section>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sesión</th>
              <th>Inicio</th>
              <th>Estado</th>
              <th>Lugares</th>
              <th>Zoom Meeting ID</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>
                  <strong>{session.title}</strong>
                  <div className="admin-muted">{session.slug}</div>
                </td>
                <td>{formatDate(session.startsAt)}</td>
                <td>
                  <span className="admin-badge">{session.status}</span>
                </td>
                <td>
                  {session.reservedCount ?? 0} / {session.capacity}
                  <div className="admin-muted">
                    {session.spotsRemaining ?? session.capacity} libres
                  </div>
                </td>
                <td className="admin-muted">{session.zoomMeetingId || '—'}</td>
              </tr>
            ))}
            {!sessions.length ? (
              <tr>
                <td colSpan={5} className="admin-muted">
                  No hay sesiones todavía.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
