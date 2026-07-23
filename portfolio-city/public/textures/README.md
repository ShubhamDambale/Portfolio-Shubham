# Texture assets

The city uses procedural / analytic materials only, so no textures are required to run.

If you add textures:

- Compress to **KTX2 (Basis Universal)**: `npx @gltf-transform/cli etc1s in.glb out.glb`
  or `npx ktx2-encoder texture.png texture.ktx2`.
- Prefer **1024²** for building facades and **512²** for props.
- Always set `texture.colorSpace = THREE.SRGBColorSpace` for albedo maps, and leave
  roughness/metalness/normal maps in linear space.
- Load lazily with `useTexture` inside a `<Suspense>` boundary so the city can render before they land.
