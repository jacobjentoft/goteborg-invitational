// "Select your player" trading cards: JS-rendered from data, with
// holographic foil tracking, 3D tilt, and click/keyboard flip.
// No external dependencies — cards must render even if CDNs are down.

import { PLAYERS, fmtHcp } from './data.js';

const MAX_TILT = 7;

function cardHTML(p, i) {
  const stats = p.stats.map(([n, v]) => `
    <div class="pstat">
      <span class="n">${n}</span><span class="v">${v}</span>
      <span class="bar"><i style="--w:${Math.max(v, 3)}%"></i></span>
    </div>`).join('');

  // avatar upgrades from emoji to a photo when data.js gets a `photo` path
  const avatar = p.photo
    ? `<img src="${p.photo}" alt="" loading="lazy">`
    : p.avatar;
  const link = p.link
    ? `<a class="pcard-link" href="${p.link.url}" target="_blank" rel="noopener" data-cursor>${p.link.label} ↗</a>`
    : '';

  return `
  <div class="pcard-inner">
    <div class="pcard-face pcard-front">
      <span class="pcard-no">P${i + 1} / ${PLAYERS.length}</span>
      <div class="pcard-avatar">${avatar}</div>
      <h3 class="pcard-name">${p.name}</h3>
      <p class="pcard-nick">“${p.nickname}”</p>
      <div class="pcard-hcp">
        <span class="v" data-hcp="${p.hcp}">0</span>
        <span class="l">Handicap</span>
      </div>
      <span class="pcard-hint">tap to flip ↺</span>
      <div class="pcard-foil"></div>
    </div>
    <div class="pcard-face pcard-back">
      <p class="pcard-badge">${p.badge}</p>
      <p class="pcard-bio">${p.bio}</p>
      ${link}
      <p class="pcard-weak"><b>⚠ Weakness</b><br>${p.weakness}</p>
      <div class="pcard-stats">${stats}</div>
      <div class="pcard-foil"></div>
    </div>
  </div>`;
}

function animateHcp(el, target, reduced) {
  if (reduced) { el.textContent = fmtHcp(target); return; }
  const start = performance.now();
  const dur = 1200;
  function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = fmtHcp(Math.round(target * eased * 10) / 10);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = fmtHcp(target);
  }
  requestAnimationFrame(step);
}

export function initCards({ reducedMotion }) {
  const grid = document.getElementById('playerGrid');
  if (!grid) return;

  PLAYERS.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'pcard';
    card.dataset.reveal = '';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', `${p.name}, “${p.nickname}”, handicap ${fmtHcp(p.hcp)}. Activate to flip the card.`);
    card.innerHTML = cardHTML(p, i);
    grid.appendChild(card);

    const flip = () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(flipped));
    };
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // links on the back navigate, not flip
      flip();
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });

    if (!reducedMotion) {
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--rx', `${(0.5 - py) * MAX_TILT * 2}deg`);
        card.style.setProperty('--ry', `${(px - 0.5) * MAX_TILT * 2}deg`);
        card.querySelectorAll('.pcard-foil').forEach((f) => {
          f.style.setProperty('--mx', `${px * 100}%`);
          f.style.setProperty('--my', `${py * 100}%`);
          f.style.setProperty('--mxn', `${px * 100}`);
        });
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    }
  });

  // count up the handicaps when cards scroll into view
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      animateHcp(el, parseFloat(el.dataset.hcp), reducedMotion);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  grid.querySelectorAll('[data-hcp]').forEach((el) => obs.observe(el));
}
