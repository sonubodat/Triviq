// Event helper. Off unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set at build time; then it feeds Plausible (cookieless).
// Pass categories only: a service, a budget band, where a button sits. Never names, emails or message text.
import { siteConfig } from "@/lib/site";

type Props = Record<string, string | number | boolean>;
type PlausibleFn = ((event: string, options?: { props: Props }) => void) & { q?: unknown[] };

export const analyticsOn = Boolean(siteConfig.analytics.plausibleDomain);
export const doNotTrack = () => typeof navigator !== "undefined" && navigator.doNotTrack === "1";

export function track(event: string, props?: Props) {
  if (typeof window === "undefined" || doNotTrack()) return;
  if (!analyticsOn) {
    if (process.env.NODE_ENV !== "production") console.debug("[track]", event, props ?? {}); // visible while developing
    return;
  }
  const w = window as unknown as { plausible?: PlausibleFn };
  // Same queue shape as Plausible's own snippet, so events fired before its script loads are replayed once it does.
  w.plausible ||= function (...args: unknown[]) {
    (w.plausible!.q ||= []).push(args);
  } as PlausibleFn;
  w.plausible(event, props ? { props } : undefined);
}
