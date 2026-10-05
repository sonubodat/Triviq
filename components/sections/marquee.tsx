import { capabilities } from "@/lib/content";

export function Marquee() {
  const row = (dup: boolean) => (
    <ul className={`flex shrink-0 items-center gap-10 pr-10 ${dup ? "marquee-dup" : ""}`} aria-hidden={dup || undefined}>
      {capabilities.map((c) => (
        <li key={c} className="mono whitespace-nowrap">{c}</li>
      ))}
    </ul>
  );
  return (
    <section className="marquee py-5" aria-label="Capabilities">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
