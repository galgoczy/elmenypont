/**
 * Shared, on-brand email layout for the Élménypont transactional mails.
 *
 * Built for real inboxes, not just Chromium: table-based, inline styles,
 * `bgcolor` attributes (Outlook's Word engine honours these but ignores
 * border-radius and CSS gradients), solid brand colours, and a light,
 * warm header with the real logo — so Outlook renders a friendly card,
 * not a black "mourning frame". The logo is hosted on the always-live
 * deployment host so it resolves before and after the domain switch.
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

const LOGO = 'https://elmenypont.vercel.app/assets/logo/elmenypont-logo-coral.png'

const esc = (s) =>
  String(s == null ? '' : s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c])

/**
 * Bulletproof-ish pill CTA. Uses a bgcolor'd cell so Outlook shows a
 * filled button (square there, rounded elsewhere). `dark` = ink variant.
 */
export function button(href, label, { dark = false } = {}) {
  const bg = dark ? C.ink : C.red
  const fg = dark ? C.paper : '#ffffff'
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:8px auto;">` +
    `<tr><td bgcolor="${bg}" style="border-radius:999px;background:${bg};">` +
    `<a href="${href}" style="display:inline-block;padding:15px 38px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:${fg};text-decoration:none;border-radius:999px;">${label}</a>` +
    `</td></tr></table>`
  )
}

/** Detail rows as label/value pairs. `rows` = [[label, value], ...]. Values are escaped. */
export function infoRows(rows) {
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:20px 0 6px;">` +
    rows
      .map(
        ([k, v], i) =>
          `<tr>` +
          `<td width="150" bgcolor="${C.paper}" style="padding:12px 16px;border-left:3px solid ${C.coral};border-bottom:2px solid #ffffff;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:${C.ink};vertical-align:top;">${esc(k)}</td>` +
          `<td bgcolor="${C.paper}" style="padding:12px 16px;border-bottom:2px solid #ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${C.text};vertical-align:top;">${esc(v)}</td>` +
          `</tr>`
      )
      .join('') +
    `</table>`
  )
}

/** A soft highlight panel (used e.g. for the demo link + password). */
export function panel(innerHtml) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;"><tr><td bgcolor="${C.paper}" style="border:1px solid ${C.border};border-radius:14px;padding:24px;text-align:center;">${innerHtml}</td></tr></table>`
}

/** A brand-styled paragraph. */
export function p(html, { size = 15, color = C.text, top = 14 } = {}) {
  return `<p style="margin:${top}px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:${size}px;line-height:1.65;color:${color};">${html}</p>`
}

/**
 * Wrap body HTML in the full branded shell.
 *   preheader — hidden inbox-preview text
 *   badge     — the uppercase tagline under the logo
 *   body      — inner HTML (use p()/infoRows()/panel()/button())
 */
export function emailShell({ preheader = '', badge = 'Interaktív rendezvényélmények', body = '' }) {
  const year = new Date().getFullYear()
  return `<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:${C.sand};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.sand};">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.sand}" style="background:${C.sand};">
<tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:600px;width:100%;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid ${C.border};">
  <tr><td align="center" bgcolor="${C.paper}" style="background:${C.paper};padding:32px 30px 24px;">
    <img src="${LOGO}" width="196" alt="Élménypont" style="display:block;width:196px;max-width:70%;height:auto;border:0;outline:none;text-decoration:none;">
    <div style="margin-top:14px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:${C.red};">${esc(badge)}</div>
  </td></tr>
  <tr><td bgcolor="${C.red}" style="height:4px;background:${C.red};font-size:0;line-height:0;">&nbsp;</td></tr>
  <tr><td style="padding:34px 34px 30px;">${body}</td></tr>
  <tr><td bgcolor="${C.paper}" style="padding:24px 34px 30px;background:${C.paper};border-top:1px solid ${C.border};">
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
