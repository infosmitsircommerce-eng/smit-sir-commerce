import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { getAuthorization, hasProductAccess, serviceRequest, verifyUser } from './_purchase-utils.js';
import { PREMIUM_MEGA_PACK } from '../src/data/premiumMegaPack.js';
import { commerceExtras } from '../src/data/commerceExtras.js';

const RESOURCES = new Set(commerceExtras.map((item) => item.resourceKey));

function safeFilename(value) {
  return String(value || 'commerce-extra-notes')
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
  if (!RESOURCES.has(resourceKey)) return res.status(404).json({ error: 'Premium extra not found.' });

  const authorization = getAuthorization(req);
  if (!authorization) return res.status(401).json({ error: 'Sign in to access Premium Extras.' });

  try {
    const user = await verifyUser(authorization);
    if (!user) return res.status(401).json({ error: 'Unable to verify your sign-in.' });

    const rows = await serviceRequest(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=is_premium,premium_until`,
    );
    const profile = Array.isArray(rows) ? rows[0] : null;
    const premiumUntil = profile?.premium_until ? new Date(profile.premium_until).getTime() : null;
    const legacyPremium = profile?.is_premium === true
      && (premiumUntil === null || (Number.isFinite(premiumUntil) && premiumUntil > Date.now()));
    const megaPremium = await hasProductAccess(authorization, PREMIUM_MEGA_PACK.id);
    if (!legacyPremium && !megaPremium) {
      return res.status(403).json({ error: 'These Extra Notes and Question Papers are locked for Premium members.' });
    }

    const metadataRows = await serviceRequest(
      `/rest/v1/premium_commerce_extras_notes?resource_key=eq.${encodeURIComponent(resourceKey)}&select=resource_key,title,pages,sha256`,
    );
    const metadata = Array.isArray(metadataRows) ? metadataRows[0] : null;
    if (!metadata) return res.status(404).json({ error: 'This Premium PDF is still syncing. Please try again shortly.' });

    const chunks = await serviceRequest(
      `/rest/v1/premium_commerce_extras_chunks?resource_key=eq.${encodeURIComponent(resourceKey)}&select=chunk_index,payload&order=chunk_index.asc`,
    );
    if (!Array.isArray(chunks) || !chunks.length) return res.status(404).json({ error: 'This Premium PDF is still syncing. Please try again shortly.' });

    const compressed = Buffer.from(chunks.map((item) => item.payload).join(''), 'base64');
    const pdf = inflateSync(compressed);
    const validHeader = pdf.subarray(0, 5).toString() === '%PDF-';
    const validHash = createHash('sha256').update(pdf).digest('hex') === metadata.sha256;
    if (!validHeader || !validHash) {
      console.error('premium-commerce-extra-integrity', resourceKey, validHeader, validHash);
      return res.status(503).json({ error: 'Unable to load this PDF safely. Please try again.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename(metadata.title)}.pdf"`);
    res.setHeader('Content-Length', String(pdf.length));
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('premium-commerce-extra', resourceKey, error?.message || error);
    return res.status(503).json({ error: 'Unable to load this Premium resource right now. Please try again.' });
  }
}
