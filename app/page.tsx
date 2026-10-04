import { ProjectCta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { ProcessSection } from "@/components/sections/process";
import { ServicesSection } from "@/components/sections/services";
import { ProductsSection, WorkSection } from "@/components/sections/showcase";
import { WhySection } from "@/components/sections/why";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <WorkSection />
      <ProductsSection />
      <ProcessSection />
      <WhySection />
      <ProjectCta />
    </>
  );
}
