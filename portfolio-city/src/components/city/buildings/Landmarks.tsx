import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { districts, districtById } from '@/data/districts'
import { projects, vacantOffices } from '@/data/projects'
import { skills } from '@/data/skills'
import { DistrictAnchor } from './DistrictAnchor'
import { EmissiveBand, GlassTower, NeonEdges, Plinth, RoofHologram } from './parts'

/**
 * The nine landmark buildings. Each has a deliberately distinct silhouette so the city is
 * legible at a glance: a stepped HQ tower, a project campus, a vaulted bank, and so on.
 */
export function Landmarks() {
  return (
    <group>
      <CompanyHQ />
      <TechPark />
      <SkillBank />
      <University />
      <AILab />
      <DataCenter />
      <Museum />
      <CentralPark />
      <Airport />
    </group>
  )
}

/* -------------------------------------------------------------- Company HQ */

function CompanyHQ() {
  const d = districtById('hq')
  return (
    <DistrictAnchor district={d} labelHeight={30}>
      <Plinth size={[16, 0.6, 16]} />
      {/* Stepped corporate tower. */}
      <GlassTower size={[9, 26, 9]} accent={d.accent} seed={31} litRatio={0.45} />
      <GlassTower size={[7, 8, 7]} position={[0, 26, 0]} accent={d.accent} seed={12} litRatio={0.5} />
      <GlassTower size={[5, 5, 5]} position={[0, 34, 0]} accent={d.accent} seed={9} litRatio={0.55} />
      <NeonEdges size={[9.1, 26, 9.1]} color={d.accent} opacity={0.6} />
      {/* Side wings for the two roles. */}
      <GlassTower size={[4.5, 12, 5]} position={[6.5, 0, 3]} accent={d.accent} seed={4} litRatio={0.4} />
      <GlassTower size={[4.5, 9, 5]} position={[-6.5, 0, -3]} accent={d.accent} seed={7} litRatio={0.4} />
      <EmissiveBand radius={9} y={0.7} color={d.accent} />
      <RoofHologram color={d.accent} height={41}>
        <mesh>
          <octahedronGeometry args={[1.1, 0]} />
          <meshBasicMaterial color={d.accent} wireframe transparent opacity={0.85} toneMapped={false} />
        </mesh>
      </RoofHologram>
    </DistrictAnchor>
  )
}

/* --------------------------------------------------------------- Tech Park */

function TechPark() {
  const d = districtById('tech-park')
  return (
    <DistrictAnchor district={d} labelHeight={22}>
      <Plinth size={[26, 0.6, 26]} color="#0d1526" />
      {/* One office per real project; empty plots for the rest. */}
      {projects.map((p) => (
        <group key={p.id} position={[p.office[0], 0, p.office[1]]}>
          <GlassTower size={[6, 12, 6]} accent={p.accent} seed={p.id.length * 7} litRatio={0.5} />
          <NeonEdges size={[6.1, 12, 6.1]} color={p.accent} />
        </group>
      ))}
      {vacantOffices.map((v) => (
        <group key={v.id} position={[v.office[0], 0, v.office[1]]}>
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[6, 2.4, 6]} />
            <meshStandardMaterial color="#101b30" roughness={0.9} transparent opacity={0.5} />
          </mesh>
          <NeonEdges size={[6, 2.4, 6]} position={[0, 0, 0]} color="#3a4d70" opacity={0.5} />
          {/* Dashed "available plot" frame. */}
          <NeonEdges size={[6, 10, 6]} color="#f5a524" opacity={0.22} />
        </group>
      ))}
      <RoofHologram color={d.accent} height={16}>
        <mesh>
          <icosahedronGeometry args={[1.1, 0]} />
          <meshBasicMaterial color={d.accent} wireframe transparent opacity={0.8} toneMapped={false} />
        </mesh>
      </RoofHologram>
      <EmissiveBand radius={15} y={0.7} color={d.accent} />
    </DistrictAnchor>
  )
}

/* -------------------------------------------------------------- Skill Bank */

