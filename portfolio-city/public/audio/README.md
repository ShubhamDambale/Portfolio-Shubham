# Audio

There are **no audio files** in this project on purpose.

All sound is synthesised at runtime with the Web Audio API in `src/lib/sound.ts`:

- `ambient` — a slow-drifting pad built from detuned oscillators + a lowpass filter (the
  "background music"). It is **muted by default** and only starts after a real user gesture,
  which is both an autoplay-policy requirement and an accessibility courtesy.
- `hover`, `click`, `open`, `close`, `success` — short synthesised UI blips.

This keeps the bundle small, avoids licensing questions, and means nothing blocks first paint.

If you would rather ship real audio, drop files here and replace the `play()` bodies in
`src/lib/sound.ts` with `new Audio('/audio/<file>.mp3')` (or a `<PositionalAudio>` from drei for
in-city 3D sound). Keep them under 300 KB and lazy-load on first unmute.
