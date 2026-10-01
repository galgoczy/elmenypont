/**
 * Invisible spam guard (client side): fetch a signed token from
 * /api/form-token once per page load and post it back with a form — see
 * lib/spamGuard.js. Never throws; the server decides what to do without it.
 */
let pending: Promise<string> | null = null

export function getFormToken(): Promise<string> {
  if (!pending) {
    pending = fetch('/api/form-token', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => String(j.t || ''))
      .catch(() => {
        pending = null // retry on the next call
        return ''
      })
  }
  return pending
}
