import Link from "next/link";

import { ContactForm } from "@/components/sections/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { siteConfig } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(siteConfig, { title: "Contact", description: "Tell Triviq about your project. We reply within one business day.", path: "/contact" });

export default function Contact() {
  return (
    <>
      <PageHero title="Tell us what you want to build." lead="We reply within one business day, wherever you are." />
      <section className="tile tile-surface pt-0">
        <div className="wrap grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <ContactForm />
          <aside className="grid content-start gap-5">
            <div className="card">
              <h2 className="t-tagline">Email</h2>
              <p className="mt-2"><a className="link" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
            </div>
            <div className="card">
              <h2 className="t-tagline">Working with us</h2>
              <p className="mt-2 muted">Clients in India and abroad. We schedule calls around your time zone and can invoice in INR or USD.</p>
            </div>
            <div className="card">
              <h2 className="t-tagline">Existing client?</h2>
              <p className="mt-2 muted">See <Link className="link" href="/support">Help &amp; Support</Link>.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
