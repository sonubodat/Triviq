// Client-only GSAP setup: import from client components only. DrawSVG/SplitText are not used (ponytail).
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
export function registerGsap() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  registered = true;
}

export { gsap, ScrollTrigger, useGSAP };
