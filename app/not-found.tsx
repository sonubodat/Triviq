import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="tile tile-surface text-center">
      <div className="wrap">
        <p className="mono accent">Error 404</p>
        <h1 className="t-hero mx-auto mt-4 max-w-3xl">This page does not exist.</h1>
        <p className="t-lead mx-auto mt-4 max-w-2xl muted">The link may be old or mistyped. Start from the home page, or see what we build.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/services" className="btn btn-ghost">Our services</Link>
        </div>
      </div>
    </section>
  );
}
