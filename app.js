(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const fmt = n => n.toLocaleString('tr-TR') + ' ₺';

/* ───────── data ───────── */
const PRODUCTS = { pro: { name: 'VoltCube Pro', sub: 'MODULO · Mat antrasit', price: 1950 } };
// camera framing of the 3D model for each feature strip
const VIEWS = {
  gan:     { ry: .6,   rx: .06, zoom: 1,    my: 0,    glow: .5 },
  display: { ry: -.1,  rx: .02, zoom: 1.25, my: -.45, glow: .4 },
  ports:   { ry: .08,  rx: 0,   zoom: 1.2,  my: .15,  glow: .4 },
  cool:    { ry: -1.4, rx: .1,  zoom: 1.05, my: 0,    glow: 1 }
};
const state = { feature: 'gan', qty: 1 };
const FEAT_GLOW = { gan: '#8aa0b4', display: '#1f86b3', ports: '#b3591f', cool: '#2f8fb5' };
let cart = [];
try {
  const raw = JSON.parse(localStorage.getItem('modulo-cart') || '[]');
  cart = raw.filter(i => PRODUCTS[i.id] && i.qty > 0);
} catch (e) { cart = []; }
const saveCart = () => { try { localStorage.setItem('modulo-cart', JSON.stringify(cart)); } catch (e) {} };

/* ───────── text split + reveal ───────── */
let ready = false;
$$('[data-split]').forEach(el => {
  const plain = el.dataset.split === 'plain';
  const txt = el.textContent.trim();
  if (!plain) el.setAttribute('aria-label', txt);
  el.textContent = '';
  let idx = 0;
  txt.split(' ').forEach((w, wi, arr) => {
    const ws = document.createElement('span');
    ws.className = 'sw'; ws.setAttribute('aria-hidden', 'true');
    [...w].forEach(ch => {
      const c = document.createElement('span');
      c.className = 'sc'; c.textContent = ch; c.style.setProperty('--i', idx++);
      ws.appendChild(c);
    });
    el.appendChild(ws);
    if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '));
  });
});
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  if (e.target.closest('.hero') && !ready) return;
  e.target.classList.add('in'); io.unobserve(e.target);
  if (e.target.querySelector('[data-count]')) countUp(e.target);
}), { threshold: .18 });
$$('[data-split],[data-r]').forEach(el => io.observe(el));

