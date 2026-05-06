/* ============================
   FROMVIDEO — Core JS
   ============================ */

// ── Storage helpers ──
const Storage = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  remove: (k) => localStorage.removeItem(k),
};

// ── Auth helpers ──
const Auth = {
  isLoggedIn: () => !!Storage.get('fv_user'),
  getUser: () => Storage.get('fv_user'),
  setUser: (u) => Storage.set('fv_user', u),
  logout: () => { Storage.remove('fv_user'); window.location.href = '../index.html'; },
  requireAuth: () => {
    if (!Auth.isLoggedIn()) { window.location.href = '../pages/login.html'; return false; }
    return true;
  },
  requireAuthRoot: () => {
    if (!Auth.isLoggedIn()) { window.location.href = 'pages/login.html'; return false; }
    return true;
  },
};

// ── Toast ──
const Toast = {
  container: null,
  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(msg, type = 'info', duration = 3200) {
    if (!this.container) this.init();
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span style="font-size:1rem">${icons[type] || icons.info}</span><span>${msg}</span>`;
    this.container.appendChild(t);
    setTimeout(() => {
      t.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => t.remove(), 300);
    }, duration);
  },
};

// ── Navbar active link ──
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.navbar-nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') && path.endsWith(a.getAttribute('href').replace('../', '').replace('./', '')));
  });
}

// ── Hamburger menu ──
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.navbar-nav');
  if (btn && nav) btn.addEventListener('click', () => nav.classList.toggle('open'));
}

// ── Update navbar based on auth ──
function updateNavAuth() {
  const user = Auth.getUser();
  const loginBtn = document.getElementById('nav-login-btn');
  const userMenu = document.getElementById('nav-user-menu');
  const navAvatar = document.getElementById('nav-avatar');
  if (user) {
    if (loginBtn) loginBtn.classList.add('hidden');
    if (userMenu) userMenu.classList.remove('hidden');
    if (navAvatar && user.avatar) navAvatar.src = user.avatar;
  } else {
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (userMenu) userMenu.classList.add('hidden');
  }
}

// ── Gift card code generator ──
function generateGiftCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ── Subscription check ──
function hasSub() {
  const user = Auth.getUser();
  return user && user.subscription && user.subscription !== 'none';
}

// ── Format date ──
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ── DOM ready ──
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  setActiveNav();
  initHamburger();
  updateNavAuth();
});
