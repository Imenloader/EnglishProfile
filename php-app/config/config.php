<?php
// ============================================================
// LinguaPlanet Configuration
// ============================================================

// ⚠️  Fill these values from Hostinger hPanel → Databases
define('DB_HOST', 'localhost');
define('DB_NAME', 'u775794095_linguaplanet');
define('DB_USER', 'u775794095_admin');
define('DB_PASS', 'Terminator@778');
define('DB_CHARSET', 'utf8mb4');

// App Settings
define('APP_NAME', 'Linguaplanet');
define('APP_URL', 'https://linguaplanet.org');
define('ADMIN_PASSWORD', 'linguaplanet2025!');  // Change this!

// Upload settings
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('UPLOAD_URL', APP_URL . '/uploads/');
define('MAX_UPLOAD_SIZE', 10 * 1024 * 1024); // 10MB

// Site settings defaults
define('DEFAULT_WHATSAPP', '+201270068237');
define('DEFAULT_EMAIL', 'hello@linguaplanet.org');

// Error reporting (set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
