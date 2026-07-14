import { sendMail, mailMode } from '../lib/mailer.js'

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
        replyTo: 'hello@elmeny.hu',
        subject: `AI demo kérés – ${email}`,
        text: `Demo linket kért az elmeny.hu-n:\nEmail: ${email}\n${new Date().toISOString().slice(0, 16).replace('T', ' ')}\n`,
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
        html: `
<html><body style="margin:0;padding:24px;background:#F6F1E9;font-family:Arial,sans-serif;font-size:14px;color:#17150D;">
<div style="max-width:600px;margin:0 auto;">
  <div style="background:#17150D;padding:30px;border-radius:16px 16px 0 0;text-align:center;">
    <h1 style="color:#F6F1E9;margin:0;font-size:22px;">AI Selfiemata</h1>
    <p style="color:#F2937F;margin:8px 0 0;font-size:13px;letter-spacing:.12em;text-transform:uppercase;">Élménypont</p>
  </div>
  <div style="background:#fff;padding:30px;border:1px solid #e6e0d5;border-top:none;border-radius:0 0 16px 16px;">
    <p style="font-size:16px;">Kedves Érdeklődő!</p>
    <p>Köszönjük az érdeklődésed! Próbáld ki élőben, hogyan varázsol az AI Selfiemata pár másodperc alatt egyedi alkotást egy fotóból:</p>
    <div style="background:#F6F1E9;border-radius:12px;padding:22px;text-align:center;margin:24px 0;">
      <a href="${DEMO_URL}" style="display:inline-block;background:#17150D;color:#F6F1E9;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 30px;border-radius:999px;">Demó megnyitása →</a>
      <p style="margin:16px 0 0;color:#46433A;">A demó jelszava: <strong style="font-size:16px;color:#E94A35;">${DEMO_PASS}</strong></p>
    </div>
    <p>Ha tetszik, amit látsz:</p>
    <p>
      📅 <a href="https://elmeny.hu/ai-fotoautomata#kapcsolat" style="color:#E94A35;font-weight:bold;">Kérj ajánlatot a rendezvényedre →</a><br>
      📞 vagy keress minket: <a href="tel:+36204680489" style="color:#E94A35;">+36 20 468 0489</a> ·
      <a href="mailto:hello@elmeny.hu" style="color:#E94A35;">hello@elmeny.hu</a>
    </p>
    <p style="margin-top:28px;color:#7A766B;font-size:12px;border-top:1px solid #e6e0d5;padding-top:14px;">
      © ${new Date().getFullYear()} Élménypont · <a href="https://elmeny.hu" style="color:#7A766B;">elmeny.hu</a>
    </p>
  </div>
</div>
</body></html>`,
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
