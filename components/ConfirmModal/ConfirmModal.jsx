'use client'

import { useEffect, useId, useRef } from 'react'

export default function ConfirmModal({
  open,
  title,
  children,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Volver',
  tone = 'primary',
  busy = false,
  onConfirm,
  onClose
}) {
  const confirmRef = useRef(null)
  const modalRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return undefined

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    confirmRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) onClose()
      if (event.key === 'Tab') {
        const controls = modalRef.current?.querySelectorAll(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)'
        )
        if (!controls?.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.()
    }
  }, [busy, onClose, open])

  if (!open) return null

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose()
      }}
    >
      <section
        ref={modalRef}
        className="app-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="app-modal__title">
          {title}
        </h2>
        <div className="app-modal__body">{children}</div>
        <div className="app-modal__actions">
          <button
            className="app-modal__button app-modal__button--ghost"
            type="button"
            disabled={busy}
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            className={`app-modal__button${
              tone === 'danger' ? ' app-modal__button--danger' : ''
            }`}
            type="button"
            disabled={busy}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
