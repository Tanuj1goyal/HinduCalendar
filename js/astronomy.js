/**
 * astronomy.js — Core Vedic Astronomical Calculations
 * Kurukshetra Panchang | कुरुक्षेत्र पंचांग
 *
 * All planetary positions use LAHIRI AYANAMSHA (sidereal correction)
 * Location: Kurukshetra, Haryana (29.9695°N, 76.8783°E, IST UTC+5:30)
 */

'use strict';

/* ── SITE CONSTANTS ── */
var PANCHANG = {
  LAT:       29.9695,
  LON:       76.8783,
  IST_HOURS: 5.5,        // UTC+5:30
  IST_MINS:  330         // 5.5 × 60
};

/* ── MATH HELPERS ── */
function d2r(deg) { return deg * Math.PI / 180; }
function r2d(rad) { return rad * 180 / Math.PI; }
function norm360(x) { return ((x % 360) + 360) % 360; }

/* ── FORMAT HELPERS ── */
var HN = ['०','१','२','३','४','५','६','७','८','९'];
function toHindi(n) {
  return String(n).replace(/[0-9]/g, function(d) { return HN[+d]; });
}

/**
 * Format minutes-since-midnight to "HH:MM AM/PM"
 * Normalises across midnight automatically
 */
function fmtTime(totalMins) {
  var m   = ((totalMins % 1440) + 1440) % 1440;
  var h24 = Math.floor(m / 60);
  var mn  = Math.round(m % 60);
  var ap  = h24 < 12 ? 'AM' : 'PM';
  var h12 = h24 % 12 || 12;
  return (h12 < 10 ? '0' : '') + h12 + ':' + (mn < 10 ? '0' : '') + mn + ' ' + ap;
}

/** Minutes → "Xh Ym" */
function fmtDuration(mins) {
  return Math.floor(mins / 60) + 'h ' + Math.round(mins % 60) + 'm';
}

/** Seconds → "X:YY" */
function secToMin(s) {
  s = Math.floor(s || 0);
  var m = Math.floor(s / 60), sec = s % 60;
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

/* ── JULIAN DAY ── */
/**
 * Converts a JavaScript Date to Julian Day Number.
 * Uses 12:00 local noon unless hours are provided.
 */
function julianDay(date) {
  var Y  = date.getFullYear();
  var M  = date.getMonth() + 1;
  var D  = date.getDate();
  var UT = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  var y = Y, m = M;
  if (m <= 2) { y--; m += 12; }
  var A = Math.floor(y / 100);
  var B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716))
       + Math.floor(30.6001 * (m + 1))
       + D + UT / 24 + B - 1524.5;
}

/* ── LAHIRI AYANAMSHA ── */
/**
 * Returns Lahiri ayanamsha in degrees for a given Julian Day.
 * Lahiri (Chitrapaksha) is the official ayanamsha used by
 * the Indian government for Panchang calculations.
 *
 * Formula: 23.85° at J2000.0 + 1.3972°/century precession
 */
function getLahiriAyanamsha(jd) {
  var T = (jd - 2451545.0) / 36525.0;   // Julian centuries from J2000
  return 23.85 + 1.3972 * T;
}

