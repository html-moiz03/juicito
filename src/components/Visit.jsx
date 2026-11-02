import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { INFO, TEL, PHONE } from '../data.js'

export default function Visit() {
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const cur = INFO.branches[active]
  const embed = 'https://www.google.com/maps?q=' + encodeURIComponent(cur.q) + '&z=16&output=embed'
  const open = cur.mapUrl || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(cur.q)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.vis__reveal', {
        y: 70, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
      })
      gsap.from('.vis__map', {
        scale: 0.9, rotation: 3, opacity: 0,
        scrollTrigger: { trigger: '.vis__map', start: 'top 90%', end: 'top 50%', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="vis edge-wave" id="find" ref={root} style={{ '--bg': 'var(--green)' }}>
      <div className="vis__in">
        <div className="vis__left">
          <p className="eyebrow eyebrow--yellow vis__reveal">JUICITO, IT'S AT</p>
          <h2 className="vis__h vis__reveal">FIND<br />JUICITO</h2>
          <div className="vis__branches vis__reveal">
            <p className="vis__bn">{INFO.branches.length} BRANCHES</p>
            <ul>
              {INFO.branches.map((b) => (
                <li key={b.name + b.area}>
                  <div className="vb__head">
                    <span aria-hidden="true">📍</span>
                    <b>{b.name}</b>
                    <small>{b.area}</small>
                  </div>
                  <div className="vb__tels">
                    {b.phones.map((p) => (
                      <a key={p} href={'tel:' + p.replace(/\D/g, '')}>{p}</a>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="vis__btns vis__reveal">
            <a className="btn btn--cream" href={TEL}>📞 {PHONE}</a>
            <a className="btn btn--line" href={open} target="_blank" rel="noreferrer">Get directions ↗</a>
          </div>
          <div className="vis__chips vis__reveal">
            <a href={INFO.foodpanda}>foodpanda</a>
            <a href={INFO.instagram}>Instagram</a>
            <a href={INFO.facebook}>Facebook</a>
          </div>
          <ul className="vis__amen vis__reveal">
            <li><span>🍊</span>Fresh Juice</li>
            <li><span>🍔</span>Burgers</li>
            <li><span>☕</span>Hot Chai</li>
            <li><span>🥗</span>Chatpata</li>
          </ul>
        </div>

        <div className="vis__map">
          <div className="vis__tabs" role="tablist">
            {INFO.branches.map((b, i) => (
              <button key={b.q} role="tab" aria-selected={i === active}
                className={i === active ? 'on' : ''} onClick={() => setActive(i)}>
                {b.tab}
              </button>
            ))}
          </div>
          <div className="vis__frame">
            <iframe key={embed} title={'JUICITO – ' + cur.name + ' ' + cur.area}
              src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
          <a className="vis__open" href={open} target="_blank" rel="noreferrer">
            📍 {cur.name} · {cur.area} — open in Google Maps ↗
          </a>
          <div className="vis__spin" aria-hidden="true">
            <svg viewBox="0 0 200 200">
              <defs><path id="circ2" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
              <text><textPath href="#circ2">¡QUE APROVECHE! • FRESH EVERY TIME • JUICITO •</textPath></text>
            </svg>
            <span>🍹</span>
          </div>
        </div>
      </div>
    </section>
  )
}
