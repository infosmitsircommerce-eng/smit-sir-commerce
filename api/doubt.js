import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { question } = req.body || {};
  if (!question?.trim()) return res.status(400).json({ error: 'Question is required' });

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Smit Sir's AI assistant — an expert CBSE Class 11 & 12 Commerce teacher from India specializing in Economics, Accountancy, and Business Studies.

When a student asks a question:
1. Give a CLEAR, SIMPLE explanation (2-3 sentences max)
2. Give ONE real-life Indian example they can relate to
3. If there's a formula, show it clearly
4. End with a short CBSE Board Exam tip (if relevant)

Rules:
- Keep total response under 180 words
- Use simple English that Class 11-12 students understand
- Use emojis sparingly to highlight key points
- Format with short paragraphs, not bullet points
- Always be encouraging`
        },
        {
          role: 'user',
          content: question
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 300,
    });

    const answer = completion.choices[0]?.message?.content;
    if (!answer) return res.status(502).json({ error: 'No response from AI. Try again.' });

    return res.status(200).json({ answer });
  } catch (err) {
    console.error('Doubt API error:', err);
    if (err.status === 429) {
      return res.status(429).json({ error: 'Too many requests! Please wait a moment.' });
    }
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
