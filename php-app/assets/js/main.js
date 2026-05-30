// ============================================================
// LinguaPlanet Main JS
// ============================================================

// ---- Theme ----
function getTheme() { return localStorage.getItem('lp-theme') || 'dark'; }
function setTheme(t) {
  localStorage.setItem('lp-theme', t);
  document.documentElement.setAttribute('data-theme', t);
  const icon = document.getElementById('themeIcon');
  const iconM = document.getElementById('themeIconMobile');
  const cls = t === 'dark' ? 'fa-sun' : 'fa-moon';
  if (icon) icon.className = 'fa-solid ' + cls;
  if (iconM) iconM.className = 'fa-solid ' + cls;
}
function toggleTheme() { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

// ---- Language ----
function getLang() { return localStorage.getItem('lp-lang') || 'en'; }
function setLang(l) {
  localStorage.setItem('lp-lang', l);
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  applyTranslations();
}
function toggleLang() { setLang(getLang() === 'en' ? 'ar' : 'en'); }

function applyTranslations() {
  const l = getLang();
  const attr = 'data-' + l;
  // All elements with data-en / data-ar
  document.querySelectorAll('[data-en]').forEach(el => {
    const txt = el.getAttribute(attr);
    if (txt) el.textContent = txt;
  });
  // Update lang toggle button
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = l.toUpperCase();
  // Update lang-mobile button
  const btnM = document.querySelector('.btn-lang-mobile');
  if (btnM) btnM.textContent = l === 'en' ? 'Switch to Arabic' : 'Switch to English';
  // Update slogan
  const slogan = document.getElementById('navSlogan');
  if (slogan) slogan.textContent = l === 'ar' ? 'حيث يصبح النجاح عادة' : 'Where Success Becomes A Habit';
}

// ---- Navbar scroll ----
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  let raf;
  window.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }, { passive: true });
  // Ctrl+L → admin
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); location.href = '/admin'; }
  });
}

// ---- Mobile Drawer ----
function toggleMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const icon = document.getElementById('menuIcon');
  if (!drawer) return;
  const open = drawer.classList.toggle('open');
  backdrop.classList.toggle('open', open);
  if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  document.body.style.overflow = open ? 'hidden' : '';
}

// ---- Scroll to Top ----
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
}

// ---- Scroll Progress ----
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }, { passive: true });
}

// ---- AOS Init ----
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 80 });
  }
}

// ---- Contact Modal ----
function openContactModal() {
  const m = document.getElementById('contactModal');
  if (m) m.classList.add('open');
}
function closeContactModal() {
  const m = document.getElementById('contactModal');
  if (m) m.classList.remove('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeContactModal(); });

// ---- Contact Form Submit ----
async function submitContactForm(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type=submit]');
  const name = form.querySelector('[name=name]').value;
  const email = form.querySelector('[name=email]').value;
  const phone = form.querySelector('[name=phone]')?.value || '';
  const program = form.querySelector('[name=program]')?.value || '';
  const message = form.querySelector('[name=message]').value;

  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const res = await fetch('/api/inquiries.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message: `[Program: ${program}] [Phone: ${phone}] ${message}` })
    });
    const data = await res.json();
    if (data.success) {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#25D366';
      form.reset();
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Send Message';
        btn.style.background = '';
        closeContactModal();
      }, 3000);
    } else throw new Error();
  } catch {
    btn.textContent = 'Error. Try again.';
    btn.style.background = '#ef4444';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Send Message';
      btn.style.background = '';
    }, 3000);
  }
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme & language
  setTheme(getTheme());
  applyTranslations();
  initNavbar();
  initScrollTop();
  initScrollProgress();
  initAOS();
});
