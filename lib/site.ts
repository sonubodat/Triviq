export const siteConfig = {
  name: "Triviq",
  companyName: "Triviq",
  title: "Triviq | Software that solves real problems",
  description:
    "Triviq is an independent technology studio building web, mobile, AI and interactive software for businesses, and products of its own.",
  url: "https://triviq.com",
  locale: "en_US",
  keywords: [
    "Triviq",
    "software development",
    "SaaS development",
    "mobile app development",
    "business automation",
    "AI integration",
    "game development",
    "product engineering",
  ],
  logo: "/assets/triviq-logo.png",
  icon: "/assets/icon.png",
  ogImage: "/assets/og-image.svg",
  // ponytail: placeholders, replace with real inboxes before launch
  email: "hello@triviq.com",
  supportEmail: "support@triviq.com",
  // Legal clauses render only when these are filled in.
  legal: { entity: "", jurisdiction: "" },
  lastUpdated: "October 2026",
};

export const services = [
  { title: "Web & SaaS Development", body: "Production websites, SaaS applications, portals and dashboards." },
  { title: "Mobile Apps", body: "iOS, Android and cross-platform product development." },
  { title: "Business Software", body: "Internal tools, workflow automation, admin systems and custom platforms." },
  { title: "AI & Automation", body: "AI integrations, intelligent workflows and API-driven automation." },
  { title: "Games & Interactive", body: "Games, prototypes and interactive digital experiences." },
  { title: "Product Engineering", body: "MVP, architecture, development, deployment and ongoing improvement." },
] as const;

export const budgets = [
  "Under ₹1 lakh / $1k",
  "₹1–5 lakh / $1k–6k",
  "₹5–20 lakh / $6k–25k",
  "₹20 lakh+ / $25k+",
  "Not sure yet",
] as const;

// Add entries as real projects ship; empty arrays render honest "coming soon" states.
export const work: { title: string; body: string; href?: string }[] = [];
export const products: { title: string; body: string; href?: string }[] = [];

export const nav = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Products", href: "/#products" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerColumns = [
  { heading: "Studio", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }] },
  { heading: "Explore", links: [{ label: "Services", href: "/#services" }, { label: "Work", href: "/#work" }, { label: "Products", href: "/#products" }] },
  { heading: "Support", links: [{ label: "Help & Support", href: "/support" }] },
  { heading: "Legal", links: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms & Conditions", href: "/terms" }] },
];