function countUp(scope) {
  $$('[data-count]', scope).forEach(el => {
    const to = +el.dataset.count; if (reduce) return;
    const t0 = performance.now(), d = 1600;
    const step = now => {
      const p = clamp((now - t0) / d, 0, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '0'; requestAnimationFrame(step);
  });
}

/* ───────── loader / intro ───────── */
const loader = $('#loader'), loaderCount = $('#loaderCount');
let introStart = -1;
function finishIntro() {
  if (ready) return;
  ready = true;
  loader.classList.add('done');
  $$('.hero [data-split],.hero [data-r]').forEach(el => { el.classList.add('in'); io.unobserve(el); });
  root.classList.add('ready');
  introStart = performance.now();
  setTimeout(() => loader.remove(), 1400);
}
(function runLoader() {
  let seen = false; try { seen = !!sessionStorage.getItem('modulo-seen'); sessionStorage.setItem('modulo-seen', '1'); } catch (e) {}
  const t0 = performance.now(); const dur = reduce ? 100 : seen ? 350 : 1100;
  const step = now => {
    const p = clamp((now - t0) / dur, 0, 1);
    loaderCount.textContent = Math.round(p * 100);
    if (p < 1) requestAnimationFrame(step); else setTimeout(finishIntro, 120);
  };
  requestAnimationFrame(step);
  setTimeout(finishIntro, 5000); // fail-safe
})();

/* ───────── UI: cart ───────── */
const cartEl = $('#cart'), cartList = $('#cartList');
function cartCalc() {
  const sub = cart.reduce((s, i) => s + PRODUCTS[i.id].price * i.qty, 0);
  return { sub, total: sub, count: cart.reduce((s, i) => s + i.qty, 0) };
}
function renderCart() {
  const c = cartCalc();
  $('#cartCount').textContent = c.count;
  cartEl.classList.toggle('empty', !cart.length);
  cartList.innerHTML = cart.map(i => {
    const p = PRODUCTS[i.id];
    return `<li class="ci"><span class="thumb"></span>
      <div><h4>${p.name}</h4><small>${p.sub}</small>
        <div class="qty"><button data-q="${i.id}" data-d="-1" aria-label="Azalt">−</button><span>${i.qty}</span><button data-q="${i.id}" data-d="1" aria-label="Artır">+</button></div></div>
      <div><div class="p">${fmt(p.price * i.qty)}</div><button class="rm" data-rm="${i.id}">Kaldır</button></div></li>`;
  }).join('');
  $('#cSub').textContent = fmt(c.sub);
  $('#cTotal').textContent = fmt(c.total);
  const lines = cart.map(i => `${i.qty} × ${PRODUCTS[i.id].name} — ${fmt(PRODUCTS[i.id].price * i.qty)}`);
  lines.push('', 'Toplam: ' + fmt(c.total), '', 'Teslimat adresi:');
  $('#checkout').href = 'mailto:siparis@modulo.example?subject=' + encodeURIComponent('MODULO siparişi') + '&body=' + encodeURIComponent(lines.join('\n'));
  saveCart();
}
function addToCart(id, qty = 1) {
  const it = cart.find(i => i.id === id);
  if (it) it.qty += qty; else cart.push({ id, qty });
  renderCart();
  const b = $('#cartCount'); b.classList.add('bump'); setTimeout(() => b.classList.remove('bump'), 350);
}
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400);
}
function openCart(o) {
  document.body.classList.toggle('cart-open', o);
  document.body.classList.toggle('lock', o);
  cartEl.setAttribute('aria-hidden', o ? 'false' : 'true');
  if (o) setTimeout(() => $('#cartClose').focus(), 300);
}
$('#cartOpen').addEventListener('click', () => openCart(true));
$('#cartClose').addEventListener('click', () => openCart(false));
$('#scrim').addEventListener('click', () => openCart(false));
$$('[data-open-cart]').forEach(b => b.addEventListener('click', () => openCart(true)));
$$('[data-close-cart]').forEach(b => b.addEventListener('click', () => openCart(false)));
addEventListener('keydown', e => { if (e.key === 'Escape') openCart(false); });
cartList.addEventListener('click', e => {
  const q = e.target.closest('[data-q]'), r = e.target.closest('[data-rm]');
  if (q) {
    const it = cart.find(i => i.id === q.dataset.q);
    if (it) { it.qty += +q.dataset.d; if (it.qty <= 0) cart = cart.filter(x => x !== it); renderCart(); }
  } else if (r) { cart = cart.filter(i => i.id !== r.dataset.rm); renderCart(); }
});
$('#checkout').addEventListener('click', e => { if (!cart.length) e.preventDefault(); });

/* ───────── UI: feature strips + buy ───────── */
const strips = $$('.strip');
function selectFeature(f) {
  state.feature = f;
  strips.forEach(s => {
    const on = s.dataset.f === f;
    s.classList.toggle('on', on); $('.strip-btn', s).setAttribute('aria-pressed', on);
  });
  stage.setView(f); applyAmbient();
}
let userTouched = false;
strips.forEach(s => {
  const b = $('.strip-btn', s);
  const pick = () => { userTouched = true; selectFeature(s.dataset.f); };
  b.addEventListener('click', pick);
  b.addEventListener('focus', pick);
  s.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') pick(); });
});
const FEATS = ['gan', 'display', 'ports', 'cool'];
setInterval(() => {
  if (userTouched || reduce || document.hidden || !activeSec || activeSec.id !== 'urun') return;
  selectFeature(FEATS[(FEATS.indexOf(state.feature) + 1) % FEATS.length]);
}, 5500);
const setQty = q => { state.qty = clamp(q, 1, 9); $('#qVal').textContent = state.qty; };
$('#qMinus').addEventListener('click', () => setQty(state.qty - 1));
$('#qPlus').addEventListener('click', () => setQty(state.qty + 1));
$('#addBtn').addEventListener('click', () => {
  addToCart('pro', state.qty);
  toast(`VoltCube Pro × ${state.qty} sepete eklendi`);
});
$$('[data-quick]').forEach(b => b.addEventListener('click', () => {
  addToCart(b.dataset.quick); toast('VoltCube Pro sepete eklendi');
}));

