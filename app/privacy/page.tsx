import { LegalPage } from "@/components/sections/legal-page";
import { siteConfig } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(siteConfig, { title: "Privacy Policy", description: "How Triviq collects, uses and protects information submitted through this website.", path: "/privacy" });

export default function Privacy() {
  const { entity } = siteConfig.legal;
  const analytics = Boolean(siteConfig.analytics.plausibleDomain); // the wording below follows what the site actually loads
  return (
    <LegalPage title="Privacy Policy">
      <p>This policy explains what information {entity || siteConfig.companyName} (&ldquo;Triviq&rdquo;) collects through {siteConfig.url.replace("https://", "")} and how we use it.</p>

      <h2>Information we collect</h2>
      <p>We collect only what you send us through the contact form: your name, work email, company, the service you are interested in, your project type, budget range, timeline and project details. If you email us directly, we receive your email address and what you write.</p>

      <h2>How we use it</h2>
      <ul>
        <li>To reply to your inquiry and prepare proposals.</li>
        <li>To manage our relationship with you if we work together.</li>
        <li>To protect the site against spam and abuse.</li>
      </ul>
      <p>We do not sell your information.</p>

      <h2>Service providers</h2>
      <p>Inquiries may be delivered to us through an email delivery provider and stored in our own systems. If you send an inquiry we may also email you a confirmation at the address you gave us. {analytics && "Our analytics provider, Plausible, receives the anonymous usage events described below. "}These providers process information only on our behalf.</p>

      <h2>Cookies and analytics</h2>
      {analytics ? (
        <p>This website does not set advertising cookies. We measure how it is used with Plausible Analytics, which does not use cookies and does not build profiles of individual visitors. It counts things like pages viewed, which buttons are clicked, whether the showreel is played and whether the contact form is submitted, together with the service, budget range and timeline chosen in the form. It never receives your name, email address or message. We do not load it if your browser sends a Do Not Track signal.</p>
      ) : (
        <p>This website does not currently set advertising or analytics cookies. If that changes, we will update this policy.</p>
      )}

      <h2>Retention</h2>
      <p>We keep inquiries for as long as needed to respond and for a reasonable period afterwards, then delete them. Project records are kept as long as required by our agreement with you and applicable law.</p>

      <h2>Your choices</h2>
      <p>You can ask us to access, correct or delete the information you sent us by emailing <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>

      <h2>Children</h2>
      <p>This website is not directed at children, and we do not knowingly collect their information.</p>

      <h2>Changes</h2>
      <p>We may update this policy and will change the date above when we do.</p>

      <h2>Contact</h2>
      <p>Questions about this policy: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
    </LegalPage>
  );
}
