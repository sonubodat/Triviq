# Launch checklist

Written after the final QA pass on 2026-10-07, against the production build (`pnpm build && pnpm start`). Tick items as you go. Sections 1 and 2 stop a launch; the rest make it safe and findable.

## 1. Only you can supply these
- [ ] **Real inboxes.** `hello@triviq.com` and `support@triviq.com` in `lib/site.ts` are placeholders (they print in the footer, the CTA band, and the contact, support, privacy and terms pages). `public/.well-known/security.txt` has a third one, `security@triviq.com`, and no `Expires:` line, which RFC 9116 requires: add one at most a year ahead and renew it yearly. After replacing, run `grep -rn "triviq.com" app lib public components` to catch strays.
- [ ] **Production domain.** `siteConfig.url` in `lib/site.ts` (now `https://triviq.com`) drives canonicals, `og:url`, the sitemap, the robots host and the JSON-LD. `public/llms.txt`, `public/feed.xml`, `public/rss.xml` and `security.txt` hard-code the domain, so change them too if it differs.
- [ ] **Email delivery.** A Resend account, a verified sending domain with SPF, DKIM and DMARC, then set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` on the host (see `.env.example`). Without them the form answers 503 and the lead only goes to the server log.
- [ ] **Legal.** Fill `legal.entity` and `legal.jurisdiction` in `lib/site.ts` (the clauses render only when they are set), have `/privacy` and `/terms` reviewed by someone qualified, and update `lastUpdated`. If you turn analytics on, the Plausible wording needs that review too.
- [ ] **Permissions.** Confirm you may name Streefi and show its home screenshot (customer names are not shown). The QR platform stays anonymous until written permission exists. Untold stays "In development": no launch claim and no store links until it ships.

## 2. Dependency advisory: clear before deploying
`pnpm audit --prod` on 2026-10-07 reports three advisories, all through `next@16.3.5`:
- **critical**: Next.js remote code execution in `next/og` `ImageResponse` (GHSA-vcvr-r3jv-pc5j), fixed in 16.3.6. This site does not import `next/og`; the share cards are static PNGs (`app/opengraph-image.png`, `app/twitter-image.png`), so the path is not reachable here. Hosts and scanners will still flag the version.
- **high**: `sharp` < 0.35.5 (librsvg) and `source-map-js` < 1.2.2. Both are Next's own dependencies. `sharp` only resizes raster images here and `source-map-js` runs at build time.
- [ ] Fix: `pnpm up next@16.3.6`, rebuild, re-run the gates (section 8) and `pnpm audit --prod`. If `sharp` or `source-map-js` still show, add `pnpm.overrides`. This was not done in the QA pass: it downloads packages and the dev server on :3000 is running.

## 3. Deploy configuration
- [ ] A Node host for Next 16 (Vercel, or `pnpm build && pnpm start` behind a proxy). `/api/contact` needs the Node runtime.
- [ ] Environment variables from `.env.example`. `NEXT_PUBLIC_*` are read at **build time**, so set them before the build, not after.
- [ ] HTTPS everywhere, with HSTS set at the host (`max-age=31536000`; add `includeSubDomains` only when every subdomain is HTTPS). Redirect `http` to `https` and `www` to the canonical host.
- [ ] Caching. Pages are prerendered with `Cache-Control: s-maxage=31536000` (Next's static default; hosts such as Vercel purge it on deploy). With any other CDN in front, purge on every deploy or visitors keep old HTML. `/media` and `/assets` are cached for a day.
- [ ] Rate limit. `/api/contact` allows 5 requests a minute per IP, counted in memory per server instance. On serverless or several instances, move the counter to KV or Upstash. It reads `x-forwarded-for`, so confirm your host overwrites that header and clients cannot set it.
- Expect `Error: Internal: NoFallbackError` lines in the server log when anyone requests an unknown `/services/x` or `/work/x`. Next 16.3.5 logs it even though the response is a correct, branded 404. Re-check after the upgrade in section 2 before wiring log alerts.
- Expect one browser console warning on desktop with WebGL: `THREE.Clock: This module has been deprecated`. It is raised inside `@react-three/fiber` 9.8.1 with `three` 0.186, not in this code; it is harmless and goes away when React Three Fiber moves to `THREE.Timer`.

## 4. Content decisions
- [ ] Read the six service pages once (`serviceDetails` in `lib/content.ts`). The copy is new, built only from facts already on the site, with no metrics, names or prices; check it against what you will actually promise.
- [ ] The "Product 02 / Coming soon" card in the Products section (`lib/content.ts`, `components/sections/labs.tsx`): keep it or remove it. It is the only placeholder text left on the site.
- [ ] The showreel is switched off (see the comment in `components/sections/work.tsx`). `public/media/showreel.mp4`, `.webm` and the poster (2.6 MB) still ship and answer by URL. Delete them if the reel is not coming back.
- [ ] Stray files nothing links to: `public/ads.txt`, `public/app-ads.txt` (comment-only stubs), `public/feed.xml`, `public/rss.xml` (valid feeds with no items), `public/Triviq_logo.png` (an unused older copy of the logo), and `my-video/` in the project root (an untouched HyperFrames starter scaffold from 2026-10-05, already committed; nothing uses it). Delete or fill them.

## 5. Your two on/off decisions (both ship off)
- **Analytics.** Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` at build time to enable cookieless Plausible; the privacy page text switches with it and Do Not Track is honoured. In Plausible, register the goals `cta_click`, `lead_start`, `lead_submit`, `lead_error`, `project_details_open` and the property keys `location`, `label`, `service`, `budget`, `timeline`, `projectType`, `project`, or the dashboard will not show them. Leaving analytics off is fine.
- **Confirmation email.** `CONTACT_AUTOREPLY=1` plus a verified `CONTACT_FROM_EMAIL`. It repeats only the sender's dropdown choices, never their free text.

