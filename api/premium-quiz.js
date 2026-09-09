import { verifiedQuizPacks } from '../src/data/quizzes.js';
import { applyPremiumUpgrades } from '../src/data/quizPremiumUpgrades.js';
applyPremiumUpgrades(verifiedQuizPacks);
const base = 'https://abpruwygnsmeqisaehip.supabase.co';
const key = 'sb_publishable_9eybAsihq3-YNL1uGmGo3w_DWheWwRg';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Authorization');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { packId, level } = req.body || {};
  if (!['Hard', 'Extreme'].includes(level)) return res.status(400).json({ error: 'Invalid quiz level' });
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) return res.status(401).json({ error: 'Please sign in to access Premium quizzes.' });
  try {
    const headers = { apikey: key, Authorization: authorization };
    const auth = await fetch(base + '/auth/v1/user', { headers });
    if (!auth.ok) return res.status(auth.status >= 500 ? 503 : 401).json({ error: 'Unable to verify your sign-in. Please try again.' });
    const user = await auth.json();
    if (!user.id) return res.status(401).json({ error: 'Invalid session' });
    const response = await fetch(base + '/rest/v1/profiles?id=eq.' + encodeURIComponent(user.id) + '&select=is_premium,premium_until,is_admin,role', { headers });
    if (!response.ok) return res.status(503).json({ error: 'Access verification is temporarily unavailable.' });
    const [profile] = await response.json();
    const expiry = profile?.premium_until;
    const active = profile?.is_premium === true && (expiry == null || (Number.isFinite(Date.parse(expiry)) && Date.parse(expiry) > Date.now()));
    if (!active && profile?.is_admin !== true && profile?.role !== 'admin') return res.status(403).json({ error: 'This quiz requires Premium access.' });
    const pack = verifiedQuizPacks.find(p => p.id === packId);
    if (!pack) return res.status(404).json({ error: 'Quiz not found' });
    return res.status(200).json({ questions: pack.levels[level] });
  } catch {
    return res.status(503).json({ error: 'Unable to load this quiz. Please try again.' });
  }
}
