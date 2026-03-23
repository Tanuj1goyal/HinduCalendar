/**
 * ui.js — UI Rendering Functions
 * Kurukshetra Panchang | कुरुक्षेत्र पंचांग
 *
 * All functions that build and inject HTML into the DOM.
 * Depends on: astronomy.js, data.js
 */

'use strict';

/* ══════════════════════════════════════════
   TAB NAVIGATION
   ══════════════════════════════════════════ */

function showTab(name, btn) {
  var panels = document.querySelectorAll('.panel');
  var tabs   = document.querySelectorAll('.ntab');
  for (var i = 0; i < panels.length; i++) panels[i].classList.remove('on');
  for (var i = 0; i < tabs.length; i++)   tabs[i].classList.remove('on');
  document.getElementById('P-' + name).classList.add('on');
  btn.classList.add('on');
}

/* ══════════════════════════════════════════
   PANCHANG TAB RENDERERS
   ══════════════════════════════════════════ */

function renderDateHero(today, tithi, sunTimes) {
  var vs  = getVikramSamvat(today);
  var hm  = getHinduMasa(today);
  var dow = today.getDay();

  document.getElementById('dateHero').innerHTML =
    '<div class="den">' + DATA.WDF[dow] + ' | ' + DATA.WDE[dow] + ', '
      + DATA.ENM[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear() + '</div>'
    + '<div class="dhi">' + toHindi(today.getDate()) + ' ' + DATA.HIM[today.getMonth()]
      + ' ' + toHindi(today.getFullYear()) + ' — ' + DATA.WDF[dow] + '</div>'
    + '<div class="srow">'
      + '<span class="sbadge">विक्रम संवत् ' + toHindi(vs) + '</span>'
      + '<span class="sbadge">हिन्दू मास: ' + hm + '</span>'
      + '<span class="sbadge">' + tithi.paksha + ' पक्ष</span>'
    + '</div>';
}

function renderSunMoon(sunTimes, moonriseMins) {
  var dayLen = sunTimes.sunset - sunTimes.sunrise;
  var items = [
    { ico: '🌅', en: 'SUNRISE',    hi: 'सूर्योदय',   v: fmtTime(sunTimes.sunrise) },
    { ico: '🌇', en: 'SUNSET',     hi: 'सूर्यास्त',   v: fmtTime(sunTimes.sunset) },
    { ico: '☀️', en: 'SOLAR NOON', hi: 'मध्याह्न',    v: fmtTime(sunTimes.noon) },
    { ico: '📏', en: 'DAY LENGTH', hi: 'दिन लंबाई',   v: fmtDuration(dayLen) },
    { ico: '🌕', en: 'MOONRISE',   hi: 'चन्द्रोदय',   v: fmtTime(moonriseMins) },
    { ico: '🌑', en: 'MOONSET',    hi: 'चन्द्रास्त',   v: fmtTime(moonriseMins + 746) }
  ];
  var html = '';
  for (var i = 0; i < items.length; i++) {
    var x = items[i];
    html += '<div class="smi">'
      + '<div class="smico">' + x.ico + '</div>'
      + '<div class="smlbl">' + x.en  + '</div>'
      + '<div class="smval">' + x.v   + '</div>'
      + '<div class="smsub">' + x.hi  + '</div>'
      + '</div>';
  }
  document.getElementById('smGrid').innerHTML = html;
}

function renderPanchang5Grid(today, tithi, naksh, yoga, karana) {
  var rows = [
    { lbl: 'TITHI',     hi2: tithi.paksha + ' ' + tithi.nameHi, en2: (tithi.paksha === 'शुक्ल' ? 'Shukla' : 'Krishna') + ' ' + tithi.nameEn },
    { lbl: 'NAKSHATRA', hi2: naksh.hi,  en2: naksh.en },
    { lbl: 'YOGA',      hi2: yoga,      en2: yoga },
    { lbl: 'KARANA',    hi2: karana,    en2: karana },
    { lbl: 'PAKSHA',    hi2: tithi.paksha + ' पक्ष', en2: tithi.paksha === 'शुक्ल' ? 'Shukla Paksha' : 'Krishna Paksha' },
    { lbl: 'VAAR',      hi2: DATA.WDF[today.getDay()], en2: DATA.WDEN_FULL[today.getDay()] }
  ];
  var html = '';
  for (var i = 0; i < rows.length; i++) {
    html += '<div class="pi">'
      + '<div class="pilbl">' + rows[i].lbl  + '</div>'
      + '<div class="pihi">'  + rows[i].hi2  + '</div>'
      + '<div class="pien">'  + rows[i].en2  + '</div>'
      + '</div>';
  }
  document.getElementById('p5Grid').innerHTML = html;
}

function renderRahuGrid(containerId, kaal) {
  var periods = [
    { en: 'Rahu Kaal',   hi: 'राहु काल',   t: kaal.rahu   },
    { en: 'Gulika Kaal', hi: 'गुलिका काल', t: kaal.gulika },
    { en: 'Yamaganda',   hi: 'यमगण्ड',     t: kaal.yama   }
  ];
  var html = '';
  for (var i = 0; i < periods.length; i++) {
    var p = periods[i];
    html += '<div class="ri bad">'
      + '<div class="rien">' + p.en + '</div>'
      + '<div class="rihi">' + p.hi + '</div>'
      + '<div class="ritm">' + fmtTime(p.t.start) + ' – ' + fmtTime(p.t.end) + '</div>'
      + '</div>';
  }
  document.getElementById(containerId).innerHTML = html;
}

function renderMuhurats(containerId, kaal) {
  var BMAP = {
    shubh:  { bg: 'rgba(76,175,80,.2)',  cl: '#81C784',        lbl: 'शुभ'   },
    ashubh: { bg: 'rgba(181,37,42,.2)',  cl: '#EF5350',        lbl: 'अशुभ'  },
    medium: { bg: 'rgba(212,160,23,.2)', cl: 'var(--gold)',    lbl: 'मध्यम' }
  };
  var data = [
    { hi: 'ब्रह्म मुहूर्त',  en: 'Brahma Muhurat',  t: kaal.brahma,  type: 'shubh'  },
    { hi: 'अभिजित मुहूर्त', en: 'Abhijit Muhurat', t: kaal.abhijit, type: 'shubh'  },
    { hi: 'विजय मुहूर्त',   en: 'Vijaya Muhurat',  t: kaal.vijaya,  type: 'shubh'  },
    { hi: 'गोधूलि मुहूर्त', en: 'Godhuli Muhurat', t: kaal.godhuli, type: 'shubh'  },
    { hi: 'निशिता मुहूर्त', en: 'Nishita Muhurat', t: kaal.nishita, type: 'medium' },
    { hi: 'राहु काल',        en: 'Rahu Kaal',        t: kaal.rahu,    type: 'ashubh' },
    { hi: 'गुलिका काल',      en: 'Gulika Kaal',      t: kaal.gulika,  type: 'ashubh' },
    { hi: 'यमगण्ड',          en: 'Yamaganda',        t: kaal.yama,    type: 'ashubh' }
  ];
  var html = '';
  for (var i = 0; i < data.length; i++) {
    var m = data[i], b = BMAP[m.type];
    html += '<div class="mit ' + m.type + '">'
      + '<div class="mdot"></div>'
      + '<div class="mnm"><div class="mhi">' + m.hi + '</div><div class="men">' + m.en + '</div></div>'
      + '<div class="mtm">'
        + '<div>' + fmtTime(m.t.start) + ' – ' + fmtTime(m.t.end) + '</div>'
        + '<div class="mbdg" style="background:' + b.bg + ';color:' + b.cl + '">' + b.lbl + '</div>'
      + '</div>'
      + '</div>';
  }
  document.getElementById(containerId).innerHTML = html;
}

/* ══════════════════════════════════════════
   CALENDAR TAB
   ══════════════════════════════════════════ */

var CAL_STATE = { year: 0, month: 0 };

function initCalendarState(today) {
  CAL_STATE.year  = today.getFullYear();
  CAL_STATE.month = today.getMonth();
}

function calNav(delta) {
  CAL_STATE.month += delta;
  if (CAL_STATE.month > 11) { CAL_STATE.month = 0; CAL_STATE.year++; }
  if (CAL_STATE.month <  0) { CAL_STATE.month = 11; CAL_STATE.year--; }
  renderCalendar(new Date());
}

function renderCalendar(today) {
  var Y = CAL_STATE.year, M = CAL_STATE.month;
  var midDate = new Date(Y, M, 15);

  document.getElementById('calHi').textContent = DATA.HIM[M] + ' ' + toHindi(Y) + ' | ' + getHinduMasa(midDate);
  document.getElementById('calEn').textContent = DATA.ENM[M].toUpperCase() + ' ' + Y;

  var fd  = new Date(Y, M, 1).getDay();
  var dim = new Date(Y, M + 1, 0).getDate();
  var dip = new Date(Y, M, 0).getDate();

  var html = '';

  // Day headers
  for (var i = 0; i < 7; i++) {
    html += '<div class="ch"><span style="color:var(--gold)">' + DATA.WDS[i] + '</span><br>' + DATA.WDE[i] + '</div>';
  }

  // Prev month filler
  for (var i = fd - 1; i >= 0; i--) {
    html += '<div class="cd om"><div class="cde">' + (dip - i) + '</div></div>';
  }

  // Current month days
  for (var d = 1; d <= dim; d++) {
    var jd    = julianDay(new Date(Y, M, d, 12, 0, 0));
    var tithi = getTithi(jd);
    var isT   = (d === today.getDate() && M === today.getMonth() && Y === today.getFullYear());

    // Find festivals for this date
    var dayFests = [];
    for (var k = 0; k < DATA.FESTIVALS.length; k++) {
      var f = DATA.FESTIVALS[k];
      if (f.d.getFullYear() === Y && f.d.getMonth() === M && f.d.getDate() === d) {
        dayFests.push(f);
      }
    }
    var hasEcl  = dayFests.some(function(f) { return f.type === 'eclipse'; });
    var hasFest = dayFests.some(function(f) { return f.type !== 'eclipse'; });

    var cls = 'cd'
      + (isT    ? ' tod' : '')
      + (hasFest ? ' fd'  : '')
      + (hasEcl  ? ' ecd' : '');

    var festHtml = '';
    for (var k = 0; k < Math.min(dayFests.length, 2); k++) {
      var f   = dayFests[k];
      var ico = f.type === 'eclipse' ? '🌑' : f.type === 'ekadashi' ? '🙏' : '🪔';
      var nm  = f.hi.length > 10 ? f.hi.substring(0, 10) + '…' : f.hi;
      var col = f.type === 'eclipse' ? ' style="color:#aaaaff"' : '';
      festHtml += '<div class="cdf"' + col + '>' + ico + nm + '</div>';
    }

    html += '<div class="' + cls + '">'
      + '<div class="cde">' + d + '</div>'
      + '<div class="cdh">' + toHindi(d) + '</div>'
      + '<div class="cdt">' + (tithi.paksha === 'शुक्ल' ? 'शु' : 'कृ') + ' ' + tithi.nameHi.substring(0, 4) + '</div>'
      + festHtml
      + (hasEcl ? '<span class="cel">ग्रहण</span>' : '')
      + '</div>';
  }

  // Next month filler
  var rem = (fd + dim) % 7;
  for (var i = 1; i <= (rem === 0 ? 0 : 7 - rem); i++) {
    html += '<div class="cd om"><div class="cde">' + i + '</div></div>';
  }

  document.getElementById('calGrid').innerHTML = html;
}

/* ══════════════════════════════════════════
   FESTIVALS TAB
   ══════════════════════════════════════════ */

var FEST_FILTER = 'all';

function filterFest(type, btn) {
  FEST_FILTER = type;
  var btns = document.querySelectorAll('.fbtn');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('on');
  btn.classList.add('on');
  renderFestivals(new Date());
}

function renderFestivals(today) {
  var now = new Date(); now.setHours(0, 0, 0, 0);

  var list = FEST_FILTER === 'all'
    ? DATA.FESTIVALS.slice()
    : DATA.FESTIVALS.filter(function(f) { return f.type === FEST_FILTER; });

  list.sort(function(a, b) { return a.d - b.d; });

  var BMAP = {
    festival: ['#FFB347', 'rgba(232,96,10,.2)',    'त्योहार'],
    vrat:     ['var(--pink)', 'rgba(232,116,138,.2)', 'व्रत'],
    ekadashi: ['var(--pink)', 'rgba(232,116,138,.2)', 'एकादशी'],
    eclipse:  ['#aaaaff', 'rgba(100,100,255,.2)',   'ग्रहण']
  };

  var html = '';
  for (var i = 0; i < list.length; i++) {
    var f      = list[i];
    var past   = f.d < now && f.d.toDateString() !== now.toDateString();
    var isToday = f.d.toDateString() === now.toDateString();
    var bm      = BMAP[f.type] || BMAP.festival;
    var timing  = f.s && f.e ? f.s + ' – ' + f.e : (f.s || '');
    var dStr    = f.d.getDate() + ' ' + DATA.ENM[f.d.getMonth()] + ' ' + f.d.getFullYear();
    var dHi     = toHindi(f.d.getDate()) + ' ' + DATA.HIM[f.d.getMonth()];

    var typeCls = '';
    if (f.type === 'eclipse')                       typeCls = ' fec';
    else if (f.type === 'vrat' || f.type === 'ekadashi') typeCls = ' fvt';

    html += '<div class="fi' + typeCls + (past ? ' fpst' : '') + (isToday ? ' ftd' : '') + '">'
      + '<div>'
        + '<div class="fde">' + dStr + '</div>'
        + '<div class="fdh">' + dHi  + '</div>'
        + '<span class="fbd" style="background:' + bm[1] + ';color:' + bm[0] + '">' + bm[2] + '</span>'
      + '</div>'
      + '<div>'
        + '<div class="ffh">' + f.hi + '</div>'
        + '<div class="ffe">' + f.en + '</div>'
        + (f.note ? '<div style="font-size:.65rem;color:rgba(253,246,227,.4);margin-top:2px">' + f.note + '</div>' : '')
      + '</div>'
      + '<div class="fti">' + timing + '</div>'
      + '</div>';
  }

  document.getElementById('flist').innerHTML = html;
}

/* ══════════════════════════════════════════
   ECLIPSE TAB
   ══════════════════════════════════════════ */

function renderEclipses() {
  var eclipses = DATA.FESTIVALS.filter(function(f) { return f.type === 'eclipse'; });
  var html = '';

  for (var i = 0; i < eclipses.length; i++) {
    var e   = eclipses[i];
    var sol = e.en.indexOf('Solar') >= 0;

    var phases = sol ? [
      { n: 'सूतक प्रारम्भ | Sutak',      t: '12 घंटे पूर्व' },
      { n: 'पहला स्पर्श | First Contact', t: e.s },
      { n: 'वलय / पूर्णता | Maximum',    t: addHoursToTimeStr(e.s, 1.5) },
      { n: 'अंतिम स्पर्श | Last Contact', t: e.e },
      { n: 'स्नान-दान | After Eclipse',  t: e.e + ' के बाद' }
    ] : [
      { n: 'सूतक प्रारम्भ | Sutak',      t: '9 घंटे पूर्व' },
      { n: 'उपच्छाया | Penumbra Begins', t: e.s },
      { n: 'पूर्ण ग्रास | Totality',     t: addHoursToTimeStr(e.s, 1) },
      { n: 'मोक्ष | Eclipse Ends',       t: e.e },
      { n: 'स्नान-दान | After Eclipse',  t: e.e + ' के बाद' }
    ];

    var dStr = e.d.getDate() + ' ' + DATA.ENM[e.d.getMonth()] + ' ' + e.d.getFullYear();

    html += '<div class="ei">'
      + '<div class="ety">' + (sol ? '☀️ SURYA GRAHAN' : '🌕 CHANDRA GRAHAN') + '</div>'
      + '<div class="enhi">' + e.hi + '</div>'
      + '<div class="edtxt">📅 ' + dStr + ' | ' + e.en + '</div>'
      + (e.note ? '<div style="font-size:.68rem;color:#aaaaff;margin-top:3px">📍 ' + e.note + '</div>' : '')
      + '<div class="eph">';

    for (var j = 0; j < phases.length; j++) {
      html += '<div class="ep"><span class="epn">' + phases[j].n + '</span><span class="ept">' + phases[j].t + '</span></div>';
    }
    html += '</div><div class="enote">* IST में अनुमानित। ब्रह्मसर / सन्निहित सरोवर स्नान का विशेष पुण्य।</div></div>';
  }

  document.getElementById('eGrid').innerHTML = html;
}

function addHoursToTimeStr(str, hrs) {
  var m = str.match(/(\d{1,2}):(\d{2})/);
  if (!m) return str;
  var hh = parseInt(m[1]) + Math.floor(hrs);
  var mm = parseInt(m[2]) + Math.round((hrs % 1) * 60);
  if (mm >= 60) { hh++; mm -= 60; }
  return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
}
