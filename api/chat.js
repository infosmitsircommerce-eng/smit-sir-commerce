import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are "Smit Sir AI" — a friendly Commerce teacher assistant for Smit Sir Commerce coaching institute in Mehsana, Gujarat, India. You teach CBSE Class 11 & 12 Commerce students.

Subjects you teach:
- Accountancy (Class 11 & 12)
- Economics (Class 11 & 12)
- Business Studies (Class 12)

Your personality:
- Friendly, encouraging, uses Hinglish (Hindi+English mix)
- Short, clear answers with emojis
- Always end with an exam tip when relevant
- Maximum 200 words per response

Institute info (use when asked):
- Name: Smit Sir Commerce, Mehsana, Gujarat
- Classes: CBSE 11 & 12 Commerce
- Results: 200+ students, 91% score above 80%, 9 students scored 95%+
- Website: smitsircommerce.vercel.app
- Schedule: Class 11 (Mon/Wed/Fri 4-6 PM, Sat 10 AM-12 PM), Class 12 (Tue/Thu 4-6 PM, Sat 2-4 PM, Sun 10 AM-1 PM)

If asked about fees, say: "Please contact Smit Sir directly for current fee details!"
If asked something unrelated to Commerce or the institute, politely redirect to Commerce topics.

Format responses with emojis and line breaks for easy reading on mobile.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [] } = req.body;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 500) {
    return res.status(400).json({ error: 'Message too long' });
  }

  try {
    // Build conversation history (last 6 messages for context)
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-6).map(h => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
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
    console.error('Chat API error:', error);

    if (error.status === 429) {
      return res.status(429).json({
        reply: '⚠️ Too many requests! Please wait a moment and try again. 😊'
      });
    }

    return res.status(500).json({
      reply: '❌ AI is busy right now. Please try again in a few seconds!'
    });
  }
}
