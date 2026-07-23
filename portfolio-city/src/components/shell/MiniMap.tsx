import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cityBounds, districts } from '@/data/districts'
import { useCityStore } from '@/store/useCityStore'
import { useCityNavigation } from '@/hooks/useCityNavigation'
import { Icon } from '@/components/ui/Icon'

const W = cityBounds.maxX - cityBounds.minX
const H = cityBounds.maxZ - cityBounds.minZ

/** World coords → 0..100 SVG space. */
const toX = (x: number) => ((x - cityBounds.minX) / W) * 100
const toY = (z: number) => ((z - cityBounds.minZ) / H) * 100

/** Corner minimap — a live plan of the city that doubles as a fast-travel control. */
export function MiniMap() {
  const { pathname } = useLocation()
  const open = useCityStore((s) => s.minimapOpen)
  const setOpen = useCityStore((s) => s.setMinimapOpen)
  const hovered = useCityStore((s) => s.hovered)
  const { enter, hover } = useCityNavigation()

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[70] hidden sm:block">
      <motion.div layout className="glass pointer-events-auto overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between gap-3 px-3 py-2">
          <span className="mono-label flex items-center gap-1.5">
            <Icon name="map" size={13} /> City map
          </span>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-[var(--text-muted)] hover:text-white"
            aria-label={open ? 'Collapse minimap' : 'Expand minimap'}
          >
            <Icon name={open ? 'close' : 'map'} size={15} />
          </button>
        </div>

        <motion.div layout animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
          <div className="p-2 pt-0">
            <svg viewBox="0 0 100 100" className="h-40 w-40 sm:h-48 sm:w-48" role="img" aria-label="Minimap of the portfolio city">
              <defs>
                <radialGradient id="mm-glow" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#38e8ff" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#38e8ff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width="100" height="100" rx="6" fill="#070c16" />
              <rect x="0" y="0" width="100" height="100" fill="url(#mm-glow)" />

              {/* Road grid. */}
              {[-56, -16, 16, 56].map((x) => (
                <line key={`v${x}`} x1={toX(x)} y1="0" x2={toX(x)} y2="100" stroke="#1c2b45" strokeWidth="0.6" />
              ))}
              {[-58, -20, 26, 62].map((z) => (
                <line key={`h${z}`} x1="0" y1={toY(z)} x2="100" y2={toY(z)} stroke="#1c2b45" strokeWidth="0.6" />
              ))}

              {districts.map((d) => {
                const active = pathname === d.route || pathname.startsWith(d.route + '/')
                const isHover = hovered === d.id
                const r = active ? 3.4 : isHover ? 3 : 2.2
                return (
                  <g
                    key={d.id}
                    className="pointer-events-auto cursor-pointer"
                    onClick={() => enter(d.id)}
                    onMouseEnter={() => hover(d.id)}
                    onMouseLeave={() => hover(null)}
                  >
                    {(active || isHover) && (
                      <circle cx={toX(d.position[0])} cy={toY(d.position[2])} r={r + 2.5} fill={d.accent} opacity={0.18} />
                    )}
                    <circle
                      cx={toX(d.position[0])}
                      cy={toY(d.position[2])}
                      r={r}
                      fill={d.accent}
                      stroke="#05070d"
                      strokeWidth="0.5"
                    />
                    <title>{`${d.name} — ${d.subtitle}`}</title>
                  </g>
                )
              })}

              {/* "You are here" indicator when a district is open. */}
            </svg>

            {hovered && (
              <p className="px-1 pb-1 text-center text-[11px] font-medium text-[var(--text-muted)]">
                {districts.find((d) => d.id === hovered)?.name}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
