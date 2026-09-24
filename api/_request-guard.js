const ALLOWED_ORIGINS = new Set([
  'https://smitsircommerce.in',
  'https://www.smitsircommerce.in',
]);

const buckets = new Map();
let lastSweep = 0;

function requestIp(req) {
  const forwarded = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || String(req.headers?.['x-real-ip'] || '').trim() || 'unknown';
}

function sweep(now) {
  if (now - lastSweep < 5 * 60_000) return;
  lastSweep = now;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

export function isAllowedSiteOrigin(req) {
  const origin = String(req.headers?.origin || '').trim();
  if (!origin) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

export function enforceSiteOrigin(req, res) {
  if (isAllowedSiteOrigin(req)) return true;
  res.status(403).json({ error: 'Forbidden' });
  return false;
}

export function enforceRateLimit(req, res, { bucket, limit, windowMs }) {
  const now = Date.now();
  sweep(now);
  const key = `${bucket}:${requestIp(req)}`;
  const current = buckets.get(key);
  const entry = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + windowMs }
    : current;

  entry.count += 1;
  buckets.set(key, entry);

  if (entry.count <= limit) return true;

  const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
  res.setHeader('Retry-After', String(retryAfter));
  res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
  return false;
}

export function noStore(res) {
  res.setHeader('Cache-Control', 'private, no-store');
}
