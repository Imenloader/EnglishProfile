<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $questions = $db->query("SELECT * FROM questions ORDER BY part ASC, created_at ASC");
    foreach ($questions as &$q) {
        $q['options'] = json_decode($q['options'], true);
    }
    echo json_encode(['questions' => $questions]);

} elseif ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body) { http_response_code(400); echo json_encode(['error' => 'Invalid JSON']); exit; }

    $items = isset($body[0]) && is_array($body[0]) ? $body : [$body];

    foreach ($items as $item) {
        $id      = $item['id'] ?? bin2hex(random_bytes(16));
        $q       = $item['question'] ?? '';
        $options = json_encode($item['options'] ?? []);
        $correct = $item['correct_answer'] ?? '';
        $part    = (int)($item['part'] ?? 1);
        $level   = $item['level'] ?? 'A1';

        $existing = $db->queryOne("SELECT id FROM questions WHERE id = ?", [$id]);
        if ($existing) {
            $db->execute(
                "UPDATE questions SET question=?, options=?, correct_answer=?, part=?, level=? WHERE id=?",
                [$q, $options, $correct, $part, $level, $id]
            );
        } else {
            $db->execute(
                "INSERT INTO questions (id, question, options, correct_answer, part, level) VALUES (?, ?, ?, ?, ?, ?)",
                [$id, $q, $options, $correct, $part, $level]
            );
        }
    }
    echo json_encode(['success' => true]);

} elseif ($method === 'DELETE') {
    $action = $_GET['action'] ?? '';
    if ($action === 'delete_all') {
        $db->execute("DELETE FROM questions");
        echo json_encode(['success' => true]);
        exit;
    }

    $body = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'] ?? ($body['id'] ?? '');
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'id required']); exit; }
    $db->execute("DELETE FROM questions WHERE id = ?", [$id]);
    echo json_encode(['success' => true]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
