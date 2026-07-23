import { useEffect, useRef } from 'react'
import { useCityStore } from '@/store/useCityStore'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { playCue } from '@/lib/sound'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

const COLORS = ['#38e8ff', '#7c5cff', '#34d399', '#f5a524', '#f472b6', '#ffffff']

/**
 * Canvas 2D fireworks, fired when the résumé is downloaded (the store's `celebration` counter
 * ticks). A celebratory payoff that costs nothing until it is triggered.
 */
export function Fireworks() {
  const celebration = useCityStore((s) => s.celebration)
  const reduced = usePrefersReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const raf = useRef(0)
  const running = useRef(false)

  useEffect(() => {
    if (celebration === 0) return
    playCue('success')
    if (reduced) return
    burst()
    // A short volley for a real celebration.
    const t1 = setTimeout(burst, 260)
    const t2 = setTimeout(burst, 520)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebration])

  function burst() {
    const canvas = canvasRef.current
    if (!canvas) return
    const cx = canvas.width * (0.3 + Math.random() * 0.4)
    const cy = canvas.height * (0.25 + Math.random() * 0.3)
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const count = 90
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const speed = 2 + Math.random() * 5
      particles.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        color: Math.random() < 0.3 ? COLORS[Math.floor(Math.random() * COLORS.length)] : color,
        size: 1.5 + Math.random() * 2.5,
      })
    }
    if (!running.current) loop()
  }

  function loop() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    running.current = true

    if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth
    if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'lighter'

    particles.current = particles.current.filter((p) => p.life < p.maxLife)

    for (const p of particles.current) {
      p.life++
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.06 // gravity
      p.vx *= 0.99
      const alpha = 1 - p.life / p.maxLife
      ctx.globalAlpha = alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    if (particles.current.length > 0) {
      raf.current = requestAnimationFrame(loop)
    } else {
      running.current = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[125]"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}
