import json, copy, math
P='/Users/sonubodat/Desktop/Triviq/triviq-website/design/triviq-core'
spec=json.load(open(P+'/object-sculpt-spec.json'))
assess=json.load(open(P+'/assessment.json'))
skel=json.load(open('/private/tmp/claude-501/-Users-sonubodat-Desktop-Triviq/eb89bd34-2aa5-4308-b544-6be72a046113/scratchpad/core/skeleton.json'))
tmpl=copy.deepcopy(skel['componentTree'][0])

# ---------- ring stations (fitted offline against the reference mask: design/triviq-core/ring-fit.json) ----------
FIT=json.load(open(P+'/ring-fit.json'))
R=FIT['R']; ALPHA=math.radians(FIT['alpha']); BETA=math.radians(FIT['beta'])
def ring_point(theta_deg,cx=0.0,cy=0.0):
    th=math.radians(theta_deg)
    x,y,z=R*math.cos(th),0.0,R*math.sin(th)
    y2=y*math.cos(ALPHA)-z*math.sin(ALPHA); z2=y*math.sin(ALPHA)+z*math.cos(ALPHA)
    x3=x*math.cos(BETA)-y2*math.sin(BETA); y3=x*math.sin(BETA)+y2*math.cos(BETA)
    return [round(x3+cx,4),round(y3+cy,4),round(z2,4)]
def arc(th0,th1,n,rxm,rzm,plat,platx,lbias,rxb,cx,cy):
    st=[]
    for i in range(n):
        u=i/(n-1); th=th0+(th1-th0)*u
        inner=0<i<n-1
        wz=(math.sin(math.pi*u)**plat)*(1.0-lbias*u) if inner else 0.0
        wx=(math.sin(math.pi*u)**platx)*(1.0+rxb*u) if inner else 0.0
        st.append({"position":ring_point(th,cx,cy),"rx":round(rxm*wx,4),"rz":round(rzm*wz,4),"twist":0.0})
    return st
near=arc(FIT['n0'],FIT['n1'],27,FIT['rx'],FIT['rz'],FIT['plat'],FIT['platx'],FIT['lb'],FIT['rxb'],0.0,0.0)
far=arc(FIT['f0'],FIT['f1'],11,0.05,0.05,0.6,0.6,0.0,0.0,0.0,0.0)

def comp(**k):
    c=copy.deepcopy(tmpl)
    for key,val in k.items():
        c[key]=val
    return c
def dims(w,h,d): return {"width":w,"height":h,"depth":d,"units":"relative","confidence":0.6}
def recipe(dom,sec,stops,cls="plastic"):
    return {"dominantAlbedo":dom,"secondaryAlbedo":sec,"materialClass":cls,"materialClassConfidence":0.55,
            "colorGradient":{"type":"linear","stops":stops}}
def action(role,axis=None,sockets=None,collider=None):
    a=copy.deepcopy(tmpl['actionProfile'])
    a['animationRole']=role
    a['pivot']['axis']=axis or [0,1,0]
    a['sockets']=sockets or []
    if collider: a['collider']=collider
    return a
def geomd(**k):
    g=copy.deepcopy(tmpl['geometryDescriptor']); g.update(k); return g

EV=["full-object"]
comps=[]
# 1 stem (root)
comps.append(comp(id="t-stem",name="T stem",level="macro",role="body",importance=1.0,confidence=0.7,primitive="extrude",
  topologyClass="assembled-solid",topologyRationale="Rigid prismatic stem with hard flat faces: an extruded rectangle profile (not a box primitive so the profile can be edited), bevel handled in refine-code.",
  geometryDescriptor=geomd(topologyIntent="extruded T stem, bevel-ready edges",profile2D={"points":[[-0.325,-1.0],[0.285,-1.0],[0.285,0.52],[-0.325,0.52]],"depth":0.46,"bevel":{"size":0.02,"thickness":0.025,"segments":3}},edgeTreatment={"type":"chamfer","bevelRadius":0.035,"segments":2}),
  parent=None,attachment=None,dimensions=dims(0.61,1.52,0.46),
  transform={"position":[0,0,0],"rotation":[0,0,0],"scale":[1,1,1]},
  actionProfile=action("root",[0,1,0],[{"id":"ring-socket","position":[0,0,0.23],"note":"orbit ring pivot"},{"id":"chip-socket","position":[0.775,1.086,0.23],"note":"chip cluster anchor"}],
    {"type":"box","offset":[0,0,0.23],"scale":[2.5,2.3,1.2],"isTrigger":False,"notes":"Whole-mark proxy; the ring and chips extend the silhouette."}),
  material="m-t-gloss",materialLayers=["m-t-gloss"],
  rootTipGradient={"rootColor":"#0230b8","tipColor":"#049bff","axis":"y"},
  colorMaterialRecipe=recipe("rgba(3,123,252,1)","rgba(1,43,184,1)",[{"position":0.0,"color":"rgba(2,48,184,1)"},{"position":1.0,"color":"rgba(4,155,255,1)"}]),
  localFeatures=[
   {"id":"bevel-stem","type":"bevel highlight","placement":"all outer edges of the stem","size":"0.035 object units","orientation":"around the stem profile","materialEffect":"bright specular rim under the key light","geometryEffect":"rounded chamfer, 3 segments, profile2D.bevel (applied by postprocess because the generator extrudes with bevelEnabled false)","confidence":0.55}],
  evidenceRefs=EV,details=[],fidelityTier="blockout"))
