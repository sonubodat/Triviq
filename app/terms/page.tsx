import type { Metadata } from "next";

import { LegalPage } from "@/components/sections/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Terms & Conditions", description: "Terms for using the Triviq website and how project engagements are governed." };

export default function Terms() {
  const { entity, jurisdiction } = siteConfig.legal;
  return (
    <LegalPage title="Terms & Conditions">
      <p>These terms cover your use of this website. By using it you agree to them.</p>

      <h2>About this website</h2>
      <p>The website describes the services and products of {entity || siteConfig.companyName} (&ldquo;Triviq&rdquo;). Information here is general and is not a quote or an offer to contract.</p>

      <h2>Project engagements</h2>
      <p>Any project is governed by a written proposal, statement of work or agreement signed by both parties. That document controls scope, milestones, fees and payment schedule, revisions, intellectual property and source-code delivery, third-party licences and maintenance. If it conflicts with these terms, it prevails.</p>

      <h2>Inquiries</h2>
      <p>Sending an inquiry does not create a contract or a duty of confidentiality. Please do not send sensitive or confidential material until we have agreed terms.</p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not attempt to disrupt, probe or gain unauthorised access to the site.</li>
        <li>Do not submit unlawful, misleading or malicious content.</li>
        <li>Do not use automated means to submit the contact form.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>The Triviq name, logo, site design and content belong to Triviq unless stated otherwise. You may not reuse them without permission.</p>

      <h2>Disclaimer and liability</h2>
      <p>The website is provided &ldquo;as is&rdquo;. To the extent permitted by law, Triviq is not liable for losses arising from your use of the website.</p>

      <h2>Third-party links</h2>
      <p>We are not responsible for the content or practices of other websites we may link to.</p>

      {jurisdiction && (
        <>
          <h2>Governing law</h2>
          <p>These terms are governed by the laws of {jurisdiction}.</p>
        </>
      )}

      <h2>Changes</h2>
      <p>We may update these terms and will change the date above when we do.</p>

      <h2>Contact</h2>
      <p><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
    </LegalPage>
  );
}
