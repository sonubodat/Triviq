export function PageHero({ title, lead }: { title: string; lead?: string }) {
  return (
    <section className="tile tile-surface pb-12 text-center">
      <div className="wrap">
        <h1 className="t-hero mx-auto max-w-3xl">{title}</h1>
        {lead && <p className="t-lead mx-auto mt-4 max-w-2xl muted">{lead}</p>}
      </div>
    </section>
  );
}
