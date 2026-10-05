import type { Metadata } from "next";

import { ProjectCta } from "@/components/sections/cta";
import { EngagementSection } from "@/components/sections/engagement";
import { Hero } from "@/components/sections/hero";
import { ProductsSection } from "@/components/sections/labs";
import { Marquee } from "@/components/sections/marquee";
import { ProcessSection } from "@/components/sections/process";
import { ServicesSection } from "@/components/sections/services";
import { StudioSection } from "@/components/sections/studio";
import { WorkSection } from "@/components/sections/work";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <ServicesSection />
      <WorkSection />
      <ProductsSection />
      <ProcessSection />
      <StudioSection />
      <EngagementSection />
      <ProjectCta />
    </>
  );
}
