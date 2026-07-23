import { EffectComposer, Bloom, Vignette, SMAA, BrightnessContrast } from '@react-three/postprocessing'
import { useCityStore } from '@/store/useCityStore'

/**
 * Postprocessing stack. Bloom is what makes the neon read as neon; it is dialled back by day and
 * skipped entirely on low-power devices to protect the frame budget.
 */
export function Effects() {
  const quality = useCityStore((s) => s.quality)
  const night = useCityStore((s) => s.timeOfDay === 'night')

  if (quality === 'low') return null

  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom
        intensity={night ? 0.9 : 0.35}
        luminanceThreshold={night ? 0.35 : 0.7}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.7}
      />
      <BrightnessContrast brightness={night ? 0.0 : 0.02} contrast={0.06} />
      <Vignette eskil={false} offset={0.28} darkness={night ? 0.75 : 0.4} />
      {quality === 'high' ? <SMAA /> : <></>}
    </EffectComposer>
  )
}
