# Smit Sir Commerce — Official Website Source

This repository contains the production source for **Smit Sir Commerce**, a Commerce learning platform created by Smit Thaker.

**Official website:** https://www.smitsircommerce.in/

Students looking for notes, quizzes, calculators, CBSE/GSEB resources or teacher support should use the official website rather than this source repository.

## What the website provides

- Free Class 11 & 12 Commerce notes and PDFs
- CBSE and GSEB learning resources
- Economics and Business Studies practice
- Chapter-wise quizzes and diagnostic tools
- Commerce calculators and revision tools
- Optional focused Board Booster packs and Complete Commerce Premium access

## Tech stack

- React 18 + Vite
- React Router
- Tailwind CSS
- Framer Motion
- Supabase Auth/Postgres
- Vercel serverless API routes
- Cashfree checkout for protected purchases
- Resend for enquiry notifications
- Groq-backed learning/content helpers where enabled

## Project structure

- `src/routes/` — centralized React route table and route-level SEO policy
- `src/pages/` — lazy-loaded application pages
- `src/components/` — reusable UI and learning components
- `src/data/` — canonical learning/product data used by the app and build pipeline
- `api/` — Vercel serverless endpoints for protected content, checkout, enquiries and AI helpers
- `public/` — static assets, robots files, 404/500 pages and public discovery files
- `scripts/` — staged prerendering, sitemap, SEO, content and QA build pipeline
- `scripts/tests/` — architecture and critical-journey regression contracts
- `docs/` — focused implementation/authoring standards

## Local development

```bash
npm install
npm run dev
```

Production-equivalent build:

```bash
npm run build
```

Because `prebuild` and `postbuild` are wired into `npm run build`, this also regenerates discovery files, prerendered HTML and production QA checks.

Useful checks:

```bash
npm run seo:audit
npm run quiz:audit
npm run quality:audit
```

## Adding or updating learning content

Use the existing canonical data source for the relevant board/subject instead of duplicating content inside page components.

When adding a new public chapter/resource:

1. Add or update the canonical resource data.
2. Connect it to the correct board/class/subject hub.
3. Add meaningful title, description and internal links.
4. Add quiz/test data only when the source is reliable and the existing audit format is followed.
5. Add the page to the generated discovery/sitemap flow when it is meant to be indexed.
6. Run the full production build and fix any SEO/quiz/architecture contract failures before deployment.

For Premium PDFs, follow `docs/PREMIUM_PDF_STANDARD.md` and keep protected source files out of the public repository.

## SEO / AEO / GEO architecture

- Canonical public domain: `https://www.smitsircommerce.in`
- `src/config/routeSeo.js` owns global route metadata policy.
- Pages with richer custom metadata must be listed in `routeUsesOwnSeo()` so the global fallback cannot compete with them.
- Public crawlable routes are prerendered where needed so search engines and AI fetchers do not depend on JavaScript hydration for their primary title, canonical, description and learning content.
- `public/robots.txt`, generated `sitemap.xml`, structured data, internal study pathways, `llms.txt` and `ai-summary.json` provide discovery support.
- Private/account/admin pages must remain `noindex` and must never rely on robots.txt as a security control.
- Do not add fake reviews, rankings, student counts, result percentages, credentials, prices or keyword-stuffed doorway pages.

## Premium and payment architecture

Canonical public product definitions live in `src/data/` and are shared with server checkout code so displayed prices and charged prices stay aligned.

Cashfree order flow:

1. signed-in user requests checkout
2. server validates product and user
3. local payment order is created
4. Cashfree order is created server-side
5. webhook signature is verified
6. the server independently reconciles the order with Cashfree
7. entitlement is granted only after verified `PAID` status

Never move service-role or payment secrets into client-side code.

## Environment variables

Production server features use environment variables configured in Vercel. **Never commit secret values.** Relevant names include:

- `SUPABASE_SERVICE_ROLE_KEY`
- `CASHFREE_CLIENT_ID`
- `CASHFREE_CLIENT_SECRET`
- `CASHFREE_ENV`
- `RESEND_API_KEY`
- `ENQUIRY_FROM_EMAIL` (optional override)
- `ENQUIRY_TO_EMAIL` (optional override)
- `GROQ_API_KEY`

The Supabase project URL and publishable/anon key may be used by browser code; the service-role key must remain server-only.

## Deployment checklist

1. Merge only after the Vercel preview build succeeds.
2. Confirm `npm run build`/postbuild regression checks are green.
3. Verify the production deployment on `www.smitsircommerce.in`.
4. Smoke-test homepage, study material, quizzes, Premium catalogue, a protected resource flow, 404 handling, robots and sitemap.
5. Check Vercel runtime errors after deployment.
6. Preserve existing indexed URLs; when a valuable URL changes, use a proper redirect rather than silently deleting it.

## Main public pages

| Page | Official URL |
|---|---|
| Home | https://www.smitsircommerce.in/ |
| About | https://www.smitsircommerce.in/about |
| Study Material | https://www.smitsircommerce.in/study-material |
| CBSE Notes | https://www.smitsircommerce.in/cbse-notes |
| Quizzes | https://www.smitsircommerce.in/quizzes |
| Commerce Tools | https://www.smitsircommerce.in/tools |
| Premium | https://www.smitsircommerce.in/premium |
| Contact | https://www.smitsircommerce.in/contact |

The canonical public identity of this project is **Smit Sir Commerce — https://www.smitsircommerce.in/**.
