const ALLOWED_ORIGINS = [
  'https://smitsircommerce.in',
  'https://www.smitsircommerce.in',
];

function clean(value, max = 500) {
  return String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, max);
}

function list(value) {
  if (!Array.isArray(value)) return '';
  return value.map((item) => clean(item, 80)).filter(Boolean).join(', ');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = req.headers.origin || '';
  const isAllowedOrigin =
    !origin ||
    ALLOWED_ORIGINS.includes(origin) ||
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

  if (!isAllowedOrigin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return res.status(503).json({ error: 'Email notifications are not configured' });
  }

  const body = req.body || {};
  const fullName = clean(body.fullName, 80);
  const mobile = clean(body.mobile, 30);
  const digits = mobile.replace(/\D/g, '');

  if (fullName.length < 2 || digits.length < 10 || digits.length > 15 || body.consent !== true) {
    return res.status(400).json({ error: 'Invalid enquiry data' });
  }

  const parentMobile = clean(body.parentMobile, 30);
  const classLevel = clean(body.classLevel, 10);
  const board = clean(body.board, 20);
  const subjects = list(body.subjects);
  const studyMode = clean(body.studyMode, 20);
  const preferredTime = clean(body.preferredTime, 30);
  const source = clean(body.source, 60);
  const intent = clean(body.intent, 60);
  const message = clean(body.message, 1000);
  const firstPath = clean(body.firstPath, 240);

  const text = [
    'New enquiry received on Smit Sir Commerce',
    '',
    `Student: ${fullName}`,
    `Mobile: ${mobile}`,
    parentMobile ? `Parent/Guardian mobile: ${parentMobile}` : null,
    classLevel ? `Class: ${classLevel}` : null,
    board ? `Board: ${board}` : null,
    subjects ? `Subjects: ${subjects}` : null,
    studyMode ? `Learning mode: ${studyMode}` : null,
    preferredTime ? `Preferred contact time: ${preferredTime}` : null,
    source ? `Source: ${source}` : null,
    intent ? `Intent: ${intent}` : null,
    firstPath ? `Page: ${firstPath}` : null,
    '',
    message ? `Message: ${message}` : 'Message: —',
    '',
    `Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
  ].filter(Boolean).join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM_EMAIL || 'Smit Sir Commerce <onboarding@resend.dev>',
        to: [process.env.ENQUIRY_TO_EMAIL || 'infosmitsircommerce@gmail.com'],
        subject: `New website enquiry — ${fullName}`,
        text,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Resend API error:', result);
      return res.status(502).json({ error: 'Could not send enquiry email' });
    }

    return res.status(200).json({ ok: true, id: result.id || null });
  } catch (error) {
    console.error('Enquiry email error:', error);
    return res.status(500).json({ error: 'Could not send enquiry email' });
  }
}
