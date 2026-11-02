// Procedural 3D food. Everything is built from primitives + generated
// textures, so there are no model files to download.
import * as THREE from 'three'

const rnd = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0, ...o })
const phys = (o) => new THREE.MeshPhysicalMaterial({ roughness: 0.4, ...o })

function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 4
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  return t
}

// pitted peel (orange, lemon, bun, patty …)
function peel(base, spot, n = 1800, r0 = 0.8, r1 = 2.2, seed = 3) {
  const R = rnd(seed)
  const draw = (g, w, h, b, s) => {
    g.fillStyle = b; g.fillRect(0, 0, w, h)
    for (let i = 0; i < n; i++) {
      g.fillStyle = s
      g.globalAlpha = 0.25 + R() * 0.5
      g.beginPath(); g.arc(R() * w, R() * h, r0 + R() * (r1 - r0), 0, 7); g.fill()
    }
    g.globalAlpha = 1
  }
  return {
    map: canvasTex(512, 256, (g, w, h) => draw(g, w, h, base, spot)),
    bump: canvasTex(512, 256, (g, w, h) => draw(g, w, h, '#999', '#222'), false),
  }
}

const place = (o, x, y, z) => { o.position.set(x, y, z); return o }
const add = (grp, ...kids) => { kids.forEach((k) => grp.add(k)); return grp }
const mesh = (geo, mat) => { const m = new THREE.Mesh(geo, mat); return m }

function leaf(color = '#3d8b2f', len = 0.7, wid = 0.28) {
  const m = mesh(new THREE.SphereGeometry(1, 20, 12), std({ color, roughness: 0.55, side: THREE.DoubleSide }))
  m.scale.set(len, 0.035, wid)
  return m
}

function sphereOn(parent, R, rad, n, geo, mat, seed, thetaMax = 1.15, yScale = 1) {
  const r = rnd(seed)
  for (let i = 0; i < n; i++) {
    const th = Math.acos(1 - r() * (1 - Math.cos(thetaMax))), ph = r() * Math.PI * 2
    const p = new THREE.Vector3(Math.sin(th) * Math.cos(ph), Math.cos(th) * yScale, Math.sin(th) * Math.sin(ph))
    const m = mesh(geo, mat)
    m.position.copy(p.clone().multiplyScalar(rad))
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p.clone().normalize())
    m.rotateY(r() * 6)
    parent.add(m)
  }
}

/* ───────────── fruit ───────────── */
function orange() {
  const g = new THREE.Group()
  const t = peel('#ff8a0d', '#c25a00', 2600, 0.7, 1.7, 7)
  const body = mesh(new THREE.SphereGeometry(1, 72, 48),
    phys({ map: t.map, bumpMap: t.bump, bumpScale: 1.6, roughness: 0.45, clearcoat: 0.25, clearcoatRoughness: 0.5 }))
  body.scale.set(1, 0.95, 1)
  const stem = mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.14, 12), std({ color: '#6a8a2a' }))
  stem.position.y = 0.95
  const l = leaf(); l.position.set(0.32, 0.93, 0); l.rotation.z = 0.25
  const l2 = leaf('#2f7a28', 0.55, 0.22); l2.position.set(-0.25, 0.92, 0.12); l2.rotation.set(0, 2.4, -0.2)
  return add(g, body, stem, l, l2)
}

function lemon() {
  const g = new THREE.Group()
  const t = peel('#ffd91a', '#c9a100', 2600, 0.6, 1.5, 11)
  const body = mesh(new THREE.SphereGeometry(1, 72, 48),
    phys({ map: t.map, bumpMap: t.bump, bumpScale: 1.4, roughness: 0.4, clearcoat: 0.3 }))
  body.scale.set(1.12, 0.82, 0.82)
  const n1 = mesh(new THREE.SphereGeometry(0.17, 20, 16), std({ color: '#f3c912' })); n1.position.x = 1.08; n1.scale.set(1.1, 0.8, 0.8)
  const n2 = n1.clone(); n2.position.x = -1.08
  const l = leaf(); l.position.set(-1.0, 0.18, 0); l.rotation.z = 0.6; l.scale.set(0.4, 0.035, 0.18)
  return add(g, body, n1, n2, l)
}

