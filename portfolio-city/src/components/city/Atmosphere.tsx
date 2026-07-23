import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useCityStore } from '@/store/useCityStore'

/**
 * Lighting, sky and fog.
 *
 * Day and night are two ends of a single tween — the store flips a target and everything
 * (sun colour, intensity, fog, background) eases toward it, so the switch reads as a sunset
 * rather than a hard cut.
 */

interface Palette {
  background: string
  fog: string
  fogNear: number
  fogFar: number
  ambient: string
  ambientIntensity: number
  sun: string
  sunIntensity: number
  sunPosition: [number, number, number]
  rim: string
  rimIntensity: number
  hemiSky: string
  hemiGround: string
  hemiIntensity: number
}

const DAY: Palette = {
  background: '#9fc4e8',
  fog: '#a8c6e4',
  fogNear: 90,
  fogFar: 300,
  ambient: '#cfe2ff',
  ambientIntensity: 1.5,
  sun: '#fff4de',
  sunIntensity: 2.6,
  sunPosition: [70, 90, 40],
  rim: '#8fd8ff',
  rimIntensity: 0.5,
  hemiSky: '#bcd9ff',
  hemiGround: '#4a5568',
  hemiIntensity: 1.1,
}

const NIGHT: Palette = {
  background: '#04060c',
  fog: '#060a14',
  fogNear: 70,
  fogFar: 260,
  ambient: '#2b4a7a',
  ambientIntensity: 0.55,
  sun: '#9fc0ff',
  sunIntensity: 0.42,
  sunPosition: [-60, 70, -30],
  rim: '#7c5cff',
  rimIntensity: 1.5,
  hemiSky: '#16224a',
  hemiGround: '#05070d',
  hemiIntensity: 0.5,
}

const lerpColor = (a: THREE.Color, b: THREE.Color, t: number) => a.clone().lerp(b, t)

export function Atmosphere() {
  const night = useCityStore((s) => s.timeOfDay === 'night')
  const weather = useCityStore((s) => s.weather)
  const quality = useCityStore((s) => s.quality)
  const { scene } = useThree()

  const sunRef = useRef<THREE.DirectionalLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const rimRef = useRef<THREE.PointLight>(null)
  const hemiRef = useRef<THREE.HemisphereLight>(null)

  /** 0 = day, 1 = night. Eased every frame toward the target. */
  const blend = useRef(night ? 1 : 0)

  const colors = useMemo(
    () => ({
      background: [new THREE.Color(DAY.background), new THREE.Color(NIGHT.background)],
      fog: [new THREE.Color(DAY.fog), new THREE.Color(NIGHT.fog)],
      ambient: [new THREE.Color(DAY.ambient), new THREE.Color(NIGHT.ambient)],
      sun: [new THREE.Color(DAY.sun), new THREE.Color(NIGHT.sun)],
      rim: [new THREE.Color(DAY.rim), new THREE.Color(NIGHT.rim)],
      hemiSky: [new THREE.Color(DAY.hemiSky), new THREE.Color(NIGHT.hemiSky)],
      hemiGround: [new THREE.Color(DAY.hemiGround), new THREE.Color(NIGHT.hemiGround)],
    }),
    [],
  )

  const fog = useMemo(() => new THREE.Fog(DAY.fog, DAY.fogNear, DAY.fogFar), [])

  useEffect(() => {
    scene.fog = fog
    scene.background = new THREE.Color(DAY.background)
    return () => {
      scene.fog = null
    }
  }, [scene, fog])

  // Overcast weather desaturates and pulls the fog in.
  const overcast = weather !== 'clear' ? 0.55 : 0

  useFrame((_, delta) => {
    const target = night ? 1 : 0
    blend.current = THREE.MathUtils.damp(blend.current, target, 2.4, delta)
    const t = blend.current

    const bg = lerpColor(colors.background[0], colors.background[1], t)
    if (overcast > 0) bg.lerp(new THREE.Color('#38445c'), overcast * (1 - t * 0.6))
    if (scene.background instanceof THREE.Color) scene.background.copy(bg)

    fog.color.copy(lerpColor(colors.fog[0], colors.fog[1], t))
    if (overcast > 0) fog.color.lerp(new THREE.Color('#3a465e'), overcast * 0.5)
    fog.near = THREE.MathUtils.lerp(DAY.fogNear, NIGHT.fogNear, t) * (1 - overcast * 0.35)
    fog.far = THREE.MathUtils.lerp(DAY.fogFar, NIGHT.fogFar, t) * (1 - overcast * 0.25)

    if (ambientRef.current) {
      ambientRef.current.color.copy(lerpColor(colors.ambient[0], colors.ambient[1], t))
      ambientRef.current.intensity = THREE.MathUtils.lerp(DAY.ambientIntensity, NIGHT.ambientIntensity, t)
    }
    if (sunRef.current) {
      sunRef.current.color.copy(lerpColor(colors.sun[0], colors.sun[1], t))
      sunRef.current.intensity =
        THREE.MathUtils.lerp(DAY.sunIntensity, NIGHT.sunIntensity, t) * (1 - overcast * 0.5)
      sunRef.current.position.set(
        THREE.MathUtils.lerp(DAY.sunPosition[0], NIGHT.sunPosition[0], t),
        THREE.MathUtils.lerp(DAY.sunPosition[1], NIGHT.sunPosition[1], t),
        THREE.MathUtils.lerp(DAY.sunPosition[2], NIGHT.sunPosition[2], t),
      )
    }
    if (rimRef.current) {
      rimRef.current.color.copy(lerpColor(colors.rim[0], colors.rim[1], t))
      rimRef.current.intensity = THREE.MathUtils.lerp(DAY.rimIntensity, NIGHT.rimIntensity, t) * 260
    }
    if (hemiRef.current) {
      hemiRef.current.color.copy(lerpColor(colors.hemiSky[0], colors.hemiSky[1], t))
      hemiRef.current.groundColor.copy(lerpColor(colors.hemiGround[0], colors.hemiGround[1], t))
      hemiRef.current.intensity = THREE.MathUtils.lerp(DAY.hemiIntensity, NIGHT.hemiIntensity, t)
    }
  })

  const shadowSize = quality === 'high' ? 2048 : quality === 'medium' ? 1024 : 512

  return (
    <>
      <ambientLight ref={ambientRef} intensity={DAY.ambientIntensity} />
      <hemisphereLight ref={hemiRef} intensity={DAY.hemiIntensity} />
      <directionalLight
        ref={sunRef}
        position={DAY.sunPosition}
        intensity={DAY.sunIntensity}
        castShadow={quality !== 'low'}
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-near={1}
        shadow-camera-far={320}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
        shadow-bias={-0.0006}
        shadow-normalBias={0.035}
      />
      {/* Violet rim light over the centre — the "signature" colour of the city at night. */}
      <pointLight ref={rimRef} position={[0, 30, 6]} distance={180} decay={2} />

      {night && quality !== 'low' && (
        <Stars radius={220} depth={60} count={quality === 'high' ? 2600 : 1200} factor={5} saturation={0} fade speed={0.6} />
      )}
    </>
  )
}
