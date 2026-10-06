// Single source of truth for home-page content. Facts only: no metrics, no invented results.

export const services = [
  { id: "web", slug: "web-platforms", title: "Web & Platforms", body: "High-performance websites, commerce and web platforms.", stack: "Next.js · React · Node.js" },
  { id: "mobile", slug: "mobile-apps", title: "Mobile Apps", body: "Native-quality applications for iOS and Android.", stack: "Flutter · React Native" },
  { id: "saas", slug: "saas-products", title: "SaaS Products", body: "Dashboards, subscriptions, APIs and automation for software products.", stack: "FastAPI · Postgres · Supabase" },
  { id: "ai", slug: "ai-automation", title: "AI & Automation", body: "AI integrations, intelligent workflows and API-driven automation.", stack: "Python · LLM APIs · Workflows" },
  { id: "business", slug: "business-software", title: "Business Software", body: "Internal tools, admin systems, portals and custom platforms.", stack: "React · Node.js · Prisma" },
  { id: "games", slug: "games-interactive", title: "Games & Interactive", body: "Games, prototypes and interactive digital experiences.", stack: "Godot · Three.js" },
] as const;

export type ServiceId = (typeof services)[number]["id"];
export type Service = (typeof services)[number];

// Long-form copy for /services/[slug]. Same rules as everything else here: facts and process only, no metrics, no client
// names, no prices, no promises we cannot keep. Edit freely; the pages render whatever is here.
export type ServiceDetail = {
  seoTitle: string;
  seoDescription: string;
  headline: string;
  intro: string;
  includes: string[];
  deliverables: string[];
  goodFit: string[];
  faq: [question: string, answer: string][];
  work: string[]; // project slugs
};

const OWNERSHIP: [string, string] = ["Who owns the code and designs?", "Ownership, licences and source-code delivery are defined in your project agreement."];
const AFTER_LAUNCH = "Optional support after launch, agreed separately from the build";
const HANDOVER = "Documentation, with code handover defined in your agreement";

