// Regenerates media/showreel/assets/hero/hero-NNN.webp: transparent stills of the REAL WebGL hero at 11 points of the
// scroll collapse (see components/hero/hero-visual.tsx), frame-blended by the reel.
//
//   1. pnpm dev                       (http://localhost:3000)
//   2. node media/showreel/tools/capture-hero.mjs [--url http://localhost:3000/] [--out media/showreel/assets/hero]
//
// Needs Node >= 22, Google Chrome (software GL is fine, it is slow but deterministic) and `cwebp`.
// The viewport is fixed at 1440x900 because the collapse runs over half a viewport of scroll (450px).
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const URL = arg("url", "http://localhost:3000/");
const OUT = path.resolve(arg("out", "media/showreel/assets/hero"));
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;
const STATES = Array.from({ length: 11 }, (_, i) => Math.round((i * 450) / 10)); // scroll px: 0, 45, ... 450
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

fs.mkdirSync(OUT, { recursive: true });
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "reel-hero-"));
const chrome = spawn(
  CHROME,
  ["--headless=new", "--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "about:blank"],
  { stdio: "ignore" },
);

try {
  for (let i = 0; i < 60; i += 1) {
    try { await fetch(`http://127.0.0.1:${PORT}/json/version`); break; } catch { await sleep(250); }
  }
  const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); }
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const run = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
  await send("Page.navigate", { url: URL });
  await sleep(3000);
  for (let i = 0; i < 80 && !(await run(`!!document.querySelector('.hero-exit-rail')`)); i += 1) await sleep(300); // scene is live
  await sleep(6000); // shader warm-up + intro assemble

  // Transparent page, no header, later sections hidden (visibility keeps the scroll height) so nothing overlaps the shot.
  await run(`(() => {
    const s = document.createElement('style');
    s.textContent = 'html, body { background: transparent !important; } [data-motion-section=hero] { background: none !important; } header, .skip-link { display: none !important; } [data-motion-section=hero] ~ * { visibility: hidden !important; }';
    document.head.appendChild(s);
    document.querySelector('canvas').parentElement.parentElement.id = 'hero-capture-box';
  })()`);

  for (const y of STATES) {
    await run(`window.scrollTo({ top: ${y}, behavior: 'instant' })`);
    await sleep(4500); // the scrub is slow under software GL
    // Keep the visual where it sits at scroll 0 so the shot never needs off-screen content.
    await run(`document.querySelector('[data-motion-section=hero]').style.transform = 'translateY(${y}px)'`);
    await sleep(900);
    const r = await run(`(() => { const b = document.getElementById('hero-capture-box').getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height }; })()`);
    const shot = await send("Page.captureScreenshot", { format: "png", clip: { ...r, scale: 1 } });
    const png = path.join(profile, `hero-${String(y).padStart(3, "0")}.png`);
    fs.writeFileSync(png, Buffer.from(shot.data, "base64"));
    execFileSync("cwebp", ["-quiet", "-q", "90", "-alpha_q", "100", "-m", "6", png, "-o", path.join(OUT, `hero-${String(y).padStart(3, "0")}.webp`)]);
    await run(`document.querySelector('[data-motion-section=hero]').style.transform = ''`);
    console.log(`hero-${String(y).padStart(3, "0")}.webp`);
  }
  ws.close();
} finally {
  chrome.kill("SIGKILL");
  fs.rmSync(profile, { recursive: true, force: true });
}
