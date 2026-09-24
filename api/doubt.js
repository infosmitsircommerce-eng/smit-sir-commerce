import Groq from 'groq-sdk';
import { enforceRateLimit, enforceSiteOrigin, noStore } from './_request-guard.js';

function client() {
  const apiKey = process.env.GROQ_API_KEY || '';
  return apiKey ? new Groq({ apiKey }) : null;
}

export default async function handler(req, res) {
  noStore(res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!enforceSiteOrigin(req, res)) return;
  if (!enforceRateLimit(req, res, { bucket: 'doubt', limit: 10, windowMs: 60_000 })) return;

  const question = String(req.body?.question || '').trim();
  if (!question) return res.status(400).json({ error: 'Question is required' });
  if (question.length > 700) return res.status(400).json({ error: 'Question is too long' });

  const groq = client();
  if (!groq) return res.status(503).json({ error: 'AI doubt help is temporarily unavailable.' });

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Smit Sir's Commerce learning assistant for Class 11 and 12 students.

When answering:
1. Give a clear, simple explanation in 2–3 short sentences.
2. Give one everyday Indian example only when it genuinely helps.
3. If a formula is relevant, show it clearly.
4. End with a short board-exam tip when relevant.

Rules:
- Keep the response under 180 words.
- Use simple English suitable for Class 11–12 learners.
- Use emojis sparingly.
- Never invent textbook facts, exam rules, marks, schedules, fees or Smit Sir Commerce claims.
- If uncertain, state the uncertainty briefly rather than guessing.`,
        },
        { role: 'user', content: question },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.6,
      max_tokens: 300,
    });

    const answer = completion.choices[0]?.message?.content;
    if (!answer) return res.status(502).json({ error: 'No response from AI. Try again.' });
    return res.status(200).json({ answer });
  } catch (err) {
    console.error('Doubt API error:', err?.status || err?.message || 'unknown');
    if (err?.status === 429) {
      return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
    }
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
