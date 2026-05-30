<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $s = $db->queryOne("SELECT * FROM site_settings WHERE id = '1'");
    if (!$s) {
        $s = [
            'id' => '1',
            'hero_headline_en'    => 'Where Success Becomes a Habit',
            'hero_headline_ar'    => 'حيث يصبح النجاح عادة',
            'hero_subheadline_en' => '',
            'hero_subheadline_ar' => '',
            'whatsapp_number'     => DEFAULT_WHATSAPP,
            'contact_email'       => DEFAULT_EMAIL,
        ];
    }
    echo json_encode($s);

} elseif ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body) { http_response_code(400); echo json_encode(['error' => 'Invalid JSON']); exit; }

    $db->execute(
        "INSERT INTO site_settings (id, hero_headline_en, hero_headline_ar, hero_subheadline_en, hero_subheadline_ar, whatsapp_number, contact_email)
         VALUES ('1', ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           hero_headline_en=VALUES(hero_headline_en),
           hero_headline_ar=VALUES(hero_headline_ar),
           hero_subheadline_en=VALUES(hero_subheadline_en),
           hero_subheadline_ar=VALUES(hero_subheadline_ar),
           whatsapp_number=VALUES(whatsapp_number),
           contact_email=VALUES(contact_email)",
        [
            $body['heroHeadlineEn'] ?? $body['hero_headline_en'] ?? '',
            $body['heroHeadlineAr'] ?? $body['hero_headline_ar'] ?? '',
            $body['heroSubheadlineEn'] ?? $body['hero_subheadline_en'] ?? '',
            $body['heroSubheadlineAr'] ?? $body['hero_subheadline_ar'] ?? '',
            $body['whatsappNumber'] ?? $body['whatsapp_number'] ?? DEFAULT_WHATSAPP,
            $body['contactEmail'] ?? $body['contact_email'] ?? DEFAULT_EMAIL,
        ]
    );
    echo json_encode(['success' => true]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
