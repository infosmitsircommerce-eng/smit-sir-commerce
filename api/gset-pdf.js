import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { serviceRequest } from './_purchase-utils.js';

function safeFilename(value) {
  return String(value || 'gset-commerce-notes')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90);
}

export default async function handler(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed.' });

  const unit = Number.parseInt(String(req.query?.unit || ''), 10);
  const chapter = Number.parseInt(String(req.query?.chapter || ''), 10);
  if (!Number.isInteger(unit) || !Number.isInteger(chapter) || unit < 1 || unit > 10 || chapter < 1) {
    return res.status(400).json({ error: 'Valid unit and chapter are required.' });
  }

  try {
    const rows = await serviceRequest(`/rest/v1/gset_commerce_notes?unit=eq.${unit}&chapter=eq.${chapter}&select=resource_key,title,pages,bytes,sha256`);
    const note = Array.isArray(rows) ? rows[0] : null;
    if (!note) return res.status(404).json({ error: 'PDF not found.' });

    const chunks = await serviceRequest(`/rest/v1/gset_commerce_chunks?resource_key=eq.${encodeURIComponent(note.resource_key)}&select=chunk_index,payload&order=chunk_index.asc`);
    if (!Array.isArray(chunks) || !chunks.length) return res.status(404).json({ error: 'PDF not found.' });

    const compressed = Buffer.from(chunks.map((item) => item.payload).join(''), 'base64');
    const pdf = inflateSync(compressed);
    const validHeader = pdf.subarray(0, 5).toString() === '%PDF-';
    const validHash = createHash('sha256').update(pdf).digest('hex') === note.sha256;
    if (!validHeader || !validHash) {
      console.error('gset-pdf-integrity', unit, chapter, validHeader, validHash);
      return res.status(503).json({ error: 'Unable to load this PDF safely right now.' });
    }

    const disposition = String(req.query?.download || '') === '1' ? 'attachment' : 'inline';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `${disposition}; filename="${safeFilename(note.title)}.pdf"`);
    res.setHeader('Content-Length', String(pdf.length));
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('gset-pdf', unit, chapter, error?.message || error);
    return res.status(503).json({ error: 'Unable to load this PDF right now.' });
  }
}
