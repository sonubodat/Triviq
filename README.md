# Triviq website

Next.js 16 (App Router) + Tailwind v4. Design system: Apple-inspired structure (`DESIGN.md`) with Triviq's logo blue as the accent.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint && pnpm exec tsc --noEmit && pnpm build
node --test components/hero/hero.test.mjs
```

## Where things live
- `lib/site.ts`: name, URL, contact emails, nav, footer, budgets, legal entity/jurisdiction.
- `lib/content.ts`: services, work, products, process, engagement copy. Edit here; sections render from it.
- `components/sections/`: home-page sections. `components/hero/`: hero visual (static SVG first; WebGL scene lazy-loaded on capable tablet/desktop browsers).
- `components/three/createTriviqCore.ts` + `design/triviq-core/`: procedural T-core (img2threejs spec, notes in `PATCHES.md`).
- `app/globals.css`: tokens (`:root`) and component classes (`@layer components`, so Tailwind utilities override them).
- `public/work/`: case-study screenshots (WebP, ~540px wide).

## Content rules
- No metrics, ROI or client names without permission. The anonymised project in `work` stays unnamed until written permission exists.
- No content element may rely on `opacity: 0` / `visibility: hidden` to be readable (full-page screenshots and crawlers do not scroll).

## Contact form (launch-blocking setup)
`POST /api/contact` validates (honeypot, rate limit, field checks), then:
- **dev:** appends to `data/inquiries.jsonl` (git-ignored).
- **production:** emails via Resend. Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (verified domain), see `.env.example`. If they are missing the route returns 503 and logs the inquiry to stdout so it is not silently lost.

## Before launch
Replace `hello@` / `support@triviq.com`, set the production domain in `siteConfig.url`, fill `legal.entity` and `legal.jurisdiction`, have the privacy policy and terms reviewed, and confirm Untold's real status before labelling it beyond "In development".