## 6. After the first deploy, on the live URL
- [ ] Send one real inquiry through the form. Check it reaches every address in `CONTACT_TO_EMAIL` (and not spam), that the reply-to is the sender, and, if enabled, that the confirmation arrives.
- [ ] `curl -sI https://<domain>/` shows `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and no `x-powered-by`. `/robots.txt` disallows `/api/` and lists the sitemap; `/sitemap.xml` has 16 URLs.
- [ ] Share cards: paste `/`, one service page and one case study into the LinkedIn Post Inspector and the Facebook Sharing Debugger.
- [ ] Google's Rich Results Test on one `/services/<slug>` (Service and BreadcrumbList) and one `/work/<slug>`.
- [ ] Search Console and Bing Webmaster Tools: verify the domain, submit `/sitemap.xml`, request indexing for `/`.
- [ ] Lighthouse (Chrome DevTools, mobile) on `/`, `/services`, `/contact`. The numbers in section 8 are lab estimates from the Performance APIs because Lighthouse is not installed here. Targets: LCP under 2.0 s, CLS under 0.05, INP under 150 ms.
- [ ] Real devices: an iPhone in Safari and an Android phone in Chrome. QA ran in Chromium only. Safari is the least covered for the details panels (`::details-content`, `interpolate-size`), the SVG pulses and the form fields.
- [ ] A VoiceOver pass over the home page, one service page and the contact form, including a validation error and the success screen. Automated scans cannot judge reading order or wording.
- [ ] An uptime monitor on `/`, and email alerts on Resend failures. The site loads no third-party script, so it has no error tracker; add one if you want it.

## 7. Skipped on purpose (add when the trigger fires)
| Skipped | Add when |
|---|---|
| Content-Security-Policy | A security review asks for it. Next's inline bootstrap scripts need per-request nonces. |
| Shared rate limit | The site runs on serverless or more than one instance. |
| CRM or Slack hook, lead scoring, calendar booking | Inbound passes roughly 20 leads a week. |
| Cookie banner | A cookie-setting analytics or ad provider is added. |
| Case-study "Result" sections | Real numbers exist and the client agrees to publish them. |
| Per-page error boundary (`error.tsx`) | A client-side exception shows up in monitoring. |

## 8. QA record (2026-10-07, production build, Chromium)
Re-run the gates after every change: `pnpm exec tsc --noEmit && pnpm lint && node --test components/hero/hero.test.mjs lib/leads.test.mjs lib/seo.test.mjs && pnpm build`.

| Check | Result |
|---|---|
| TypeScript, ESLint, 13 node tests, build (27 static pages) | clean |
| Crawl audit: titles, descriptions, canonicals, share tags, JSON-LD, headings, alt text, sitemap parity, 404s | 299 of 299 |
| User flows: service and case-study links, CTA presets, breadcrumbs, footer, Untold wording, QR anonymity | 15 of 15 |
| Contact API: validation, honeypot, 413, 429, Resend failure paths, HTML escaping (mock Resend) | 29 of 29 |
| Analytics (separate build against a local Plausible stub): no cookies, Do Not Track, categories only | 14 of 14 |
| axe-core 4.13 (WCAG 2.0 to 2.2 A and AA plus best practice), 16 pages at 1440 and 390 px, home with WebGL | 0 violations |
| Keyboard: Tab through every page (46 to 78 stops each) | no traps, visible focus everywhere, nothing hidden under the sticky header |
| Reflow at 320 px, reduced motion, JavaScript disabled | no sideways scroll; no infinite animation; every page readable |
| Console and network, every page, both sizes | no errors, no failed requests, no request to any other origin |
| Touch targets | none under 24 px; 44 px on touch for footer links, chips, FAQ rows and header hit areas |

Performance (lab estimates, mobile preset: 4x CPU, 1.6 Mbps, 150 ms RTT, median of three cold runs, machine idle):

| Page | FCP / LCP | CLS | TBT | INP |
|---|---|---|---|---|
| `/` | 740 ms | 0.0001 | 47 ms | 80 ms |
| `/services` | 740 ms | 0.0004 | 41 ms | 40 ms |
| `/contact` | 716 ms | 0.0004 | 44 ms | 40 ms |
| `/work/streefi` | 788 / 976 ms | 0.0001 | 41 ms | 40 ms |

Desktop: LCP at most 100 ms, CLS 0, TBT 0, INP at most 48 ms. Mobile transfer is 478 to 530 KB with 240 KB of JavaScript. Measure on an idle machine: a first run taken while macOS was at load average 150 read three times worse.

Found and fixed during QA: dark case-study cards on the Mobile Apps and SaaS service pages showed near-invisible text; process steps dimmed to 1.7:1 contrast; links in running text had no underline; form outlines were 1.2:1; case-study labels and QR diagram labels were 3.9:1 on black; FAQ rows, chips and footer links were too small to tap; the hero diagram's dashed flow lines kept moving under reduced motion; GSAP warned about an empty target list; the SVG pulses cost about 10% of a throttled phone's main thread and now cost about 3%; the closed mobile menu pointed `aria-controls` at a missing element. Added: branded 404, security headers, `robots.txt` disallow for `/api/`.

Not verified here: Safari and Firefox, real phones, a screen reader, an official Lighthouse run, email deliverability. They are in section 6.