function strawberry() {
  const g = new THREE.Group()
  const R = rnd(21)
  const pts = []
  for (let i = 0; i <= 40; i++) {
    const t = i / 40
    const y = -1 + t * 1.75
    const r = Math.sin(Math.pow(t, 0.7) * Math.PI * 0.95) * (0.98 - 0.14 * t) + 0.001
    pts.push(new THREE.Vector2(r, y))
  }
  const seeds = (g2, w, h, color, bg) => {
    g2.fillStyle = bg; g2.fillRect(0, 0, w, h)
    for (let row = 0; row < 16; row++) for (let col = 0; col < 14; col++) {
      const x = (col + (row % 2) * 0.5) * (w / 14), y = (row + 0.5) * (h / 16)
      g2.fillStyle = color
      g2.beginPath(); g2.ellipse(x, y, 4.2, 6.5, 0, 0, 7); g2.fill()
    }
  }
  const map = canvasTex(512, 512, (g2, w, h) => {
    const gr = g2.createLinearGradient(0, 0, 0, h)
    gr.addColorStop(0, '#d90f2a'); gr.addColorStop(1, '#ff4655')
    seeds(g2, w, h, '#ffe27a', gr)
    // darker pit around each seed
    g2.globalCompositeOperation = 'multiply'
    for (let i = 0; i < 0; i++) g2.fillRect(0, 0, 1, 1)
  })
  const bump = canvasTex(512, 512, (g2, w, h) => seeds(g2, w, h, '#000', '#aaa'), false)
  const body = mesh(new THREE.LatheGeometry(pts, 72),
    phys({ map, bumpMap: bump, bumpScale: -3, roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.25 }))
  g.add(body)
  const green = std({ color: '#3f9a2c', roughness: 0.6, side: THREE.DoubleSide })
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2
    const c = mesh(new THREE.ConeGeometry(0.2, 0.62, 12), green)
    c.position.set(Math.cos(a) * 0.4, 0.74, Math.sin(a) * 0.4)
    c.rotation.set(Math.sin(a) * 1.15, 0, -Math.cos(a) * 1.15)
    c.scale.z = 0.3
    g.add(c)
  }
  const st = mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.34, 10), std({ color: '#4b8a2a' }))
  st.position.y = 0.92; st.rotation.z = 0.2
  g.add(st)
  void R
  return g
}

function pineapple() {
  const g = new THREE.Group()
  const diamonds = (g2, w, h, fill, line, dot) => {
    g2.fillStyle = fill; g2.fillRect(0, 0, w, h)
    const n = 10
    g2.strokeStyle = line; g2.lineWidth = 5
    for (let i = -n; i <= n * 2; i++) {
      g2.beginPath(); g2.moveTo(i * (w / n), 0); g2.lineTo(i * (w / n) + w, h); g2.stroke()
      g2.beginPath(); g2.moveTo(i * (w / n), h); g2.lineTo(i * (w / n) + w, 0); g2.stroke()
    }
    g2.fillStyle = dot
    for (let r = 0; r < n * 1.5; r++) for (let c = 0; c < n; c++) {
      g2.beginPath(); g2.arc((c + (r % 2 ? 0.5 : 0)) * (w / n) + w / n / 2, (r + 0.5) * (h / (n * 1.5)), 5, 0, 7); g2.fill()
    }
  }
  const map = canvasTex(512, 512, (g2, w, h) => diamonds(g2, w, h, '#f4b81f', '#a8631a', '#6b3a10'))
  const bump = canvasTex(512, 512, (g2, w, h) => diamonds(g2, w, h, '#bbb', '#111', '#000'), false)
  const body = mesh(new THREE.SphereGeometry(1, 64, 48),
    phys({ map, bumpMap: bump, bumpScale: 3, roughness: 0.55 }))
  body.scale.set(0.72, 0.98, 0.72)
  g.add(body)
  const cols = ['#2e8a2a', '#3da636', '#287a26']
  const R = rnd(5)
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + R() * 0.2
    const ring = i % 2 ? 0.28 : 0.12
    const c = mesh(new THREE.ConeGeometry(0.11, 0.9 + R() * 0.25, 8), std({ color: cols[i % 3], roughness: 0.6 }))
    c.position.set(Math.cos(a) * ring * 0.8, 1.2, Math.sin(a) * ring * 0.8)
    c.rotation.set(Math.sin(a) * (0.25 + ring * 1.2), 0, -Math.cos(a) * (0.25 + ring * 1.2))
    c.scale.z = 0.55
    g.add(c)
  }
  const mid = mesh(new THREE.ConeGeometry(0.1, 1.2, 8), std({ color: '#3da636' }))
  mid.position.y = 1.45
  g.add(mid)
  return g
}

