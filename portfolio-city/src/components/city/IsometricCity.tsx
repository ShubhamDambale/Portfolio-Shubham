import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { districts } from '@/data/districts'
import { cityBounds } from '@/data/districts'
import { playCue } from '@/lib/sound'
import { useCityStore } from '@/store/useCityStore'

/**
 * Mobile / low-power fallback for the WebGL city.
 *
 * A pure-SVG isometric plan: no WebGL, no shaders, a few KB of vectors. Every district is a
 * tappable building, so all content stays reachable exactly as it is on desktop — just far
 * cheaper to render on a phone.
 */

const W = cityBounds.maxX - cityBounds.minX
const H = cityBounds.maxZ - cityBounds.minZ

/** Project world (x,z) to a 2:1 isometric screen point in a 0..100 viewbox. */
function iso(x: number, z: number) {
  const nx = (x - cityBounds.minX) / W - 0.5
  const nz = (z - cityBounds.minZ) / H - 0.5
  return {
    x: 50 + (nx - nz) * 46,
    y: 42 + (nx + nz) * 24,
  }
}

export function IsometricCity() {
  const night = useCityStore((s) => s.timeOfDay === 'night')
  const ordered = [...districts].sort((a, b) => iso(a.position[0], a.position[2]).y - iso(b.position[0], b.position[2]).y)

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[var(--bg)] pt-20 pb-28">
      <div className="pointer-events-none absolute inset-0 grid-floor opacity-40" />
      <div className="relative mx-auto max-w-md px-4">
        <div className="mb-4 text-center">
          <p className="mono-label">Portfolio City · lite</p>
          <h1 className="mt-1 text-2xl font-bold text-gradient">Tap a district to explore</h1>
        </div>

        <svg viewBox="0 0 100 90" className="w-full" role="img" aria-label="Isometric map of the portfolio city">
          {/* Ground diamond. */}
          <polygon points="50,6 96,42 50,78 4,42" fill={night ? '#0a1120' : '#1a2536'} stroke="#1e2c47" strokeWidth="0.4" />
          {/* Grid lines. */}
          {[0.25, 0.5, 0.75].map((t) => (
            <g key={t} stroke="#22345333" strokeWidth="0.3">
              <line x1={4 + 46 * t} y1={42 - 36 * t} x2={50 + 46 * t} y2={78 - 36 * t} />
              <line x1={96 - 46 * t} y1={42 - 36 * t} x2={50 - 46 * t} y2={78 - 36 * t} />
            </g>
          ))}
          {ordered.map((d) => {
            const p = iso(d.position[0], d.position[2])
            const h = 8 + d.order * 0.6
            return <IsoBuilding key={d.id} x={p.x} y={p.y} height={h} accent={d.accent} glyph={d.glyph} />
          })}
        </svg>

        <div className="mt-6 grid grid-cols-1 gap-2.5">
          {districts.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={d.route}
                onClick={() => playCue('open')}
                className="glass flex items-center gap-3 rounded-2xl p-3 active:scale-[0.98]"
                style={{ boxShadow: `inset 0 0 0 1px ${d.accent}22` }}
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl"
                  style={{ background: `${d.accent}1a` }}
                >
                  {d.glyph}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{d.name}</span>
                  <span className="block truncate text-xs text-[var(--text-muted)]">{d.subtitle}</span>
                </span>
                <span className="mono-label" style={{ color: d.accent }}>
                  0{d.order}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IsoBuilding({
  x,
  y,
  height,
  accent,
  glyph,
}: {
  x: number
  y: number
  height: number
  accent: string
  glyph: string
}) {
  const w = 5
  // A simple extruded box: top face + two side faces.
  return (
    <g>
      {/* left face */}
      <polygon points={`${x},${y} ${x - w},${y - w / 2} ${x - w},${y - w / 2 - height} ${x},${y - height}`} fill={accent} opacity={0.55} />
      {/* right face */}
      <polygon points={`${x},${y} ${x + w},${y - w / 2} ${x + w},${y - w / 2 - height} ${x},${y - height}`} fill={accent} opacity={0.8} />
      {/* top face */}
      <polygon
        points={`${x},${y - height} ${x - w},${y - w / 2 - height} ${x},${y - w - height} ${x + w},${y - w / 2 - height}`}
        fill={accent}
      />
      <text x={x} y={y - height / 2 - 1} textAnchor="middle" fontSize="3.4" opacity={0.9}>
        {glyph}
      </text>
    </g>
  )
}
