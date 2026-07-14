import nodemailer from 'nodemailer'

/**
 * Unified mail sender for the Vercel functions. Prefers Microsoft Graph
 * (OAuth2 client-credentials) when an app registration is configured —
 * this bypasses SMTP AUTH entirely, so it works even when basic-auth SMTP
 * is disabled tenant-wide. Falls back to SMTP (nodemailer) otherwise.
 *
 * Graph env vars (Entra app registration with Mail.Send application
 * permission + admin consent):
 *   MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET, MS_SENDER
 * SMTP env vars (fallback):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 */

// Display name shown as the sender in every mail, regardless of which
// mailbox address actually sends. Override via MAIL_FROM_NAME if needed.
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || 'Élménypont'

let cachedToken = null // { value, exp } — reused across warm invocations

async function graphToken() {
  const tenant = process.env.MS_TENANT_ID
  const clientId = process.env.MS_CLIENT_ID
  const clientSecret = process.env.MS_CLIENT_SECRET
  if (cachedToken && cachedToken.exp > Date.now() + 30_000) return cachedToken.value
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  })
  const r = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const j = await r.json()
  if (!r.ok || !j.access_token) {
    throw new Error(`Graph token ${r.status}: ${j.error_description || j.error || 'ismeretlen'}`)
  }
  cachedToken = { value: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 }
  return cachedToken.value
}

async function sendViaGraph({ to, toName, subject, text, html, replyTo }) {
  const sender = process.env.MS_SENDER || process.env.SMTP_USER
  const token = await graphToken()
  const message = {
    subject,
    body: html ? { contentType: 'HTML', content: html } : { contentType: 'Text', content: text || '' },
    // MS_SENDER is the real mailbox we send from (e.g. info1@elmeny.hu);
    // override only the display name so recipients see "Élménypont", not
    // the mailbox's own name. The address stays the mailbox (aliases like
    // hello@ can't be a Graph /users/{id} target), while Reply-To carries
    // the public alias so replies land there.
    from: { emailAddress: { address: sender, name: MAIL_FROM_NAME } },
    toRecipients: [{ emailAddress: { address: to, name: toName || undefined } }],
  }
  if (replyTo) message.replyTo = [{ emailAddress: { address: replyTo } }]
  const r = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, saveToSentItems: false }),
  })
  if (r.status !== 202) {
    let detail = ''
    try {
      const j = await r.json()
      detail = j.error?.message || JSON.stringify(j)
    } catch {
      detail = await r.text().catch(() => '')
    }
    throw new Error(`Graph sendMail ${r.status}: ${detail}`)
  }
}

let smtpTransport = null
function smtp() {
  if (smtpTransport) return smtpTransport
  smtpTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    requireTLS: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  })
  return smtpTransport
}

/** which transport is configured — 'graph' | 'smtp' | null */
export function mailMode() {
  if (process.env.MS_TENANT_ID && process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET) return 'graph'
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) return 'smtp'
  return null
}

/**
 * Send one mail via the configured transport. `from` is fixed to the
 * sender identity (Graph: MS_SENDER; SMTP: SMTP_USER) — Office365 rejects
 * mismatched From anyway.
 */
export async function sendMail({ to, toName, subject, text, html, replyTo }) {
  const mode = mailMode()
  if (mode === 'graph') {
    return sendViaGraph({ to, toName, subject, text, html, replyTo })
  }
  if (mode === 'smtp') {
    const fromAddr = process.env.SMTP_USER
    await smtp().sendMail({
      from: { name: MAIL_FROM_NAME, address: fromAddr },
      to: toName ? { name: toName, address: to } : to,
      replyTo: replyTo || undefined,
      subject,
      text,
      html,
    })
    return
  }
  throw new Error('Nincs beállítva levélküldő (sem Graph, sem SMTP env)')
}
