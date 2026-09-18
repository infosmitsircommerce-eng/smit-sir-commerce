import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import {
  getAuthorization,
  hasProductAccess,
  serviceRequest,
  verifyUser,
} from './_purchase-utils.js';

const GSEB_PRODUCT_ID = 'gseb-11-accountancy-part1';
const CBSE12_PRODUCT_ID = 'cbse-12-accountancy';
const MASTER_KEY = 'complete-book';
const GSEB_RESOURCES = new Set([
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
const CBSE12_RESOURCES = new Set([
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
  return String(value || 'accountancy-premium')
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

  const cbse12 = req.body?.library === 'cbse12';
  const productId = cbse12 ? CBSE12_PRODUCT_ID : GSEB_PRODUCT_ID;
  const resourceKey = String(req.body?.resourceKey || '').trim();
  const allowedResources = cbse12 ? CBSE12_RESOURCES : GSEB_RESOURCES;

  const authorization = getAuthorization(req);
  if (!authorization) {
    return res.status(401).json({
      error: cbse12
        ? 'Sign in to check your CBSE Class 12 Accountancy Premium access.'
        : 'Sign in to check your GSEB Class 11 Accountancy Premium access.',
      productId,
    });
  }

  if (!allowedResources.has(resourceKey)) return res.status(404).json({ error: 'Premium resource not found.' });

  try {
    const user = await verifyUser(authorization);
    if (!user) return res.status(401).json({ error: 'Unable to verify your sign-in.', productId });

    const allowed = await hasProductAccess(authorization, productId);
    if (!allowed) {
      return res.status(403).json({
        error: cbse12
          ? 'This chapter requires Commerce Mega Premium access.'
          : 'This PDF is inside the GSEB Std. 11 Accountancy Part 1 Premium Book.',
        productId,
      });
    }

    const storageKey = cbse12 ? resourceKey : MASTER_KEY;
    const metadataPath = cbse12
      ? `/rest/v1/premium_cbse_12_accountancy_notes?resource_key=eq.${encodeURIComponent(storageKey)}&select=resource_key,part,chapter,title,pages,sha256`
      : `/rest/v1/premium_gseb_11_accountancy_notes?resource_key=eq.${encodeURIComponent(storageKey)}&select=resource_key,title,pages,sha256`;
    const chunksPath = cbse12
      ? `/rest/v1/premium_cbse_12_accountancy_chunks?resource_key=eq.${encodeURIComponent(storageKey)}&select=chunk_index,payload&order=chunk_index.asc`
      : `/rest/v1/premium_gseb_11_accountancy_chunks?resource_key=eq.${encodeURIComponent(storageKey)}&select=chunk_index,payload&order=chunk_index.asc`;

    const metadataRows = await serviceRequest(metadataPath);
    const metadata = Array.isArray(metadataRows) ? metadataRows[0] : null;
    if (!metadata) return res.status(404).json({ error: 'The Premium PDF is being synced. Please try again shortly.' });

    const chunks = await serviceRequest(chunksPath);
    if (!Array.isArray(chunks) || !chunks.length) return res.status(404).json({ error: 'The Premium PDF is being synced. Please try again shortly.' });

    const compressed = Buffer.from(chunks.map((item) => item.payload).join(''), 'base64');
    const pdf = inflateSync(compressed);
    const validHeader = pdf.subarray(0, 5).toString() === '%PDF-';
    const validHash = createHash('sha256').update(pdf).digest('hex') === metadata.sha256;
    if (!validHeader || !validHash) {
      console.error('premium-accountancy-integrity', cbse12 ? 'cbse12' : 'gseb11', resourceKey, validHeader, validHash);
      return res.status(503).json({ error: 'Unable to load this PDF safely. Please try again.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      cbse12
        ? `inline; filename="${safeFilename(metadata.title)}.pdf"`
        : 'inline; filename="gseb-class-11-accountancy-part-1-premium-complete-book.pdf"',
    );
    res.setHeader('Content-Length', String(pdf.length));
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('premium-accountancy', error?.message || error);
    return res.status(503).json({ error: 'Unable to load this Premium resource right now. Please try again.' });
  }
}