function mango() {
  const g = new THREE.Group()
  const map = canvasTex(256, 256, (g2, w, h) => {
    const gr = g2.createLinearGradient(0, 0, w, h)
    gr.addColorStop(0, '#ff3b1d'); gr.addColorStop(0.45, '#ff9a14'); gr.addColorStop(0.8, '#ffd23a'); gr.addColorStop(1, '#9dc23a')
    g2.fillStyle = gr; g2.fillRect(0, 0, w, h)
    const R = rnd(8)
    for (let i = 0; i < 700; i++) { g2.fillStyle = 'rgba(255,255,255,.25)'; g2.fillRect(R() * w, R() * h, 1.5, 1.5) }
  })
  const body = mesh(new THREE.SphereGeometry(1, 64, 48), phys({ map, roughness: 0.32, clearcoat: 0.5, clearcoatRoughness: 0.3 }))
  body.scale.set(1, 0.86, 0.7)
  body.rotation.z = -0.35
  const stem = mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.22, 10), std({ color: '#5a6a22' }))
  stem.position.set(0.1, 0.78, 0)
  const l = leaf('#2f7a28', 0.75, 0.26); l.position.set(0.5, 0.86, 0); l.rotation.z = 0.35
  return add(g, body, stem, l)
}

function watermelon() {
  const g = new THREE.Group()
  const mk = (r, h, col, th = 0, extra = {}) => {
    const geo = new THREE.CylinderGeometry(r, r, h, 72, 1, false, Math.PI / 2, Math.PI)
    geo.rotateX(Math.PI / 2)
    return mesh(geo, std({ color: col, ...extra }))
  }
  const rind = mk(1, 0.5, '#2f8a2f', 0, { roughness: 0.5 })
  const white = mk(0.93, 0.52, '#f1f6dc')
  const flesh = mk(0.86, 0.54, '#ff3a52', 0, { roughness: 0.25 })
  add(g, rind, white, flesh)
  const seedMat = std({ color: '#161010', roughness: 0.3 })
  const R = rnd(14)
  for (let i = 0; i < 14; i++) {
    const a = 0.3 + R() * (Math.PI - 0.6)
    const rr = 0.18 + R() * 0.52
    const s = mesh(new THREE.SphereGeometry(0.06, 10, 8), seedMat)
    s.scale.set(0.7, 1.4, 0.45)
    s.position.set(Math.cos(a) * rr, Math.sin(a) * rr * 0.9, 0.27)
    s.rotation.z = a - Math.PI / 2 + (R() - 0.5) * 0.6
    g.add(s)
    const b2 = s.clone(); b2.position.z = -0.27; g.add(b2)
  }
  // flat side faces up-left, tilt so the round edge sits low
  g.rotation.z = 0
  const flip = new THREE.Group(); flip.add(g); g.rotation.z = Math.PI
  g.rotation.x = 0
  return flip
}

