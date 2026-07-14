import { sendMail, mailMode } from '../lib/mailer.js'
import { emailShell, button, panel, p } from '../lib/emailLayout.js'

const DEMO_URL = 'https://aidemo.elmeny.hu'
const DEMO_PASS = 'aifénykép'

/**
 * Demo-request endpoint: the visitor leaves an email, we notify on Telegram
 * and send a branded mail with the demo link + password and contact CTAs.
 * Same env vars as api/contact.js.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  const email = String((req.body || {}).email || '').trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Érvénytelen email cím' })
  }

  const delivered = []
  const failed = []

  const tgToken = process.env.TELEGRAM_BOT_TOKEN
  const tgChat = process.env.TELEGRAM_CHAT_ID
  if (tgToken && tgChat) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChat,
          text: `🎬 <b>AI demo kérés (elmeny.hu)</b>\nEmail: ${email}`,
          parse_mode: 'HTML',
        }),
      })
      if (!r.ok) throw new Error(`Telegram ${r.status}`)
      delivered.push('telegram')
    } catch (e) {
      failed.push(`telegram: ${e.message}`)
    }
  }

  // ── Email (admin notice + demo link to requester) — Graph or SMTP ──
  if (mailMode()) {
    const admin = process.env.CONTACT_ADMIN_EMAIL || 'galgoczy@elmeny.hu'
    try {
      await sendMail({
        to: admin,
        toName: 'Galgóczy Gergely',
        replyTo: email || 'hello@elmeny.hu',
        subject: `AI demo kérés – ${email}`,
        text: `Demo linket kért az elmeny.hu-n:\nEmail: ${email}\n${new Date().toISOString().slice(0, 16).replace('T', ' ')}\n`,
        html: emailShell({
          preheader: `AI demo kérés: ${email}`,
          badge: 'AI demo kérés',
          body:
            p('<strong>Új AI demo kérés</strong> érkezett az elmeny.hu-ról 🎬', { size: 17, color: '#17150D', top: 0 }) +
            p(`Email: <a href="mailto:${email}" style="color:#E94A35;font-weight:bold;">${email}</a>`) +
            button(`mailto:${encodeURIComponent(email)}`, 'Válasz az érdeklődőnek →'),
        }),
      })
      delivered.push('admin-email')
    } catch (e) {
      failed.push(`admin-email: ${e.message}`)
    }
    try {
      await sendMail({
        to: email,
        replyTo: 'hello@elmeny.hu',
        subject: 'Itt az AI Selfiemata demód! ✦',
        text:
          `Kedves Érdeklődő!\n\nKöszönjük az érdeklődésed! Az AI Selfiemata demója:\n${DEMO_URL}\nJelszó: ${DEMO_PASS}\n\n` +
          `Ha tetszik, kérj ajánlatot: https://elmeny.hu/ai-fotoautomata#kapcsolat\nvagy keress minket: +36 20 468 0489 | hello@elmeny.hu\n\nÉlménypont csapata · elmeny.hu`,
        html: emailShell({
          preheader: 'Itt a személyes AI Selfiemata demód — próbáld ki élőben!',
          badge: 'AI Selfiemata',
          body:
            p('Kedves Érdeklődő!', { size: 18, color: '#17150D', top: 0 }) +
            p(
              'Köszönjük az érdeklődésed! Próbáld ki élőben, hogyan varázsol az AI Selfiemata pár másodperc alatt egyedi alkotást egy fotóból:'
            ) +
            panel(
              button(DEMO_URL, 'Demó megnyitása →', { dark: true }) +
                `<div style="margin-top:16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#46433A;">A demó jelszava: <strong style="font-size:17px;color:#E94A35;letter-spacing:.02em;">${DEMO_PASS}</strong></div>`
            ) +
            p('Ha tetszik, amit látsz, a rendezvényedre pár kattintással kérhetsz ajánlatot:', { color: '#46433A' }) +
            button('https://elmeny.hu/ai-fotoautomata#kapcsolat', 'Ajánlatot kérek →'),
        }),
      })
      delivered.push('demo-email')
    } catch (e) {
      failed.push(`demo-email: ${e.message}`)
    }
  }

  if (delivered.length === 0) {
    console.error('demo: no channel delivered', failed)
    return res.status(500).json({ ok: false, error: 'Nem sikerült elküldeni', failed })
  }
  if (failed.length) console.warn('demo: partial delivery', { delivered, failed })
  return res.status(200).json({ ok: true, delivered, failed })
}
