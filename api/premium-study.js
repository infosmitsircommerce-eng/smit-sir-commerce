import { verifiedQuizPacks } from '../src/data/quizzes.js';
import { applyPremiumUpgrades } from '../src/data/quizPremiumUpgrades.js';
import { createHash } from 'node:crypto';
import {
  getAuthorization,
  hasProductAccess,
  productIdForQuizPack,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  verifyUser,
} from './_purchase-utils.js';

applyPremiumUpgrades(verifiedQuizPacks);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Authorization');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, nosnippet');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authorization = getAuthorization(req);
  if (!authorization) return res.status(401).json({ error: 'Please sign in to open Premium study guides.' });

  try {
    const user = await verifyUser(authorization);
    if (!user) return res.status(401).json({ error: 'Unable to verify your sign-in.' });
    const headers = { apikey: SUPABASE_ANON_KEY, Authorization: authorization };

    if (req.body?.gsebChapter !== undefined) {
      const chapter = req.body.gsebChapter;
      if (!Number.isInteger(chapter) || chapter < 2 || chapter > 11) return res.status(404).json({ error: 'Premium notes not found.' });
      const allowed = await hasProductAccess(authorization, 'gseb-12-economics');
      if (!allowed) return res.status(403).json({ error: 'This PDF requires the GSEB Class 12 Economics Board Booster.' });

      const notesResponse = await fetch(`${SUPABASE_URL}/rest/v1/premium_gseb_economics_notes?chapter=eq.${chapter}&select=file_base64,sha256`, { headers });
      if (!notesResponse.ok) return res.status(503).json({ error: 'Premium notes are temporarily unavailable.' });
      const [notes] = await notesResponse.json();
      if (!notes) return res.status(404).json({ error: 'Premium notes not found.' });
      const pdf = Buffer.from(notes.file_base64, 'base64');
      if (pdf.subarray(0, 5).toString() !== '%PDF-' || createHash('sha256').update(pdf).digest('hex') !== notes.sha256) {
        return res.status(503).json({ error: 'Unable to load the PDF safely. Please try again.' });
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="gseb-class-12-economics-chapter-${chapter}-premium-notes.pdf"`);
      return res.status(200).send(pdf);
    }

    const pack = verifiedQuizPacks.find((item) => item.id === req.body?.packId);
    if (!pack || pack.board !== 'CBSE' || pack.subject !== 'Economics') return res.status(404).json({ error: 'Study guide not found' });
    const productId = productIdForQuizPack(pack);
    if (!productId || !(await hasProductAccess(authorization, productId))) {
      return res.status(403).json({ error: 'This guide requires the matching Economics Board Booster pack.' });
    }

    const concepts = [...pack.levels.Easy, ...pack.levels.Moderate].map((item, index) => ({
      title: `Concept ${index + 1}`,
      prompt: item.q,
      explanation: item.explanation,
    }));
    const worked = [...pack.levels.Hard, ...pack.levels.Extreme].map((item, index) => ({
      level: index < 10 ? 'Hard' : 'Extreme',
      question: item.q,
      options: item.options,
      answer: item.answer,
      explanation: item.explanation,
    }));
    return res.status(200).json({ id: pack.id, title: pack.title, classLevel: pack.classLevel, stream: pack.stream, source: pack.source, concepts, worked, productId });
  } catch (error) {
    console.error('premium-study', error?.message || error);
    return res.status(503).json({ error: 'Unable to load this guide. Please try again.' });
  }
}
