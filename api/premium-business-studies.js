import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import {
  getAuthorization,
  hasProductAccess,
  serviceRequest,
  serviceRoleKey,
  verifyUser,
} from './_purchase-utils.js';
import {
  CBSE_12_BST_PRODUCT_ID,
  cbse12BusinessStudiesPremiumMaterials,
} from '../src/data/cbse12BusinessStudiesPremium.js';

const RESOURCES = new Set(cbse12BusinessStudiesPremiumMaterials.map((item) => item.resourceKey));

function safeFilename(value) {
  return String(value || 'business-studies-premium')
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

  const resourceKey = String(req.body?.resourceKey || '').trim();
  if (!RESOURCES.has(resourceKey)) return res.status(404).json({ error: 'Premium Business Studies resource not found.' });

  const authorization = getAuthorization(req);
  if (!authorization) return res.status(401).json({ error: 'Sign in to check your Business Studies Premium access.', productId: CBSE_12_BST_PRODUCT_ID });

  try {
    const user = await verifyUser(authorization);
    if (!user) return res.status(401).json({ error: 'Unable to verify your sign-in.', productId: CBSE_12_BST_PRODUCT_ID });

    const allowed = await hasProductAccess(authorization, CBSE_12_BST_PRODUCT_ID);
    if (!allowed) {
      return res.status(403).json({
        error: 'This Detailed Premium Master requires Commerce Mega Premium access.',
        productId: CBSE_12_BST_PRODUCT_ID,
      });
    }

    // Premium PDF storage uses privileged Supabase reads. Fail cleanly when
    // deployment configuration is incomplete instead of throwing/logging a
    // server configuration detail for every legitimate student request.
    if (!serviceRoleKey()) {
      res.setHeader('Retry-After', '60');
      return res.status(503).json({
        error: 'Premium study files are temporarily unavailable. Please try again shortly.',
      });
    }

    const metadataRows = await serviceRequest(
      `/rest/v1/premium_cbse_12_bst_notes?resource_key=eq.${encodeURIComponent(resourceKey)}&select=resource_key,chapter,title,pages,sha256`,
    );
    const metadata = Array.isArray(metadataRows) ? metadataRows[0] : null;
    if (!metadata) return res.status(404).json({ error: 'This Premium PDF is being synced. Please try again shortly.' });

    const chunks = await serviceRequest(
      `/rest/v1/premium_cbse_12_bst_chunks?resource_key=eq.${encodeURIComponent(resourceKey)}&select=chunk_index,payload&order=chunk_index.asc`,
    );
    if (!Array.isArray(chunks) || !chunks.length) return res.status(404).json({ error: 'This Premium PDF is being synced. Please try again shortly.' });

    const compressed = Buffer.from(chunks.map((item) => item.payload).join(''), 'base64');
    const pdf = inflateSync(compressed);
    const validHeader = pdf.subarray(0, 5).toString() === '%PDF-';
    const validHash = createHash('sha256').update(pdf).digest('hex') === metadata.sha256;
    if (!validHeader || !validHash) {
      console.error('premium-bst-integrity', resourceKey, validHeader, validHash);
      return res.status(503).json({ error: 'Unable to load this PDF safely. Please try again.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename(`chapter-${metadata.chapter}-${metadata.title}`)}.pdf"`);
    res.setHeader('Content-Length', String(pdf.length));
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('premium-business-studies', resourceKey, error?.message || error);
    return res.status(503).json({ error: 'Unable to load this Premium resource right now. Please try again.' });
  }
}
