<?php
// ═══ AI Selfiemata — Email küldő (PHPMailer) ═══

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

// ── Konfiguráció (jelszavak: config.php, csak a szerveren kitöltve) ──
require __DIR__ . '/config.php';
$SMTP_HOST  = SMTP_HOST;
$SMTP_PORT  = SMTP_PORT;
$SMTP_USER  = SMTP_USER;
$SMTP_PASS  = SMTP_PASS;
$FROM_NAME  = FROM_NAME;
$FROM_ADDR  = FROM_ADDR;
$ADMIN_ADDR = ADMIN_ADDR;

// ── Adatok beolvasása ──
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

$nev     = trim($data['nev']     ?? '');
$email   = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$telefon = trim($data['telefon'] ?? '');
$datum   = trim($data['datum']   ?? '');
$tipus   = trim($data['tipus']   ?? '');
$letszam = trim($data['letszam'] ?? '');
$uzenet  = trim($data['uzenet']  ?? '');

if (!$email) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Érvénytelen email cím']);
    exit;
}

// ── PHPMailer ──
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

function createMailer($host, $port, $user, $pass) {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $host;
    $mail->SMTPAuth   = true;
    $mail->Username   = $user;
    $mail->Password   = $pass;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $port;
    $mail->CharSet    = 'UTF-8';
    return $mail;
}

$errors = [];

// ── 0. Telegram értesítés (szerveroldalról — a token nem kerül a böngészőbe) ──
send_telegram(
    "📩 <b>Új ajánlatkérés – AI Selfiemata</b>\n"
    . 'Név: '     . ($nev     ?: '–') . "\n"
    . 'Email: '   . $email            . "\n"
    . 'Telefon: ' . ($telefon ?: '–') . "\n"
    . 'Dátum: '   . ($datum   ?: '–') . "\n"
    . 'Típus: '   . ($tipus   ?: '–') . "\n"
    . 'Létszám: ' . ($letszam ?: '–')
);

// ── 1. Összefoglaló Gergőnek (nincs Reply-To) ──
try {
    $mail = createMailer($SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASS);
    $mail->setFrom($FROM_ADDR, $FROM_NAME);
    $mail->addAddress($ADMIN_ADDR, 'Galgóczy Gergely');
    $mail->Subject = 'Új ajánlatkérés – AI Selfiemata';
    $mail->isHTML(false);
    $mail->Body =
        "Új ajánlatkérés – AI Selfiemata\n"
        . date('Y-m-d H:i') . "\n"
        . str_repeat('-', 32) . "\n"
        . "Név:     " . ($nev     ?: '–') . "\n"
        . "Email:   " . $email            . "\n"
        . "Telefon: " . ($telefon ?: '–') . "\n"
        . "Dátum:   " . ($datum   ?: '–') . "\n"
        . "Típus:   " . ($tipus   ?: '–') . "\n"
        . "Létszám: " . ($letszam ?: '–') . "\n"
        . "Üzenet:  " . ($uzenet  ?: '–') . "\n";
    $mail->send();
} catch (Exception $e) {
    $errors[] = 'Admin: ' . $mail->ErrorInfo;
}

// ── 2. Visszaigazolás az ügyfélnek ──
try {
    $mail = createMailer($SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASS);
    $mail->setFrom($FROM_ADDR, $FROM_NAME);
    $mail->addAddress($email, $nev ?: '');
    $mail->addReplyTo($FROM_ADDR, $FROM_NAME);
    $mail->Subject = 'Köszönjük ajánlatkérését – AI Selfiemata';
    $mail->isHTML(true);
    $udvozles = $nev ? 'Kedves ' . htmlspecialchars($nev) . '!' : 'Kedves Érdeklődő!';
    $mail->Body = '
<html><body style="font-family:Arial,sans-serif;font-size:14px;color:#222;max-width:600px;">
<div style="background:linear-gradient(135deg,#6b21a8,#0d9488);padding:32px;border-radius:12px 12px 0 0;text-align:center;">
  <h1 style="color:white;margin:0;font-size:22px;">AI Selfiemata</h1>
  <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">élménypont</p>
</div>
<div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
  <p style="font-size:16px;">' . $udvozles . '</p>
  <p>Köszönjük ajánlatkérését! Kollégánk <strong>1 munkanapon belül</strong> felveszi Önnel a kapcsolatot.</p>
  <h3 style="color:#6b21a8;margin-top:24px;">Az Ön megadott adatai:</h3>
  <table style="width:100%;border-collapse:collapse;">
    <tr style="background:#f3e8ff;"><td style="padding:8px 12px;font-weight:bold;width:160px;">Rendezvény dátuma</td><td style="padding:8px 12px;">' . htmlspecialchars($datum ?: '–') . '</td></tr>
    <tr><td style="padding:8px 12px;font-weight:bold;">Rendezvény típusa</td><td style="padding:8px 12px;">' . htmlspecialchars($tipus ?: '–') . '</td></tr>
    <tr style="background:#f3e8ff;"><td style="padding:8px 12px;font-weight:bold;">Várható létszám</td><td style="padding:8px 12px;">' . htmlspecialchars($letszam ?: '–') . '</td></tr>
  </table>
  <p style="margin-top:24px;color:#555;">Ha sürgős kérdése van, keressen minket közvetlenül:</p>
  <p>
    📧 <a href="mailto:hello@elmeny.hu" style="color:#6b21a8;">hello@elmeny.hu</a><br>
    📞 <a href="tel:+36204680489" style="color:#6b21a8;">+36 20 468 0489</a>
  </p>
  <p style="margin-top:32px;color:#888;font-size:12px;border-top:1px solid #e5e7eb;padding-top:16px;">
    © ' . date('Y') . ' Élménypont – AI Selfiemata
  </p>
</div>
</body></html>';
    $mail->AltBody =
        $udvozles . "\n\n"
        . "Köszönjük ajánlatkérését! Kollégánk 1 munkanapon belül felveszi Önnel a kapcsolatot.\n\n"
        . "Megadott adatok:\n"
        . "Rendezvény dátuma: " . ($datum   ?: '–') . "\n"
        . "Rendezvény típusa: " . ($tipus   ?: '–') . "\n"
        . "Várható létszám:   " . ($letszam ?: '–') . "\n\n"
        . "Üdvözlettel,\n"
        . "Élménypont csapata\n"
        . "hello@elmeny.hu | +36 20 468 0489\n";
    $mail->send();
} catch (Exception $e) {
    $errors[] = 'Ügyfél: ' . $mail->ErrorInfo;
}

// ── Válasz ──
if (empty($errors)) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => implode(' | ', $errors)]);
}