export const serviceDetails: Record<ServiceId, ServiceDetail> = {
  web: {
    seoTitle: "Web development & platforms",
    seoDescription: "Triviq builds fast websites, commerce and web platforms with Next.js, React and Node.js, from design to deployment, for clients in India and worldwide.",
    headline: "Websites and web platforms built to be fast and easy to grow.",
    intro: "From company sites and commerce to customer portals and full web platforms, one team designs and engineers the whole thing: interface, front end, back end and deployment.",
    includes: ["Company and marketing websites", "Commerce and booking flows", "Customer and partner portals", "CMS-backed sites your team can edit"],
    deliverables: ["A designed interface and a working build", "Deployment to production with monitoring", HANDOVER, AFTER_LAUNCH],
    goodFit: [
      "The site or platform has to stay fast as content and traffic grow.",
      "Your product needs a web front end and an API built together.",
      "You want code and designs documented well enough for another team to take over.",
    ],
    faq: [
      ["Which technologies do you use?", "Mostly Next.js and React on a Node.js back end. If a project calls for something else, the proposal says so and explains why."],
      ["Can you improve a site that already exists?", "Yes. We can review what you have, then improve it or rebuild it in stages while it stays live."],
      OWNERSHIP,
    ],
    work: ["streefi"],
  },
  mobile: {
    seoTitle: "Mobile app development (iOS & Android)",
    seoDescription: "Triviq builds iOS and Android apps with Flutter and React Native, together with the backend, accounts and billing they need, for clients in India and worldwide.",
    headline: "iOS and Android apps, built together with the services behind them.",
    intro: "We design and build mobile apps with the back end they depend on: accounts, data, in-app purchases and the admin tools your team needs. Cross-platform, so one team and one codebase cover both stores.",
    includes: [
      "iOS and Android apps from one codebase (Flutter or React Native)",
      "Sign-in, data sync and in-app purchases",
      "Vendor or admin tools alongside the customer app",
      "Release builds and store submission support",
    ],
    deliverables: ["A designed, tested app and its back end", "Release builds ready for store submission", HANDOVER, AFTER_LAUNCH],
    goodFit: [
      "You are launching an app on both iOS and Android.",
      "The app needs an API, accounts and an admin side built with it.",
      "You want a first version quickly, on a base that can keep growing.",
    ],
    faq: [
      ["Native or cross-platform?", "We build cross-platform with Flutter or React Native, which keeps iOS and Android on one codebase. If a project needs something fully native, the proposal says so."],
      ["Do you build the back end too?", "Yes. Our apps come with their API, database and admin tools, built by the same team."],
      ["Can you take over an existing app?", "Yes. We start with a code review, then fix, extend or rebuild what makes sense."],
    ],
    work: ["streefi", "untold"],
  },
  saas: {
    seoTitle: "SaaS product development",
    seoDescription: "Triviq builds SaaS products end to end: dashboards, accounts and roles, subscriptions, APIs and automation, from a first working version onwards.",
    headline: "SaaS products, from a working first version to something that can bill and grow.",
    intro: "We build the product and everything it runs on: dashboards, accounts and roles, subscriptions, APIs and the automation behind them. Start with the smallest version worth testing, then keep building.",
    includes: ["Dashboards with roles and permissions", "Subscriptions and billing", "Public and internal APIs", "Automation and background jobs behind the product"],
    deliverables: ["A working product on infrastructure you control", "Billing and account flows that are tested end to end", HANDOVER, AFTER_LAUNCH],
    goodFit: [
      "You have a product idea and want a working first version to test it.",
      "You already have a product and need engineering capacity.",
      "You need accounts, roles, billing and an API from day one.",
    ],
    faq: [
      ["Can we start small?", "Yes. A Product Sprint is for validating an idea and building the first working version, and you can continue with ongoing engineering afterwards."],
      ["Which stack do you use?", "Often FastAPI with Postgres or Supabase behind a React or Flutter front end. The proposal explains the choices."],
      OWNERSHIP,
    ],
    work: ["untold"],
  },
  ai: {
    seoTitle: "AI & automation development",
    seoDescription: "Triviq adds AI features and automation to products and operations: language-model features, workflow automation and API integrations between the tools you already use.",
    headline: "AI features and automation that fit the product or process you already have.",
    intro: "We add AI where it earns its place: language-model features inside a product, automation for repetitive operations, and integrations that connect the tools you already use.",
    includes: ["Language-model features inside your product", "Automation for repetitive back-office work", "API-driven integrations between your tools", "Human review where the output matters"],
    deliverables: ["A working integration or workflow, tested on your real cases", "Clear notes on what the automation does and where a person steps in", HANDOVER, AFTER_LAUNCH],
    goodFit: [
      "A manual process takes time every week.",
      "You want an AI feature without rebuilding your product.",
      "Your tools do not talk to each other and should.",
    ],
    faq: [
      ["Do you build your own models?", "Mostly we integrate existing models and APIs into your product and workflows. If a project needs more than that, we say so up front."],
      ["How do you handle sensitive data?", "What data a model may see is decided with you before building and written into the proposal."],
      ["Can we automate one process first?", "Yes. We usually start with the one workflow that costs the most time, then expand from there."],
    ],
    work: [],
  },
  business: {
    seoTitle: "Custom business software",
    seoDescription: "Triviq builds internal tools, admin systems and portals with role-based access, shaped around how your team works, for clients in India and worldwide.",
    headline: "Internal tools, admin systems and portals shaped around how your team works.",
    intro: "Spreadsheets and email threads run more processes than they should. We build the admin consoles, portals and workflows that give each role the right view of the same data.",
    includes: ["Admin consoles and back-office tools", "Customer, vendor or partner portals", "Role-based access to the same data", "Integrations with the systems you already run"],
    deliverables: ["A tool your team can use from the first release", "Per-role access designed in, not added later", HANDOVER, AFTER_LAUNCH],
    goodFit: [
      "A process runs on spreadsheets and email.",
      "Different roles need different views of the same data.",
      "Off-the-shelf software does not fit how you work.",
    ],
    faq: [
      ["Can different roles see different things?", "Yes. Per-role access is designed in from the start, as in our referral-tracking platform with public, vendor, sales and admin experiences."],
      ["Can you connect to our existing systems?", "Usually, through their APIs or exports. We check what is possible before proposing anything."],
      ["How do we start?", "Describe the process as it runs today. We map it, agree the smallest useful release, and build from there."],
    ],
    work: ["qr-referral-platform", "streefi"],
  },
  games: {
    seoTitle: "Game & interactive development",
    seoDescription: "Triviq builds game prototypes, small games and interactive 3D for the web with Godot and Three.js.",
    headline: "Games, prototypes and interactive experiences, on the web and on mobile.",
    intro: "We build playable prototypes, small games and interactive 3D. The 3D mark on our own homepage is a Three.js scene built in-house.",
    includes: ["Playable prototypes to test a game idea", "Small games in Godot", "Interactive 3D for the web with Three.js", "Branded interactive experiences"],
    deliverables: ["Something playable early, then refined", "Builds for the platforms you target", HANDOVER, AFTER_LAUNCH],
    goodFit: [
      "You want to test a game idea with something playable.",
      "You need an interactive 3D piece on a website.",
      "Your product needs game-like interaction.",
    ],
    faq: [
      ["Do you work on large game productions?", "Our focus is prototypes, small games and interactive web work. If a project is bigger than that, we say so."],
      ["Can you start with a prototype?", "Yes. A playable prototype is usually the fastest way to learn whether an idea is worth building."],
    ],
    work: [],
  },
};

