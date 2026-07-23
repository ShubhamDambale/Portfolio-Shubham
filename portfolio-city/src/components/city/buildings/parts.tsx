import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useCityStore } from '@/store/useCityStore'
import { windowTexture } from '@/lib/textures'

/**
 * Reusable building pieces shared by the nine landmarks. Keeping them here means each district
 * file is about its *silhouette*, not about re-deriving glass materials.
 */

/** A glass tower slab whose windows glow at night. */
export function GlassTower({
  size,
  position = [0, 0, 0],
  color = '#16233c',
  accent = '#8fe6ff',
  seed = 5,
  litRatio = 0.4,
  rotation = 0,
}: {
  size: [number, number, number]
  position?: [number, number, number]
  color?: string
  accent?: string
  seed?: number
  litRatio?: number
  rotation?: number
}) {
  const night = useCityStore((s) => s.timeOfDay === 'night')
  const [w, h, d] = size

  const material = useMemo(() => {
    const map = windowTexture(seed, litRatio, accent)
    map.repeat.set(Math.max(1, Math.round(w / 3)), Math.max(1, Math.round(h / 3)))
    return new THREE.MeshStandardMaterial({
      color,
      map,
      emissiveMap: map,
      emissive: new THREE.Color(accent),
      roughness: 0.55,
      metalness: 0.4,
    })
  }, [w, h, seed, litRatio, accent, color])

  material.emissiveIntensity = night ? 1.15 : 0.06

  return (
    <mesh position={[position[0], position[1] + h / 2, position[2]]} rotation={[0, rotation, 0]} material={material} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
    </mesh>
  )
}

/** A neon edge frame that traces a box outline — the "hologram" accent of the city. */
export function NeonEdges({
  size,
  position = [0, 0, 0],
  color = '#38e8ff',
  opacity = 0.9,
}: {
  size: [number, number, number]
  position?: [number, number, number]
  color?: string
  opacity?: number
}) {
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size])
  return (
    <lineSegments geometry={geo} position={[position[0], position[1] + size[1] / 2, position[2]]}>
      <lineBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </lineSegments>
  )
}

/** A softly rotating holographic glyph floating above a roof. */
export function RoofHologram({ color = '#38e8ff', height = 1, children }: { color?: string; height?: number; children?: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.6
    ref.current.position.y = height + Math.sin(state.clock.elapsedTime * 1.4) * 0.2
  })
  return (
    <group ref={ref} position={[0, height, 0]}>
      {children ?? (
        <mesh>
          <torusGeometry args={[0.9, 0.12, 8, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

/** A pulsing emissive strip you can wrap around a plinth. */
export function EmissiveBand({
  radius,
  y,
  color,
  thickness = 0.4,
}: {
  radius: number
  y: number
  color: string
  thickness?: number
}) {
  const ref = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((state) => {
    if (ref.current) ref.current.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 1.8) * 0.25
  })
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - thickness, radius, 48]} />
      <meshBasicMaterial ref={ref} color={color} transparent opacity={0.6} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

/** Plinth every landmark sits on, so buildings read as "placed" objects. */
export function Plinth({ size, color = '#0c1424' }: { size: [number, number, number]; color?: string }) {
  return (
    <mesh position={[0, size[1] / 2, 0]} receiveShadow castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.2} />
    </mesh>
  )
}
