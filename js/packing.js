// Packing checklist: state persists per-device in localStorage,
// full house earns a confetti burst.

import { CONFETTI_COLORS } from './data.js';

const KEY = 'gi-packing';

export function initPacking() {
  const list = document.getElementById('packList');
  const progress = document.getElementById('packProgress');
  if (!list || !progress) return;

  const boxes = [...list.querySelectorAll('input[type="checkbox"]')];
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { /* fresh start */ }
  boxes.forEach((b) => { b.checked = Boolean(saved[b.value]); });

  let wasComplete = boxes.every((b) => b.checked);

  async function celebrate() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      const { default: confetti } = await import('canvas-confetti');
      const r = progress.getBoundingClientRect();
      confetti({
        particleCount: 90, spread: 80, startVelocity: 28,
        origin: { x: (r.left + r.width / 2) / innerWidth, y: r.top / innerHeight },
        colors: CONFETTI_COLORS,
      });
    } catch { /* fine */ }
  }

  function update() {
    const done = boxes.filter((b) => b.checked).length;
    progress.textContent = done === boxes.length
      ? `${done} / ${boxes.length} — packed. See you on the first tee.`
      : `${done} / ${boxes.length} packed`;
    try {
      localStorage.setItem(KEY, JSON.stringify(
        Object.fromEntries(boxes.map((b) => [b.value, b.checked]))
      ));
    } catch { /* private mode */ }
    const complete = done === boxes.length;
    if (complete && !wasComplete) celebrate();
    wasComplete = complete;
  }

  boxes.forEach((b) => b.addEventListener('change', update));
  update();
}
