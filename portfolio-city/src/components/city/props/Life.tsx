import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { useCityStore } from '@/store/useCityStore'
import { radialSprite } from '@/lib/textures'
import { makeRng, rangeFrom } from '@/lib/random'
import { cityPlan } from '../cityLayout'

const PERSON_TINTS = ['#f2f5ff', '#9ad9ff', '#ffc8e0', '#ffe0a8', '#c3b4ff']

/** Everything that moves and is not a car: people, drones, birds, clouds, ambient motes. */
export function Life() {
  const quality = useCityStore((s) => s.quality)
  const night = useCityStore((s) => s.timeOfDay === 'night')

  return (
    <group>
      <Pedestrians />
      <Drones count={quality === 'low' ? 3 : 6} />
      {!night && <Birds count={quality === 'low' ? 6 : 14} />}
      <CloudLayer count={quality === 'low' ? 6 : 14} />
      {quality !== 'low' && (
        <Sparkles
          count={night ? 130 : 70}
          scale={[150, 40, 170]}
          position={[0, 22, 12]}
          size={night ? 3.4 : 2.2}
          speed={0.24}
          opacity={night ? 0.7 : 0.3}
          color={night ? '#8fe6ff' : '#ffffff'}
        />
      )}
    </group>
  )
}

/** Walkers loop around Central Park with a small vertical bob so they read as people. */
function Pedestrians() {
  const walkers = cityPlan.walkers
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  const geometry = useMemo(() => new THREE.CapsuleGeometry(0.26, 0.72, 3, 6), [])
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0.05, vertexColors: true }),
    [],
  )

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    walkers.forEach((w, i) => mesh.setColorAt(i, color.set(PERSON_TINTS[w.tint % PERSON_TINTS.length])))
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [walkers, color])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame(({ clock }) => {
    const mesh = ref.current
    if (!mesh) return
    const t = clock.elapsedTime
    walkers.forEach((w, i) => {
      const angle = w.phase + t * w.speed
      const x = w.centre[0] + Math.cos(angle) * w.radius * 1.12
      const z = w.centre[1] + Math.sin(angle) * w.radius
      dummy.position.set(x, 0.68 + Math.abs(Math.sin(t * 6 + w.phase)) * 0.07, z)
      dummy.rotation.set(0, -angle + (w.speed > 0 ? 0 : Math.PI), 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[geometry, material, walkers.length]} castShadow frustumCulled={false} />
  )
}

/** Delivery drones tracing lazy figure-eights above the avenues, nav lights blinking. */
function Drones({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null)

  const paths = useMemo(() => {
    const rng = makeRng(31337)
    return Array.from({ length: count }, () => ({
      centre: [rangeFrom(rng, -40, 40), rangeFrom(rng, -40, 60)] as [number, number],
      radius: rangeFrom(rng, 12, 26),
      height: rangeFrom(rng, 16, 32),
      speed: rangeFrom(rng, 0.12, 0.28),
      phase: rng() * Math.PI * 2,
      tilt: rangeFrom(rng, 0.2, 0.6),
    }))
  }, [count])

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.elapsedTime
    group.current.children.forEach((child, i) => {
      const p = paths[i]
      if (!p) return
      const a = p.phase + t * p.speed
      child.position.set(
        p.centre[0] + Math.sin(a) * p.radius,
        p.height + Math.sin(a * 2.3) * 1.6,
        p.centre[1] + Math.sin(a * 2) * p.radius * 0.5,
      )
      child.rotation.set(Math.sin(a * 2) * 0.12, -a, Math.cos(a) * p.tilt * 0.2)
    })
  })

  return (
    <group ref={group}>
      {paths.map((_, i) => (
        <Drone key={i} phase={i} />
      ))}
    </group>
  )
}

function Drone({ phase }: { phase: number }) {
  const beacon = useRef<THREE.MeshBasicMaterial>(null)
  const rotors = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (beacon.current) beacon.current.opacity = 0.25 + (Math.sin(t * 6 + phase) > 0.4 ? 0.75 : 0)
    if (rotors.current) rotors.current.rotation.y = t * 34
  })

  return (
    <group scale={0.6}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.24, 0.9]} />
        <meshStandardMaterial color="#1b2740" roughness={0.4} metalness={0.7} />
      </mesh>
      <group ref={rotors}>
        {[
          [0.62, 0.62],
          [-0.62, 0.62],
          [0.62, -0.62],
          [-0.62, -0.62],
        ].map(([x, z]) => (
          <mesh key={`${x}-${z}`} position={[x, 0.16, z]}>
            <cylinderGeometry args={[0.42, 0.42, 0.03, 8]} />
            <meshBasicMaterial color="#5f7ea8" transparent opacity={0.35} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshBasicMaterial ref={beacon} color="#38e8ff" transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Daytime birds: instanced "V" wings that flap and bank around the skyline. */
function Birds({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const flock = useMemo(() => {
    const rng = makeRng(777)
    return Array.from({ length: count }, () => ({
      radius: rangeFrom(rng, 30, 62),
      height: rangeFrom(rng, 30, 48),
      speed: rangeFrom(rng, 0.08, 0.16),
      phase: rng() * Math.PI * 2,
      scale: rangeFrom(rng, 0.6, 1.1),
    }))
  }, [count])

  const geometry = useMemo(() => new THREE.ConeGeometry(0.5, 1.6, 3), [])
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#2a3550', transparent: true, opacity: 0.7 }),
    [],
  )

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame(({ clock }) => {
    const mesh = ref.current
    if (!mesh) return
    const t = clock.elapsedTime
    flock.forEach((b, i) => {
      const a = b.phase + t * b.speed
      dummy.position.set(Math.cos(a) * b.radius, b.height + Math.sin(a * 3) * 2.4, 10 + Math.sin(a) * b.radius)
      dummy.rotation.set(Math.PI / 2, 0, -a + Math.sin(t * 9 + b.phase) * 0.4)
      dummy.scale.setScalar(b.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={ref} args={[geometry, material, count]} frustumCulled={false} />
}

/** Sprite clouds drifting on the wind, recycled when they leave the plate. */
function CloudLayer({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null)
  const night = useCityStore((s) => s.timeOfDay === 'night')
  const texture = useMemo(() => radialSprite('#ffffff', 0.42), [])

  const clouds = useMemo(() => {
    const rng = makeRng(5150)
    return Array.from({ length: count }, () => ({
      x: rangeFrom(rng, -90, 90),
      y: rangeFrom(rng, 38, 62),
      z: rangeFrom(rng, -80, 110),
      scale: rangeFrom(rng, 22, 52),
      speed: rangeFrom(rng, 0.45, 1.3),
      opacity: rangeFrom(rng, 0.12, 0.3),
    }))
  }, [count])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.children.forEach((child, i) => {
      const c = clouds[i]
      if (!c) return
      child.position.x += c.speed * delta
      if (child.position.x > 110) child.position.x = -110
    })
  })

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <sprite key={i} position={[c.x, c.y, c.z]} scale={[c.scale, c.scale * 0.42, 1]}>
          <spriteMaterial
            map={texture}
            transparent
            opacity={night ? c.opacity * 0.6 : c.opacity}
            depthWrite={false}
            color={night ? '#9fb6d8' : '#ffffff'}
          />
        </sprite>
      ))}
    </group>
  )
}
