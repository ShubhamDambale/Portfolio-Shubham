import { Suspense } from 'react'
import { AdaptiveDpr, AdaptiveEvents, BakeShadows, Preload } from '@react-three/drei'
import { Atmosphere } from './Atmosphere'
import { CameraRig } from './CameraRig'
import { Ground } from './Ground'
import { Skyline } from './Skyline'
import { Landmarks } from './buildings/Landmarks'
import { StaticProps } from './props/StaticProps'
import { Traffic } from './props/Traffic'
import { Life } from './props/Life'
import { Weather } from './props/Weather'
import { Effects } from './Effects'

/**
 * The whole city, assembled. Lives inside a single `<Canvas>` (see CityCanvas) so everything
 * shares one WebGL context and one render loop.
 */
export function CityScene() {
  return (
    <>
      <CameraRig />
      <Atmosphere />

      <Suspense fallback={null}>
        <Ground />
        <Skyline />
        <StaticProps />
        <Landmarks />
        <Traffic />
        <Life />
        <Weather />
        <Preload all />
      </Suspense>

      <Effects />

      {/* Perf helpers: throttle pixel ratio + events under load, freeze static shadows. */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <BakeShadows />
    </>
  )
}