# 2 crossbar
comps.append(comp(id="t-crossbar",name="T crossbar",level="meso",role="body",importance=0.9,confidence=0.7,primitive="extrude",
  topologyClass="assembled-solid",topologyRationale="Rigid prismatic bar with a stepped +X end: extruded polygon profile.",
  geometryDescriptor=geomd(topologyIntent="stepped crossbar profile",profile2D={"points":[[-0.89,1.0],[0.55,1.0],[0.55,0.84],[0.865,0.84],[0.865,0.48],[-0.89,0.48]],"depth":0.5,"bevel":{"size":0.022,"thickness":0.028,"segments":3}},edgeTreatment={"type":"chamfer","bevelRadius":0.035,"segments":3}),
  parent="t-stem",attachment=None,dimensions=dims(1.755,0.52,0.5),
  transform={"position":[0,0,-0.02],"rotation":[0,0,0],"scale":[1,1,1]},
  actionProfile=action("static-part"),material="m-t-gloss",materialLayers=["m-t-gloss"],
  rootTipGradient={"rootColor":"#0377f9","tipColor":"#03d0ff","axis":"x"},
  colorMaterialRecipe=recipe("rgba(3,123,252,1)","rgba(3,214,254,1)",[{"position":0.0,"color":"rgba(3,119,249,1)"},{"position":1.0,"color":"rgba(3,208,255,1)"}]),
  localFeatures=[
   {"id":"bevel-crossbar","type":"bevel highlight","placement":"outer edges of the crossbar, strongest on the top edge","size":"0.04 object units","orientation":"around the crossbar profile","materialEffect":"crisp bright top edge","geometryEffect":"rounded chamfer, 3 segments, profile2D.bevel (postprocess)","confidence":0.6},
   {"id":"step-notch","type":"notch","placement":"top-right corner of the crossbar, x from 0.55 to 0.89","size":"0.34 x 0.16 object units","orientation":"cut from the +X top corner","materialEffect":"none","geometryEffect":"profile step in the extruded polygon","confidence":0.7}],
  evidenceRefs=EV,details=[],fidelityTier="blockout"))
# 3 orbit ring (near arc)
comps.append(comp(id="orbit-ring",name="Orbit ring (near arc)",level="macro",role="orbit",importance=0.9,confidence=0.6,primitive="tapered-sweep",
  topologyClass="continuous-sculpt",topologyRationale="One smooth swept band that narrows to true points at both tips: a tapered sweep along a tilted elliptical spine (a constant-radius tube cannot taper).",
  geometryDescriptor=geomd(topologyIntent="tapered swoosh arc",taperedSweep={"stations":near,"radialSegments":14,"capEnds":True}),
  parent="t-stem",attachment=None,dimensions=dims(2.46,0.95,1.1),
  transform={"position":[FIT["cx"],FIT["cy"],0.23],"rotation":[0,0,0],"scale":[1,1,1]},
  actionProfile=action("orbit",[-0.1743,0.8968,0.4067],[{"id":"ring-spin-axis","position":[0,0,0],"note":"spin about the ring plane normal"}],
    {"type":"box","offset":[0,0,0],"scale":[2.5,1.0,1.1],"isTrigger":False,"notes":"Proxy for the near arc"}),
  material="m-ring-gloss",materialLayers=["m-ring-gloss"],
  rootTipGradient={"rootColor":"#0540c8","tipColor":"#2a9bff","axis":"x"},
  colorMaterialRecipe=recipe("rgba(5,65,197,1)","rgba(42,155,255,1)",[{"position":0.0,"color":"rgba(1,72,230,1)"},{"position":1.0,"color":"rgba(42,155,255,1)"}]),
  localFeatures=[{"id":"ring-taper-front","type":"taper","placement":"both tips of the near arc, thick at the -X side","size":"half-height 0.21 to 0 over the arc","orientation":"along the arc","materialEffect":"white specular rim along the inner edge","geometryEffect":"tapered sweep stations narrow to a true point","confidence":0.7}],
  evidenceRefs=EV,details=[],fidelityTier="blockout"))
