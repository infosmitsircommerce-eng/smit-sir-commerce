import { access, constants, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  BOARD_BOOSTER_PRODUCTS,
  FREE_RESOURCE_COLLECTIONS,
} from "../src/data/boardBoosterProducts.js";
import {
  renderBoardBoosterPreviews,
} from "../src/data/boardBoosterPreviews.js";

const BASE = "https://www.smitsircommerce.in";
const PATH = "/board-booster-packs";
const TITLE = "Premium Commerce Board Boosters — Preview Before You Buy | Smit Sir Commerce";
const DESCRIPTION = "Compare Smit Sir Commerce premium packs and free resources by board, class and subject. See exact inclusions, real resource counts, free previews and ₹199 pack pricing.";
const DIST = new URL("../dist/", import.meta.url).pathname;

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function productInventory(product) {
  return product.inventory
    .map((item) => `<li><strong>${esc(item.value)} ${esc(item.label)}</strong> — ${esc(item.detail)}</li>`)
    .join("");
}

function productIncluded(product) {
  return product.included.map((item) => `<li>${esc(item)}</li>`).join("");
}

function renderProducts() {
  return BOARD_BOOSTER_PRODUCTS.map((product) => `
    <article data-product-id="${esc(product.id)}">
      <p><strong>${esc(product.board)} · Class ${esc(product.classLevel)} · ${esc(product.badge)}</strong></p>
      <h3>${esc(product.name)} — ₹${esc(product.price)}</h3>
      <p>${esc(product.focus)}</p>
      <h4>Real inventory</h4>
      <ul>${productInventory(product)}</ul>
      <h4>Included</h4>
      <ul>${productIncluded(product)}</ul>
      <p><a href="${esc(product.previewPath)}">View free preview</a>${product.diagnosticPath ? ` · <a href="${esc(product.diagnosticPath)}">Take free diagnostic</a>` : ""}</p>
    </article>`).join("");
}

function renderFreeCollections() {
  return FREE_RESOURCE_COLLECTIONS.map((collection) => `
    <li><strong>${esc(collection.board)} Class ${esc(collection.classLevel)} ${esc(collection.subject)}:</strong> ${esc(collection.count)}. ${esc(collection.note)} <a href="${esc(collection.path)}">Open free resources</a></li>`).join("");
}

function staticBody() {
  return `<main class="page-container section-padding" data-prerendered="board-booster-catalog">
    <article>
      <p><strong>Smit Sir Commerce Study Store · preview before you buy</strong></p>
      <h1>Premium Commerce Board Boosters</h1>
      <p>Free notes stay free. Premium packs add deeper explanations, harder practice and focused revision. Every paid pack below has a defined board, class, subject, ₹199 one-time pack price, real inventory and a free preview route.</p>
      <h2>How the catalogue works</h2>
      <ol><li>Choose your board.</li><li>Choose Class 11 or 12.</li><li>Choose the subject pack.</li><li>Preview free material before deciding.</li><li>Reserve now while Cashfree activation is pending; no money is collected by the reservation form.</li></ol>
      <h2>Premium packs currently mapped</h2>
      ${renderProducts()}
      <h2>What remains free</h2>
      <ul>${renderFreeCollections()}</ul>
      <p>Published chapter notes, selected PDFs, Easy and Moderate quiz levels where available, free previews and public diagnostic tools remain free. Premium is limited to the specifically listed deep-dives, revision guides, harder practice and pack-specific additions.</p>
      <p><strong>Payment status:</strong> secure Cashfree checkout is being activated. The current reservation form does not collect payment and does not unlock content.</p>
      ${renderBoardBoosterPreviews(BOARD_BOOSTER_PRODUCTS)}
      <p><a href="/study-material">Browse free study material</a> · <a href="/quizzes">Try free quizzes</a> · <a href="/board-exam-diagnostic">Take a free diagnostic</a></p>
    </article>
  </main>`;
}

function schema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${BASE}${PATH}#webpage`,
        url: `${BASE}${PATH}`,
        name: "Premium Commerce Board Boosters — Preview Before You Buy",
        description: DESCRIPTION,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${BASE}/#website` },
        publisher: { "@id": `${BASE}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Board Boosters", item: `${BASE}${PATH}` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Smit Sir Commerce Premium Study Packs",
        numberOfItems: BOARD_BOOSTER_PRODUCTS.length,
        itemListElement: BOARD_BOOSTER_PRODUCTS.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            name: product.name,
            description: product.focus,
            brand: { "@type": "Brand", name: "Smit Sir Commerce" },
            offers: {
              "@type": "Offer",
              price: String(product.price),
              priceCurrency: "INR",
              availability: "https://schema.org/PreOrder",
              url: `${BASE}${PATH}?pack=${product.id}`,
            },
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What remains free on Smit Sir Commerce?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Published chapter notes, selected PDFs, Easy and Moderate quiz levels where available, previews and public diagnostic tools remain free as labelled in the catalogue.",
            },
          },
          {
            "@type": "Question",
            name: "What does a Premium Board Booster add?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Premium adds only the resources explicitly listed for that pack, such as deeper chapter guides, concise revision editions and Hard or Extreme practice with worked reasoning.",
            },
          },
          {
            "@type": "Question",
            name: "Does the ₹199 reservation form charge me?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Cashfree payment-gateway activation is pending. The current reservation form records interest only and does not collect money.",
            },
          },
        ],
      },
    ],
  };
}

function replaceMeta(html, key, value, attribute = "name") {
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, "i");
  const tag = `<meta ${attribute}="${key}" content="${esc(value)}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `${tag}\n</head>`);
}

function patchPage(html) {
  let next = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(TITLE)}</title>`);
  next = replaceMeta(next, "description", DESCRIPTION);
  next = replaceMeta(next, "og:title", TITLE, "property");
  next = replaceMeta(next, "og:description", DESCRIPTION, "property");
  next = replaceMeta(next, "twitter:title", TITLE);
  next = replaceMeta(next, "twitter:description", DESCRIPTION);

  const pageSchema = JSON.stringify(schema()).replaceAll("<", "\\u003c");
  next = next.replace(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    (match) => match.includes("board-booster-packs#webpage")
      ? `<script type="application/ld+json">${pageSchema}</script>`
      : match,
  );

  const body = staticBody();
  next = next.replace(
    /<main\b[^>]*data-prerendered=["']board-booster-catalog["'][^>]*>[\s\S]*?<\/main>/i,
    body,
  );
  return next;
}

async function exists(file) {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const files = [
  join(DIST, "board-booster-packs.html"),
  join(DIST, "board-booster-packs", "index.html"),
];
let updated = 0;
for (const file of files) {
  if (!(await exists(file))) continue;
  const before = await readFile(file, "utf8");
  const after = patchPage(before);
  if (after !== before) {
    await writeFile(file, after, "utf8");
    updated += 1;
  }
}

console.log(`Finalized Board Booster store HTML in ${updated} static files.`);
