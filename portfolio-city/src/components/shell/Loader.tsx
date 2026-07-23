import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCityStore } from '@/store/useCityStore'

const BOOT_LINES = [
  'Initialising city grid…',
  'Pouring roads & laying rail…',
  'Raising the skyline…',
  'Wiring street lights & traffic…',
  'Spawning drones and traffic…',
  'Calibrating cameras…',
  'Compiling shaders…',
  'Welcome to the city.',
]

/**
 * Animated boot screen. It fakes deterministic progress (nothing to actually download — the
 * city is procedural) while the WebGL context warms up, then hands control to the intro fly-in.
 */
export function Loader() {
  const phase = useCityStore((s) => s.phase)
  const progress = useCityStore((s) => s.progress)
  const setProgress = useCityStore((s) => s.setProgress)
  const setPhase = useCityStore((s) => s.setPhase)
  const [line, setLine] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    if (phase !== 'loading') return
    let raf = 0
    const started = performance.now()
    const DURATION = 2600

    const tick = () => {
      const elapsed = performance.now() - started
      const pct = Math.min(100, (elapsed / DURATION) * 100)
      setProgress(pct)
      setLine(Math.min(BOOT_LINES.length - 1, Math.floor((pct / 100) * BOOT_LINES.length)))
      if (pct < 100) {
        raf = requestAnimationFrame(tick)
      } else if (!done.current) {
        done.current = true
        setTimeout(() => setPhase('intro'), 350)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase, setProgress, setPhase])

  return (
    <AnimatePresence>
      {phase === 'loading' && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[var(--bg)]"
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          role="status"
          aria-live="polite"
        >
          {/* Animated wireframe skyline. */}
          <div className="relative mb-10 flex h-24 items-end gap-1.5" aria-hidden>
            {[38, 64, 46, 82, 54, 96, 60, 74, 44, 88, 50, 70].map((h, i) => (
              <motion.span
                key={i}
                className="w-3 rounded-t-sm bg-gradient-to-t from-cyan-500/20 to-cyan-300"
                initial={{ height: 0 }}
                animate={{ height: `${(progress / 100) * h}%` }}
                transition={{ ease: 'easeOut', duration: 0.3, delay: i * 0.02 }}
                style={{ minHeight: 4 }}
              />
            ))}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gradient sm:text-3xl">
            Shubham Dambale
          </h1>
          <p className="mono-label mt-2">Full Stack Developer · Portfolio City</p>

          <div className="mt-8 w-64 max-w-[80vw]">
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-[var(--text-muted)]">
              <span className="truncate">{BOOT_LINES[line]}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
