<?php
// ═══ AI Selfiemata — Demo-kérés: Telegram értesítés + arculatos köszönő
//     levél a demó linkjével és jelszavával ═══

error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

require __DIR__ . '/config.php';

$DEMO_URL  = 'https://aidemo.elmeny.hu';
$DEMO_PASS = 'aifénykép';

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$nev   = trim($data['nev'] ?? '');

if (!$email) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Érvénytelen email cím']);
    exit;
}

// ── Telegram értesítés ──
send_telegram(
    "🎬 <b>AI demo kérés!</b>\n"
    . 'Email: ' . $email
    . ($nev ? "\nNév: " . $nev : '')
);

// ── PHPMailer ──
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

function createMailer() {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';
    return $mail;
}

$errors = [];

// ── 1. Rövid jelzés az adminnak ──
try {
    $mail = createMailer();
    $mail->setFrom(FROM_ADDR, FROM_NAME);
    $mail->addAddress(ADMIN_ADDR, 'Galgóczy Gergely');
    $mail->Subject = 'AI demo kérés – ' . $email;
    $mail->isHTML(false);
    $mail->Body = "Demo linket kért:\n" . ($nev ? "Név:   $nev\n" : '') . "Email: $email\n" . date('Y-m-d H:i') . "\n";
    $mail->send();
} catch (Exception $e) {
    $errors[] = 'Admin: ' . $mail->ErrorInfo;
}

// ── 2. Arculatos köszönő levél a demó adataival ──
try {
    $mail = createMailer();
    $mail->setFrom(FROM_ADDR, FROM_NAME);
    $mail->addAddress($email, $nev ?: '');
    $mail->addReplyTo(FROM_ADDR, FROM_NAME);
    $mail->Subject = 'Itt az AI Selfiemata demód! ✦';
    $mail->isHTML(true);
    $udvozles = $nev ? 'Kedves ' . htmlspecialchars($nev) . '!' : 'Kedves Érdeklődő!';
    $mail->Body = '
<html><body style="font-family:Arial,sans-serif;font-size:14px;color:#222;max-width:600px;margin:0 auto;">
<div style="background:linear-gradient(135deg,#6b21a8,#0d9488);padding:32px;border-radius:12px 12px 0 0;text-align:center;">
  <h1 style="color:white;margin:0;font-size:22px;">AI Selfiemata</h1>
  <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">élménypont</p>
</div>
<div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
  <p style="font-size:16px;">' . $udvozles . '</p>
  <p>Köszönjük az érdeklődésed! Próbáld ki élőben, hogyan varázsol az AI Selfiemata pár másodperc
     alatt egyedi alkotást egy fotóból:</p>
  <div style="background:#f3e8ff;border-radius:12px;padding:22px;text-align:center;margin:24px 0;">
    <a href="' . $DEMO_URL . '" style="display:inline-block;background:#6b21a8;color:#fff;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 30px;border-radius:999px;">Demó megnyitása →</a>
    <p style="margin:16px 0 0;color:#555;">A demó jelszava: <strong style="font-size:16px;color:#6b21a8;">' . $DEMO_PASS . '</strong></p>
  </div>
  <p>Ha tetszik, amit látsz, két dolgot tehetsz:</p>
  <p>
    📅 <a href="https://ai.elmeny.hu/#ajanlat" style="color:#6b21a8;font-weight:bold;">Kérj ajánlatot a rendezvényedre →</a><br>
    📞 vagy keress minket közvetlenül: <a href="tel:+36204680489" style="color:#6b21a8;">+36 20 468 0489</a> ·
    <a href="mailto:hello@elmeny.hu" style="color:#6b21a8;">hello@elmeny.hu</a>
  </p>
  <p style="margin-top:32px;color:#888;font-size:12px;border-top:1px solid #e5e7eb;padding-top:16px;">
    © ' . date('Y') . ' Élménypont – AI Selfiemata · <a href="https://elmeny.hu" style="color:#888;">elmeny.hu</a>
  </p>
</div>
</body></html>';
    $mail->AltBody =
        $udvozles . "\n\n"
        . "Köszönjük az érdeklődésed! Az AI Selfiemata demója:\n"
        . $DEMO_URL . "\n"
        . "Jelszó: " . $DEMO_PASS . "\n\n"
        . "Ha tetszik, kérj ajánlatot: https://ai.elmeny.hu/#ajanlat\n"
        . "vagy keress minket: +36 20 468 0489 | hello@elmeny.hu\n";
    $mail->send();
} catch (Exception $e) {
    $errors[] = 'Ügyfél: ' . $mail->ErrorInfo;
}

if (empty($errors)) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => implode(' | ', $errors)]);
}
