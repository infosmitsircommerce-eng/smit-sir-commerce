import { createHash } from 'node:crypto';
import {
  getAuthorization,
  hasProductAccess,
  serviceRequest,
  verifyUser,
} from './_purchase-utils.js';

const PRODUCT_ID = 'gseb-11-accountancy-part1';
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
  'complete-book',
]);

function safeFilename(resourceKey) {
  if (resourceKey === 'complete-book') return 'gseb-class-11-accountancy-part-1-premium-complete-book.pdf';
  const chapter = resourceKey.replace('chapter-', '');
  return `gseb-class-11-accountancy-chapter-${chapter}-premium-complete.pdf`;
}

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

    const rows = await serviceRequest(
      `/rest/v1/premium_gseb_11_accountancy_notes?resource_key=eq.${encodeURIComponent(resourceKey)}&select=resource_key,title,pages,file_base64,sha256`,
    );
    const notes = Array.isArray(rows) ? rows[0] : null;
    if (!notes) return res.status(404).json({ error: 'This Premium PDF is being synced. Please try again shortly.' });

    const pdf = Buffer.from(notes.file_base64, 'base64');
    const validHeader = pdf.subarray(0, 5).toString() === '%PDF-';
    const validHash = createHash('sha256').update(pdf).digest('hex') === notes.sha256;
    if (!validHeader || !validHash) {
      console.error('premium-accountancy-integrity', resourceKey, validHeader, validHash);
      return res.status(503).json({ error: 'Unable to load this PDF safely. Please try again.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename(resourceKey)}"`);
    res.setHeader('Content-Length', String(pdf.length));
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('premium-accountancy', error?.message || error);
    return res.status(503).json({ error: 'Unable to load this Premium resource right now. Please try again.' });
  }
}
