import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import { useCityStore } from '@/store/useCityStore'
import { roads, ROAD_Y } from './cityLayout'
import { useInstancedMesh, type InstanceTransform } from './useInstancedMesh'

/** Asphalt, kerbs, lane markings and the reflective plate the whole city sits on. */
export function Ground() {
  const quality = useCityStore((s) => s.quality)
  const night = useCityStore((s) => s.timeOfDay === 'night')

  return (
    <group>
      {/* Base plate — gives the city a physical "model on a table" edge. */}
      <mesh position={[0, -1.2, 15]} receiveShadow>
        <boxGeometry args={[168, 2.4, 196]} />
        <meshStandardMaterial color={night ? '#070b14' : '#151d2b'} roughness={0.9} metalness={0.1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 15]} receiveShadow>
        <planeGeometry args={[166, 194]} />
        {quality === 'high' ? (
          <MeshReflectorMaterial
            resolution={512}
            blur={[400, 120]}
            mixBlur={1}
            mixStrength={night ? 22 : 7}
            roughness={0.85}
            depthScale={1.1}
            minDepthThreshold={0.5}
            maxDepthThreshold={1.3}
            color={night ? '#080d17' : '#1b2434'}
            metalness={0.55}
            mirror={0}
          />
        ) : (
          <meshStandardMaterial color={night ? '#0a1120' : '#1e2735'} roughness={0.92} metalness={0.15} />
        )}
      </mesh>

      <Roads night={night} />
      <LaneMarkings night={night} />
      <PlazaGlow />
    </group>
  )
}

function Roads({ night }: { night: boolean }) {
  return (
    <group>
      {roads.map((road) => {
        const length = road.to - road.from
        const centre = (road.from + road.to) / 2
        const position: [number, number, number] =
          road.axis === 'z' ? [road.at, ROAD_Y, centre] : [centre, ROAD_Y, road.at]
        const args: [number, number] = road.axis === 'z' ? [road.width, length] : [length, road.width]

        return (
          <group key={road.id}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
              <planeGeometry args={args} />
              <meshStandardMaterial color={night ? '#0d1420' : '#2b3342'} roughness={0.96} metalness={0.05} />
            </mesh>
            {/* Kerb strips: neon at night, pale concrete by day. */}
            {[-1, 1].map((side) => (
              <mesh
                key={side}
                rotation={[-Math.PI / 2, 0, 0]}
                position={
                  road.axis === 'z'
                    ? [road.at + (road.width / 2) * side, ROAD_Y + 0.01, centre]
                    : [centre, ROAD_Y + 0.01, road.at + (road.width / 2) * side]
                }
              >
                <planeGeometry args={road.axis === 'z' ? [0.35, length] : [length, 0.35]} />
                <meshBasicMaterial
                  color={night ? '#38e8ff' : '#c9d7ec'}
                  transparent
                  opacity={night ? 0.42 : 0.7}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}

/** Dashed centre lines for every road — one instanced draw call for the whole city. */
function LaneMarkings({ night }: { night: boolean }) {
  const transforms = useMemo<InstanceTransform[]>(() => {
    const list: InstanceTransform[] = []
    const dashGap = 7
    for (const road of roads) {
      for (let t = road.from + 4; t < road.to - 4; t += dashGap) {
        list.push({
          position: road.axis === 'z' ? [road.at, ROAD_Y + 0.012, t] : [t, ROAD_Y + 0.012, road.at],
          rotation: [-Math.PI / 2, 0, road.axis === 'z' ? 0 : Math.PI / 2],
        })
      }
    }
    return list
  }, [])

  const geometry = useMemo(() => new THREE.PlaneGeometry(0.28, 3), [])
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.45, toneMapped: false }),
    [],
  )
  material.color.set(night ? '#7fa3c9' : '#e2e8f2')

  const mesh = useInstancedMesh(geometry, material, transforms)
  return <primitive object={mesh} />
}

/** A soft ring of light under Central Park so the city has an obvious heart. */
function PlazaGlow() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const m = ref.current.material as THREE.MeshBasicMaterial
    m.opacity = 0.15 + Math.sin(clock.elapsedTime * 0.8) * 0.05
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 6]}>
      <ringGeometry args={[17, 24, 64]} />
      <meshBasicMaterial color="#38e8ff" transparent opacity={0.18} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}