function SkillBank() {
  const d = districtById('skill-bank')
  const onResume = skills.filter((s) => s.onResume).length
  return (
    <DistrictAnchor district={d} labelHeight={18}>
      <Plinth size={[20, 0.6, 16]} color="#0b1a14" />
      {/* Classical bank body with a vaulted dome. */}
      <mesh position={[0, 6, 0]} castShadow receiveShadow>
        <boxGeometry args={[16, 12, 11]} />
        <meshStandardMaterial color="#12241c" roughness={0.6} metalness={0.4} />
      </mesh>
      <NeonEdges size={[16, 12, 11]} position={[0, 0, 0]} color={d.accent} opacity={0.5} />
      {/* Colonnade — one pillar per resume-backed skill. */}
      {Array.from({ length: onResume }).map((_, i) => {
        const x = -7 + (i / Math.max(1, onResume - 1)) * 14
        return (
          <mesh key={i} position={[x, 5, 5.8]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 10, 10]} />
            <meshStandardMaterial color="#1c3a2c" roughness={0.5} metalness={0.5} />
          </mesh>
        )
      })}
      <mesh position={[0, 12, 0]} castShadow>
        <cylinderGeometry args={[6, 8, 3, 24, 1, false, 0, Math.PI * 2]} />
        <meshStandardMaterial color="#153026" roughness={0.4} metalness={0.6} emissive={d.accent} emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, 15, 0]}>
        <sphereGeometry args={[2.2, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1e4636" roughness={0.3} metalness={0.7} emissive={d.accent} emissiveIntensity={0.3} />
      </mesh>
      <VaultDoor accent={d.accent} />
      <EmissiveBand radius={10} y={0.7} color={d.accent} />
      <RoofHologram color={d.accent} height={19}>
        <mesh>
          <torusGeometry args={[0.9, 0.14, 8, 24]} />
          <meshBasicMaterial color={d.accent} transparent opacity={0.85} toneMapped={false} />
        </mesh>
      </RoofHologram>
    </DistrictAnchor>
  )
}

function VaultDoor({ accent }: { accent: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.4
  })
  return (
    <group position={[0, 5, 5.55]}>
      <mesh>
        <cylinderGeometry args={[2.6, 2.6, 0.6, 32]} />
        <meshStandardMaterial color="#0d1f17" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh ref={ref} position={[0, 0, 0.35]}>
        <torusGeometry args={[1.5, 0.16, 8, 6]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} metalness={1} roughness={0.2} />
      </mesh>
    </group>
  )
}

/* -------------------------------------------------------------- University */

function University() {
  const d = districtById('university')
  return (
    <DistrictAnchor district={d} labelHeight={17}>
      <Plinth size={[20, 0.6, 16]} color="#1a1608" />
      {/* Clock-tower campus. */}
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 10, 10]} />
        <meshStandardMaterial color="#2a2410" roughness={0.7} metalness={0.2} />
      </mesh>
      <GlassTower size={[4.5, 18, 4.5]} position={[0, 0, 0]} accent={d.accent} seed={22} litRatio={0.35} color="#241d0c" />
      {/* Clock face. */}
      <mesh position={[0, 16, 2.3]}>
        <circleGeometry args={[1.6, 24]} />
        <meshStandardMaterial color="#f7ecc9" emissive={d.accent} emissiveIntensity={0.5} />
      </mesh>
      <ClockHands accent="#1a1608" />
      {/* Roof pediment. */}
      <mesh position={[0, 10.4, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[10.3, 3, 4]} />
        <meshStandardMaterial color="#332b10" roughness={0.6} metalness={0.3} />
      </mesh>
      <EmissiveBand radius={9} y={0.7} color={d.accent} />
      <RoofHologram color={d.accent} height={21}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.9, 1.4, 4]} />
          <meshBasicMaterial color={d.accent} wireframe transparent opacity={0.8} toneMapped={false} />
        </mesh>
      </RoofHologram>
    </DistrictAnchor>
  )
}

