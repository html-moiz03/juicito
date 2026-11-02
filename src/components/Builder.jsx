import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { STEPS } from '../data.js'

const CUP = 'M70 110 H250 L228 372 Q226 392 206 392 H114 Q94 392 92 372 Z'

export default function Builder() {
  const root = useRef(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.b-juice', { svgOrigin: '160 400', scaleY: 0 })
      gsap.set('.b-cup', { opacity: 0, scale: 0.6, svgOrigin: '160 392' })
      gsap.set('.b-ice', { y: -260, opacity: 0 })
      gsap.set('.b-fruit', { scale: 0, svgOrigin: '250 112', rotation: -90 })
      gsap.set('.b-straw', { y: -320, opacity: 0 })
      gsap.set('.b-spark', { scale: 0, transformOrigin: '50% 50%' })
      gsap.set('.builder__name', { scale: 0.2, rotation: -20, opacity: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=2600',
          pin: true,
          scrub: 0.7,
          onUpdate: (self) => {
            setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length * 0.999)))
            gsap.set('.builder__bar span', { scaleX: self.progress })
          },
        },
      })

      tl.to('.b-cup', { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.6)' })
        .to('.b-juice', { scaleY: 1, duration: 1.2, ease: 'power1.inOut' })
        .to('.b-ice', { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'bounce.out' })
        .to('.b-fruit', { scale: 1, rotation: 0, duration: 1, ease: 'back.out(2)' })
        .to('.b-straw', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
        .to('.b-spark', { scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(3)' }, '>-0.2')
        .to('.builder__name', { scale: 1, rotation: -6, opacity: 1, duration: 0.6, ease: 'back.out(2.4)' }, '<')
        .to({}, { duration: 0.4 }) // short hold at the end

      gsap.to('.b-bubble', {
        y: -14, duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.25,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="builder edge-wave" id="builder" ref={root} style={{ '--bg': 'var(--green)' }}>
      <div className="builder__in">
        <div className="builder__left">
          <p className="eyebrow">JUICE · SHAKES · SIPS</p>
          <h2 className="builder__h">
            FRESH IS<br />SIMPLE.
          </h2>
          <ol className="builder__steps">
            {STEPS.map((s, i) => (
              <li key={s.n} className={i === active ? 'on' : ''}>
                <span className="n">{s.n}</span>
                <div>
                  <b>{s.t}</b>
                  <small>{s.d}</small>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="builder__art">
          <svg viewBox="0 0 320 420" role="img" aria-label="A glass of juice being built">
            <defs>
              <clipPath id="cupClip"><path d={CUP} /></clipPath>
              <linearGradient id="juiceG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffb02e" />
                <stop offset="1" stopColor="#f56a14" />
              </linearGradient>
            </defs>

            <ellipse cx="160" cy="400" rx="105" ry="12" fill="rgba(0,0,0,.18)" />

            {/* straw (behind glass front) */}
            <g className="b-straw">
              <g transform="rotate(14 178 200)">
                <rect x="172" y="-20" width="18" height="340" rx="9" fill="#fff6e6" />
                <rect x="172" y="10" width="18" height="22" fill="#e6007e" />
                <rect x="172" y="54" width="18" height="22" fill="#e6007e" />
                <rect x="172" y="98" width="18" height="22" fill="#e6007e" />
                <rect x="172" y="142" width="18" height="22" fill="#e6007e" />
              </g>
            </g>

            <g className="b-cup">
              <path d={CUP} fill="rgba(255,246,230,.28)" />
              <g clipPath="url(#cupClip)">
                <rect className="b-juice" x="60" y="140" width="200" height="270" fill="url(#juiceG)" />
                <g className="b-ice">
                  <rect x="100" y="180" width="46" height="46" rx="8" fill="rgba(255,255,255,.7)" transform="rotate(-14 123 203)" />
                </g>
                <g className="b-ice">
                  <rect x="162" y="230" width="52" height="52" rx="9" fill="rgba(255,255,255,.6)" transform="rotate(12 188 256)" />
                </g>
                <g className="b-ice">
                  <rect x="112" y="290" width="44" height="44" rx="8" fill="rgba(255,255,255,.55)" transform="rotate(20 134 312)" />
                </g>
                <circle className="b-bubble" cx="196" cy="320" r="7" fill="rgba(255,255,255,.6)" />
                <circle className="b-bubble" cx="140" cy="260" r="5" fill="rgba(255,255,255,.6)" />
                <circle className="b-bubble" cx="206" cy="190" r="6" fill="rgba(255,255,255,.6)" />
                <path d="M84 130 L98 360" stroke="rgba(255,255,255,.35)" strokeWidth="10" strokeLinecap="round" />
              </g>
              <path d={CUP} fill="none" stroke="#fff6e6" strokeWidth="6" strokeLinejoin="round" />
              <rect x="62" y="102" width="196" height="14" rx="7" fill="#fff6e6" />
            </g>

            {/* fruit slice on the rim */}
            <g className="b-fruit">
              <circle cx="250" cy="112" r="40" fill="#ffd54a" stroke="#fff6e6" strokeWidth="5" />
              <circle cx="250" cy="112" r="30" fill="#ffa21a" />
              {[0, 45, 90, 135].map((a) => (
                <line key={a} x1="250" y1="84" x2="250" y2="140" stroke="#ffd54a" strokeWidth="3" transform={`rotate(${a} 250 112)`} />
              ))}
            </g>

            {/* sparkles */}
            <g className="b-spark"><path d="M40 90 l6 16 16 6 -16 6 -6 16 -6 -16 -16 -6 16 -6z" fill="#ffc20e" /></g>
            <g className="b-spark"><path d="M280 220 l5 13 13 5 -13 5 -5 13 -5 -13 -13 -5 13 -5z" fill="#fff6e6" /></g>
            <g className="b-spark"><path d="M30 300 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill="#e6007e" /></g>
          </svg>

          <div className="builder__name">JUICITO<br />FIRST!</div>
          <p className="builder__tag">Made fresh. Every. Single. Time.</p>
        </div>
      </div>

      <div className="builder__bar"><span /></div>
    </section>
  )
}
