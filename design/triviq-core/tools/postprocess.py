import sys,re
p=sys.argv[1]; s=open(p).read()
old="""  return new THREE.ExtrudeGeometry(shape, {
    depth: profile.depth,
    bevelEnabled: false,
    steps: 1,
  });"""
new="""  // refine-code (design/triviq-core/PATCHES.md): the generator extrudes with bevelEnabled false. A rounded
  // chamfer catches the key light; bevelOffset = -size keeps the outline equal to the authored profile.
  const bevel = profile.bevel;
  if (!bevel) return new THREE.ExtrudeGeometry(shape, { depth: profile.depth, bevelEnabled: false, steps: 1 });
  const beveled = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.001, profile.depth - 2 * bevel.thickness),
    bevelEnabled: true,
    bevelThickness: bevel.thickness,
    bevelSize: bevel.size,
    bevelOffset: -bevel.size,
    bevelSegments: bevel.segments ?? 2,
    steps: 1,
  });
  beveled.translate(0, 0, bevel.thickness);
  return beveled;"""
if old in s: s=s.replace(old,new); print('postprocess: bevel patched')
else: print('postprocess: bevel anchor not found (already patched or pass has no extrude)')
sig='ovalHoles?: { cx: number; cy: number; rx: number; ry: number }[] }): THREE.ExtrudeGeometry {'
if sig in s: s=s.replace(sig,'ovalHoles?: { cx: number; cy: number; rx: number; ry: number }[]; bevel?: { size: number; thickness: number; segments?: number } }): THREE.ExtrudeGeometry {')
open(p,'w').write(s)
