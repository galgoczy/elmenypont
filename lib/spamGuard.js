import { createHmac, createHash, timingSafeEqual } from 'node:crypto'

/**
 * Invisible, zero-friction spam guards shared by api/contact.js and
 * api/demo.js. Nothing here is shown to real visitors.
 *
 * 1. Form token — the page fetches a short-lived HMAC-signed timestamp from
 *    /api/form-token when the form mounts and posts it back. Scripts that
 *    POST straight to the API (the bulk of contact-form spam) never have one.
 * 2. Content heuristics — the "escort photos / tinyurl" campaign abuses
 *    contact forms to get *our* confirmation mail ("Dear <spam link>!") sent
 *    to its victims. Links in the name field, absurdly long names and
 *    random-token gibberish messages are never real enquiries.
 */

// FORM_SECRET if set, else derived from a secret that already exists in the
// environment — no extra setup needed. The derived value never leaves here.
function secret() {
  const base =
    process.env.FORM_SECRET ||
    process.env.MS_CLIENT_SECRET ||
    process.env.SMTP_PASS ||
    process.env.TELEGRAM_BOT_TOKEN ||
    'elmenypont-form'
  return createHash('sha256').update(`ep-form-token|${base}`).digest()
}

const sign = (ts) => createHmac('sha256', secret()).update(String(ts)).digest('base64url')

const MAX_AGE_MS = 24 * 60 * 60 * 1000

export function issueToken() {
  const ts = Date.now()
  return `${ts}.${sign(ts)}`
}

export function tokenOk(token) {
  if (typeof token !== 'string') return false
  const [ts, mac] = token.split('.')
  const n = Number(ts)
  if (!Number.isFinite(n) || !mac) return false
  const age = Date.now() - n
  if (age < 0 || age > MAX_AGE_MS) return false
  const a = Buffer.from(mac)
  const b = Buffer.from(sign(n))
  return a.length === b.length && timingSafeEqual(a, b)
}

const LINKISH = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|info|ru|xyz|top|io|me|ly|link|site|online|club|biz|cc|to|co)\b|tinyurl|bit\.ly|t\.me\/)/i

/** random-looking tokens such as "gx18slZ", "ffVM9qq", "KpK0IyQ" */
function isGibberish(text) {
  const tokens = text.split(/\s+/).filter(Boolean)
  if (tokens.length < 4) return false
  const weird = tokens.filter(
    (w) => /^[A-Za-z0-9]{4,}$/.test(w) && (/[a-z][A-Z]/.test(w) || (/\d/.test(w) && /[A-Za-z]/.test(w))),
  )
  return weird.length / tokens.length >= 0.5
}

/**
 * Returns a short reason string if the submission is spam, else null.
 * `body` is the raw request body; `fields` the trimmed text fields.
 */
export function spamReason(body, fields = {}) {
  // honeypot — real users never see the "website" field
  if (typeof body.website === 'string' && body.website.trim() !== '') return 'honeypot'
  // the form always sends how long it was open; scripts don't
  if (typeof body.elapsedMs !== 'number' || body.elapsedMs < 3000) return 'timing'
  if (!tokenOk(body.formToken)) return 'token'

  const { name = '', message = '', eventType = '', date = '', guests = '' } = fields
  if (name.length > 60 || name.split(/\s+/).length > 6) return 'name-long'
  if ([name, eventType, date, guests].some((v) => LINKISH.test(v))) return 'link'
  if (isGibberish(message) || isGibberish(name)) return 'gibberish'
  return null
}
