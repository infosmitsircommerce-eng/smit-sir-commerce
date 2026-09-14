import { createHash, timingSafeEqual } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { serviceRequest } from './_purchase-utils.js';

export const config = { api: { bodyParser: false } };

const TOKEN = 'Yp5uunz0qN0q3EvER8hG4WR8Ymi1H6nWO3iWyrh3S-Hx471D1pW8MA';
const MASTER_KEY = 'complete-book';
const CHUNK_SIZE = 60000;
const MAX_BYTES = 4 * 1024 * 1024;

function tokenMatches(value) {
  const left = Buffer.from(String(value || ''));
  const right = Buffer.from(TOKEN);
  return left.length === right.length && timingSafeEqual(left, right);
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const part = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += part.length;
    if (size > MAX_BYTES) throw new Error('File too large.');
    chunks.push(part);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  if (!tokenMatches(req.headers['x-sync-token'])) return res.status(404).json({ error: 'Not found.' });

  try {
    const pdf = await readBody(req);
    if (pdf.subarray(0, 5).toString() !== '%PDF-') return res.status(400).json({ error: 'Invalid PDF.' });
    const sha256 = createHash('sha256').update(pdf).digest('hex');
    const encoded = deflateSync(pdf, { level: 9 }).toString('base64');
    const rows = [];
    for (let offset = 0, index = 0; offset < encoded.length; offset += CHUNK_SIZE, index += 1) {
      rows.push({ resource_key: MASTER_KEY, chunk_index: index, payload: encoded.slice(offset, offset + CHUNK_SIZE) });
    }

    await serviceRequest(`/rest/v1/premium_gseb_11_accountancy_chunks?resource_key=eq.${MASTER_KEY}`, {
      method: 'DELETE', prefer: 'return=minimal',
    });
    await serviceRequest('/rest/v1/premium_gseb_11_accountancy_chunks', {
      method: 'POST', body: rows, prefer: 'return=minimal',
    });
    await serviceRequest('/rest/v1/premium_gseb_11_accountancy_notes?on_conflict=resource_key', {
      method: 'POST',
      body: {
        resource_key: MASTER_KEY,
        chapter: null,
        title: 'GSEB Std. 11 Accountancy Part 1 - Premium Complete Book',
        pages: 720,
        file_base64: '',
        sha256,
        updated_at: new Date().toISOString(),
      },
      prefer: 'resolution=merge-duplicates,return=minimal',
    });
    return res.status(200).json({ ok: true, bytes: pdf.length, chunks: rows.length, sha256 });
  } catch (error) {
    console.error('internal-sync-accountancy', error?.message || error);
    return res.status(503).json({ error: error?.message || 'Sync failed.' });
  }
}
