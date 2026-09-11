import { quizDiscovery } from "../src/data/quizDiscovery.js";
import { writeFile } from "node:fs/promises";
import { seoHubs, seoMaterials } from "../src/data/seoMaterials.js";
import { gsebMaterials } from "../src/data/gsebMaterials.js";
import { authorityGuides } from "../src/data/authorityGuides.js";
import { localSeoPages } from "../src/data/localSeoPages.js";
import { commerceTools } from "../src/data/allCommerceTools.js";
import { toolClusters } from "../src/data/toolClusters.js";
import {
  localizedPilotPages,
  localizedAlternatesByPath,
} from "../src/data/localizedPilot.js";
import { silentSearchPages } from "../src/data/silentSearchPages.js";
import { genuineTrafficPages } from "../src/data/genuineTrafficPages.js";
import { localActionPages } from "../src/data/localActionPages.js";

const BASE = "https://www.smitsircommerce.in";

const basePages = [
  ...quizDiscovery.map((p) => [p.path, "monthly", "0.8"]),
  ["/quizzes", "weekly", "0.95"],
  ["/premium", "weekly", "0.9"],
  ["/", "weekly", "1.0"],
  ["/study-material", "weekly", "1.0"],
  [
    "/school-resource/gseb/class-11/business-administration/ch-1-nature-purpose-and-scope-of-business-gseb-class-11",
    "weekly",
    "0.9",
  ],
  [
    "/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-1-nature-and-significance-of-management-notes",
    "weekly",
    "0.92",
  ],
  [
    "/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-2-principles-of-management-notes",
    "weekly",
    "0.92",
  ],
  [
    "/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-3-planning-notes",
    "weekly",
    "0.92",
  ],
  [
    "/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-4-organizing-notes",
    "weekly",
    "0.92",
  ],
  [
    "/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-5-staffing-notes",
    "weekly",
    "0.92",
  ],
  [
    "/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-6-directing-notes",
    "weekly",
    "0.92",
  ],
  [
    "/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-7-controlling-notes",
    "weekly",
    "0.92",
  ],
  [
    "/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-8-financial-management-notes",
    "weekly",
    "0.92",
  ],
  [
    "/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-9-financial-market-notes",
    "weekly",
    "0.92",
  ],
  [
    "/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-10-marketing-management-notes",
    "weekly",
    "0.92",
  ],
  [
    "/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-11-consumer-protection-notes",
    "weekly",
    "0.92",
  ],
  ["/teacher-guides", "weekly", "0.97"],
  ["/services-for-teachers", "weekly", "0.97"],
  ["/ai-discovery.html", "monthly", "0.95"],
  ["/free-commerce-notes.html", "weekly", "0.99"],
  ["/cbse-commerce-notes.html", "weekly", "0.98"],
  ["/gseb-class-12-economics-notes-pdf.html", "weekly", "0.98"],
  ["/free-commerce-tools.html", "weekly", "0.94"],
  ["/cbse-notes", "weekly", "0.98"],
  ["/gseb-class-12-economics.html", "weekly", "0.98"],
  ["/gseb-class-12-economics-practice.html", "weekly", "0.9"],
  ["/daily-practice", "weekly", "0.86"],
  ["/tools", "weekly", "0.94"],
  ["/commerce-learning", "monthly", "0.72"],
  ["/commerce-exams", "monthly", "0.72"],
  ["/ugc-net-commerce", "monthly", "0.7"],
  ["/gset-commerce", "monthly", "0.7"],
  ["/commerce-coaching-mehsana", "weekly", "0.9"],
  ["/about", "monthly", "0.64"],
  ["/contact", "monthly", "0.7"],
  ["/faq", "monthly", "0.56"],
  ["/privacy", "yearly", "0.25"],
  ["/terms", "yearly", "0.25"],
  ["/access-policy", "yearly", "0.3"],
];

const priorityToolSlugs = new Set([
  "mpc-mps-calculator",
  "investment-multiplier-calculator",
  "gdp-deflator-calculator",
  "real-gdp-calculator",
  "price-elasticity-demand-calculator",
  "tr-ar-mr-calculator",
  "cost-curves-calculator",
  "current-ratio-calculator",
  "quick-ratio-calculator",
  "debt-equity-ratio-calculator",
  "gross-profit-ratio-calculator",
  "common-size-statement-calculator",
]);

function toAbsoluteUrl(path) {
  return path.startsWith("http") ? path : `${BASE}${path}`;
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(path, changefreq, priority, lastmod = "") {
  const alternates = path.startsWith("http")
    ? []
    : localizedAlternatesByPath[path] || [];
  return [
    "  <url>",
    `    <loc>${xmlEscape(toAbsoluteUrl(path))}</loc>`,
    lastmod ? `    <lastmod>${xmlEscape(lastmod)}</lastmod>` : "",
    ...alternates.map(
      (item) =>
        `    <xhtml:link rel="alternate" hreflang="${xmlEscape(item.hreflang)}" href="${xmlEscape(item.href)}" />`,
    ),
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

const entries = [
  ...basePages.map(([p, f, pr]) => urlEntry(p, f, pr)),
  ...silentSearchPages.map((page) =>
    urlEntry(page.path, "weekly", "0.92", "2026-09-08"),
  ),
  ...genuineTrafficPages.map((page) =>
    urlEntry(page.path, "weekly", "0.9", "2026-09-08"),
  ),
  ...localActionPages
    .filter((page) => page.indexable !== false)
    .map((page) => urlEntry(page.path, "weekly", "0.9", "2026-09-08")),
  ...localSeoPages.map((page) =>
    urlEntry(page.path, "weekly", "0.9", "2026-09-03"),
  ),
  ...seoHubs.map((hub) => urlEntry(hub.path, "weekly", "0.9", "2026-09-06")),
  ...seoMaterials.map((material) =>
    urlEntry(material.seo_path, "monthly", "0.8", material.updated),
  ),
  ...gsebMaterials.map((material) =>
    urlEntry(
      material.seo_path,
      "weekly",
      "0.88",
      material.updated || "2026-09-06",
    ),
  ),
  ...authorityGuides.map((guide) =>
    urlEntry(guide.path, "weekly", "0.86", guide.updated),
  ),
  ...toolClusters.map((cluster) =>
    urlEntry(`/tools/topics/${cluster.slug}`, "weekly", "0.9", "2026-09-03"),
  ),
  ...commerceTools
    .filter((tool) => priorityToolSlugs.has(tool.slug))
    .map((tool) =>
      urlEntry(`/tools/${tool.slug}`, "monthly", "0.82", "2026-09-03"),
    ),
  ...localizedPilotPages.map((page) =>
    urlEntry(page.path, "weekly", "0.82", page.updated),
  ),
];

const uniqueEntries = [
  ...new Map(
    entries.map((entry) => [
      entry.match(/<loc>(.*?)<\/loc>/)?.[1] || entry,
      entry,
    ]),
  ).values(),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${uniqueEntries.join("\n")}\n</urlset>\n`;

await writeFile(new URL("../public/sitemap.xml", import.meta.url), xml, "utf8");
console.log(
  `Generated focused sitemap with ${uniqueEntries.length} high-value indexable URLs for crawl-budget hygiene.`,
);
