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
  socialImageAlt: "Triviq: we turn ambitious ideas into working software.", // alt text for the share card (app/opengraph-image.png)
  logo: "/assets/triviq-logo.png",
  icon: "/assets/icon.png",
  // ponytail: placeholders, replace with real inboxes before launch
  email: "hello@triviq.com",
  supportEmail: "support@triviq.com",
  // Legal clauses render only when these are filled in.
  legal: { entity: "", jurisdiction: "" },
  // Analytics stay off (no script, no cookies, privacy policy says so) until NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set at build time.
  // Static process.env references on purpose: Next inlines NEXT_PUBLIC_* only when it can see the full name.
  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
    plausibleSrc: process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? "https://plausible.io/js/script.js",
  },
  lastUpdated: "October 2026",
};

// Contact form choices. The API validates against these same lists, so form and server cannot drift.
// USD first: most overseas inquiries think in dollars; the INR band sits in brackets for Indian clients.
export const budgets = [
  "Under $1k (₹1 lakh)",
  "$1k–6k (₹1–5 lakh)",
  "$6k–25k (₹5–20 lakh)",
  "$25k+ (₹20 lakh+)",
  "Not sure yet",
] as const;

export const timelines = ["ASAP (within a month)", "1–3 months", "3–6 months", "Flexible"] as const;

export const projectTypes = [
  "New product",
  "Redesign or rebuild",
  "Add to an existing product",
  "Ongoing engineering",
  "Not sure yet",
] as const;

export const nav = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Products", href: "/#products" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
];

// The Services column is built in site-footer.tsx from the services content, so it always matches the pages that exist.
export const footerColumns = [
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
