import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import {
  getAuthorization,
  hasProductAccess,
  serviceRequest,
  verifyUser,
} from './_purchase-utils.js';

const PRODUCT_ID = 'gseb-11-accountancy-part1';
const MASTER_KEY = 'complete-book';
const ALLOWED_RESOURCES = new Set([
  'chapter-1',
  'chapter-2',
  'chapter-3',
  'chapter-4',
  'chapter-5',
  'chapter-6',
  'chapter-7',
  'chapter-8',
  'chapter-9',
  'chapter-10',
  MASTER_KEY,
]);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Vary', 'Authorization');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, nosnippet');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const authorization = getAuthorization(req);
  if (!authorization) return res.status(401).json({
    error: 'Sign in to check your GSEB Class 11 Accountancy Premium access.',
    productId: PRODUCT_ID,
  });

  const resourceKey = String(req.body?.resourceKey || '').trim();
  if (!ALLOWED_RESOURCES.has(resourceKey)) return res.status(404).json({ error: 'Premium resource not found.' });

  try {
    const user = await verifyUser(authorization);
    if (!user) return res.status(401).json({ error: 'Unable to verify your sign-in.', productId: PRODUCT_ID });

    const allowed = await hasProductAccess(authorization, PRODUCT_ID);
    if (!allowed) return res.status(403).json({
      error: 'This PDF is inside the GSEB Std. 11 Accountancy Part 1 Premium Book.',
      productId: PRODUCT_ID,
    });

    const metadataRows = await serviceRequest(
      `/rest/v1/premium_gseb_11_accountancy_notes?resource_key=eq.${MASTER_KEY}&select=resource_key,title,pages,sha256`,
    );
    const metadata = Array.isArray(metadataRows) ? metadataRows[0] : null;
    if (!metadata) return res.status(404).json({ error: 'The Premium book is being synced. Please try again shortly.' });

    const chunks = await serviceRequest(
      `/rest/v1/premium_gseb_11_accountancy_chunks?resource_key=eq.${MASTER_KEY}&select=chunk_index,payload&order=chunk_index.asc`,
    );
    if (!Array.isArray(chunks) || !chunks.length) return res.status(404).json({ error: 'The Premium book is being synced. Please try again shortly.' });

    const compressed = Buffer.from(chunks.map((item) => item.payload).join(''), 'base64');
    const pdf = inflateSync(compressed);
    const validHeader = pdf.subarray(0, 5).toString() === '%PDF-';
    const validHash = createHash('sha256').update(pdf).digest('hex') === metadata.sha256;
    if (!validHeader || !validHash) {
      console.error('premium-accountancy-integrity', resourceKey, validHeader, validHash);
      return res.status(503).json({ error: 'Unable to load this PDF safely. Please try again.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="gseb-class-11-accountancy-part-1-premium-complete-book.pdf"');
    res.setHeader('Content-Length', String(pdf.length));
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('premium-accountancy', error?.message || error);
    return res.status(503).json({ error: 'Unable to load this Premium resource right now. Please try again.' });
  }
}
