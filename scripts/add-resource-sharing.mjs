import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);

const routes = [
  '/cbse/class-12/business-studies-case-study-questions',
  '/cbse/class-12/business-studies/business-environment-notes',
  '/cbse/class-12/business-studies-mcq',
  '/cbse/class-12/economics-revision-guide',
  '/cbse-notes',
  '/study-material',
  '/daily-practice',
  '/test-series',
  '/tools',
  '/school-resource/gseb/class-11/accountancy/gseb-class-11-accountancy-chapter-5-accounting-equation-notes',
  '/gseb/class-12/economics/emerging-issues-in-indian-economy-notes',
  '/gseb/class-12/economics/indicators-of-growth-and-development-notes',
  '/mehsana-commerce-student-resources',
  '/tools/net-indirect-tax-calculator',
  '/tools/topics/national-income-gdp',
];

function routeFiles(path) {
  const relative = path.replace(/^\//, '');
  return [join(dist.pathname, `${relative}.html`), join(dist.pathname, relative, 'index.html')];
}

const shareBlock = `<aside data-resource-share="true" style="margin:28px 0;padding:18px 20px;border:1px solid #e7dfcf;border-radius:18px;background:#fffdf8;display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap">
  <div style="min-width:0;flex:1 1 220px">
    <strong style="display:block;color:#172033;font-size:15px">Help a classmate study smarter</strong>
    <span style="display:block;margin-top:4px;color:#667085;font-size:13px;line-height:1.5">If this free resource helped, share it with someone revising the same topic.</span>
  </div>
  <button type="button" data-share-resource-button style="min-height:42px;padding:0 16px;border:0;border-radius:999px;background:#172033;color:#fff;font:inherit;font-size:13px;font-weight:800;cursor:pointer">Share free resource</button>
</aside>`;

const shareScript = `<script data-resource-share-script="true">(function(){
  document.addEventListener('click', async function(event){
    var button = event.target.closest('[data-share-resource-button]');
    if (!button) return;
    var original = button.textContent;
    var data = { title: document.title, text: 'Free Commerce study resource from Smit Sir Commerce', url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        button.textContent = 'Link copied ✓';
        setTimeout(function(){ button.textContent = original; }, 1800);
      }
      if (typeof window.gtag === 'function') window.gtag('event', 'resource_share', { page_path: window.location.pathname });
    } catch (error) {
      if (error && error.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(window.location.href);
        button.textContent = 'Link copied ✓';
        setTimeout(function(){ button.textContent = original; }, 1800);
      } catch (_) {}
    }
  });
})();</script>`;

let patched = 0;
for (const route of routes) {
  for (const file of routeFiles(route)) {
    try {
      let html = await readFile(file, 'utf8');
      const before = html;
      if (!html.includes('data-resource-share="true"')) {
        const anchors = ['<h2>Continue learning</h2>', '<h2>Related resources</h2>', '</article>', '</main>'];
        let inserted = false;
        for (const anchor of anchors) {
          if (html.includes(anchor)) {
            html = html.replace(anchor, `${shareBlock}${anchor}`);
            inserted = true;
            break;
          }
        }
        if (!inserted) html = html.replace('</body>', `${shareBlock}</body>`);
      }
      if (!html.includes('data-resource-share-script="true"')) {
        html = html.replace('</body>', `${shareScript}</body>`);
      }
      if (html !== before) {
        await writeFile(file, html, 'utf8');
        patched += 1;
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
}

console.log(`Added native resource sharing: ${patched} files patched.`);