/* ───────────── burger ───────────── */
function burger() {
  const g = new THREE.Group()
  const bunT = peel('#e0902f', '#a85d12', 1500, 0.8, 2, 31)
  const bunMat = phys({ map: bunT.map, bumpMap: bunT.bump, bumpScale: 1, roughness: 0.55, clearcoat: 0.15 })
  const top = mesh(new THREE.SphereGeometry(1.05, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), bunMat)
  top.scale.y = 0.78; top.position.y = 0.42
  const topLip = mesh(new THREE.CylinderGeometry(1.05, 1.0, 0.1, 64), bunMat); topLip.position.y = 0.4
  const seedGeo = new THREE.SphereGeometry(0.05, 10, 8); seedGeo.scale(1.6, 0.6, 0.9)
  const seeds = new THREE.Group(); seeds.position.y = 0.42
  sphereOn(seeds, 1, 1.07, 34, seedGeo, std({ color: '#fff0c6', roughness: 0.5 }), 17, 1.0, 0.78)
  const lettuce = mesh(new THREE.CylinderGeometry(1.14, 1.14, 0.06, 96, 1), std({ color: '#5fbf2f', roughness: 0.5 }))
  const pos = lettuce.geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i)
    if (Math.hypot(x, z) > 0.9) pos.setY(i, pos.getY(i) + Math.sin(Math.atan2(z, x) * 11) * 0.07)
  }
  lettuce.geometry.computeVertexNormals(); lettuce.position.y = 0.3
  const tomato = mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.1, 48), phys({ color: '#e0261b', roughness: 0.25, clearcoat: 0.7 })); tomato.position.y = 0.2
  const cheese = mesh(new THREE.BoxGeometry(1.95, 0.05, 1.95), std({ color: '#ffc524', roughness: 0.35 })); cheese.position.y = 0.12; cheese.rotation.y = Math.PI / 4
  const pt = peel('#4a2713', '#2a1208', 1600, 0.8, 2.2, 5)
  const patty = mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.3, 64), std({ map: pt.map, bumpMap: pt.bump, bumpScale: 2, roughness: 0.85 })); patty.position.y = -0.08
  const bot = mesh(new THREE.CylinderGeometry(1.02, 0.95, 0.3, 64), bunMat); bot.position.y = -0.38
  const botCap = mesh(new THREE.SphereGeometry(0.98, 48, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), bunMat)
  botCap.scale.y = 0.18; botCap.position.y = -0.53
  return add(g, top, topLip, seeds, lettuce, tomato, cheese, patty, bot, botCap)
}

function fries() {
  const g = new THREE.Group()
  const carton = mesh(new THREE.CylinderGeometry(1.15, 0.8, 1.2, 4, 1, true),
    phys({ color: '#e11d2e', roughness: 0.4, side: THREE.DoubleSide, clearcoat: 0.3 }))
  carton.rotation.y = Math.PI / 4; carton.position.y = -0.5
  const band = mesh(new THREE.CylinderGeometry(1.1, 1.06, 0.1, 4, 1, true), std({ color: '#ffc20e', side: THREE.DoubleSide }))
  band.rotation.y = Math.PI / 4; band.position.y = 0.05
  g.add(carton, band)
  const R = rnd(40)
  for (let i = 0; i < 26; i++) {
    const len = 1.5 + R() * 1.0
    const m = mesh(new THREE.BoxGeometry(0.17, len, 0.17), std({ color: new THREE.Color().setHSL(0.115 + R() * 0.02, 0.92, 0.46 + R() * 0.07), roughness: 0.65 }))
    const rr = Math.sqrt(R()) * 0.72, a = R() * 6.28
    m.position.set(Math.cos(a) * rr, 0.1 + len / 2 - 0.55 + R() * 0.1, Math.sin(a) * rr)
    m.rotation.set((R() - 0.5) * 0.5 + Math.sin(a) * rr * 0.4, R() * 3, (R() - 0.5) * 0.5 - Math.cos(a) * rr * 0.4)
    g.add(m)
  }
  return g
}

/* ───────────── drinks & bowls ───────────── */
const glassMat = () => phys({ color: '#ffffff', transparent: true, opacity: 0.22, roughness: 0.05, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false })

