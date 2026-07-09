// Scroll-linked animation layer: Lenis smooth scroll + GSAP ScrollTrigger.
// Everything here is progressive enhancement — the page reads fine without it,
// so all CDN imports happen inside try/catch and failures are silent.

export async function initScrollFX({ reducedMotion }) {
  const progress = document.getElementById('progress');
  const nav = document.getElementById('nav');

  // nav state + progress bar work even without GSAP
  addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', scrollY > 40);
    if (progress) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    }
  }, { passive: true });

  if (reducedMotion) return;

  let gsap, ScrollTrigger, Lenis;
  try {
    [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis'),
    ]);
  } catch {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // anchor links through Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -10 });
    });
  });

  // generic reveals
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 44, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  // section titles: split into words that rise out of a masked line
  document.querySelectorAll('[data-words]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((w) => `<span class="w" style="overflow:hidden;display:inline-block;vertical-align:top;"><span class="w-in" style="display:inline-block;">${w}</span></span>`)
      .join(' ');
    gsap.from(el.querySelectorAll('.w-in'), {
      yPercent: 115, duration: 0.8, stagger: 0.08, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // hero content drifts up and fades as you leave it
  gsap.to('.hero-content', {
    yPercent: -18, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 35%', scrub: true },
  });

  // countdown digits tighten into place
  gsap.from('.cd-digits', {
    scale: 0.82, ease: 'none',
    scrollTrigger: { trigger: '.sec-countdown', start: 'top bottom', end: 'center center', scrub: true },
  });

  // venue: pinned horizontal scroll on desktop, plain stack on mobile
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const track = document.getElementById('venueTrack');
    const pin = document.querySelector('.venue-pin');
    if (!track || !pin) return;
    const getDistance = () => track.scrollWidth - innerWidth;
    const tween = gsap.to(track, {
      x: () => -getDistance(), ease: 'none',
      scrollTrigger: {
        trigger: pin, start: 'top 12%', end: () => `+=${getDistance()}`,
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
    return () => tween.scrollTrigger?.kill();
  });

  // leaderboard rows slide in
  gsap.from('.board tbody tr', {
    x: -36, opacity: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out',
    scrollTrigger: { trigger: '.board-wrap', start: 'top 80%' },
  });

  // magnetic buttons
  if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      const strength = 0.35;
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) * strength,
          y: (e.clientY - r.top - r.height / 2) * strength,
          duration: 0.3, ease: 'power2.out',
        });
      });
      btn.addEventListener('pointerleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }
}
