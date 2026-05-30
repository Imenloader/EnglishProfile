<?php
// Helper: get current page for nav active state
function currentPage(): string {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    return rtrim($path, '/') ?: '/';
}

function isActive(string $href): string {
    return currentPage() === $href ? 'nav-active' : '';
}
?>
<!DOCTYPE html>
<html lang="<?= $lang ?? 'en' ?>" dir="<?= ($lang ?? 'en') === 'ar' ? 'rtl' : 'ltr' ?>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title><?= htmlspecialchars($pageTitle ?? 'Linguaplanet | Where Success Becomes a Habit') ?></title>
  <meta name="description" content="<?= htmlspecialchars($pageDesc ?? 'Empowering language learners in Egypt with world-class English education.') ?>">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <!-- AOS Animations -->
  <link rel="stylesheet" href="https://unpkg.com/aos@2.3.4/dist/aos.css">

  <!-- Main CSS -->
  <link rel="stylesheet" href="/assets/css/style.css?v=1">

  <!-- Favicon -->
  <link rel="icon" href="/assets/images/logo-icon.jpg" type="image/jpeg">

  <!-- Theme init (prevent flash) -->
  <script>
    (function() {
      var t = localStorage.getItem('lp-theme') || 'dark';
      document.documentElement.setAttribute('data-theme', t);
      var l = localStorage.getItem('lp-lang') || 'en';
      document.documentElement.lang = l;
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    })();
  </script>
</head>
<body>
