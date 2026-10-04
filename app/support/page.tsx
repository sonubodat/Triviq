import Link from "next/link";
import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Help & Support", description: "Answers to common questions about working with Triviq, and how to get support." };

const faqs = [
  ["How does a project start?", "Send an inquiry with your goals and budget range. We reply within one business day, usually with questions or a short call, and then send a written proposal."],
  ["How long does a project take?", "It depends on scope. A focused website can take a few weeks; a SaaS product or mobile app takes longer. Your proposal states milestones and dates."],
  ["Which currencies and payment methods do you accept?", "We work with clients in India and internationally. Payment terms, currency and method are set out in your proposal."],
  ["Who owns the code and designs?", "Ownership, licences and source-code delivery are defined in your project agreement."],
  ["Do you offer support after launch?", "Yes. We can provide maintenance, monitoring and feature work after launch, agreed separately from the build."],
  ["I found a problem on my live product. What do I do?", `Email ${siteConfig.supportEmail} with a description, screenshots and the page or screen affected.`],
];

export default function Support() {
  return (
    <>
      <PageHero title="Help & Support." lead="Answers to common questions, and how to reach us." />
      <section className="tile tile-light pt-0">
        <div className="mx-auto max-w-[700px] px-6">
          {faqs.map(([q, a]) => (
            <details key={q} className="faq">
              <summary>{q}</summary>
              <p className="mt-3 muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="tile tile-parchment">
        <div className="wrap grid gap-5 md:grid-cols-2">
          <div className="card"><h2 className="t-tagline">Support</h2><p className="mt-2 muted">Existing clients and users: <a className="link" href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a></p></div>
          <div className="card"><h2 className="t-tagline">New project</h2><p className="mt-2 muted">Use the <Link className="link" href="/contact">contact form</Link> to start a conversation.</p></div>
        </div>
      </section>
    </>
  );
}
