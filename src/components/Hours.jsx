import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { INFO } from '../data.js'

export default function Hours() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hrs__row', {
        x: -120, opacity: 0, stagger: 0.2,
        scrollTrigger: { trigger: '.hrs__rows', start: 'top 85%', end: 'top 50%', scrub: true },
      })
      gsap.to('.hrs__glass', {
        y: -60, rotation: 8,
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hrs edge-wave" ref={root} style={{ '--bg': 'var(--yellow)' }}>
      <div className="hrs__in">
        <div>
          <div className="hrs__clock" aria-hidden="true">⏱️</div>
          <p className="eyebrow eyebrow--magenta">THE KITCHEN IS OPEN</p>
          <h2 className="hrs__h">SCHEDULES</h2>
          <div className="hrs__rows">
            {INFO.hours.map((h) => (
              <div className="hrs__row" key={h.days}>
                <small>{h.days}</small>
                <b>{h.time}</b>
              </div>
            ))}
          </div>
          <p className="hrs__script">fresh, always.</p>
        </div>

        <div className="hrs__art" aria-hidden="true">
          <div className="hrs__disc" />
          <div className="hrs__glass">🥤</div>
        </div>
      </div>
    </section>
  )
}
