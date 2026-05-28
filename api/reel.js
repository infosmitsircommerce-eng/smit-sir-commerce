import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { topic, count = 7, audience = 'Class 12', style = 'Educational' } = req.body || {};
  if (!topic?.trim()) return res.status(400).json({ error: 'Topic is required' });

  const prompt = `You are a viral Instagram Reels expert for Indian education content. Create ${count} Instagram Reel scripts for "Smit Sir Commerce" — a CBSE Class 11 & 12 Commerce coaching in Mehsana, Gujarat, India.

TOPIC: ${topic}
TARGET AUDIENCE: ${audience} Commerce students & parents
STYLE: ${style}

For EACH Reel, return EXACTLY this format (no extra text):

---REEL [number]---
TITLE: [catchy title for the reel, max 8 words]
HOOK: [0-3 seconds — ONE shocking sentence that stops the scroll. Start with a bold claim, surprising fact, or controversial question. Make them stop scrolling instantly.]
SCRIPT:
[Point 1 — 1 sentence, simple language]
[Point 2 — 1 sentence, with Indian example like onions/petrol/cricket/Jio]
[Point 3 — 1 sentence, connect to CBSE board exam]
[Point 4 — 1 sentence, practical takeaway]
TEXT_OVERLAYS:
[Line 1: text to flash on screen]
[Line 2: text to flash on screen]
[Line 3: text to flash on screen]
[Line 4: text to flash on screen]
HASHTAGS: [10 hashtags, mix of Hindi+English, include #CBSECommerce #SmitSirCommerce #Class12Economics]
CTA: [Last 3 seconds — one action: follow, comment, save, or visit website]
DURATION: [estimated seconds, between 30-60]
---END---

Rules:
- Use emojis generously
- Keep language simple, like talking to a 17-year-old
- Use real Indian examples (Reliance, Zomato, Jio, petrol prices, onion prices, cricket)
- Each reel must be DIFFERENT style — don't repeat hooks
- Make it sound like Smit Sir is personally talking, not reading a textbook
- HOOK must be genuinely shocking or curiosity-inducing`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a viral Instagram Reels script writer for Indian education content. Follow the exact format requested. Be creative and engaging.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.9,
      max_tokens: 4000,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return res.status(502).json({ error: 'No response from AI.' });

    // Parse the reels from the raw text
    const reels = [];
    const reelBlocks = raw.split(/---REEL \d+---/).filter(b => b.trim());

    reelBlocks.forEach((block, i) => {
      const clean = block.replace(/---END---/g, '').trim();
      const get = (label) => {
        const regex = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`, 'i');
        const match = clean.match(regex);
        return match ? match[1].trim() : '';
      };

      const scriptRaw = get('SCRIPT');
      const scriptLines = scriptRaw.split('\n').filter(l => l.trim()).map(l => l.replace(/^\[|\]$/g, '').trim());

      const overlayRaw = get('TEXT_OVERLAYS');
      const overlays = overlayRaw.split('\n').filter(l => l.trim()).map(l => l.replace(/^\[|\]$|^\[Line \d+:\s*/g, '').replace(/\]$/, '').trim());

      reels.push({
        id: i + 1,
        title: get('TITLE'),
        hook: get('HOOK'),
        script: scriptLines,
        overlays,
        hashtags: get('HASHTAGS'),
        cta: get('CTA'),
        duration: get('DURATION') || '45',
      });
    });

    return res.status(200).json({ reels, raw });
  } catch (err) {
    console.error('Reel API error:', err);
    if (err.status === 429) {
      return res.status(429).json({ error: 'Too many requests! Please wait a moment and try again.' });
    }
    return res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
}
