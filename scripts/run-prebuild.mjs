import { runScriptPipeline } from './run-script-pipeline.mjs';

const scripts = [
  "scripts/optimize-og-image.mjs",
  "scripts/apply-search-console-source-overrides.mjs",
  "scripts/generate-public-quizzes.mjs",
  "scripts/audit-quizzes.mjs",
  "scripts/generate-price-elasticity-pdf.mjs",
  "scripts/generate-direct-pdf-seo.mjs",
  "scripts/strengthen-price-elasticity-pdf-discovery.mjs",
  "scripts/generate-pdf-provenance.mjs",
  "scripts/generate-sitemap.mjs",
  "scripts/refresh-updated-sitemap-lastmods.mjs"
];

await runScriptPipeline('prebuild', scripts);
