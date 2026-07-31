import nodemailer from 'nodemailer'
import { formatSessionWhen } from './timezone'

const {
  SMTP_HOST = 'smtp.gmail.com',
  SMTP_PORT = '465',
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM
} = process.env

let transporter = null

const getTransporter = () => {
  if (transporter) return transporter

  if (!SMTP_USER || !SMTP_PASS) {
    return null
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  })

  return transporter
}

/**
 * Send an email. In development without SMTP, logs to console instead of throwing.
 */
export const sendMail = async ({ to, subject, html, text }) => {
  const from = EMAIL_FROM || SMTP_USER || 'noreply@astrohacking.local'
  const transport = getTransporter()

  if (!transport) {
    console.warn('[mail] SMTP not configured — skipping send')
    console.info('[mail] Would send:', { to, subject, text: text || html?.slice(0, 200) })
    return { skipped: true }
  }

  const info = await transport.sendMail({
    from,
    to,
    subject,
    html,
    text
  })

  return { messageId: info.messageId }
}

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const displayName = name || 'hola'
  const subject = 'Restablece tu contraseña — AstroHacking®'
  const text = `Hola ${displayName},\n\nRecibimos una solicitud para restablecer tu contraseña.\n\nAbre este enlace (válido por 1 hora):\n${resetUrl}\n\nSi no solicitaste esto, ignora este correo.\n\n— AstroHacking®`
  const html = `
    <p>Hola ${displayName},</p>
    <p>Recibimos una solicitud para restablecer tu contraseña.</p>
    <p><a href="${resetUrl}">Restablecer contraseña</a></p>
    <p>Este enlace es válido por 1 hora. Si no solicitaste esto, ignora este correo.</p>
    <p>— AstroHacking®</p>
  `

  return sendMail({ to, subject, html, text })
}

export const sendWelcomeEmail = async ({ to, name }) => {
  const displayName = name || 'hola'
  const subject = 'Bienvenido a AstroHacking®'
  const text = `Hola ${displayName},\n\nTu cuenta está lista. Ya puedes iniciar sesión y explorar Coaching Privado y el Entrenamiento de la Consciencia.\n\n— AstroHacking®`
  const html = `
    <p>Hola ${displayName},</p>
    <p>Tu cuenta está lista. Ya puedes iniciar sesión y explorar Coaching Privado y el Entrenamiento de la Consciencia.</p>
    <p>— AstroHacking®</p>
  `

  return sendMail({ to, subject, html, text })
}

export const sendBookingConfirmationEmail = async ({
  to,
  name,
  sessionTitle,
  startsAt,
  timezone,
  zoomJoinUrl,
  cancelDeadlineHours = 2
}) => {
  const displayName = name || 'hola'
  const when = formatSessionWhen(startsAt, timezone)
  const subject = `Reserva confirmada: ${sessionTitle}`
  const text = `Hola ${displayName},

Tu lugar está reservado para "${sessionTitle}".

Cuándo: ${when} (hora oficial)

Tu enlace personal de Zoom (no lo compartas):
${zoomJoinUrl || 'Disponible en tu espacio al iniciar sesión'}

Importante: se usó 1 crédito al reservar. Puedes cancelar hasta ${cancelDeadlineHours} horas antes para recuperar el crédito.

— AstroHacking®`
  const html = `
    <p>Hola ${displayName},</p>
    <p>Tu lugar está reservado para <strong>${sessionTitle}</strong>.</p>
    <p><strong>Cuándo:</strong> ${when} <em>(hora oficial)</em></p>
    ${
      zoomJoinUrl
        ? `<p><a href="${zoomJoinUrl}">Unirte a Zoom</a> — enlace personal, no lo compartas.</p>`
        : '<p>Tu enlace de Zoom estará disponible en tu espacio.</p>'
    }
    <p>Se usó <strong>1 crédito</strong> al reservar. Puedes cancelar hasta ${cancelDeadlineHours} horas antes para recuperarlo.</p>
    <p>— AstroHacking®</p>
  `

  return sendMail({ to, subject, html, text })
}

export const sendBookingCancellationEmail = async ({
  to,
  name,
  sessionTitle,
  startsAt,
  timezone
}) => {
  const displayName = name || 'hola'
  const when = formatSessionWhen(startsAt, timezone)
  const subject = `Reserva cancelada: ${sessionTitle}`
  const text = `Hola ${displayName},

Cancelaste tu reserva para "${sessionTitle}" (${when}, hora oficial).

Tu crédito fue restaurado y el lugar quedó libre.

— AstroHacking®`
  const html = `
    <p>Hola ${displayName},</p>
    <p>Cancelaste tu reserva para <strong>${sessionTitle}</strong> (${when}, hora oficial).</p>
    <p>Tu crédito fue restaurado y el lugar quedó libre.</p>
    <p>— AstroHacking®</p>
  `

  return sendMail({ to, subject, html, text })
}