function ClockHands({ accent }: { accent: string }) {
  const hour = useRef<THREE.Mesh>(null)
  const minute = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (hour.current) hour.current.rotation.z = -t * 0.1
    if (minute.current) minute.current.rotation.z = -t * 1.2
  })
  return (
    <group position={[0, 16, 2.35]}>
      <mesh ref={hour}>
        <boxGeometry args={[0.12, 0.9, 0.05]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh ref={minute}>
        <boxGeometry args={[0.09, 1.3, 0.05]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ AI Lab */

function AILab() {
  const d = districtById('ai-lab')
  const core = useRef<THREE.Mesh>(null)
  const rings = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    if (core.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.08
      core.current.scale.setScalar(s)
    }
    if (rings.current) rings.current.rotation.y += delta * 0.5
  })
  return (
    <DistrictAnchor district={d} labelHeight={17}>
      <Plinth size={[18, 0.6, 18]} color="#1a0d18" />
      {/* Dome lab. */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <sphereGeometry args={[7, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#2a0f28"
          roughness={0.15}
          metalness={0.3}
          transmission={0.4}
          thickness={2}
          emissive={d.accent}
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* Reactor core. */}
      <mesh ref={core} position={[0, 5, 0]}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshBasicMaterial color={d.accent} wireframe transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <group ref={rings} position={[0, 5, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.6, i * 0.9, 0]}>
            <torusGeometry args={[3 + i * 0.5, 0.06, 8, 40]} />
            <meshBasicMaterial color={d.accent} transparent opacity={0.5} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <EmissiveBand radius={8} y={0.7} color={d.accent} />
    </DistrictAnchor>
  )
}

/* ------------------------------------------------------------- Data Center */

function DataCenter() {
  const d = districtById('data-center')
  return (
    <DistrictAnchor district={d} labelHeight={15}>
      <Plinth size={[22, 0.6, 18]} color="#08171b" />
      {/* Server racks in rows. */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 3 }).map((__, col) => (
          <ServerRack key={`${row}-${col}`} position={[-7 + col * 7, 0, -5 + row * 3.4]} accent={d.accent} seed={row * 3 + col} />
        )),
      )}
      {/* Cooling towers. */}
      {[-8, 8].map((x) => (
        <mesh key={x} position={[x, 4, 7]} castShadow>
          <cylinderGeometry args={[1.6, 2, 8, 16]} />
          <meshStandardMaterial color="#0e2830" roughness={0.5} metalness={0.5} emissive={d.accent} emissiveIntensity={0.1} />
        </mesh>
      ))}
      <EmissiveBand radius={11} y={0.7} color={d.accent} />
      <RoofHologram color={d.accent} height={13}>
        <mesh>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
          <meshBasicMaterial color={d.accent} wireframe transparent opacity={0.8} toneMapped={false} />
        </mesh>
      </RoofHologram>
    </DistrictAnchor>
  )
}

function ServerRack({ position, accent, seed }: { position: [number, number, number]; accent: string; seed: number }) {
  const leds = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((state) => {
    if (leds.current) leds.current.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 3 + seed) * 0.3 + 0.3
  })
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[2.4, 6, 2.4]} />
        <meshStandardMaterial color="#0b1a20" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* Blinking status strip. */}
      <mesh position={[0, 3, 1.22]}>
        <planeGeometry args={[1.8, 5]} />
        <meshBasicMaterial ref={leds} color={accent} transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------- Achievement Museum */

function Museum() {
  const d = districtById('museum')
  return (
    <DistrictAnchor district={d} labelHeight={15}>
      <Plinth size={[22, 0.8, 14]} color="#1c1706" />
      {/* Neoclassical museum: columns + pediment. */}
      <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[18, 8, 10]} />
        <meshStandardMaterial color="#2b2712" roughness={0.7} metalness={0.2} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-7.5 + i * 3, 4, 5.3]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 8, 12]} />
          <meshStandardMaterial color="#3a3416" roughness={0.5} metalness={0.3} emissive={d.accent} emissiveIntensity={0.05} />
        </mesh>
      ))}
      <mesh position={[0, 9.2, 3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[19, 2.4, 5]} />
        <meshStandardMaterial color="#332d12" roughness={0.6} />
      </mesh>
      {/* Golden trophy on the roof. */}
      <FloatingTrophy accent={d.accent} />
      <EmissiveBand radius={11} y={0.9} color={d.accent} />
    </DistrictAnchor>
  )
}

function FloatingTrophy({ accent }: { accent: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.7
    ref.current.position.y = 13 + Math.sin(state.clock.elapsedTime * 1.5) * 0.25
  })
  return (
    <group ref={ref} position={[0, 13, 0]}>
      <mesh>
        <sphereGeometry args={[1, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[0.25, 0.6, 1.4, 12]} />
        <meshStandardMaterial color={accent} metalness={1} roughness={0.2} emissive={accent} emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------- Central Park */

function CentralPark() {
  const d = districtById('central-park')
  return (
    <DistrictAnchor district={d} labelHeight={13}>
      {/* Grass mound. */}
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <cylinderGeometry args={[15, 16, 0.8, 48]} />
        <meshStandardMaterial color="#123a24" roughness={0.95} />
      </mesh>
      {/* Winding path ring. */}
      <mesh position={[0, 0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8, 9.4, 48]} />
        <meshStandardMaterial color="#3a4a2c" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* Central pavilion — the "about me" focal point / avatar pedestal. */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[2.4, 2.6, 3.2, 8]} />
        <meshStandardMaterial color="#14251a" roughness={0.7} metalness={0.2} />
      </mesh>
      <ParkAvatar accent={d.accent} />
      {/* Pond. */}
      <mesh position={[7, 0.83, 6]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.2, 24]} />
        <meshStandardMaterial color="#0f3a52" roughness={0.1} metalness={0.6} emissive={d.accent} emissiveIntensity={0.08} />
      </mesh>
      <EmissiveBand radius={15.5} y={0.85} color={d.accent} />
    </DistrictAnchor>
  )
}

