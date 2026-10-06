"use client";

import { useGSAP } from "@gsap/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import { createTriviqTCoreModel } from "@/components/three/createTriviqCore";

import { NODES, layoutInto, phases } from "./system-graph";

gsap.registerPlugin(useGSAP);

type Callbacks = { onHover: (index: number | null) => void; onSlow: () => void; onFirstFrame: () => void };

const SPIN_AXIS = new THREE.Vector3(-0.1743, 0.8968, 0.4067).normalize(); // ring plane normal (spec)
const MAX_TILT = (3 * Math.PI) / 180;

function NodeShape({ id }: { id: string }) {
  switch (id) {
    case "product": return <boxGeometry args={[1.06, 0.7, 0.12]} />;
    case "apps": return <boxGeometry args={[0.46, 0.86, 0.1]} />;
    case "platform": return <boxGeometry args={[0.56, 0.56, 0.56]} />;
    case "infra": return <icosahedronGeometry args={[0.44, 0]} />;
    case "ai": return <octahedronGeometry args={[0.42]} />;
    case "systems": return <cylinderGeometry args={[0.34, 0.34, 0.58, 20]} />;
    case "launch": return <coneGeometry args={[0.42, 0.72, 24]} />;
    default: return <dodecahedronGeometry args={[0.4]} />;
  }
}

function labelPosition(id: string): [number, number, number] {
  switch (id) {
    case "infra": return [0.1, 0.82, 0.18];
    case "product": return [0, -0.82, 0.18];
    case "apps": return [0, -0.86, 0.18];
    case "platform": return [0, -0.74, 0.18];
    case "ai": return [0, -0.76, 0.18];
    default: return [0, -0.78, 0.18];
  }
}

