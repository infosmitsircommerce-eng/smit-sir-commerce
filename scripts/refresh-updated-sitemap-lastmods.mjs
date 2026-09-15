import { readFile, writeFile } from "node:fs/promises";

const BASE = "https://www.smitsircommerce.in";
const MODIFIED_DATE = "2026-09-15";
const SITEMAP = new URL("../public/sitemap.xml", import.meta.url);

// Only pages that were materially updated on 2026-09-15.
// Keeping this explicit avoids pretending untouched pages changed today.
const UPDATED_PATHS = [
  "/",
  "/commerce-coaching-mehsana",
  "/cbse-commerce-classes-mehsana",
  "/economics-tuition-mehsana",
  "/gseb-economics-tuition-mehsana",
  "/book-demo",
  "/mehsana-commerce-student-resources.html",
  "/cbse/class-12/business-studies/business-environment-notes",
  "/cbse/class-12/business-studies/controlling-notes",
  "/cbse/class-12/business-studies-case-study-questions",
  "/cbse/class-12/business-studies-mcq",
  "/practice/cbse/class-12/business-studies/nature-and-significance-of-management-case-study-questions",
  "/practice/cbse/class-12/business-studies/principles-of-management-case-study-questions",
  "/practice/cbse/class-12/business-studies/planning-case-study-questions",
  "/school-resource/gseb/class-11/accountancy/gseb-class-11-accountancy-chapter-5-accounting-equation-notes",
  "/gseb/class-12/economics/indicators-of-growth-and-development-notes",
  "/gseb-economics-quizzes/class-12/foreign-trade-mcq",
  "/tools/topics/national-income-gdp",
  "/tools/net-indirect-tax-calculator",
  "/tools/debt-equity-ratio-calculator",
  "/tools/market-price-from-factor-cost-calculator",
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

let xml = await readFile(SITEMAP, "utf8");
let updated = 0;
let missing = 0;

for (const path of UPDATED_PATHS) {
  const absolute = `${BASE}${path}`;
  const blockPattern = new RegExp(
    `<url>\\s*<loc>${escapeRegex(absolute)}</loc>[\\s\\S]*?</url>`,
  );
  const match = xml.match(blockPattern);

  if (!match) {
    missing += 1;
    continue;
  }

  const block = match[0];
  const refreshed = /<lastmod>[^<]*<\/lastmod>/.test(block)
    ? block.replace(
        /<lastmod>[^<]*<\/lastmod>/,
        `<lastmod>${MODIFIED_DATE}</lastmod>`,
      )
    : block.replace(
        `<loc>${absolute}</loc>`,
        `<loc>${absolute}</loc>\n    <lastmod>${MODIFIED_DATE}</lastmod>`,
      );

  if (refreshed !== block) {
    xml = xml.replace(block, refreshed);
    updated += 1;
  }
}

await writeFile(SITEMAP, xml, "utf8");
console.log(
  `Refreshed sitemap lastmod=${MODIFIED_DATE} for ${updated} materially updated URLs${
    missing ? `; ${missing} listed paths were not present in the focused sitemap` : ""
  }.` ,
);
