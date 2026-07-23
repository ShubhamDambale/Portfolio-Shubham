import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

export interface InstanceTransform {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  color?: THREE.ColorRepresentation
}

const dummy = new THREE.Object3D()
const color = new THREE.Color()

/**
 * Builds a fully-baked `THREE.InstancedMesh` once and hands it back for `<primitive />`.
 *
 * The city has thousands of static props (towers, trees, lamps, lane markings). Baking their
 * matrices a single time — instead of reconciling one React element per instance — keeps the
 * draw-call count in the dozens and the per-frame CPU cost at zero.
 */
export function useInstancedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  transforms: InstanceTransform[],
  options: { castShadow?: boolean; receiveShadow?: boolean } = {},
) {
  const mesh = useMemo(() => {
    const instanced = new THREE.InstancedMesh(geometry, material, Math.max(transforms.length, 1))
    instanced.castShadow = options.castShadow ?? false
    instanced.receiveShadow = options.receiveShadow ?? false
    instanced.frustumCulled = false

    const needsColor = transforms.some((t) => t.color !== undefined)
    if (needsColor) {
      instanced.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(Math.max(transforms.length, 1) * 3),
        3,
      )
    }

    transforms.forEach((t, i) => {
      dummy.position.set(...t.position)
      dummy.rotation.set(...(t.rotation ?? [0, 0, 0]))
      if (Array.isArray(t.scale)) dummy.scale.set(...t.scale)
      else dummy.scale.setScalar(t.scale ?? 1)
      dummy.updateMatrix()
      instanced.setMatrixAt(i, dummy.matrix)
      if (needsColor) instanced.setColorAt(i, color.set(t.color ?? '#ffffff'))
    })

    instanced.instanceMatrix.needsUpdate = true
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true
    instanced.count = transforms.length
    return instanced
    // Transforms are generated once from a fixed seed, so identity is stable by construction.
  }, [geometry, material, transforms, options.castShadow, options.receiveShadow])

  useEffect(() => () => mesh.dispose(), [mesh])

  return mesh
}
