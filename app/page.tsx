import { CapabilityCarousel } from "@/components/sections/carousel";
import { ContactUs } from "@/components/sections/contact-us";
import { HelpSection } from "@/components/sections/help";
import { Hero } from "@/components/sections/hero";
import { ProcessSection } from "@/components/sections/process";
import { ProjectsSection } from "@/components/sections/projects";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <HelpSection />
        <CapabilityCarousel />
        <ProjectsSection />
        <ProcessSection />
        <ContactUs />
      </main>
      <SiteFooter />
    </>
  );
}
