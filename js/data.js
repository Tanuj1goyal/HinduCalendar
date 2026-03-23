/**
 * data.js — Data Loader & Static Lookup Tables
 * Kurukshetra Panchang | कुरुक्षेत्र पंचांग
 *
 * Parses CSV data files and provides all lookup arrays.
 * FESTIVALS and TRACKS are loaded from data/*.csv at runtime.
 */

'use strict';

/* ══════════════════════════════════════════
   LOOKUP TABLES
   ══════════════════════════════════════════ */

var DATA = {

  HIM: ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून',
        'जुलाई','अगस्त','सितम्बर','अक्टूबर','नवम्बर','दिसम्बर'],

  ENM: ['January','February','March','April','May','June',
        'July','August','September','October','November','December'],

  WDS: ['रवि','सोम','मंगल','बुध','गुरु','शुक्र','शनि'],
  WDE: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  WDF: ['रविवार','सोमवार','मंगलवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'],
  WDEN_FULL: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],

  // Festivals & tracks — populated by loadCSV()
  FESTIVALS: [],
  TRACKS: []
};

/* ══════════════════════════════════════════
   CSV PARSER
   Simple RFC-4180 compatible CSV parser.
   Handles quoted fields with commas inside.
   ══════════════════════════════════════════ */

/**
 * Parses a CSV string into array of objects keyed by header row.
 * @param {string} text — raw CSV content
 * @returns {Array<Object>}
 */
function parseCSV(text) {
  var lines  = text.trim().split('\n');
  var header = splitCSVLine(lines[0]);
  var rows   = [];
  for (var i = 1; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    var vals = splitCSVLine(line);
    var obj  = {};
    for (var j = 0; j < header.length; j++) {
      obj[header[j].trim()] = (vals[j] || '').trim();
    }
    rows.push(obj);
  }
  return rows;
}

/** Splits a single CSV line respecting quoted fields */
function splitCSVLine(line) {
  var result = [], cur = '', inQ = false;
  for (var i = 0; i < line.length; i++) {
    var c = line[i];
    if (c === '"') {
      inQ = !inQ;
    } else if (c === ',' && !inQ) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

/* ══════════════════════════════════════════
   FESTIVAL CSV → Runtime objects
   ══════════════════════════════════════════ */

/**
 * Converts a festival CSV row into a runtime festival object.
 * date column format: YYYY-MM-DD
 */
function festivalFromCSV(row) {
  var parts = row.date.split('-');
  var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
  return {
    d:    d,
    hi:   row.nameHi,
    en:   row.nameEn,
    type: row.type,
    s:    row.timeStart || '',
    e:    row.timeEnd   || '',
    note: row.note      || ''
  };
}

/* ══════════════════════════════════════════
   TRACK CSV → Runtime objects
   ══════════════════════════════════════════ */

/**
 * Converts a track CSV row into a runtime track object.
 */
function trackFromCSV(row) {
  return {
    id:       row.id,
    nameHi:   row.nameHi,
    nameEn:   row.nameEn,
    deityHi:  row.deityHi,
    deityEn:  row.deityEn,
    type:     row.type,
    icon:     row.icon,
    duration: row.duration,
    audio:    'audio/' + row.audioFile,
    textKey:  row.textKey
  };
}

/* ══════════════════════════════════════════
   ASYNC CSV LOADER
   Fetches CSV files relative to index.html.
   Falls back to inline defaults if fetch fails
   (e.g. opened as file:// without a server).
   ══════════════════════════════════════════ */

function loadAllData(onComplete) {
  var pending = 2;
  function done() { pending--; if (pending === 0) onComplete(); }

  // Load festivals.csv
  fetchText('data/festivals.csv', function(text) {
    if (text) {
      var rows = parseCSV(text);
      DATA.FESTIVALS = rows.map(festivalFromCSV);
    }
    done();
  });

  // Load tracks.csv
  fetchText('data/tracks.csv', function(text) {
    if (text) {
      var rows = parseCSV(text);
      DATA.TRACKS = rows.map(trackFromCSV);
    }
    done();
  });
}

/**
 * Fetches a text file. Calls callback(text) on success,
 * callback(null) on failure (so caller can use fallback data).
 */
function fetchText(url, callback) {
  if (typeof fetch !== 'undefined') {
    fetch(url)
      .then(function(r) { return r.ok ? r.text() : Promise.reject(r.status); })
      .then(function(t) { callback(t); })
      .catch(function() { callback(null); });
  } else {
    // XMLHttpRequest fallback for older browsers
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() { callback(xhr.status === 200 ? xhr.responseText : null); };
    xhr.onerror = function() { callback(null); };
    xhr.send();
  }
}