function straw(color = '#e6007e', h = 2.1) {
  const s = new THREE.Group()
  const c = mesh(new THREE.CylinderGeometry(0.055, 0.055, h, 14), std({ color, roughness: 0.35 }))
  const stripes = canvasTex(8, 64, (g2, w, hh) => { g2.fillStyle = '#fff'; g2.fillRect(0, 0, w, hh); g2.fillStyle = color; for (let i = 0; i < 8; i++) g2.fillRect(0, i * 8, w, 4) })
  c.material.map = stripes
  s.add(c)
  return s
}

function juice() {
  const g = new THREE.Group()
  const glass = mesh(new THREE.CylinderGeometry(0.78, 0.6, 1.8, 56, 1, true), glassMat())
  const base = mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.12, 56), phys({ color: '#dfe9ee', transparent: true, opacity: 0.4, roughness: 0.1 })); base.position.y = -0.9
  const liq = mesh(new THREE.CylinderGeometry(0.73, 0.58, 1.45, 56), phys({ color: '#ff8f12', emissive: '#ff6a00', emissiveIntensity: 0.25, roughness: 0.15, transparent: true, opacity: 0.93 }))
  liq.position.y = -0.1
  const top = mesh(new THREE.CircleGeometry(0.73, 56), std({ color: '#ffb23a', roughness: 0.2 })); top.rotation.x = -Math.PI / 2; top.position.y = 0.63
  const ice = new THREE.Group()
  const R = rnd(2)
  for (let i = 0; i < 4; i++) {
    const c = mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), phys({ color: '#ffffff', transparent: true, opacity: 0.45, roughness: 0.05 }))
    c.position.set((R() - 0.5) * 0.7, 0.4 + R() * 0.3, (R() - 0.5) * 0.6); c.rotation.set(R() * 3, R() * 3, R() * 3); ice.add(c)
  }
  const s = straw(); s.position.set(0.18, 0.55, -0.1); s.rotation.z = -0.22
  const sl = new THREE.Group()
  const rind = mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.07, 40), std({ color: '#ff8a0d' }))
  const pith = mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.08, 40), std({ color: '#fff1d0' }))
  const pulp = mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.09, 40), phys({ color: '#ffa31a', roughness: 0.2 }))
  sl.add(rind, pith, pulp); sl.rotation.x = Math.PI / 2; sl.position.set(-0.62, 0.78, 0.18); sl.rotation.y = 0.2; sl.rotation.z = 0.3
  return add(g, glass, base, liq, top, ice, s, sl)
}

function shake() {
  const g = new THREE.Group()
  const cup = mesh(new THREE.CylinderGeometry(0.8, 0.58, 1.9, 56, 1, true), phys({ color: '#ff8ec4', transparent: true, opacity: 0.8, roughness: 0.12, clearcoat: 1, side: THREE.DoubleSide }))
  cup.position.y = -0.1
  const shk = mesh(new THREE.CylinderGeometry(0.76, 0.6, 1.5, 56), std({ color: '#ff6fb1', roughness: 0.4 })); shk.position.y = -0.2
  const cream = new THREE.Group()
  const cm = phys({ color: '#fff8ef', roughness: 0.35, clearcoat: 0.3 })
  ;[[0.72, 0.3, 0.98], [0.58, 0.27, 1.22], [0.42, 0.24, 1.44], [0.26, 0.2, 1.62]].forEach(([r, t, y]) => {
    const tor = mesh(new THREE.TorusGeometry(r, t, 24, 48), cm); tor.rotation.x = Math.PI / 2; tor.position.y = y - 0.1; cream.add(tor)
  })
  const cherry = mesh(new THREE.SphereGeometry(0.2, 24, 20), phys({ color: '#c2102a', roughness: 0.12, clearcoat: 1 })); cherry.position.y = 1.9
  const sc = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), std({ color: '#3a7a2a' })); sc.position.set(0.05, 2.1, 0); sc.rotation.z = 0.4
  const s = straw('#ffc20e', 2.3); s.position.set(0.25, 1.25, -0.05); s.rotation.z = -0.18
  const drip = mesh(new THREE.TorusGeometry(0.76, 0.05, 12, 56), std({ color: '#ffe3f1', roughness: 0.3 })); drip.rotation.x = Math.PI / 2; drip.position.y = 0.85
  return add(g, cup, shk, cream, cherry, sc, s, drip)
}

