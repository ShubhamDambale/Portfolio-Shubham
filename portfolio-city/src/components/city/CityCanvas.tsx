import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { PerformanceMonitor } from '@react-three/drei'
import { CityScene } from './CityScene'
import { useCityStore } from '@/store/useCityStore'
import { cameraStart } from '@/data/districts'

/**
 * The single WebGL surface. Owns the renderer settings, the adaptive-quality feedback loop, and
 * the phase hand-off from the loader.
 */
export function CityCanvas() {
  const setPhase = useCityStore((s) => s.setPhase)
  const phase = useCityStore((s) => s.phase)
  const setQuality = useCityStore((s) => s.setQuality)
  const quality = useCityStore((s) => s.quality)

  // Kick the intro fly-in the first time the scene is mounted and ready.
  useEffect(() => {
    if (phase === 'loading') return
  }, [phase])

  return (
    <Canvas
      shadows={quality !== 'low'}
      dpr={quality === 'high' ? [1, 2] : [1, 1.5]}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        alpha: false,
        stencil: false,
        depth: true,
      }}
      camera={{ position: cameraStart, fov: 42, near: 0.5, far: 500 }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        scene.matrixWorldAutoUpdate = true
        // The intro camera flight starts as soon as the context is live.
        if (useCityStore.getState().phase === 'intro') setPhase('intro')
      }}
      frameloop="always"
    >
      {/* Auto-downgrade if the GPU can't hold the frame budget; upgrade if it has headroom. */}
      <PerformanceMonitor
        onDecline={() => {
          const q = useCityStore.getState().quality
          if (q === 'high') setQuality('medium')
          else if (q === 'medium') setQuality('low')
        }}
        onIncline={() => {
          // Only step back up conservatively, once things are calm.
          const q = useCityStore.getState().quality
          if (q === 'low') setQuality('medium')
        }}
        flipflops={3}
      />
      <CityScene />
    </Canvas>
  )
}