/** A stylised low-poly avatar standing on the pavilion — the 3D "me". */
function ParkAvatar({ accent }: { accent: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.5
  })
  return (
    <group ref={ref} position={[0, 3.6, 0]}>
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color="#f0c9a0" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.5, 1.1, 4, 12]} />
        <meshStandardMaterial color={accent} roughness={0.5} metalness={0.2} emissive={accent} emissiveIntensity={0.15} />
      </mesh>
      {/* Halo ring so it reads as the hero, not a bystander. */}
      <mesh position={[0, 2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.05, 8, 24]} />
        <meshBasicMaterial color={accent} transparent opacity={0.8} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ Airport */

function Airport() {
  const d = districtById('airport')
  return (
    <DistrictAnchor district={d} labelHeight={16}>
      <Plinth size={[34, 0.6, 22]} color="#0a1220" />
      {/* Terminal with a curved roof. */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[24, 6, 12]} />
        <meshStandardMaterial color="#111f34" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 6.2, 0]}>
        <cylinderGeometry args={[6.2, 6.2, 24, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#16273f" roughness={0.4} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <NeonEdges size={[24, 6, 12]} color={d.accent} opacity={0.5} />
      {/* Control tower. */}
      <group position={[13, 0, -6]}>
        <mesh position={[0, 6, 0]} castShadow>
          <cylinderGeometry args={[0.8, 1.2, 12, 12]} />
          <meshStandardMaterial color="#1a2c47" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0, 12.5, 0]}>
          <sphereGeometry args={[1.6, 16, 12]} />
          <meshStandardMaterial color="#1f3a5c" emissive={d.accent} emissiveIntensity={0.3} metalness={0.6} roughness={0.3} />
        </mesh>
        <BeaconLight accent={d.accent} />
      </group>
      {/* Runway with lit centre line running toward the terminal. */}
      <mesh position={[0, 0.62, 12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 20]} />
        <meshStandardMaterial color="#0b1526" roughness={0.9} />
      </mesh>
      {/* Parked plane / the "resume ready for takeoff" motif. */}
      <PaperPlane accent={d.accent} />
      <EmissiveBand radius={16} y={0.7} color={d.accent} />
    </DistrictAnchor>
  )
}

function BeaconLight({ accent }: { accent: string }) {
  const ref = useRef<THREE.PointLight>(null)
  const glow = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((state) => {
    const p = (Math.sin(state.clock.elapsedTime * 3) + 1) / 2
    if (ref.current) ref.current.intensity = p * 30
    if (glow.current) glow.current.opacity = 0.3 + p * 0.7
  })
  return (
    <group position={[0, 12.5, 0]}>
      <pointLight ref={ref} color={accent} distance={30} decay={2} />
      <mesh>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshBasicMaterial ref={glow} color={accent} transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** A little plane that circles the terminal — "your resume, ready for takeoff". */
function PaperPlane({ accent }: { accent: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * 0.4
    ref.current.position.set(Math.cos(t) * 16, 9 + Math.sin(t * 2) * 1.5, 6 + Math.sin(t) * 12)
    ref.current.rotation.y = -t + Math.PI / 2
    ref.current.rotation.z = Math.sin(t) * 0.3
  })
  return (
    <group ref={ref}>
      <mesh castShadow>
        <coneGeometry args={[0.6, 2.4, 4]} />
        <meshStandardMaterial color="#e8eefc" metalness={0.3} roughness={0.4} emissive={accent} emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0, 0, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 3, 0.8]} />
        <meshStandardMaterial color="#c7d4ea" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  )
}

/** Consumers occasionally need the raw district list post-mount. */
export const landmarkDistricts = districts
