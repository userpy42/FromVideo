/* catalog.js */

const FILMS = [
  { id:'film1', title:'Film1', type:'film', year:2024, genre:'Azione', duration:'2h 18m', rating:'8.2', desc:'Un\'avventura epica che attraversa continenti e secoli. Il film più atteso dell\'anno con effetti speciali mozzafiato.', color:'#1e3a8a' },
  { id:'film2', title:'Film2', type:'film', year:2023, genre:'Thriller', duration:'1h 54m', rating:'7.8', desc:'Un thriller psicologico che ti terrà incollato allo schermo fino all\'ultimo minuto. Niente è come sembra.', color:'#164e63' },
  { id:'film3', title:'Film3', type:'film', year:2024, genre:'Fantascienza', duration:'2h 35m', rating:'9.0', desc:'Un\'odissea fantascientifica che esplora i confini dell\'universo e della coscienza umana.', color:'#1e1b4b' },
  { id:'film4', title:'Film4', type:'film', year:2023, genre:'Drammatico', duration:'1h 48m', rating:'7.5', desc:'Una storia commovente di amicizia e sacrificio ambientata nella Seconda Guerra Mondiale.', color:'#14532d' },
];

const SERIES = [
  { id:'serie1', title:'Serie1', type:'serie', year:2024, genre:'Sci-Fi', seasons:1, episodes:6, rating:'8.9', desc:'Un\'avvincente serie fantascientifica ambientata in un futuro distopico dove la tecnologia ha sostituito l\'umanità.', color:'#1e3a8a' },
  { id:'serie2', title:'Serie2', type:'serie', year:2023, genre:'Crime', seasons:1, episodes:6, rating:'8.4', desc:'Un detective tormentato dal passato indaga su una serie di omicidi misteriosi in una città corrotta.', color:'#7f1d1d' },
  { id:'serie3', title:'Serie3', type:'serie', year:2024, genre:'Fantasy', seasons:1, episodes:6, rating:'8.7', desc:'Draghi, magia e battaglie epiche in un mondo fantasy dove i destini di regni interi sono in bilico.', color:'#14532d' },
  { id:'serie4', title:'Serie4', type:'serie', year:2023, genre:'Thriller', seasons:1, episodes:6, rating:'8.1', desc:'Una famiglia normale si trova coinvolta in una cospirazione internazionale che minaccia di distruggerla.', color:'#713f12' },
];

const EPISODE_TITLES = {
  serie1: ['Il Risveglio','La Rete','Codice Rosso','Il Tradimento','Fuga dal Sistema','L\'Alba'],
  serie2: ['Prima del Crimine','Piste Fredde','Il Testimone','Ombre nel Buio','La Confessione','Giustizia'],
  serie3: ['Il Prescelto','La Profezia','Fuoco e Sangue','La Caduta','Il Ritorno','La Corona'],
  serie4: ['Segreti di Famiglia','La Chiamata','Punto di Non Ritorno','Colpevole','La Fuga','Rivelazioni'],
};

let playInterval = null;
let playSeconds = 0;
let playing = false;
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
  const user = Auth.getUser();
  const hasSub = user && user.subscription && user.subscription !== 'none';

  if (!hasSub) {
    document.getElementById('lock-screen').classList.remove('hidden');
  } else {
    document.getElementById('catalog-content').classList.remove('hidden');
    renderFilms(FILMS);
    renderSeries(SERIES);
    initFilters();
  }
});

function renderFilms(films) {
  const grid = document.getElementById('films-grid');
  grid.innerHTML = films.map(f => contentCard(f)).join('');
}

function renderSeries(series) {
  const grid = document.getElementById('series-grid');
  grid.innerHTML = series.map(s => contentCard(s)).join('');
}

function contentCard(item) {
  const isSerie = item.type === 'serie';
  return `
    <div class="content-card" data-type="${item.type}" data-id="${item.id}">
      <div class="cc-thumb" style="background:linear-gradient(135deg,${item.color} 0%,#0a0a0f 100%)">
        <div class="cc-thumb-label">${isSerie ? '📺' : '🎬'}</div>
        <div class="cc-overlay">
          <button class="cc-play-btn" onclick="openPlayer('${item.title}','${item.type}','${item.id}')">▶</button>
          <button class="cc-info-btn" onclick="openDetails('${item.id}')">ℹ</button>
        </div>
        <div class="cc-rating">⭐ ${item.rating}</div>
      </div>
      <div class="cc-info">
        <div class="cc-title">${item.title}</div>
        <div class="cc-meta">
          <span class="badge badge-blue" style="font-size:0.65rem">${item.genre}</span>
          <span class="text-muted" style="font-size:0.75rem">${item.year}</span>
          ${isSerie ? `<span class="text-muted" style="font-size:0.75rem">${item.episodes} ep.</span>` : `<span class="text-muted" style="font-size:0.75rem">${item.duration}</span>`}
        </div>
      </div>
    </div>
  `;
}

function initFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const search = document.getElementById('catalog-search');

  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      currentFilter = t.dataset.filter;
      applyFilters();
    });
  });

  search.addEventListener('input', applyFilters);
}

function applyFilters() {
  const q = document.getElementById('catalog-search').value.toLowerCase();
  const allFilms = FILMS.filter(f => (currentFilter === 'all' || currentFilter === 'film') && (f.title.toLowerCase().includes(q) || f.genre.toLowerCase().includes(q)));
  const allSeries = SERIES.filter(s => (currentFilter === 'all' || currentFilter === 'serie') && (s.title.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q)));
  renderFilms(allFilms);
  renderSeries(allSeries);
  document.getElementById('films-row').style.display = allFilms.length ? '' : 'none';
  document.getElementById('series-row').style.display = allSeries.length ? '' : 'none';
}

function openPlayer(title, type, id) {
  stopPlay();
  playSeconds = 0;
  document.getElementById('player-title').textContent = title;
  document.getElementById('player-now-playing').textContent = 'Ora in riproduzione: ' + title;
  document.getElementById('player-time').textContent = '00:00';
  document.getElementById('player-progress').style.width = '0%';
  document.getElementById('play-pause-btn').textContent = '▶ Play';
  document.getElementById('player-modal').classList.add('open');
}

function openDetails(id) {
  const item = [...FILMS, ...SERIES].find(x => x.id === id);
  if (!item) return;
  document.getElementById('details-title').textContent = item.title;
  const isSerie = item.type === 'serie';
  const epHtml = isSerie ? `
    <div class="episodes-list">
      <h4 style="margin-bottom:0.75rem;font-size:0.95rem;color:var(--text-secondary)">Episodi — Stagione 1</h4>
      ${(EPISODE_TITLES[id] || []).map((ep, i) => `
        <div class="episode-item" onclick="openPlayer('${item.title} — Ep.${i+1}: ${ep}','serie','${id}')">
          <div class="ep-num">E${i+1}</div>
          <div class="ep-info">
            <div class="ep-title">${ep}</div>
            <div class="ep-meta text-muted" style="font-size:0.78rem">~42 min</div>
          </div>
          <button class="btn btn-primary btn-sm">▶</button>
        </div>
      `).join('')}
    </div>
  ` : '';

  document.getElementById('details-body').innerHTML = `
    <div class="details-thumb" style="background:linear-gradient(135deg,${item.color} 0%,#0a0a0f 100%)">
      <div style="font-size:3rem;opacity:0.3">${isSerie ? '📺' : '🎬'}</div>
    </div>
    <div class="details-meta">
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem">
        <span class="badge badge-blue">${item.genre}</span>
        <span class="badge badge-gold">⭐ ${item.rating}</span>
        <span class="badge" style="background:rgba(255,255,255,0.05);color:var(--text-muted)">${item.year}</span>
        ${isSerie ? `<span class="badge badge-green">${item.episodes} Episodi</span>` : `<span class="badge badge-green">${item.duration}</span>`}
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;margin-bottom:1.5rem">${item.desc}</p>
      <button class="btn btn-primary w-full btn-lg" onclick="openPlayer('${item.title}','${item.type}','${id}');closeModal('details-modal')">▶ Guarda Ora</button>
    </div>
    ${epHtml}
  `;
  document.getElementById('details-modal').classList.add('open');
}

function togglePlay() {
  if (playing) stopPlay();
  else startPlay();
}

function startPlay() {
  playing = true;
  document.getElementById('play-pause-btn').textContent = '⏸ Pausa';
  const totalSec = 138 * 60;
  playInterval = setInterval(() => {
    playSeconds++;
    if (playSeconds >= totalSec) { stopPlay(); return; }
    const m = Math.floor(playSeconds / 60).toString().padStart(2,'0');
    const s = (playSeconds % 60).toString().padStart(2,'0');
    document.getElementById('player-time').textContent = m + ':' + s;
    document.getElementById('player-progress').style.width = ((playSeconds / totalSec) * 100) + '%';
  }, 1000);
}

function stopPlay() {
  playing = false;
  clearInterval(playInterval);
  const btn = document.getElementById('play-pause-btn');
  if (btn) btn.textContent = '▶ Play';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  if (id === 'player-modal') stopPlay();
}
