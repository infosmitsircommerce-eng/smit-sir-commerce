import { readFile, writeFile } from 'node:fs/promises';

const BASE = 'https://www.smitsircommerce.in';

const targets = [
  {
    files: [
      new URL('../dist/gseb/class-12/economics/indicators-of-growth-and-development-notes.html', import.meta.url),
      new URL('../dist/gseb/class-12/economics/indicators-of-growth-and-development-notes/index.html', import.meta.url),
    ],
    title: 'Growth & Development Class 12 Notes | GSEB',
    description: 'Free GSEB Class 12 Economics notes on growth, development, per capita income, PQLI and HDI, with chapter PDF and revision practice.',
    patch(html) {
      return html.replace(
        /"@type"\s*:\s*"Organization"\s*,\s*"name"\s*:\s*"Smit Sir Commerce"(?!\s*,\s*"logo")/g,
        '"@type":"Organization","name":"Smit Sir Commerce","url":"' + BASE + '/","logo":"' + BASE + '/og-image.jpg"'
      );
    },
  },
  {
    files: [
      new URL('../dist/contact.html', import.meta.url),
      new URL('../dist/contact/index.html', import.meta.url),
    ],
    title: 'Contact Smit Sir Commerce | Student Help',
    patch(html) {
      if (html.includes('data-final-contact-trust="true"')) return html;
      const block = `<section data-final-contact-trust="true"><h2>How support requests are handled</h2><p>Study questions are answered by first identifying the class, board, subject and exact concept involved. Resource problems are checked against the specific page or PDF URL. Accuracy, privacy or rights concerns are reviewed separately so they are not mixed with admission enquiries. This keeps the contact page useful for students, parents and rights holders without requiring anyone to join a batch.</p><h2>Before sending a study question</h2><p>Include the chapter name, the question type and what you have already tried. For a numerical, mention the formula or step where the answer stops making sense. For a theory answer, mention whether the difficulty is understanding the concept, remembering the headings or applying the idea to a case. That context makes the response more useful than a message that only says a subject is difficult.</p><h2>Resource, privacy and rights questions</h2><p>If a note, quiz, calculator or PDF appears incorrect, share the exact page address and describe the specific point that needs checking. Privacy requests should identify the account or enquiry involved without sending passwords, OTPs or other unnecessary sensitive information. Rights holders can report a copyright concern by identifying the public resource and the material in question. These requests are reviewed as website-content issues and do not require admission, payment or participation in a coaching batch.</p></section>`;
      return html.replace('</article>', block + '</article>');
    },
  },
  {
    files: [
      new URL('../dist/gseb/class-12/economics/emerging-issues-in-indian-economy-notes.html', import.meta.url),
      new URL('../dist/gseb/class-12/economics/emerging-issues-in-indian-economy-notes/index.html', import.meta.url),
    ],
    title: 'Emerging Issues Class 12 Notes | GSEB',
    description: 'Free GSEB Class 12 Economics notes on migration, urbanisation and infrastructure, with chapter revision guidance and practice links.',
    patch(html) {
      if (/<script\b[^>]*type=["']application\/ld\+json["']/i.test(html)) return html;
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: 'Emerging Issues in Indian Economy Notes',
        url: BASE + '/gseb/class-12/economics/emerging-issues-in-indian-economy-notes',
        educationalLevel: 'Class 12',
        learningResourceType: 'Chapter notes',
        inLanguage: 'en-IN',
        isAccessibleForFree: true,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Smit Sir Commerce',
          url: BASE + '/',
          logo: BASE + '/og-image.jpg',
        },
      };
      return html.replace('</head>', '<script type="application/ld+json">' + JSON.stringify(schema).replaceAll('<', '\\u003c') + '</script>\n</head>');
    },
  },
  {
    files: [
      new URL('../dist/class-11-commerce-economics-notes.html', import.meta.url),
      new URL('../dist/class-11-commerce-economics-notes/index.html', import.meta.url),
    ],
    title: 'Class 11 Economics Notes | Microeconomics',
    patch(html) {
      if (html.includes('data-class11-depth="true"')) return html;
      const block = `<section data-class11-depth="true"><h2>A simple Class 11 Microeconomics study sequence</h2><p>Begin with the basic economic problem and consumer behaviour before moving to demand, elasticity, production, cost, revenue, supply and market equilibrium. After each chapter, explain the main idea without notes, draw the relevant diagram where required and solve one application question. This sequence helps students build the logic of Microeconomics instead of memorising disconnected definitions.</p></section>`;
      return html.replace('</article></main>', block + '</article></main>');
    },
  },
  {
    files: [
      new URL('../dist/book-demo.html', import.meta.url),
      new URL('../dist/book-demo/index.html', import.meta.url),
    ],
    title: 'Free Commerce Paper Analysis | Mehsana',
  },
  {
    files: [
      new URL('../dist/cbse-class-12-business-studies-chapter-wise-important-questions.html', import.meta.url),
      new URL('../dist/cbse-class-12-business-studies-chapter-wise-important-questions/index.html', import.meta.url),
    ],
    title: 'Class 12 BST Important Questions | CBSE',
  },
  {
    files: [
      new URL('../dist/cbse/class-12/business-studies/controlling-notes.html', import.meta.url),
      new URL('../dist/cbse/class-12/business-studies/controlling-notes/index.html', import.meta.url),
    ],
    title: 'Controlling Class 12 Notes PDF | BST Chapter 8',
    description: 'Free CBSE Class 12 Business Studies Controlling notes PDF with process, relationship with planning, key terms, examples and exam revision.',
  },
  {
    files: [
      new URL('../dist/cbse/class-12/business-studies/business-environment-notes.html', import.meta.url),
      new URL('../dist/cbse/class-12/business-studies/business-environment-notes/index.html', import.meta.url),
    ],
    description: 'Free CBSE Class 12 Business Environment notes for Chapter 3 with dimensions, importance, demonetisation, examples and exam revision.',
  },
  {
    files: [
      new URL('../dist/tools/net-indirect-tax-calculator.html', import.meta.url),
      new URL('../dist/tools/net-indirect-tax-calculator/index.html', import.meta.url),
    ],
    title: 'Net Indirect Tax Calculator | NIT Formula',
    description: 'Calculate Net Indirect Tax from indirect taxes and subsidies with the NIT formula, step-by-step working and Class 12 Economics examples.',
  },
  {
    files: [
      new URL('../dist/tools/topics/national-income-gdp.html', import.meta.url),
      new URL('../dist/tools/topics/national-income-gdp/index.html', import.meta.url),
    ],
    title: 'National Income & GDP Calculators | Class 12',
  },
  {
    files: [
      new URL('../dist/online-batch.html', import.meta.url),
      new URL('../dist/online-batch/index.html', import.meta.url),
    ],
    description: 'Online Class 11–12 Commerce support with Economics and Business Studies learning resources, structured practice and a free demo option.',
  },
  {
    files: [
      new URL('../dist/tools/market-price-from-factor-cost-calculator.html', import.meta.url),
      new URL('../dist/tools/market-price-from-factor-cost-calculator/index.html', import.meta.url),
    ],
    description: 'Convert factor cost to market price using net indirect taxes, with the formula, step-by-step working and Class 12 Economics examples.',
  },
  {
    files: [
      new URL('../dist/tools/debt-equity-ratio-calculator.html', import.meta.url),
      new URL('../dist/tools/debt-equity-ratio-calculator/index.html', import.meta.url),
    ],
    description: 'Calculate debt-equity ratio with the formula, clear working and examples for Class 12 Accountancy and financial statement analysis.',
  },
  {
    files: [
      new URL('../dist/tools/topics/income-determination.html', import.meta.url),
      new URL('../dist/tools/topics/income-determination/index.html', import.meta.url),
    ],
    title: 'MPC, MPS & Multiplier Calculators | Class 12',
  },
  {
    files: [
      new URL('../dist/content-provenance.html', import.meta.url),
      new URL('../dist/content-provenance/index.html', import.meta.url),
    ],
    patch(html) {
      if (html.includes('data-provenance-review="true"')) return html;
      const block = `<section data-provenance-review="true"><h2>How the public PDF inventory is checked</h2><p>Every deployment rebuilds the public PDF manifest from the files actually present in the website repository. Each public PDF must match a recognised Smit Sir Commerce learning-resource collection. If a new PDF falls outside those recognised collections, the provenance check fails instead of silently treating the file as original. The manifest therefore acts as a continuing publication control, not only a one-time statement.</p><h2>What the inventory does not claim</h2><p>Classification confirms where a public file belongs in the Smit Sir Commerce resource library; it does not transfer ownership of third-party trademarks, board names, prescribed textbooks or official examination material. Any specific rights concern can still be reviewed through the Contact page.</p></section>`;
      return html.replace('</article></main>', block + '</article></main>');
    },
  },
];

function setTitle(html, value) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + value + '</title>');
}

function setDescription(html, value) {
  if (!value) return html;
  const tag = '<meta name="description" content="' + value.replaceAll('&', '&amp;').replaceAll('"', '&quot;') + '">';
  return /<meta\s+name=["']description["'][^>]*>/i.test(html)
    ? html.replace(/<meta\s+name=["']description["'][^>]*>/i, tag)
    : html.replace('</head>', tag + '\n</head>');
}

let filesPatched = 0;
for (const target of targets) {
  for (const file of target.files) {
    try {
      let html = await readFile(file, 'utf8');
      if (target.title) html = setTitle(html, target.title);
      if (target.description) html = setDescription(html, target.description);
      if (target.patch) html = target.patch(html);
      await writeFile(file, html, 'utf8');
      filesPatched += 1;
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
}

console.log('[adsense-final] Polished ' + filesPatched + ' high-value HTML files for trust, depth and structured data.');
