const capabilities = [
  "Next.js",
  "React",
  "Node.js",
  "APIs",
  "Databases",
  "Cloud deploys",
  "SEO",
  "Analytics",
  "Automation",
  "Mobile apps",
];

export function CapabilityCarousel() {
  return (
    <section className="overflow-hidden border-b border-border py-10" aria-label="Capabilities">
      <div className="flex w-max animate-marquee gap-3 px-3">
        {[...capabilities, ...capabilities].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex h-12 items-center rounded-md border border-border px-5 text-sm font-semibold text-muted"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
