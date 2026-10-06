import { Breadcrumbs } from "./breadcrumbs";

export function PageHero({ title, lead, crumbs }: { title: string; lead?: string; crumbs?: { name: string; href?: string }[] }) {
  return (
    <section className="tile tile-surface pb-12 text-center">
      <div className="wrap">
        {crumbs && (
          <div className="mb-6 flex justify-center">
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        <h1 className="t-hero mx-auto max-w-3xl">{title}</h1>
        {lead && <p className="t-lead mx-auto mt-4 max-w-2xl muted">{lead}</p>}
      </div>
    </section>
  );
}
