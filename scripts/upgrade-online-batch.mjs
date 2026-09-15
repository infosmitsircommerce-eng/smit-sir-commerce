import { readFile, writeFile } from "node:fs/promises";

const files = [
  new URL("../dist/online-batch.html", import.meta.url),
  new URL("../dist/online-batch/index.html", import.meta.url),
];

const title = "Online Commerce Classes for Class 11 & 12 | CBSE + Free Demo";
const description =
  "Online CBSE Commerce learning support for Class 11 and 12 in Economics, Business Studies and Entrepreneurship, with free notes and practice to try first plus a free demo before joining.";

const proofBlock = `<section data-online-batch-proof="true" style="margin:22px 0;padding:22px;border:1px solid #eadfca;border-radius:20px;background:#fffaf2">
  <p style="margin:0 0 8px;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#9a681b">Try the learning system before joining</p>
  <h2>Online support for Class 11 & 12 Commerce</h2>
  <p>The online route is built around concept teaching plus independent practice. Current batch timing and availability should be confirmed before admission.</p>
  <ul>
    <li><strong>Economics:</strong> concepts, diagrams, numericals and application practice.</li>
    <li><strong>Business Studies:</strong> chapter understanding, keywords, case studies and answer writing.</li>
    <li><strong>Entrepreneurship:</strong> concept clarity and exam-focused application.</li>
    <li><strong>Between classes:</strong> use the website's free notes, quizzes, tests and calculators to practise independently.</li>
  </ul>
  <p><a href="/cbse-notes"><strong>Try free CBSE notes first</strong></a> · <a href="/cbse/class-12/business-studies-case-study-questions"><strong>Try free BST case studies</strong></a> · <a href="/book-demo?from=online-batch"><strong>Request a free demo</strong></a></p>
</section>`;

function setMeta(html, key, value, attr = "name") {
  const pattern = new RegExp(
    `<meta\\s+${attr}=["']${key}["']\\s+content=["'][^"']*["']\\s*\\/?>`,
    "i",
  );
  const tag = `<meta ${attr}="${key}" content="${value}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html;
}

for (const file of files) {
  try {
    let html = await readFile(file, "utf8");

    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
    html = setMeta(html, "description", description);
    html = setMeta(html, "og:title", title, "property");
    html = setMeta(html, "og:description", description, "property");
    html = setMeta(html, "twitter:title", title);
    html = setMeta(html, "twitter:description", description);

    html = html.replace(
      /<h1>Online CBSE Commerce coaching<\/h1>/i,
      "<h1>Online Commerce Classes for CBSE Class 11 & 12</h1>",
    );

    if (!html.includes('data-online-batch-proof="true"')) {
      const firstIntro = /(<h1>[^<]*<\/h1>\s*<p>[^<]*<\/p>)/i;
      if (firstIntro.test(html)) html = html.replace(firstIntro, `$1${proofBlock}`);
    }

    await writeFile(file, html, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

console.log("Strengthened online-batch discovery, subject clarity and free-demo proof.");
