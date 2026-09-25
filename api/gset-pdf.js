const GSET_PDFS = {
  u6c5: [
    'unit6-ch05-personality-group-behaviour-culture-change.pdf',
    'https://smit-sir-ccsp-assets.floot.app/_cdn/static/1a3802e4-2848-4233-8fb8-360b8bad0db4-gset-u6-c5-personality-group-behaviour-culture-change.pdf',
  ],
};

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const item = GSET_PDFS[String(req.query?.gset || '').trim()];
  if (!item) return res.status(404).json({ error: 'PDF not found.' });

  try {
    const upstream = await fetch(item[1], { redirect: 'follow' });
    if (!upstream.ok) return res.status(502).json({ error: 'PDF is temporarily unavailable.' });

    const type = upstream.headers.get('content-type') || '';
    if (!type.toLowerCase().includes('pdf')) return res.status(502).json({ error: 'Invalid PDF response.' });

    const pdf = Buffer.from(await upstream.arrayBuffer());
    if (pdf.subarray(0, 5).toString() !== '%PDF-') return res.status(502).json({ error: 'Invalid PDF file.' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `${req.query?.download === '1' ? 'attachment' : 'inline'}; filename="${item[0]}"`,
    );
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    res.setHeader('X-Robots-Tag', 'noindex');
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('gset-pdf', req.query?.gset, error?.message || error);
    return res.status(503).json({ error: 'Unable to load this PDF right now.' });
  }
}
