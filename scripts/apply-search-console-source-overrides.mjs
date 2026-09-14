import { readFile, writeFile } from 'node:fs/promises';

const priorityCaseStudyIds = [
  'class-12-business-studies-chapter-01',
  'class-12-business-studies-chapter-03',
  'class-12-business-studies-chapter-04',
  'class-12-business-studies-chapter-08',
];

const idExpression = JSON.stringify(priorityCaseStudyIds);

async function patchFile(url, transform, label) {
  const before = await readFile(url, 'utf8');
  const after = transform(before);
  if (after === before) {
    console.log(`[search-console] ${label}: already patched or no matching source.`);
    return;
  }
  await writeFile(url, after, 'utf8');
  console.log(`[search-console] ${label}: patched.`);
}

await patchFile(new URL('../src/data/contentGrowth.js', import.meta.url), (input) => {
  let out = input;
  out = out.replace(
    "'case-study': { label: 'Case Study Questions', suffix: 'case-study-questions', intent: 'original case-study practice with answer guidance' },",
    "'case-study': { label: 'Case Study Questions with Answers', suffix: 'case-study-questions', intent: 'original chapter-wise case-study practice with answers and concept-identification guidance' },",
  );
  out = out.replace(
    "indexable: ['assertion-reason', 'numericals'].includes(type),",
    `indexable: ['assertion-reason', 'numericals'].includes(type) || (type === 'case-study' && ${idExpression}.includes(material.id)),`,
  );
  return out;
}, 'client practice data');

await patchFile(new URL('./growth-manifest.mjs', import.meta.url), (input) => {
  let out = input;
  out = out.replace(
    "'case-study': ['Case Study Questions','case-study-questions','original case-study practice with answer guidance'],",
    "'case-study': ['Case Study Questions with Answers','case-study-questions','original chapter-wise case-study practice with answers and concept-identification guidance'],",
  );
  out = out.replace(
    "indexable: ['assertion-reason', 'numericals'].includes(type),",
    `indexable: ['assertion-reason', 'numericals'].includes(type) || (type === 'case-study' && ${idExpression}.includes(material.id)),`,
  );
  return out;
}, 'static growth manifest');

await patchFile(new URL('./generate-sitemap.mjs', import.meta.url), (input) => {
  let out = input;
  if (!out.includes('growthManifest')) {
    out = out.replace(
      'import { DIAGNOSTIC_ROUTES } from "../src/data/boardDiagnostic.js";',
      'import { DIAGNOSTIC_ROUTES } from "../src/data/boardDiagnostic.js";\nimport { growthManifest } from "./growth-manifest.mjs";',
    );
  }
  if (!out.includes('/gseb-class-11-accountancy-premium.html')) {
    out = out.replace(
      '["/gseb-class-11-accountancy-notes", "weekly", "1.0"],',
      '["/gseb-class-11-accountancy-notes", "weekly", "1.0"],\n  ["/gseb-class-11-accountancy-premium.html", "weekly", "0.92"],',
    );
  }
  if (!out.includes('growthManifest\n    .filter((page) => page.indexable)')) {
    out = out.replace(
      '  ...authorityGuides.map((guide) =>\n    urlEntry(guide.path, "weekly", "0.86", guide.updated),\n  ),',
      '  ...authorityGuides.map((guide) =>\n    urlEntry(guide.path, "weekly", "0.86", guide.updated),\n  ),\n  ...growthManifest\n    .filter((page) => page.indexable)\n    .map((page) => urlEntry(page.path, "weekly", "0.88", page.updated || "2026-09-14")),',
    );
  }
  return out;
}, 'focused sitemap source');
