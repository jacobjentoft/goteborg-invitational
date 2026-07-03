// Custom cursor: a tiny golf ball with a lagging gold ring.
// Desktop pointer devices only; skipped for touch and reduced motion.

export function initCursor({ reducedMotion }) {
  if (reducedMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  document.documentElement.classList.add('has-cursor');

  let x = innerWidth / 2, y = innerHeight / 2;
  let rx = x, ry = y;

  addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });

  (function follow() {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  })();

  const isInteractive = (el) =>
    el.closest?.('a, button, [data-cursor], .pcard, #puttCanvas');
  document.addEventListener('pointerover', (e) => {
    ring.classList.toggle('is-active', Boolean(isInteractive(e.target)));
  }, { passive: true });
}
