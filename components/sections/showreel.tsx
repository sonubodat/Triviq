"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";

import { track } from "@/lib/analytics";

// Silent 17s reel (media/showreel, rendered with HyperFrames). User-initiated only: no autoplay, preload="none",
// so the page pays for the poster alone until someone presses play.
const DURATION = 17;
const HIDE_AFTER_MS = 2500;

type State = "idle" | "playing" | "paused" | "ended";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const subscribe = () => () => {};

export function Showreel() {
  // The player UI exists only once JS has hydrated; without JS the poster and the MP4 link remain.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [state, setState] = useState<State>("idle");
  const [active, setActive] = useState(true);

  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const range = useRef<HTMLInputElement>(null);
  const now = useRef<HTMLSpanElement>(null);
  const total = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const scrubbing = useRef(false);
  const resumeAfterScrub = useRef(false);

  // Writes progress straight to the DOM: no React render per frame.
  const paint = (t: number) => {
    const d = video.current?.duration || DURATION;
    const r = range.current;
    if (r) {
      r.value = String(t);
      r.style.setProperty("--p", `${(t / d) * 100}%`);
      r.setAttribute("aria-valuetext", `${fmt(t)} of ${fmt(d)}`);
    }
    if (now.current) now.current.textContent = fmt(t);
    if (total.current) total.current.textContent = fmt(d);
  };
  const tick = () => {
    if (!scrubbing.current && video.current) paint(video.current.currentTime);
    raf.current = requestAnimationFrame(tick);
  };
  const stopTick = () => cancelAnimationFrame(raf.current);

  const poke = () => {
    setActive(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setActive(false), HIDE_AFTER_MS);
  };

  const play = () => {
    const v = video.current;
    if (!v) return;
    if (v.ended) v.currentTime = 0;
    if (state === "idle") track("showreel_play"); // first play only
    setState("playing"); // respond on press; the media events confirm it
    void v.play().catch(() => setState("paused"));
    poke();
  };
  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) play();
    else v.pause();
  };

  // Out of view means paused. Playback is the viewer's choice, so it is never resumed automatically.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.current?.pause();
    }, { threshold: 0.25 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
      clearTimeout(hideTimer.current);
    };
  }, []);

  const onScrubStart = () => {
    const v = video.current;
    if (!v) return;
    scrubbing.current = true;
    resumeAfterScrub.current = !v.paused;
    v.pause(); // keeps the frame under the thumb exact while dragging
  };
  const onScrubEnd = () => {
    if (!scrubbing.current) return;
    scrubbing.current = false;
    if (resumeAfterScrub.current) play();
  };
  const onScrub = (value: string) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = Number(value); // 1:1 with the thumb, continuously
    paint(Number(value));
  };
  const onRangeKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const v = video.current;
    if (!v) return;
    const step = e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0;
    if (!step) return;
    e.preventDefault();
    v.currentTime = Math.min(v.duration || DURATION, Math.max(0, v.currentTime + step));
    paint(v.currentTime);
  };

  const ui = state === "playing" && !active ? "hidden" : "shown";
  const ToggleIcon = state === "ended" ? RotateCcw : state === "playing" ? Pause : Play;
  const toggleLabel = state === "ended" ? "Replay showreel" : state === "playing" ? "Pause showreel" : "Play showreel";

  return (
    <figure className="reel">
      <div
        ref={frame}
        className="reel-frame on-black"
        data-state={state}
        data-ui={ui}
        onPointerMove={state === "playing" ? poke : undefined}
        onFocusCapture={poke}
      >
        <video
          ref={video}
          className="reel-video"
          poster="/media/showreel-poster.webp"
          preload="none"
          muted
          playsInline
          aria-describedby="showreel-desc"
          onClick={mounted ? toggle : undefined}
          onPlay={() => {
            setState("playing");
            stopTick();
            tick();
          }}
          onPause={(e) => {
            stopTick();
            if (scrubbing.current) return; // the thumb belongs to the pointer while dragging
            paint(e.currentTarget.currentTime);
            if (!e.currentTarget.ended) setState("paused");
          }}
          onEnded={() => {
            track("showreel_complete");
            stopTick();
            setState("ended");
            setActive(true);
          }}
          onLoadedMetadata={(e) => paint(e.currentTarget.currentTime)}
        >
          <source src="/media/showreel.mp4" type="video/mp4" />
          <source src="/media/showreel.webm" type="video/webm" />
          <a href="/media/showreel.mp4">Watch the Triviq showreel (MP4)</a>
        </video>

        {mounted && state === "idle" && (
          <>
            <button type="button" className="reel-play glass" aria-label={toggleLabel} onClick={play}>
              <Play size={30} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            </button>
            <span className="reel-chip glass mono" aria-hidden="true">Showreel &middot; 0:17</span>
          </>
        )}

        {mounted && (
          <div className="reel-bar glass" role="group" aria-label="Showreel controls">
            <button type="button" className="reel-btn" aria-label={toggleLabel} onClick={state === "ended" ? play : toggle}>
              <ToggleIcon size={20} fill={state === "ended" ? "none" : "currentColor"} strokeWidth={state === "ended" ? 2 : 0} aria-hidden="true" />
            </button>
            <span ref={now} className="reel-time mono" aria-hidden="true">0:00</span>
            <input
              ref={range}
              className="reel-range"
              type="range"
              min={0}
              max={DURATION}
              step={0.01}
              defaultValue={0}
              aria-label="Seek"
              aria-valuetext={`0:00 of ${fmt(DURATION)}`}
              onPointerDown={onScrubStart}
              onPointerUp={onScrubEnd}
              onPointerCancel={onScrubEnd}
              onInput={(e) => onScrub(e.currentTarget.value)}
              onKeyDown={onRangeKey}
            />
            <span ref={total} className="reel-time mono" aria-hidden="true">{fmt(DURATION)}</span>
          </div>
        )}
      </div>
      <figcaption className="reel-cap mono muted">Showreel &middot; 0:17 &middot; silent &middot; Streefi, Untold, QR referral platform</figcaption>
      <p id="showreel-desc" className="sr-only">
        Silent 17-second reel. The Triviq hero system collapses into the idea, design, build, ship rail; then three projects each
        appear with their stack: Streefi, Untold and a QR referral platform. It ends on a Start a project prompt.
      </p>
      <noscript>
        <a className="link" href="/media/showreel.mp4">Watch the showreel (MP4, 1.2 MB)</a>
      </noscript>
    </figure>
  );
}
