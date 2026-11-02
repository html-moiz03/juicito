import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const STRIPES = ['#b0005f', '#e6007e', '#f58220', '#ffc20e', '#66a81b']

export default function Loader({ onDone }) {
  const root = useRef(null)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const o = { v: 0 }
    const tl = gsap.timeline()
    tl.to(o, {
      v: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => setPct(Math.round(o.v)),
    })
      .to('.loader__core', { opacity: 0, y: -24, duration: 0.4 })
      .to('.loader__stripe', {
        yPercent: -100,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power3.inOut',
      })
      .add(() => onDone(), '-=0.6')
      .set(root.current, { display: 'none' })
    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__stripes">
        {STRIPES.map((c) => (
          <div key={c} className="loader__stripe" style={{ background: c }} />
        ))}
      </div>
      <div className="loader__core">
        <div className="loader__icon">🥤</div>
        <div className="loader__pill">Squeezing the good stuff… {pct}%</div>
        <div className="loader__bar">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
      </div>
      <div className="loader__go">¡VAAAMOS!</div>
    </div>
  )
}
