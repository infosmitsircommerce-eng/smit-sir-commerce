// Legacy PDFs now live in the protected Premium database. Never restore them to public/.
import { readFile } from 'node:fs/promises';
import { gsebFreeEconomicsMaterials } from '../src/data/gsebMaterials.js';
for (const m of gsebFreeEconomicsMaterials) {
  const bytes = await readFile(new URL('../public' + m.file_url, import.meta.url));
  if (bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error('Invalid free PDF: ' + m.file_url);
}
console.log('Validated ' + gsebFreeEconomicsMaterials.length + ' free GSEB Economics PDFs.');