# 4 ring back arc
comps.append(comp(id="ring-back-arc",name="Orbit ring (far arc)",level="meso",role="orbit",importance=0.6,confidence=0.55,primitive="tapered-sweep",
  topologyClass="continuous-sculpt",topologyRationale="Thinner far arc of the same orbit, tapering to a point at its visible +X end.",
  geometryDescriptor=geomd(topologyIntent="thin tapered far arc",taperedSweep={"stations":far,"radialSegments":10,"capEnds":True}),
  parent="orbit-ring",attachment=None,dimensions=dims(2.0,0.6,1.0),
  transform={"position":[0,0,0],"rotation":[0,0,0],"scale":[1,1,1]},
  actionProfile=action("orbit",[-0.1743,0.8968,0.4067]),material="m-ring-gloss",materialLayers=["m-ring-gloss"],
  rootTipGradient={"rootColor":"#0a6fe0","tipColor":"#03c9ff","axis":"x"},
  colorMaterialRecipe=recipe("rgba(2,182,255,1)","rgba(10,111,224,1)",[{"position":0.0,"color":"rgba(10,111,224,1)"},{"position":1.0,"color":"rgba(3,201,255,1)"}]),
  localFeatures=[{"id":"ring-taper-back","type":"taper","placement":"visible +X end of the far arc, above the near-arc tip","size":"half-height 0.10 to 0","orientation":"along the arc","materialEffect":"cyan end","geometryEffect":"tapered sweep stations narrow to a true point","confidence":0.6}],
  evidenceRefs=EV,details=[],fidelityTier="blockout"))
# 5-7 chips
def chip(cid,name,level,parent,pos,size,imp):
    return comp(id=cid,name=name,level=level,role="accent",importance=imp,confidence=0.7,primitive="box",
      topologyClass="assembled-solid",topologyRationale="A discrete hard-faced cube, genuinely box-shaped.",
      geometryDescriptor=geomd(topologyIntent="floating pixel cube",edgeTreatment={"type":"chamfer","bevelRadius":0.02,"segments":1}),
      parent=parent,attachment=None,dimensions=dims(size,size,size),
      transform={"position":pos,"rotation":[0,0,0]},
      actionProfile=action("static-part",[0,1,0],[{"id":f"{cid}-anchor","position":[0,0,0],"note":"data pulse anchor"}]),
      material="m-chip-emissive",materialLayers=["m-chip-emissive"],
      colorMaterialRecipe=recipe("rgba(3,214,254,1)","rgba(92,224,255,1)",[{"position":0.0,"color":"rgba(3,214,254,1)"},{"position":1.0,"color":"rgba(92,224,255,1)"}]),
      localFeatures=[],evidenceRefs=EV,details=[],fidelityTier="blockout")
comps.append(chip("pixel-chip-large","Pixel chip (large)","macro","t-stem",[0.775,1.086,0.23],0.27,0.5))
comps.append(chip("pixel-chip-medium","Pixel chip (medium)","meso","pixel-chip-large",[0.345,0.149,0],0.24,0.4))
comps.append(chip("pixel-chip-small","Pixel chip (small)","meso","pixel-chip-large",[0.285,-0.202,0],0.15,0.3))
spec['componentTree']=comps

# ---------- materials ----------
base=copy.deepcopy(skel['materials'][0])
def mat(mid,name,color,rough,metal,clear,clearr,emissive=None,eint=0.0,overrides=None,evidence=None,secondary=None,rvar=0.0):
    m=copy.deepcopy(base)
    for f in ("normal","bump","displacement","surfaceFrequencyBands","textureProjection","textureResolution","referencePbr","colorVariation","wear","dirt"):
        m.pop(f,None)
    m.update(id=mid,name=name,type="physical",shaderModel="MeshPhysicalMaterial (clearcoat)",baseColor=color,color=color,
      albedo={"dominant":color,"secondary":secondary or [],"samplingNotes":"Colour comes from the component rootTipGradient vertex ramp; this material colour is white so the ramp is not squared."},
      roughness={"base":rough,"variation":rvar,"map":"none (flat gloss)","localResponse":"lower roughness on the specular rim override"},
      metalness={"base":metal,"variation":0.0},
      clearcoat=clear,clearcoatRoughness=clearr,
      ambientOcclusion={"cavityStrength":0.1,"contactShadowBias":0.2,"notes":"No cavities: smooth convex solids."},
      localOverrides=overrides or [],
      textureless={"declared":True,"evidence":evidence or []})
    if emissive: m.update(emissive=emissive,emissiveIntensity=eint)
    return m
