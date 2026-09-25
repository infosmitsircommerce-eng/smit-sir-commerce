const PDFS = {
  u1c1: { filename: 'unit1-ch01-business-environment.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/a4d61fe2-eaf8-4be1-90ee-885904dd1977-unit1-ch01-business-environment.pdf' },
  u1c2: { filename: 'unit1-ch02-international-business-trade-theories.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/762919b8-e15d-4da2-902b-d2b87b942df9-unit1-ch02-international-business-trade-theories.pdf' },
  u1c3: { filename: 'unit1-ch03-trade-policy-fdi-fpi-bop.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/d1b03787-fcff-456c-bb38-cf996de3b781-unit1-ch03-trade-policy-fdi-fpi-bop.pdf' },
  u1c4: { filename: 'unit1-ch04-integration-imf-worldbank-wto.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/f32df534-d557-4278-bc1b-b49c28efb658-unit1-ch04-integration-imf-worldbank-wto.pdf' },
  u10c1: { filename: 'unit10-ch01-basic-concepts-income-tax.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/c29095b0-4664-40cc-9292-7e5d8be33d14-unit10-ch01-basic-concepts-income-tax.pdf' },
  u10c2: { filename: 'unit10-ch02-exempted-agricultural-income.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/c43fb1a8-a5c1-4050-ac88-9d400faf0c2d-unit10-ch02-exempted-agricultural-income.pdf' },
  u10c3: { filename: 'unit10-ch03-heads-of-income.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/c489b5a5-70a7-48fe-9b69-2544a523d695-unit10-ch03-heads-of-income.pdf' },
  u10c4: { filename: 'unit10-ch04-clubbing-of-income.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/be8e0166-ecf0-4f7b-9cb9-f09ad0e3d1c7-unit10-ch04-clubbing-of-income.pdf' },
  u10c5: { filename: 'unit10-ch05-setoff-carry-forward-losses.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/63acf4a9-7e21-4f2e-a4a7-ad2c76b121f6-unit10-ch05-setoff-carry-forward-losses.pdf' },
  u10c6: { filename: 'unit10-ch06-deductions-gross-total-income.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/ae2be955-ac05-42a1-ab63-8ef13a0f96b9-unit10-ch06-deductions-gross-total-income.pdf' },
  u10c7: { filename: 'unit10-ch07-total-income-tax-liability.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/03abb78c-9d29-4a87-939a-bcf7e23e91e4-unit10-ch07-total-income-tax-liability.pdf' },
  u10c8: { filename: 'unit10-ch08-international-tax-transfer-pricing.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/5f123877-abaa-497f-b8ce-fdb2f59a566e-unit10-ch08-international-tax-transfer-pricing.pdf' },
  u10c9: { filename: 'unit10-ch09-corporate-tax-planning.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/897c3676-24e5-42db-99fd-c86f69a77674-unit10-ch09-corporate-tax-planning.pdf' },
  u10c10: { filename: 'unit10-ch10-tds-tcs-advance-tax-efiling.pdf', url: 'https://smit-sir-ccsp-assets.floot.app/_cdn/static/cca1be57-9255-4e0d-9415-37c146ae854c-unit10-ch10-tds-tcs-advance-tax-efiling.pdf' },
};

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const key = String(req.query?.key || '').trim();
  const item = PDFS[key];
  if (!item) return res.status(404).json({ error: 'PDF not found.' });

  try {
    const upstream = await fetch(item.url, { redirect: 'follow' });
    if (!upstream.ok) return res.status(502).json({ error: 'PDF source is temporarily unavailable.' });

    const type = upstream.headers.get('content-type') || '';
    if (!type.toLowerCase().includes('pdf')) {
      return res.status(502).json({ error: 'Invalid PDF response.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${item.filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    res.setHeader('X-Robots-Tag', 'noindex');

    const length = upstream.headers.get('content-length');
    if (length) res.setHeader('Content-Length', length);
    if (req.method === 'HEAD') return res.status(200).end();

    const buffer = Buffer.from(await upstream.arrayBuffer());
    return res.status(200).send(buffer);
  } catch (error) {
    console.error('gset-pdf', key, error?.message || error);
    return res.status(503).json({ error: 'Unable to load this PDF right now.' });
  }
}
