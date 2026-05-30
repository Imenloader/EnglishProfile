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
    $includeAnswers = ($_GET['include_answers'] ?? 'true') !== 'false';
    $leads = $db->query("SELECT * FROM leads ORDER BY created_at DESC");
    $answers = [];
    if ($includeAnswers) {
        $answers = $db->query("SELECT * FROM lead_answers ORDER BY created_at DESC");
    }
    echo json_encode(['leads' => $leads, 'answers' => $answers]);

} elseif ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body) { http_response_code(400); echo json_encode(['error' => 'Invalid JSON']); exit; }

    $name    = trim($body['name'] ?? '');
    $email   = trim($body['email'] ?? '');
    $phone   = trim($body['phone'] ?? '');
    $score   = (int)($body['score'] ?? 0);
    $total   = (int)($body['total_questions'] ?? 0);
    $level   = $body['level'] ?? null;
    $writing = $body['writing_response'] ?? null;
    $age     = $body['age_range'] ?? null;
    $company = $body['company'] ?? null;
    $format  = $body['class_format'] ?? 'online';
    $answers = $body['answers'] ?? [];

    if (!$name || !$email) {
        http_response_code(400);
        echo json_encode(['error' => 'name and email are required']);
        exit;
    }

    $leadId = bin2hex(random_bytes(16));
    $leadId = substr($leadId, 0, 8) . '-' . substr($leadId, 8, 4) . '-' . substr($leadId, 12, 4) . '-' . substr($leadId, 16, 4) . '-' . substr($leadId, 20);

    try {
        $db->execute(
            "INSERT INTO leads (id, name, email, phone, score, total_questions, level, writing_response, age_range, company, class_format) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$leadId, $name, $email, $phone ?: null, $score, $total, $level, $writing, $age, $company, $format]
        );

        if (!empty($answers) && is_array($answers)) {
            foreach ($answers as $ans) {
                $db->execute(
                    "INSERT INTO lead_answers (lead_id, student_name, question_text, student_answer, correct_answer, is_correct) VALUES (?, ?, ?, ?, ?, ?)",
                    [
                        $leadId, $name,
                        $ans['question_text'] ?? $ans['questionText'] ?? '',
                        $ans['student_answer'] ?? $ans['studentAnswer'] ?? '',
                        $ans['correct_answer'] ?? $ans['correctAnswer'] ?? '',
                        ($ans['is_correct'] ?? $ans['isCorrect'] ?? false) ? 1 : 0
                    ]
                );
            }
        }

        $lead = $db->queryOne("SELECT * FROM leads WHERE id = ?", [$leadId]);
        echo json_encode(['success' => true, 'data' => $lead]);
    } catch (Exception $e) {
        error_log("POST /api/leads failed: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save lead']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
