import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Food from './Food.jsx'

const HOW = [
  { n: '1', t: 'YOU CHOOSE YOUR CRAVING' },
  { n: '2', t: 'WE PREPARE IT FRESH' },
  { n: '3', t: 'YOU ENJOY (OR SHARE… OR NOT)' },
]

export default function Statement() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stmt__line', {
        yPercent: 60, opacity: 0, rotation: -3, stagger: 0.25,
        scrollTrigger: { trigger: '.stmt__script', start: 'top 85%', end: 'top 35%', scrub: true },
      })
      gsap.to('.stmt__doodle', {
        y: (i) => (i % 2 ? -90 : 70),
        rotation: (i) => (i % 2 ? 25 : -25),
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.from('.how__item', {
        y: 60, opacity: 0, stagger: 0.18,
        scrollTrigger: { trigger: '.how', start: 'top 85%', end: 'top 55%', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="stmt" ref={root}>
      <span className="stmt__doodle d1" aria-hidden="true"><Food kind="strawberry" /></span>
      <span className="stmt__doodle d2" aria-hidden="true"><Food kind="lemon" /></span>
      <span className="stmt__doodle d3" aria-hidden="true"><Food kind="mango" /></span>

      <p className="eyebrow eyebrow--orange">SYNONYM: GOOD MOOD</p>
      <h2 className="stmt__script">
        <span className="stmt__line">life is short,</span>
        <span className="stmt__line">have juicito first!</span>
      </h2>

      <ol className="how">
        {HOW.map((h) => (
          <li className="how__item" key={h.n}>
            <span>{h.n}</span>
            <b>{h.t}</b>
          </li>
        ))}
      </ol>
    </section>
  )
}
