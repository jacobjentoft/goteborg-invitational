// WebGL hero: a dimpled golf ball drifting in a two-tone particle field.
// Three.js is loaded dynamically so a CDN failure just leaves the CSS
// gradient backdrop — the page never blocks on it.

function makeDimpleTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, c.width, c.height);
  const step = 26;
  for (let y = 0; y <= c.height + step; y += step) {
    const offset = (y / step) % 2 ? step / 2 : 0;
    for (let x = 0; x <= c.width + step; x += step) {
      const g = ctx.createRadialGradient(x + offset, y, 1, x + offset, y, 9);
      g.addColorStop(0, '#2e2e2e');
      g.addColorStop(1, '#808080');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x + offset, y, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function makeParticles(THREE, count, color, size, spread) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread[0];
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2] - 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color, size, transparent: true, opacity: 0.75,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

export async function initHero({ reducedMotion }) {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  let THREE;
  try {
    THREE = await import('three');
  } catch {
    return; // gradient fallback stays
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return; // no WebGL on this device
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  // a giant golf ball rising like a planet at the bottom of the hero —
  // only its dimpled crest peeks above the fold, under the title
  const BALL_Y = -7.9;
  const dimples = makeDimpleTexture(THREE);
  dimples.repeat.set(3, 3);
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(1.55, 128, 128),
    new THREE.MeshStandardMaterial({
      color: 0xf5f2ea,
      roughness: 0.42,
      metalness: 0.05,
      bumpMap: dimples,
      bumpScale: 0.9,
    })
  );
  ball.scale.setScalar(4.2);
  ball.position.set(0, BALL_Y, -3);
  ball.rotation.z = 0.18;
  scene.add(ball);

  // clubhouse lighting: warm gold key raking the crest, cold blue rim, navy fill
  const key = new THREE.DirectionalLight(0xffd9a0, 2.2);
  key.position.set(2, 7, 3);
  scene.add(key);
  const rim = new THREE.PointLight(0x2f86c9, 40, 40);
  rim.position.set(-8, -1, -2);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0x0f2d4d, 2.0));

  const goldDust = makeParticles(THREE, 220, 0xd9a441, 0.045, [24, 14, 8]);
  const blueDust = makeParticles(THREE, 180, 0x2f86c9, 0.035, [26, 16, 10]);
  scene.add(goldDust, blueDust);

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // setSize clears the buffer, so repaint right away rather than
    // waiting a frame — also gives us a first paint before rAF starts
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  resize();
  addEventListener('resize', resize);

  if (reducedMotion) return; // keep the static frame, no loop

  const mouse = { x: 0, y: 0 };
  addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  // only burn GPU while the hero is actually on screen
  let inView = true;
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; })
    .observe(canvas);

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!inView || document.hidden) return;
    const t = clock.getElapsedTime();
    ball.rotation.y += 0.0012;
    ball.position.y = BALL_Y + Math.sin(t * 0.5) * 0.1;
    goldDust.rotation.y = t * 0.014;
    blueDust.rotation.y = -t * 0.01;
    goldDust.position.y = Math.sin(t * 0.4) * 0.3;
    camera.position.x += (mouse.x * 0.45 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.y * 0.3 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  });
}
