# 3D model assets (Blender-compatible)

The city currently renders **100% procedurally** (instanced boxes, extrusions and splines) so the
site ships with zero binary model downloads and still hits the 60 FPS / Lighthouse targets.

If you want to swap in hand-modelled assets from Blender, drop them here and they will be served
from `/models/<file>`.

## Recommended pipeline

1. Model in Blender (metric units, 1 unit = 1 metre, +Y up on export).
2. `File → Export → glTF 2.0 (.glb)` with **Compression (Draco)** enabled.
3. Optimise: `npx gltfjsx public/models/city.glb --transform --types --shadows`
   - `--transform` runs gltf-transform: Draco + texture resize + dedupe (usually 60–90% smaller).
   - The generated `.tsx` component can be dropped straight into `src/components/city/`.
4. Load it lazily:

```tsx
import { useGLTF } from '@react-three/drei'
const { scene } = useGLTF('/models/city-draco.glb')
useGLTF.preload('/models/city-draco.glb')
```

## Suggested slot names

| File                | Replaces                                    |
| ------------------- | ------------------------------------------- |
| `hq.glb`            | `components/city/buildings/CompanyHQ.tsx`   |
| `tech-park.glb`     | `components/city/buildings/TechPark.tsx`    |
| `skill-bank.glb`    | `components/city/buildings/SkillBank.tsx`   |
| `avatar.glb`        | `components/city/props/Avatar.tsx`          |
| `car.glb`           | `components/city/props/Traffic.tsx`         |

> Keep every `.glb` under ~2 MB after Draco, and prefer one merged atlas texture (KTX2/basis) per
> model so the draw-call budget stays low.
