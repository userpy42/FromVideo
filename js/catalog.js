/* ============================
   FROMVIDEO — catalog.js
   v3 — player completo, GIF pausa,
        6 gif per episodio serie
   ============================ */

/* ── durata stringa → secondi ── */
function parseDuration(str) {
  if (!str) return 42 * 60;
  const h = str.match(/(\d+)h/), m = str.match(/(\d+)m/);
  return ((h ? +h[1] : 0) * 3600) + ((m ? +m[1] : 0) * 60);
}

/* ── secondi → "H:MM:SS" o "MM:SS" ── */
function formatSec(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2,'0');
  const s = (sec % 60).toString().padStart(2,'0');
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

/* ═══════════════════════════════════════
   DATI FILM
   ═══════════════════════════════════════ */
const FILMS = [
  { id:'film1', title:'Film1', type:'film', year:2026, genre:'GIF',      duration:'15s', rating:'1.2', color:'#1e3a8a', desc:'Un\'testo', gif:'../assets/gif/film1.gif' },
  { id:'film2', title:'Film2', type:'film', year:2026, genre:'GIF',     duration:'15s', rating:'2.8', color:'#164e63', desc:'testo', gif:'../assets/gif/film2.gif' },
  { id:'film3', title:'Film3', type:'film', year:2026, genre:'GIF', duration:'15s', rating:'1.4', color:'#1e1b4b', desc:'Un\'testo.', gif:'../assets/gif/film3.gif' },
  { id:'film4', title:'Film4', type:'film', year:2026, genre:'GIF',   duration:'15s', rating:'3.5', color:'#14532d', desc:'testo', gif:'../assets/gif/film4.gif' },
];

/* ═══════════════════════════════════════
   DATI SERIE — gif:null sulla serie,
   ogni episodio ha la sua gif individuale
   ═══════════════════════════════════════ */
const SERIES = [
  { id:'serie1', title:'Serie1', type:'serie', year:2026, genre:'GIF',   seasons:1, episodes:6, rating:'1.9', color:'#1e3a8a', desc:'Un\'testo' },
  { id:'serie2', title:'Serie2', type:'serie', year:2026, genre:'GIF',    seasons:1, episodes:6, rating:'1.4', color:'#7f1d1d', desc:'testo' },
  { id:'serie3', title:'Serie3', type:'serie', year:2026, genre:'GIF',  seasons:1, episodes:6, rating:'1.7', color:'#14532d', desc:'testo' },
  { id:'serie4', title:'Serie4', type:'serie', year:2026, genre:'GIF', seasons:1, episodes:6, rating:'3.1', color:'#713f12', desc:'testo' },
];

/* Titoli episodi */
const EPISODE_TITLES = {
  serie1: ['Il Risveglio',       'La Rete',       'Codice Rosso',          'Il Tradimento',    'Fuga dal Sistema', 'L\'Alba'      ],
  serie2: ['Prima del Crimine',  'Piste Fredde',  'Il Testimone',          'Ombre nel Buio',   'La Confessione',   'Giustizia'    ],
  serie3: ['Il Prescelto',       'La Profezia',   'Fuoco e Sangue',        'La Caduta',        'Il Ritorno',       'La Corona'    ],
  serie4: ['Segreti di Famiglia','La Chiamata',   'Punto di Non Ritorno',  'Colpevole',        'La Fuga',          'Rivelazioni'  ],
};

/* GIF episodi: serie1_ep1.gif … serie4_ep6.gif
   La funzione ritorna il path, null se non esiste ancora */
function epGif(serieId, epIndex) {
  return `../assets/gif/${serieId}_ep${epIndex + 1}.gif`;
}

/* ═══════════════════════════════════════
   STATO PLAYER
   ═══════════════════════════════════════ */
let playInterval    = null;
let playSeconds     = 0;
let playing         = false;
let currentTotalSec = 0;
let currentGifSrc   = null;   // gif del contenuto in riproduzione
let isFullscreen    = false;
let currentFilter   = 'all';
let volumeLevel     = 1;      // 0–1 (simulato)

