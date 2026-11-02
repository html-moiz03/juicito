import { TEL, PHONE } from '../data.js'

const go = (id) => (e) => {
  e.preventDefault()
  const el = document.getElementById(id)
  if (el && window.__lenis) window.__lenis.scrollTo(el, { offset: 0 })
}

export default function Topbar() {
  return (
    <header className="topbar">
      <a className="topbar__logo" href="#top" onClick={(e) => { e.preventDefault(); window.__lenis?.scrollTo(0) }}>
        <span>JUICITO</span>
        <small>JUICE &amp; BITES</small>
      </a>
      <a className="topbar__pill" href={TEL}>
        <i /> CALL · {PHONE}
      </a>
      <nav className="topbar__nav">
        <a href="#menu" onClick={go('menu')}>Menu</a>
        <a href="#find" onClick={go('find')}>Find us</a>
        <a className="btn btn--cream" href={TEL}>Order now ↗</a>
      </nav>
    </header>
  )
}
