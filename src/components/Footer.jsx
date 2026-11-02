import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const WORD = '¡JUICITO FIRST!'.split('')
const BITS = ['🍊', '🍔', '🍓', '🍟', '🥭', '🍋', '🍹', '🍉']

export default function Footer() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ftr__big .ch', {
        yPercent: 110, rotation: (i) => (i % 2 ? 14 : -14), opacity: 0, stagger: 0.04,
        duration: 0.7, ease: 'back.out(1.8)',
        scrollTrigger: { trigger: '.ftr__big', start: 'top 92%' },
      })
      // pokeable fruit: click / tap and it jumps
      gsap.utils.toArray('.ftr__bit').forEach((el, i) => {
        gsap.to(el, { y: -10, rotation: i % 2 ? 8 : -8, duration: 1.4 + i * 0.12, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        el.addEventListener('pointerenter', () => {
          gsap.fromTo(el.firstChild, { scale: 1 }, { scale: 1.5, rotation: 360, duration: 0.5, ease: 'back.out(3)', yoyo: true, repeat: 1 })
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <footer className="ftr edge-wave" ref={root} style={{ '--bg': 'var(--pink)' }}>
      <p className="eyebrow eyebrow--yellow">PSST… TOUCH THE FRUIT</p>
      <div className="ftr__bits">
        {BITS.map((b, i) => (
          <span key={i} className="ftr__bit"><span>{b}</span></span>
        ))}
      </div>
      <div className="ftr__big" aria-label="JUICITO first!">
        {WORD.map((c, i) => (
          <span key={i} className="ch" style={{ '--r': `${(i % 2 ? 1 : -1) * (2 + (i % 4))}deg` }} aria-hidden="true">
            {c === ' ' ? ' ' : c}
          </span>
        ))}
      </div>
      <div className="ftr__line">
        <b className="ftr__logo">JUICITO</b>
        <span>Refreshing · Hygienic · Energetic · Freshly prepared for you</span>
        <span>© 2026 JUICITO · Website concept</span>
      </div>
    </footer>
  )
}
