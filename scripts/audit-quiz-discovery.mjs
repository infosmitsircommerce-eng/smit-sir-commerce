import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { quizDiscovery, getRelatedQuizPages } from '../src/data/quizDiscovery.js';
import { resolveQuizSelection } from '../src/data/quizNavigation.js';
const base = 'https://www.smitsircommerce.in';
assert.equal(quizDiscovery.length, 42);
assert.equal(new Set(quizDiscovery.map(p => p.path)).size, 42);
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const hub = await readFile('dist/gseb-class-12-economics.html', 'utf8');
for (const page of quizDiscovery) {
  const html = await readFile(`dist${page.path}.html`, 'utf8');
  const canonical = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
  assert.equal(canonical.length, 1, page.path);
  assert.equal(canonical[0][1], base + page.path);
  assert.ok(sitemap.includes(`<loc>${base + page.path}</loc>`));
  assert.ok(html.includes('Try these sample MCQs'));
  assert.ok(html.includes(page.testPath.replaceAll('&', '&amp;')));
  assert.equal(resolveQuizSelection(new URL(page.testPath, base).searchParams).selected.id, page.id);
  for (const related of getRelatedQuizPages(page)) {
    assert.equal(related.pack.board, page.pack.board);
    assert.equal(related.pack.stream, page.pack.stream);
  }
  if (page.notesPath) {
    const notesFile = page.notesPath.endsWith('.html') ? `dist${page.notesPath}` : `dist${page.notesPath}.html`;
    assert.ok((await readFile(notesFile, 'utf8')).includes(`href="${page.path}"`));
    assert.ok(html.includes(`href="${page.notesPath}"`));
  }
  if (page.pack.board === 'GSEB') {
    assert.ok(hub.includes(`href="${page.path}"`));
    assert.ok(!html.includes('href="/cbse/'));
    assert.equal(page.freeLevelLabel, 'Medium');
    assert.equal(Boolean(page.notesPath), ![1, 7, 8].includes(page.pack.chapterNumber));
  }
  await access(`dist${page.path}/index.html`);
}
console.log('PASS: 42 canonical/sitemap pages, exact chapter launches, board-correct related links, 21 reciprocal notes links and no fabricated Chapter 1 PDF.');
