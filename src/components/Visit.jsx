import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { INFO, TEL, PHONE } from '../data.js'

export default function Visit() {
  const root = useRef(null)

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
            <a className="btn btn--line" href="#find">Get directions ↗</a>
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
          <svg viewBox="0 0 500 380" aria-hidden="true">
            <rect width="500" height="380" fill="#f6f0dc" />
            <g stroke="#fff" strokeWidth="14" strokeLinecap="round" fill="none">
              <path d="M-10 250 C120 230 200 190 300 200 S450 150 520 160" />
              <path d="M180 -10 C190 80 230 140 250 200 S270 320 290 400" />
              <path d="M-10 90 C100 110 180 80 280 60 S430 40 520 70" />
              <path d="M380 -10 C370 100 400 160 390 230 S420 330 430 400" />
            </g>
            <g fill="#dcd2b0" opacity=".7">
              <rect x="30" y="130" width="60" height="40" rx="6" /><rect x="100" y="150" width="50" height="34" rx="6" />
              <rect x="300" y="100" width="56" height="40" rx="6" /><rect x="320" y="230" width="48" height="50" rx="6" />
              <rect x="60" y="290" width="70" height="44" rx="6" /><rect x="440" y="250" width="44" height="50" rx="6" />
              <rect x="150" y="30" width="60" height="30" rx="6" />
            </g>
            <g transform="translate(250 190)">
              <path d="M0 0 C-30 -40 -34 -70 0 -82 C34 -70 30 -40 0 0Z" fill="#e6007e" stroke="#fff" strokeWidth="4" />
              <text x="0" y="-48" textAnchor="middle" fontFamily="Archivo" fontWeight="900" fontSize="26" fill="#fff6e6">J</text>
            </g>
          </svg>
          <div className="vis__bubble">Here!<small>JUICITO</small></div>
          <p className="vis__mapnote">{INFO.mapNote}</p>
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
