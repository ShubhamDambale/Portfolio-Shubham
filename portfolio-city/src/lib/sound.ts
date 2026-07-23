/**
 * All audio is synthesised with the Web Audio API — no files, no licensing, no download cost.
 *
 * Rules:
 *  - Nothing is created until the first user gesture (autoplay policy + courtesy).
 *  - Everything respects the global `muted` flag, which defaults to true.
 */

type Cue = 'hover' | 'click' | 'open' | 'close' | 'success' | 'error'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let musicNodes: { osc: OscillatorNode[]; gain: GainNode; lfo: OscillatorNode } | null = null
let muted = true

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
    master = ctx.createGain()
    master.gain.value = 0.0001
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

const CUES: Record<Cue, { freq: number; to: number; dur: number; type: OscillatorType; gain: number }> = {
  hover: { freq: 880, to: 1180, dur: 0.07, type: 'sine', gain: 0.05 },
  click: { freq: 420, to: 720, dur: 0.11, type: 'triangle', gain: 0.09 },
  open: { freq: 320, to: 960, dur: 0.28, type: 'sine', gain: 0.08 },
  close: { freq: 760, to: 260, dur: 0.22, type: 'sine', gain: 0.07 },
  success: { freq: 520, to: 1560, dur: 0.5, type: 'triangle', gain: 0.11 },
  error: { freq: 300, to: 150, dur: 0.3, type: 'sawtooth', gain: 0.06 },
}

export function playCue(cue: Cue) {
  if (muted) return
  const audio = ensureContext()
  if (!audio || !master) return

  const spec = CUES[cue]
  const now = audio.currentTime
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  const filter = audio.createBiquadFilter()

  osc.type = spec.type
  osc.frequency.setValueAtTime(spec.freq, now)
  osc.frequency.exponentialRampToValueAtTime(spec.to, now + spec.dur)

  filter.type = 'lowpass'
  filter.frequency.value = 4200

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(spec.gain, now + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + spec.dur)

  osc.connect(filter).connect(gain).connect(master)
  osc.start(now)
  osc.stop(now + spec.dur + 0.02)
}

/** A slow, wide ambient pad — the city's "background music". */
export function startMusic() {
  if (muted) return
  const audio = ensureContext()
  if (!audio || !master || musicNodes) return

  const gain = audio.createGain()
  gain.gain.value = 0.0001
  gain.gain.linearRampToValueAtTime(0.045, audio.currentTime + 3.5)

  const filter = audio.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 620
  filter.Q.value = 0.7

  // Detuned fifths, a couple of octaves apart: calm, non-melodic, loops forever.
  const freqs = [55, 82.4, 110, 164.8, 220]
  const osc = freqs.map((f, i) => {
    const o = audio.createOscillator()
    o.type = i % 2 === 0 ? 'sine' : 'triangle'
    o.frequency.value = f
    o.detune.value = (i - 2) * 6
    o.connect(filter)
    o.start()
    return o
  })

  // Slow filter sweep so the pad breathes instead of droning.
  const lfo = audio.createOscillator()
  const lfoGain = audio.createGain()
  lfo.frequency.value = 0.045
  lfoGain.gain.value = 240
  lfo.connect(lfoGain).connect(filter.frequency)
  lfo.start()

  filter.connect(gain).connect(master)
  musicNodes = { osc, gain, lfo }
}

export function stopMusic() {
  if (!ctx || !musicNodes) return
  const { osc, gain, lfo } = musicNodes
  const now = ctx.currentTime
  gain.gain.cancelScheduledValues(now)
  gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8)
  osc.forEach((o) => o.stop(now + 0.9))
  lfo.stop(now + 0.9)
  musicNodes = null
}

export function setMuted(next: boolean) {
  muted = next
  if (!ctx || !master) {
    if (!next) ensureContext()
  }
  if (master && ctx) {
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now)
    master.gain.exponentialRampToValueAtTime(next ? 0.0001 : 0.9, now + 0.25)
  }
  if (next) stopMusic()
}

export const isMusicPlaying = () => musicNodes !== null
