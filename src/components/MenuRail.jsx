import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { MENU, TEL, PHONE } from '../data.js'

export default function MenuRail() {
  const root = useRef(null)
  const track = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const dist = () => Math.max(0, track.current.scrollWidth - window.innerWidth + 60)
      gsap.to(track.current, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + dist(),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
      gsap.to('.rail__ghost', {
        x: () => -dist() * 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + dist(),
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="rail" id="menu" ref={root}>
      <div className="rail__ghost" aria-hidden="true">HUNGRY THIRSTY</div>

      <header className="rail__head">
        <p className="eyebrow eyebrow--orange">JUICITO'S MENU</p>
        <h2>HUNGRY? THIRSTY?<br />BOTH.</h2>
      </header>

      <div className="rail__track" ref={track}>
        {MENU.map((m, i) => (
          <article
            key={m.id}
            className="mcard"
            style={{
              '--c': m.color,
              '--tilt': `${i % 2 ? 2.2 : -2.2}deg`,
              '--lift': `${i % 2 ? 28 : -8}px`,
            }}
          >
            <span className="mcard__n">{String(i + 1).padStart(2, '0')}</span>
            <h3>{m.title}</h3>
            <ul>
              {m.items.map((it) => (
                <li key={it.n}>
                  <span className="e">{it.e}</span>
                  <span className="nm">{it.n}</span>
                  {it.p && <span className="pr">{it.p}</span>}
                </li>
              ))}
            </ul>
          </article>
        ))}

        <a className="rail__cta" href={TEL}>
          <b>CALL &amp;<br />ORDER!</b>
          <span>{PHONE}</span>
          <small>Menu shown is a selection. Call for the full list &amp; prices.</small>
        </a>
      </div>
    </section>
  )
}
