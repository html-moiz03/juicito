// One shared WebGL renderer draws every food item into its own 2D canvas
// (so the page never hits the browser's WebGL-context limit).
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { makeModel } from './models.js'

const SIZE = 560
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

let R, scene, cam
const items = new Set()
const visible = new Set()
let raf = 0
let last = 0

const ptr = { x: 0, y: 0, on: false, t: 0 }
const tilt = { x: 0, y: 0, tx: 0, ty: 0 }

function init() {
  if (R) return
  R = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'default' })
  R.setPixelRatio(1)
  R.setSize(SIZE, SIZE, false)
  R.setClearColor(0x000000, 0)
  R.outputColorSpace = THREE.SRGBColorSpace
  R.toneMapping = THREE.ACESFilmicToneMapping
  R.toneMappingExposure = 0.82
  scene = new THREE.Scene()
  const pm = new THREE.PMREMGenerator(R)
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.03).texture
  scene.environmentIntensity = 0.55
  const key = new THREE.DirectionalLight('#fff2dd', 2.0); key.position.set(3, 4.5, 5)
  const rim = new THREE.DirectionalLight('#ff5ab0', 1.6); rim.position.set(-4, 2, -3)
  const fill = new THREE.DirectionalLight('#bfe6ff', 0.6); fill.position.set(-3, -1, 3)
  scene.add(key, rim, fill, new THREE.AmbientLight('#ffffff', 0.25))
  cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
  cam.position.set(0, 0, 5.4)
}

function frame(now) {
  raf = requestAnimationFrame(frame)
  const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now
  tilt.x += (tilt.tx - tilt.x) * 0.08
  tilt.y += (tilt.ty - tilt.y) * 0.08
  const pointerLive = ptr.on || now - ptr.t < 1500
  for (const it of visible) {
    const r = it.canvas.getBoundingClientRect()
    if (r.width < 4 || r.bottom < -80 || r.top > innerHeight + 80) continue
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2
    let tx = 0, ty = 0
    if (pointerLive) {
      tx = clamp(((ptr.x - cx) / innerWidth) * 2.4, -1.2, 1.2)
      ty = clamp(((ptr.y - cy) / innerHeight) * 2.0, -0.9, 0.9)
    }
    tx += tilt.x; ty += tilt.y
    // every item reacts on its own: look at pointer + own idle spin + own drag
    if (!reduce) it.spin += dt * it.speed
    if (!it.drag) { it.dragYaw += it.vy; it.dragPitch += it.vp; it.vy *= 0.94; it.vp *= 0.94 }
    it.sx += (tx - it.sx) * 0.1
    it.sy += (ty - it.sy) * 0.1
    const o = it.obj
    o.rotation.y = it.spin + it.sx * 1.1 + it.dragYaw
    o.rotation.x = clamp(it.sy * 0.5 + it.dragPitch + (reduce ? 0 : Math.sin(now / 900 + it.phase) * 0.06), -0.3, 0.8)
    o.position.x = it.sx * 0.16
    o.position.y = -it.sy * 0.12
    const w = Math.min(SIZE, Math.max(96, Math.round(r.width * Math.min(devicePixelRatio || 1, 2))))
    if (it.canvas.width !== w) { it.canvas.width = w; it.canvas.height = w }
    scene.add(o)
    R.render(scene, cam)
    scene.remove(o)
    it.ctx.clearRect(0, 0, w, w)
    it.ctx.drawImage(R.domElement, 0, 0, SIZE, SIZE, 0, 0, w, w)
    if (!it.shown) { it.shown = true; it.canvas.classList.add('is-on') }
  }
}

function start() { if (!raf && visible.size) { last = performance.now(); raf = requestAnimationFrame(frame) } }
function stop() { if (raf && !visible.size) { cancelAnimationFrame(raf); raf = 0 } }

const io = typeof IntersectionObserver !== 'undefined'
  ? new IntersectionObserver((es) => {
      es.forEach((e) => {
        const it = e.target.__food
        if (!it) return
        e.isIntersecting ? visible.add(it) : visible.delete(it)
      })
      visible.size ? start() : stop()
    }, { rootMargin: '120px' })
  : null

/* ── global input: mouse, finger, device tilt ── */
let wired = false
function wire() {
  if (wired) return
  wired = true
  const set = (x, y) => { ptr.x = x; ptr.y = y; ptr.on = true; ptr.t = performance.now() }
  addEventListener('pointermove', (e) => set(e.clientX, e.clientY), { passive: true })
  addEventListener('pointerdown', (e) => set(e.clientX, e.clientY), { passive: true })
  addEventListener('touchstart', (e) => e.touches[0] && set(e.touches[0].clientX, e.touches[0].clientY), { passive: true })
  addEventListener('touchmove', (e) => e.touches[0] && set(e.touches[0].clientX, e.touches[0].clientY), { passive: true })
  const off = () => { ptr.on = false; ptr.t = performance.now() }
  document.addEventListener('pointerleave', off)
  addEventListener('touchend', off, { passive: true })
  addEventListener('touchcancel', off, { passive: true })

  // phone tilt (gyroscope)
  const onTilt = (e) => {
    if (e.gamma == null) return
    tilt.tx = clamp(e.gamma / 28, -1, 1) * 0.9
    tilt.ty = clamp(((e.beta ?? 45) - 45) / 28, -1, 1) * 0.7
  }
  const listen = () => addEventListener('deviceorientation', onTilt, true)
  const D = window.DeviceOrientationEvent
  if (D && typeof D.requestPermission === 'function') {
    // iOS only hands out sensor data after a tap
    const ask = () => {
      D.requestPermission().then((s) => s === 'granted' && listen()).catch(() => {})
      removeEventListener('touchend', ask)
      removeEventListener('click', ask)
    }
    addEventListener('touchend', ask, { passive: true })
    addEventListener('click', ask)
  } else if (D) listen()
}

export function mount(canvas, kind) {
  init(); wire()
  const ctx = canvas.getContext('2d')
  const it = {
    canvas, ctx, obj: makeModel(kind), kind,
    spin: Math.random() * 6.28, speed: 0.35 + Math.random() * 0.35,
    phase: Math.random() * 6.28,
    sx: 0, sy: 0, dragYaw: 0, dragPitch: 0, vy: 0, vp: 0, drag: false, shown: false,
  }
  canvas.__food = it
  items.add(it)
  io && io.observe(canvas)
  if (!io) { visible.add(it); start() }

  // finger / mouse drag spins just this item
  let lx = 0, ly = 0
  const down = (e) => { it.drag = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture?.(e.pointerId); canvas.classList.add('is-grab') }
  const move = (e) => {
    if (!it.drag) return
    const dx = e.clientX - lx, dy = e.clientY - ly
    lx = e.clientX; ly = e.clientY
    it.dragYaw += dx * 0.014; it.dragPitch = clamp(it.dragPitch + dy * 0.01, -1.2, 1.2)
    it.vy = dx * 0.006; it.vp = 0
  }
  const up = () => { it.drag = false; canvas.classList.remove('is-grab') }
  canvas.addEventListener('pointerdown', down)
  canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerup', up)
  canvas.addEventListener('pointercancel', up)

  return () => {
    io && io.unobserve(canvas)
    items.delete(it); visible.delete(it)
    canvas.removeEventListener('pointerdown', down)
    canvas.removeEventListener('pointermove', move)
    canvas.removeEventListener('pointerup', up)
    canvas.removeEventListener('pointercancel', up)
    delete canvas.__food
    stop()
  }
}
