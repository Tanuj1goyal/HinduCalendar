/**
 * player.js — Bhajan / Chalisa / Aarti / Katha Audio Player
 * Kurukshetra Panchang | कुरुक्षेत्र पंचांग
 *
 * Depends on: data.js (for DATA.TRACKS and TEXTS)
 */

'use strict';

/* ── PLAYER STATE ── */
var PLAYER = {
  audio:          null,
  currentIdx:     -1,
  filteredTracks: [],
  filter:         'all',
  looping:        false
};

/* ══════════════════════════════════════════
   FILTER
   ══════════════════════════════════════════ */
function bjFilter(type, btn) {
  PLAYER.filter = type;
  var btns = document.querySelectorAll('.bj-fbtn');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('on');
  btn.classList.add('on');
  renderTracks();
}

/* ══════════════════════════════════════════
   RENDER TRACK GRID
   ══════════════════════════════════════════ */
function renderTracks() {
  PLAYER.filteredTracks = PLAYER.filter === 'all'
    ? DATA.TRACKS.slice()
    : DATA.TRACKS.filter(function(t) { return t.type === PLAYER.filter; });

  var BADGE_CLASS = { chalisa:'badge-chalisa', aarti:'badge-aarti', mantra:'badge-mantra', stotra:'badge-stotra', katha:'badge-katha' };
  var BADGE_LABEL = { chalisa:'चालीसा', aarti:'आरती', mantra:'मंत्र', stotra:'स्तोत्र', katha:'कथा' };

  var html = '';
  for (var i = 0; i < PLAYER.filteredTracks.length; i++) {
    var t        = PLAYER.filteredTracks[i];
    var isPlaying = PLAYER.currentIdx === i;
    var hasText   = !!(TEXTS && TEXTS[t.textKey]);
    var bCls      = BADGE_CLASS[t.type] || 'badge-katha';
    var bLbl      = BADGE_LABEL[t.type] || 'पाठ';

    html += '<div class="track-card' + (isPlaying ? ' playing' : '') + '" id="tc-' + t.id + '">'
      + '<div class="tc-top">'
        + '<div class="tc-icon">' + t.icon + '</div>'
        + '<div class="tc-meta">'
          + '<div class="tc-name-hi">' + t.nameHi + '</div>'
          + '<div class="tc-name-en">' + t.nameEn + '</div>'
          + '<div class="tc-deity">देवता: ' + t.deityHi + '</div>'
          + '<div class="tc-badges"><span class="tc-badge ' + bCls + '">' + bLbl + '</span></div>'
        + '</div>'
      + '</div>'
      + '<div class="tc-bottom">'
        + '<span class="tc-duration">⏱ ' + t.duration + '</span>'
        + '<div style="display:flex;gap:6px;align-items:center">'
          + (hasText ? '<button class="read-btn" onclick="openModal(\'' + t.textKey + '\')">📖 पढ़ें</button>' : '')
          + '<button class="tc-play-btn" onclick="playTrack(' + i + ')">'
            + (isPlaying
                ? '<span class="tc-eq"><span></span><span></span><span></span><span></span></span> रोकें'
                : '▶ बजाएं')
          + '</button>'
        + '</div>'
      + '</div>'
      + '</div>';
  }
  document.getElementById('trackGrid').innerHTML = html;
}

/* ══════════════════════════════════════════
   PLAY / PAUSE / NAV
   ══════════════════════════════════════════ */
function playTrack(idx) {
  var track = PLAYER.filteredTracks[idx];
  if (!track) return;

  // Toggle if same track
  if (PLAYER.currentIdx === idx && PLAYER.audio) {
    if (PLAYER.audio.paused) {
      PLAYER.audio.play();
      _playerSetPlayState(true);
    } else {
      PLAYER.audio.pause();
      _playerSetPlayState(false);
    }
    renderTracks();
    return;
  }

  // Stop current
  if (PLAYER.audio) { PLAYER.audio.pause(); PLAYER.audio.src = ''; }

  PLAYER.currentIdx = idx;
  PLAYER.audio      = new Audio(track.audio);
  PLAYER.audio.volume = parseFloat(document.querySelector('.vol-slider').value || 0.8);
  PLAYER.audio.loop   = PLAYER.looping;

  PLAYER.audio.addEventListener('timeupdate',      _onTimeUpdate);
  PLAYER.audio.addEventListener('loadedmetadata',  _onMetaLoaded);
  PLAYER.audio.addEventListener('ended',           _onEnded);

  PLAYER.audio.play().catch(function() {
    document.getElementById('playerNameEn').textContent = 'Press ▶ again (browser policy)';
  });

  // Update bar
  var BADGE_LABEL = { chalisa:'चालीसा', aarti:'आरती', mantra:'मंत्र', stotra:'स्तोत्र', katha:'कथा' };
  document.getElementById('playerBar').classList.add('visible');
  document.getElementById('playerIco').textContent  = track.icon;
  document.getElementById('playerNameHi').textContent = track.nameHi;
  document.getElementById('playerNameEn').textContent = track.deityHi + ' — ' + track.nameEn;
  document.getElementById('playerTypeBadge').textContent = BADGE_LABEL[track.type] || track.type;
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('timeElapsed').textContent = '0:00';
  document.getElementById('timeDuration').textContent = track.duration;
  _playerSetPlayState(true);
  renderTracks();
}

