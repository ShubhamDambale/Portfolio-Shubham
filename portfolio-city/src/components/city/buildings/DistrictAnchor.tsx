import { useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useCityStore } from '@/store/useCityStore'
import { useCityNavigation } from '@/hooks/useCityNavigation'
import type { District } from '@/types'

interface Props {
  district: District
  /** The building mesh(es). Rendered inside the interaction group. */
  children: ReactNode
  /** Height at which the floating label sits. */
  labelHeight: number
}

/**
 * Shared behaviour for every landmark: hover glow, click-to-focus, floating HTML label,
 * a pulsing ground ring, and full keyboard/pointer parity.
 *
 * The building geometry is passed in as `children`; this component owns only interaction.
 */
export function DistrictAnchor({ district, children, labelHeight }: Props) {
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  const beam = useRef<THREE.Mesh>(null)
  const [localHover, setLocalHover] = useState(false)

  const hovered = useCityStore((s) => s.hovered === district.id)
  const focused = useCityStore((s) => s.focused === district.id)
  const night = useCityStore((s) => s.timeOfDay === 'night')
  const { enter, hover } = useCityNavigation()

  const active = hovered || localHover || focused

  useFrame((state, delta) => {
    const g = group.current
    if (g) {
      // Lift + settle on hover.
      const targetY = active ? 0.5 : 0
      g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 6, delta)
      const targetScale = active ? 1.03 : 1
      const s = THREE.MathUtils.damp(g.scale.x, targetScale, 6, delta)
      g.scale.setScalar(s)
    }
    if (ring.current) {
      const t = state.clock.elapsedTime
      const mat = ring.current.material as THREE.MeshBasicMaterial
      const base = active ? 0.9 : night ? 0.4 : 0.25
      mat.opacity = base * (0.7 + Math.sin(t * 2.4) * 0.3)
      const pulse = 1 + (active ? Math.sin(t * 2.4) * 0.06 : 0)
      ring.current.scale.setScalar(pulse)
    }
    if (beam.current) {
      const mat = beam.current.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.damp(mat.opacity, active ? 0.28 : 0, 8, delta)
    }
  })

  const [w, h] = district.footprint
  const ringRadius = Math.max(w, h) / 2 + 2.4

  return (
    <group position={district.position}>
      {/* Ground ring — always visible, brightens on hover. */}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[ringRadius - 0.5, ringRadius, 48]} />
        <meshBasicMaterial color={district.accent} transparent opacity={0.3} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      {/* Sky beam that flares on hover, marking the building from across the city. */}
      <mesh ref={beam} position={[0, labelHeight * 1.6, 0]}>
        <cylinderGeometry args={[0.6, 3.2, labelHeight * 3, 16, 1, true]} />
        <meshBasicMaterial
          color={district.accent}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <group
        ref={group}
        onPointerOver={(e) => {
          e.stopPropagation()
          setLocalHover(true)
          hover(district.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setLocalHover(false)
          hover(null)
          document.body.style.cursor = ''
        }}
        onClick={(e) => {
          e.stopPropagation()
          enter(district.id)
        }}
      >
        {children}
      </group>

      {/* Floating label. Pointer-events pass through except on the chip itself. */}
      <Html
        position={[0, labelHeight, 0]}
        center
        distanceFactor={40}
        wrapperClass="city-label"
        zIndexRange={[20, 0]}
        occlude={false}
      >
        <button
          type="button"
          onClick={() => enter(district.id)}
          onPointerEnter={() => hover(district.id)}
          onPointerLeave={() => hover(null)}
          className={`group flex select-none flex-col items-center gap-1 rounded-2xl border px-4 py-2 text-center transition-all duration-300 ${
            active
              ? 'scale-105 border-white/30 bg-black/70 shadow-[0_0_30px_-4px_var(--accent)]'
              : 'border-white/10 bg-black/45'
          }`}
          style={
            {
              '--accent': district.accent,
              backdropFilter: 'blur(6px)',
            } as React.CSSProperties
          }
          aria-label={`Enter ${district.name} — ${district.subtitle}`}
        >
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: district.accent, boxShadow: `0 0 10px ${district.accent}` }}
            />
            <span className="text-[13px] font-semibold tracking-tight text-white">{district.name}</span>
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
            {district.subtitle}
          </span>
        </button>
      </Html>
    </group>
  )
}