function NodeLabel({ id, text, matRef }: { id: string; text: string; matRef: (m: THREE.MeshBasicMaterial | null) => void }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(16, 23, 34, 0.9)";
      ctx.strokeStyle = "rgba(2, 157, 255, 0.5)";
      ctx.lineWidth = 2;
      roundRect(ctx, 18, 24, 284, 48, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#eef8ff";
      ctx.font = "700 24px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text.toUpperCase(), canvas.width / 2, 49);
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, [text]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={labelPosition(id)}>
      <planeGeometry args={[1.28, 0.38]} />
      <meshBasicMaterial ref={matRef} map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function Environment() {
  const gl = useThree((state) => state.gl);
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return texture;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  return <primitive object={env} attach="environment" />;
}

function System({ onHover, onSlow, onFirstFrame, guard, collapse }: Callbacks & { guard: boolean; collapse: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const coreGroup = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const edgeAttr = useRef<THREE.BufferAttribute>(null);
  const chainAttr = useRef<THREE.BufferAttribute>(null);
  const spokeMat = useRef<THREE.LineBasicMaterial>(null);
  const chainMat = useRef<THREE.LineBasicMaterial>(null);
  const labelMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const pulses = useRef<THREE.InstancedMesh>(null);
  const progress = useRef({ order: 0, breathe: 0 });
  const frames = useRef({ n: 0, sum: 0, first: false });
  const pos = useMemo(() => new Float32Array(NODES.length * 3), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const core = useMemo(() => createTriviqTCoreModel(), []);
  const ring = (core.userData.sculptRuntime as { nodes: Record<string, THREE.Object3D> }).nodes["orbit-ring"];

  useEffect(
    () => () => {
      core.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose());
        }
      });
    },
    [core],
  );

  // Faster assemble, then a permanent living-system pulse.
  useGSAP(() => {
    gsap.to(progress.current, { order: 1, duration: 1.35, ease: "power3.inOut", delay: 0.08 });
    gsap.to(progress.current, { breathe: 1, duration: 1.15, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.1 });
  });

  useFrame((state, dt) => {
    if (!frames.current.first) {
      frames.current.first = true;
      onFirstFrame();
    }
    // ponytail: one downgrade rule. Skip 10 warm-up frames (shader compile), judge the next 90.
    const f = frames.current;
    if (f.n < 100) {
      f.n += 1;
      if (f.n > 10) f.sum += dt;
      if (guard && f.n === 100 && f.sum / 90 > 0.028) onSlow();
    }

    // Scroll hand-off (hero-visual.tsx scrubs `collapse` 0..1): tighten -> core recedes -> connections quiet -> align on a line.
    const c = collapse.current;
    const p = phases(c);
    const living = progress.current.breathe * progress.current.order * (1 - p.tight);
    layoutInto(pos, Math.max(0, progress.current.order - living * 0.05), c);
    const t = state.clock.elapsedTime;
    const lines = edgeAttr.current;
    const chain = chainAttr.current;
    const nodeScale = 1 - 0.38 * p.line;
    let px = 0;
    let py = 0;
    let pz = 0;
    for (let i = 0; i < NODES.length; i += 1) {
      const g = nodeRefs.current[i];
      const x = pos[i * 3] + Math.sin(t * 1.35 + i * 0.8) * 0.09 * living;
      const y = pos[i * 3 + 1] + Math.sin(t * 1.15 + i) * (0.04 + 0.06 * living) * (1 - p.line);
      const z = pos[i * 3 + 2] + Math.cos(t * 1.2 + i) * 0.08 * living;
      g?.position.set(x, y, z);
      g?.scale.setScalar(nodeScale);
      if (lines) {
        lines.setXYZ(i * 2, 0, 0, 0);
        lines.setXYZ(i * 2 + 1, x, y, z);
      }
      if (pulses.current) {
        const f = (t * 0.68 + i / NODES.length) % 1;
        dummy.position.set(x * f, y * f, z * f);
        dummy.scale.setScalar(1 - p.hush);
        dummy.updateMatrix();
        pulses.current.setMatrixAt(i, dummy.matrix);
      }
      if (chain && i > 0) {
        chain.setXYZ((i - 1) * 2, px, py, pz);
        chain.setXYZ((i - 1) * 2 + 1, x, y, z);
      }
      px = x;
      py = y;
      pz = z;
      const label = labelMats.current[i];
      if (label) {
        label.opacity = 1 - p.labels;
        label.visible = p.labels < 0.99;
      }
    }
    if (lines) lines.needsUpdate = true;
    if (pulses.current) pulses.current.instanceMatrix.needsUpdate = true;
    if (chain) chain.needsUpdate = true;
    if (spokeMat.current) spokeMat.current.opacity = 0.45 * (1 - p.hush);
    if (chainMat.current) chainMat.current.opacity = 0.5 * p.chain;

    ring.rotateOnAxis(SPIN_AXIS, dt * 1.15 * (1 - c * 0.55));
    if (group.current) {
      // pointer parallax: whole system leans at most 3 degrees, and settles flat as it collapses
      group.current.rotation.y += (state.pointer.x * MAX_TILT * (1 - c) - group.current.rotation.y) * 0.06;
      group.current.rotation.x += (-state.pointer.y * MAX_TILT * (1 - c) - group.current.rotation.x) * 0.06;
    }
    if (coreGroup.current) {
      // recedes and shrinks a little; never grows, never spins faster
      coreGroup.current.position.z = -0.6 * p.core;
      coreGroup.current.scale.setScalar(1.15 - 0.13 * p.core);
      coreGroup.current.rotation.z = Math.sin(t * 1.1) * 0.012 * (1 - p.core);
    }
  });

  return (
    <group ref={group}>
      <group ref={coreGroup} position={[0, 0, 0]} scale={1.15}>
        <primitive object={core} position-z={-0.23} />
      </group>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute ref={edgeAttr} attach="attributes-position" args={[new Float32Array(NODES.length * 6), 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={spokeMat} color="#029dff" transparent opacity={0.45} />
      </lineSegments>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute ref={chainAttr} attach="attributes-position" args={[new Float32Array((NODES.length - 1) * 6), 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={chainMat} color="#6fd8ff" transparent opacity={0} />
      </lineSegments>
      <instancedMesh ref={pulses} args={[undefined, undefined, NODES.length]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial color="#03d7fe" />
      </instancedMesh>
      {NODES.map((node, i) => (
        <group
          key={node.id}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(i);
          }}
          onPointerOut={() => onHover(null)}
        >
          <mesh>
            <NodeShape id={node.id} />
            <meshStandardMaterial color="#17233a" roughness={0.4} metalness={0.25} />
          </mesh>
          <NodeLabel
            id={node.id}
            text={node.label}
            matRef={(m) => {
              labelMats.current[i] = m;
            }}
          />
          <lineSegments>
            <edgesGeometry args={[nodeEdgeSource(node.id)]} />
            <lineBasicMaterial color="#6fd8ff" transparent opacity={0.85} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

// EdgesGeometry needs real geometry; build the same shapes once for the outline.
const edgeSources = new Map<string, THREE.BufferGeometry>();
function nodeEdgeSource(id: string): THREE.BufferGeometry {
  let g = edgeSources.get(id);
  if (!g) {
    g =
      id === "product" ? new THREE.BoxGeometry(1.06, 0.7, 0.12)
      : id === "apps" ? new THREE.BoxGeometry(0.46, 0.86, 0.1)
      : id === "platform" ? new THREE.BoxGeometry(0.56, 0.56, 0.56)
      : id === "infra" ? new THREE.IcosahedronGeometry(0.44, 0)
      : id === "ai" ? new THREE.OctahedronGeometry(0.42)
      : id === "systems" ? new THREE.CylinderGeometry(0.34, 0.34, 0.58, 20)
      : id === "launch" ? new THREE.ConeGeometry(0.42, 0.72, 24)
      : new THREE.DodecahedronGeometry(0.4);
    edgeSources.set(id, g);
  }
  return g;
}

export default function HeroScene({ active, guard, collapse, ...callbacks }: Callbacks & { active: boolean; guard: boolean; collapse: RefObject<number> }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 13], fov: 30 }}
      scene={{ environmentIntensity: 0.3 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping; // ACES/Neutral desaturate the brand blues (img2threejs lighting pass)
        gl.domElement.addEventListener("webglcontextlost", callbacks.onSlow);
      }}
    >
      <Environment />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-4, 6, 5.5]} intensity={1.3} />
      <directionalLight position={[4, -1, 3.5]} intensity={0.5} color="#cfe6ff" />
      <directionalLight position={[1, 3, -6]} intensity={1.0} color="#6fd8ff" />
      <System guard={guard} collapse={collapse} {...callbacks} />
    </Canvas>
  );
}
