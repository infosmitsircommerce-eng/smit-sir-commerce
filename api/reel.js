import Groq from 'groq-sdk';
import { enforceRateLimit, enforceSiteOrigin, noStore } from './_request-guard.js';

const ALLOWED_COUNTS = new Set([1, 3, 7, 14, 30]);
const ALLOWED_AUDIENCES = new Set(['Class 11', 'Class 12', 'Parents', 'General']);
const ALLOWED_STYLES = new Set(['Educational', 'Shocking Fact', 'Myth vs Truth', 'Story Format', 'Quick Tips']);

function client() {
  const apiKey = process.env.GROQ_API_KEY || '';
  return apiKey ? new Groq({ apiKey }) : null;
}

export default async function handler(req, res) {
  noStore(res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!enforceSiteOrigin(req, res)) return;
  if (!enforceRateLimit(req, res, { bucket: 'reel', limit: 3, windowMs: 5 * 60_000 })) return;

  const topic = String(req.body?.topic || '').trim();
  const requestedCount = Number(req.body?.count ?? 7);
  const count = ALLOWED_COUNTS.has(requestedCount) ? requestedCount : 7;
  const audience = ALLOWED_AUDIENCES.has(req.body?.audience) ? req.body.audience : 'Class 12';
  const style = ALLOWED_STYLES.has(req.body?.style) ? req.body.style : 'Educational';

  if (!topic) return res.status(400).json({ error: 'Topic is required' });
  if (topic.length > 160) return res.status(400).json({ error: 'Topic is too long' });

  const groq = client();
  if (!groq) return res.status(503).json({ error: 'AI content generation is temporarily unavailable.' });

  const prompt = `Create ${count} Instagram Reel scripts for Smit Sir Commerce, a Commerce education platform created by Smit Thaker in Mehsana, Gujarat, India.

TOPIC: ${topic}
TARGET AUDIENCE: ${audience} Commerce students & parents
STYLE: ${style}

For EACH Reel, return EXACTLY this format (no extra text):

---REEL [number]---
TITLE: [catchy title for the reel, max 8 words]
HOOK: [0-3 seconds — one strong curiosity-building sentence]
SCRIPT:
[Point 1 — 1 sentence, simple language]
[Point 2 — 1 sentence, with a relevant everyday Indian example when useful]
[Point 3 — 1 sentence, connect to board-exam understanding when relevant]
[Point 4 — 1 sentence, practical takeaway]
TEXT_OVERLAYS:
[Line 1: text to flash on screen]
[Line 2: text to flash on screen]
[Line 3: text to flash on screen]
[Line 4: text to flash on screen]
HASHTAGS: [10 relevant hashtags; include #SmitSirCommerce]
CTA: [Last 3 seconds — one action: follow, comment, save, or visit website]
DURATION: [estimated seconds, between 30-60]
---END---

Rules:
- Keep language simple and natural.
- Each Reel should use a different hook or teaching angle.
- Do not invent student results, ranks, success rates, batch timings, fees or qualifications.
- Do not present made-up statistics as facts.
- Make it sound like a teacher explaining a concept, not like a textbook.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You write concise, accurate educational social scripts. Follow the requested format and never invent business claims or student results.',
        },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.85,
      max_tokens: 4000,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return res.status(502).json({ error: 'No response from AI.' });

    const reels = [];
    const reelBlocks = raw.split(/---REEL \d+---/).filter((block) => block.trim());

    reelBlocks.forEach((block, i) => {
      const clean = block.replace(/---END---/g, '').trim();
      const get = (label) => {
        const regex = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`, 'i');
        const match = clean.match(regex);
        return match ? match[1].trim() : '';
      };

      const scriptRaw = get('SCRIPT');
      const script = scriptRaw.split('\n').filter((line) => line.trim()).map((line) => line.replace(/^\[|\]$/g, '').trim());
      const overlayRaw = get('TEXT_OVERLAYS');
      const overlays = overlayRaw.split('\n').filter((line) => line.trim()).map((line) => line.replace(/^\[|\]$|^\[Line \d+:\s*/g, '').replace(/\]$/, '').trim());

      reels.push({
        id: i + 1,
        title: get('TITLE'),
        hook: get('HOOK'),
        script,
        overlays,
        hashtags: get('HASHTAGS'),
        cta: get('CTA'),
        duration: get('DURATION') || '45',
      });
    });

    return res.status(200).json({ reels, raw });
  } catch (err) {
    console.error('Reel API error:', err?.status || err?.message || 'unknown');
    if (err?.status === 429) return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
    return res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
}
