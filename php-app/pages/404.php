<?php
$pageTitle = '404 - Page Not Found | Linguaplanet';
require_once __DIR__ . '/../includes/head.php';
?>
<?php require_once __DIR__ . '/../includes/navbar.php'; ?>
<section style="min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;background:var(--bg-color);padding:4rem 2rem">
  <div>
    <div style="font-size:8rem;font-family:var(--font-serif);background:var(--gold-gradient);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;line-height:1">404</div>
    <h1 style="font-size:2rem;color:var(--text-color);margin:2rem 0 1rem" data-en="Page Not Found" data-ar="الصفحة غير موجودة">Page Not Found</h1>
    <p style="color:var(--text-color-muted);margin-bottom:3rem" data-en="The page you're looking for doesn't exist." data-ar="الصفحة التي تبحث عنها غير موجودة.">The page you're looking for doesn't exist.</p>
    <a href="/" class="btn-master btn-gold" data-en="BACK TO HOME" data-ar="العودة للرئيسية">BACK TO HOME</a>
  </div>
</section>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
<?php require_once __DIR__ . '/../includes/foot.php'; ?>
