// Decides whether the optional WebGL hero may mount. Pure so it can be tested; real frame time
// (see hero-scene) is the final judge, so there is deliberately no CPU-core heuristic here.
export type HeroEnv = { width: number; reducedMotion: boolean; saveData: boolean; webgl2: boolean };

export function canRunWebGLHero(env: HeroEnv): boolean {
  return env.width >= 640 && !env.reducedMotion && !env.saveData && env.webgl2;
}

export function detectHeroEnv(): HeroEnv {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const probe = document.createElement("canvas");
  const gl = probe.getContext("webgl2");
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  return {
    width: window.innerWidth,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: connection?.saveData === true,
    webgl2: gl !== null,
  };
}
