// Run: node --test components/hero/hero.test.mjs
import assert from "node:assert/strict";
import test from "node:test";

import { canRunWebGLHero } from "../../lib/capability.ts";
import { CHAOS, LINE, NODES, ORDER, layoutInto } from "./system-graph.ts";

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

test("hero gate", () => {
  const ok = { width: 1280, reducedMotion: false, saveData: false, webgl2: true };
  assert.equal(canRunWebGLHero(ok), true);
  assert.equal(canRunWebGLHero({ ...ok, width: 800 }), true);
  assert.equal(canRunWebGLHero({ ...ok, width: 480 }), false);
  assert.equal(canRunWebGLHero({ ...ok, reducedMotion: true }), false);
  assert.equal(canRunWebGLHero({ ...ok, saveData: true }), false);
  assert.equal(canRunWebGLHero({ ...ok, webgl2: false }), false);
});
