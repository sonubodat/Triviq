export const siteConfig = {
  name: "Triviq",
  companyName: "Triviq",
  title: "Triviq | Product & engineering studio",
  description:
    "Triviq is an independent product and engineering studio building websites, apps, SaaS platforms and digital experiences for businesses worldwide.",
  url: "https://triviq.com",
  locale: "en_US",
  keywords: [
    "Triviq",
    "product engineering studio",
    "software development company India",
    "SaaS development",
    "mobile app development",
    "web application development",
    "AI automation",
    "game development",
  ],
  logo: "/assets/triviq-logo.png",
  icon: "/assets/icon.png",
  // ponytail: placeholders, replace with real inboxes before launch
  email: "hello@triviq.com",
  supportEmail: "support@triviq.com",
  // Legal clauses render only when these are filled in.
  legal: { entity: "", jurisdiction: "" },
  lastUpdated: "October 2026",
};

export const budgets = [
  "Under ₹1 lakh / $1k",
  "₹1–5 lakh / $1k–6k",
  "₹5–20 lakh / $6k–25k",
  "₹20 lakh+ / $25k+",
  "Not sure yet",
] as const;

export const nav = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Products", href: "/#products" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
];

export const footerColumns = [
  {
    heading: "Services",
    links: [
      { label: "Web & Platforms", href: "/#services" },
      { label: "Mobile Apps", href: "/#services" },
      { label: "SaaS Products", href: "/#services" },
      { label: "AI & Automation", href: "/#services" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Work", href: "/#work" },
      { label: "Products", href: "/#products" },
      { label: "Contact", href: "/contact" },
    ],
  },
  { heading: "Resources", links: [{ label: "Help & Support", href: "/support" }] },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];