/* ───────── mobile menu ───────── */
const menuBtn = $('#menuBtn'), menu = $('#menu');
function toggleMenu(o) {
  document.body.classList.toggle('menu-open', o); document.body.classList.toggle('lock', o);
  menuBtn.setAttribute('aria-expanded', o); menuBtn.setAttribute('aria-label', o ? 'Menüyü kapat' : 'Menüyü aç'); menu.setAttribute('aria-hidden', !o);
}
menuBtn.addEventListener('click', () => toggleMenu(!document.body.classList.contains('menu-open')));
menu.addEventListener('click', e => { if (e.target.closest('a,button')) toggleMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

/* ───────── magnetic buttons, tilt, cursor ───────── */
if (!reduce && matchMedia('(hover:hover)').matches) {
  $$('[data-mag]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });
}
const cursor = $('#cursor');
let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, nmx = 0, nmy = 0;
addEventListener('pointermove', e => {
  mx = e.clientX; my = e.clientY; nmx = mx / innerWidth - .5; nmy = my / innerHeight - .5;
  cursor.classList.toggle('big', !!e.target.closest('.strip'));
});

/* ───────── ambient ───────── */
const ambient = $('#ambient');
const secs = $$('section[data-glow]');
let activeSec = null;
function applyAmbient() {
  if (!activeSec) return;
  const d = activeSec.dataset;
  ambient.style.setProperty('--glow', activeSec.id === 'urun' ? FEAT_GLOW[state.feature] : d.glow);
  ambient.style.setProperty('--c1', d.c1); ambient.style.setProperty('--c2', d.c2);
  ambient.style.setProperty('--gx', d.gx); ambient.style.setProperty('--gy', d.gy);
}

/* ───────── marquee ───────── */
const marqs = $$('.marq').map(m => {
  const t = $('.marq-track', m); t.innerHTML += t.innerHTML + t.innerHTML;
  return { m, t, dir: +m.dataset.dir || -1, x: 0, third: 0 };
});
function measureMarq() { marqs.forEach(o => { o.third = o.t.scrollWidth / 3; }); }

/* ───────── fit text ───────── */
function fitAll() {
  $$('.fit').forEach(el => {
    el.style.fontSize = '100px';
    const w = el.scrollWidth, avail = el.parentElement.clientWidth;
    el.style.fontSize = (100 * avail / w * .99) + 'px';
  });
  const g = $('.giant'); if (g) g.style.height = ($('.fit').getBoundingClientRect().height * .62) + 'px';
}

/* ───────── WebGL stage: the MODULO VoltCube Pro, built from the product photos ───────── */
const stage = (() => {
  const noop = { setView() {}, render() {} };
  const fail = () => { root.classList.add('no-webgl'); return noop; };
  if (!window.THREE) return fail();
  const canvas = $('#stage');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch (e) { return fail(); }
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  renderer.setPixelRatio(Math.min(devicePixelRatio, lowPower ? 1.25 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputEncoding = THREE.sRGBEncoding;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 50); camera.position.set(0, 0, 8);

  // studio environment (background must stay pure black in r128's PMREM, any tint floods the reflection)
  const env = new THREE.Scene(); env.background = new THREE.Color(0x000000);
  const softbox = (w, h, col, k, pos) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 0, 0); env.add(m);
  };
  softbox(14, 3.2, 0xffffff, 4.5, [0, 8, 2]); softbox(1.6, 12, 0xffffff, 3.2, [-8, 0, 3]); softbox(1.2, 12, 0x9fd8ff, 4, [8, 1, -1]);
  softbox(10, 1.2, 0xffffff, 1.6, [0, -7, 5]); softbox(1.6, 1.6, 0xff7a1a, 4, [4.5, 3, 8]); softbox(1, 9, 0xffffff, 2.4, [-5, 2, -8]);
  softbox(18, 6, 0x66727e, .9, [0, 0, -12]);
  softbox(26, 9, 0xc9d2dc, .55, [0, 1, 11]); softbox(24, 5, 0xffffff, .5, [0, 5, -7]); softbox(7, 7, 0xffffff, 1.1, [-6, 4, 6]);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(env, .02).texture;
  const key = new THREE.DirectionalLight(0xffffff, .35); key.position.set(3, 5, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fd8ff, .9); rim.position.set(-5, 2, -4); scene.add(rim);

  // body: rounded vertical capsule-cube (superellipsoid), built once
  const SX = .72, SY = 1.25, SZ = .72, E1 = .3, E2 = .55;
  const ROWS = 110, COLS = 180, n = (ROWS - 1) * COLS + 2;
  const P = new Float32Array(n * 3), idx = [];
  const sg = v => v < 0 ? -1 : v > 0 ? 1 : 0;
  const sp_ = (v, e) => sg(v) * Math.pow(Math.abs(v), e);
  const put = (i, th, ph) => {
    const ct = Math.cos(th), st = Math.sin(th), cp = Math.cos(ph), sp = Math.sin(ph);
    P[i * 3] = SX * sp_(ct, E1) * sp_(cp, E2); P[i * 3 + 1] = SY * sp_(st, E1); P[i * 3 + 2] = SZ * sp_(ct, E1) * sp_(sp, E2);
  };
  let k = 0;
  for (let r = 1; r < ROWS; r++) for (let c = 0; c < COLS; c++) put(k++, -Math.PI / 2 + Math.PI * r / ROWS, Math.PI * 2 * c / COLS);
  const N = n - 2, S = n - 1; put(N, Math.PI / 2, 0); put(S, -Math.PI / 2, 0);
  for (let c = 0; c < COLS; c++) {
    const c1 = (c + 1) % COLS; idx.push(S, c, c1); const lr = (ROWS - 2) * COLS; idx.push(lr + c, N, lr + c1);
  }
  for (let r = 0; r < ROWS - 2; r++) for (let c = 0; c < COLS; c++) {
    const c1 = (c + 1) % COLS, a = r * COLS + c, b = r * COLS + c1, d = (r + 1) * COLS + c, e = (r + 1) * COLS + c1;
    idx.push(a, d, b, b, d, e);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  const body = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x17181b, roughness: .56, metalness: .12, envMapIntensity: .5 }));

  const model = new THREE.Group(); model.add(body);
  const pivot = new THREE.Group(); pivot.add(model); scene.add(pivot);

  // printed / inlaid details drawn to canvases once (ports, vents, brushed metal); only the tiny display is redrawn
  function canvasTex(w, h, draw) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d'), tex = new THREE.CanvasTexture(cv);
    tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
    const redraw = (...a) => { ctx.clearRect(0, 0, w, h); draw(ctx, ...a); tex.needsUpdate = true; };
    redraw(); return { tex, redraw };
  }
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const front = canvasTex(512, 1024, (c) => {
    c.fillStyle = '#6d7077'; c.font = '600 40px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('MODULO', 256, 262);
    c.font = '500 24px Inter, sans-serif'; c.fillText('100W GaN', 256, 304);
    rr(c, 150, 390, 212, 480, 106); c.fillStyle = '#121316'; c.fill(); c.strokeStyle = '#2b2d33'; c.lineWidth = 3; c.stroke();
    c.font = '500 15px Inter, sans-serif';
    [[520, 'USB-C1'], [620, 'USB-C2']].forEach(([y, t]) => { rr(c, 218, y - 12, 76, 24, 12); c.fillStyle = '#030304'; c.fill(); c.strokeStyle = '#3d4047'; c.lineWidth = 3; c.stroke(); c.fillStyle = '#74777e'; c.fillText(t, 256, y + 42); });
    rr(c, 214, 724, 84, 52, 8); const g = c.createLinearGradient(0, 724, 0, 776); g.addColorStop(0, '#ff9a3c'); g.addColorStop(1, '#e24f06'); c.fillStyle = g; c.fill();
    c.shadowColor = '#ff6a1a'; c.shadowBlur = 14; c.fill(); c.shadowBlur = 0; c.fillStyle = '#74777e'; c.fillText('USB-A', 256, 812);
  });
  let watts = 100;
  const disp = canvasTex(332, 104, (c) => {
    rr(c, 0, 0, 332, 104, 52); c.fillStyle = '#040506'; c.fill();
    c.fillStyle = '#eef9ff'; c.shadowColor = '#5fd4ff'; c.shadowBlur = 14;
    c.font = '600 70px "Barlow Condensed", "Arial Narrow", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(watts.toFixed(1), 152, 54); c.font = '600 24px "Barlow Condensed", sans-serif'; c.fillText('W', 282, 70);
  });
  const side = canvasTex(512, 1024, (c) => {
    rr(c, 120, 70, 272, 360, 40); c.fillStyle = '#0c0d0f'; c.fill();
    c.fillStyle = '#3a3c42'; for (let y = 96; y < 410; y += 13) for (let x = 140 + ((y / 13) % 2) * 6; x < 380; x += 13) { c.beginPath(); c.arc(x, y, 2.7, 0, 7); c.fill(); }
    rr(c, 96, 480, 320, 480, 70); c.fillStyle = '#0c0d0f'; c.fill();
    rr(c, 106, 490, 300, 460, 62); c.save(); c.clip();
    const cg = c.createConicGradient(0, 256, 720);
    for (let i = 0; i <= 24; i++) cg.addColorStop(i / 24, i % 2 ? '#8e9198' : '#2b2d31');
    c.fillStyle = cg; c.fillRect(96, 480, 320, 480); c.restore();
  });
  const back = canvasTex(512, 1024, (c) => {
    rr(c, 110, 90, 292, 440, 36); c.fillStyle = '#0c0d0f'; c.fill();
    c.fillStyle = '#3a3c42'; for (let y = 116; y < 515; y += 14) for (let x = 130; x < 385; x += 14) { c.beginPath(); c.arc(x, y, 3, 0, 7); c.fill(); }
    rr(c, 176, 760, 160, 100, 30); c.fillStyle = '#0a0b0d'; c.fill(); c.strokeStyle = '#2b2d33'; c.lineWidth = 3; c.stroke();
    rr(c, 206, 790, 100, 40, 20); c.fillStyle = '#000'; c.fill();
  });
  const dm = (tex, extra) => new THREE.MeshStandardMaterial(Object.assign({ map: tex, transparent: true, roughness: .55, metalness: .2, envMapIntensity: .9 }, extra));
  const fd = new THREE.Mesh(new THREE.PlaneGeometry(.92, 1.84), new THREE.MeshBasicMaterial({ map: front.tex, transparent: true, toneMapped: false }));
  fd.position.set(0, -.05, SZ + .004); model.add(fd);
  const dp = new THREE.Mesh(new THREE.PlaneGeometry(.597, .187), new THREE.MeshBasicMaterial({ map: disp.tex, transparent: true, toneMapped: false }));
  dp.position.set(0, .65, SZ + .008); model.add(dp);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x5fd4ff, transparent: true, toneMapped: false });
  const led = new THREE.Mesh(new THREE.CircleGeometry(.018, 16), ledMat); led.position.set(0, .083, SZ + .008); model.add(led);
  const sideMat = dm(side.tex, { metalness: .55, roughness: .42 });
  const sr = new THREE.Mesh(new THREE.PlaneGeometry(1, 2), sideMat); sr.position.set(SX + .004, -.05, 0); sr.rotation.y = Math.PI / 2; model.add(sr);
  const sl = new THREE.Mesh(new THREE.PlaneGeometry(1, 2), sideMat); sl.position.set(-SX - .004, -.05, 0); sl.rotation.y = -Math.PI / 2; model.add(sl);
  const bk = new THREE.Mesh(new THREE.PlaneGeometry(.92, 1.84), dm(back.tex)); bk.position.set(0, -.05, -SZ - .004); bk.rotation.y = Math.PI; model.add(bk);

  // light-up stand
  const metal = new THREE.MeshStandardMaterial({ color: 0x15161a, metalness: .85, roughness: .32, envMapIntensity: 1 });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(.98, 1, .12, 72), metal); disc.position.y = -SY - .18; model.add(disc);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(.44, .44, .12, 40), metal); neck.position.y = -SY - .06; model.add(neck);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x8fdcff, transparent: true, opacity: .8, toneMapped: false, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(new THREE.RingGeometry(.84, .93, 96), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.y = -SY - .12 + .004; model.add(ring);
  const baseLight = new THREE.PointLight(0x5fd4ff, 1, 6); baseLight.position.set(0, -SY - .2, .8); model.add(baseLight);

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  }
  resize(); addEventListener('resize', resize);

  /* Scroll choreography: the model rides a path through the anchors (page coordinates). It rests on an anchor
     while that anchor is on screen, then travels to the next one, spinning once, scrubbed by scroll position. */
  const anchors = $$('[data-anchor]').map(el => ({
    el, ry: parseFloat(el.dataset.ry || 0), rx: parseFloat(el.dataset.rx || 0),
    hide: el.hasAttribute('data-hide'), feat: el.hasAttribute('data-feature')
  }));
  const smooth = u => u * u * (3 - 2 * u);
  const TAU = Math.PI * 2;
  let view = VIEWS.gan;
  const fv = { ry: view.ry, rx: view.rx, zoom: 1, my: 0, glow: .5 };
  const cur = { x: 0, y: 0, s: 0, ry: 0, rx: 0, zoom: 1, my: 0, glow: .5 };
  let first = true, last = performance.now(), time = 0, wTgt = 100, wAcc = 0, dispAcc = 0;

  function sample(pts, Yc, vh) {
    const L = pts.length - 1;
    if (Yc <= pts[0].Y) return { ...pts[0], Yp: pts[0].Y };
    if (Yc >= pts[L].Y) return { ...pts[L], Yp: pts[L].Y, ry: pts[L].ry + TAU * L };
    for (let i = 0; i < L; i++) {
      const a = pts[i], b = pts[i + 1];
      if (Yc > b.Y) continue;
      const gap = b.Y - a.Y, H = Math.min(vh * .32, gap * .3), t0 = a.Y + H, t1 = b.Y - H;
      let e = clamp((Yc - t0) / Math.max(t1 - t0, 1), 0, 1); e = .5 * e + .5 * smooth(e);
      return {
        X: lerp(a.X, b.X, e), S: lerp(a.S, b.S, e), Yp: lerp(a.Y, b.Y, e),
        ry: lerp(a.ry, b.ry, e) + TAU * (i + e), rx: lerp(a.rx, b.rx, e),
        zoom: lerp(a.zoom, b.zoom, e), my: lerp(a.my, b.my, e), glow: lerp(a.glow, b.glow, e)
      };
    }
  }

  function render(now) {
    const dt = Math.min((now - last) / 1000, .05); last = now; time += dt;
    const vw = innerWidth, vh = innerHeight, sy = scrollY;
    const vk = 1 - Math.exp(-dt * 6);
    for (const q of ['ry', 'rx', 'zoom', 'my', 'glow']) fv[q] += (view[q] - fv[q]) * vk;

    const pts = anchors.map(a => {
      const r = a.el.getBoundingClientRect();
      return { X: r.left + r.width / 2, Y: r.top + sy + r.height / 2, S: a.hide ? 0 : Math.min(r.width, r.height),
        ry: a.feat ? fv.ry : a.ry, rx: a.feat ? fv.rx : a.rx, zoom: a.feat ? fv.zoom : 1, my: a.feat ? fv.my : 0, glow: a.feat ? fv.glow : .5 };
    }).sort((p, q) => p.Y - q.Y);
    const Yc = sy + vh / 2;
    const t = sample(pts, Yc, vh);
    const tx = t.X, ty = clamp(t.Yp - sy, vh * .1, vh * .9);
    if (first) { Object.assign(cur, { x: tx, y: ty, s: t.S, ry: t.ry, rx: t.rx, zoom: t.zoom, my: t.my, glow: t.glow }); first = false; }
    const k = 1 - Math.exp(-dt * (reduce ? 60 : 16));
    cur.x += (tx - cur.x) * k; cur.y += (ty - cur.y) * k; cur.s += (t.S - cur.s) * k;
    cur.ry += (t.ry - cur.ry) * k; cur.rx += (t.rx - cur.rx) * k;
    cur.zoom += (t.zoom - cur.zoom) * k; cur.my += (t.my - cur.my) * k; cur.glow += (t.glow - cur.glow) * k;

    const visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const intro = introStart < 0 ? 0 : clamp((performance.now() - introStart) / 1600, 0, 1);
    const ease = 1 - Math.pow(1 - intro, 4);
    const sc = (cur.s / vh * visH / 2) / 1.37 * cur.zoom * (reduce ? 1 : ease);
    pivot.visible = sc > .005;
    pivot.position.set((cur.x / vw - .5) * visH * (vw / vh), (.5 - cur.y / vh) * visH, 0);
    pivot.scale.setScalar(Math.max(sc, .0001));
    model.position.y = .12 + cur.my;
    pivot.rotation.y = cur.ry + (reduce ? 0 : Math.sin(time * .5) * .09) + nmx * .4 + (1 - ease) * 2.6;
    pivot.rotation.x = cur.rx + nmy * .18 + .03;

    // stand glow breathes; stronger in the stand/cooling view
    const pulse = .55 + .45 * Math.sin(time * 1.6);
    ringMat.opacity = clamp(.35 + cur.glow * .5 + pulse * .25 * (.4 + cur.glow), 0, 1);
    baseLight.intensity = .6 + cur.glow * 1.6 + pulse * .5;
    ledMat.opacity = .45 + .55 * (.5 + .5 * Math.sin(time * 3));

    // live watt display (tiny texture, 8 fps)
    dispAcc += dt; wAcc += dt;
    if (wAcc > 2.2) { wAcc = 0; wTgt = [100, 96.5, 65, 45.2, 87.5, 30, 100][Math.floor(Math.random() * 7)]; }
    if (dispAcc > .12 && Math.abs(wTgt - watts) > .05) { dispAcc = 0; watts += (wTgt - watts) * .35; disp.redraw(); }
    if (pivot.visible) renderer.render(scene, camera); else renderer.clear();
  }
  return { render, setView(f) { view = VIEWS[f] || VIEWS.gan; } };
})();

