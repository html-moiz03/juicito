import { useEffect, useRef } from 'react'

// A real-time 3D food item. Follows the cursor, spins when you drag it,
// and on phones also reacts to finger movement and device tilt.
export default function Food({ kind = 'orange', className = '', style }) {
  const ref = useRef(null)
  useEffect(() => {
    let dead = false
    let off
    import('../food/engine.js').then((m) => {
      if (!dead && ref.current) off = m.mount(ref.current, kind)
    })
    return () => { dead = true; off && off() }
  }, [kind])
  return <canvas ref={ref} className={'food ' + className} width="160" height="160" style={style} aria-hidden="true" />
}
