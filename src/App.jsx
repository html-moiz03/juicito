import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Loader from './components/Loader.jsx'
import Topbar from './components/Topbar.jsx'
import Hero from './components/Hero.jsx'
import Ribbons from './components/Ribbons.jsx'
import Definition from './components/Definition.jsx'
import Builder from './components/Builder.jsx'
import MenuRail from './components/MenuRail.jsx'
import Flavors from './components/Flavors.jsx'
import Statement from './components/Statement.jsx'
import Hours from './components/Hours.jsx'
import Visit from './components/Visit.jsx'
import Footer from './components/Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [ready, setReady] = useState(false)

  // Smooth scrolling (Lenis) wired into GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    lenis.stop() // locked until the loader finishes
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    document.body.classList.add('is-ready')
    window.__lenis?.start()
    const id = setTimeout(() => ScrollTrigger.refresh(), 150)
    return () => clearTimeout(id)
  }, [ready])

  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <Topbar />
      <main>
        <Hero />
        <Ribbons />
        <Definition />
        <Builder />
        <MenuRail />
        <Flavors />
        <Statement />
        <Hours />
        <Visit />
      </main>
      <Footer />
    </>
  )
}
