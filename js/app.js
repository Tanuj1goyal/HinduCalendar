/**
 * app.js — Application Entry Point
 * Kurukshetra Panchang | कुरुक्षेत्र पंचांग
 *
 * Bootstraps the app: loads CSV data, computes today's values,
 * renders all panels, and starts the live clock.
 *
 * Load order: astronomy.js → data.js → texts.js → ui.js → player.js → gitaved.js → app.js
 */

'use strict';

/* ── TODAY (computed once) ── */
var TODAY   = new Date();
var TODAY_JD = julianDay(TODAY);
var SUN     = getSunTimes(TODAY);
var TITHI   = getTithi(TODAY_JD);
var NAKSH   = getNakshatra(TODAY_JD);
var YOGA_T  = getYoga(TODAY_JD);
var KARAN_T = getKarana(TODAY_JD);
var KAAL    = getKaalTimings(TODAY, SUN.sunrise, SUN.sunset);
var MOONR   = getMoonriseMins(TODAY);

/* ── BOOTSTRAP ── */
function boot() {
  // Load festivals.csv and tracks.csv, then render everything
  loadAllData(function() {
    renderAll();
  });
}

function renderAll() {
  // ── Panchang tab ──
  renderDateHero(TODAY, TITHI, SUN);
  renderSunMoon(SUN, MOONR);
  renderPanchang5Grid(TODAY, TITHI, NAKSH, YOGA_T, KARAN_T);
  renderRahuGrid('rg1', KAAL);
  renderMuhurats('ml1', KAAL);

  // ── Calendar tab ──
  initCalendarState(TODAY);
  renderCalendar(TODAY);

  // ── Festivals tab ──
  renderFestivals(TODAY);

  // ── Muhurat tab ──
  document.getElementById('mBanner').textContent =
    'आज: ' + DATA.WDF[TODAY.getDay()] + ', '
    + toHindi(TODAY.getDate()) + ' ' + DATA.HIM[TODAY.getMonth()] + ' '
    + toHindi(TODAY.getFullYear()) + ' — कुरुक्षेत्र';
  renderMuhurats('ml2', KAAL);
  renderRahuGrid('rg2', KAAL);

  // ── Eclipse tab ──
  renderEclipses();

  // ── Bhajan tab ──
  renderTracks();

  // ── Gita/Veda tab ──
  renderGVGrid();

  // ── Live clock ──
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  document.getElementById('clk').textContent = formatClockIST();
}

/* ── Start app ── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
