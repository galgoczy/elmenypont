/**
 * Shared, on-brand email layout for the Élménypont transactional mails.
 * Table-based + inline styles for broad client support (Gmail, Outlook,
 * Apple Mail). One shell, a few small builders — keep every mail visually
 * consistent. No external assets: images are often blocked by default, so
 * the wordmark is live text.
 */

const C = {
  ink: '#17150D',
  paper: '#F6F1E9',
  sand: '#EFE7DA',
  coral: '#F2937F',
  red: '#E94A35',
  text: '#2A2720',
  muted: '#7A766B',
  faint: '#A49E90',
  border: '#E6DFD2',
}

const esc = (s) =>
  String(s == null ? '' : s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c])

/** Rounded pill CTA. `dark` renders the ink variant (for use on paper cards). */
export function button(href, label, { dark = false } = {}) {
  const bg = dark ? C.ink : C.red
  const shadow = dark ? 'rgba(23,21,13,.28)' : 'rgba(233,74,53,.30)'
  const fg = dark ? C.paper : '#ffffff'
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:6px auto;">` +
    `<tr><td style="border-radius:999px;background:${bg};box-shadow:0 8px 20px ${shadow};">` +
    `<a href="${href}" style="display:inline-block;padding:15px 36px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:${fg};text-decoration:none;border-radius:999px;">${label}</a>` +
    `</td></tr></table>`
  )
}

/** Detail rows as label/value pairs. `rows` = [[label, value], ...]. Values are escaped. */
export function infoRows(rows) {
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 8px;margin:20px 0 6px;">` +
    rows
      .map(
        ([k, v]) =>
          `<tr>` +
          `<td style="width:150px;padding:12px 16px;background:${C.paper};border-left:3px solid ${C.coral};border-radius:8px 0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:${C.ink};vertical-align:top;">${esc(k)}</td>` +
          `<td style="padding:12px 16px;background:${C.paper};border-radius:0 8px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${C.text};vertical-align:top;">${esc(v)}</td>` +
          `</tr>`
      )
      .join('') +
    `</table>`
  )
}

/** A soft highlight panel (used e.g. for the demo link + password). */
export function panel(innerHtml) {
  return `<div style="background:${C.paper};border:1px solid ${C.border};border-radius:14px;padding:24px;text-align:center;margin:22px 0;">${innerHtml}</div>`
}

/** A brand-styled paragraph. */
export function p(html, { size = 15, color = C.text, top = 14 } = {}) {
  return `<p style="margin:${top}px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:${size}px;line-height:1.65;color:${color};">${html}</p>`
}

/**
 * Wrap body HTML in the full branded shell.
 *   preheader — hidden inbox-preview text
 *   badge     — the uppercase tagline under the wordmark
 *   body      — inner HTML (use p()/infoRows()/panel()/button())
 */
export function emailShell({ preheader = '', badge = 'Interaktív rendezvényélmények', body = '' }) {
  const year = new Date().getFullYear()
  return `<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:${C.sand};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.sand};">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sand};padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid ${C.border};">
  <tr><td style="background:${C.ink};background-image:linear-gradient(135deg,#24210F 0%,${C.ink} 62%);padding:40px 30px 32px;text-align:center;">
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:29px;font-weight:bold;color:${C.paper};letter-spacing:.01em;">Élménypont<span style="color:${C.coral};"> ✦</span></div>
    <div style="margin-top:11px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:${C.coral};">${esc(badge)}</div>
  </td></tr>
  <tr><td style="height:4px;background-image:linear-gradient(90deg,${C.coral},${C.red});font-size:0;line-height:0;">&nbsp;</td></tr>
  <tr><td style="padding:34px 34px 30px;">${body}</td></tr>
  <tr><td style="padding:24px 34px 30px;background:${C.paper};border-top:1px solid ${C.border};">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${C.muted};line-height:1.7;">
      <a href="mailto:hello@elmeny.hu" style="color:${C.red};text-decoration:none;font-weight:bold;">hello@elmeny.hu</a> &nbsp;·&nbsp;
      <a href="tel:+36204680489" style="color:${C.red};text-decoration:none;font-weight:bold;">+36 20 468 0489</a><br>
      <a href="https://www.facebook.com/Elmenypont/" style="color:${C.muted};text-decoration:underline;">Facebook</a> &nbsp;·&nbsp;
      <a href="https://www.instagram.com/elmeny.hu/" style="color:${C.muted};text-decoration:underline;">Instagram</a>
    </div>
    <div style="margin-top:14px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${C.faint};">© ${year} Élménypont · <a href="https://elmeny.hu" style="color:${C.faint};">elmeny.hu</a></div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}

export { esc as escHtml }
