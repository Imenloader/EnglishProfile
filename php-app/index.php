<?php
// Main Router — reads the URL path and loads the right page
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/db.php';

// Parse URL path
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = rtrim($path, '/') ?: '/';

// Route map
$routes = [
    '/'               => 'pages/home.php',
    '/about'          => 'pages/about.php',
    '/placement-test' => 'pages/placement-test.php',
    '/admin'          => 'pages/admin.php',
    '/privacy'        => 'pages/privacy.php',
    '/terms'          => 'pages/terms.php',
];

$page = $routes[$path] ?? null;

if ($page && file_exists(__DIR__ . '/' . $page)) {
    require __DIR__ . '/' . $page;
} else {
    http_response_code(404);
    require __DIR__ . '/pages/404.php';
}
