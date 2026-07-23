import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useCityStore } from '@/store/useCityStore'
import { windowTexture } from '@/lib/textures'
import { cityPlan } from './cityLayout'
import { useInstancedMesh, type InstanceTransform } from './useInstancedMesh'

const TINTS = ['#16233b', '#1a2a45', '#121c30', '#1d3050', '#0f1828', '#233150']

/** The background skyline: every non-landmark block, drawn in a single instanced call. */
export function Skyline() {
  const night = useCityStore((s) => s.timeOfDay === 'night')
  const quality = useCityStore((s) => s.quality)

  const lots = useMemo(
    () => (quality === 'low' ? cityPlan.fillerLots.filter((_, i) => i % 2 === 0) : cityPlan.fillerLots),
    [quality],
  )

  const transforms = useMemo<InstanceTransform[]>(
    () =>
      lots.map((lot) => ({
        position: lot.position,
        rotation: [0, lot.rotation, 0],
        scale: lot.size,
        color: TINTS[Math.floor(lot.tint * TINTS.length) % TINTS.length],
      })),
    [lots],
  )

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

  const material = useMemo(() => {
    const map = windowTexture(11, 0.4)
    map.repeat.set(2, 3)
    return new THREE.MeshStandardMaterial({
      map,
      emissiveMap: map,
      emissive: new THREE.Color('#8fe6ff'),
      emissiveIntensity: 1.1,
      roughness: 0.72,
      metalness: 0.28,
      vertexColors: true,
    })
  }, [])

  useEffect(() => {
    material.emissiveIntensity = night ? 1.25 : 0.08
    material.needsUpdate = true
  }, [material, night])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  const mesh = useInstancedMesh(geometry, material, transforms, {
    castShadow: quality !== 'low',
    receiveShadow: false,
  })

  return <primitive object={mesh} />
}
