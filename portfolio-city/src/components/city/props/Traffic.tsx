import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useCityStore } from '@/store/useCityStore'
import { cityPlan } from '../cityLayout'

const CAR_COLORS = ['#e2e8f5', '#38e8ff', '#7c5cff', '#f5a524', '#f472b6', '#34d399']

/**
 * Moving cars + cycling traffic lights.
 *
 * Every vehicle in the city is one instance of a single mesh; the whole fleet costs two draw
 * calls and one matrix write per frame.
 */
export function Traffic() {
  const quality = useCityStore((s) => s.quality)
  const night = useCityStore((s) => s.timeOfDay === 'night')

  const paths = useMemo(
    () => (quality === 'low' ? cityPlan.carPaths.filter((_, i) => i % 3 === 0) : cityPlan.carPaths),
    [quality],
  )

  const bodyRef = useRef<THREE.InstancedMesh>(null)
  const glowRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colorHelper = useMemo(() => new THREE.Color(), [])

  const bodyGeo = useMemo(() => new THREE.BoxGeometry(1.5, 0.72, 3.1), [])
  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.65, vertexColors: true }),
    [],
  )
  const glowGeo = useMemo(() => new THREE.PlaneGeometry(1.9, 3.4), [])
  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffe6b0',
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  )

  // Seed the per-instance colours once.
  useEffect(() => {
    const mesh = bodyRef.current
    if (!mesh) return
    if (!mesh.instanceColor) {
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(paths.length * 3), 3)
    }
    paths.forEach((p, i) => mesh.setColorAt(i, colorHelper.set(CAR_COLORS[p.colorIndex % CAR_COLORS.length])))
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [paths, colorHelper])

  useEffect(() => {
    glowMat.opacity = night ? 0.34 : 0
  }, [glowMat, night])

  useEffect(
    () => () => {
      bodyGeo.dispose()
      bodyMat.dispose()
      glowGeo.dispose()
      glowMat.dispose()
    },
    [bodyGeo, bodyMat, glowGeo, glowMat],
  )

  useFrame(({ clock }) => {
    const body = bodyRef.current
    if (!body) return
    const t = clock.elapsedTime

    paths.forEach((path, i) => {
      const dx = path.to[0] - path.from[0]
      const dz = path.to[1] - path.from[1]
      const length = Math.hypot(dx, dz)
      const progress = ((t * path.speed) / length + path.offset) % 1
      const x = path.from[0] + dx * progress
      const z = path.from[1] + dz * progress
      const heading = Math.atan2(dx, dz)

      dummy.position.set(x, 0.52, z)
      dummy.rotation.set(0, heading, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      body.setMatrixAt(i, dummy.matrix)

      const glow = glowRef.current
      if (glow) {
        dummy.position.set(x, 0.09, z)
        dummy.rotation.set(-Math.PI / 2, 0, -heading)
        dummy.updateMatrix()
        glow.setMatrixAt(i, dummy.matrix)
      }
    })

    body.instanceMatrix.needsUpdate = true
    if (glowRef.current) glowRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh
        ref={bodyRef}
        args={[bodyGeo, bodyMat, paths.length]}
        castShadow={quality === 'high'}
        frustumCulled={false}
      />
      <instancedMesh ref={glowRef} args={[glowGeo, glowMat, paths.length]} frustumCulled={false} />
      <TrafficLights />
    </group>
  )
}

/** Four intersections, red → green → amber, offset so the city never feels synchronised. */
function TrafficLights() {
  const lights = cityPlan.trafficLights
  return (
    <group>
      {lights.map((light, i) => (
        <TrafficLight key={i} position={light.position} rotation={light.rotation} phase={i * 0.9} />
      ))}
    </group>
  )
}

function TrafficLight({
  position,
  rotation,
  phase,
}: {
  position: [number, number, number]
  rotation: number
  phase: number
}) {
  const red = useRef<THREE.MeshBasicMaterial>(null)
  const amber = useRef<THREE.MeshBasicMaterial>(null)
  const green = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const cycle = (clock.elapsedTime * 0.35 + phase) % 3
    const on = 1
    const off = 0.08
    if (red.current) red.current.opacity = cycle < 1 ? on : off
    if (green.current) green.current.opacity = cycle >= 1 && cycle < 2.4 ? on : off
    if (amber.current) amber.current.opacity = cycle >= 2.4 ? on : off
  })

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 3.2, 6]} />
        <meshStandardMaterial color="#222c40" roughness={0.6} metalness={0.5} />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[0.42, 1.15, 0.34]} />
        <meshStandardMaterial color="#131b2b" roughness={0.8} />
      </mesh>
      {(
        [
          [0.36, '#ff4d5e', red],
          [0, '#ffc53d', amber],
          [-0.36, '#3ddc84', green],
        ] as const
      ).map(([y, color, ref]) => (
        <mesh key={color} position={[0, 3.5 + y, 0.19]}>
          <circleGeometry args={[0.11, 12]} />
          <meshBasicMaterial ref={ref} color={color} transparent opacity={0.1} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
