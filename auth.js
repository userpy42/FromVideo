/**
 * auth.js — Sistema di Autenticazione Simulato
 * FromVideo — Kristian Lefter, 4 I — Tesi 2025/26
 * 
 * Gestisce: Registrazione, Login, Logout
 * Storage: localStorage (simulazione lato client)
 */

// ---- COSTANTI ----
const GIFT_CARD_CODE = 'FROMVIDEO2025';
const VALID_CODES = ['FROMVIDEO2025', 'FREEACCESS', 'TESIKRISTIAN'];

// ---- UTENTE CORRENTE ----
function getCurrentUser() {
  const u = localStorage.getItem('fv_current_user');
  return u ? JSON.parse(u) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('fv_current_user', JSON.stringify(user));
}

// ---- LISTA UTENTI ----
function getUsers() {
  const u = localStorage.getItem('fv_users');
  return u ? JSON.parse(u) : [];
}

function saveUsers(users) {
  localStorage.setItem('fv_users', JSON.stringify(users));
}

// ---- REGISTRAZIONE ----
function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const password = document.getElementById('reg-password').value;
  const errorEl = document.getElementById('reg-error');

  errorEl.textContent = '';

  // Validazione
  if (!name) { errorEl.textContent = 'Inserisci il tuo nome.'; return; }
  if (!email || !email.includes('@')) { errorEl.textContent = 'Email non valida.'; return; }
  if (password.length < 6) { errorEl.textContent = 'La password deve avere almeno 6 caratteri.'; return; }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    errorEl.textContent = 'Email già registrata. Prova ad accedere.';
    return;
  }

  // Crea nuovo utente
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // In un progetto reale, questa sarebbe hashata!
    avatar: '🎬',
    plan: 'none',        // none | base | standard | premium
    codeUsed: false,
    codeActivated: null,
    registeredAt: new Date().toISOString(),
    watchedContent: []
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  closeModal('register');
  showGiftCard();
}

// ---- LOGIN ----
function handleLogin() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  errorEl.textContent = '';

  if (!email || !password) {
    errorEl.textContent = 'Compila tutti i campi.';
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    errorEl.textContent = 'Email o password non corretti.';
    return;
  }

  setCurrentUser(user);
  closeModal('login');
  goToDashboard();
}

// ---- LOGOUT ----
function handleLogout() {
  localStorage.removeItem('fv_current_user');
  window.location.href = 'index.html';
}

// ---- AGGIORNA UTENTE (es. avatar, piano) ----
function updateUser(updatedData) {
  const current = getCurrentUser();
  if (!current) return;

  const users = getUsers();
  const idx = users.findIndex(u => u.id === current.id);
  if (idx === -1) return;

  const updated = { ...users[idx], ...updatedData };
  users[idx] = updated;
  saveUsers(users);
  setCurrentUser(updated);
  return updated;
}

// ---- ATTIVA CODICE ----
function activateCode(code) {
  const cleanCode = code.trim().toUpperCase();

  if (!VALID_CODES.includes(cleanCode)) {
    return { success: false, message: 'Codice non valido. Riprova.' };
  }

  const user = getCurrentUser();
  if (!user) return { success: false, message: 'Devi essere connesso.' };

  if (user.codeUsed) {
    return { success: false, message: 'Hai già usato un codice di sblocco.' };
  }

  // Sblocca piano standard con il codice
  const updated = updateUser({
    codeUsed: true,
    codeActivated: cleanCode,
    plan: 'standard'
  });

  return { success: true, message: 'Codice attivato! Piano Standard sbloccato 🎉', user: updated };
}

// ---- ABBONAMENTO ----
function activatePlan(planName) {
  const updated = updateUser({ plan: planName });
  return updated;
}

// ---- CONTROLLA SE CONTENUTO ACCESSIBILE ----
function canAccessContent(requiredPlan) {
  const user = getCurrentUser();
  if (!user) return false;

  const planLevels = { none: 0, base: 1, standard: 2, premium: 3 };
  const userLevel = planLevels[user.plan] || 0;
  const required = planLevels[requiredPlan] || 1;

  return userLevel >= required;
}

// ---- AGGIUNGI CONTENUTO VISTO ----
function markAsWatched(contentId) {
  const user = getCurrentUser();
  if (!user) return;

  const watched = user.watchedContent || [];
  if (!watched.includes(contentId)) {
    watched.push(contentId);
    updateUser({ watchedContent: watched });
  }
}

// ---- CONTROLLA AUTH AL CARICAMENTO ----
function checkAuth() {
  const user = getCurrentUser();
  if (!user && !window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
    window.location.href = 'index.html';
  }
}
