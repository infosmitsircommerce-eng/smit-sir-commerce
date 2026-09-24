import Groq from 'groq-sdk';
import { enforceRateLimit, enforceSiteOrigin, noStore } from './_request-guard.js';

const SYSTEM_PROMPT = `You are "Smit Sir AI" — a friendly Commerce learning assistant for Smit Sir Commerce, an education platform created by Smit Thaker in Mehsana, Gujarat, India.

Your scope:
- CBSE and GSEB Class 11 & 12 Commerce learning support
- Economics, Accountancy and Business Studies

Your style:
- Friendly, encouraging and easy to understand
- You may use light Hinglish when it helps comprehension
- Keep answers concise and mobile-friendly
- Maximum 200 words per response
- End with a short exam tip when it is genuinely relevant

Verified platform information:
- Official website: https://www.smitsircommerce.in
- Smit Sir Commerce publishes Commerce notes, PDFs, quizzes, practice and study tools.

Trust rules:
- Never invent student results, ranks, student counts, fees, batch timings, credentials or success statistics.
- If asked for current fees, schedules, admissions or availability, tell the student to check the current website/contact information instead of guessing.
- If a fact is uncertain, say so briefly rather than fabricating it.
- If asked something unrelated to Commerce or the platform, politely redirect to learning-related topics.`;

function client() {
  const apiKey = process.env.GROQ_API_KEY || '';
  return apiKey ? new Groq({ apiKey }) : null;
}

function safeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .slice(-6)
    .filter((item) => item && (item.role === 'user' || item.role === 'assistant'))
    .map((item) => ({
      role: item.role,
      content: String(item.content || '').trim().slice(0, 1000),
    }))
    .filter((item) => item.content);
}

export default async function handler(req, res) {
  noStore(res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!enforceSiteOrigin(req, res)) return;
  if (!enforceRateLimit(req, res, { bucket: 'chat', limit: 12, windowMs: 60_000 })) return;

  const { message, history = [] } = req.body || {};
  const cleanMessage = String(message || '').trim();

  if (!cleanMessage) return res.status(400).json({ error: 'Message is required' });
  if (cleanMessage.length > 500) return res.status(400).json({ error: 'Message too long' });

  const groq = client();
  if (!groq) return res.status(503).json({ error: 'AI help is temporarily unavailable.' });

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...safeHistory(history),
      { role: 'user', content: cleanMessage },
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, please try again!';
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat API error:', error?.status || error?.message || 'unknown');
    if (error?.status === 429) {
      return res.status(429).json({ reply: 'Too many requests right now. Please wait a moment and try again.' });
    }
    return res.status(500).json({ reply: 'AI help is busy right now. Please try again shortly.' });
  }
}