const lathe = (pts, seg = 64) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg)

function chai() {
  const g = new THREE.Group()
  const ceramic = phys({ color: '#fbf3e6', roughness: 0.2, clearcoat: 0.8, side: THREE.DoubleSide })
  const cup = mesh(lathe([[0, -0.52], [0.34, -0.52], [0.5, -0.45], [0.74, 0.1], [0.82, 0.62], [0.76, 0.62], [0.68, 0.1], [0.46, -0.32], [0, -0.38]]), ceramic)
  const tea = mesh(new THREE.CircleGeometry(0.75, 48), phys({ color: '#b86a2c', roughness: 0.15, clearcoat: 1 })); tea.rotation.x = -Math.PI / 2; tea.position.y = 0.5
  const handle = mesh(new THREE.TorusGeometry(0.28, 0.07, 14, 28, Math.PI * 1.25), ceramic); handle.position.set(0.82, 0.2, 0); handle.rotation.z = -Math.PI * 0.62
  const saucer = mesh(lathe([[0, -0.62], [0.9, -0.62], [1.25, -0.5], [1.3, -0.47], [1.26, -0.46], [0.9, -0.56], [0, -0.56]]), ceramic)
  const band = mesh(new THREE.TorusGeometry(0.8, 0.025, 8, 64), std({ color: '#e6007e' })); band.rotation.x = Math.PI / 2; band.position.y = 0.54
  const steam = new THREE.Group()
  for (let i = 0; i < 3; i++) {
    const s = mesh(new THREE.TorusGeometry(0.16, 0.025, 8, 24, Math.PI * 1.5), std({ color: '#ffffff', transparent: true, opacity: 0.55 }))
    s.position.set(-0.25 + i * 0.25, 1.0 + (i % 2) * 0.12, 0); s.rotation.set(0, 0, i * 1.1); steam.add(s)
  }
  return add(g, cup, tea, handle, saucer, band, steam)
}

function bowl(tint) {
  const g = new THREE.Group()
  const b = phys({ color: tint, roughness: 0.22, clearcoat: 0.8, side: THREE.DoubleSide })
  const body = mesh(lathe([[0, -0.62], [0.5, -0.62], [0.95, -0.2], [1.2, 0.4], [1.24, 0.48], [1.16, 0.48], [1.1, 0.4], [0.88, -0.1], [0.46, -0.5], [0, -0.5]]), b)
  const rim = mesh(new THREE.TorusGeometry(1.2, 0.04, 8, 64), std({ color: '#ffffff', roughness: 0.2 })); rim.rotation.x = Math.PI / 2; rim.position.y = 0.48
  g.add(body, rim)
  return g
}

function soup() {
  const g = bowl('#ffffff')
  const surf = mesh(new THREE.CircleGeometry(1.12, 56), phys({ color: '#f0762a', roughness: 0.12, clearcoat: 1 })); surf.rotation.x = -Math.PI / 2; surf.position.y = 0.34
  g.add(surf)
  const R = rnd(9)
  const crouton = std({ color: '#d9a458', roughness: 0.7 })
  for (let i = 0; i < 7; i++) { const c = mesh(new THREE.BoxGeometry(0.26, 0.2, 0.26), crouton); const a = R() * 6.28, r = Math.sqrt(R()) * 0.7; c.position.set(Math.cos(a) * r, 0.42, Math.sin(a) * r); c.rotation.set(R(), R() * 3, R()); g.add(c) }
  const herb = std({ color: '#3da636', roughness: 0.6 })
  for (let i = 0; i < 12; i++) { const c = mesh(new THREE.SphereGeometry(0.07, 8, 6), herb); c.scale.y = 0.4; const a = R() * 6.28, r = Math.sqrt(R()) * 0.9; c.position.set(Math.cos(a) * r, 0.36, Math.sin(a) * r); g.add(c) }
  const swirl = mesh(new THREE.TorusGeometry(0.4, 0.05, 8, 32), std({ color: '#fff4e0', roughness: 0.3 })); swirl.rotation.x = Math.PI / 2; swirl.position.y = 0.36
  g.add(swirl)
  const steam = new THREE.Group()
  for (let i = 0; i < 3; i++) { const s = mesh(new THREE.TorusGeometry(0.2, 0.03, 8, 24, Math.PI * 1.5), std({ color: '#fff', transparent: true, opacity: 0.5 })); s.position.set(-0.4 + i * 0.4, 1.1 + (i % 2) * 0.15, 0); s.rotation.z = i * 1.2; steam.add(s) }
  return add(g, steam)
}