export const getService = (slug: string) => services.find((s) => s.slug === slug);

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
  proofPoints: string[];
  media:
    | { type: "phones"; images: { src: string; width: number; height: number; alt: string }[] }
    | { type: "diagram"; id: "qr-flow" };
  details: { problem: string; approach: string; system: string };
  // What is inside, one line per part. Restates the facts above; no results until there are real numbers to show.
  scope: { title: string; body: string }[];
  services: ServiceId[]; // related service ids, first one is the contact form preset
};

export const work: Project[] = [
  {
    slug: "streefi",
    kind: "work",
    name: "Streefi",
    descriptor: "Street-food discovery and dine-in offers platform.",
    built: "Mobile apps · Vendor tools · Admin platform · Backend · Website",
    system: "React Native · Node.js · MongoDB · Next.js",
    proofPoints: ["Mobile UI", "Vendor tools", "Admin + API"],
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
    scope: [
      { title: "Customer app", body: "Location-aware search for nearby vendors and offers, dine-in slot booking, bill-pay verification and booking history, on iOS and Android with React Native." },
      { title: "Vendor app", body: "A separate app for vendors, so businesses manage their side of the platform themselves." },
      { title: "Admin panel", body: "Control over businesses, offers, banners, reviews, analytics and app-version rollouts." },
      { title: "Backend", body: "A Node.js and Express API on MongoDB, with real-time sockets and scheduled jobs." },
      { title: "Website", body: "A Next.js marketing site with a headless CMS." },
    ],
    services: ["mobile", "web", "business"],
  },
  {
    slug: "qr-referral-platform",
    kind: "work",
    name: "QR Referral & Lead-Attribution Platform",
    descriptor: "Vendor referral tracking for an energy business.",
    built: "Vendor portal · Sales portal · Admin console · Public enquiry flow · Backend",
    system: "React · Node.js · Prisma · Postgres",
    proofPoints: ["QR flow", "Attribution", "Role access"],
    media: { type: "diagram", id: "qr-flow" },
    details: {
      problem:
        "Physical QR codes handed to vendors had to be traced to the right vendor and lead, with every scan and referral attributed correctly at the moment it happened.",
      approach:
        "A controlled QR inventory with assignment history, vendor self-registration with sales-assisted verification, a public enquiry form behind each QR link, scan and lead attribution, repeat-referral detection and admin-managed payout status.",
      system:
        "Four role-based experiences (public, vendor, sales, admin) over one API, with strict per-role data access.",
    },
    scope: [
      { title: "Public enquiry flow", body: "A form behind each QR link that captures the lead and ties it to the QR code that produced it." },
      { title: "Vendor portal", body: "Vendor self-registration, with sales-assisted verification before a vendor goes live." },
      { title: "Sales portal", body: "Sales staff verify and assist vendors during onboarding." },
      { title: "Admin console", body: "QR inventory with assignment history, repeat-referral detection and payout status." },
      { title: "Backend", body: "One API with strict per-role data access across all four experiences." },
    ],
    services: ["business", "web"],
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
    proofPoints: ["Private UX", "Auth optional", "In build"],
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
    scope: [
      { title: "Mobile app", body: "A Flutter client for iOS and Android that works fully signed out." },
      { title: "Optional accounts", body: "Sign-in with Google or Apple adds backup and sync; other users only ever see “Anonymous”." },
      { title: "Backend", body: "A thin FastAPI service, with Supabase data protected by row-level security and Firebase authentication." },
      { title: "Billing", body: "In-app purchases run through RevenueCat." },
    ],
    services: ["mobile", "saas"],
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

export const allProjects: Project[] = [...work, ...products];
export const getProject = (slug: string) => allProjects.find((p) => p.slug === slug);
