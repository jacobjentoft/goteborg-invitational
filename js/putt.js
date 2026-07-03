// The 19th Hole: slingshot putting on a floodlit night green.
// Drag back from the ball, release to putt. Water = "Rudi tax" (+1, re-drop).
// Vanilla canvas, pointer events, works with touch.

import { CONFETTI_COLORS } from './data.js';

const W = 420, H = 640;
const BALL_R = 8, HOLE_R = 13;
const HOLE = { x: 140, y: 110 };
const START = { x: 140, y: 560 };
const WATER = { x: 190, y: 265, w: 210, h: 58 };   // pond guarding the right side
const BUNKER = { x: 290, y: 170, r: 44 };          // sand behind-right of the hole
const FRICTION = 0.985, SAND_FRICTION = 0.94, STOP_SPEED = 0.06;
const MAX_DRAG = 240, POWER = 0.055, SKIP_SPEED = 7.5;

export function initPutt() {
  const canvas = document.getElementById('puttCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  const strokesEl = document.getElementById('puttStrokes');
  const bestEl = document.getElementById('puttBest');
  const msgEl = document.getElementById('puttMsg');
  const resetBtn = document.getElementById('puttReset');

  const state = {
    ball: { ...START }, vel: { x: 0, y: 0 },
    strokes: 0, sunk: false, drag: null, trail: [],
  };

  let best = Number(localStorage.getItem('gi-putt-best')) || null;
  const paintBest = () => { bestEl.textContent = best ? `${best} stroke${best > 1 ? 's' : ''}` : '—'; };
  paintBest();

  const say = (text, hot = false) => {
    msgEl.textContent = text;
    msgEl.classList.toggle('hot', hot);
  };

  function reset() {
    Object.assign(state, {
      ball: { ...START }, vel: { x: 0, y: 0 },
      strokes: 0, sunk: false, drag: null, trail: [],
    });
    strokesEl.textContent = '0';
    say('Drag, release, glory.');
  }
  resetBtn.addEventListener('click', reset);

  // ---- input (slingshot) ----
  const toLocal = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };
  const speed = () => Math.hypot(state.vel.x, state.vel.y);

  canvas.addEventListener('pointerdown', (e) => {
    if (state.sunk || speed() > STOP_SPEED) return;
    try { canvas.setPointerCapture(e.pointerId); } catch { /* stale pointer id */ }
    state.drag = { start: toLocal(e), now: toLocal(e) };
  });
  canvas.addEventListener('pointermove', (e) => {
    if (state.drag) state.drag.now = toLocal(e);
  });
  canvas.addEventListener('pointerup', () => {
    if (!state.drag) return;
    const dx = state.drag.start.x - state.drag.now.x;
    const dy = state.drag.start.y - state.drag.now.y;
    state.drag = null;
    const len = Math.min(Math.hypot(dx, dy), MAX_DRAG);
    if (len < 12) return; // too gentle, not a stroke
    const ang = Math.atan2(dy, dx);
    state.vel.x = Math.cos(ang) * len * POWER;
    state.vel.y = Math.sin(ang) * len * POWER;
    state.strokes += 1;
    strokesEl.textContent = String(state.strokes);
    say(len > 200 ? 'Full send. Very KH of you.' : '');
  });

  async function celebrate() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      const { default: confetti } = await import('canvas-confetti');
      const r = canvas.getBoundingClientRect();
      confetti({
        particleCount: 120, spread: 75,
        origin: { x: (r.left + r.width / 2) / innerWidth, y: (r.top + HOLE.y / H * r.height) / innerHeight },
        colors: CONFETTI_COLORS,
      });
    } catch { /* fine */ }
  }

  function sink() {
    state.sunk = true;
    state.vel = { x: 0, y: 0 };
    const n = state.strokes;
    if (!best || n < best) {
      best = n;
      localStorage.setItem('gi-putt-best', String(n));
      paintBest();
      say(`🏆 In ${n}! New clubhouse record!`, true);
    } else {
      say(`⛳ In ${n}! ${n === 1 ? 'An ace. Suspiciously un-Jacob.' : 'The record stands.'}`, true);
    }
    celebrate();
    setTimeout(() => { if (state.sunk) reset(); }, 2600);
  }

  function physics() {
    const b = state.ball, v = state.vel;
    if (state.sunk) return;
    b.x += v.x; b.y += v.y;

    const inSand = Math.hypot(b.x - BUNKER.x, b.y - BUNKER.y) < BUNKER.r;
    const f = inSand ? SAND_FRICTION : FRICTION;
    v.x *= f; v.y *= f;

    // cushions
    if (b.x < 20 + BALL_R) { b.x = 20 + BALL_R; v.x *= -0.6; }
    if (b.x > W - 20 - BALL_R) { b.x = W - 20 - BALL_R; v.x *= -0.6; }
    if (b.y < 20 + BALL_R) { b.y = 20 + BALL_R; v.y *= -0.6; }
    if (b.y > H - 20 - BALL_R) { b.y = H - 20 - BALL_R; v.y *= -0.6; }

    // water: fast balls skip across, slow balls pay the Rudi tax
    const inWater = b.x > WATER.x && b.x < WATER.x + WATER.w
      && b.y > WATER.y && b.y < WATER.y + WATER.h;
    if (inWater && speed() < SKIP_SPEED) {
      state.strokes += 1;
      strokesEl.textContent = String(state.strokes);
      Object.assign(b, START);
      state.vel = { x: 0, y: 0 };
      state.trail = [];
      say('💦 Splash! Rudi tax: +1. Re-dropping…');
      return;
    }

    // the hole
    const dHole = Math.hypot(b.x - HOLE.x, b.y - HOLE.y);
    if (dHole < HOLE_R - 3 && speed() < 4.2) { sink(); return; }
    if (dHole < HOLE_R && speed() >= 4.2) say('Lip out! Too much heat.');

    if (speed() > STOP_SPEED) {
      state.trail.push({ x: b.x, y: b.y });
      if (state.trail.length > 22) state.trail.shift();
    } else if (speed() > 0) {
      v.x = 0; v.y = 0;
      state.trail = [];
    }
  }

  // ---- rendering ----
  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    // night green + fringe
    ctx.fillStyle = '#0a1d13';
    roundRect(0, 0, W, H, 20); ctx.fill();
    ctx.fillStyle = '#14503a';
    roundRect(14, 14, W - 28, H - 28, 14); ctx.fill();
    // mow stripes
    ctx.fillStyle = 'rgba(255,255,255,0.025)';
    for (let y = 14; y < H - 14; y += 56) { ctx.fillRect(14, y, W - 28, 28); }

    // bunker
    ctx.fillStyle = '#d9c493';
    ctx.beginPath(); ctx.ellipse(BUNKER.x, BUNKER.y, BUNKER.r, BUNKER.r * 0.78, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(BUNKER.x + 4, BUNKER.y + 5, BUNKER.r - 8, BUNKER.r * 0.78 - 8, 0.2, 0, Math.PI * 2); ctx.fill();

    // water with drifting ripples
    ctx.fillStyle = 'rgba(47, 134, 201, 0.55)';
    ctx.fillRect(WATER.x, WATER.y, WATER.w, WATER.h);
    ctx.strokeStyle = 'rgba(244, 237, 224, 0.25)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const yy = WATER.y + 14 + i * 16;
      ctx.beginPath();
      for (let x = WATER.x; x <= WATER.x + WATER.w; x += 8) {
        const wob = Math.sin(x * 0.05 + t * 0.002 + i * 2) * 3;
        x === WATER.x ? ctx.moveTo(x, yy + wob) : ctx.lineTo(x, yy + wob);
      }
      ctx.stroke();
    }

    // hole + flag
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(HOLE.x, HOLE.y + 2, HOLE_R + 3, HOLE_R * 0.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#04100a';
    ctx.beginPath(); ctx.ellipse(HOLE.x, HOLE.y, HOLE_R, HOLE_R * 0.72, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#f4ede0'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(HOLE.x, HOLE.y); ctx.lineTo(HOLE.x, HOLE.y - 58); ctx.stroke();
    ctx.fillStyle = '#d9a441';
    ctx.beginPath();
    ctx.moveTo(HOLE.x, HOLE.y - 58);
    ctx.lineTo(HOLE.x + 26 + Math.sin(t * 0.003) * 3, HOLE.y - 49);
    ctx.lineTo(HOLE.x, HOLE.y - 40);
    ctx.closePath(); ctx.fill();

    // trail
    state.trail.forEach((p, i) => {
      ctx.fillStyle = `rgba(244, 237, 224, ${(i / state.trail.length) * 0.35})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, BALL_R * 0.5, 0, Math.PI * 2); ctx.fill();
    });

    // aim line
    if (state.drag) {
      const dx = state.drag.start.x - state.drag.now.x;
      const dy = state.drag.start.y - state.drag.now.y;
      const len = Math.min(Math.hypot(dx, dy), MAX_DRAG);
      const ang = Math.atan2(dy, dx);
      const b = state.ball;
      ctx.setLineDash([6, 8]);
      ctx.strokeStyle = `rgba(217, 164, 65, ${0.4 + (len / MAX_DRAG) * 0.6})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x + Math.cos(ang) * len * 0.9, b.y + Math.sin(ang) * len * 0.9);
      ctx.stroke();
      ctx.setLineDash([]);
      // power meter
      ctx.fillStyle = 'rgba(8, 21, 39, 0.7)';
      roundRect(30, H - 44, 120, 12, 6); ctx.fill();
      ctx.fillStyle = len > 200 ? '#e8bd6a' : '#2f86c9';
      roundRect(30, H - 44, 120 * (len / MAX_DRAG), 12, 6); ctx.fill();
    }

    // ball
    if (!state.sunk) {
      const b = state.ball;
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(b.x + 2, b.y + 4, BALL_R, BALL_R * 0.6, 0, 0, Math.PI * 2); ctx.fill();
      const g = ctx.createRadialGradient(b.x - 3, b.y - 3, 1, b.x, b.y, BALL_R);
      g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#c9c2b2');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2); ctx.fill();
    }
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // paint the green immediately, then only run the loop while on screen
  draw(0);
  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  (function loop(t) {
    if (visible) { physics(); draw(t); }
    requestAnimationFrame(loop);
  })(0);
}
