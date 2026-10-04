import { products, work } from "@/lib/site";

type Item = { title: string; body: string; href?: string };

function Showcase({ id, tone, heading, lead, items, empty }: { id: string; tone: string; heading: string; lead: string; items: Item[]; empty: string }) {
  return (
    <section id={id} className={`tile ${tone}`}>
      <div className="wrap">
        <div className="text-center">
          <h2 className="t-display">{heading}</h2>
          <p className="t-lead mx-auto mt-3 max-w-2xl muted">{lead}</p>
        </div>
        {items.length ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <article key={it.title} className="card">
                <h3 className="t-strong">{it.title}</h3>
                <p className="mt-1 muted">{it.body}</p>
                {it.href && <a href={it.href} className="link mt-3 inline-block">Learn more &rsaquo;</a>}
              </article>
            ))}
          </div>
        ) : (
          <p className="card mx-auto mt-12 max-w-xl text-center muted">{empty}</p>
        )}
      </div>
    </section>
  );
}

export function WorkSection() {
  return <Showcase id="work" tone="tile-light" heading="Selected work." lead="Real projects, written up properly." items={work} empty="Case studies are on the way. Tell us about your project and we will share relevant examples." />;
}

export function ProductsSection() {
  return <Showcase id="products" tone="tile-parchment" heading="Products by Triviq." lead="Software we build and run ourselves." items={products} empty="Our first products are in development. Follow along or get in touch." />;
}
