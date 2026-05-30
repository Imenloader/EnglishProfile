<nav id="navbar">
  <div class="container nav-inner">
    <!-- Logo -->
    <a href="/" class="nav-brand">
      <div class="nav-logo-wrap">
        <img src="/assets/images/logo-icon.jpg" alt="Linguaplanet Logo" class="nav-logo-img">
      </div>
      <div class="nav-brand-text">
        <img src="/assets/images/logo-text.jpg" alt="Linguaplanet" class="nav-logo-text" id="navLogoText">
        <span class="nav-slogan" id="navSlogan">Where Success Becomes A Habit</span>
      </div>
    </a>

    <!-- Desktop Nav -->
    <div class="nav-links" id="navLinks">
      <a href="/#about" class="nav-link" data-en="About" data-ar="من نحن">About</a>
      <a href="/#services" class="nav-link" data-en="Programs" data-ar="البرامج">Programs</a>
      <a href="/#team" class="nav-link" data-en="Team" data-ar="الفريق">Team</a>
      <a href="/placement-test" class="nav-link" data-en="Placement Test" data-ar="اختبار تحديد المستوى">Placement Test</a>
    </div>

    <!-- Controls -->
    <div class="nav-controls">
      <button class="btn-lang" id="langToggle" onclick="toggleLang()">EN</button>
      <button class="btn-icon" id="themeToggle" onclick="toggleTheme()">
        <i class="fa-solid fa-moon" id="themeIcon"></i>
      </button>
      <button class="btn-hamburger mobile-only" id="menuToggle" onclick="toggleMenu()">
        <i class="fa-solid fa-bars" id="menuIcon"></i>
      </button>
    </div>
  </div>

  <!-- Mobile Drawer -->
  <div class="mobile-drawer" id="mobileDrawer">
    <div class="mobile-drawer-inner">
      <button class="drawer-close" onclick="toggleMenu()"><i class="fa-solid fa-xmark"></i></button>
      <a href="/#about" class="drawer-link" data-en="About" data-ar="من نحن" onclick="toggleMenu()">About</a>
      <a href="/#services" class="drawer-link" data-en="Programs" data-ar="البرامج" onclick="toggleMenu()">Programs</a>
      <a href="/#team" class="drawer-link" data-en="Team" data-ar="الفريق" onclick="toggleMenu()">Team</a>
      <a href="/placement-test" class="drawer-link" data-en="Placement Test" data-ar="اختبار تحديد المستوى" onclick="toggleMenu()">Placement Test</a>
      <div class="drawer-actions">
        <button class="btn-lang-mobile" onclick="toggleLang(); toggleMenu()">Switch to Arabic</button>
        <button class="btn-icon" onclick="toggleTheme()"><i class="fa-solid fa-moon" id="themeIconMobile"></i></button>
      </div>
    </div>
  </div>
  <div class="drawer-backdrop" id="drawerBackdrop" onclick="toggleMenu()"></div>
</nav>
