// Tee-time forecast via MET Norway (the engine behind yr.no).
// Free API, no key, CORS-open; attribution required and rendered in the section.
// Data is 6-hourly far out and hourly close in, so we snap each tee time to the
// nearest timeseries entry. Fails soft to a friendly message.

import { ROUNDS } from './data.js';

const LAT = 57.75, LON = 11.97; // Sankt Jörgen Park, Göteborg
const API = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${LAT}&lon=${LON}`;
const ICONS = 'https://cdn.jsdelivr.net/gh/metno/weathericons@main/weather/svg/';
const CACHE_KEY = 'gi-wx';
const CACHE_TTL = 60 * 60 * 1000; // be polite: refetch at most hourly

const EMOJI = [
  [/clearsky/, '☀️'], [/fair/, '🌤️'], [/partlycloudy/, '⛅'], [/cloudy/, '☁️'],
  [/thunder/, '⛈️'], [/sleet|snow/, '🌨️'], [/rain|showers/, '🌧️'], [/fog/, '🌫️'],
];
const emojiFor = (sym) => (EMOJI.find(([re]) => re.test(sym)) || [, '🌡️'])[1];

function quip(sym, wind) {
  if (/thunder/.test(sym)) return 'Play fast. Metal sticks, open field — do the math.';
  if (wind >= 8) return 'Add two clubs and a prayer.';
  if (/rain|sleet|showers/.test(sym)) return 'Rudi’s water balls are getting company.';
  if (/fog/.test(sym)) return 'Nobody sees your shank. Advantage: Daddy.';
  if (/clearsky|fair/.test(sym)) return 'Sunscreen is mandatory. Excuses are not.';
  return 'Perfect scoring weather. No pressure.';
}

async function getForecast() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (c && Date.now() - c.t < CACHE_TTL) return c.d;
  } catch { /* bad cache, refetch */ }
  const res = await fetch(API);
  if (!res.ok) throw new Error(`met.no ${res.status}`);
  const d = await res.json();
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d })); } catch { /* full */ }
  return d;
}

function nearest(series, target) {
  let best = null, bestGap = Infinity;
  for (const entry of series) {
    const gap = Math.abs(new Date(entry.time) - target);
    if (gap < bestGap) { bestGap = gap; best = entry; }
  }
  return bestGap <= 3.5 * 3600 * 1000 ? best : null; // 6-hourly data → ≤3.5h snap
}

function dayRange(series, dateStr) {
  const temps = series
    .filter((e) => new Date(e.time).toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' }) === dateStr)
    .map((e) => e.data.instant.details.air_temperature);
  return temps.length ? { hi: Math.max(...temps), lo: Math.min(...temps) } : null;
}

function roundHTML(r, entry, range) {
  if (!entry) {
    return `
    <article class="wx-card">
      <p class="wx-day">${r.day} · ${r.date}</p>
      <h3>Round ${r.n} · ${r.time}</h3>
      <p class="wx-quip">Forecast doesn’t reach this far yet — check back closer to the weekend.</p>
    </article>`;
  }
  const det = entry.data.instant.details;
  const next = entry.data.next_1_hours || entry.data.next_6_hours || {};
  const sym = next.summary?.symbol_code || 'fair_day';
  const precip = next.details?.precipitation_amount ?? 0;
  const temp = Math.round(det.air_temperature);
  const wind = Math.round(det.wind_speed);
  return `
  <article class="wx-card">
    <p class="wx-day">${r.day} · ${r.date}</p>
    <h3>Round ${r.n} · tee ${r.time}</h3>
    <div class="wx-main">
      <img class="wx-icon" src="${ICONS}${sym}.svg" alt="${sym.replace(/_/g, ' ')}"
        loading="lazy" onerror="this.outerHTML='<span class=&quot;wx-icon wx-emoji&quot;>${emojiFor(sym)}</span>'">
      <span class="wx-temp">${temp}°</span>
    </div>
    <ul class="wx-details">
      ${range ? `<li>↑ ${Math.round(range.hi)}° · ↓ ${Math.round(range.lo)}°</li>` : ''}
      <li>💨 ${wind} m/s</li>
      <li>💧 ${precip.toLocaleString('sv-SE')} mm</li>
    </ul>
    <p class="wx-quip">${quip(sym, det.wind_speed)}</p>
  </article>`;
}

export function initWeather() {
  const grid = document.getElementById('wxGrid');
  if (!grid) return;
  getForecast()
    .then((d) => {
      const series = d.properties.timeseries;
      grid.innerHTML = ROUNDS.map((r) =>
        roundHTML(r, nearest(series, new Date(r.iso)), dayRange(series, r.iso.slice(0, 10)))
      ).join('');
      const upd = document.getElementById('wxUpdated');
      if (upd) {
        upd.textContent = 'Updated ' + new Date(d.properties.meta.updated_at)
          .toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm', dateStyle: 'short', timeStyle: 'short' });
      }
    })
    .catch(() => {
      grid.innerHTML = `<p class="wx-error">Couldn’t reach the weather service.
        Working assumption: Swedish summer — pack for all four seasons anyway.</p>`;
    });
}
