import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { FLAVORS_A, FLAVORS_B } from '../data.js'

function Row({ items, reverse }) {
  const set = (hidden) => (
    <div className="flv__set" aria-hidden={hidden || undefined}>
      {items.map((w, i) => (
        <span
          key={w}
          className={i % 3 === 1 ? 'dim' : ''}
          style={{ '--r': `${(i % 2 ? 1 : -1) * (2 + (i % 3))}deg`, '--d': `${i * 0.35}s` }}
        >
          {w}
        </span>
      ))}
    </div>
  )
  return (
    <div className={'flv__row' + (reverse ? ' rev' : '')}>
      {set(false)}
      {set(true)}
    </div>
  )
}

export default function Flavors() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.flv__big span', {
        yPercent: 120, rotation: 8, stagger: 0.1, duration: 0.8, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '.flv__big', start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="flv edge-wave" ref={root} style={{ '--bg': 'var(--magenta)' }}>
      <p className="eyebrow eyebrow--yellow">NO PRESSURE. WELL, A LITTLE.</p>
      <h2 className="flv__h">
        SIXTEEN CRAVINGS,<br />ONE RULE:
      </h2>
      <div className="flv__rows">
        <Row items={FLAVORS_A} />
        <Row items={FLAVORS_B} reverse />
      </div>
      <div className="flv__big">
        <span>HAVE</span> <span>JUICITO</span> <span>FIRST!</span>
      </div>
    </section>
  )
}
