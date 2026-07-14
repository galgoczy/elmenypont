import { sendMail, mailMode } from '../lib/mailer.js'
import { emailShell, infoRows, button, p, escHtml } from '../lib/emailLayout.js'

/**
 * Quote-request endpoint (Vercel serverless): notifies on Telegram, mails a
 * plain summary to the admin and a branded confirmation to the requester.
 * Mail goes via Microsoft Graph (OAuth2) if configured, else SMTP — see
 * lib/mailer.js. All credentials come from env vars, never from code.
 * Channels degrade independently: the request succeeds if at least one
 * configured channel delivered.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const b = req.body || {}
  const email = String(b.email || '').trim()
  const name = String(b.name || '').trim()
  const phone = String(b.phone || '').trim()
  const eventType = String(b.eventType || '').trim()
  const date = String(b.date || '').trim()
  const guests = String(b.guests || '').trim()
  const message = String(b.message || '').trim()
  const services = Array.isArray(b.services) ? b.services.map(String).slice(0, 10) : []

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Érvénytelen email cím' })
  }

  const serviceLine = services.length ? services.join(', ') : '–'
  const summary =
    `Név:            ${name || '–'}\n` +
    `Email:          ${email}\n` +
    `Telefon:        ${phone || '–'}\n` +
    `Szolgáltatás:   ${serviceLine}\n` +
    `Esemény típusa: ${eventType || '–'}\n` +
    `Időpont:        ${date || '–'}\n` +
    `Vendégszám:     ${guests || '–'}\n` +
    `Üzenet:         ${message || '–'}`

  const delivered = []
  const failed = []

  // ── Telegram ──
  const tgToken = process.env.TELEGRAM_BOT_TOKEN
  const tgChat = process.env.TELEGRAM_CHAT_ID
  if (tgToken && tgChat) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChat,
          text:
            `📩 <b>Új ajánlatkérés – elmeny.hu</b>\n` +
            `🎯 Szolgáltatás: <b>${serviceLine.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c])}</b>\n\n` +
            `<pre>${summary.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c])}</pre>`,
          parse_mode: 'HTML',
        }),
      })
      if (!r.ok) throw new Error(`Telegram ${r.status}`)
      delivered.push('telegram')
    } catch (e) {
      failed.push(`telegram: ${e.message}`)
    }
  }

  // ── Email (admin summary + branded confirmation) — Graph or SMTP ──
  if (mailMode()) {
    const admin = process.env.CONTACT_ADMIN_EMAIL || 'galgoczy@elmeny.hu'
    const greeting = name ? `Kedves ${escHtml(name)}!` : 'Kedves Érdeklődő!'
    const detailRows = [
      ['Szolgáltatás', serviceLine],
      ['Esemény típusa', eventType || '–'],
      ['Időpont', date || '–'],
      ['Vendégszám', guests || '–'],
    ]

    // Admin notification — full lead detail + one-click reply to the requester
    try {
      const adminBody =
        p('<strong>Új ajánlatkérés érkezett</strong> az elmeny.hu űrlapról 🎉', { size: 17, color: '#17150D', top: 0 }) +
        infoRows([
          ['Név', name || '–'],
          ['Email', email],
          ['Telefon', phone || '–'],
          ...detailRows,
          ['Üzenet', message || '–'],
        ]) +
        p('Válaszolj közvetlenül az érdeklődőnek:', { color: '#46433A' }) +
        button(`mailto:${encodeURIComponent(email)}`, 'Válasz az érdeklődőnek →')
      await sendMail({
        to: admin,
        toName: 'Galgóczy Gergely',
        replyTo: email || 'hello@elmeny.hu',
        subject: `Új ajánlatkérés – elmeny.hu (${serviceLine})`,
        text: `Új ajánlatkérés – elmeny.hu\n${new Date().toISOString().slice(0, 16).replace('T', ' ')}\n${'-'.repeat(32)}\n${summary}\n`,
        html: emailShell({
          preheader: `Új ajánlatkérés: ${serviceLine} — ${name || email}`,
          badge: 'Új ajánlatkérés',
          body: adminBody,
        }),
      })
      delivered.push('admin-email')
    } catch (e) {
      failed.push(`admin-email: ${e.message}`)
    }

    // Requester confirmation
    try {
      const confirmBody =
        p(greeting, { size: 18, color: '#17150D', top: 0 }) +
        p('Köszönjük ajánlatkérésed! Kollégánk <strong>1 munkanapon belül</strong> felveszi veled a kapcsolatot.') +
        infoRows(detailRows) +
        p('Ha addig is kérdésed van, keress minket bátran — vagy nézd meg, mi mindent viszünk a rendezvényedre:', {
          color: '#46433A',
          top: 22,
        }) +
        button('https://elmeny.hu', 'Szolgáltatásaink →')
      await sendMail({
        to: email,
        toName: name || undefined,
        replyTo: 'hello@elmeny.hu',
        subject: 'Köszönjük ajánlatkérésed! — Élménypont',
        text:
          `${name ? `Kedves ${name}!` : 'Kedves Érdeklődő!'}\n\nKöszönjük ajánlatkérésed! Kollégánk 1 munkanapon belül felveszi veled a kapcsolatot.\n\n` +
          `Amire ajánlatot kértél: ${serviceLine}\nEsemény típusa: ${eventType || '–'}\nIdőpont: ${date || '–'}\nVendégszám: ${guests || '–'}\n\n` +
          `Ha sürgős, keress minket közvetlenül:\nhello@elmeny.hu | +36 20 468 0489\n\nÉlménypont csapata · elmeny.hu`,
        html: emailShell({
          preheader: 'Köszönjük ajánlatkérésed! Kollégánk 1 munkanapon belül keres.',
          body: confirmBody,
        }),
      })
      delivered.push('confirm-email')
    } catch (e) {
      failed.push(`confirm-email: ${e.message}`)
    }
  }

  if (delivered.length === 0) {
    console.error('contact: no channel delivered', failed)
    return res.status(500).json({ ok: false, error: 'Egy csatornán sem sikerült elküldeni', failed })
  }
  if (failed.length) console.warn('contact: partial delivery', { delivered, failed })
  // surface which channels went through / failed so a failing SMTP is
  // visible in the browser Network tab (error strings carry no secrets)
  return res.status(200).json({ ok: true, delivered, failed })
}
