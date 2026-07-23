import { useEffect, useRef, useState } from 'react'
import { useIsTouch, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

/**
 * A soft dual-ring cursor that grows over interactive elements. Disabled entirely on touch
 * devices and when reduced motion is requested — where a custom cursor is either pointless or
 * an accessibility liability, the native pointer is left alone.
 */
export function CustomCursor() {
  const touch = useIsTouch()
  const reduced = usePrefersReducedMotion()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [hidden, setHidden] = useState(true)

  const enabled = !touch && !reduced

  useEffect(() => {
    if (!enabled) {
      document.body.dataset.customCursor = 'off'
      return
    }
    document.body.dataset.customCursor = 'on'

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...pos }
    let raf = 0

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      setHidden(false)
      if (dot.current) dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`

      const el = e.target as HTMLElement
      setActive(!!el.closest('a, button, [role="button"], input, textarea, [data-cursor="hover"]'))
    }

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18
      ringPos.y += (pos.y - ringPos.y) * 0.18
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    const onLeave = () => setHidden(true)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', () => setActive(true))
    window.addEventListener('pointerup', () => setActive(false))
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
      document.body.dataset.customCursor = 'off'
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-[130] ${hidden ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
      <div
        ref={dot}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-cyan-300"
        style={{ boxShadow: '0 0 10px rgba(56,232,255,0.9)' }}
      />
      <div
        ref={ring}
        className={`absolute rounded-full border transition-[width,height,margin,border-color] duration-200 ${
          active ? '-ml-5 -mt-5 h-10 w-10 border-violet-400/80' : '-ml-3.5 -mt-3.5 h-7 w-7 border-cyan-300/50'
        }`}
      />
    </div>
  )
}