function togglePlay() {
  if (!PLAYER.audio) return;
  if (PLAYER.audio.paused) {
    PLAYER.audio.play();
    _playerSetPlayState(true);
  } else {
    PLAYER.audio.pause();
    _playerSetPlayState(false);
  }
  renderTracks();
}

function playerPrev() {
  if (!PLAYER.filteredTracks.length) return;
  var idx = PLAYER.currentIdx <= 0 ? PLAYER.filteredTracks.length - 1 : PLAYER.currentIdx - 1;
  playTrack(idx);
}

function playerNext() {
  if (!PLAYER.filteredTracks.length) return;
  var idx = PLAYER.currentIdx >= PLAYER.filteredTracks.length - 1 ? 0 : PLAYER.currentIdx + 1;
  playTrack(idx);
}

function toggleLoop() {
  PLAYER.looping = !PLAYER.looping;
  if (PLAYER.audio) PLAYER.audio.loop = PLAYER.looping;
  var btn = document.getElementById('loopBtn');
  if (PLAYER.looping) btn.classList.add('on'); else btn.classList.remove('on');
}

function setVolume(val) {
  if (PLAYER.audio) PLAYER.audio.volume = parseFloat(val);
}

function seekAudio(e) {
  if (!PLAYER.audio || !PLAYER.audio.duration) return;
  var rect  = document.getElementById('progressTrack').getBoundingClientRect();
  var ratio = (e.clientX - rect.left) / rect.width;
  PLAYER.audio.currentTime = ratio * PLAYER.audio.duration;
}

/* ── Internal helpers ── */
function _playerSetPlayState(playing) {
  document.getElementById('playBtn').textContent = playing ? '⏸' : '▶';
  var ico = document.getElementById('playerIco');
  if (playing) ico.classList.remove('paused'); else ico.classList.add('paused');
}

function _onTimeUpdate() {
  if (!PLAYER.audio || !PLAYER.audio.duration) return;
  var pct = (PLAYER.audio.currentTime / PLAYER.audio.duration) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('timeElapsed').textContent  = secToMin(PLAYER.audio.currentTime);
}

function _onMetaLoaded() {
  document.getElementById('timeDuration').textContent = secToMin(PLAYER.audio.duration);
}

function _onEnded() {
  if (!PLAYER.looping) { _playerSetPlayState(false); renderTracks(); }
}

/* ══════════════════════════════════════════
   CHALISA TEXT MODAL
   ══════════════════════════════════════════ */
function switchModalTab(tab, btn) {
  var secs = document.querySelectorAll('.modal-section');
  var btns = document.querySelectorAll('.modal-tab-btn');
  for (var i = 0; i < secs.length; i++) secs[i].classList.remove('on');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('on');
  document.getElementById('mSec-' + tab).classList.add('on');
  btn.classList.add('on');
}

function openModal(textKey) {
  var data = TEXTS[textKey];
  if (!data) return;

  document.getElementById('modalTitle').textContent    = data.title;
  document.getElementById('modalSubtitle').textContent = data.subtitle;
  document.getElementById('modalText').innerHTML       = data.text    || '';
  document.getElementById('modalMeaning').innerHTML    = data.meaning || '<div class="purpose-text" style="text-align:center;padding:20px;color:rgba(253,246,227,.5)">अर्थ शीघ्र उपलब्ध होगा।</div>';
  document.getElementById('modalPurpose').innerHTML    = data.purpose || '<div class="purpose-text" style="text-align:center;padding:20px;color:rgba(253,246,227,.5)">महत्व शीघ्र उपलब्ध होगा।</div>';

  // Reset to text tab
  var secs = document.querySelectorAll('.modal-section');
  var btns = document.querySelectorAll('.modal-tab-btn');
  for (var i = 0; i < secs.length; i++) secs[i].classList.remove('on');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('on');
  document.getElementById('mSec-text').classList.add('on');
  btns[0].classList.add('on');

  document.getElementById('chalisaModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e.target === document.getElementById('chalisaModal')) closeModalBtn();
}

function closeModalBtn() {
  document.getElementById('chalisaModal').classList.remove('open');
  document.body.style.overflow = '';
}
