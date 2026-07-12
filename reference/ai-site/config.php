<?php
// ═══ Közös konfiguráció — send_mail.php és send_demo.php használja ═══
//
// FONTOS: a valódi jelszót és bot tokent CSAK a szerveren töltsd ki,
// verziókezelőbe / nyilvános helyre soha ne kerüljön!
//  - SMTP_PASS: az info1@elmeny.hu ÚJ jelszava (a régi kiszivárgott, cseréld!)
//  - TG_TOKEN:  ÚJ Telegram bot token a BotFathertől (a régi a weboldal
//               forrásában volt olvasható, azt vond vissza: /revoke)

const SMTP_HOST  = 'smtp.office365.com';
const SMTP_PORT  = 587;
const SMTP_USER  = 'info1@elmeny.hu';
const SMTP_PASS  = 'IDE_IRD_AZ_UJ_JELSZOT';
const FROM_NAME  = 'Élménypont';
const FROM_ADDR  = 'info1@elmeny.hu';
const ADMIN_ADDR = 'galgoczy@elmeny.hu';

const TG_TOKEN = 'IDE_IRD_AZ_UJ_BOT_TOKENT';
const TG_CHAT  = '5275561903';

/** Telegram értesítés — csendben kihagyja, ha nincs kitöltve a token. */
function send_telegram($text) {
    if (!TG_TOKEN || strpos(TG_TOKEN, 'IDE_IRD') === 0) return;
    $ch = curl_init('https://api.telegram.org/bot' . TG_TOKEN . '/sendMessage');
    curl_setopt_array($ch, array(
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_HTTPHEADER     => array('Content-Type: application/json'),
        CURLOPT_POSTFIELDS     => json_encode(array(
            'chat_id'    => TG_CHAT,
            'text'       => $text,
            'parse_mode' => 'HTML',
        )),
    ));
    curl_exec($ch);
    curl_close($ch);
}