ev_flat=["reference-mark.png zones r0c0..r2c2 (design/triviq-core/detail-zones): flat vector-like colour regions with smooth gradients; no grain, pores, print or relief","analyze_texture classification: see design/triviq-core/texture-analysis.json"]
spec['materials']=[
 mat("m-t-gloss","T body gloss plastic","#ffffff",0.28,0.1,1.0,0.08,secondary=["#0377f9","#03d0ff","#0230b8","#049bff"],rvar=0.04,
   overrides=[{"id":"crossbar-gradient","region":"crossbar: -X to +X","effect":"horizontal ramp azure #0377f9 to cyan #03d0ff","strength":1.0,"evidenceRef":"zone-r0c1"},
              {"id":"stem-gradient","region":"stem: bottom to top","effect":"vertical ramp deep blue #0230b8 to azure #049bff","strength":1.0,"evidenceRef":"zone-r2c1"}],evidence=ev_flat),
 mat("m-ring-gloss","Orbit ring gloss","#ffffff",0.22,0.15,1.0,0.06,secondary=["#0540c8","#2a9bff","#03c9ff"],rvar=0.12,
   overrides=[{"id":"ring-rim-gloss","region":"inner edge of the ring bands","effect":"near-mirror specular rim reading as a white outline","roughness":0.1,"strength":0.8,"evidenceRef":"zone-r1c1"}],evidence=ev_flat),
 mat("m-chip-emissive","Pixel chip emissive cyan","#03d6fe",0.5,0.0,0.0,0.3,secondary=["#5ce0ff"],rvar=0.05,emissive="#03d6fe",eint=1.1,
   overrides=[{"id":"chip-emissive","region":"all three chips","effect":"self-lit cyan #03d6fe, emissiveIntensity 1.1","emissive":"#03d6fe","emissiveIntensity":1.1,"strength":1.0,"evidenceRef":"zone-r0c2"}],evidence=ev_flat),
]
# gloss response for validator: roughness base < 0.35 present.

spec['repetitionSystems']=[{"id":"pixel-chips","level":"meso","parent":"t-stem","description":"Three floating square chips stepping up and +X from the crossbar end (large, medium, small).","elementComponentIds":["pixel-chip-large","pixel-chip-medium","pixel-chip-small"],"distribution":"hand-placed along a diagonal, sizes 0.27 / 0.24 / 0.15"}]

# ---------- misc sections ----------
spec['silhouette']={"boundingShape":"T monogram (stepped crossbar on a stem) wrapped by a tilted, broken orbit ring, with three floating cubes off the crossbar's +X end","aspectRatios":["bbox 2.5 wide x 2.24 tall (1.12:1)","T alone 1.78 wide x 2.0 tall"],"symmetry":"T body bilateral about the stem except the stepped +X end; ring and chips asymmetric",
 "dominantCurves":["orbit ring: circle R=1.25 pitched 24 deg, rolled 11 deg (right end up)","ring thickest at the near arc, -X side"],"negativeSpaces":["hole inside the ring around the stem","gap between the crossbar notch and the chips"],"landmarks":["crossbar +X notch","ring -X tip","ring +X near tip","far-arc +X tip","chip cluster"]}
spec['viewEvidence'][0]['observations']=["T 1.78w x 2.0h, stem 0.61w, crossbar 0.52h","ring spans about 2.46 across, tilted 11 deg","three chips 0.27/0.24/0.15"]
spec['referenceCamera'].update(solved=True,fovDegrees=25.0,aspect=1.287,positionHint=[0.0,0.12,5.95],
  note="Set manually (a flat logo has no perspective to solve): frontal camera framing the mark at about 74% of image height; solve_camera_pose is not applicable.")
