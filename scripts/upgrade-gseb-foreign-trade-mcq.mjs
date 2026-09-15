import { readFile, writeFile } from 'node:fs/promises';

const files = [
  new URL('../dist/gseb-economics-quizzes/class-12/foreign-trade-mcq.html', import.meta.url),
  new URL('../dist/gseb-economics-quizzes/class-12/foreign-trade-mcq/index.html', import.meta.url),
];

const title = 'GSEB Class 12 Foreign Trade MCQ | 20 Free Questions';
const description = 'Practice 20 free GSEB Class 12 Economics Foreign Trade MCQs across Easy and Medium levels with explanations, key concepts and a direct link to chapter notes.';

function setTitle(html, value) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${value}</title>`);
}

function setMeta(html, attribute, key, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escaped}">`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

for (const file of files) {
  try {
    let html = await readFile(file, 'utf8');
    html = setTitle(html, title);
    html = setMeta(html, 'name', 'description', description);
    html = setMeta(html, 'property', 'og:title', title);
    html = setMeta(html, 'property', 'og:description', description);
    html = setMeta(html, 'name', 'twitter:title', title);
    html = setMeta(html, 'name', 'twitter:description', description);

    html = html.replaceAll('GSEB Foreign Trade MCQ — Class 12', title);
    html = html.replaceAll(
      'Practise GSEB Foreign Trade MCQs for Class 12. Free Easy and Medium quizzes, answer explanations and key concepts; Premium Hard and Extreme levels.',
      description,
    );

    html = html.replace(
      /<p>Test your understanding of Foreign Trade with 20 free questions across Easy and Medium\. Hard and Extreme require Premium\. Choose a level in the interactive quiz to answer questions and review explanations\.<\/p>/i,
      '<p><strong>20 questions are free:</strong> practise Easy and Medium Foreign Trade MCQs with explanations. Hard and Extreme are separate Premium levels. Use the free questions first, note the concepts you miss, then return to the chapter notes before retrying.</p>',
    );

    await writeFile(file, html, 'utf8');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log('Upgraded GSEB Foreign Trade MCQ snippet and free-practice promise.');
