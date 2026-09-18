import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import {
  getAuthorization,
  serviceRequest,
  verifyUser,
} from './_purchase-utils.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const MASTER_KEY = 'complete-book';
const CHUNK_SIZE = 60000;
const MAX_BYTES = 4 * 1024 * 1024;
const CBSE12_RESOURCES = {
  'part-1-chapter-1': { part: 1, chapter: 1, title: 'Partnership Accounting — Fundamentals', pages: 54 },
  'part-1-chapter-2': { part: 1, chapter: 2, title: 'Goodwill: Nature and Valuation', pages: 20 },
  'part-1-chapter-3': { part: 1, chapter: 3, title: 'Change in Profit-Sharing Ratio', pages: 15 },
  'part-1-chapter-4': { part: 1, chapter: 4, title: 'Admission of a Partner', pages: 20 },
  'part-1-chapter-5': { part: 1, chapter: 5, title: 'Retirement or Death of a Partner', pages: 17 },
  'part-1-chapter-6': { part: 1, chapter: 6, title: 'Dissolution of a Partnership Firm', pages: 17 },
  'part-2-chapter-1': { part: 2, chapter: 1, title: 'Issue of Share Capital', pages: 62 },
  'part-2-chapter-2': { part: 2, chapter: 2, title: 'Issue of Debentures', pages: 91 },
  'part-2-chapter-3': { part: 2, chapter: 3, title: 'Financial Statements & Analysis', pages: 93 },
  'part-2-chapter-4': { part: 2, chapter: 4, title: 'Comparative & Common-Size Statements', pages: 132 },
};

async function readRawBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    const value = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += value.length;
    if (total > MAX_BYTES) throw new Error('File is too large for this uploader.');
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

async function isAdmin(userId) {
  const rows = await serviceRequest(`/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=id,is_admin,role`);
  const profile = Array.isArray(rows) ? rows[0] : null;
  return Boolean(profile && (profile.is_admin === true || profile.role === 'admin'));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const authorization = getAuthorization(req);
  if (!authorization) return res.status(401).json({ error: 'Owner sign-in required.' });

  const cbse12 = req.query?.library === 'cbse12';
  const resourceKey = cbse12 ? String(req.query?.resourceKey || '').trim() : MASTER_KEY;
  const resource = cbse12 ? CBSE12_RESOURCES[resourceKey] : null;
  if (cbse12 && !resource) return res.status(404).json({ error: 'Unknown CBSE Class 12 Accountancy resource.' });

  try {
    const user = await verifyUser(authorization);
    if (!user || !(await isAdmin(user.id))) return res.status(403).json({ error: 'Owner access required.' });

    const pdf = await readRawBody(req);
    if (pdf.subarray(0, 5).toString() !== '%PDF-') {
      return res.status(400).json({ error: cbse12 ? 'Please upload the matching chapter PDF.' : 'Please upload the Premium Complete Book PDF.' });
    }

    const sha256 = createHash('sha256').update(pdf).digest('hex');
    const encoded = deflateSync(pdf, { level: 9 }).toString('base64');
    const payloads = [];
    for (let offset = 0, index = 0; offset < encoded.length; offset += CHUNK_SIZE, index += 1) {
      payloads.push({ resource_key: resourceKey, chunk_index: index, payload: encoded.slice(offset, offset + CHUNK_SIZE) });
    }

    if (cbse12) {
      await serviceRequest('/rest/v1/premium_cbse_12_accountancy_notes?on_conflict=resource_key', {
        method: 'POST',
        body: {
          resource_key: resourceKey,
          part: resource.part,
          chapter: resource.chapter,
          title: resource.title,
          pages: resource.pages,
          sha256,
          updated_at: new Date().toISOString(),
        },
        prefer: 'resolution=merge-duplicates,return=minimal',
      });

      await serviceRequest(`/rest/v1/premium_cbse_12_accountancy_chunks?resource_key=eq.${encodeURIComponent(resourceKey)}`, {
        method: 'DELETE',
        prefer: 'return=minimal',
      });

      await serviceRequest('/rest/v1/premium_cbse_12_accountancy_chunks', {
        method: 'POST',
        body: payloads,
        prefer: 'return=minimal',
      });

      return res.status(200).json({
        ok: true,
        library: 'cbse12',
        resourceKey,
        title: resource.title,
        pages: resource.pages,
        bytes: pdf.length,
        chunks: payloads.length,
        sha256,
      });
    }

    await serviceRequest(`/rest/v1/premium_gseb_11_accountancy_chunks?resource_key=eq.${MASTER_KEY}`, {
      method: 'DELETE',
      prefer: 'return=minimal',
    });

    await serviceRequest('/rest/v1/premium_gseb_11_accountancy_chunks', {
      method: 'POST',
      body: payloads,
      prefer: 'return=minimal',
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

    return res.status(200).json({ ok: true, pages: 720, bytes: pdf.length, chunks: payloads.length, sha256 });
  } catch (error) {
    console.error('admin-accountancy-upload', cbse12 ? resourceKey : 'gseb11', error?.message || error);
    return res.status(503).json({ error: error?.message || 'Unable to store the Premium book.' });
  }
}
