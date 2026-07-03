// Smooth in-page nav
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Scroll progress bar + sticky navbar state
const progressBar = document.getElementById('progressBar');
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';

  navbar.classList.toggle('scrolled', scrollTop > 40);
  backToTop.classList.toggle('visible', scrollTop > 500);
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => {
  document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
});

// Countdown timer
const countdownEl = document.getElementById('countdown');
if (countdownEl) {
  const target = new Date(countdownEl.dataset.target).getTime();
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      els.days.textContent = els.hours.textContent = els.mins.textContent = els.secs.textContent = '00';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    els.days.textContent = String(days).padStart(2, '0');
    els.hours.textContent = String(hours).padStart(2, '0');
    els.mins.textContent = String(mins).padStart(2, '0');
    els.secs.textContent = String(secs).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}

// Scroll-triggered reveal animations
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Animated handicap counters (triggered once per card)
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.target);
    const decimals = el.dataset.target.includes('.') ? 1 : 0;
    const duration = 1200;
    const start = performance.now();

    function animate(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = target * progress;
      el.textContent = value.toLocaleString('sv-SE', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(el => counterObserver.observe(el));

// 3D tilt effect on player cards
document.querySelectorAll('.player-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