function chaat() {
  const g = bowl('#14b3a8')
  const R = rnd(33)
  const chick = std({ color: '#dba75e', roughness: 0.75 })
  const yog = std({ color: '#fffaf0', roughness: 0.35 })
  const red = std({ color: '#b5173a', roughness: 0.45 })
  const mound = (rr, i) => {
    const a = R() * 6.28, d = Math.sqrt(R()) * rr
    const y = 0.35 + Math.sqrt(Math.max(0, 1 - (d / rr) ** 2)) * 0.45
    return [Math.cos(a) * d, y, Math.sin(a) * d]
  }
  for (let i = 0; i < 44; i++) { const m = mesh(new THREE.SphereGeometry(0.15 + R() * 0.04, 12, 10), chick); m.position.set(...mound(1.0, i)); m.scale.set(1, 0.85, 1); g.add(m) }
  for (let i = 0; i < 7; i++) { const m = mesh(new THREE.SphereGeometry(0.26, 14, 10), yog); const p = mound(0.8, i); m.position.set(p[0], p[1] + 0.1, p[2]); m.scale.y = 0.45; g.add(m) }
  for (let i = 0; i < 9; i++) { const m = mesh(new THREE.TorusGeometry(0.12, 0.03, 6, 14), red); const p = mound(0.9, i); m.position.set(p[0], p[1] + 0.16, p[2]); m.rotation.set(R() * 3, R() * 3, 0); g.add(m) }
  const cor = std({ color: '#2f9a2a', roughness: 0.6, side: THREE.DoubleSide })
  for (let i = 0; i < 8; i++) { const m = mesh(new THREE.ConeGeometry(0.1, 0.22, 6), cor); const p = mound(0.8, i); m.position.set(p[0], p[1] + 0.22, p[2]); m.scale.z = 0.25; m.rotation.set(R() * 2, R() * 6, R() * 2); g.add(m) }
  const sev = std({ color: '#f2c24a', roughness: 0.7 })
  for (let i = 0; i < 18; i++) { const m = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.4, 5), sev); const p = mound(0.9, i); m.position.set(p[0], p[1] + 0.2, p[2]); m.rotation.set(R() * 3, 0, R() * 3); g.add(m) }
  return g
}

const BUILD = { orange, lemon, strawberry, pineapple, mango, watermelon, burger, fries, juice, shake, chai, soup, chaat }
// starting tilt so each item shows its best side
const TILT = { burger: 0.5, fries: 0.15, juice: 0.1, shake: 0.1, chai: 0.3, soup: 0.8, chaat: 0.8, watermelon: 0, pineapple: 0, strawberry: 0.1 }
const cache = {}

export function makeModel(kind) {
  if (!cache[kind]) {
    const g = (BUILD[kind] || orange)()
    g.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(g)
    const center = box.getCenter(new THREE.Vector3())
    let rad = 0
    const v = new THREE.Vector3()
    g.traverse((o) => {
      if (!o.isMesh) return
      const pos = o.geometry.attributes.position
      const step = Math.max(1, Math.floor(pos.count / 400))
      for (let i = 0; i < pos.count; i += step) rad = Math.max(rad, v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld).distanceTo(center))
    })
    const k = 1.2 / rad
    const inner = new THREE.Group()
    g.position.sub(center)
    inner.add(g)
    inner.scale.setScalar(k)
    inner.rotation.x = TILT[kind] ?? 0
    const pivot = new THREE.Group()
    pivot.add(inner)
    cache[kind] = pivot
  }
  return cache[kind].clone()
}
