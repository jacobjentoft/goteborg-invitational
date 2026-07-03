// Entry point. Local modules initialize unconditionally; anything that needs
// a CDN library (three, gsap, lenis, confetti) loads it dynamically and fails
// soft, so the content is always readable even on terrible hotel wifi.

import { initCards } from './cards.js';
import { initCountdown } from './countdown.js';
import { initCursor } from './cursor.js';
import { initPutt } from './putt.js';
import { initHero } from './hero.js';
import { initScrollFX } from './scrollfx.js';

const ctx = {
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
};

for (const init of [initCards, initCountdown, initCursor, initPutt]) {
  try { init(ctx); } catch (err) { console.error(err); }
}

initHero(ctx).catch(console.error);
initScrollFX(ctx).catch(console.error);
