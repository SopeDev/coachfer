'use client'

import { useEffect, useRef } from 'react'
import './Toast.scss'

const AUTO_DISMISS_MS = 4500

export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = AUTO_DISMISS_MS
}) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!message || !duration) return undefined

    const timer = setTimeout(() => {
      onCloseRef.current?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration])

  if (!message) return null

  return (
    <div
      className={`toast toast--${type}`}
      role="status"
      aria-live="polite"
    >
      <p className="toast__message">{message}</p>
      <button
        type="button"
        className="toast__close"
        aria-label="Cerrar"
        onClick={() => onCloseRef.current?.()}
      >
        ×
      </button>
    </div>
  )
}
