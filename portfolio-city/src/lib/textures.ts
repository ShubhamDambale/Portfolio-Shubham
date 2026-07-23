import * as THREE from 'three'
import { makeRng } from './random'

/**
 * Procedural canvas textures.
 *
 * Every texture the city uses is drawn at runtime on a 2D canvas, so the site ships zero image
 * bytes for the 3D scene: nothing to download, nothing to decode, nothing to cache-bust.
 */

const cache = new Map<string, THREE.Texture>()

function cached(key: string, make: () => THREE.Texture) {
  const hit = cache.get(key)
  if (hit) return hit
  const tex = make()
  cache.set(key, tex)
  return tex
}

/** Facade texture: a grid of windows, a fraction of them lit. Used as map + emissiveMap. */
export function windowTexture(seed = 7, litRatio = 0.38, tint = '#7fdcff') {
  return cached(`win-${seed}-${litRatio}-${tint}`, () => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const rng = makeRng(seed)

    ctx.fillStyle = '#080d18'
    ctx.fillRect(0, 0, size, size)

    const cols = 8
    const rows = 12
    const cw = size / cols
    const ch = size / rows
    const pad = Math.min(cw, ch) * 0.24

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const lit = rng() < litRatio
        ctx.fillStyle = lit ? tint : '#0d1526'
        ctx.globalAlpha = lit ? 0.55 + rng() * 0.45 : 1
        ctx.fillRect(x * cw + pad, y * ch + pad, cw - pad * 2, ch - pad * 2)
      }
    }
    ctx.globalAlpha = 1

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return tex
  })
}

/** Soft radial sprite — clouds, glow halos, particles. */
export function radialSprite(color = '#ffffff', softness = 0.55) {
  return cached(`radial-${color}-${softness}`, () => {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, color)
    g.addColorStop(softness, `${color}66`)
    g.addColorStop(1, `${color}00`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  })
}

/** Streaked sprite for rain drops. */
export function streakSprite(color = '#9fd8ff') {
  return cached(`streak-${color}`, () => {
    const w = 8
    const h = 64
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, `${color}00`)
    g.addColorStop(0.5, `${color}cc`)
    g.addColorStop(1, `${color}00`)
    ctx.fillStyle = g
    ctx.fillRect(w / 2 - 1, 0, 2, h)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  })
}

export function disposeTextureCache() {
  cache.forEach((t) => t.dispose())
  cache.clear()
}
