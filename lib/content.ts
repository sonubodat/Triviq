// Single source of truth for home-page content. Facts only: no metrics, no invented results.

export const services = [
  { id: "web", title: "Web & Platforms", body: "High-performance websites, commerce and web platforms.", stack: "Next.js · React · Node.js" },
  { id: "mobile", title: "Mobile Apps", body: "Native-quality applications for iOS and Android.", stack: "Flutter · React Native" },
  { id: "saas", title: "SaaS Products", body: "Dashboards, subscriptions, APIs and automation for software products.", stack: "FastAPI · Postgres · Supabase" },
  { id: "ai", title: "AI & Automation", body: "AI integrations, intelligent workflows and API-driven automation.", stack: "Python · LLM APIs · Workflows" },
  { id: "business", title: "Business Software", body: "Internal tools, admin systems, portals and custom platforms.", stack: "React · Node.js · Prisma" },
  { id: "games", title: "Games & Interactive", body: "Games, prototypes and interactive digital experiences.", stack: "Godot · Three.js" },
] as const;

export type ServiceId = (typeof services)[number]["id"];

export const capabilities = [
  "Web development",
  "Mobile apps",
  "SaaS",
  "Product design",
  "AI automation",
  "Games",
  "Cloud systems",
  "API development",
];

export type Project = {
  slug: string;
  kind: "work" | "product";
  // ponytail: the client behind an anonymised project is deliberately not named; add it only with written permission
  name: string;
  descriptor: string;
  built: string;
  system: string;
  status?: string;
  media:
    | { type: "phones"; images: { src: string; width: number; height: number; alt: string }[] }
    | { type: "diagram"; id: "qr-flow" };
  details: { problem: string; approach: string; system: string };
};

export const work: Project[] = [
  {
    slug: "streefi",
    kind: "work",
    name: "Streefi",
    descriptor: "Street-food discovery and dine-in offers platform.",
    built: "Mobile apps · Vendor tools · Admin platform · Backend · Website",
    system: "React Native · Node.js · MongoDB · Next.js",
    media: {
      type: "phones",
      images: [
        { src: "/work/streefi-home.webp", width: 540, height: 1175, alt: "Streefi customer app home screen with nearby offers" },
        { src: "/work/streefi-eatout.webp", width: 540, height: 1175, alt: "Streefi customer app featured offers screen" },
      ],
    },
    details: {
      problem:
        "Help people discover nearby food businesses, see live offers and book or pay for dine-in visits, while giving vendors and admins tools to run offers, media, reviews and payouts.",
      approach:
        "One backend serving a customer app, a vendor app, an admin panel and a marketing site: location-aware search, dine-in slot booking, bill-pay verification, booking history, and admin control over businesses, offers, banners, reviews, analytics and app-version rollouts.",
      system:
        "Node.js and Express API on MongoDB with real-time sockets and scheduled jobs; React Native customer app for iOS and Android; Next.js website with a headless CMS.",
    },
  },
  {
    slug: "qr-referral-platform",
    kind: "work",
    name: "QR Referral & Lead-Attribution Platform",
    descriptor: "Vendor referral tracking for an energy business.",
    built: "Vendor portal · Sales portal · Admin console · Public enquiry flow · Backend",
    system: "React · Node.js · Prisma · Postgres",
    media: { type: "diagram", id: "qr-flow" },
    details: {
      problem:
        "Physical QR codes handed to vendors had to be traced to the right vendor and lead, with every scan and referral attributed correctly at the moment it happened.",
      approach:
        "A controlled QR inventory with assignment history, vendor self-registration with sales-assisted verification, a public enquiry form behind each QR link, scan and lead attribution, repeat-referral detection and admin-managed payout status.",
      system:
        "Four role-based experiences (public, vendor, sales, admin) over one API, with strict per-role data access.",
    },
  },
];

export const products: Project[] = [
  {
    slug: "untold",
    kind: "product",
    name: "Untold",
    descriptor: "Anonymous mental-health support.",
    built: "Mobile app · Backend · Billing · Auth",
    system: "Flutter · FastAPI · Supabase · RevenueCat",
    status: "In development",
    media: {
      type: "phones",
      images: [
        { src: "/work/untold-home.webp", width: 540, height: 1145, alt: "Untold app home screen with a daily mood check-in" },
        { src: "/work/untold-profile.webp", width: 540, height: 1145, alt: "Untold app profile screen" },
      ],
    },
    details: {
      problem: "People need a private place to check in, journal and find support without exposing who they are.",
      approach:
        "The app works fully signed-out; optional sign-in with Google or Apple adds backup and sync, and other users only ever see “Anonymous”. In-app purchases run through RevenueCat.",
      system: "Flutter client for iOS and Android, a thin FastAPI service, Supabase data with row-level security and Firebase authentication.",
    },
  },
];

export const processSteps = [
  { id: "discover", title: "Discover", body: "Understand the problem, define requirements and find the smallest valuable release." },
  { id: "design", title: "Design", body: "Flows, interface and technical architecture, agreed before code." },
  { id: "build", title: "Build", body: "Iterative development with regular demos and honest updates." },
  { id: "launch", title: "Launch", body: "Deployment, monitoring and continued improvement." },
] as const;

export const deliverySteps = ["Your idea", "Strategy", "UX / UI", "Frontend", "Backend", "Infrastructure", "Testing", "Deployment"];

export const credibility = [
  "Remote-first",
  "Async-friendly",
  "Clear milestones",
  "Documented delivery",
  "Code & IP handover defined per agreement",
  "Post-launch support",
];

export const engagements = [
  { title: "Fixed Scope", body: "For clearly defined projects with agreed deliverables and milestones." },
  { title: "Product Sprint", body: "For validating an idea and building the first working version." },
  { title: "Ongoing Engineering", body: "For continuous development, improvement and support." },
];
