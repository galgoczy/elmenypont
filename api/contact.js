import nodemailer from 'nodemailer'

/**
 * Quote-request endpoint (Vercel serverless). Ported from the ai.elmeny.hu
 * PHP mailer: notifies on Telegram, mails a plain summary to the admin and
 * a branded confirmation to the requester. All credentials come from env
 * vars (Vercel → Settings → Environment Variables) — never from code:
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID,
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_ADMIN_EMAIL
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

  // ── Email (admin summary + branded confirmation) ──
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const admin = process.env.CONTACT_ADMIN_EMAIL || 'galgoczy@elmeny.hu'
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: false,
      requireTLS: true, // Office365 needs STARTTLS on 587
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      // fail fast instead of hanging into Vercel's function timeout
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    })
    const esc = (s) => s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c])
    const greeting = name ? `Kedves ${esc(name)}!` : 'Kedves Érdeklődő!'
    try {
      await transporter.sendMail({
        from: { name: 'Élménypont', address: SMTP_USER },
        to: admin,
        subject: `Új ajánlatkérés – elmeny.hu (${serviceLine})`,
        text: `Új ajánlatkérés – elmeny.hu\n${new Date().toISOString().slice(0, 16).replace('T', ' ')}\n${'-'.repeat(32)}\n${summary}\n`,
      })
      delivered.push('admin-email')
    } catch (e) {
      failed.push(`admin-email: ${e.message}`)
    }
    try {
      await transporter.sendMail({
        from: { name: 'Élménypont', address: SMTP_USER },
        to: name ? { name, address: email } : email,
        replyTo: 'hello@elmeny.hu',
        subject: 'Köszönjük ajánlatkérésed! — Élménypont',
        text:
          `${greeting}\n\nKöszönjük ajánlatkérésed! Kollégánk 1 munkanapon belül felveszi veled a kapcsolatot.\n\n` +
          `Amire ajánlatot kértél: ${serviceLine}\nEsemény típusa: ${eventType || '–'}\nIdőpont: ${date || '–'}\nVendégszám: ${guests || '–'}\n\n` +
          `Ha sürgős, keress minket közvetlenül:\nhello@elmeny.hu | +36 20 468 0489\n\nÉlménypont csapata · elmeny.hu`,
        html: `
<html><body style="margin:0;padding:24px;background:#F6F1E9;font-family:Arial,sans-serif;font-size:14px;color:#17150D;">
<div style="max-width:600px;margin:0 auto;">
  <div style="background:#17150D;padding:30px;border-radius:16px 16px 0 0;text-align:center;">
    <h1 style="color:#F6F1E9;margin:0;font-size:22px;">Élménypont</h1>
    <p style="color:#F2937F;margin:8px 0 0;font-size:13px;letter-spacing:.12em;text-transform:uppercase;">Interaktív rendezvényélmények</p>
  </div>
  <div style="background:#fff;padding:30px;border:1px solid #e6e0d5;border-top:none;border-radius:0 0 16px 16px;">
    <p style="font-size:16px;">${greeting}</p>
    <p>Köszönjük ajánlatkérésed! Kollégánk <strong>1 munkanapon belül</strong> felveszi veled a kapcsolatot.</p>
    <table style="width:100%;border-collapse:collapse;margin-top:18px;">
      <tr style="background:#F6F1E9;"><td style="padding:8px 12px;font-weight:bold;width:170px;">Szolgáltatás</td><td style="padding:8px 12px;">${esc(serviceLine)}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:bold;">Esemény típusa</td><td style="padding:8px 12px;">${esc(eventType || '–')}</td></tr>
      <tr style="background:#F6F1E9;"><td style="padding:8px 12px;font-weight:bold;">Időpont</td><td style="padding:8px 12px;">${esc(date || '–')}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:bold;">Vendégszám</td><td style="padding:8px 12px;">${esc(guests || '–')}</td></tr>
    </table>
    <p style="margin-top:22px;color:#46433A;">Ha sürgős kérdésed van, keress minket közvetlenül:</p>
    <p>
      📧 <a href="mailto:hello@elmeny.hu" style="color:#E94A35;">hello@elmeny.hu</a><br>
      📞 <a href="tel:+36204680489" style="color:#E94A35;">+36 20 468 0489</a>
    </p>
    <p style="margin-top:28px;color:#7A766B;font-size:12px;border-top:1px solid #e6e0d5;padding-top:14px;">
      © ${new Date().getFullYear()} Élménypont · <a href="https://elmeny.hu" style="color:#7A766B;">elmeny.hu</a>
    </p>
  </div>
</div>
</body></html>`,
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
