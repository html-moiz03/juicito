import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const TEXT =
  'A place you stop at "just for a juice", then spot a burger, then fries, then a chaat, and somehow end up ordering for the whole table. Known for sudden cravings, "bas ek aur" and evenings that run longer than planned.'

export default function Definition() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.def__w', {
        opacity: 1,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: '.def__card',
          start: 'top 70%',
          end: 'bottom 55%',
          scrub: true,
        },
      })
      gsap.from('.def__card', {
        y: 120, rotation: -3, opacity: 0,
        scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'top 35%', scrub: true },
      })
      gsap.to('.def__pic--a', { y: -80, rotation: -10, scrollTrigger: { trigger: root.current, scrub: true } })
      gsap.to('.def__pic--b', { y: 60, rotation: 12, scrollTrigger: { trigger: root.current, scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="def" ref={root}>
      <div className="def__pic def__pic--a" aria-hidden="true"><span>🍹</span><small>photo here</small></div>
      <div className="def__pic def__pic--b" aria-hidden="true"><span>🍔</span><small>photo here</small></div>

      <article className="def__card">
        <h2 className="def__title">JUICITO</h2>
        <p className="def__sub">[JOO-SEE-TOH] NOUN · <em>ALMOST A HABIT</em></p>
        <hr />
        <p className="def__text">
          {TEXT.split(' ').map((w, i) => (
            <span className="def__w" key={i}>{w} </span>
          ))}
        </p>
        <p className="def__syn"><b>Synonyms:</b> <em>fresh fix</em> · thirst solution · "one more!"</p>
        <div className="def__script">bas ek aur…<br />and we're good</div>
      </article>
    </section>
  )
}
