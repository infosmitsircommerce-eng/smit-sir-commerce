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

const GSET_PDFS = {
  u1c1: ['unit1-ch01-business-environment.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/a4d61fe2-eaf8-4be1-90ee-885904dd1977-unit1-ch01-business-environment.pdf'],
  u1c2: ['unit1-ch02-international-business-trade-theories.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/762919b8-e15d-4da2-902b-d2b87b942df9-unit1-ch02-international-business-trade-theories.pdf'],
  u1c3: ['unit1-ch03-trade-policy-fdi-fpi-bop.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/d1b03787-fcff-456c-bb38-cf996de3b781-unit1-ch03-trade-policy-fdi-fpi-bop.pdf'],
  u1c4: ['unit1-ch04-integration-imf-worldbank-wto.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/f32df534-d557-4278-bc1b-b49c28efb658-unit1-ch04-integration-imf-worldbank-wto.pdf'],

  u2c1: ['unit2-ch01-accounting-foundations.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/d39d08ef-667b-478a-a02f-fa02ff5c5ec1-gset-u2-c1-accounting-foundations.pdf'],
  u2c2: ['unit2-ch02-partnership-accounts.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/6efa7b74-f7e8-4563-8205-9e41f90ea158-gset-u2-c2-partnership-accounts.pdf'],
  u2c3: ['unit2-ch03-corporate-accounting.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/e4c2c33e-e461-41a8-ad68-cb572226c51b-gset-u2-c3-corporate-accounting.pdf'],
  u2c4: ['unit2-ch04-cost-management-financial-statement-analysis.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/62fdae26-3110-4cda-ab51-bf5d86c546c4-gset-u2-c4-cost-management-fsa.pdf'],
  u2c5: ['unit2-ch05-accounting-standards-ifrs-auditing.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/e5aa6f60-20f4-4de6-96fe-de48c0a7e422-gset-u2-c5-accounting-standards-ifrs-auditing.pdf'],

  u3c1: ['unit3-ch01-business-economics-demand.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/09c06219-b97a-4755-b100-b25f4cdc0b86-gset-u3-c1-business-economics-demand.pdf'],
  u3c2: ['unit3-ch02-utility-production-returns.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/297da7b7-7bdf-44a5-b008-df2a85fd28bc-gset-u3-c2-utility-production-returns.pdf'],
  u3c3: ['unit3-ch03-cost-markets-pricing.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/956e13bb-5830-4d2a-ac62-b5256e959d85-gset-u3-c3-cost-markets-pricing.pdf'],

  u4c1: ['unit4-ch01-scope-sources-lease-finance.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/8e166ee6-8860-451d-9a25-a24d780452a4-gset-u4-c1-scope-sources-lease-finance.pdf'],
  u4c2: ['unit4-ch02-cost-capital-tvm-structure-leverage.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/ff6af509-6253-4b29-9633-2bbe927b4718-gset-u4-c2-cost-capital-tvm-structure-leverage.pdf'],
  u4c3: ['unit4-ch03-capital-budgeting.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/0d18842f-6fb3-4827-8768-a07b8934465c-gset-u4-c3-capital-budgeting.pdf'],
  u4c4: ['unit4-ch04-working-capital-dividend-risk-international-finance.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/8d0c3185-efb7-429e-808f-08ff768167e9-gset-u4-c4-working-capital-dividend-risk-international-finance.pdf'],

  u5c1: ['unit5-ch01-descriptive-statistics-correlation-regression.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/56077f7d-d024-4843-a363-3aa836c0243f-gset-u5-c1-descriptive-correlation-regression.pdf'],
  u5c2: ['unit5-ch02-probability-distributions.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/36f6c98f-275d-4cc9-8013-8d0dd90a4d1f-gset-u5-c2-probability-distributions.pdf'],
  u5c3: ['unit5-ch03-research-sampling-hypothesis-anova.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/740a138e-a6ce-4b33-a74b-e4a8f0c09b02-gset-u5-c3-research-sampling-hypothesis-anova.pdf'],

  u6c1: ['unit6-ch01-management-organization-delegation.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/ffbd8bb6-d71d-48aa-a76e-cb9fc70fe294-gset-u6-c1-management-organization-delegation.pdf'],
  u6c2: ['unit6-ch02-motivation-leadership-governance.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/ec5d0425-f094-40c1-a368-757bbc96f61e-gset-u6-c2-motivation-leadership-governance.pdf'],
  u6c3: ['unit6-ch03-hrm-recruitment-training.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/62876c67-1b38-4116-9d77-589a9ed57552-gset-u6-c3-hrm-recruitment-training.pdf'],
  u6c4: ['unit6-ch04-compensation-appraisal-industrial-relations.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/7fc17c96-1557-4153-b660-5b532f383730-gset-u6-c4-compensation-appraisal-industrial-relations.pdf'],
  u6c5: ['unit6-ch05-personality-group-behaviour-culture-change.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/1a3802e4-2848-4233-8fb8-360b8bad0db4-gset-u6-c5-personality-group-behaviour-culture-change.pdf'],

  u7c3: ['unit7-ch03-banking-reforms-basel-npa.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/6229345e-bb48-4515-9f11-dd548ddadbd1-gset-u7-c3-banking-reforms-basel-npa.pdf'],
  u7c4: ['unit7-ch04-financial-markets.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/d46eeadf-1b28-4eab-b956-87aaf2518d58-gset-u7-c4-financial-markets.pdf'],
  u7c5: ['unit7-ch05-dfi-nbfc-mf-regulators.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/71a2d562-8e87-4546-8f40-f96695e896c8-gset-u7-c5-dfi-nbfc-mf-regulators.pdf'],
  u7c6: ['unit7-ch06-inclusion-digital-insurance.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/bfeb58b6-b953-4ca3-a572-1e3d226b1bce-gset-u7-c6-inclusion-digital-insurance.pdf'],

  u8c1: ['unit8-ch01-core-marketing-stp-product-consumer.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/27c37ca8-fa9f-43d3-b8f2-bdbf7d874d90-unit8-ch01-core-marketing-stp-product-consumer.pdf'],
  u8c2: ['unit8-ch02-pricing-promotion-distribution-modern-marketing.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/6ad52e80-8e90-47ea-8f0c-3efe1edf4eb3-unit8-ch02-pricing-promotion-distribution-modern-marketing.pdf'],

  u10c1: ['unit10-ch01-basic-concepts-income-tax.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/c29095b0-4664-40cc-9292-7e5d8be33d14-unit10-ch01-basic-concepts-income-tax.pdf'],
  u10c2: ['unit10-ch02-exempted-agricultural-income.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/c43fb1a8-a5c1-4050-ac88-9d400faf0c2d-unit10-ch02-exempted-agricultural-income.pdf'],
  u10c3: ['unit10-ch03-heads-of-income.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/c489b5a5-70a7-48fe-9b69-2544a523d695-unit10-ch03-heads-of-income.pdf'],
  u10c4: ['unit10-ch04-clubbing-of-income.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/be8e0166-ecf0-4f7b-9cb9-f09ad0e3d1c7-unit10-ch04-clubbing-of-income.pdf'],
  u10c5: ['unit10-ch05-setoff-carry-forward-losses.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/63acf4a9-7e21-4f2e-a4a7-ad2c76b121f6-unit10-ch05-setoff-carry-forward-losses.pdf'],
  u10c6: ['unit10-ch06-deductions-gross-total-income.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/ae2be955-ac05-42a1-ab63-8ef13a0f96b9-unit10-ch06-deductions-gross-total-income.pdf'],
  u10c7: ['unit10-ch07-total-income-tax-liability.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/03abb78c-9d29-4a87-939a-bcf7e23e91e4-unit10-ch07-total-income-tax-liability.pdf'],
  u10c8: ['unit10-ch08-international-tax-transfer-pricing.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/5f123877-abaa-497f-b8ce-fdb2f59a566e-unit10-ch08-international-tax-transfer-pricing.pdf'],
  u10c9: ['unit10-ch09-corporate-tax-planning.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/897c3676-24e5-42db-99fd-c86f69a77674-unit10-ch09-corporate-tax-planning.pdf'],
  u10c10: ['unit10-ch10-tds-tcs-advance-tax-efiling.pdf','https://smit-sir-ccsp-assets.floot.app/_cdn/static/cca1be57-9255-4e0d-9415-37c146ae854c-unit10-ch10-tds-tcs-advance-tax-efiling.pdf'],
};

async function serveGsetPdf(req, res) {
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
    res.setHeader('Content-Disposition', `${req.query?.download === '1' ? 'attachment' : 'inline'}; filename="${item[0]}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    res.setHeader('X-Robots-Tag', 'noindex');
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('gset-pdf', req.query?.gset, error?.message || error);
    return res.status(503).json({ error: 'Unable to load this PDF right now.' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET' && req.query?.gset) return serveGsetPdf(req, res);

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

    const concepts = [...pack.levels.Easy, ...pack.levels.Moderate].map((item, index) => ({ title: `Concept ${index + 1}`, prompt: item.q, explanation: item.explanation }));
    const worked = [...pack.levels.Hard, ...pack.levels.Extreme].map((item, index) => ({ level: index < 10 ? 'Hard' : 'Extreme', question: item.q, options: item.options, answer: item.answer, explanation: item.explanation }));
    return res.status(200).json({ id: pack.id, title: pack.title, classLevel: pack.classLevel, stream: pack.stream, source: pack.source, concepts, worked, productId });
  } catch (error) {
    console.error('premium-study', error?.message || error);
    return res.status(503).json({ error: 'Unable to load this guide. Please try again.' });
  }
}