spec['coordinateFrame']={"front":"+Z toward the viewer (reference view)","up":"+Y","scaleReference":"T height = 2.0 units; origin at the centre of the T bounding box in X/Y; the T body occupies z 0..0.46, so the model centre plane is z = 0.23 (wrap with a -0.23 z offset to centre)"}
spec['preSpecAssessment']['unknownsToResolveBeforeImplementation']=[]
spec['assumptions']=["Stylised interpretation: thickness (depth), bevel, ring cross-section and back faces are invented; the owner accepted this (conditional suitability).","Wordmark out of scope: T mark only.","Ring plane assumed pitched 24 deg and rolled 11 deg from the visible ellipse; far arc assumed not to touch the crossbar.","Colours are sampled from the reference and passed to the generator as rootTipGradient ramps with a white material colour."]
spec['risks']=["Generator extrudes with bevelEnabled false: real bevels are added in refine-code and recorded in design/triviq-core/PATCHES.md.","Ring cross-section orientation follows parallel transport; verify the band reads as a swoosh from three-quarter views."]
spec['scores']={"object_isolation":3,"silhouette_readability":3,"depth_inference":1,"primitive_decomposition":3,"material_procedurality":2,"occlusion_risk":2,"interaction_fit":2}
spec['lightingFromPhoto']=[
 {"role":"key","type":"DirectionalLight","position":[-4,6,5.5],"intensity":1.3,"color":"#ffffff","note":"upper-left front: top edges of the T catch the highlight, as in the reference"},
 {"role":"fill","type":"DirectionalLight","position":[4,-1,3.5],"intensity":0.5,"color":"#cfe6ff","note":"lower-right cool fill keeps the stem bottom readable"},
 {"role":"rim","type":"DirectionalLight","position":[1,3,-6],"intensity":1.0,"color":"#6fd8ff","note":"back rim lights the ring edge"},
 {"role":"ambient","type":"AmbientLight","intensity":0.5,"color":"#ffffff"},
 {"role":"environment","note":"RoomEnvironment PMREM, environmentIntensity 0.3, for clearcoat reflections"},
 {"role":"exposure","note":"exposure 1.0, NoToneMapping: ACES and Neutral compress the saturated blues toward white (measured dE 22+ vs 18.26)"},
 {"role":"background","note":"reference review on #a0a8b2 grey (white splits the mark's own rim lines); site hero uses #05070a"},
 {"role":"shadow","note":"no contact shadow or ground shadow by design: the mark floats in the hero scene; shadow maps off"}]
spec['performanceBudget']={"qualityPriority":"real-time hero prop","targetTriangles":12000,"maxDrawCalls":8,"textureSize":0,"fpsTarget":60,"optimizationPolicy":"No textures; <= 12k triangles; shared materials; no per-frame allocations."}
spec['animationAnchors']=["root pivot supports whole-object rotation for pointer parallax","orbit-ring pivot spins about its plane normal (-0.174, 0.897, 0.407)","chip anchors host data-pulse effects"]
ids=[c['id'] for c in comps]; macro=[c['id'] for c in comps if c['level']=='macro']
for bp in spec['buildPasses']:
    bp['componentRefs']=macro if bp['id']=='blockout' else ids
spec['featureReviewTargets']=[
 {"id":"t-silhouette","name":"T monogram proportions and stepped crossbar","tier":"critical","passIds":["blockout","structural-pass"],"minimumScore":0.8,"mustPass":True,"componentRefs":["t-stem","t-crossbar"],"evidenceRefs":EV},
 {"id":"orbit-ring","name":"Tilted tapered orbit ring crossing in front of the stem","tier":"critical","passIds":["blockout","structural-pass","form-refinement"],"minimumScore":0.75,"mustPass":True,"componentRefs":["orbit-ring","ring-back-arc"],"evidenceRefs":EV},
 {"id":"chip-cluster","name":"Three cyan chips stepping off the crossbar end","tier":"important","passIds":["structural-pass","form-refinement"],"minimumScore":0.7,"mustPass":False,"componentRefs":["pixel-chip-large","pixel-chip-medium","pixel-chip-small"],"evidenceRefs":EV},
 {"id":"gradient-gloss","name":"Blue gradient glossy finish with cyan emissive chips","tier":"critical","passIds":["material-pass","surface-pass"],"minimumScore":0.7,"mustPass":True,"componentRefs":ids,"evidenceRefs":EV}]
spec['preSpecAssessment']=assess['preSpecAssessment'] | {"unknownsToResolveBeforeImplementation":[]}
json.dump(spec,open(P+'/object-sculpt-spec.json','w'),indent=1)
print("components",len(comps),"near stations",len(near),"far",len(far))
