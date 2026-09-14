import { verifiedQuizPacks } from '../src/data/quizzes.js';
import { applyPremiumUpgrades } from '../src/data/quizPremiumUpgrades.js';
import {
  getAuthorization,
  hasProductAccess,
  productIdForQuizPack,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  verifyUser,
} from './_purchase-utils.js';

applyPremiumUpgrades(verifiedQuizPacks);

async function hasLegacyPremium(authorization, userId) {
  const headers = { apikey: SUPABASE_ANON_KEY, Authorization: authorization };
  const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=is_premium,premium_until,is_admin,role`, { headers });
  if (!response.ok) return false;
  const [profile] = await response.json();
  const expiry = profile?.premium_until;
  const active = profile?.is_premium === true && (expiry == null || (Number.isFinite(Date.parse(expiry)) && Date.parse(expiry) > Date.now()));
  return active || profile?.is_admin === true || profile?.role === 'admin';
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Authorization');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { packId, level } = req.body || {};
  if (!['Hard', 'Extreme'].includes(level)) return res.status(400).json({ error: 'Invalid quiz level' });

  const authorization = getAuthorization(req);
  if (!authorization) return res.status(401).json({ error: 'Please sign in to access Premium quizzes.' });

  try {
    const user = await verifyUser(authorization);
    if (!user) return res.status(401).json({ error: 'Unable to verify your sign-in. Please try again.' });

    const pack = verifiedQuizPacks.find((item) => item.id === packId);
    if (!pack) return res.status(404).json({ error: 'Quiz not found' });

    const productId = productIdForQuizPack(pack);
    const allowed = productId
      ? await hasProductAccess(authorization, productId)
      : await hasLegacyPremium(authorization, user.id);

    if (!allowed) {
      return res.status(403).json({
        error: productId ? 'This level requires the matching Board Booster pack.' : 'This quiz requires Premium access.',
        productId,
      });
    }

    return res.status(200).json({ questions: pack.levels[level], productId });
  } catch (error) {
    console.error('premium-quiz', error?.message || error);
    return res.status(503).json({ error: 'Unable to load this quiz. Please try again.' });
  }
}