/* ───────── main loop ───────── */
const hero = $('#hero'), nav = $('#nav'), progress = $('#progress');
const gal = $('#galeri'), galTrack = $('#galTrack'), shots = $$('.shot');
let galMax = 0;
function measureGal() {
  if (reduce) { gal.style.removeProperty('--galh'); galMax = 0; return; }
  galMax = Math.max(0, galTrack.scrollWidth - innerWidth);
  gal.style.setProperty('--galh', (galMax + innerHeight * 1.15) + 'px');
}
let lastScroll = scrollY, lastNow = performance.now();
function pickSection() {
  const vh = innerHeight; let best = null, bestA = 0;
  for (const s of secs) {
    const r = s.getBoundingClientRect();
    const A = Math.max(0, Math.min(r.bottom, vh * .62) - Math.max(r.top, vh * .38));
    if (A > bestA) { bestA = A; best = s; }
  }
  if (best && best !== activeSec) { activeSec = best; applyAmbient(); }
}
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min((now - lastNow) / 1000, .05); lastNow = now;
  const y = scrollY, v = (y - lastScroll) / Math.max(dt, .001); lastScroll = y;
  const hp = clamp(y / innerHeight, 0, 1);
  hero.style.setProperty('--hp', hp.toFixed(3));
  hero.style.setProperty('--op', (1 - hp * 1.1).toFixed(3));
  progress.style.setProperty('--p', clamp(y / Math.max(1, document.documentElement.scrollHeight - innerHeight), 0, 1).toFixed(4));
  if (galMax) {
    const gr = gal.getBoundingClientRect();
    if (gr.top < innerHeight && gr.bottom > 0) {
      const p = clamp(-gr.top / Math.max(1, gr.height - innerHeight), 0, 1);
      galTrack.style.transform = `translate3d(${(-p * galMax).toFixed(1)}px,0,0)`;
      for (const sh of shots) { const rc = sh.getBoundingClientRect(); sh.style.setProperty('--ix', (-((rc.left + rc.width / 2) / innerWidth - .5) * 46).toFixed(1) + 'px'); }
    }
  }
  nav.classList.toggle('solid', y > 60);
  nav.classList.toggle('hide', y > 160 && v > 60 && !document.body.classList.contains('cart-open'));
  if (v < -60) nav.classList.remove('hide');
  for (const o of marqs) {
    if (!o.third) continue;
    o.x += o.dir * ((reduce ? 0 : 60) + Math.abs(v) * .35) * dt;
    if (o.x <= -o.third) o.x += o.third;
    if (o.x > 0) o.x -= o.third;
    o.t.style.transform = `translate3d(${o.x}px,0,0)`;
  }
  cx += (mx - cx) * .2; cy += (my - cy) * .2;
  cursor.style.transform = `translate(${cx - cursor.offsetWidth / 2}px,${cy - cursor.offsetHeight / 2}px)`;
  pickSection();
  stage.render(now);
}

/* ───────── boot ───────── */
renderCart();
selectFeature('gan');
pickSection();
const refit = () => { fitAll(); measureMarq(); measureGal(); };
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(refit);
addEventListener('resize', refit);
addEventListener('load', refit);
requestAnimationFrame(loop);
})();
