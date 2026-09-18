import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import {
  getAuthorization,
  hasProductAccess,
  serviceRequest,
  verifyUser,
} from './_purchase-utils.js';

const PRODUCT_ID = 'cbse-12-accountancy';
const ALLOWED_RESOURCES = new Set([
  'part-1-chapter-1',
  'part-1-chapter-2',
  'part-1-chapter-3',
  'part-1-chapter-4',
  'part-1-chapter-5',
  'part-1-chapter-6',
  'part-2-chapter-1',
  'part-2-chapter-2',
  'part-2-chapter-3',
  'part-2-chapter-4',
]);

function safeFilename(value) {
  return String(value || 'cbse-class-12-accountancy-premium')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Vary', 'Authorization');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, nosnippet');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const authorization = getAuthorization(req);
  if (!authorization) return res.status(401).json({ error: 'Sign in to check your CBSE Class 12 Accountancy Premium access.', productId: PRODUCT_ID });

  const resourceKey = String(req.body?.resourceKey || '').trim();
  if (!ALLOWED_RESOURCES.has(resourceKey)) return res.status(404).json({ error: 'Premium resource not found.' });

  try {
    const user = await verifyUser(authorization);
    if (!user) return res.status(401).json({ error: 'Unable to verify your sign-in.', productId: PRODUCT_ID });

    const allowed = await hasProductAccess(authorization, PRODUCT_ID);
    if (!allowed) return res.status(403).json({ error: 'This chapter requires Commerce Mega Premium access.', productId: PRODUCT_ID });

    const metadataRows = await serviceRequest(
      `/rest/v1/premium_cbse_12_accountancy_notes?resource_key=eq.${encodeURIComponent(resourceKey)}&select=resource_key,part,chapter,title,pages,sha256`,
    );
    const metadata = Array.isArray(metadataRows) ? metadataRows[0] : null;
    if (!metadata) return res.status(404).json({ error: 'This Premium chapter is being synced. Please try again shortly.' });

    const chunks = await serviceRequest(
      `/rest/v1/premium_cbse_12_accountancy_chunks?resource_key=eq.${encodeURIComponent(resourceKey)}&select=chunk_index,payload&order=chunk_index.asc`,
    );
    if (!Array.isArray(chunks) || !chunks.length) return res.status(404).json({ error: 'This Premium chapter is being synced. Please try again shortly.' });

    const compressed = Buffer.from(chunks.map((item) => item.payload).join(''), 'base64');
    const pdf = inflateSync(compressed);
    const validHeader = pdf.subarray(0, 5).toString() === '%PDF-';
    const validHash = createHash('sha256').update(pdf).digest('hex') === metadata.sha256;
    if (!validHeader || !validHash) {
      console.error('premium-cbse12-accountancy-integrity', resourceKey, validHeader, validHash);
      return res.status(503).json({ error: 'Unable to load this PDF safely. Please try again.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename(metadata.title)}.pdf"`);
    res.setHeader('Content-Length', String(pdf.length));
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('premium-cbse12-accountancy', error?.message || error);
    return res.status(503).json({ error: 'Unable to load this Premium resource right now. Please try again.' });
  }
}
