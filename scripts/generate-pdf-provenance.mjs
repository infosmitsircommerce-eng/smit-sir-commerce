import { readdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicRoot = join(root, "public");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) files.push(full);
  }
  return files;
}

function classify(path) {
  if (path.startsWith("downloads/")) {
    return {
      collection: "Smit Sir Commerce revision downloads",
      provenance: "creator_resource",
      basis: "Branded/generated Smit Sir Commerce revision material."
    };
  }
  if (path.includes("cbse/class-11/microeconomics/")) {
    return {
      collection: "CBSE Class 11 Microeconomics notes",
      provenance: "creator_resource",
      basis: "Smit Sir-branded chapter notes derived from the CBSE/NCERT syllabus with original explanation, examples and revision structure."
    };
  }
  if (path.includes("cbse/class-12/business-studies/")) {
    return {
      collection: "CBSE Class 12 Business Studies notes",
      provenance: "creator_resource",
      basis: "Smit Sir Commerce-branded notes carrying creator branding/copyright and original learning structure."
    };
  }
  if (path.includes("materials/class-12/economics/")) {
    return {
      collection: "Class 12 Economics notes",
      provenance: "creator_resource",
      basis: "Smit Sir Commerce learning notes created for the website."
    };
  }
  if (path.includes("gseb/class-11/accountancy/")) {
    return {
      collection: "GSEB Class 11 Accountancy notes",
      provenance: "creator_resource",
      basis: "Smit Sir Commerce notes created from the prescribed syllabus with original explanation, examples and practice."
    };
  }
  if (path.includes("gseb/class-11/business-administration/")) {
    return {
      collection: "GSEB Class 11 Business Administration notes",
      provenance: "creator_resource",
      basis: "Smit Sir Commerce notes created from the prescribed syllabus with original explanation and practice."
    };
  }
  if (path.includes("gseb/class-12/business-administration/")) {
    return {
      collection: "GSEB Class 12 Business Administration notes",
      provenance: "creator_resource",
      basis: "Smit Sir Commerce-branded notes prepared from the GSEB syllabus/textbook context with original explanation and practice."
    };
  }
  if (path.includes("gseb/class-12/economics/")) {
    return {
      collection: "GSEB Class 12 Economics notes",
      provenance: "creator_resource",
      basis: "Smit Sir Commerce notes prepared by Smit Thaker from the GSEB syllabus/textbook context with original explanation, examples and revision guidance."
    };
  }
  return {
    collection: "Other Smit Sir Commerce PDF",
    provenance: "review_required",
    basis: "Public PDF present in the repository but not matched to a known learning-resource collection."
  };
}

const files = (await walk(publicRoot))
  .map((file) => relative(publicRoot, file).replaceAll("\\", "/"))
  .sort();

const items = files.map((path) => ({ path: "/" + path, ...classify(path) }));
const reviewRequired = items.filter((item) => item.provenance === "review_required");

const manifest = {
  site: "https://www.smitsircommerce.in",
  lastReviewed: "2026-09-18",
  publicPdfCount: items.length,
  reviewRequiredCount: reviewRequired.length,
  policyUrl: "https://www.smitsircommerce.in/content-provenance",
  statement:
    "This inventory covers PDFs intentionally published under the website's public directory. Official board textbooks used privately as source references are not part of this public PDF inventory.",
  items
};

await writeFile(join(publicRoot, "pdf-provenance.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
await writeFile(
  join(publicRoot, "content-provenance.txt"),
  [
    "Smit Sir Commerce - Public PDF Provenance",
    "Last reviewed: 2026-09-18",
    "",
    manifest.statement,
    "",
    "Public PDF count: " + manifest.publicPdfCount,
    "Files requiring provenance review: " + manifest.reviewRequiredCount,
    "Policy: " + manifest.policyUrl,
    "",
    ...items.map((item) => item.path + " | " + item.collection + " | " + item.provenance)
  ].join("\n") + "\n",
  "utf8"
);

if (reviewRequired.length) {
  console.warn("[provenance] REVIEW REQUIRED for " + reviewRequired.length + " PDF(s): " + reviewRequired.map((x) => x.path).join(", "));
  process.exitCode = 1;
} else {
  console.log("[provenance] PASS - " + items.length + " public PDFs classified; 0 require review.");
}
