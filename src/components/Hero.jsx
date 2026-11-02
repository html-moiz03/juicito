import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { PHONE } from '../data.js'
import Food from './Food.jsx'

const LETTERS = [
  ['J', -5], ['U', 4], ['I', -3], ['C', 6], ['I', -6], ['T', 3], ['O', -4],
]

const FRUITS = [
  { k: 'orange', x: 6, y: 18, s: 7, d: 0.8 },
  { k: 'strawberry', x: 84, y: 14, s: 6, d: 1.2 },
  { k: 'pineapple', x: 70, y: 60, s: 8, d: 0.6 },
  { k: 'mango', x: 18, y: 62, s: 6.5, d: 1 },
  { k: 'watermelon', x: 44, y: 8, s: 5.5, d: 1.4 },
  { k: 'burger', x: 90, y: 46, s: 6, d: 0.9 },
  { k: 'fries', x: 3, y: 42, s: 5, d: 1.1 },
  { k: 'lemon', x: 56, y: 70, s: 4.5, d: 1.3 },
]

export default function Hero() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // endless float
      gsap.utils.toArray('.fruit__in').forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? 22 : -22,
          rotation: i % 2 ? 10 : -10,
          duration: 2.2 + i * 0.25,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
      // mouse parallax
      const fruits = gsap.utils.toArray('.fruit')
      const setters = fruits.map((el) => ({
        x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }),
        d: parseFloat(el.dataset.depth),
      }))
      const move = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        setters.forEach((s) => {
          s.x(nx * 60 * s.d)
          s.y(ny * 60 * s.d)
        })
      }
      window.addEventListener('pointermove', move)
      // scroll: word drifts up, fruits fly apart
      gsap.to('.hero__word', {
        yPercent: -18,
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero__fruits', {
        yPercent: 30,
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      return () => window.removeEventListener('pointermove', move)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__bgword" aria-hidden="true">juicito</div>

      <div className="hero__fruits" aria-hidden="true">
        {FRUITS.map((f, i) => (
          <div
            key={i}
            className="fruit"
            data-depth={f.d}
            style={{ left: `${f.x}%`, top: `${f.y}%`, '--s': f.s }}
          >
            <span className="fruit__in"><Food kind={f.k} /></span>
          </div>
        ))}
      </div>

      <h1 className="hero__word" aria-label="JUICITO">
        {LETTERS.map(([l, r], i) => (
          <span key={i} className="l" style={{ '--i': i, '--r': `${r}deg` }}>{l}</span>
        ))}
      </h1>

      <div className="badge" aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <defs>
            <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
          </defs>
          <text>
            <textPath href="#circ">¡UNA MÁS! • FRESH • HYGIENIC • ENERGETIC •</textPath>
          </text>
        </svg>
        <span><Food kind="juice" /></span>
      </div>

      <div className="hero__foot">
        <p className="hero__lead">
          FRESH JUICES, SHAKES,<br />BURGERS &amp; FAST FOOD,<br />MADE JUST FOR YOU.
        </p>
        <div className="hero__scroll"><i />SCROLL</div>
        <div className="hero__order">
          <b>¡HASTA PRONTO!</b>
          <span>ORDER · {PHONE}</span>
        </div>
      </div>
    </section>
  )
}
