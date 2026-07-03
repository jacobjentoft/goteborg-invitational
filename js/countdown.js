// Launch-style mission clock. Targets the next upcoming tee time, flags
// finished rounds, and fires a confetti barrage the moment a round goes live.

import { ROUNDS, CONFETTI_COLORS } from './data.js';

const LIVE_WINDOW_MS = 5 * 60 * 60 * 1000; // a round counts as "live" for ~5h

const $ = (id) => document.getElementById(id);

function nextRound(now) {
  return ROUNDS.find((r) => new Date(r.iso).getTime() > now) || null;
}
function liveRound(now) {
  return ROUNDS.find((r) => {
    const t = new Date(r.iso).getTime();
    return now >= t && now < t + LIVE_WINDOW_MS;
  }) || null;
}

function setNum(el, value) {
  const str = String(value).padStart(2, '0');
  if (el.textContent === str) return;
  el.textContent = str;
  el.classList.remove('tick');
  void el.offsetWidth; // restart the tick animation
  el.classList.add('tick');
}

async function celebrate(reducedMotion) {
  if (reducedMotion) return;
  try {
    const { default: confetti } = await import('canvas-confetti');
    const end = Date.now() + 2500;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors: CONFETTI_COLORS });
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors: CONFETTI_COLORS });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 }, colors: CONFETTI_COLORS });
  } catch { /* confetti is a luxury, not a requirement */ }
}

export function initCountdown({ reducedMotion }) {
  const els = { d: $('cd-d'), h: $('cd-h'), m: $('cd-m'), s: $('cd-s') };
  const roundEl = $('cdRound');
  const statusEl = $('cdStatus');
  const missionItems = document.querySelectorAll('#missionList li');
  if (!els.d || !roundEl || !statusEl) return;

  let celebratedIso = null;
  let lastTarget = null;

  function paintMissionList(now) {
    ROUNDS.forEach((r, i) => {
      const li = missionItems[i];
      if (!li) return;
      const t = new Date(r.iso).getTime();
      li.classList.toggle('is-done', now >= t + LIVE_WINDOW_MS);
      li.classList.toggle('is-next', (nextRound(now) || {}).n === r.n || (liveRound(now) || {}).n === r.n);
    });
  }

  function tick() {
    const now = Date.now();
    const live = liveRound(now);
    const next = nextRound(now);
    paintMissionList(now);

    if (live) {
      roundEl.textContent = `Round ${live.n}`;
      statusEl.textContent = `🔴 ROUND ${live.n} IS LIVE — balls in the air (and, statistically, the water)`;
      statusEl.classList.add('live');
      Object.values(els).forEach((el) => { el.textContent = '00'; });
      if (celebratedIso !== live.iso && lastTarget === live.iso) {
        // we watched this one hit zero in real time
        celebratedIso = live.iso;
        celebrate(reducedMotion);
      }
      return;
    }

    statusEl.classList.remove('live');

    if (!next) {
      roundEl.textContent = 'Complete';
      statusEl.textContent = 'Tournament over. All disputes now handled at Inez & Ernst.';
      Object.values(els).forEach((el) => { el.textContent = '00'; });
      return;
    }

    lastTarget = next.iso;
    roundEl.textContent = `Round ${next.n}`;
    statusEl.textContent = next.n === 1
      ? 'until wheels down on the first tee'
      : `until Round ${next.n} tees off (${next.day} ${next.time})`;

    const diff = new Date(next.iso).getTime() - now;
    setNum(els.d, Math.floor(diff / 86400000));
    setNum(els.h, Math.floor(diff / 3600000) % 24);
    setNum(els.m, Math.floor(diff / 60000) % 60);
    setNum(els.s, Math.floor(diff / 1000) % 60);
  }

  tick();
  setInterval(tick, 1000);

  // the 11:03 running joke
  const btn = $('eleven03');
  const joke = $('eleven03Joke');
  if (btn && joke) {
    const lines = [
      '* Round 3 tees off at exactly 11:03. Not 11:00. Ask the booking system.',
      '* 11:03 — three bonus minutes of warm-up that Jacob will not use.',
      '* 11:03 is the most precise thing about this entire tournament.',
      '* We could have had 11:00. The booking system said no. We respect that.',
    ];
    let i = 0;
    btn.addEventListener('click', async () => {
      i = (i + 1) % lines.length;
      joke.textContent = lines[i];
      if (reducedMotion) return;
      try {
        const { default: confetti } = await import('canvas-confetti');
        const r = btn.getBoundingClientRect();
        confetti({
          particleCount: 24, spread: 55, startVelocity: 18, scalar: 0.7,
          origin: { x: (r.left + r.width / 2) / innerWidth, y: r.top / innerHeight },
          colors: CONFETTI_COLORS,
        });
      } catch { /* fine */ }
    });
  }
}
