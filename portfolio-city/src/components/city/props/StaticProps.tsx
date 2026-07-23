import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useCityStore } from '@/store/useCityStore'
import { cityPlan } from '../cityLayout'
import { useInstancedMesh, type InstanceTransform } from '../useInstancedMesh'

/**
 * Trees and street lights. Both are static, so both are baked into instanced meshes:
 * ~900 props for 5 draw calls.
 */
export function StaticProps() {
  return (
    <group>
      <Trees />
      <StreetLights />
    </group>
  )
}

function Trees() {
  const quality = useCityStore((s) => s.quality)
  const night = useCityStore((s) => s.timeOfDay === 'night')

  const points = useMemo(
    () => (quality === 'low' ? cityPlan.trees.filter((_, i) => i % 2 === 0) : cityPlan.trees),
    [quality],
  )

  const trunks = useMemo<InstanceTransform[]>(
    () =>
      points.map((p) => ({
        position: [p.position[0], 0.9 * p.scale, p.position[2]],
        rotation: [0, p.rotation, 0],
        scale: [p.scale * 0.9, p.scale, p.scale * 0.9],
      })),
    [points],
  )

  const canopies = useMemo<InstanceTransform[]>(
    () =>
      points.map((p, i) => ({
        position: [p.position[0], (2.1 + (i % 3) * 0.18) * p.scale, p.position[2]],
        rotation: [0, p.rotation, 0],
        scale: p.scale * (0.9 + (i % 4) * 0.08),
        color: ['#1f6f4a', '#25855a', '#1a5f42', '#2f9e68'][i % 4],
      })),
    [points],
  )

  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.14, 0.2, 1.8, 5), [])
  const trunkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#3c2f26', roughness: 1 }),
    [],
  )
  const canopyGeo = useMemo(() => new THREE.IcosahedronGeometry(1.25, 0), [])
  const canopyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.85, flatShading: true, vertexColors: true }),
    [],
  )

  useEffect(() => {
    canopyMat.emissive = new THREE.Color(night ? '#04140c' : '#000000')
    canopyMat.needsUpdate = true
  }, [canopyMat, night])

  useEffect(
    () => () => {
      trunkGeo.dispose()
      trunkMat.dispose()
      canopyGeo.dispose()
      canopyMat.dispose()
    },
    [trunkGeo, trunkMat, canopyGeo, canopyMat],
  )

  const trunkMesh = useInstancedMesh(trunkGeo, trunkMat, trunks, { castShadow: quality === 'high' })
  const canopyMesh = useInstancedMesh(canopyGeo, canopyMat, canopies, { castShadow: quality !== 'low' })

  return (
    <group>
      <primitive object={trunkMesh} />
      <primitive object={canopyMesh} />
    </group>
  )
}

function StreetLights() {
  const night = useCityStore((s) => s.timeOfDay === 'night')
  const quality = useCityStore((s) => s.quality)

  const points = useMemo(
    () => (quality === 'low' ? cityPlan.streetLights.filter((_, i) => i % 2 === 0) : cityPlan.streetLights),
    [quality],
  )

  const posts = useMemo<InstanceTransform[]>(
    () =>
      points.map((p) => ({
        position: [p.position[0], 2.6 * p.scale, p.position[2]],
        rotation: [0, p.rotation, 0],
        scale: [1, p.scale, 1],
      })),
    [points],
  )

  const arms = useMemo<InstanceTransform[]>(
    () =>
      points.map((p) => ({
        position: [
          p.position[0] + Math.sin(p.rotation) * 0.9,
          5.1 * p.scale,
          p.position[2] + Math.cos(p.rotation) * 0.9,
        ],
        rotation: [0, p.rotation, 0],
        scale: p.scale,
      })),
    [points],
  )

  const postGeo = useMemo(() => new THREE.CylinderGeometry(0.09, 0.13, 5.2, 6), [])
  const postMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#26334a', roughness: 0.55, metalness: 0.6 }),
    [],
  )
  const lampGeo = useMemo(() => new THREE.BoxGeometry(1.5, 0.16, 0.44), [])
  const lampMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#ffd9a0', toneMapped: false, transparent: true }),
    [],
  )

  useEffect(() => {
    lampMat.opacity = night ? 1 : 0.22
  }, [lampMat, night])

  useEffect(
    () => () => {
      postGeo.dispose()
      postMat.dispose()
      lampGeo.dispose()
      lampMat.dispose()
    },
    [postGeo, postMat, lampGeo, lampMat],
  )

  const postMesh = useInstancedMesh(postGeo, postMat, posts, { castShadow: quality === 'high' })
  const lampMesh = useInstancedMesh(lampGeo, lampMat, arms)

  return (
    <group>
      <primitive object={postMesh} />
      <primitive object={lampMesh} />
      {/* A handful of real pool-of-light discs at night — cheap fake GI. */}
      {night && <LightPools points={points.filter((_, i) => i % 3 === 0)} />}
    </group>
  )
}

function LightPools({ points }: { points: { position: [number, number, number] }[] }) {
  const transforms = useMemo<InstanceTransform[]>(
    () => points.map((p) => ({ position: [p.position[0], 0.06, p.position[2]], rotation: [-Math.PI / 2, 0, 0] })),
    [points],
  )
  const geo = useMemo(() => new THREE.CircleGeometry(3.2, 12), [])
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffcf8f',
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  )
  useEffect(
    () => () => {
      geo.dispose()
      mat.dispose()
    },
    [geo, mat],
  )
  const mesh = useInstancedMesh(geo, mat, transforms)
  return <primitive object={mesh} />
}