/* ── TROPICAL SUN LONGITUDE ── */
function sunLonTropical(jd) {
  var n = jd - 2451545.0;
  var L = norm360(280.460 + 0.9856474 * n);
  var g = d2r(norm360(357.528 + 0.9856003 * n));
  return norm360(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
}

/* ── SIDEREAL SUN LONGITUDE (Vedic / Hindu) ── */
function sunLonSidereal(jd) {
  return norm360(sunLonTropical(jd) - getLahiriAyanamsha(jd));
}

/* ── TROPICAL MOON LONGITUDE ── */
function moonLonTropical(jd) {
  var n = jd - 2451545.0;
  var L = norm360(218.316 + 13.176396 * n);
  var M = d2r(norm360(134.963 + 13.064993 * n));
  var F = d2r(norm360(93.272  + 13.229350 * n));
  return norm360(L + 6.289 * Math.sin(M) - 1.274 * Math.sin(2 * F - M) + 0.658 * Math.sin(2 * F));
}

/* ── SIDEREAL MOON LONGITUDE (Vedic) ── */
function moonLonSidereal(jd) {
  return norm360(moonLonTropical(jd) - getLahiriAyanamsha(jd));
}

/* ── SUNRISE / SUNSET ── */
/**
 * Computes sunrise and sunset for Kurukshetra in IST minutes-from-midnight.
 * Uses NOAA solar algorithm with equation of time.
 * Returns { sunrise, sunset, noon } all in minutes since midnight IST.
 */
function getSunTimes(date) {
  var jd = julianDay(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
  var n  = jd - 2451545.0;

  var L0 = norm360(280.46646 + 0.9850397 * n);
  var M  = d2r(norm360(357.52911 + 0.98560028 * n));
  var C  = (1.914602 - 0.004817 * (n / 36525) - 0.000014 * Math.pow(n / 36525, 2)) * Math.sin(M)
           + 0.019993 * Math.sin(2 * M)
           + 0.000289 * Math.sin(3 * M);
  var sL  = norm360(L0 + C);
  var eps = 23.439 - 0.0000004 * n;
  var decl = Math.asin(Math.sin(d2r(eps)) * Math.sin(d2r(sL)));

  // Equation of time (minutes)
  var y2  = Math.pow(Math.tan(d2r(eps / 2)), 2);
  var L0r = d2r(L0);
  var eqT = 4 * r2d(
    y2 * Math.sin(2 * L0r)
    - 2 * 0.016708 * Math.sin(M)
    + 4 * 0.016708 * y2 * Math.sin(M) * Math.cos(2 * L0r)
    - 0.5 * y2 * y2 * Math.sin(4 * L0r)
    - 1.25 * 0.016708 * 0.016708 * Math.sin(2 * M)
  );

  var noonUT = 720 - 4 * PANCHANG.LON - eqT;
  var latR   = d2r(PANCHANG.LAT);
  var cosHA  = (Math.cos(d2r(90.833)) - Math.sin(latR) * Math.sin(decl))
               / (Math.cos(latR) * Math.cos(decl));

  // Polar day/night guard (won't happen at Kurukshetra latitude)
  if (Math.abs(cosHA) > 1) {
    return { sunrise: 360, sunset: 1080, noon: noonUT + PANCHANG.IST_MINS };
  }

  var HA = r2d(Math.acos(cosHA));
  return {
    sunrise: noonUT - 4 * HA + PANCHANG.IST_MINS,
    sunset:  noonUT + 4 * HA + PANCHANG.IST_MINS,
    noon:    noonUT           + PANCHANG.IST_MINS
  };
}

/* ── MOONRISE (approximate) ── */
/**
 * Approximate moonrise in IST minutes-from-midnight.
 * Moon rises ~50 minutes later each day through its 29.53-day cycle.
 */
function getMoonriseMins(date) {
  var jd      = julianDay(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
  var elapsed = jd - 2451545.0;
  return ((6 * 60 + (elapsed * 1440 / 29.53)) % 1440 + 1440) % 1440;
}

/* ── PANCHANG ELEMENTS ── */

/**
 * Tithi — lunar day (1–30).
 * Uses SIDEREAL longitudes as per Vedic tradition.
 * Returns { paksha, tNum, nameHi, nameEn }
 */
function getTithi(jd) {
  var moonS = moonLonSidereal(jd);
  var sunS  = sunLonSidereal(jd);
  var diff  = norm360(moonS - sunS);
  var t     = Math.floor(diff / 12);              // 0–29
  var paksha = t < 15 ? 'शुक्ल' : 'कृष्ण';
  var tNum   = t < 15 ? t : t - 15;               // 0–14

  var TITHI_HI = ['प्रतिपदा','द्वितीया','तृतीया','चतुर्थी','पञ्चमी','षष्ठी','सप्तमी','अष्टमी','नवमी','दशमी','एकादशी','द्वादशी','त्रयोदशी','चतुर्दशी','पूर्णिमा'];
  var TITHI_EN = ['Pratipada','Dvitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima'];

  // Special case: 15th tithi in Krishna paksha = Amavasya
  var nameHi = (t === 29) ? 'अमावस्या' : TITHI_HI[Math.min(tNum, 14)];
  var nameEn = (t === 29) ? 'Amavasya'  : TITHI_EN[Math.min(tNum, 14)];
  return { paksha: paksha, tNum: tNum, nameHi: nameHi, nameEn: nameEn };
}

/**
 * Nakshatra — lunar mansion (1–27).
 * Based on sidereal Moon longitude.
 */
function getNakshatra(jd) {
  var NAKSH_HI = ['अश्विनी','भरणी','कृत्तिका','रोहिणी','मृगशिरा','आर्द्रा','पुनर्वसु','पुष्य','आश्लेषा','मघा','पू.फाल्गुनी','उ.फाल्गुनी','हस्त','चित्रा','स्वाति','विशाखा','अनुराधा','ज्येष्ठा','मूल','पू.आषाढ़ा','उ.आषाढ़ा','श्रवण','धनिष्ठा','शतभिषा','पू.भाद्रपद','उ.भाद्रपद','रेवती'];
  var NAKSH_EN = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
  var idx = Math.floor(moonLonSidereal(jd) / (360 / 27)) % 27;
  return { hi: NAKSH_HI[idx], en: NAKSH_EN[idx] };
}

/**
 * Yoga — combination of Sun + Moon longitudes (1–27).
 */
function getYoga(jd) {
  var YOGAS = ['विष्कम्भ','प्रीति','आयुष्मान','सौभाग्य','शोभन','अतिगण्ड','सुकर्म','धृति','शूल','गण्ड','वृद्धि','ध्रुव','व्याघात','हर्षण','वज्र','सिद्धि','व्यतीपात','वरीयान','परिघ','शिव','सिद्ध','साध्य','शुभ','शुक्ल','ब्रह्म','इन्द्र','वैधृति'];
  var sum = norm360(sunLonSidereal(jd) + moonLonSidereal(jd));
  return YOGAS[Math.floor(sum / (360 / 27)) % 27];
}

/**
 * Karana — half a tithi (1–11, cyclic).
 */
function getKarana(jd) {
  var KARANAS = ['बव','बालव','कौलव','तैतिल','गर','वणिज','विष्टि','शकुनि','चतुष्पाद','नाग','किंस्तुघ्न'];
  var diff = norm360(moonLonSidereal(jd) - sunLonSidereal(jd));
  return KARANAS[Math.floor(diff / 6) % 11];
}

/* ── HINDU MONTH (MASA) ── */
/**
 * Returns the correct Hindu solar month name based on sidereal Sun rashi.
 *
 * Mapping (Lahiri sidereal):
 *   Sun in Mesha   (0–30°)   → Vaishakha begins
 *   Sun in Vrishabha (30–60°)→ Jyeshtha begins
 *   ...
 *   Sun in Meena  (330–360°) → CHAITRA begins  ← March is here
 *
 * This correctly shows Chaitra for March (when Sun is in sidereal Meena)
 * instead of the wrong tropical Vaishakha.
 */
function getHinduMasa(date) {
  var jd    = julianDay(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
  var rashi = Math.floor(sunLonSidereal(jd) / 30);  // 0=Mesha … 11=Meena

  // The Hindu lunar month is named after the nakshatra nearest to the
  // full moon. Conventionally each rashi maps to the following masa:
  var MASA = [
    'वैशाख',      // 0  Mesha      (Apr 14 – May 14)
    'ज्येष्ठ',    // 1  Vrishabha  (May 14 – Jun 14)
    'आषाढ़',      // 2  Mithuna    (Jun 14 – Jul 14)
    'श्रावण',     // 3  Karka      (Jul 14 – Aug 14)
    'भाद्रपद',    // 4  Simha      (Aug 14 – Sep 14)
    'आश्विन',     // 5  Kanya      (Sep 14 – Oct 14)
    'कार्तिक',    // 6  Tula       (Oct 14 – Nov 14)
    'मार्गशीर्ष', // 7  Vrischika  (Nov 14 – Dec 14)
    'पौष',        // 8  Dhanu      (Dec 14 – Jan 14)
    'माघ',        // 9  Makara     (Jan 14 – Feb 14)
    'फाल्गुन',    // 10 Kumbha     (Feb 14 – Mar 14)
    'चैत्र'       // 11 Meena      (Mar 14 – Apr 14) ← CORRECT for March
  ];
  return MASA[rashi];
}

/* ── VIKRAM SAMVAT ── */
/**
 * Accurate Vikram Samvat year.
 * VS increments at Chaitra Shukla Pratipada = day after Mesha Sankranti.
 * Mesha Sankranti ≈ April 14 each year.
 *
 * Before Mesha Sankranti: VS = Gregorian year + 56
 * On/after Mesha Sankranti: VS = Gregorian year + 57
 */
function getVikramSamvat(date) {
  var meshaDate = new Date(date.getFullYear(), 3, 14);  // April 14
  return date >= meshaDate
    ? date.getFullYear() + 57
    : date.getFullYear() + 56;
}

/* ── KAALA TIMINGS ── */
/**
 * Rahu Kaal, Gulika, Yamaganda + auspicious muhurats.
 * Day is split into 8 equal parts from sunrise to sunset.
 * Returns all timings as { start, end } in IST minutes-from-midnight.
 *
 * Rahu Kaal part index by weekday (Sun=0 … Sat=6):
 */
var RAHU_IDX   = [8, 2, 7, 5, 6, 4, 3];
var GULIKA_IDX = [6, 5, 4, 3, 2, 1, 7];
var YAMA_IDX   = [4, 3, 2, 1, 7, 6, 5];

function getKaalTimings(date, sunrise, sunset) {
  var dow  = date.getDay();
  var day  = sunset - sunrise;     // total day length in minutes
  var part = day / 8;              // each kaala unit

  function slot(idx) {
    return { start: sunrise + (idx - 1) * part, end: sunrise + idx * part };
  }

  return {
    rahu:    slot(RAHU_IDX[dow]),
    gulika:  slot(GULIKA_IDX[dow]),
    yama:    slot(YAMA_IDX[dow]),
    abhijit: { start: sunrise + day / 2 - 24, end: sunrise + day / 2 + 24 },
    brahma:  { start: sunrise - 96,            end: sunrise - 48 },
    vijaya:  { start: sunrise + 3 * part,      end: sunrise + 3 * part + 24 },
    godhuli: { start: sunset - 24,             end: sunset + 12 },
    nishita: { start: sunset + 360,            end: sunset + 408 }
  };
}

/* ── LIVE IST CLOCK ── */
/**
 * Returns current time as IST Date object,
 * correcting for the visitor's local timezone offset.
 */
function getNowIST() {
  var now = new Date();
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000 + PANCHANG.IST_HOURS * 3600000);
}

function formatClockIST() {
  var ist  = getNowIST();
  var h24  = ist.getHours();
  var mn   = ist.getMinutes();
  var sc   = ist.getSeconds();
  var ap   = h24 < 12 ? 'AM' : 'PM';
  var h12  = h24 % 12 || 12;
  return (h12 < 10 ? '0' : '') + h12 + ':'
       + (mn < 10 ? '0' : '') + mn + ':'
       + (sc < 10 ? '0' : '') + sc + ' ' + ap + ' IST — कुरुक्षेत्र';
}
