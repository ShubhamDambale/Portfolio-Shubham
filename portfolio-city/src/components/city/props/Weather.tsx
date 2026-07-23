import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useCityStore } from '@/store/useCityStore'
import { radialSprite, streakSprite } from '@/lib/textures'
import { makeRng, rangeFrom } from '@/lib/random'

/**
 * Rain and snow, both as a single `THREE.Points` cloud whose Y is advanced on the CPU and
 * wrapped — no shader compilation, no per-particle objects.
 */
export function Weather() {
  const weather = useCityStore((s) => s.weather)
  const quality = useCityStore((s) => s.quality)
  if (weather === 'clear') return null
  const count = quality === 'low' ? 700 : quality === 'medium' ? 1800 : 3200
  return <Precipitation key={weather} kind={weather} count={count} />
}

function Precipitation({ kind, count }: { kind: 'rain' | 'snow'; count: number }) {
  const ref = useRef<THREE.Points>(null)
  const snow = kind === 'snow'

  const { positions, speeds, drift } = useMemo(() => {
    const rng = makeRng(snow ? 2024 : 1999)
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const drift = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = rangeFrom(rng, -95, 95)
      positions[i * 3 + 1] = rangeFrom(rng, 0, 70)
      positions[i * 3 + 2] = rangeFrom(rng, -85, 110)
      speeds[i] = snow ? rangeFrom(rng, 1.4, 3.2) : rangeFrom(rng, 26, 44)
      drift[i] = rangeFrom(rng, -0.6, 0.6)
    }
    return { positions, speeds, drift }
  }, [count, snow])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: snow ? radialSprite('#ffffff', 0.5) : streakSprite('#a9dcff'),
        size: snow ? 0.55 : 1.5,
        transparent: true,
        opacity: snow ? 0.85 : 0.45,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      }),
    [snow],
  )

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame((state, delta) => {
    const points = ref.current
    if (!points) return
    const attr = points.geometry.getAttribute('position') as THREE.BufferAttribute
    const array = attr.array as Float32Array
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const y = i * 3 + 1
      array[y] -= speeds[i] * delta
      if (snow) {
        array[i * 3] += Math.sin(t * 0.6 + i) * drift[i] * delta * 3
      }
      if (array[y] < 0) {
        array[y] = 70
      }
    }
    attr.needsUpdate = true
  })

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />
}
