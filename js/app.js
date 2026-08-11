/**
 * Haupt-App Logik für Navigation, Such-Trigger und DOM-Rendering
 */

document.addEventListener('DOMContentLoaded', () => {
  initApiStatusBadge();
  loadCurrentCreator();
});

function initApiStatusBadge() {
  const badge = document.getElementById('global-api-badge');
  if (!badge) return;

  const yt = localStorage.getItem('key_youtube');
  const tt = localStorage.getItem('key_tiktok');
  const ig = localStorage.getItem('key_instagram');

  const count = [yt, tt, ig].filter(Boolean).length;
  if (count > 0) {
    badge.innerHTML = `<span class="dot green"></span> ${count}/3 APIs aktiv`;
  } else {
    badge.innerHTML = `<span class="dot yellow"></span> Demo / Simulation`;
  }
}

function loadCurrentCreator() {
  const saved = localStorage.getItem('cached_creator');
  const data = saved ? JSON.parse(saved) : null;

  if (data) {
    renderUI(data);
  } else {
    // Default Start-Creator laden
    executeSearch('MrBeast');
  }
}

async function executeSearch(query) {
  const term = query || document.getElementById('search-input')?.value;
  if (!term) return alert('Bitte einen Namen eingeben!');

  try {
    const btn = document.getElementById('search-btn');
    if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Lade...';

    const data = await DataEngine.fetchAll(term);
    renderUI(data);

    if (btn) btn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Analysieren';
  } catch (e) {
    alert('Fehler beim Abruf: ' + e.message);
  }
}

function renderUI(data) {
  // 1. KPIs aktualisieren
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setTxt('kpi-followers', ChartEngine.formatNumber(data.totalFollowers));
  setTxt('kpi-views', ChartEngine.formatNumber(data.totalViews));
  setTxt('kpi-engagement', data.avgEngagement + '%');
  setTxt('profile-name', data.displayName);
  setTxt('profile-handle', '@' + data.username);
  setTxt('profile-desc', data.description);

  const avatar = document.getElementById('profile-avatar');
  if (avatar) avatar.src = data.avatar;

  // 2. Charts rendern wenn Canvas existiert
  if (document.getElementById('growthChart')) {
    ChartEngine.renderGrowthChart('growthChart', data.history);
  }
  if (document.getElementById('distributionChart')) {
    ChartEngine.renderDistributionChart('distributionChart', data.platforms);
  }
  if (document.getElementById('radarChart')) {
    ChartEngine.renderRadarChart('radarChart', data.platforms);
  }
}