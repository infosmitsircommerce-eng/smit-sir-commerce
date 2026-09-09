import { verifiedQuizPacks } from '../src/data/quizzes.js';
import { applyPremiumUpgrades } from '../src/data/quizPremiumUpgrades.js';
applyPremiumUpgrades(verifiedQuizPacks);
const base = 'https://abpruwygnsmeqisaehip.supabase.co';
const key = 'sb_publishable_9eybAsihq3-YNL1uGmGo3w_DWheWwRg';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Authorization');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) return res.status(401).json({ error: 'Please sign in to open Premium study guides.' });
  try {
    const headers = { apikey: key, Authorization: authorization };
    const auth = await fetch(base + '/auth/v1/user', { headers });
    if (!auth.ok) return res.status(auth.status >= 500 ? 503 : 401).json({ error: 'Unable to verify your sign-in.' });
    const user = await auth.json();
    const profileResponse = await fetch(base + '/rest/v1/profiles?id=eq.' + encodeURIComponent(user.id) + '&select=is_premium,premium_until,is_admin,role', { headers });
    if (!profileResponse.ok) return res.status(503).json({ error: 'Access verification is temporarily unavailable.' });
    const [profile] = await profileResponse.json();
    const expiry = profile?.premium_until;
    const premium = profile?.is_premium === true && (expiry == null || (Number.isFinite(Date.parse(expiry)) && Date.parse(expiry) > Date.now()));
    if (!premium && profile?.is_admin !== true && profile?.role !== 'admin') return res.status(403).json({ error: 'This guide requires Premium access.' });
    const pack = verifiedQuizPacks.find((item) => item.id === req.body?.packId);
    if (!pack || pack.board !== 'CBSE' || pack.subject !== 'Economics') return res.status(404).json({ error: 'Study guide not found' });
    const concepts = [...pack.levels.Easy, ...pack.levels.Moderate].map((item, index) => ({ title: 'Concept ' + (index + 1), prompt: item.q, explanation: item.explanation }));
    const worked = [...pack.levels.Hard, ...pack.levels.Extreme].map((item, index) => ({ level: index < 10 ? 'Hard' : 'Extreme', question: item.q, options: item.options, answer: item.answer, explanation: item.explanation }));
    return res.status(200).json({ id: pack.id, title: pack.title, classLevel: pack.classLevel, stream: pack.stream, source: pack.source, concepts, worked });
  } catch {
    return res.status(503).json({ error: 'Unable to load this guide. Please try again.' });
  }
}
