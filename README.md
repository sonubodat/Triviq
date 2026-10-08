# Triviq website

Next.js 16 (App Router) + Tailwind v4. Design system: Apple-inspired structure (`DESIGN.md`) with Triviq's logo blue as the accent.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint && pnpm exec tsc --noEmit && pnpm build
node --test components/hero/hero.test.mjs lib/leads.test.mjs lib/seo.test.mjs
```

## Where things live
- `lib/site.ts`: name, URL, contact emails, nav, footer, budgets, legal entity/jurisdiction.
- `lib/content.ts`: services (plus long-form `serviceDetails`), work, products (plus each project's `scope`), process, engagement copy. Edit here; the home sections, `/services/*`, `/work/*`, the footer and the sitemap all render from it.
- `lib/seo.ts`: `pageMeta()` (per-page title, canonical and share-card tags) and the JSON-LD builders.
- `components/sections/`: home-page sections. `components/hero/`: hero visual. The static SVG is the SSR/phone/reduced-motion visual (CSS hides it where the WebGL scene will mount); the scene lazy-loads on capable tablet/desktop browsers.
- Hero exit (desktop, motion allowed, WebGL live only): the first half-viewport of scroll scrubs `collapse` 0..1. `phases()` in `components/hero/system-graph.ts` defines the order (nodes gather, core recedes, spokes and labels fade, nodes align on a line); `hero-visual.tsx` adds the `IDEA / DESIGN / BUILD / SHIP` rail under that line. No pin. Phones, tablets and reduced motion get none of it.
- `components/three/createTriviqCore.ts` + `design/triviq-core/`: procedural T-core (img2threejs spec, notes in `PATCHES.md`).
- `app/globals.css`: tokens (`:root`) and component classes (`@layer components`, so Tailwind utilities override them).
- `public/work/`: case-study screenshots (WebP, ~540px wide).

## Pages
`/` home, `/services` and `/services/[slug]` (six services), `/work/[slug]` (Streefi, the anonymised QR platform, Untold), `/about`, `/contact`, `/support`, `/privacy`, `/terms`. The dynamic routes use `generateStaticParams` with `dynamicParams = false`, so every page is prerendered and an unknown slug is a 404.

To add a service or project, add it to `lib/content.ts` (a service also needs an entry in `serviceDetails`; a project needs `scope` and `services`). The page, the home card, the footer link and the sitemap entry follow; nothing else lists them. Case studies deliberately have no "Result" section until there are real numbers to show, and the QR project stays unnamed until written permission exists.

Unknown URLs get the branded 404 in `app/not-found.tsx` (`noindex`). `robots.txt` disallows `/api/`.

Every inner page must use `pageMeta()`. Next merges metadata shallowly, so a page that sets its own `openGraph` replaces the root layout's, and without the helper share cards showed the home title and `og:url` and dropped the image. JSON-LD: `BreadcrumbList` everywhere, `Service` on service pages, `WebPage` on case studies.

## Service cards
`components/sections/service-card.tsx` (home grid and `/services`) and `service-diagrams.tsx`. One card is one link: a white dot-grid panel holding the diagram, then title, description and the stack as chips. The six diagrams share one drawing system (240 x 114 canvas, nodes on one row, labels on one baseline, every arrow pointing right): slate structure (`.ln`), one blue core node (`.ac`), sky dashed data flow (`.flow`), cyan pulse. Add a diagram by adding an entry to `DIAGRAMS`; do not draw a new style.

States: hover lifts the card 2 px, turns the border blue and marches the dashes; press scales to 0.985; keyboard focus gets the global ring and the same marching dashes; the arrow circle fills blue on hover and focus. Motion: lines draw in once when the grid scrolls into view (GSAP, inline styles cleared afterwards), and one cyan pulse per link travels the connectors, one card at a time (SMIL, each animation only active for its own 0.45 s slot; keep it that way, spanning the whole cycle with `keyTimes` made every pulse run on every frame). Reduced motion gets the finished static drawing with no pulses.

## Accessibility rules that must keep holding
An axe-core 4.13 scan of all 16 pages (desktop and mobile) reported no violations; these are the rules behind that, so a later change does not quietly undo it.
- Links inside running text are underlined (`.link`, `.prose-legal a`); colour alone is not a cue.
- Text is never dimmed with `opacity` below AA contrast. The process story dims only the step headings, to 0.65 (ink on white stays above 4.5:1); body copy and numbers keep full contrast.
- `.cs-dark` carries its own text colours because service pages place it inside a light tile.
- Form control outlines use `--triviq-field` (3.2:1 on white); `--triviq-border` is for cards only.
- Touch targets: 44 px on coarse pointers (footer links, chips, FAQ rows, header hit areas), never below 24 px anywhere.
- Infinite animations must have a `prefers-reduced-motion` off switch in `globals.css`.

## Security
`next.config.ts` sends `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy` and `Permissions-Policy` on every response and drops `X-Powered-By`. There is no Content-Security-Policy yet (Next's inline bootstrap scripts need per-request nonces) and no HSTS (set it where TLS ends, on the host). `pnpm audit --prod` is part of `LAUNCH.md`.

## Performance
Targets: LCP < 2.0 s, CLS < 0.05, INP < 150 ms. Lighthouse is not installed here, so these are lab numbers from the Performance APIs (LCP, layout-shift sessions, long tasks, Event Timing) in headless Chrome with the Lighthouse mobile preset (4x CPU slowdown, 1.6 Mbps, 150 ms RTT), median of three cold-cache runs, production build. Measure with plain software compositing (`--disable-gpu`): the SwiftShader GPU start-up that WebGL needs adds about 2 s to first paint and made every early number look 3x worse than it is.

Mistakes already found and fixed, so they are not repeated:
- `useSearchParams()` in a client component makes React render its whole Suspense boundary on the client only. The contact form was missing from the server HTML and popped in after hydration (CLS 0.53 on phones). Keep the form in the server HTML and put only the tiny `ServicePreset` reader inside the boundary.
- Side-by-side buttons that only fit with the final font re-wrap when the font swaps in (56 px shift on the hero). Stack on small screens instead of relying on `flex-wrap`.
- A hero image that is the largest element above the fold must be eager: `loading="eager"` plus `fetchPriority="high"` on the first one (Next 16 deprecated `priority`). Case-study LCP on phones went from about 2.1 s to 0.9 s.
- `/media/*` and `/assets/*` are served with `max-age=86400, stale-while-revalidate=604800` (`next.config.ts`); the files are not content-hashed, so they cannot be cached forever.

## Showreel
Currently switched off: the import and the `<Showreel />` block in `components/sections/work.tsx` are commented out (see the note there to bring it back). Everything below still applies to it.

`public/media/showreel.mp4` (1.2 MB), `showreel.webm` (1.4 MB) and `showreel-poster.webp` (34 KB) are a silent 17 s, 1280x720 reel rendered with HyperFrames from `media/showreel/`. The player is `components/sections/showreel.tsx` at the top of the Work section: no autoplay and `preload="none"`, so a visitor only downloads the poster until they press play. Budget: each video file stays at or under 2 MB.

The reel is one composition, `media/showreel/index.html`; its copy is lifted from `lib/content.ts`, its images are the real app screenshots plus 11 transparent stills of the live WebGL hero. To change it, edit the file, then from `media/showreel/`:

```bash
hyperframes check                 # 0 errors expected; 5 "nested_structure_needs_subcomposition" warnings are accepted (single file by design)
hyperframes snapshot --at 1.8,5.0,7.6,11,14.2,16.6
hyperframes render --output renders/showreel-master.mp4 --fps 30 --quality looks --workers 1
```

```bash
ffmpeg -y -i renders/showreel-master.mp4 -an -c:v libx264 -preset slower -crf 23 -profile:v high -pix_fmt yuv420p -movflags +faststart ../../public/media/showreel.mp4
ffmpeg -y -i renders/showreel-master.mp4 -an -c:v libvpx-vp9 -crf 31 -b:v 0 -row-mt 1 -deadline good -cpu-used 1 -pix_fmt yuv420p ../../public/media/showreel.webm
ffmpeg -y -ss 2.0 -i renders/showreel-master.mp4 -frames:v 1 renders/poster.png && cwebp -q 84 -m 6 renders/poster.png -o ../../public/media/showreel-poster.webp
```

If the length changes, update `DURATION` and the caption in the player. If the hero changes, run `pnpm dev` and `node media/showreel/tools/capture-hero.mjs` to refresh the stills (needs Chrome and `cwebp`). HyperFrames sends anonymous usage telemetry by default; `hyperframes telemetry disable` turns it off. Untold's own marketing reels are deliberately not used: they end on App Store / Google Play badges while Untold is pre-launch.

## Content rules
- No metrics, ROI or client names without permission. The anonymised project in `work` stays unnamed until written permission exists.
- No content element may rely on `opacity: 0` / `visibility: hidden` to be readable (full-page screenshots and crawlers do not scroll).

## Contact form (launch-blocking setup)
The form asks for the details that decide whether and how to reply: service, budget (USD first, INR in brackets), timeline and an optional project type. Option lists live in `lib/site.ts`; the form and the API both read them, so they cannot drift. Validation and both emails are pure functions in `lib/leads.ts` (`node --test lib/leads.test.mjs`).

`POST /api/contact` applies a honeypot, a size cap, a rate limit (5 per minute per IP) and field checks, then:
- **dev:** appends to `data/inquiries.jsonl` (git-ignored).
- **production:** emails the team via Resend. The subject carries budget and timeline, for example `[$6k–25k · 1–3 months] New inquiry: Web & Platforms (Jane Doe, Acme)`. Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (comma-separate several), `CONTACT_FROM_EMAIL` (verified domain), see `.env.example`. If they are missing the route returns 503 and logs the inquiry to stdout so it is not silently lost; if Resend fails it returns 502.
- **confirmation email (opt-in):** `CONTACT_AUTOREPLY=1` plus a verified `CONTACT_FROM_EMAIL` sends the sender a short confirmation. It repeats only their dropdown choices, never their free text, and a failure there is logged but never shown as an error because the lead is already delivered. The success screen mentions the confirmation only when one was sent.
- `RESEND_API_URL` points the route at a mock Resend server for tests; leave it unset in real use.

## Analytics
Off by default: no script, no cookies, and the privacy page says so. Setting `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` at build time turns on cookieless Plausible (`NEXT_PUBLIC_PLAUSIBLE_SRC` for a self-hosted or proxied script), and the privacy page text switches with it. The script is never requested when the browser sends Do Not Track.

`track(event, props)` in `lib/analytics.ts` takes categories only, never names, emails or message text. `components/analytics.tsx` (mounted once in the root layout) turns clicks on any link to `/contact` (`cta_click`, with the section it sits in) and case-study details opening (`project_details_open`) into events; the form and player send `lead_start`, `lead_submit`, `lead_error`, `showreel_play` and `showreel_complete`. While developing without a provider, events print to the console as `[track]`. Add another provider by extending `track()`; one that sets cookies also needs a consent banner and a privacy policy change.

## Before launch
Work through `LAUNCH.md`: it lists what only you can supply, the dependency advisory to clear, deploy settings and the checks to run on the live URL. In short: use a domain mailbox instead of the shared Gmail address in `lib/site.ts` once you have one, set the production domain in `siteConfig.url`, fill `legal.entity` and `legal.jurisdiction`, have the privacy policy and terms reviewed, and confirm Untold's real status before labelling it beyond "In development". Read the six service pages in `serviceDetails` (`lib/content.ts`) once: that copy is new, built only from facts already on the site, and should still be checked against what you will actually promise. Decide on analytics (enable Plausible or leave it off) and on the confirmation email, then send one real test inquiry through the deployed form.
