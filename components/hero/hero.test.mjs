// Run: node --test components/hero/hero.test.mjs
import assert from "node:assert/strict";
import test from "node:test";

import { canRunWebGLHero } from "../../lib/capability.ts";
import { CHAOS, LINE, LINE_STEP, LINE_Y, NODES, ORDER, layoutInto, phases } from "./system-graph.ts";

const near = (a, b) => Math.abs(a - b) < 1e-6;

test("seven nodes, all positions finite", () => {
  assert.equal(NODES.length, 7);
  for (const arr of [CHAOS, ORDER, LINE]) {
    assert.equal(arr.length, 21);
    assert.ok(arr.every(Number.isFinite));
  }
});

test("layout endpoints", () => {
  const out = new Array(21).fill(0);
  layoutInto(out, 0, 0);
  assert.ok(out.every((v, i) => near(v, CHAOS[i])), "t=0 is chaos");
  layoutInto(out, 1, 0);
  assert.ok(out.every((v, i) => near(v, ORDER[i])), "t=1 is order");
  layoutInto(out, 1, 1);
  assert.ok(out.every((v, i) => near(v, LINE[i])), "c=1 is the line");
  const ys = out.filter((_, i) => i % 3 === 1);
  assert.ok(ys.every((y) => near(y, ys[0])), "line is collinear");
});

test("collapse phases: 0 at start, 1 at end, never go backwards, tighten before align", () => {
  const keys = Object.keys(phases(0));
  assert.deepEqual(keys.sort(), ["chain", "core", "hush", "labels", "line", "tight"]);
  assert.ok(Object.values(phases(0)).every((v) => v === 0));
  assert.ok(Object.values(phases(1)).every((v) => v === 1));
  let prev = phases(0);
  for (let c = 0.01; c <= 1; c += 0.01) {
    const cur = phases(c);
    for (const k of keys) assert.ok(cur[k] >= prev[k] - 1e-12 && cur[k] >= 0 && cur[k] <= 1, `${k} monotonic at c=${c}`);
    assert.ok(cur.tight >= cur.line - 1e-12, "nodes gather before they align");
    assert.ok(cur.line >= cur.chain - 1e-12, "chain links appear after the nodes line up");
    prev = cur;
  }
});

test("layout: tightened ring is smaller than the order ring; line is evenly spaced at LINE_Y", () => {
  const radius = (arr) => {
    let sum = 0;
    for (let i = 0; i < 7; i += 1) sum += Math.hypot(arr[i * 3], arr[i * 3 + 1]);
    return sum / 7;
  };
  const a = new Array(21).fill(0);
  const b = new Array(21).fill(0);
  layoutInto(a, 1, 0);
  layoutInto(b, 1, 0.3); // tightest point, nodes not yet moving to the line
  assert.ok(radius(b) < radius(a) * 0.9, "ring tightens toward the core");
  assert.ok(b.every((v, i) => i % 3 !== 2 || near(v, a[i])), "depth is untouched while tightening");
  layoutInto(b, 1, 0.54); // halfway to the line
  assert.ok(b.every((v, i) => i % 3 !== 2 || v > 0.2), "nodes cross in front of the core");
  layoutInto(a, 1, 1);
  for (let i = 0; i < 7; i += 1) {
    assert.ok(near(a[i * 3 + 1], LINE_Y), "node sits on the line");
    if (i > 0) assert.ok(near(a[i * 3] - a[(i - 1) * 3], LINE_STEP), "even spacing");
  }
});

test("hero gate", () => {
  const ok = { width: 1280, reducedMotion: false, saveData: false, webgl2: true };
  assert.equal(canRunWebGLHero(ok), true);
  assert.equal(canRunWebGLHero({ ...ok, width: 800 }), true);
  assert.equal(canRunWebGLHero({ ...ok, width: 480 }), false);
  assert.equal(canRunWebGLHero({ ...ok, reducedMotion: true }), false);
  assert.equal(canRunWebGLHero({ ...ok, saveData: true }), false);
  assert.equal(canRunWebGLHero({ ...ok, webgl2: false }), false);
});