/* ═══════════════════════════════════════
   INIT
   ═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
  const user   = Auth.getUser();
  const hasSub = user && user.subscription && user.subscription !== 'none';
  if (!hasSub) {
    document.getElementById('lock-screen').classList.remove('hidden');
  } else {
    document.getElementById('catalog-content').classList.remove('hidden');
    renderFilms(FILMS);
    renderSeries(SERIES);
    initFilters();
  }
  initKeyboard();
});

/* ═══════════════════════════════════════
   CARD CATALOGO — nessuna copertina
   ═══════════════════════════════════════ */
function renderFilms(films)   { document.getElementById('films-grid').innerHTML  = films.map(contentCard).join(''); }
function renderSeries(series) { document.getElementById('series-grid').innerHTML = series.map(contentCard).join(''); }

function contentCard(item) {
  const isSerie = item.type === 'serie';
  return `
    <div class="content-card" data-type="${item.type}" data-id="${item.id}">
      <div class="cc-thumb" style="background:linear-gradient(135deg,${item.color} 0%,#0a0a0f 100%)">
        <div class="cc-thumb-icon">${isSerie ? '📺' : '🎬'}</div>
        <div class="cc-thumb-title">${item.title}</div>
        <div class="cc-overlay">
          <button class="cc-play-btn" onclick="openPlayer('${item.title}','${item.type}','${item.id}',0)">▶</button>
          <button class="cc-info-btn" onclick="openDetails('${item.id}')">ℹ</button>
        </div>
        <div class="cc-rating">⭐ ${item.rating}</div>
      </div>
      <div class="cc-info">
        <div class="cc-title">${item.title}</div>
        <div class="cc-meta">
          <span class="badge badge-blue" style="font-size:0.65rem">${item.genre}</span>
          <span class="text-muted" style="font-size:0.75rem">${item.year}</span>
          ${isSerie
            ? `<span class="text-muted" style="font-size:0.75rem">${item.episodes} ep.</span>`
            : `<span class="text-muted" style="font-size:0.75rem">${item.duration}</span>`}
        </div>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════
   FILTRI
   ═══════════════════════════════════════ */
function initFilters() {
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      currentFilter = t.dataset.filter;
      applyFilters();
    });
  });
  document.getElementById('catalog-search').addEventListener('input', applyFilters);
}
function applyFilters() {
  const q = document.getElementById('catalog-search').value.toLowerCase();
  const af = FILMS.filter(f  => (currentFilter==='all'||currentFilter==='film')  && (f.title.toLowerCase().includes(q)||f.genre.toLowerCase().includes(q)));
  const as = SERIES.filter(s => (currentFilter==='all'||currentFilter==='serie') && (s.title.toLowerCase().includes(q)||s.genre.toLowerCase().includes(q)));
  renderFilms(af); renderSeries(as);
  document.getElementById('films-row').style.display  = af.length ? '' : 'none';
  document.getElementById('series-row').style.display = as.length ? '' : 'none';
}

/* ═══════════════════════════════════════
   PLAYER — apre il modale
   epIndex: 0 per film, 0-5 per episodio serie
   ═══════════════════════════════════════ */
function openPlayer(title, type, id, epIndex) {
  epIndex = epIndex || 0;
  const item = [...FILMS, ...SERIES].find(x => x.id === id);

  /* stop tutto */
  stopPlay();
  playSeconds = 0;

  /* durata: film → dalla sua duration, episodio → 42min */
  currentTotalSec = (type === 'film' && item) ? parseDuration(item.duration) : 42 * 60;

  /* gif: film → item.gif, episodio → serie1_ep1.gif */
  if (type === 'film' && item) {
    currentGifSrc = item.gif || null;
  } else {
    currentGifSrc = epGif(id, epIndex);
  }

  /* aggiorna header */
  document.getElementById('player-title').textContent = title;
  document.getElementById('player-total').textContent = formatSec(currentTotalSec);

  /* reset UI timer */
  updateTimerUI();

  /* apertura sempre in PAUSA con schermata nera */
  showBlackScreen(title);

  document.getElementById('player-modal').classList.add('open');
}

/* ─── schermata nera (pausa / apertura) ─── */
function showBlackScreen(label) {
  const gifWrap    = document.getElementById('player-gif-wrap');
  const blackScreen = document.getElementById('player-black-screen');
  gifWrap.style.display     = 'none';
  blackScreen.style.display = 'flex';
  if (label) document.getElementById('player-label').textContent = label;
}

/* ─── mostra gif (durante play) ─── */
function showGif(src) {
  const gifWrap     = document.getElementById('player-gif-wrap');
  const blackScreen = document.getElementById('player-black-screen');
  const gifImg      = document.getElementById('player-gif-img');

  gifImg.src = src;
  gifImg.onerror = () => {
    /* gif non trovata → schermata nera senza crash */
    gifWrap.style.display     = 'none';
    blackScreen.style.display = 'flex';
  };

  gifWrap.style.display     = 'flex';
  blackScreen.style.display = 'none';
}

/* ═══════════════════════════════════════
   CONTROLLI PLAYER
   ═══════════════════════════════════════ */

/* Play / Pausa */
function togglePlay() { playing ? pausePlay() : startPlay(); }

function startPlay() {
  playing = true;
  document.getElementById('play-pause-btn').innerHTML = '⏸';
  document.getElementById('play-pause-btn').title     = 'Pausa';

  /* mostra gif se disponibile */
  if (currentGifSrc) {
    showGif(currentGifSrc);
  }
  /* rimuovi overlay pausa se presente */
  const overlay = document.getElementById('pause-overlay');
  if (overlay) overlay.style.display = 'none';

  playInterval = setInterval(() => {
    playSeconds++;
    if (playSeconds >= currentTotalSec) {
      /* fine contenuto */
      stopPlay();
      showBlackScreen('Fine — premi ↺ per rivedere');
      return;
    }
    updateTimerUI();
  }, 1000);
}

function pausePlay() {
  playing = false;
  clearInterval(playInterval);
  document.getElementById('play-pause-btn').innerHTML = '▶';
  document.getElementById('play-pause-btn').title     = 'Play';

  /* se c'era una gif: mostra overlay pausa sopra di essa (NON nasconderla) */
  if (currentGifSrc) {
    const overlay = document.getElementById('pause-overlay');
    if (overlay) overlay.style.display = 'flex';
  }
}

function stopPlay() {
  playing = false;
  clearInterval(playInterval);
  const btn = document.getElementById('play-pause-btn');
  if (btn) { btn.innerHTML = '▶'; btn.title = 'Play'; }
  const overlay = document.getElementById('pause-overlay');
  if (overlay) overlay.style.display = 'none';
}

/* Ricomincia */
function restartPlayer() {
  stopPlay();
  playSeconds = 0;
  updateTimerUI();
  showBlackScreen(document.getElementById('player-title').textContent);
}

/* Seek — click sulla barra */
function seekBar(e) {
  const bar = document.getElementById('player-bar');
  const pct = Math.max(0, Math.min(1, (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth));
  playSeconds = Math.floor(pct * currentTotalSec);
  updateTimerUI();
}

/* Volume */
function setVolume(val) {
  volumeLevel = val;
  const icon = document.getElementById('volume-icon');
  if (!icon) return;
  if (val == 0)      icon.textContent = '🔇';
  else if (val < 0.5) icon.textContent = '🔉';
  else               icon.textContent = '🔊';
}
function toggleMute() {
  const slider = document.getElementById('volume-slider');
  if (!slider) return;
  if (volumeLevel > 0) { slider.value = 0; setVolume(0); }
  else                 { slider.value = 1; setVolume(1); }
}

/* Fullscreen della zona player (gif o schermata nera) */
function toggleFullscreen() {
  const screen = document.getElementById('player-screen');
  if (!document.fullscreenElement) {
    screen.requestFullscreen().catch(() => {});
    isFullscreen = true;
    document.getElementById('fs-btn').title = 'Esci da schermo intero';
    document.getElementById('fs-btn').innerHTML = '⛶';
  } else {
    document.exitFullscreen();
    isFullscreen = false;
    document.getElementById('fs-btn').title = 'Schermo intero';
    document.getElementById('fs-btn').innerHTML = '⛶';
  }
}

/* Aggiorna barra progresso e timer */
function updateTimerUI() {
  const pct = currentTotalSec > 0 ? (playSeconds / currentTotalSec) * 100 : 0;
  document.getElementById('player-progress').style.width = pct + '%';
  /* aggiorna posizione thumb */
  const thumb = document.getElementById('player-thumb');
  if (thumb) thumb.style.left = pct + '%';
  document.getElementById('player-time').textContent = formatSec(playSeconds);
}

/* Tastiera: Spazio = play/pausa, F = fullscreen, ← → = ±10sec */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (!document.getElementById('player-modal').classList.contains('open')) return;
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space')      { e.preventDefault(); togglePlay(); }
    if (e.code === 'KeyF')       { toggleFullscreen(); }
    if (e.code === 'ArrowRight') { playSeconds = Math.min(playSeconds + 10, currentTotalSec); updateTimerUI(); }
    if (e.code === 'ArrowLeft')  { playSeconds = Math.max(playSeconds - 10, 0); updateTimerUI(); }
  });
}

/* Chiudi modale */
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  if (id === 'player-modal') {
    stopPlay();
    playSeconds   = 0;
    currentGifSrc = null;
    if (document.fullscreenElement) document.exitFullscreen();
  }
}

/* ═══════════════════════════════════════
   DETTAGLI + LISTA EPISODI MIGLIORATA
   ═══════════════════════════════════════ */
function openDetails(id) {
  const item = [...FILMS, ...SERIES].find(x => x.id === id);
  if (!item) return;
  document.getElementById('details-title').textContent = item.title;
  const isSerie = item.type === 'serie';

  const epHtml = isSerie ? `
    <div class="episodes-list">
      <div class="ep-list-header">
        <span class="ep-list-title">Stagione 1</span>
        <span class="ep-count">${item.episodes} episodi</span>
      </div>
      ${(EPISODE_TITLES[id]||[]).map((ep, i) => `
        <div class="episode-item" onclick="openPlayer('${ep.replace(/'/g,"\\'")}','serie','${id}',${i});closeModal('details-modal')">
          <div class="ep-thumb" style="background:linear-gradient(135deg,${item.color},#0a0a0f)">
            <span class="ep-thumb-num">${i+1}</span>
            <div class="ep-thumb-play">▶</div>
          </div>
          <div class="ep-info">
            <div class="ep-title">${ep}</div>
            <div class="ep-meta">
              <span class="badge badge-blue" style="font-size:0.6rem">Ep. ${i+1}</span>
              <span class="text-muted" style="font-size:0.75rem">42 min</span>
            </div>
          </div>
          <button class="ep-play-btn btn btn-primary btn-sm">▶ Guarda</button>
        </div>`).join('')}
    </div>` : '';

  document.getElementById('details-body').innerHTML = `
    <div class="details-thumb" style="background:linear-gradient(135deg,${item.color} 0%,#0a0a0f 100%)">
      <div style="font-size:3rem;opacity:0.2">${isSerie ? '📺' : '🎬'}</div>
      <div style="font-family:var(--font-display);font-size:2rem;letter-spacing:2px;color:rgba(255,255,255,0.45)">${item.title}</div>
    </div>
    <div class="details-meta">
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem">
        <span class="badge badge-blue">${item.genre}</span>
        <span class="badge badge-gold">⭐ ${item.rating}</span>
        <span class="badge" style="background:rgba(255,255,255,0.05);color:var(--text-muted)">${item.year}</span>
        ${isSerie
          ? `<span class="badge badge-green">${item.episodes} Episodi</span>`
          : `<span class="badge badge-green">${item.duration}</span>`}
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;margin-bottom:1.5rem">${item.desc}</p>
      <button class="btn btn-primary w-full btn-lg"
        onclick="openPlayer('${isSerie ? (EPISODE_TITLES[id]||['Ep.1'])[0] : item.title}','${item.type}','${id}',0);closeModal('details-modal')">
        ▶ ${isSerie ? 'Guarda Ep. 1' : 'Guarda Ora'}
      </button>
    </div>
    ${epHtml}`;
  document.getElementById('details-modal').classList.add('open');
}
