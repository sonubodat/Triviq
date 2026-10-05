# Triviq T-core: pipeline notes

Procedural Three.js model built with the img2threejs pipeline (all 8 passes credited, 0 of 6 corrections used).
Source of truth: `object-sculpt-spec.json`. Output: `components/three/createTriviqCore.ts`.
**Stylised interpretation** of `public/assets/triviq-logo.png` (T mark only): depth, bevel and ring cross-section are invented.

## Post-generation edits (generator output is trimmed, not hand-written)
- Bevels: the generator extrudes with `bevelEnabled: false`; `tools/postprocess.py` adds `profile2D.bevel` support (`bevelOffset = -size` keeps the outline).
- `tools/lean.py` drops look-dev helpers, example-module imports and per-node metadata blobs for shipping.
- Ring spine fitted offline against the reference mask (`tools/fit_ring.py`, `ring-fit.json`, analytic IoU 0.854; render IoU 0.856).
- Review backdrop is mid grey (#a0a8b2): on white the logo's own white rim lines split the mark and the largest-blob mask captures only the T.

## Production lighting rig (matches spec `lightingFromPhoto`)
key (-4,6,5.5) x1.3 white, fill (4,-1,3.5) x0.5 #cfe6ff, rim (1,3,-6) x1.0 #6fd8ff, ambient 0.5, RoomEnvironment x0.3, NoToneMapping (ACES/Neutral desaturate the blues).

## Budget
1,608 triangles, 7 meshes, 3 materials, no textures.

`tools/*.py` are provenance scripts with absolute paths from the authoring machine.
